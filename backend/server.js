const express = require("express");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const { analyzeAudio } = require("./services/birdnetService");
const db = require("./db/database");
const authRoutes = require("./routes/authRoutes");
const authenticateToken = require("./middleware/authMid");
const userRoutes = require("./routes/userRoutes");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use("/auth", authRoutes);
app.use("/users", userRoutes);

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
  let client;
  try {
    const birdnetResults = await analyzeAudio( req.file.path, req.file.originalname );
    const latitude = req.body.latitude
      ? Number(req.body.latitude)
      : null;
    const longitude = req.body.longitude
      ? Number(req.body.longitude)
      : null;
    const region = req.body.region || null;
    client = await db.connect();
    await client.query("BEGIN");
    const recordingResult = await client.query(
      `INSERT INTO recordings
      (user_id, original_name, stored_path, latitude, longitude, region)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id`,
      [
        req.user.userId,
        req.file.originalname,
        req.file.path,
        latitude,
        longitude,
        region
      ]
    );
    const recordingId = recordingResult.rows[0].id;
    for (const result of birdnetResults) {
      await client.query(
        `INSERT INTO identification_results
        (recording_id, common_name, scientific_name, confidence, start_seconds, end_seconds)
        VALUES ($1, $2, $3, $4, $5, $6)`,
        [ recordingId, result[7], result[8], Number(result[9]), Number(result[3]), Number(result[4]) ]);
    }
    const resultsForApp = birdnetResults.map((result) => {
      const appResult = [...result];
      appResult[3] = result[7];
      appResult[6] = Number(result[9]);
      return appResult;
    });
    await client.query("COMMIT");
    client.release();
    client = null;
    console.log("BirdNET finished");
    res.json({ message: "audio analyzed",recordingId,results: resultsForApp });
  } catch (error) {
    if (client) {
      await client.query("ROLLBACK");
      client.release();
    }
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
        r.latitude,
        r.longitude,
        r.region,
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
          location: row.region || "locaiton not found",
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

app.get("/recording/explore", authenticateToken, async (req, res) => {
  try {
    const result = await db.query(
      `WITH latest AS (SELECT r.id, r.created_at, r.region, u.username FROM recordings r JOIN users u ON u.id = r.user_id ORDER BY r.created_at DESC LIMIT 200)
      SELECT l.id ,l.created_at,l.region, l.username,ir.common_name, ir.scientific_name,ir.confidence
      FROM latest l
      LEFT JOIN identification_results ir ON ir.recording_id = l.id
      ORDER BY l.created_at DESC`
    );
    const recordings = [];
    for (const row of result.rows) {
      let recording = recordings.find((item) => item.id === row.id);
      if (!recording) {
        recording = {
          id: row.id,
          username: row.username,
          created_at: row.created_at,
          location: row.region || "location not found",
          results: []
        };
        recordings.push(recording);
      }
      if (row.common_name) {
        recording.results.push({
          common_name: row.common_name,
          scientific_name: row.scientific_name,
          confidence: row.confidence
        });
      }
    }
    res.json({ recordings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "cannot load obvservations" });
  }
});

app.get("/recording/feed", authenticateToken, async (req, res) => {
  try {
    const result = await db.query(
      `WITH feed AS (
        SELECT r.id, r.created_at, r.region, u.username
        FROM recordings r
        JOIN users u ON u.id = r.user_id
        WHERE EXISTS (SELECT 1 FROM user_follows f WHERE f.follower_id = $1 AND f.following_id = r.user_id )
        ORDER BY r.created_at DESC
        LIMIT 100
      )
      SELECT feed.id, feed.created_at, feed.region,feed.username, ir.common_name, ir.scientific_name,ir.confidence
      FROM feed
      LEFT JOIN identification_results ir ON ir.recording_id = feed.id
      ORDER BY feed.created_at DESC`,
      [req.user.userId]
    );
    const recordings = [];
    for (const row of result.rows) {
      let recording = recordings.find((item) => item.id === row.id);
      if (!recording) {
        recording = {
          id: row.id,
          username: row.username,
          created_at: row.created_at,
          location: row.region || "location not found",
          results: []
        };
        recordings.push(recording);
      }
      if (row.common_name) {
        recording.results.push({
          common_name: row.common_name,
          scientific_name: row.scientific_name,
          confidence: row.confidence
        });
      }
    }
    res.json({ recordings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "cannot to load feed" });
  }
});
app.get("/stats/me", authenticateToken, async (req, res) => {
  try {
    const totals = await db.query(
      `SELECT COUNT(DISTINCT r.id) AS total_observations, COUNT(DISTINCT ir.common_name) AS unique_birds
      FROM recordings r
      LEFT JOIN identification_results ir ON ir.recording_id = r.id
      WHERE r.user_id = $1`,
      [req.user.userId]
    );
    const topBirds = await db.query(
      `SELECT common_name, sightings, rank FROM (
        SELECT ir.common_name, COUNT(DISTINCT ir.recording_id) AS sightings, RANK() OVER (ORDER BY COUNT(DISTINCT ir.recording_id) DESC) AS rank
        FROM recordings r
        JOIN identification_results ir ON ir.recording_id = r.id
        WHERE r.user_id = $1
        GROUP BY ir.common_name
      ) ranked
      WHERE rank <= 5
      ORDER BY rank, common_name`,
      [req.user.userId]
    );
    res.json({
      total_observations: Number(totals.rows[0].total_observations),
      unique_birds: Number(totals.rows[0].unique_birds),
      top_birds: topBirds.rows.map((row) => ({
        common_name: row.common_name,
        sightings: Number(row.sightings),
        rank: Number(row.rank)
      }))
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "not able to load statistics" });
  }
});
app.get("/recording/:id", async (req, res) => {
  try {
    const recordingId = Number(req.params.id);
    if (!Number.isInteger(recordingId)) {
      return res.status(400).json({ error: "observation not found" });
    }
    const result = await db.query(
      `SELECT r.id,r.created_at, r.region, u.username, ir.common_name,ir.scientific_name, ir.confidence
      FROM recordings r
      JOIN users u ON u.id = r.user_id
      LEFT JOIN identification_results ir ON ir.recording_id = r.id
      WHERE r.id = $1`,
      [recordingId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "observation not found" });
    }
    const first = result.rows[0];
    const recording = {
      id: first.id,
      username: first.username,
      created_at: first.created_at,
      location: first.region || "location not found",
      results: []
    };
    for (const row of result.rows) {
      if (row.common_name) {
        recording.results.push({
          common_name: row.common_name,
          scientific_name: row.scientific_name,
          confidence: row.confidence
        });
      }
    }
    res.json({ recording });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "not able to load observation" });
  }
});
app.get("/recording/:id/audio", async (req, res) => {
  try {
    const recordingId = Number(req.params.id);
    if (!Number.isInteger(recordingId)) {
      return res.status(400).json({ error: "observation not found" });
    }
    const result = await db.query(
      "SELECT stored_path FROM recordings WHERE id = $1",
      [recordingId]
    );
    if (result.rows.length === 0 || !result.rows[0].stored_path) {
      return res.status(404).json({ error: "audio not found" });
    }
    res.set("Content-Type", "audio/mp4");
    res.sendFile(path.resolve(result.rows[0].stored_path));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "not able to load audio" });
  }
});
app.get("/app/version", (req, res) => {
  res.json({ minAppVersion: "1.0.0" });
});


