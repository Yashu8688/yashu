import React, { useState } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { storage, db, auth } from "../firebase";
import "./UploadDocumentModal.css";

export default function UploadDocumentModal({ onClose }) {
  const [startDate, setStartDate] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [docType, setDocType] = useState("");
  const [reminders, setReminders] = useState([30, 15, 1]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState("");

  const reminderOptions = [30, 15, 7, 3, 1];

  const toggleReminder = (days) => {
    setReminders((prev) =>
      prev.includes(days)
        ? prev.filter((d) => d !== days)
        : [...prev, days]
    );
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        setError("File size must be less than 10MB");
        return;
      }
      setSelectedFile(file);
      setError("");
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !docType || !expiryDate) {
      setError("Please select a file, document type, and expiry date");
      return;
    }

    setUploading(true);
    setError("");
    console.log("Starting upload...");

    try {
      const user = auth.currentUser;
      if (!user) {
        setError("User not authenticated");
        console.log("No authenticated user");
        return;
      }
      console.log("User authenticated:", user.uid);

      // First, try to save to Firestore to test if Firestore works
      console.log("Testing Firestore connection...");
      const testDocRef = await addDoc(collection(db, 'users', user.uid, 'documents'), {
        name: "test_" + selectedFile.name,
        type: docType,
        startDate: startDate ? new Date(startDate) : null,
        expiryDate: new Date(expiryDate),
        reminders: reminders,
        fileURL: "testing", // temporary
        uploadedAt: serverTimestamp(),
        size: selectedFile.size,
      });
      console.log("Firestore test successful, doc ID:", testDocRef.id);

      // Now upload file to Firebase Storage
      const storageRef = ref(storage, `documents/${user.uid}/${selectedFile.name}`);
      console.log("Storage ref created:", storageRef.fullPath);
      const uploadTask = uploadBytesResumable(storageRef, selectedFile);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
          console.log("Upload progress:", progress);
        },
        (error) => {
          console.error("Upload error:", error);
          setError("Upload failed: " + error.message);
          setUploading(false);
        },
        async () => {
          console.log("Upload completed, getting download URL...");
          // Upload completed successfully
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          console.log("Download URL:", downloadURL);

          // Update the Firestore document with the real URL
          console.log("Updating Firestore with download URL...");
          // Note: We can't update the test document easily, so we'll create a new one
          await addDoc(collection(db, 'users', user.uid, 'documents'), {
            name: selectedFile.name,
            type: docType,
            startDate: startDate ? new Date(startDate) : null,
            expiryDate: new Date(expiryDate),
            reminders: reminders,
            fileURL: downloadURL,
            uploadedAt: serverTimestamp(),
            size: selectedFile.size,
          });
          console.log("Document saved to Firestore with download URL");

          setUploading(false);
          onClose();
        }
      );
    } catch (err) {
      console.error("Upload exception:", err);
      setError("Upload failed: " + err.message);
      setUploading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <div className="modal-header">
          <div>
            <h2>Upload Document</h2>
            <p>I-94 Travel History</p>
          </div>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          {/* File Upload */}
          <div className="section">
            <label className="label">Select File</label>
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
              id="file-input"
            />
            <label htmlFor="file-input" className="file-upload">
              <p>{selectedFile ? selectedFile.name : "Click to upload or drag and drop"}</p>
              <small>PDF, JPG, PNG (max 10MB)</small>
            </label>
            {uploading && <div className="progress-bar"><div style={{ width: `${uploadProgress}%` }}></div></div>}
          </div>

          {/* Start Date */}
          <div className="section">
            <label className="label">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="input"
            />
          </div>

          {/* Expiry Date */}
          <div className="section">
            <label className="label">Expiry Date</label>
            <input
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              className="input"
            />
          </div>

          {/* Document Type */}
          <div className="section">
            <label className="label">Type of Document</label>
            <select
              className="input"
              value={docType}
              onChange={(e) => setDocType(e.target.value)}
            >
              <option value="">Select Type</option>
              <option value="i94">I-94 Travel History</option>
              <option value="passport">Passport</option>
              <option value="visa">Visa Document</option>
              <option value="id">Government ID</option>
            </select>
          </div>

          {/* Reminders */}
          <div className="section">
            <label className="label">Set Reminders</label>
            <div className="reminder-buttons">
              {reminderOptions.map((days) => (
                <button
                  key={days}
                  className={
                    reminders.includes(days)
                      ? "reminder-btn selected"
                      : "reminder-btn"
                  }
                  onClick={() => toggleReminder(days)}
                >
                  {days} days
                </button>
              ))}
            </div>

            <p className="green-text">
              ✓ You will be reminded {reminders.join(", ")} days before expiry
            </p>
          </div>

          {/* Error Message */}
          {error && <p className="error-text">{error}</p>}

          {/* Buttons */}
          <div className="btn-row">
            <button className="cancel-btn" onClick={onClose}>Cancel</button>
            <button className="upload-btn" onClick={handleUpload} disabled={uploading}>
              {uploading ? "Uploading..." : "Upload Document"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
