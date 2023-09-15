## Video-Merger-Script

Dieses Node.js-Skript ermöglicht das Zusammenführen von MP4-Dateien aus Unterordnern des aktuellen Arbeitsverzeichnisses. Das Ergebnis wird als einzelne MP4-Datei mit dem Namen des jeweiligen Unterordners (Leerzeichen durch Unterstriche ersetzt) im Hauptverzeichnis gespeichert.

### Voraussetzungen

- Node.js
- Die folgenden Homebrew-Pakete: `ffmpeg`, `fprobe`, `leptonica`, und `tesseract`. Sie können diese Pakete mit dem folgenden Befehl installieren:

  ```
  brew install ffmpeg fprobe leptonica tesseract
  ```

### Verwendung

Navigieren Sie in das Verzeichnis, das die Unterordner mit den zu verschmelzenden MP4-Dateien enthält, und führen Sie das Skript aus.

```
video-merge
```

Stellen Sie sicher, dass Sie den Skriptnamen durch den tatsächlichen Namen Ihres Skripts ersetzen.

### Funktionsweise

1. Beim Start wird überprüft, ob die erforderlichen Homebrew-Pakete installiert sind.
2. Das Skript liest die Unterordner des aktuellen Arbeitsverzeichnisses und sucht nach MP4-Dateien.
3. Jeder gefundene MP4 wird für den Zusammenführungsprozess hinzugefügt.
4. Das zusammengeführte Video wird im Hauptverzeichnis mit dem Namen des Unterordners (Leerzeichen durch Unterstriche ersetzt) als `.mp4` gespeichert.
