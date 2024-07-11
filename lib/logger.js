/*
const Logger = require('./logger');
const path = require('path');

## Temel log dizinini belirleme
const baseLogDir = path.join(__dirname, 'logs');

## Logger sınıfından bir nesne oluşturma
const logger = new Logger(baseLogDir);

## Bilgi mesajı loglama
logger.info('Uygulama başlatıldı');

## Uyarı mesajı loglama
logger.warn('Bu bir uyarı mesajıdır');


*/




const fs = require("fs");
const path = require("path");

class Logger {
  constructor(baseLogDir) {
    // Temel log dizinini belirleme
    this.baseLogDir = baseLogDir;

    // Logger ana dizinini oluşturma
    if (!fs.existsSync(baseLogDir)) {
      fs.mkdirSync(baseLogDir, { recursive: true });
    }
  }

  log(message, level = "INFO") {
    const now = new Date();
    const date = now.toISOString().split("T")[0];
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    // Günlük log klasörünü oluşturma
    const dailyLogDir = path.join(this.baseLogDir, date);
    if (!fs.existsSync(dailyLogDir)) {
      fs.mkdirSync(dailyLogDir, { recursive: true });
    }

    // Log mesajını oluşturma (tarih, seviye ve mesaj)
    const logMessage = {
      timestamp: now.toISOString(),
      level: level,
      message: message,
    };

    // JSON dosyasına yazma
    const logFileName = `${hours}-${minutes}-${seconds}.${level.toLowerCase()}.json`;
    const logFilePath = path.join(dailyLogDir, logFileName);

    // Dosya yoksa oluştur ve log mesajını ekle
    if (!fs.existsSync(logFilePath)) {
      fs.writeFileSync(logFilePath, JSON.stringify([logMessage], null, 2));
    } else {
      // Dosya varsa mevcut içeriği oku, yeni mesajı ekle ve tekrar yaz
      const logFileContent = fs.readFileSync(logFilePath);
      const logArray = JSON.parse(logFileContent);
      logArray.push(logMessage);
      fs.writeFileSync(logFilePath, JSON.stringify(logArray, null, 2));
    }
  }

  // Bilgi mesajı loglama
  info(message) {
    this.log(message, "INFO");
  }

  // Uyarı mesajı loglama
  warn(message) {
    this.log(message, "WARN");
  }

  // Hata mesajı loglama
  error(message) {
    this.log(message, "ERROR");
  }
}

// Logger sınıfını dışa aktarma
module.exports = Logger;
