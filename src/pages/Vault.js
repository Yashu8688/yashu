// src/pages/Vault.js
import React, { useState, useEffect } from "react";
import { collection, query, onSnapshot } from "firebase/firestore";
import { auth, db } from "../firebase";
import Header from "../components/Header";
import BottomNav from "../components/BottomNav";
import UploadDocumentModal from "../components/UploadDocumentModal";
import "./Vault.css";

function Vault() {
  const [showModal, setShowModal] = useState(false);
  const [allDocuments, setAllDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(collection(db, 'users', user.uid, 'documents'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const docs = [];
      querySnapshot.forEach((doc) => {
        docs.push({ id: doc.id, ...doc.data() });
      });
      setAllDocuments(docs);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const documents = [
    { id: 1, title: "I-20 Form", uploaded: true, size: "2.4 MB", uploadedAt: "2023-08-10", expires: "2026-05-15", required: true },
    { id: 2, title: "Passport Copy", uploaded: true, size: "1.8 MB", uploadedAt: "2023-08-10", expires: "2028-07-20", required: true },
    { id: 3, title: "EAD Card", uploaded: true, size: "1.2 MB", uploadedAt: "2023-09-15", expires: "2025-12-30", required: true },
    { id: 4, title: "I-94 Travel History", uploaded: false, size: null, uploadedAt: null, expires: null, required: true, missing: true },
    { id: 5, title: "Transcript", uploaded: false, size: null, uploadedAt: null, expires: null, required: false, missing: true }
  ];

  return (
    <div className="vault-container">
      <Header />

      <main className="vault-content">
        <div className="vault-banner">
          <div className="vault-banner-left">
            <h1>Document Vault <span className="lock">🔒</span></h1>
            <p>Securely manage your immigration documents</p>
          </div>
        </div>

        <section className="vault-panel">
          <div className="vault-panel-header">
            <div>
              <h2>Document Vault</h2>
              <p className="sub">3 of 4 required documents uploaded</p>
            </div>
            <button className="upload-btn" onClick={() => setShowModal(true)}>Upload</button>
          </div>

          <div className="storage-row">
            <div className="storage-label">Storage Used</div>
            <div className="storage-value">5.4 GB / 10 GB</div>
          </div>
          <div className="storage-bar">
            <div className="storage-fill" style={{ width: '54%' }}></div>
          </div>

          <div className="docs-list">
            {loading ? (
              <p>Loading documents...</p>
            ) : (
              allDocuments.map(doc => (
                <div key={doc.id} className="doc-item">
                  <div className="doc-left">
                    <div className="doc-icon">📄</div>
                    <div>
                      <div className="doc-title">{doc.name} <span className="tag required">Uploaded</span></div>
                      <div className="doc-meta">Uploaded {doc.uploadedAt?.toDate().toLocaleDateString()} • {(doc.size / 1024 / 1024).toFixed(1)} MB • Expires: {doc.expiryDate?.toDate().toLocaleDateString()}</div>
                    </div>
                  </div>
                  <div className="doc-actions">
                    <button className="icon-btn" aria-label="Preview" onClick={() => window.open(doc.fileURL, '_blank')}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="#374151" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="#374151" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                    <button className="icon-btn" aria-label="Download" onClick={() => window.open(doc.fileURL, '_blank')}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21 15V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V15" stroke="#374151" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M7 10L12 15L17 10" stroke="#374151" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12 15V3" stroke="#374151" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="encryption-note">
            <div className="enc-left">🔐</div>
            <div className="enc-content">
              <div className="enc-title">Bank-level encryption</div>
              <div className="enc-desc">Your documents are encrypted and stored securely. Only you can access them.</div>
            </div>
          </div>

        </section>

      </main>

      <button className="floating-ai-btn">🤖</button>
      <BottomNav />

      {showModal && <UploadDocumentModal />}
    </div>
  );
}

export default Vault;
