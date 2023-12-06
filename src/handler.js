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

const upImageHandler = (request, h) => {
  try {
    const file = request.payload.file;

    if (!file) {
      return h.response("No file uploaded").code(400);
    }

    const filename = file.hapi.filename;
    const data = file._data;

    // Simpan berkas di GCS
    const fileUpload = bucket.file(filename);
    const stream = fileUpload.createWriteStream({
      metadata: {
        contentType: file.hapi.headers["content-type"],
      },
    });

    stream.on("error", (err) => {
      console.error(err);
      return h.response("Upload failed").code(500);
    });

    stream.on("finish", () => {
      return h.response("Upload success").code(200);
    });

    stream.end(data);
  } catch (err) {
    console.error(err);
    return h.response("Internal Server Error").code(500);
  }
};

module.exports = {upImageHandler};