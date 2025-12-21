
import React, { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db, storage } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import './UploadDocumentModal.css';

const UploadDocumentModal = ({ onClose, onUploadSuccess }) => {
  const [user] = useAuthState(auth);
  const [selectedFile, setSelectedFile] = useState(null);
  const [docType, setDocType] = useState('PASSPORT');
  const [otherDocType, setOtherDocType] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [startDate, setStartDate] = useState('');
  const [reminders, setReminders] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [analysisStatus, setAnalysisStatus] = useState('idle'); // 'idle', 'analyzing', 'success', 'error'
  const [error, setError] = useState('');
  const [manualEntry, setManualEntry] = useState(false);
  
  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFile(file);
    setError('');
    setStartDate('');
    setExpiryDate('');

    if (manualEntry) {
      setAnalysisStatus('idle');
      return;
    }

    setAnalysisStatus('analyzing');

    const finalDocType = docType === 'OTHERS' ? otherDocType : docType;

    if (!user) {
      setError('You must be logged in to analyze documents.');
      setAnalysisStatus('error');
      return;
    }
    if (!finalDocType) {
      setError('Please select a document type before selecting a file.');
      setAnalysisStatus('error');
      return;
    }

    // helper: read file as dataURL
    const readFileAsDataURL = (f) => new Promise((res, rej) => {
      const r = new FileReader();
      r.onload = () => res(r.result);
      r.onerror = rej;
      r.readAsDataURL(f);
    });

    // helper: read file as ArrayBuffer
    const readFileAsArrayBuffer = (f) => new Promise((res, rej) => {
      const r = new FileReader();
      r.onload = () => res(r.result);
      r.onerror = rej;
      r.readAsArrayBuffer(f);
    });

    // helper: client-side OCR (supports PDF by rendering first page with pdfjs)
    const runClientOCR = async (f) => {
      try {
        let imageSource = f;

        // If PDF, render first page to canvas using pdfjs
        if ((f.type && f.type.includes('pdf')) || (f.name && f.name.toLowerCase().endsWith('.pdf'))) {
            try {
              // Import the main PDF module
              const pdfjsModule = await import('pdfjs-dist');
              
              // Create a PDF.js instance with explicit worker code
              const { getDocument, GlobalWorkerOptions } = pdfjsModule;
              
              // Set up the worker - try multiple approaches for compatibility
              try {
                // Approach 1: Set GlobalWorkerOptions.workerSrc if it's writable
                if (GlobalWorkerOptions && typeof GlobalWorkerOptions === 'object') {
                  Object.defineProperty(GlobalWorkerOptions, 'workerSrc', {
                    value: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js',
                    writable: true,
                    configurable: true
                  });
                }
              } catch (e1) {
                console.warn('Could not set GlobalWorkerOptions.workerSrc:', e1);
              }
              
              const arrayBuf = await readFileAsArrayBuffer(f);
              const loadingTask = getDocument({ data: arrayBuf });
              const pdf = await loadingTask.promise;
              const page = await pdf.getPage(1);
              const viewport = page.getViewport({ scale: 2 });
              const canvas = document.createElement('canvas');
              canvas.width = Math.round(viewport.width);
              canvas.height = Math.round(viewport.height);
              const ctx = canvas.getContext('2d');
              const renderContext = { canvasContext: ctx, viewport };
              await page.render(renderContext).promise;
              imageSource = canvas;
            } catch (pdfErr) {
              console.warn('PDF rendering failed (client):', pdfErr);
              // For PDFs, since client-side rendering is problematic, skip client OCR and go straight to server
              throw new Error('Client-side PDF rendering not available. Falling back to server OCR.');
            }
        }

        // Import tesseract.js and prefer the worker API
        const TesseractMod = await import('tesseract.js');
        const T = TesseractMod.default || TesseractMod;
        if (typeof T.createWorker === 'function') {
          // Avoid passing functions (like a logger) into worker options because
          // they cannot be cloned/postMessaged to the worker in some bundler setups.
          const worker = T.createWorker();
          // Some builds may return a worker wrapper with load/loadLanguage/initialize
          if (worker && typeof worker.load === 'function') {
            await worker.load();
            await worker.loadLanguage('eng');
            await worker.initialize('eng');
            const { data } = await worker.recognize(imageSource);
            await worker.terminate();
            return data && data.text ? data.text : '';
          }
          // In case the returned object exposes recognize directly
          if (worker && typeof worker.recognize === 'function') {
            const { data } = await worker.recognize(imageSource);
            if (typeof worker.terminate === 'function') await worker.terminate();
            return data && data.text ? data.text : '';
          }
        }
        // Fallback: try top-level recognize
        if (typeof T.recognize === 'function') {
          const { data } = await T.recognize(imageSource, 'eng');
          return data && data.text ? data.text : '';
        }
        throw new Error('tesseract.js is present but no usable API (createWorker/recognize) was found.');
      } catch (err) {
        console.warn('Tesseract.js failed:', err);
        // Throw a clear error so caller falls back to server-side OCR
        throw new Error(err && err.message ? `Client OCR failed: ${err.message}` : 'Client OCR failed');
      }
    };

    // helper: extract dates
    const extractDatesFromText = (text) => {
      if (!text) return { startDate: null, expiryDate: null };
      const found = [];
      const dateMatches = []; // Store original matches with positions
      const regexes = [ /\b(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})\b/g, /\b(\d{4})[\-](\d{1,2})[\-](\d{1,2})\b/g, /\b(\d{1,2})\s*(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*[\s,.-]*(\d{2,4})\b/ig ];
      for (const r of regexes) {
        let m;
        while ((m = r.exec(text))) {
          try {
            let yyyy, mm, dd;
            if (m.length === 4 && /\d{1,2}[\/\-]\d{1,2}/.test(m[0])) {
              dd = m[1].padStart(2, '0');
              mm = m[2].padStart(2, '0');
              yyyy = m[3].length === 2 ? '20' + m[3] : m[3];
            } else if (m.length === 4 && /\d{4}[\-]/.test(m[0])) {
              yyyy = m[1]; mm = m[2].padStart(2,'0'); dd = m[3].padStart(2,'0');
            } else {
              dd = m[1].padStart(2,'0');
              const monthMap = {jan:1,feb:2,mar:3,apr:4,may:5,jun:6,jul:7,aug:8,sep:9,oct:10,nov:11,dec:12};
              mm = String(monthMap[m[2].toLowerCase().slice(0,3)]).padStart(2,'0');
              yyyy = m[3].length === 2 ? '20' + m[3] : m[3];
            }
            const iso = `${yyyy}-${mm}-${dd}`;
            const d = new Date(iso);
            if (!isNaN(d.getTime())) {
              found.push(iso);
              dateMatches.push({ iso, original: m[0], index: m.index });
            }
          } catch (err) { continue; }
        }
      }

      // Filter out dates that appear near birth-related keywords
      const birthKeywords = ["date of birth", "birth date", "born on", "birth", "dob"];
      const filteredFound = [];
      for (const match of dateMatches) {
        let isBirthDate = false;
        for (const keyword of birthKeywords) {
          const keywordIndex = text.toLowerCase().indexOf(keyword.toLowerCase());
          if (keywordIndex !== -1) {
            // Check if the date appears within 100 characters of the birth keyword
            if (Math.abs(match.index - keywordIndex) < 100) {
              isBirthDate = true;
              break;
            }
          }
        }
        if (!isBirthDate) {
          filteredFound.push(match.iso);
        }
      }

      const lower = text.toLowerCase();
      const startKw = /(?:valid from|start date|issue date|issued on|date of issue)[:\s]*([^\n\r]+)/i;
      const endKw = /(?:expiry date|date of expiry|valid until|expires on|valid till|expiration date)[:\s]*([^\n\r]+)/i;
      const sMatch = lower.match(startKw);
      const eMatch = lower.match(endKw);
      const pickIso = (str) => {
        if (!str) return null;
        const tryDate = new Date(str.replace(/[^0-9a-zA-Z \-\/,:]/g, ' '));
        if (!isNaN(tryDate.getTime())) {
          return `${tryDate.getFullYear()}-${String(tryDate.getMonth()+1).padStart(2,'0')}-${String(tryDate.getDate()).padStart(2,'0')}`;
        }
        return null;
      };
      const fromKw = sMatch ? pickIso(sMatch[1]) : null;
      const toKw = eMatch ? pickIso(eMatch[1]) : null;
      if (fromKw || toKw) return { startDate: fromKw, expiryDate: toKw };
      if (!filteredFound.length) return { startDate: null, expiryDate: null };
      filteredFound.sort();
      return { startDate: filteredFound[0], expiryDate: filteredFound[filteredFound.length-1] };
    };

    try {
      const base64File = await readFileAsDataURL(file);

      // Determine file format first
      let format = 'image';
      const isPDF = file.type.includes('pdf') || file.name.toLowerCase().endsWith('.pdf');
      const isPNG = file.type.includes('png') || file.name.toLowerCase().endsWith('.png');
      const isJPG = file.type.includes('jpeg') || file.type.includes('jpg') || file.name.toLowerCase().endsWith('.jpg') || file.name.toLowerCase().endsWith('.jpeg');
      
      if (isPDF) format = 'pdf';
      else if (isPNG) format = 'png';
      else if (isJPG) format = 'jpg';

      // Try client-side OCR ONLY for PNG/JPG (skip for PDFs due to worker issues)
      let clientText = '';
      if (!isPDF) {
        try { 
          clientText = await runClientOCR(file); 
        } catch (e) { 
          console.warn('Client OCR error:', e); 
        }
      }

      if (clientText && clientText.trim().length > 10) {
        const { startDate: s, expiryDate: ex } = extractDatesFromText(clientText);
        if (s) setStartDate(s);
        if (ex) setExpiryDate(ex);
        if (s || ex) { setAnalysisStatus('success'); return; }
      }

      // Fallback to server OCR (especially for PDFs)
      console.log('Sending file to OCR backend:', { fileType: file.type, fileSize: file.size, format });

      const ocrResponse = await fetch('http://localhost:5000/analyze', {
        method: 'POST',
        body: JSON.stringify({ file: base64File, format }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (ocrResponse.ok) {
        const ocrData = await ocrResponse.json();
        console.log('OCR response data:', ocrData);
        if (ocrData.rawText) {
          const { startDate: rs, expiryDate: re } = extractDatesFromText(ocrData.rawText || '');
          if (rs && !startDate) setStartDate(rs);
          if (re && !expiryDate) setExpiryDate(re);
        }
        if (ocrData.error) { setError(`OCR Error: ${ocrData.error}`); setAnalysisStatus('error'); }
        else if (ocrData.startDate || ocrData.expiryDate) {
          const normalize = (d) => {
            if (!d) return null;
            const iso = d.match(/^\d{4}-\d{2}-\d{2}/);
            if (iso) return iso[0];
            const parsed = new Date(d);
            if (!isNaN(parsed.getTime())) return `${parsed.getFullYear()}-${String(parsed.getMonth()+1).padStart(2,'0')}-${String(parsed.getDate()).padStart(2,'0')}`;
            return null;
          };
          const s = normalize(ocrData.startDate) || startDate;
          const e = normalize(ocrData.expiryDate) || expiryDate;
          if (s) setStartDate(s);
          if (e) setExpiryDate(e);
          setAnalysisStatus('success');
          return;
        } else { setError('Could not extract dates from document. Please enter manually.'); setAnalysisStatus('error'); }
      } else {
        const errorText = await ocrResponse.text();
        setError(`Analysis failed: ${errorText}`);
        setAnalysisStatus('error');
      }
    } catch (err) {
      console.error('Document Analysis Error:', err);
      setError(`Could not analyze the document. Please enter dates manually. Details: ${err.message}`);
      setAnalysisStatus('error');
    }
    

  };

  const triggerFileSelect = () => {
    document.getElementById('file-input-id').click();
  }

  const handleReminderChange = (day) => {
    setReminders(prev => 
        prev.includes(day) ? prev.filter(r => r !== day) : [...prev, day]
    );
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file to upload.');
      return;
    }
    if (!user) {
      setError('You must be logged in to upload documents.');
      return;
    }

    const finalDocType = docType === 'OTHERS' ? otherDocType : docType;
    if (!finalDocType) {
        setError('Please specify the document type.');
        return;
    }

    setUploading(true);
    setError('');

    try {
      // Upload file to Firebase Storage
      const storagePath = `users/${user.uid}/documents/${Date.now()}_${selectedFile.name}`;
      const storageRef = ref(storage, storagePath);
      await uploadBytes(storageRef, selectedFile);

      // Get download URL
      const fileURL = await getDownloadURL(storageRef);

      // Save document metadata to Firestore
      await addDoc(collection(db, 'users', user.uid, 'documents'), {
        name: selectedFile.name,
        type: finalDocType,
        startDate: startDate ? new Date(startDate) : null,
        expiryDate: expiryDate ? new Date(expiryDate) : null,
        reminderDays: reminders,
        fileURL: fileURL,
        storagePath: storagePath,
        uploadedAt: serverTimestamp(),
        size: selectedFile.size,
      });

      // Create notification for document upload
      await addDoc(collection(db, 'users', user.uid, 'notifications'), {
        type: 'document_upload',
        title: 'Document Uploaded Successfully',
        message: `${selectedFile.name} has been uploaded and saved to your vault.`,
        documentName: selectedFile.name,
        documentType: finalDocType,
        expiryDate: expiryDate ? new Date(expiryDate) : null,
        reminderDays: reminders,
        createdAt: serverTimestamp(),
        read: false
      });

      setUploading(false);
      if (onUploadSuccess) onUploadSuccess();
      else onClose();

    } catch (err) {
      console.error("Upload error:", err);
      setError(`Failed to upload document: ${err.message}`);
      setUploading(false);
    }
  };

  const isProcessing = uploading || analysisStatus === 'analyzing';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2>Upload Document</h2>
            <p>Add a new document to your vault</p>
          </div>
          <button onClick={onClose} className="close-btn">&times;</button>
        </div>

        <div className="modal-body">
          <div className="section">
            <label className="label">Manual Entry</label>
            <div>
              <input 
                type="checkbox" 
                id="manual-entry-checkbox" 
                checked={manualEntry} 
                onChange={(e) => setManualEntry(e.target.checked)} 
                disabled={isProcessing}
              />
              <label htmlFor="manual-entry-checkbox" style={{ marginLeft: '10px' }}>
                Enter document details manually
              </label>
            </div>
          </div>
          <div className="section">
            <label className="label">Document Type</label>
            <select className="input" value={docType} onChange={(e) => setDocType(e.target.value)} disabled={isProcessing}>
              <option value="PASSPORT">PASSPORT</option>
              <option value="VISA">VISA</option>
              <option value="I_94">I_94</option>
              <option value="I_20">I_20</option>
              <option value="OPT_I20">OPT_I20</option>
              <option value="STEM_OPT_I20">STEM_OPT_I20</option>
              <option value="EAD_OPT">EAD_OPT</option>
              <option value="EAD_STEM_OPT">EAD_STEM_OPT</option>
              <option value="I_797">I_797</option>
              <option value="H1B_APPROVAL">H1B_APPROVAL</option>
              <option value="L1_APPROVAL">L1_APPROVAL</option>
              <option value="O1_APPROVAL">O1_APPROVAL</option>
              <option value="GREEN_CARD">GREEN_CARD</option>
              <option value="CONDITIONAL_GREEN_CARD">CONDITIONAL_GREEN_CARD</option>
              <option value="ADVANCE_PAROLE">ADVANCE_PAROLE</option>
              <option value="TPS_TRAVEL_AUTH">TPS_TRAVEL_AUTH</option>
              <option value="OTHERS">Others</option>
            </select>
            {docType === 'OTHERS' && (
              <input
                type="text"
                className="input"
                placeholder="Please specify"
                value={otherDocType}
                onChange={(e) => setOtherDocType(e.target.value)}
                style={{ marginTop: '10px' }}
                disabled={isProcessing}
              />
            )}
          </div>

          <div className="section">
            <label className="label">Document File</label>
            <div className={`file-upload ${isProcessing ? 'disabled' : ''}`} onClick={!isProcessing ? triggerFileSelect : undefined}>
                <input id="file-input-id" type="file" onChange={handleFileSelect} style={{display: 'none'}} disabled={isProcessing}/>
                {analysisStatus === 'analyzing' ? (
                  <span>Analyzing document...</span>
                ) : (
                  selectedFile ? 
                    <span>{selectedFile.name}</span> : 
                    <span>+ Click to select a file</span>
                )}
                <small>PDF, PNG, JPG up to 10MB</small>
            </div>
          </div>

          <div className="section">
            <label className="label">Start Date</label>
            <input className="input" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} disabled={analysisStatus === 'analyzing'} />
          </div>

          <div className="section">
            <label className="label">Expiry Date</label>
            <input className="input" type="date" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} disabled={analysisStatus === 'analyzing'} />
          </div>

          <div className="section">
            <label className="label">Set Reminder</label>
            <div className="reminder-buttons">
              {[1, 3, 7, 15, 30].map(days => (
                  <button key={days} 
                      className={`reminder-btn ${reminders.includes(days) ? 'selected' : ''}`}
                      onClick={() => handleReminderChange(days)}
                      disabled={isProcessing}>
                      {days} {days === 1 ? 'day' : 'days'}
                  </button>
              ))}
            </div>
            <p className="green-text">We'll send you a notification so you never miss a renewal.</p>
          </div>

          {error && <p className="error-message" style={{color: 'red', marginBottom: '10px'}}>{error}</p>}
          
          <div className="btn-row">
            <button className="cancel-btn" onClick={onClose} disabled={isProcessing}>Cancel</button>
            <button className="upload-btn" onClick={handleUpload} disabled={isProcessing || !selectedFile}>
              {uploading ? 'Saving...' : 'Upload Document'}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default UploadDocumentModal;
