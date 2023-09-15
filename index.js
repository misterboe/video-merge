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

function mergeVideos(directoryPath, outputFilename) {
  const videoFiles = fs.readdirSync(directoryPath)
  .filter(file => file.toLowerCase().endsWith('.mp4'))
  .map(file => path.join(directoryPath, file));

  if (!videoFiles.length) {
    console.log(`Keine MP4-Dateien im Verzeichnis "${directoryPath}" gefunden.`);
    return;
  }

  let bar;

  ffmpeg()
  .on('start', () => {
    console.log(`Beginne das Zusammenführen für: ${outputFilename}`);
    bar = new ProgressBar(':bar :percent :etas', {
      total: 100,
      width: 40,
      complete: '=',
      incomplete: ' ',
    });
  })
  .on('progress', (progress) => {
    bar.update(progress.percent / 100);
  })
  .on('end', () => {
    console.log(`\nVideos wurden zu "${outputFilename}" zusammengeführt.`);
  })
  .on('error', (err) => {
    console.error(`\nFehler beim Zusammenführen: ${err.message}`);
  })
  .mergeAdd(videoFiles[0])  // erstes Video hinzufügen
      .mergeToFile(outputFilename, path.dirname(outputFilename));

  for (let i = 1; i < videoFiles.length; i++) {
    ffmpeg().mergeAdd(videoFiles[i]);  // Restliche Videos hinzufügen
  }
}

const cwd = process.cwd();
const subdirectories = fs.readdirSync(cwd, { withFileTypes: true })
.filter(dirent => dirent.isDirectory())
.map(dirent => dirent.name);

if (!subdirectories.length) {
  console.error("Keine Unterordner gefunden.");
  process.exit(1);
}

subdirectories.forEach(dir => {
  const sanitizedDir = dir.replace(/ /g, '_');  // Leerzeichen durch Unterstriche ersetzen
  const outputPath = path.join(cwd, `${sanitizedDir}.mp4`);
  mergeVideos(path.join(cwd, dir), outputPath);
});
