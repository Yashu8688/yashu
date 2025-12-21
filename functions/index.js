
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { getStorage } = require("firebase-admin/storage");
const { getFirestore } = require("firebase-admin/firestore");
const axios = require("axios");

// Initialize CORS to allow all origins
const cors = require("cors")({ origin: true });

admin.initializeApp();

const db = getFirestore();

// Get API key from environment config. Falls back to provided key if not set.
const DEFAULT_GEMINI_API_KEY = 'AIzaSyAM58xb54sluIVYB0ybMEO2KlmyW1Bt9e8';
const getApiKey = () => {
  const fromEnv = process.env.GEMINI_API_KEY || functions.config().gemini?.api_key;
  if (fromEnv) return fromEnv;
  functions.logger.warn('Using embedded Gemini API key fallback. Consider setting GEMINI_API_KEY in environment.' );
  return DEFAULT_GEMINI_API_KEY;
};

exports.analyzeDocument = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method !== "POST") {
      return res.status(405).send("Method Not Allowed");
    }

    try {
      const GEMINI_API_KEY = getApiKey();
      
      if (!GEMINI_API_KEY) {
        functions.logger.error("API key not configured");
        return res.status(500).send("Gemini API key not configured. Please set GEMINI_API_KEY.");
      }

      const { file, documentType, uid } = req.body;

      if (!file || !documentType || !uid) {
        functions.logger.error("Request failed: Missing required fields", { body: req.body });
        return res.status(400).send("Missing required fields: file, documentType, and uid are required.");
      }

      const parts = file.split(";base64,");
      if (parts.length !== 2) {
        functions.logger.error("Request failed: Invalid file data format", { file: file.substring(0, 100) });
        return res.status(400).send("Invalid file data format. Expected a Base64-encoded data URI.");
      }
      const mimeType = parts[0].split("data:")[1];
      const base64Data = parts[1];

      if (!mimeType || !base64Data) {
        functions.logger.error("Request failed: Could not parse MIME type or data", { file: file.substring(0, 100) });
        return res.status(400).send("Invalid file data format. Could not parse MIME type or data.");
      }

      // Call Gemini API with image data (with improved retry/backoff logic)
      let response;
      let lastError;
      const maxRetries = 5;
      const baseDelayMs = 1000;

      for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
          response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
            {
              contents: [{
                parts: [
                  {
                    inlineData: {
                      mimeType: mimeType,
                      data: base64Data
                    }
                  },
                  {
                    text: `Analyze the following document which is a ${documentType}. Extract the document's start or issue date and its expiration date. Return the extracted data in a strict JSON format with two keys: 'startDate' and 'expiryDate'. Use the 'YYYY-MM-DD' format for dates. If a date is not found, return null for that key.`
                  }
                ]
              }]
            }
          );
          break; // Success
        } catch (error) {
          lastError = error;

          const status = error.response?.status;
          const retryAfterHeader = error.response?.headers?.['retry-after'];

          // If rate limited, respect Retry-After header when present, otherwise use exponential backoff with jitter
          if (status === 429) {
            let waitTimeMs = baseDelayMs * Math.pow(2, attempt);
            // Add jitter (0..500ms)
            waitTimeMs += Math.floor(Math.random() * 500);

            if (retryAfterHeader) {
              const parsed = parseInt(retryAfterHeader, 10);
              if (!isNaN(parsed)) {
                // Retry-After may be seconds
                waitTimeMs = parsed * 1000;
              }
            }

            const attemptsLeft = maxRetries - attempt - 1;
            if (attemptsLeft > 0) {
              functions.logger.warn(`Rate limited (429). Retrying in ${waitTimeMs}ms. Attempts left: ${attemptsLeft}`);
              await new Promise(resolve => setTimeout(resolve, waitTimeMs));
              continue; // retry
            }

            // Exhausted retries for 429: return informative 429 to client
            functions.logger.error("Exhausted retries due to rate limiting", { uid, status, retryAfter: retryAfterHeader });
            return res.status(429).send("Analysis rate-limited: please retry later or check your API quota.");
          }

          // For other errors, throw immediately so outer catch can handle/log them
          throw error;
        }
      }

      if (!response) {
        throw lastError || new Error("Failed to analyze document after retries");
      }

      // Extract the analysis from the response
      const analysis = response.data.candidates[0].content.parts[0].text;

      functions.logger.info("Document analysis successful", { uid: uid, analysis: analysis });
      res.status(200).send({ analysis });

    } catch (error) {
      functions.logger.error("Error analyzing document:", error.message, { uid: req.body?.uid });
      res.status(500).send(`Error analyzing document: ${error.message}`);
    }
  });
});
