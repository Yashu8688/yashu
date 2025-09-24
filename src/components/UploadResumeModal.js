import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './UploadResumeModal.css';

const UploadResumeModal = () => {
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleUploadAreaClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  const formatFileSize = (size) => {
    if (size < 1024) return size + ' B';
    else if (size < 1024 * 1024) return (size / 1024).toFixed(2) + ' KB';
    else return (size / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const handleProcessClick = () => {
    setIsProcessing(true);
  };

  const handleBackToTemplates = () => {
    navigate('/portfolio-template-selector');
  };

  const handleClose = () => {
    navigate('/landing');
  };

  const handleSkipAndBuildManually = () => {
    // Navigate to manual build page or handle skip logic
    console.log('Skip and build manually clicked');
    // You can add navigation to manual build page here
  };

  useEffect(() => {
    if (isProcessing) {
      const timer = setTimeout(() => {
        // Redirect to processing page - replace URL as needed
        window.location.href = '/profile';
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isProcessing]);

  if (isProcessing) {
    return (
      <div className="modal-overlay processing-overlay">
        <div className="processing-container">
          <div className="processing-icon">&#8682;</div>
          <h2 className="processing-title">Processing Your Resume</h2>
          <p className="processing-subtitle">Extracting information for your Voyloo Portfolio...</p>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: '60%' }}></div>
          </div>
          <p className="progress-percent">90% complete</p>
          <p className="processing-status">Identifying work experience...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay">
      <div className="upload-modal">
        <div className="modal-header">
          <a href="#" className="back-link" onClick={handleBackToTemplates}>
            <span className="back-arrow">&#8592;</span> Back to Templates
          </a>
          <button className="close-button" onClick={handleClose} aria-label="Close modal">&times;</button>
        </div>
        <h2 className="modal-title">Upload Your Resume</h2>
        <p className="modal-description">
          Upload your resume and we'll automatically extract your information to create your Voyloo Portfolio. This saves you time and ensures nothing important is missed.
        </p>
        {!selectedFile ? (
          <div className="upload-area" onClick={handleUploadAreaClick}>
            <div className="upload-icon">&#8682;</div>
            <p className="upload-text-bold">Drag and drop your resume here</p>
            <p className="upload-text-light">or click to browse files</p>
            <p className="upload-file-types">PDF &bull; DOC &bull; DOCX &bull; TXT</p>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx,.txt"
            />
          </div>
        ) : (
          <div className="file-info-box">
            <div className="file-check">&#10003;</div>
            <div className="file-name">{selectedFile.name}</div>
            <div className="file-size-status">
              {formatFileSize(selectedFile.size)} &bull; Ready to process
            </div>
            <button className="btn remove-file-btn" onClick={handleRemoveFile}>
              Remove File
            </button>
          </div>
        )}
        <div className="info-boxes">
          <div className="info-box ai-powered">
            <div className="info-icon">&#9881;</div>
            <div className="info-text">
              <strong>AI-Powered Extraction</strong>
              <p>Our AI analyzes your resume and automatically fills in your portfolio sections.</p>
            </div>
          </div>
          <div className="info-box always-editable">
            <div className="info-icon">&#128221;</div>
            <div className="info-text">
              <strong>Always Editable</strong>
              <p>You can review and edit all extracted information before publishing.</p>
            </div>
          </div>
        </div>
        <div className="modal-buttons">
          <button className="btn skip-btn" onClick={handleSkipAndBuildManually}>Skip &amp; Build Manually</button>
          <button className="btn upload-btn" disabled={!selectedFile} onClick={handleProcessClick}>
            {selectedFile ? 'Process Resume' : 'Upload Resume First'}
          </button>
        </div>
        <p className="modal-footer">
          &#9432; Your resume is processed securely and not stored permanently
        </p>
      </div>
    </div>
  );
};

export default UploadResumeModal;
