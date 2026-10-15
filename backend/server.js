const express = require("express");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const { analyzeAudio } = require("./services/birdnetService");
const db = require("./db/database");
const authRoutes = require("./routes/authRoutes");
const authenticateToken = require("./middleware/authMid");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use("/auth", authRoutes);

const uploadDirectory = path.join(__dirname, 'upload');
if(!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory);
}
const upload = multer({ dest: uploadDirectory});

app.post("/upload", authenticateToken, upload.single("audio"), async (req, res) => {

  if (!req.file) {
    return res.status(400).json({ error: "no audio wsa uploaded" });
  }
  console.log("Upload received:", req.file.originalname);
  try {
    const birdnetResults = await analyzeAudio( req.file.path, req.file.originalname );

    const recordingResult = await db.query(
      `INSERT INTO recordings (user_id, original_name, stored_path)
      VALUES ($1, $2, $3)
      RETURNING id`,
      [req.user.userId, req.file.originalname, req.file.path]
    );
    const recordingId = recordingResult.rows[0].id;
    for (const result of birdnetResults) {
      await db.query(
        `INSERT INTO identification_results
        (recording_id, common_name, scientific_name, confidence, start_seconds, end_seconds)
        VALUES ($1, $2, $3, $4, $5, $6)`,
        [ recordingId, result[3], result[4], Number(result[6]), Number(result[1]), Number(result[2]) ]);
    }
    console.log("BirdNET finished");
    res.json({ message: "audio analyzed", results: birdnetResults });

  } catch (error) {

    console.error(error);
    res.status(500).json({ error: "BirdNET failed" });
  }

}); 

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
