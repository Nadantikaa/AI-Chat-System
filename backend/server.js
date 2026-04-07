// backend/server.js
import express from "express";
import cors from "cors";//Allow Angular frontend to call backend
import multer from "multer";//Handle audio file uploads
import fs from "fs";//module for interacting with the file system
import OpenAI from "openai";
import dotenv from "dotenv";//Load .env

// Load .env
dotenv.config();

console.log("OPENAI_API_KEY:", process.env.OPENAI_API_KEY ? "Loaded ✅" : "Not Loaded ❌");

const app = express();
const upload = multer({ dest: "uploads/" });//uploaded files to a directory named uploads/

app.use(cors());
app.use(express.json());

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY//API key loaded from your .env file
});

// Whisper endpoint
app.post("/whisper", upload.single("file"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  try {
    console.log("📂 Received file:", req.file.path);

    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(req.file.path),
      model: "whisper-1"
    });

    console.log("Transcription result:", transcription.text);

    res.json({ text: transcription.text });

    // Delete temp file
    fs.unlinkSync(req.file.path);
  } catch (err) {
    console.error(" Whisper error:\n", JSON.stringify(err, null, 2));

    res.status(500).json({
      error: "Failed to transcribe audio",
      message: err.message,
      details: err.response ? err.response.data : err // show raw error if no response
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
});
