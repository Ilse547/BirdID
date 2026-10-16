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
app.get("/recording/me", authenticateToken, async (req, res) => {
  try {
    const result = await db.query(
      `SELECT
         r.id,
         r.original_name,
         r.created_at,
         ir.common_name,
         ir.scientific_name,
         ir.confidence,
         ir.start_seconds,
         ir.end_seconds
       FROM recordings r
       LEFT JOIN identification_results ir
         ON ir.recording_id = r.id
       WHERE r.user_id = $1
       ORDER BY r.created_at DESC`,
      [req.user.userId]
    );

    const recordings = [];
    for (const row of result.rows) {
      let recording = recordings.find(
          (item) => item.id === row.id
      );
      if (!recording) {
        recording = {
          id: row.id,
          created_at: row.created_at,
          location: "no poisiton",
          results: []
        };
        recordings.push(recording);
      }

      if (row.common_name) {
        recording.results.push({
          common_name: row.common_name,
          scientific_name: row.scientific_name,
          confidence: row.confidence,
          start_seconds: row.start_seconds,
          end_seconds: row.end_seconds
        });
      }
    }
  res.json({ recordings }); 
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "not able to load recoridngs" });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
