#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const ffmpeg = require('fluent-ffmpeg');
const ProgressBar = require('progress');

// Hinweis beim Start des Skripts
console.log('Stellen Sie sicher, dass die folgenden Pakete installiert sind: brew install ffmpeg fprobe leptonica tesseract');

// Überprüfen der Verfügbarkeit der Homebrew-Pakete
const requiredPackages = ['ffmpeg', 'fprobe', 'leptonica', 'tesseract'];

requiredPackages.forEach(pkg => {
  try {
    execSync(`brew list ${pkg}`);
  } catch (error) {
    console.error(`Das Paket ${pkg} ist nicht über Homebrew installiert. Bitte installieren Sie es.`);
    process.exit(1);
  }
});

async function mergeVideos(directoryPath, outputFilename) {
  return new Promise((resolve, reject) => {
    const videoFiles = fs.readdirSync(directoryPath)
    .filter(file => file.toLowerCase().endsWith('.mp4'))
    .map(file => path.join(directoryPath, file));

    if (!videoFiles.length) {
      console.log(`Keine MP4-Dateien im Verzeichnis "${directoryPath}" gefunden.`);
      resolve();
      return;
    }

    // Create a list for the concat demuxer
    const listFilePath = path.join(directoryPath, 'mylist.txt');
    const listContent = videoFiles.map(file => `file '${file}'`).join('\n');
    fs.writeFileSync(listFilePath, listContent);

    ffmpeg()
    .input(listFilePath)
    .inputOptions(['-f concat', '-safe 0'])
    .outputOptions(['-c copy'])
    .on('start', () => {
      console.log(`Beginne das Zusammenführen für: ${outputFilename}`);
    })
    .on('end', () => {
      console.log(`\nVideos wurden zu "${outputFilename}" zusammengeführt.`);
      fs.unlinkSync(listFilePath);  // Remove the temporary list file
      resolve();
    })
    .on('error', (err) => {
      console.error(`\nFehler beim Zusammenführen: ${err.message}`);
      reject(err);
    })
    .save(outputFilename);
  });
}


const cwd = process.cwd();
const subdirectories = fs.readdirSync(cwd, { withFileTypes: true })
.filter(dirent => dirent.isDirectory())
.map(dirent => dirent.name);

if (!subdirectories.length) {
  console.error("Keine Unterordner gefunden.");
  process.exit(1);
}

(async function() {
  for (const dir of subdirectories) {
    const sanitizedDir = dir.replace(/ /g, '_');  // Leerzeichen durch Unterstriche ersetzen
    const outputPath = path.join(cwd, `${sanitizedDir}.mp4`);
    await mergeVideos(path.join(cwd, dir), outputPath);
  }
})();
