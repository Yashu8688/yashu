const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { DocumentProcessorServiceClient } = require("@google-cloud/documentai").v1;
const axios = require("axios");
const cheerio = require("cheerio");

admin.initializeApp();
const db = admin.firestore();

const documentAiClient = new DocumentProcessorServiceClient();

// Keywords for news scraping
const NEWS_KEYWORDS = [
    "passport", "visa", "i-94", "i-20", "opt", "stem opt", "ead", 
    "i-797", "h1b", "l1", "o1", "green card", "conditional green card", 
    "advance parole", "tps"
];

exports.processDocument = functions.https.onRequest(async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-control-allow-headers", "Content-Type");
  res.set("Access-Control-Allow-Methods", "POST");

  if (req.method === "OPTIONS") {
    res.status(204).send("");
    return;
  }
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  try {
    const { file: encodedImage, contentType: mimeType } = req.body;
    const name = `projects/${process.env.GCLOUD_PROJECT}/locations/us/processors/c46114d5c18b7679`;
    const request = {
      name,
      rawDocument: { content: encodedImage, mimeType: mimeType },
    };
    const [result] = await documentAiClient.processDocument(request);
    const { document } = result;

    let startDate = null;
    let endDate = null;

    const formatDate = (date) => {
      if (!date || !date.year || !date.month || !date.day) return null;
      return `${date.year}-${String(date.month).padStart(2, '0')}-${String(date.day).padStart(2, '0')}`;
    };

    if (document && document.entities) {
        for (const entity of document.entities) {
            if (entity.type === "issue_date" && entity.normalizedValue?.dateValue) {
                startDate = formatDate(entity.normalizedValue.dateValue);
            }
            if (entity.type === "expiration_date" && entity.normalizedValue?.dateValue) {
                endDate = formatDate(entity.normalizedValue.dateValue);
            }
        }
    }
    res.status(200).json({ startDate: startDate, expiryDate: endDate });
  } catch (error) {
    functions.logger.error("Error processing document:", error);
    res.status(500).send(`Error processing document: ${error.message}`);
  }
});

exports.checkExpiringDocuments = functions.pubsub.schedule('every 24 hours').onRun(async (context) => {
  const now = new Date();
  try {
    const usersSnapshot = await db.collection('users').get();
    for (const userDoc of usersSnapshot.docs) {
      const userId = userDoc.id;
      const documentsSnapshot = await db.collection('users').doc(userId).collection('documents').get();
      for (const docSnapshot of documentsSnapshot.docs) {
        const docData = docSnapshot.data();
        const expiryDate = docData.expiryDate?.toDate();
        const reminderDays = docData.reminderDays || [];

        if (expiryDate) {
          const daysUntilExpiry = Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24));
          if (reminderDays.includes(daysUntilExpiry)) {
            const existingNotification = await db.collection('users').doc(userId).collection('notifications')
              .where('documentId', '==', docSnapshot.id)
              .where('daysUntilExpiry', '==', daysUntilExpiry)
              .get();
            if (existingNotification.empty) {
              await db.collection('users').doc(userId).collection('notifications').add({
                title: `Document Expiring Soon`,
                message: `${docData.name} will expire in ${daysUntilExpiry} day${daysUntilExpiry > 1 ? 's' : ''}.`,
                type: 'expiry',
                documentId: docSnapshot.id,
                daysUntilExpiry: daysUntilExpiry,
                read: false,
                createdAt: admin.firestore.FieldValue.serverTimestamp()
              });
            }
          }
        }
      }
    }
  } catch (error) {
    functions.logger.error('Error checking expiring documents:', error);
  }
});

// Scheduled function to scrape USCIS news
exports.scrapeUSCISNews = functions.pubsub.schedule('every 6 hours').onRun(async (context) => {
    const url = 'https://www.uscis.gov/newsroom/news-releases';
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        const newsItems = [];

        $('article.uscis-news-card').each((i, element) => {
            const title = $(element).find('h3 a').text().trim();
            const link = $(element).find('h3 a').attr('href');
            const date = $(element).find('time').attr('datetime');
            const summary = $(element).find('p').text().trim();

            const fullUrl = `https://www.uscis.gov${link}`;
            const content = `${title} ${summary}`.toLowerCase();

            if (NEWS_KEYWORDS.some(keyword => content.includes(keyword))) {
                newsItems.push({ title, url: fullUrl, date, summary });
            }
        });

        for (const item of newsItems) {
            const docId = item.url.replace(/[^a-zA-Z0-9]/g, '');
            const docRef = db.collection('news').doc(docId);
            const doc = await docRef.get();
            if (!doc.exists) {
                await docRef.set({
                    ...item,
                    scrapedAt: admin.firestore.FieldValue.serverTimestamp()
                });
            }
        }
        console.log(`Scraped and saved ${newsItems.length} news items.`);
    } catch (error) {
        console.error('Error scraping USCIS news:', error);
    }
});

// Function to get scraped news for the client
exports.getUSCISNews = functions.https.onRequest(async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    if (req.method === 'OPTIONS') {
        res.set('Access-Control-Allow-Methods', 'GET');
        res.set('Access-Control-Allow-Headers', 'Content-Type');
        res.status(204).send('');
        return;
    }
    try {
        const snapshot = await db.collection('news').orderBy('date', 'desc').get();
        const news = snapshot.docs.map(doc => doc.data());
        res.status(200).json({ news });
    } catch (error) {
        console.error('Error getting USCIS news:', error);
        res.status(500).send('Error getting news.');
    }
});