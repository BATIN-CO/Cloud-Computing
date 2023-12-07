const { Storage } = require('@google-cloud/storage');
const Multer = require('multer');

// Konfigurasi Storage GCS
const storage = new Storage({
  projectId: 'test-1-405003',
  keyFilename: '../test-1-405003-c8cca3835c96.json',
});

const bucketName = 'test-bucket-yosia1';
const bucket = storage.bucket(bucketName);

// Konfigurasi Multer untuk mengelola upload
const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // Batasan ukuran berkas (5 MB)
  },
});

module.exports = {bucket};