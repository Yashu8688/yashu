import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import BottomNav from "../components/BottomNav";

const ImmigrationNews = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const newsData = [
    {
      type: "H-1B",
      title: "USCIS Announces New H-1B Electronic Registration Process",
      desc: "Starting March 2024, all H-1B cap registrations must be submitted electronically through the new portal.",
      impact: "Important if you're planning to apply for H-1B after OPT completion.",
      date: "Jan 15, 2024",
      source: "USCIS Official",
    },
    {
      type: "F-1",
      title: "OPT Employment Reporting Rules Updated",
      desc: "Students must report OPT employment updates within 10 days using SEVP.",
      impact: "Failure to report may affect visa status.",
      date: "Jan 18, 2024",
      source: "SEVP",
    },
  ];

  /* Restore notification preference */
  useEffect(() => {
    const saved = localStorage.getItem("newsNotifications");
    if (saved === "disabled") setNotificationsEnabled(false);
  }, []);

  const toggleNotifications = () => {
    const newState = !notificationsEnabled;
    setNotificationsEnabled(newState);
    localStorage.setItem(
      "newsNotifications",
      newState ? "enabled" : "disabled"
    );
  };

  return (
    <>
      <Header />
      <style>{`
        :root {
          --primary: #4F6EF7;
          --accent: #6C6FF5;
          --soft-bg: #F4F8FF;
          --card-bg: #FFFFFF;
          --border: #E3EBF5;
          --text: #1F2937;
          --muted: #6B7280;
          --verified: #22C55E;
        }

        * {
          box-sizing: border-box;
          font-family: Inter, system-ui, sans-serif;
        }

        body {
          margin: 0;
          background: linear-gradient(180deg, #ffffff, var(--soft-bg));
          color: var(--text);
        }

        main {
          max-width: 900px;
          margin: auto;
          padding: 30px 20px 40px;
        }

        h1 {
          text-align: center;
          color: var(--primary);
          margin-bottom: 6px;
        }

        .subtitle {
          text-align: center;
          color: var(--muted);
          margin-bottom: 24px;
        }

        .notify-card {
          max-width: 420px;
          margin: 0 auto 30px;
          background: var(--card-bg);
          border: 1px solid var(--border);
          border-radius: 14px;
          padding: 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .notify-left {
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .notify-icon {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: var(--accent);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .toggle {
          width: 44px;
          height: 24px;
          background: #CBD5E1;
          border-radius: 999px;
          position: relative;
          cursor: pointer;
        }

        .toggle::after {
          content: "";
          width: 18px;
          height: 18px;
          background: white;
          border-radius: 50%;
          position: absolute;
          top: 3px;
          left: 3px;
          transition: 0.3s;
        }

        .toggle.active {
          background: var(--primary);
        }

        .toggle.active::after {
          left: 23px;
        }

        .stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px,1fr));
          gap: 16px;
          margin-bottom: 26px;
        }

        .stat {
          background: var(--card-bg);
          border: 1px solid var(--border);
          border-radius: 14px;
          padding: 18px;
          display: flex;
          gap: 14px;
          align-items: center;
        }

        .stat-icon {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: #EEF2FF;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          color: var(--primary);
        }

        .news-card {
          background: var(--card-bg);
          border: 1px solid var(--border);
          border-radius: 18px;
          padding: 26px;
          margin-bottom: 22px;
        }

        .card-top {
          display: flex;
          gap: 14px;
          margin-bottom: 14px;
        }

        .card-icon {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          background: var(--primary);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .badges {
          display: flex;
          gap: 8px;
          align-items: center;
          margin-bottom: 6px;
        }

        .badge {
          font-size: 13px;
          font-weight: 600;
          padding: 3px 10px;
          border-radius: 999px;
          background: #EEF2FF;
          color: var(--primary);
        }

        .verified {
          color: var(--verified);
          font-size: 13px;
        }

        .news-title {
          font-size: 18px;
          font-weight: 700;
          margin-bottom: 10px;
        }

        .news-desc {
          color: var(--muted);
          line-height: 1.6;
          margin-bottom: 16px;
        }

        .info-box {
          background: #F1F4FF;
          border: 1px solid #D6DEFF;
          padding: 14px;
          border-radius: 12px;
          font-size: 14px;
          margin-bottom: 16px;
        }

        .news-footer {
          display: flex;
          justify-content: space-between;
          font-size: 13px;
          color: var(--muted);
          border-top: 1px solid var(--border);
          padding-top: 12px;
        }
      `}</style>

      <main>
        <h1>Latest Immigration News</h1>
        <p className="subtitle">
          Stay updated with the latest visa, immigration, and policy changes
        </p>

        <div className="notify-card">
          <div className="notify-left">
            <div className="notify-icon">🔔</div>
            <div>
              <strong>News Notifications</strong>
              <br />
              <small style={{ color: "#6B7280" }}>
                Get notified of important updates
              </small>
            </div>
          </div>
          <div
            className={`toggle ${notificationsEnabled ? "active" : ""}`}
            onClick={toggleNotifications}
          />
        </div>

        <div className="stats">
          <div className="stat">
            <div className="stat-icon">!</div>
            <div>
              <strong>2</strong>
              <br />
              <small>High Priority</small>
            </div>
          </div>
          <div className="stat">
            <div className="stat-icon">↗</div>
            <div>
              <strong>5</strong>
              <br />
              <small>Total Updates</small>
            </div>
          </div>
        </div>

        {newsData.map((n, i) => (
          <div className="news-card" key={i}>
            <div className="card-top">
              <div className="card-icon">🛡</div>
              <div>
                <div className="badges">
                  <span className="badge">{n.type}</span>
                  <span className="verified">✔ Verified</span>
                </div>
                <div className="news-title">{n.title}</div>
              </div>
            </div>

            <div className="news-desc">{n.desc}</div>

            <div className="info-box">
              <strong>Why this matters to you:</strong>
              <br />
              {n.impact}
            </div>

            <div className="news-footer">
              <span>📅 {n.date}</span>
              <span className="verified">✔ {n.source}</span>
            </div>
          </div>
        ))}
      </main>
      <BottomNav />
    </>
  );
};

export default ImmigrationNews;