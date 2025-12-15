import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import BottomNav from "../components/BottomNav";
import axios from "axios";

// Temporary sample data
const sampleNews = [
    {
        title: "USCIS Expands Premium Processing for Certain F-1 Students",
        summary: "U.S. Citizenship and Immigration Services today announced the expansion of premium processing for F-1 students seeking Optional Practical Training (OPT) and STEM OPT extensions.",
        url: "https://www.uscis.gov/newsroom/news-releases/uscis-expands-premium-processing-for-certain-f-1-students-seeking-opt-and-stem-opt-extensions",
        date: new Date().toISOString(),
    },
    {
        title: "New Policy Guidance on H-1B Visas",
        summary: "A new policy memorandum was issued, clarifying the requirements for H-1B petitions, including the definition of a specialty occupation and employer-employee relationships.",
        url: "https://www.uscis.gov/working-in-the-united-states/temporary-workers/h-1b-specialty-occupations-and-fashion-models/h-1b-policy-memoranda",
        date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
    },
    {
        title: "TPS for Venezuela Extended and Redesignated",
        summary: "The Department of Homeland Security announced an 18-month extension and redesignation of Temporary Protected Status (TPS) for Venezuela.",
        url: "https://www.uscis.gov/humanitarian/temporary-protected-status/temporary-protected-status-and-deferred-enforced-departure/tps-venezuela",
        date: new Date(Date.now() - 2 * 86400000).toISOString(), 
    },
    {
        title: "I-94 Automation and Access to Travel Records",
        summary: "U.S. Customs and Border Protection (CBP) has automated Form I-94 at air and sea ports of entry. Travelers will be issued an electronic I-94 instead of a paper one.",
        url: "https://www.cbp.gov/travel/international-visitors/i-94",
        date: new Date(Date.now() - 3 * 86400000).toISOString(),
    },
    {
        title: "Green Card Interview Waiver Guidance Updated",
        summary: "USCIS updated its policy guidance regarding interview waivers for certain family-based conditional permanent residents.",
        url: "https://www.uscis.gov/newsroom/alerts/uscis-updates-guidance-on-interview-waivers-for-conditional-permanent-residents",
        date: new Date(Date.now() - 5 * 86400000).toISOString(),
    },
    {
        title: "USCIS Clarifies L-1 Intracompany Transferee Requirements",
        summary: "New guidance clarifies how USCIS evaluates evidence to determine eligibility for L-1 petitions, particularly for specialized knowledge workers.",
        url: "https://www.uscis.gov/newsroom/alerts/uscis-clarifies-guidance-on-l-1-petitions",
        date: new Date(Date.now() - 7 * 86400000).toISOString(),
    },
    {
        title: "Advance Parole Document Production Delays",
        summary: "USCIS has noted processing delays for Advance Parole documents (Form I-512L). Applicants are advised to file well in advance of planned travel.",
        url: "https://www.uscis.gov/forms/filing-guidance/tips-for-filing-form-i-131-application-for-travel-document-online",
        date: new Date(Date.now() - 10 * 86400000).toISOString(),
    },
    {
        title: "STEM OPT Hub Launched on USCIS Website",
        summary: "A new section on the USCIS website provides comprehensive information for F-1 students, employers, and school officials on the STEM OPT extension.",
        url: "https://www.uscis.gov/working-in-the-united-states/students-and-exchange-visitors/stem-opt",
        date: new Date(Date.now() - 12 * 86400000).toISOString(),
    },
     {
        title: "Passport Application Processing Times Updated",
        summary: "The Department of State has updated the processing times for U.S. passport applications. Routine processing is now estimated at 10-13 weeks.",
        url: "https://travel.state.gov/content/travel/en/passports/how-apply/processing-times.html",
        date: new Date(Date.now() - 14 * 86400000).toISOString(),
    }
];

const ImmigrationNews = () => {
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        // IMPORTANT: Replace with your actual cloud function URL
        const response = await axios.get("https://us-central1-docguard-428403.cloudfunctions.net/getUSCISNews");
        if (response.data.news && response.data.news.length > 0) {
            setNewsData(response.data.news);
        } else {
            // If no news is fetched, use the sample data
            setNewsData(sampleNews);
        }
      } catch (error) {
        console.error("Error fetching USCIS news:", error);
        // If there's an error, use the sample data
        setNewsData(sampleNews);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

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
  
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }

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
        
        .loading-container, .no-news-container {
            text-align: center;
            padding: 50px 20px;
            color: var(--muted);
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
        
        .news-source {
            font-size: 13px;
            font-weight: 600;
            color: var(--verified);
        }

        .news-title {
          font-size: 18px;
          font-weight: 700;
          margin-bottom: 10px;
          color: var(--text);
        }
        
        .news-title-link {
            text-decoration: none;
            color: inherit;
        }
        .news-title-link:hover {
            text-decoration: underline;
        }

        .news-desc {
          color: var(--muted);
          line-height: 1.6;
          margin-bottom: 16px;
        }

        .news-footer {
          display: flex;
          justify-content: space-between;
          font-size: 13px;
          color: var(--muted);
          border-top: 1px solid var(--border);
          padding-top: 12px;
          margin-top: 16px;
        }
      `}</style>

      <main>
        <h1>Latest Immigration News</h1>
        <p className="subtitle">
          Stay updated with the latest visa, immigration, and policy changes from USCIS.
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
            className={"toggle " + (notificationsEnabled ? "active" : "")}
            onClick={toggleNotifications}
          />
        </div>

        {loading ? (
          <div className="loading-container">
            <p>Loading news...</p>
          </div>
        ) : newsData.length > 0 ? (
          newsData.map((n, i) => (
            <div className="news-card" key={i}>
              <div className="card-top">
                <div className="card-icon">🛡</div>
                <div>
                  <div className="badges">
                    <span className="news-source">✔ USCIS News</span>
                  </div>
                  <a href={n.url} target="_blank" rel="noopener noreferrer" className="news-title-link">
                    <div className="news-title">{n.title}</div>
                  </a>
                </div>
              </div>
  
              <div className="news-desc">{n.summary}</div>
  
              <div className="news-footer">
                <span>📅 {formatDate(n.date)}</span>
                <a href={n.url} target="_blank" rel="noopener noreferrer">Read More</a>
              </div>
            </div>
          ))
        ) : (
          <div className="no-news-container">
            <p>No relevant news articles found at the moment. Please check back later.</p>
          </div>
        )}
      </main>
      <BottomNav />
    </>
  );
};

export default ImmigrationNews;