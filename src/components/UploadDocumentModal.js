
import React, { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db, storage } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import * as pdfParse from 'pdf-parse';
import Tesseract from 'tesseract.js';
import mammoth from 'mammoth';
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

  const extractTextFromFile = async (file) => {
    const fileType = file.type.toLowerCase();

    if (fileType.includes('pdf')) {
      const arrayBuffer = await file.arrayBuffer();
      const data = await pdfParse(new Uint8Array(arrayBuffer));
      return data.text;
    } else if (fileType.includes('image')) {
      const result = await Tesseract.recognize(file, 'eng');
      return result.data.text;
    } else if (fileType.includes('word') || fileType.includes('document')) {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      return result.value;
    } else {
      throw new Error('Unsupported file type for text extraction');
    }
  };

  const parseDatesFromText = (text) => {
    const datePatterns = [
      /\b(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})\b/g, // MM/DD/YYYY or DD/MM/YYYY
      /\b(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})\b/g, // YYYY/MM/DD
      /\b(\d{1,2})\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+(\d{4})\b/gi, // DD Month YYYY
      /\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+(\d{1,2}),?\s+(\d{4})\b/gi, // Month DD, YYYY
    ];

    const dates = [];
    datePatterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        let year, month, day;

        if (match[1].length === 4) {
          // YYYY/MM/DD format
          [year, month, day] = match.slice(1, 4);
        } else if (match[2].match(/\d{1,2}/)) {
          // MM/DD/YYYY or DD/MM/YYYY - assuming MM/DD/YYYY for US format
          [month, day, year] = match.slice(1, 4);
        } else {
          // Month name formats
          const monthNames = {
            jan: '01', feb: '02', mar: '03', apr: '04', may: '05', jun: '06',
            jul: '07', aug: '08', sep: '09', oct: '10', nov: '11', dec: '12'
          };
          const monthName = match[1].toLowerCase().substring(0, 3);
          month = monthNames[monthName];
          day = match[2].padStart(2, '0');
          year = match[3];
        }

        if (year && month && day) {
          const dateStr = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
          dates.push(dateStr);
        }
      }
    });

    // Remove duplicates and sort
    const uniqueDates = [...new Set(dates)].sort();

    // Try to identify start and expiry dates based on context
    let startDate = null;
    let expiryDate = null;

    const lowerText = text.toLowerCase();

    // Look for keywords to identify date types
    const startKeywords = ['issue', 'issued', 'start', 'begin', 'from', 'valid from'];
    const expiryKeywords = ['expire', 'expiry', 'expiration', 'end', 'until', 'valid to', 'valid until'];

    for (const date of uniqueDates) {
      const dateIndex = lowerText.indexOf(date.replace(/-/g, '/')) ||
                       lowerText.indexOf(date.replace(/-/g, '-')) ||
                       lowerText.indexOf(date.split('-').reverse().join('/')) ||
                       lowerText.indexOf(date.split('-').reverse().join('-'));

      if (dateIndex !== -1) {
        const context = lowerText.substring(Math.max(0, dateIndex - 50), dateIndex + 50);

        const isStart = startKeywords.some(keyword => context.includes(keyword));
        const isExpiry = expiryKeywords.some(keyword => context.includes(keyword));

        if (isStart && !startDate) {
          startDate = date;
        } else if (isExpiry && !expiryDate) {
          expiryDate = date;
        }
      }
    }

    // If no specific dates found, use first and last dates as fallback
    if (!startDate && !expiryDate && uniqueDates.length >= 1) {
      if (uniqueDates.length === 1) {
        expiryDate = uniqueDates[0];
      } else {
        startDate = uniqueDates[0];
        expiryDate = uniqueDates[uniqueDates.length - 1];
      }
    }

    return { startDate, expiryDate };
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFile(file);
    setError('');
    setStartDate('');
    setExpiryDate('');
    setAnalysisStatus('analyzing');

    try {
      // Try Cloud Function first
      const functionUrl = 'https://us-central1-voyloo-190a9.cloudfunctions.net/processDocument';

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Request timed out')), 30000)
      );

      const response = await Promise.race([
        fetch(functionUrl, {
          method: 'POST',
          body: file,
          headers: {
            'Content-Type': file.type,
          },
        }),
        timeoutPromise
      ]);

      if (response.ok) {
        const data = await response.json();

        if (data.startDate || data.expiryDate) {
          if (data.startDate) {
            setStartDate(data.startDate.split('T')[0]);
          }
          if (data.expiryDate) {
            setExpiryDate(data.expiryDate.split('T')[0]);
          }
          setAnalysisStatus('success');
          return;
        }
      }

      // Fallback to client-side processing
      console.log('Cloud function failed or returned no dates, trying client-side processing...');
      const text = await extractTextFromFile(file);
      const { startDate, expiryDate } = parseDatesFromText(text);

      if (startDate || expiryDate) {
        if (startDate) setStartDate(startDate);
        if (expiryDate) setExpiryDate(expiryDate);
        setAnalysisStatus('success');
      } else {
        setError("Analysis complete, but no dates were found in the document. Please enter them manually.");
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
        read: false,
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
            <label className="label">Document Type</label>
            <select className="input" value={docType} onChange={(e) => setDocType(e.target.value)}>
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
              />
            )}
          </div>

          <div className="section">
            <label className="label">Document File</label>
            <div className={`file-upload ${isProcessing ? 'disabled' : ''}`} onClick={triggerFileSelect}>
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
            <input className="input" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </div>

          <div className="section">
            <label className="label">Expiry Date</label>
            <input className="input" type="date" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} />
          </div>

          <div className="section">
            <label className="label">Set Reminder</label>
            <div className="reminder-buttons">
              {[1, 3, 7, 15, 30].map(days => (
                  <button key={days} 
                      className={`reminder-btn ${reminders.includes(days) ? 'selected' : ''}`}
                      onClick={() => handleReminderChange(days)}>
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