app.get("/observation/:id", (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).send("Invalid observation id");
  }
  res.type("html").send(`
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>Bird ID observation</title>
      <style>
      body { font-family: sans-serif; margin: 0; padding: 24px; background: #f5f7f5; color: #111; }
      h1 { font-size: 22px; }
      .meta { color: #555; margin-bottom: 16px; }
      .bird { padding: 10px 0; border-bottom: 1px solid #ddd; }
      .bird a { color: #1a6b3c; font-weight: bold; }
      audio { width: 100%; margin: 16px 0; }
      .error { color: #b00020; }
      </style>
    </head>
    <body>
      <h1>Shared observation</h1>
      <div id="content">Loading...</div>
      <script>
        const id = ${id};
        const content = document.getElementById("content");
        const el = (tag, text, className) => {
          const node = document.createElement(tag);
          if (text !== undefined) node.textContent = text;
          if (className) node.className = className;
          return node;
        };
        fetch("/recording/" + id)
          .then((response) => response.json().then((data) => ({ ok: response.ok, data })))
          .then(({ ok, data }) => {
            if (!ok) throw new Error(data.error || "Observation not found");
            const rec = data.recording;
            content.textContent = "";
            content.appendChild(el("div", rec.username + " · " + new Date(rec.created_at).toLocaleDateString("de-DE"), "meta"));
            content.appendChild(el("div", "📍 " + rec.location, "meta"));
            rec.results.forEach((result) => {
              const row = el("div", undefined, "bird");
              const link = el("a", result.common_name);
              link.href = "https://en.wikipedia.org/w/index.php?search=" + encodeURIComponent(result.common_name);
              link.target = "_blank";
              link.rel = "noopener";
              row.appendChild(link);
              row.appendChild(el("span", " " + (Number(result.confidence) * 100).toFixed(1) + "%"));
              content.appendChild(row);
            });
            const audio = document.createElement("audio");
            audio.controls = true;
            audio.src = "/recording/" + id + "/audio";
            content.appendChild(audio);
          })
          .catch((error) => {
            content.textContent = error.message;
            content.className = "error";
          });
      </script>
    </body>
  </html>`
  );
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
