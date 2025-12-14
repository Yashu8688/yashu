const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { DocumentProcessorServiceClient } = require("@google-cloud/documentai").v1;
const axios = require("axios");
const cheerio = require("cheerio");

admin.initializeApp();

const documentAiClient = new DocumentProcessorServiceClient();

exports.processDocument = functions.https.onRequest(async (req, res) => {
  // Set CORS headers for preflight and actual requests
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-control-allow-headers", "Content-Type");
  res.set("Access-Control-Allow-Methods", "POST");

  if (req.method === "OPTIONS") {
    functions.logger.info("Handling OPTIONS request");
    res.status(204).send("");
    return;
  }

  if (req.method !== "POST") {
    functions.logger.warn(`Unexpected method: ${req.method}`);
    return res.status(405).send("Method Not Allowed");
  }

  try {
    functions.logger.info("Received file for processing.");
    const fileBuffer = req.rawBody;
    const encodedImage = fileBuffer.toString("base64");
    const mimeType = req.get("content-type") || "application/pdf";
    
    const name = `projects/${process.env.GCLOUD_PROJECT}/locations/us/processors/c46114d5c18b7679`;

    const request = {
      name,
      rawDocument: {
        content: encodedImage,
        mimeType: mimeType,
      },
    };

    functions.logger.info("Sending request to Document AI...");
    const [result] = await documentAiClient.processDocument(request);
    const { document } = result;
    functions.logger.info("Document AI processing complete.");

    let startDate = null;
    let endDate = null;

    const formatDate = (date) => {
      if (!date || !date.year || !date.month || !date.day) {
        return null;
      }
      const year = date.year;
      const month = String(date.month).padStart(2, '0');
      const day = String(date.day).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    if (document && document.entities) {
        for (const entity of document.entities) {
            if (entity.type === "issue_date" && entity.normalizedValue && entity.normalizedValue.dateValue) {
                startDate = formatDate(entity.normalizedValue.dateValue);
            }
            if (entity.type === "expiration_date" && entity.normalizedValue && entity.normalizedValue.dateValue) {
                endDate = formatDate(entity.normalizedValue.dateValue);
            }
        }
    }

    functions.logger.info(`Extracted dates: Start - ${startDate}, End - ${endDate}`);

    res.status(200).json({
      startDate: startDate,
      expiryDate: endDate,
    });

  } catch (error) {
    functions.logger.error("Error processing document:", error);
    res.status(500).send(`Error processing document: ${error.message}`);
  }
});

// Scheduled function to check for expiring documents and send notifications
exports.checkExpiringDocuments = functions.pubsub.schedule('every 24 hours').onRun(async (context) => {
  const now = new Date();
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  try {
    // Get all users
    const usersSnapshot = await db.collection('users').get();

    for (const userDoc of usersSnapshot.docs) {
      const userId = userDoc.id;

      // Get user's documents
      const documentsSnapshot = await db.collection('users').doc(userId).collection('documents').get();

      for (const docSnapshot of documentsSnapshot.docs) {
        const docData = docSnapshot.data();
        const expiryDate = docData.expiryDate?.toDate();
        const reminderDays = docData.reminderDays || [];

        if (expiryDate) {
          const daysUntilExpiry = Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24));

          // Check if we need to send a reminder for any of the selected days
          if (reminderDays.includes(daysUntilExpiry)) {
            // Check if notification already exists for this document and days
            const existingNotification = await db.collection('users').doc(userId).collection('notifications')
              .where('documentId', '==', docSnapshot.id)
              .where('daysUntilExpiry', '==', daysUntilExpiry)
              .get();

            if (existingNotification.empty) {
              // Create notification
              await db.collection('users').doc(userId).collection('notifications').add({
                title: `Document Expiring Soon`,
                message: `${docData.name} will expire in ${daysUntilExpiry} day${daysUntilExpiry > 1 ? 's' : ''}. Please renew or update your document.`,
                type: 'expiry',
                documentId: docSnapshot.id,
                daysUntilExpiry: daysUntilExpiry,
                read: false,
                createdAt: admin.firestore.FieldValue.serverTimestamp()
              });

              functions.logger.info(`Notification created for user ${userId}, document ${docSnapshot.id}, ${daysUntilExpiry} days until expiry`);
            }
          }
        }
      }
    }

    functions.logger.info('Expiring documents check completed');
  } catch (error) {
    functions.logger.error('Error checking expiring documents:', error);
  }
});

// Function to scrape USCIS news
exports.scrapeUSCISNews = functions.https.onRequest(async (req, res) => {
  // Set CORS headers
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "GET");
  res.set("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(204).send("");
    return;
  }

  if (req.method !== "GET") {
    return res.status(405).send("Method Not Allowed");
  }

  try {
    const URL = "https://www.uscis.gov/newsroom/all-news";
    const KEYWORDS = ["h1-b", "opt", "visa", "green card"];

    const response = await axios.get(URL, { timeout: 10000 });
    const $ = cheerio.load(response.data);

    const results = [];

    // USCIS news titles are usually inside <a> tags
    $('a[href]').each((index, element) => {
      const title = $(element).text().trim();
      let href = $(element).attr('href');

      if (!title) return;

      const titleLower = title.toLowerCase();

      if (KEYWORDS.some(keyword => titleLower.includes(keyword))) {
        if (href && href.startsWith("/")) {
          href = "https://www.uscis.gov" + href;
        }

        results.push({
          title: title,
          url: href
        });
      }
    });

    // Shuffle results
    for (let i = results.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [results[i], results[j]] = [results[j], results[i]];
    }

    res.status(200).json({
      news: results
    });

  } catch (error) {
    functions.logger.error("Error scraping USCIS news:", error);
    res.status(500).send(`Error scraping news: ${error.message}`);
  }
});
