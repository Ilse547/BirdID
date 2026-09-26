const express = require("express");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const { analyzeAudio } = require("./services/birdnetService");

const app = express();
const PORT = 3000;

app.use(express.json());

const uploadDirectory = path.join(__dirname, 'upload');
if(!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory);
}
const upload = multer({ dest: uploadDirectory});

app.post("/upload", upload.single("audio"), async (req, res) => {

  if (!req.file) {
    return res.status(400).json({ error: "no audio wsa uploaded" });
  }
  console.log("Upload received:", req.file.originalname);
  try {
    const birdnetResults = await analyzeAudio( req.file.path, req.file.originalname );
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
