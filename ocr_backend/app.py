from flask import Flask, request, jsonify
from flask_cors import CORS
import base64
import json
import os
from ocr_processor import analyze_document, analyze_with_gemini

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000", "http://127.0.0.1:3000"], supports_credentials=True)

# Gemini API key (from env or hardcoded)
GEMINI_API_KEY = os.environ.get('GEMINI_API_KEY', 'AIzaSyC9bXOjQ2VvMhlW7D2uarueB9dmvfQ6zpA')

@app.route('/analyze', methods=['POST'])
def analyze():
    """
    Analyze a document and extract dates
    Expects JSON with 'file' (base64) and 'format' (pdf, png, jpg, etc.)
    """
    try:
        data = request.get_json()
        
        if not data or 'file' not in data:
            return jsonify({'error': 'No file provided'}), 400
        
        # Get file format (default to pdf)
        file_format = data.get('format', 'pdf')
        print(f"[OCR Backend] Processing file format: {file_format}")
        
        # Decode base64 file
        file_base64 = data['file']
        
        # Handle data URL format (data:application/pdf;base64,...)
        if ',' in file_base64:
            file_base64 = file_base64.split(',')[1]
        
        try:
            file_bytes = base64.b64decode(file_base64)
            print(f"[OCR Backend] Decoded file size: {len(file_bytes)} bytes")
        except Exception as e:
            print(f"[OCR Backend] Base64 decode error: {str(e)}")
            return jsonify({'error': f'Failed to decode file: {str(e)}'}), 400
        
        # Analyze document - use OCR only to avoid API errors
        print(f"[OCR Backend] Starting document analysis...")
        result = analyze_document(file_bytes, file_format)
        
        # Ensure we always return valid response structure
        if not result:
            result = {
                'startDate': None,
                'expiryDate': None,
                'error': 'Could not extract dates from document',
                'rawText': None
            }
        
        print(f"[OCR Backend] Analysis result: {json.dumps(result, default=str)}")
        
        return jsonify(result), 200
    
    except Exception as e:
        error_msg = f'Server error: {str(e)}'
        print(f"[OCR Backend] Error: {error_msg}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': error_msg}), 500


@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({'status': 'ok'}), 200


if __name__ == '__main__':
    print("Starting OCR Backend on http://0.0.0.0:5000")
    print("POST http://localhost:5000/analyze - Analyze document and extract dates")
    app.run(debug=True, host='0.0.0.0', port=5000)
