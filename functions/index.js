
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { getStorage } = require("firebase-admin/storage");
const { getFirestore } = require("firebase-admin/firestore");
const {
  VertexAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google-cloud/vertexai");

// Initialize CORS to allow all origins
const cors = require("cors")({ origin: true });

admin.initializeApp();

const db = getFirestore();

const vertex_ai = new VertexAI({
  project: "voyloo-190a9",
  location: "us-central1", 
});
const model = "gemini-pro-vision";

const generativeModel = vertex_ai.getGenerativeModel({
  model: model,
  generation_config: {
    max_output_tokens: 2048,
    temperature: 0.4,
    top_p: 1,
    top_k: 32,
  },
  safety_settings: [
    { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  ],
});

exports.analyzeDocument = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method !== "POST") {
      return res.status(405).send("Method Not Allowed");
    }

    try {
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

      const filePart = {
        inlineData: {
          data: base64Data,
          mimeType: mimeType,
        },
      };

      const textPart = {
        text: `Analyze the following document which is a ${documentType}. Extract the document's start or issue date and its expiration date. Return the extracted data in a strict JSON format with two keys: 'startDate' and 'expiryDate'. Use the 'YYYY-MM-DD' format for dates. If a date is not found, return null for that key.`,
      };

      const request = {
        contents: [{ role: "user", parts: [filePart, textPart] }],
      };

      const result = await generativeModel.generateContent(request);
      const analysis = result.response.candidates[0].content.parts[0].text;

      functions.logger.info("Document analysis successful", { uid: uid, analysis: analysis });
      res.status(200).send({ analysis });

    } catch (error) {
      functions.logger.error("Error analyzing document:", error, { uid: req.body.uid });
      res.status(500).send(`Error analyzing document: ${error.message}`);
    }
  });
});
