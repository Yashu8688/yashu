import React, { useState, useEffect } from "react";
import { collection, query, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import { auth, db, storage } from "../firebase";
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

  const handleDelete = async (docId, storagePath) => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      // Delete from Firestore
      await deleteDoc(doc(db, 'users', user.uid, 'documents', docId));

      // Delete from Storage
      if (storagePath) {
        const storageRef = ref(storage, storagePath);
        await deleteObject(storageRef);
      }

    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };

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
              <p className="sub">{allDocuments.length} documents uploaded</p>
            </div>
            <button className="upload-btn" onClick={() => setShowModal(true)}>Upload</button>
          </div>

          <div className="storage-row">
            <div className="storage-label">Storage Used</div>
            <div className="storage-value">{ (allDocuments.reduce((acc, doc) => acc + doc.size, 0) / 1024 / 1024 / 1024).toFixed(2) } GB / 10 GB</div>
          </div>
          <div className="storage-bar">
            <div className="storage-fill" style={{ width: `${(allDocuments.reduce((acc, doc) => acc + doc.size, 0) / (10 * 1024 * 1024 * 1024)) * 100}%` }}></div>
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
                      <div className="doc-title">{doc.name} <span className={`doc-type ${doc.type}`}>{doc.type}</span></div>
                      <div className="doc-meta">Uploaded {doc.uploadedAt?.toDate().toLocaleDateString()} • {(doc.size / 1024 / 1024).toFixed(1)} MB • {doc.startDate && `Starts: ${doc.startDate?.toDate().toLocaleDateString()} • `} Expires: {doc.expiryDate?.toDate().toLocaleDateString()}</div>
                    </div>
                  </div>
                  <div className="doc-actions">
                    <button className="icon-btn" aria-label="Preview" onClick={() => window.open(doc.fileURL, '_blank')}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="#374151" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="#374151" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </button>
                    <button className="icon-btn" aria-label="Download" onClick={() => window.open(doc.fileURL, '_blank')}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 15V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V15" stroke="#374151" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M7 10L12 15L17 10" stroke="#374151" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 15V3" stroke="#374151" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </button>
                    <button className="icon-btn" aria-label="Delete" onClick={() => handleDelete(doc.id, doc.storagePath)}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 6H5H21" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
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

      {showModal && <UploadDocumentModal onClose={() => setShowModal(false)} onUploadSuccess={() => setShowModal(false)} />}
    </div>
  );
}

export default Vault;
