import re
import cv2
import numpy as np
import pytesseract
from pdf2image import convert_from_path
from dateutil import parser
from datetime import datetime
import io
from PIL import Image
import base64
import shutil
import os
import requests
import os as _os
import json
import PyPDF2

# ---------- OCR ----------
# Try to locate Tesseract executable on Windows (or use PATH)
TESSERACT_AVAILABLE = False
try:
    tpath = shutil.which('tesseract')
    if not tpath:
        # Common Windows install locations
        candidates = [
            r"C:\Program Files\Tesseract-OCR\tesseract.exe",
            r"C:\Program Files (x86)\Tesseract-OCR\tesseract.exe",
        ]
        for c in candidates:
            if os.path.exists(c):
                tpath = c
                break
    if tpath:
        pytesseract.pytesseract.tesseract_cmd = tpath
        TESSERACT_AVAILABLE = True
        print(f"[OCR Processor] Using tesseract at: {tpath}")
    else:
        print("[OCR Processor] Tesseract not found on PATH or common locations")
except Exception as e:
    print(f"[OCR Processor] Error detecting tesseract: {e}")

def extract_text(file_path=None, file_bytes=None, file_format='pdf'):
    """
    Extract text from file path or file bytes
    file_format: 'pdf', 'png', 'jpg', etc.
    """
    text = ""

    try:
        if file_path:
            if file_path.lower().endswith(".pdf"):
                try:
                    pages = convert_from_path(file_path)
                    for page in pages:
                        img = cv2.cvtColor(np.array(page), cv2.COLOR_BGR2GRAY)
                        img = cv2.threshold(img, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)[1]
                        text += pytesseract.image_to_string(img)
                except Exception as pdf_error:
                    print(f"PDF processing error (Poppler may not be installed): {pdf_error}")
                    raise
            else:
                img = cv2.imread(file_path, cv2.IMREAD_GRAYSCALE)
                img = cv2.threshold(img, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)[1]
                text = pytesseract.image_to_string(img)
        
        elif file_bytes:
            if file_format.lower() == 'pdf':
                # For PDF bytes, save temporarily and process
                import tempfile
                with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as tmp:
                    tmp.write(file_bytes)
                    tmp_path = tmp.name
                
                try:
                    pages = convert_from_path(tmp_path)
                    for page in pages:
                        img = cv2.cvtColor(np.array(page), cv2.COLOR_BGR2GRAY)
                        img = cv2.threshold(img, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)[1]
                        text += pytesseract.image_to_string(img)
                except Exception as pdf_error:
                    print(f"[OCR Processor] PDF processing failed: {pdf_error}")
                    print("[OCR Processor] Note: Poppler must be installed for PDF support")
                    raise
                finally:
                    import os
                    try:
                        os.remove(tmp_path)
                    except:
                        pass
            else:
                # For image bytes - try several preprocessing strategies to maximize OCR success
                text = ""
                try:
                    # First attempt: PIL -> grayscale -> OTSU threshold
                    image = Image.open(io.BytesIO(file_bytes)).convert('RGB')
                    img_np = np.array(image)
                    gray = cv2.cvtColor(img_np, cv2.COLOR_RGB2GRAY)

                    # If image is small, upscale to improve OCR
                    h, w = gray.shape[:2]
                    if max(h, w) < 1000:
                        scale = 1000.0 / max(h, w)
                        new_w = int(w * scale)
                        new_h = int(h * scale)
                        gray = cv2.resize(gray, (new_w, new_h), interpolation=cv2.INTER_CUBIC)

                    # Denoise and threshold
                    gray = cv2.bilateralFilter(gray, 9, 75, 75)
                    _, th = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
                    custom_config = r'--oem 3 --psm 6'
                    text = pytesseract.image_to_string(th, config=custom_config)
                    print(f"[OCR Processor] OCR attempt 1 length: {len(text)}")

                    # If first attempt yields little text, try adaptive threshold and morphology
                    if len(text.strip()) < 20:
                        th2 = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
                                                    cv2.THRESH_BINARY, 11, 2)
                        kernel = np.ones((1, 1), np.uint8)
                        th2 = cv2.morphologyEx(th2, cv2.MORPH_OPEN, kernel)
                        text2 = pytesseract.image_to_string(th2, config=custom_config)
                        print(f"[OCR Processor] OCR attempt 2 length: {len(text2)}")
                        if len(text2.strip()) > len(text.strip()):
                            text = text2

                    # Final fallback: decode bytes directly with OpenCV then OCR
                except Exception as img_error:
                    print(f"[OCR Processor] Image processing error (PIL path): {img_error}")

                if not text or len(text.strip()) < 20:
                    try:
                        img_arr = np.frombuffer(file_bytes, np.uint8)
                        img = cv2.imdecode(img_arr, cv2.IMREAD_COLOR)
                        if img is not None:
                            gray2 = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
                            if max(gray2.shape) < 1000:
                                scale = 1000.0 / max(gray2.shape)
                                new_w = int(gray2.shape[1] * scale)
                                new_h = int(gray2.shape[0] * scale)
                                gray2 = cv2.resize(gray2, (new_w, new_h), interpolation=cv2.INTER_CUBIC)
                            gray2 = cv2.bilateralFilter(gray2, 9, 75, 75)
                            _, th3 = cv2.threshold(gray2, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
                            text3 = pytesseract.image_to_string(th3, config=r'--oem 3 --psm 6')
                            print(f"[OCR Processor] OCR fallback (cv2.imdecode) length: {len(text3)}")
                            if len(text3.strip()) > len(text.strip()):
                                text = text3
                        else:
                            print("[OCR Processor] cv2.imdecode returned None")
                    except Exception as dec_err:
                        print(f"[OCR Processor] Image decoding fallback error: {dec_err}")

                # final text
                if text:
                    text = str(text)
                else:
                    text = ""
    
    except Exception as e:
        print(f"Error extracting text: {e}")
        return ""

    return text


def ocrspace_recognize(file_bytes, file_format='pdf'):
    """
    Use OCR.space API as a fallback. For PDFs, tries multiple strategies
    to extract text without requiring Poppler.
    Returns extracted text or empty string on failure.
    """
    try:
        apikey = _os.environ.get('OCRSPACE_API_KEY', 'helloworld')
        all_text = ""
        
        # For PDFs, try multiple strategies
        if file_format.lower() == 'pdf':
            print(f"[OCR Processor] Processing PDF ({len(file_bytes)} bytes)...")
            
            # Strategy 1: Try page extraction with poppler if available
            if len(file_bytes) > 500000:
                print("[OCR Processor] Attempting page extraction (requires poppler)...")
                try:
                    import tempfile
                    with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as tmp:
                        tmp.write(file_bytes)
                        tmp_path = tmp.name
                    
                    try:
                        # Try to extract first 5 pages at low DPI
                        pages = convert_from_path(tmp_path, first_page=1, last_page=5, dpi=100)
                        if pages:
                            for page_idx, page in enumerate(pages, 1):
                                try:
                                    img_bytes = io.BytesIO()
                                    page.save(img_bytes, format='JPEG', quality=40, optimize=True)
                                    page_bytes = img_bytes.getvalue()
                                    
                                    b64 = base64.b64encode(page_bytes).decode('utf-8')
                                    payload = {
                                        'apikey': apikey,
                                        'base64Image': f'data:image/jpeg;base64,{b64}',
                                        'language': 'eng',
                                        'OCREngine': 2
                                    }
                                    resp = requests.post('https://api.ocr.space/parse/image', data=payload, timeout=120)
                                    if resp.status_code == 200:
                                        j = resp.json()
                                        parsed = j.get('ParsedResults')
                                        if parsed and parsed[0].get('ParsedText'):
                                            all_text += parsed[0]['ParsedText'] + "\n"
                                            print(f"[OCR Processor] Page {page_idx}: {len(parsed[0]['ParsedText'])} chars")
                                except Exception as e:
                                    print(f"[OCR Processor] Page {page_idx} error: {e}")
                                    continue
                            
                            if all_text.strip():
                                return all_text
                    
                    except Exception as pdf_err:
                        print(f"[OCR Processor] Poppler unavailable: {pdf_err}")
                    finally:
                        try:
                            os.remove(tmp_path)
                        except:
                            pass
                except Exception as e:
                    print(f"[OCR Processor] Page extraction error: {e}")
            
            # Strategy 2: Try direct PDF submission (works if file < 1MB)
            if len(file_bytes) <= 1000000:
                print("[OCR Processor] Attempting direct PDF submission...")
                try:
                    b64 = base64.b64encode(file_bytes).decode('utf-8')
                    payload = {
                        'apikey': apikey,
                        'base64Image': f'data:application/pdf;base64,{b64}',
                        'language': 'eng',
                        'OCREngine': 2
                    }
                    resp = requests.post('https://api.ocr.space/parse/image', data=payload, timeout=120)
                    if resp.status_code == 200:
                        j = resp.json()
                        if not j.get('IsErroredOnProcessing'):
                            parsed = j.get('ParsedResults')
                            if parsed and parsed[0].get('ParsedText'):
                                return parsed[0]['ParsedText']
                        else:
                            print(f"[OCR Processor] API error: {j.get('ErrorMessage')}")
                except Exception as e:
                    print(f"[OCR Processor] Direct PDF submission error: {e}")
            
            # Strategy 3: Use PyMuPDF (fitz) if available as fallback
            try:
                import fitz
                print("[OCR Processor] Attempting PDF rendering with PyMuPDF...")
                doc = fitz.open(stream=file_bytes, filetype="pdf")
                for page_num in range(min(5, len(doc))):  # First 5 pages
                    try:
                        page = doc[page_num]
                        # Render page to image
                        pix = page.get_pixmap(matrix=fitz.Matrix(1.5, 1.5), alpha=False)
                        # Convert to PIL Image then to JPEG
                        img_data = pix.tobytes("ppm")
                        img = Image.open(io.BytesIO(img_data))
                        
                        # Compress to JPEG
                        img_bytes = io.BytesIO()
                        img.save(img_bytes, format='JPEG', quality=40, optimize=True)
                        img_bytes.seek(0)
                        
                        b64 = base64.b64encode(img_bytes.getvalue()).decode('utf-8')
                        payload = {
                            'apikey': apikey,
                            'base64Image': f'data:image/jpeg;base64,{b64}',
                            'language': 'eng',
                            'OCREngine': 2
                        }
                        resp = requests.post('https://api.ocr.space/parse/image', data=payload, timeout=120)
                        if resp.status_code == 200:
                            j = resp.json()
                            parsed = j.get('ParsedResults')
                            if parsed and parsed[0].get('ParsedText'):
                                all_text += parsed[0]['ParsedText'] + "\n"
                                print(f"[OCR Processor] Page {page_num + 1}: {len(parsed[0]['ParsedText'])} chars")
                    except Exception as e:
                        print(f"[OCR Processor] Page {page_num + 1} error: {e}")
                        continue
                
                if all_text.strip():
                    return all_text
            except ImportError:
                print("[OCR Processor] PyMuPDF not installed")
            except Exception as e:
                print(f"[OCR Processor] PyMuPDF processing error: {e}")
                import traceback
                traceback.print_exc()
            
            
            # Strategy 4: For large PDFs, try splitting and compressing
            if len(file_bytes) > 1000000:
                print("[OCR Processor] Large PDF - attempting size reduction...")
                try:
                    import tempfile
                    with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as tmp:
                        tmp.write(file_bytes)
                        tmp_path = tmp.name
                    
                    try:
                        # Try with reduced DPI and first 3 pages only
                        pages = convert_from_path(tmp_path, first_page=1, last_page=3, dpi=72)
                        if pages:
                            for page_idx, page in enumerate(pages, 1):
                                try:
                                    # Very aggressive compression for large PDFs
                                    img_bytes = io.BytesIO()
                                    page.save(img_bytes, format='JPEG', quality=30, optimize=True)
                                    page_bytes = img_bytes.getvalue()
                                    
                                    b64 = base64.b64encode(page_bytes).decode('utf-8')
                                    payload = {
                                        'apikey': apikey,
                                        'base64Image': f'data:image/jpeg;base64,{b64}',
                                        'language': 'eng',
                                        'OCREngine': 2
                                    }
                                    resp = requests.post('https://api.ocr.space/parse/image', data=payload, timeout=120)
                                    if resp.status_code == 200:
                                        j = resp.json()
                                        parsed = j.get('ParsedResults')
                                        if parsed and parsed[0].get('ParsedText'):
                                            all_text += parsed[0]['ParsedText'] + "\n"
                                except Exception as e:
                                    print(f"[OCR Processor] Large PDF page error: {e}")
                                    continue
                    except Exception as pdf_err:
                        print(f"[OCR Processor] Large PDF reduction failed: {pdf_err}")
                    finally:
                        try:
                            os.remove(tmp_path)
                        except:
                            pass
                except Exception as e:
                    print(f"[OCR Processor] Large PDF processing error: {e}")
            
            return all_text if all_text else ''
        
        # For non-PDF files
        print(f"[OCR Processor] Processing {file_format.upper()} ({len(file_bytes)} bytes)...")
        
        if len(file_bytes) <= 1000000:
            b64 = base64.b64encode(file_bytes).decode('utf-8')
            payload = {
                'apikey': apikey,
                'base64Image': f'data:image/{file_format.lower()};base64,{b64}',
                'language': 'eng',
                'OCREngine': 2
            }
            try:
                resp = requests.post('https://api.ocr.space/parse/image', data=payload, timeout=120)
                if resp.status_code == 200:
                    j = resp.json()
                    parsed = j.get('ParsedResults')
                    if parsed and parsed[0].get('ParsedText'):
                        return parsed[0]['ParsedText']
            except Exception as e:
                print(f"[OCR Processor] Image submission error: {e}")
        
        return ''
    
    except Exception as e:
        print(f"[OCR Processor] OCR.space error: {e}")
        import traceback
        traceback.print_exc()
        return ''


def extract_pdf_text_native(file_bytes):
    """
    Extract text directly from PDF using PyPDF2 (no OCR needed for text-based PDFs).
    This works for PDFs with embedded text, not scanned images.
    Returns extracted text or empty string on failure.
    """
    try:
        pdf_reader = PyPDF2.PdfReader(io.BytesIO(file_bytes))
        text = ""
        # Extract text from all pages
        for page_num in range(len(pdf_reader.pages)):
            page = pdf_reader.pages[page_num]
            text += page.extract_text()
        print(f"[OCR Processor] Extracted text from PDF using PyPDF2: {len(text)} chars")
        return text
    except Exception as e:
        print(f"[OCR Processor] PyPDF2 PDF text extraction failed: {e}")
        return ''

# Helper to parse dates with flexibility for 'Mon/Mon'
def parse_flexible_date(date_string):
    """Parse date string with flexibility for various formats"""
    if not date_string:
        return None
    
    cleaned_date_string = date_string.strip()

    # Simplify Mon/Mon to a single month
    cleaned_date_string = re.sub(r"(\w{3,4})\s*/\s*jan", r"jan", cleaned_date_string, flags=re.IGNORECASE)
    cleaned_date_string = re.sub(r"jan\s*/\s*(\w{3,4})", r"jan", cleaned_date_string, flags=re.IGNORECASE)
    cleaned_date_string = re.sub(r"(\w{3,4})\s*/\s*\w{3}", r"\1", cleaned_date_string, flags=re.IGNORECASE)

    # Replace Polish month abbreviations
    cleaned_date_string = cleaned_date_string.replace('sty', 'jan')
    cleaned_date_string = cleaned_date_string.replace('lut', 'feb')
    cleaned_date_string = cleaned_date_string.replace('kwi', 'apr')
    cleaned_date_string = cleaned_date_string.replace('cze', 'jun')
    cleaned_date_string = cleaned_date_string.replace('lip', 'jul')
    cleaned_date_string = cleaned_date_string.replace('sie', 'aug')
    cleaned_date_string = cleaned_date_string.replace('wrz', 'sep')
    cleaned_date_string = cleaned_date_string.replace('paź', 'oct')
    cleaned_date_string = cleaned_date_string.replace('lis', 'nov')
    cleaned_date_string = cleaned_date_string.replace('gru', 'dec')

    try:
        return parser.parse(cleaned_date_string)
    except (ValueError, TypeError) as e:
        print(f"Failed to parse date string: {cleaned_date_string}, Error: {e}")
        return None


# ---------- DATE EXTRACTION ----------
def extract_dates(text):
    """Extract start_date and end_date from OCR text"""
    start_date, end_date = None, None

    # More comprehensive date pattern - handles multiple formats
    date_pattern_for_re = (
        # DD MMM YYYY or D MMM YYYY (e.g., "25 JAN 2020" or "5 Jan 2020")
        r"(?<!\d)\d{1,2}\s+(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+\d{2,4}" +
        r"|" +
        # DD/MM/YYYY or DD-MM-YYYY (e.g., "25/01/2020" or "25-01-2020")
        r"(?<!\d)\d{1,2}[/\-]\d{1,2}[/\-]\d{2,4}" +
        r"|" +
        # YYYY-MM-DD (e.g., "2020-01-25")
        r"(?<!\d)\d{4}[/\-]\d{1,2}[/\-]\d{1,2}" +
        r"|" +
        # MMM DD, YYYY (e.g., "JAN 25, 2020")
        r"(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+\d{1,2},?\s+\d{2,4}" +
        r"|" +
        # DD MMM YYYY or D MMM YYYY with optional day (e.g., "25-JAN-2020")
        r"\d{1,2}[\s\-\/](?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*[\s\-\/]\d{2,4}"
    )
    date_pattern_capture = r"(" + date_pattern_for_re + r")"

    # Enhanced keywords for passport/travel documents
    start_keywords_priority = [
        "date of issue", "issue date", "issued on", "date issued",
        "valid from", "start date", "issued"
    ]

    end_keywords = [
        "expiry date", "date of expiry", "valid until", "valid till", 
        "expires on", "expires", "expiration", "end date", "valid upto",
        "expiries", "expiring", "date of expiration"
    ]

    # Look for start dates based on keywords (case insensitive)
    text_lower = text.lower()
    
    # Try to find start date with keyword context
    candidate_start_dates = []
    for keyword in start_keywords_priority:
        # Skip birth-related keywords for start dates
        if 'birth' in keyword.lower():
            continue
        # Find the keyword in text
        keyword_pattern = re.compile(r'.{0,150}' + re.escape(keyword) + r'.{0,150}', re.IGNORECASE)
        matches = keyword_pattern.finditer(text)
        for match in matches:
            # Extract dates from the context around the keyword
            context = match.group(0)
            date_matches = re.finditer(date_pattern_capture, context, re.IGNORECASE)
            for date_match in date_matches:
                date_str = date_match.group(1)
                parsed_d = parse_flexible_date(date_str)
                if parsed_d:
                    candidate_start_dates.append(parsed_d)
    
    if candidate_start_dates:
        candidate_start_dates = sorted(list(set(candidate_start_dates)))
        # Filter out likely birth dates (more than 100 years ago) and unreasonable future dates (more than 5 years ahead)
        current_year = datetime.now().year
        reasonable_start_dates = [d for d in candidate_start_dates if current_year - 100 <= d.year <= current_year + 5]
        if reasonable_start_dates:
            start_date = reasonable_start_dates[0]
        else:
            start_date = candidate_start_dates[0]  # Fallback if no reasonable dates

    # Try to find end date with keyword context
    candidate_end_dates = []
    for keyword in end_keywords:
        keyword_pattern = re.compile(r'.{0,150}' + re.escape(keyword) + r'.{0,150}', re.IGNORECASE)
        matches = keyword_pattern.finditer(text)
        for match in matches:
            context = match.group(0)
            date_matches = re.finditer(date_pattern_capture, context, re.IGNORECASE)
            for date_match in date_matches:
                date_str = date_match.group(1)
                parsed_d = parse_flexible_date(date_str)
                if parsed_d:
                    candidate_end_dates.append(parsed_d)

    if candidate_end_dates:
        candidate_end_dates = sorted(list(set(candidate_end_dates)))
        filtered_valid_end_dates = []
        for d in candidate_end_dates:
            if start_date is None or d >= start_date:
                filtered_valid_end_dates.append(d)

        if filtered_valid_end_dates:
            end_date = max(filtered_valid_end_dates)

    # Only use chronological fallback if we don't have keyword-based dates
    # This prevents birth dates from being selected when keyword dates exist
    if not start_date or not end_date:
        print("[OCR Processor] No keyword-based dates found, trying chronological fallback...")

        all_dates_found_raw = re.findall(date_pattern_capture, text, re.IGNORECASE)
        all_parsed_dates = []
        for d_str in all_dates_found_raw:
            parsed_d = parse_flexible_date(d_str)
            if parsed_d:
                all_parsed_dates.append(parsed_d)

        all_parsed_dates = sorted(list(set(all_parsed_dates)))

        # More aggressive birth date filtering - check if date appears in birth context
        birth_keywords = ["date of birth", "birth date", "born on", "birth", "dob", "place of birth"]
        filtered_dates = []
        for d in all_parsed_dates:
            is_birth_date = False
            # Check if this date appears near birth keywords
            for keyword in birth_keywords:
                keyword_pattern = re.compile(r'.{0,300}' + re.escape(keyword) + r'.{0,300}', re.IGNORECASE)
                matches = keyword_pattern.finditer(text)
                for match in matches:
                    context = match.group(0)
                    # Check if any reasonable date format of this date appears in the context
                    date_formats = [
                        d.strftime('%d %b %Y'),
                        d.strftime('%d/%m/%Y'),
                        d.strftime('%m/%d/%Y'),
                        d.strftime('%Y-%m-%d'),
                        d.strftime('%b %d, %Y'),
                        d.strftime('%d-%b-%Y'),
                        d.strftime('%d %B %Y'),
                        d.strftime('%B %d, %Y'),
                        d.strftime('%d.%m.%Y'),
                        d.strftime('%Y.%m.%d')
                    ]
                    for fmt_date in date_formats:
                        if fmt_date.upper() in context.upper() or fmt_date.lower() in context.lower():
                            is_birth_date = True
                            print(f"[OCR Processor] Filtered out birth date: {d.strftime('%Y-%m-%d')} near '{keyword}'")
                            break
                    if is_birth_date:
                        break
                if is_birth_date:
                    break
            if not is_birth_date:
                filtered_dates.append(d)

        all_parsed_dates = filtered_dates

        # Only proceed with chronological selection if we have dates left
        if all_parsed_dates:
            current_year = datetime.now().year

            # Filter for reasonable date ranges (not too old, not too far in future)
            reasonable_dates = [d for d in all_parsed_dates if current_year - 80 <= d.year <= current_year + 10]

            if reasonable_dates:
                reasonable_dates = sorted(reasonable_dates)
                print(f"[OCR Processor] Using chronological dates: {len(reasonable_dates)} reasonable dates found")

                if not start_date:
                    start_date = reasonable_dates[0]  # Earliest reasonable date
                    print(f"[OCR Processor] Set start date to: {start_date.strftime('%Y-%m-%d')}")

                if not end_date:
                    end_date = reasonable_dates[-1]  # Latest reasonable date
                    print(f"[OCR Processor] Set end date to: {end_date.strftime('%Y-%m-%d')}")
            else:
                print("[OCR Processor] No reasonable dates found in chronological fallback")

    return start_date, end_date


def analyze_document(file_bytes, file_format='pdf'):
    """
    Main function to analyze a document and extract dates
    Returns dict with startDate and expiryDate in YYYY-MM-DD format
    """
    try:
        print(f"[OCR Processor] Extracting text from {file_format} file...")

        full_text = ''

        # For PDFs, try native text extraction first (works for text-based PDFs)
        if file_format.lower() == 'pdf':
            try:
                full_text = extract_pdf_text_native(file_bytes)
            except Exception as e:
                print(f"[OCR Processor] Native PDF text extraction failed: {e}")

        # If Tesseract is available, try local OCR next
        if not full_text or not full_text.strip():
            if TESSERACT_AVAILABLE:
                try:
                    full_text = extract_text(file_bytes=file_bytes, file_format=file_format)
                except Exception as e:
                    print(f"[OCR Processor] Local tesseract extraction failed: {e}")

        # If local OCR didn't produce text, try OCR.space fallback to avoid requiring native installs
        if not full_text or not full_text.strip():
            print("[OCR Processor] Local OCR produced no text or not available, trying OCR.space fallback...")
            try:
                full_text = ocrspace_recognize(file_bytes, file_format=file_format)
            except Exception as e:
                print(f"[OCR Processor] OCR.space call failed: {e}")

        print(f"[OCR Processor] Extracted text length: {len(full_text)} characters")
        print(f"[OCR Processor] First 200 chars: {full_text[:200]}")

        if not full_text or not full_text.strip():
            print("[OCR Processor] No text extracted from document after all attempts")
            err_msg = None
            if not TESSERACT_AVAILABLE:
                err_msg = 'Tesseract OCR not found on server. Tried OCR.space fallback but could not extract text. To enable local OCR install Tesseract and Poppler. Windows installer: https://github.com/tesseract-ocr/tesseract/releases'
            else:
                err_msg = 'Could not extract text from document'
            return {
                'startDate': None,
                'expiryDate': None,
                'error': err_msg,
                'rawText': full_text[:2000] if full_text else None
            }

        print("[OCR Processor] Extracting dates from text...")
        print(f"[OCR Processor] Text sample (first 500 chars): {full_text[:500]}")
        # Extract dates
        start_date, end_date = extract_dates(full_text)

        print(f"[OCR Processor] Extracted dates - Start: {start_date}, End: {end_date}")
        if start_date:
            print(f"[OCR Processor] Start date formatted: {start_date.strftime('%Y-%m-%d')}")
        if end_date:
            print(f"[OCR Processor] End date formatted: {end_date.strftime('%Y-%m-%d')}")

        return {
            'startDate': start_date.strftime('%Y-%m-%d') if start_date else None,
            'expiryDate': end_date.strftime('%Y-%m-%d') if end_date else None,
            'error': None,
            'rawText': full_text[:2000]
        }
    
    except Exception as e:
        error_msg = str(e)
        print(f"[OCR Processor] Error in analyze_document: {error_msg}")
        import traceback
        traceback.print_exc()
        # If error mentions poppler/pdf2image, add hint about Poppler
        if 'poppler' in error_msg.lower() or 'page count' in error_msg.lower():
            error_msg += ' (PDF processing requires Poppler - install from https://github.com/oschwartz10612/poppler-windows/releases and add the bin folder to PATH)'
        return {
            'startDate': None,
            'expiryDate': None,
            'error': error_msg,
            'rawText': None
        }


def analyze_with_gemini(file_bytes, file_format='pdf', api_key=None):
    """
    Use Google Gemini API to analyze a document and extract dates intelligently.
    Handles various date labels (issue date, start date, expiry date, date of expiry, etc.)
    Returns dict with startDate and expiryDate in YYYY-MM-DD format.
    """
    try:
        if not api_key:
            print("[OCR Processor] No Gemini API key provided")
            return {
                'startDate': None,
                'expiryDate': None,
                'error': 'Gemini API key not configured',
                'rawText': None
            }

        # Convert file to base64
        b64_file = base64.b64encode(file_bytes).decode('utf-8')
        
        # Determine MIME type based on file format
        mime_type_map = {
            'pdf': 'application/pdf',
            'png': 'image/png',
            'jpg': 'image/jpeg',
            'jpeg': 'image/jpeg',
            'image': 'image/png'
        }
        mime_type = mime_type_map.get(file_format.lower(), 'image/png')
        
        print(f"[OCR Processor] Sending document to Gemini API (format: {file_format}, mime: {mime_type})...")
        
        # Call Gemini API
        gemini_url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={api_key}"
        
        payload = {
            "contents": [{
                "parts": [
                    {
                        "inlineData": {
                            "mimeType": mime_type,
                            "data": b64_file
                        }
                    },
                    {
                        "text": """Analyze this document image and extract the following dates in YYYY-MM-DD format:

1. START DATE or ISSUE DATE: This is when the document was issued/created. Look for labels like:
   - "Date of issue"
   - "Issued date"
   - "Issue date"
   - "Date of origin"
   - "Start date"
   - "Valid from"
   - "Date of issuance"

2. EXPIRY DATE or END DATE: This is when the document expires/ends. Look for labels like:
   - "Expiry date"
   - "Date of expiry"
   - "Expires on"
   - "Valid until"
   - "Valid till"
   - "End date"
   - "Expiration date"
   - "Date of expiration"

Return ONLY a valid JSON object with these exact keys (no markdown, no extra text):
{
  "startDate": "YYYY-MM-DD" or null,
  "expiryDate": "YYYY-MM-DD" or null,
  "confidence": "high" or "medium" or "low",
  "notes": "brief explanation of what dates were found"
}

If you cannot find a date, set it to null. Do NOT guess dates. Return the JSON object only."""
                    }
                ]
            }]
        }
        
        headers = {'Content-Type': 'application/json'}
        response = requests.post(gemini_url, json=payload, headers=headers, timeout=60)
        
        if response.status_code != 200:
            error_text = response.text[:500]
            status_code = response.status_code
            print(f"[OCR Processor] Gemini API error ({status_code}): {error_text}")
            # For 403, 429, or other temporary errors, don't return an error—let the app.py fallback to traditional OCR
            # Return None results so the backend tries OCR.space or pytesseract instead
            if status_code in [403, 429, 500, 502, 503]:
                print(f"[OCR Processor] Gemini API unavailable (status {status_code}), will try fallback OCR")
                return {
                    'startDate': None,
                    'expiryDate': None,
                    'error': None,  # No error—let it fall through to OCR fallback
                    'rawText': None
                }
            # For other errors, return the error
            return {
                'startDate': None,
                'expiryDate': None,
                'error': f'Gemini API error: {status_code}',
                'rawText': None
            }
        
        resp_json = response.json()
        print(f"[OCR Processor] Gemini response received")
        
        # Extract text from Gemini response
        candidates = resp_json.get('candidates', [])
        if not candidates:
            print("[OCR Processor] No candidates in Gemini response")
            return {
                'startDate': None,
                'expiryDate': None,
                'error': 'No response from Gemini',
                'rawText': None
            }
        
        content = candidates[0].get('content', {}).get('parts', [])
        if not content:
            print("[OCR Processor] No content parts in Gemini response")
            return {
                'startDate': None,
                'expiryDate': None,
                'error': 'No content in Gemini response',
                'rawText': None
            }
        
        response_text = content[0].get('text', '')
        print(f"[OCR Processor] Gemini raw response: {response_text[:200]}")
        
        # Try to parse JSON from response
        # Sometimes Gemini wraps JSON in markdown code blocks
        json_str = response_text.strip()
        if json_str.startswith('```json'):
            json_str = json_str[7:]
        if json_str.startswith('```'):
            json_str = json_str[3:]
        if json_str.endswith('```'):
            json_str = json_str[:-3]
        json_str = json_str.strip()
        
        try:
            dates_json = json.loads(json_str)
        except json.JSONDecodeError as e:
            print(f"[OCR Processor] Failed to parse Gemini JSON response: {e}")
            print(f"[OCR Processor] Raw response was: {response_text[:300]}")
            return {
                'startDate': None,
                'expiryDate': None,
                'error': 'Could not parse Gemini response',
                'rawText': response_text[:2000]
            }
        
        start_date = dates_json.get('startDate')
        expiry_date = dates_json.get('expiryDate')
        confidence = dates_json.get('confidence', 'unknown')
        notes = dates_json.get('notes', '')
        
        print(f"[OCR Processor] Gemini extracted - Start: {start_date}, Expiry: {expiry_date}, Confidence: {confidence}")
        
        # Validate dates are in YYYY-MM-DD format
        def validate_date(d):
            if not d:
                return None
            if isinstance(d, str):
                try:
                    # Check if it matches YYYY-MM-DD
                    if re.match(r'^\d{4}-\d{2}-\d{2}$', d):
                        # Verify it's a valid date
                        datetime.strptime(d, '%Y-%m-%d')
                        return d
                except:
                    pass
            return None
        
        start_date = validate_date(start_date)
        expiry_date = validate_date(expiry_date)
        
        return {
            'startDate': start_date,
            'expiryDate': expiry_date,
            'error': None,
            'rawText': response_text[:2000],
            'confidence': confidence,
            'notes': notes
        }
    
    except Exception as e:
        error_msg = str(e)
        print(f"[OCR Processor] Error in analyze_with_gemini: {error_msg}")
        import traceback
        traceback.print_exc()
        return {
            'startDate': None,
            'expiryDate': None,
            'error': f'Gemini analysis failed: {error_msg}',
            'rawText': None
        }

