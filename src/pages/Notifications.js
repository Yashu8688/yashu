import React, { useState, useEffect } from "react";
import { collection, query, onSnapshot, orderBy, updateDoc, doc } from "firebase/firestore";
import { auth, db } from "../firebase";
import Header from "../components/Header";
import BottomNav from "../components/BottomNav";
import "./Notifications.css";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(collection(db, 'users', user.uid, 'notifications'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const notifs = [];
      querySnapshot.forEach((doc) => {
        notifs.push({ id: doc.id, ...doc.data() });
      });
      setNotifications(notifs);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const markAsRead = async (notificationId) => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      await updateDoc(doc(db, 'users', user.uid, 'notifications', notificationId), {
        read: true
      });
    } catch (error) {
      console.error("Error marking notification as read: ", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="notifications-container">
      <Header />

      <main className="notifications-content">
        <div className="notifications-header">
          <h1>Notifications</h1>
          <p>Stay updated with your document reminders</p>
        </div>

        <div className="notifications-list">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <div key={notification.id} className={`notification-item ${!notification.read ? 'unread' : ''}`}>
                <div className="notification-icon">
                  {notification.type === 'expiry' ? '⏰' : '📄'}
                </div>
                <div className="notification-content">
                  <h3>{notification.title}</h3>
                  <p>{notification.message}</p>
                  <div className="notification-time">
                    {notification.createdAt?.toDate().toLocaleString()}
                  </div>
                </div>
                {!notification.read && (
                  <button className="mark-read-btn" onClick={() => markAsRead(notification.id)}>
                    Mark Read
                  </button>
                )}
              </div>
            ))
          ) : (
            <div className="no-notifications">
              <p>No notifications yet. Set reminders for your documents to get notified here.</p>
            </div>
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}

export default Notifications;
