const path = require("path");
const fs = require("fs/promises");
const { execFile } = require("child_process");
const { promisify } = require("util");
const execFileAsync = promisify(execFile);
const birdnetDirectory = path.resolve(__dirname, "../../birdnet");
const pythonPath = path.join(birdnetDirectory, ".venv/bin/python");

async function analyzeAudio(audioPath, originalName = "recording.wav") {
  const runDirectory = await fs.mkdtemp( path.join(birdnetDirectory, "birdnet-run-"));
  const inputDirectory = path.join(runDirectory, "input");
  const outputDirectory = path.join(runDirectory, "output");
  await fs.mkdir(inputDirectory);
  await fs.mkdir(outputDirectory);



const extension = path.extname(originalName) || ".m4a";
const sourceFile = path.join(runDirectory, `source${extension}`);
const inputFile = path.join(inputDirectory, "recording.wav");

await fs.copyFile(audioPath, sourceFile);

await execFileAsync("ffmpeg", [
  "-y",
  "-i",
  sourceFile,
  "-ar",
  "44100",
  "-ac",
  "1",
  "-c:a",
  "pcm_s16le",
  inputFile
]);




  await execFileAsync(pythonPath, ["-m", "birdnet_analyzer.analyze", inputDirectory, "-o", outputDirectory, "--rtype", "table"], { cwd: birdnetDirectory, maxBuffer: 10 * 1024 * 1024});
  
  const files = await fs.readdir(outputDirectory);
  const resultFile = files.find((file) => file.endsWith(".txt"));
  
  if(!resultFile) {
    throw new Error("BirdNET got no result");
  }
  const result = await fs.readFile( path.join(outputDirectory, resultFile), "utf8");
  await fs.rm(runDirectory, { recursive: true, force: true});
  return result;
}

module.exports = { analyzeAudio };