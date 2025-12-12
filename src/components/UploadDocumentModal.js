import React, { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import './UploadDocumentModal.css';

const UploadDocumentModal = ({ onClose, onUploadSuccess }) => {
  const [user] = useAuthState(auth);
  const [selectedFile, setSelectedFile] = useState(null);
  const [docType, setDocType] = useState('Passport');
  const [expiryDate, setExpiryDate] = useState('');
  const [startDate, setStartDate] = useState('');
  const [reminders, setReminders] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setError('');
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

    setUploading(true);
    setError('');

    try {
      // Save document metadata directly to Firestore, skipping Firebase Storage.
      await addDoc(collection(db, 'users', user.uid, 'documents'), {
        name: selectedFile.name,
        type: docType,
        startDate: startDate ? new Date(startDate) : null,
        expiryDate: expiryDate ? new Date(expiryDate) : null,
        reminderDays: reminders,
        fileURL: '', // File not uploaded, so URL is empty
        storagePath: '', // File not uploaded, so path is empty
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
              <option>Passport</option>
              <option>Visa</option>
              <option>I-20</option>
              <option>Driver's License</option>
              <option>Other</option>
            </select>
          </div>

          <div className="section">
            <label className="label">Document File</label>
            <div className="file-upload" onClick={triggerFileSelect}>
                <input id="file-input-id" type="file" onChange={handleFileSelect} style={{display: 'none'}}/>
                {selectedFile ? 
                  <span>{selectedFile.name}</span> : 
                  <span>+ Click to select a file</span>
                }
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
          {uploading && (
              <div style={{marginTop: '10px'}}>
                  <p style={{textAlign: 'center', fontSize: '13px', marginTop: '4px'}}>Saving...</p>
              </div>
          )}

          <div className="btn-row">
            <button className="cancel-btn" onClick={onClose} disabled={uploading}>Cancel</button>
            <button className="upload-btn" onClick={handleUpload} disabled={uploading}>
              {uploading ? 'Saving...' : 'Upload Document'}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default UploadDocumentModal;
