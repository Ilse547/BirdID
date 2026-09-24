const express = require("express");
const path = require("path");
const fs = require("fs");
const multer = require("multer");

const app = express();
const PORT = 3000;

app.use(express.json());

const uploadDirectory = path.join(__dirname, 'upload');
if(!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory);
}
const upload = multer({ dest: uploadDirectory});

app.get("/", (req, res) => {
  res.json({
    message: "Hello from the backend"
  });
});

app.post("/upload", upload.single("audio"), (req, res) => {
  if(!req.file) {
    return res.status(400).json({
      error: "No audio file uploaded"
    });
  }
  res.json({
    message: "audio uploadedd",
    filename: req.file.filename,
    path: req.file.path,
    originalName: req.file.originalname
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
