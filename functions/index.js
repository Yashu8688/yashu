const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { DocumentProcessorServiceClient } = require("@google-cloud/documentai").v1;

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
    
    const name = `projects/${process.env.GCLOUD_PROJECT}/locations/us/processors/2eaf2a93011f7bb4`;

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
