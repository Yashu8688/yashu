
import React, { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
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

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFile(file);
    setError('');
    setStartDate('');
    setExpiryDate('');
    setAnalysisStatus('analyzing');

    try {
      const functionUrl = 'https://us-central1-voyloo-190a9.cloudfunctions.net/processDocument';
      
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Request timed out')), 30000) // 30 seconds timeout
      );

      const response = await Promise.race([
        fetch(functionUrl, {
          method: 'POST',
          body: file, // Send the raw file
          headers: {
            'Content-Type': file.type,
          },
        }),
        timeoutPromise
      ]);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Analysis function error response:", response.status, errorText);
        if (response.status === 404) {
          throw new Error("The analysis service is not deployed.");
        } else if (response.status === 500) {
            throw new Error(`Analysis service failed: ${errorText}`);
        }
        throw new Error(errorText || 'Failed to analyze document.');
      }

      const data = await response.json();

      if (!data.startDate && !data.expiryDate) {
        setError("Analysis complete, but no dates were found in the document. Please enter them manually.");
        setAnalysisStatus('error');
        return;
      }

      if (data.startDate) {
        setStartDate(data.startDate.split('T')[0]);
      }
      if (data.expiryDate) {
        setExpiryDate(data.expiryDate.split('T')[0]);
      }

      setAnalysisStatus('success');

    } catch (err) {
      console.error('Document Analysis Error:', err);
      if (err.message.includes("timed out")) {
        setError('Error: The document analysis service took too long to respond. Please try again.');
      } else if (err.message.includes("not deployed")) {
        setError('Error: The document analysis service is offline. Please contact your administrator.');
      } else {
        setError(`Could not analyze the document. Please enter dates manually. Details: ${err.message}`);
      }
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
      await addDoc(collection(db, 'users', user.uid, 'documents'), {
        name: selectedFile.name,
        type: finalDocType,
        startDate: startDate ? new Date(startDate) : null,
        expiryDate: expiryDate ? new Date(expiryDate) : null,
        reminderDays: reminders,
        fileURL: '',
        storagePath: '',
        uploadedAt: serverTimestamp(),
        size: selectedFile.size,
      });

      setUploading(false);
      if (onUploadSuccess) onUploadSuccess();
      else onClose();
      
    } catch (err) {
      console.error("Firestore save error:", err);
      setError(`Failed to save document: ${err.message}`);
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
