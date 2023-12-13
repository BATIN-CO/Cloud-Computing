const axios = require("axios");
const FormData = require('form-data');
const fs = require("fs");

const makePredictionRequest = async (request, h) => {
  try {
    const file =
      request.payload.file ||
      (request.payload.files && request.payload.files.file);
    if (!file) {
      return h.response("No file uploaded").code(400);
    }

    // Mengirim gambar langsung ke model di Google App Engine menggunakan FormData
    const form = new FormData();
    form.append('file', fs.createReadStream(file.path));

    // Kirim permintaan ke model machine learning
    const response = await axios.post(
      "http://35.219.55.29:3000/predict", form,
      {
        headers: {
          "Content-Type": `multipart/form-data; boundary=${form.getBoundary()}`,
          ...form.getHeaders(),
        },
      },
    );

    // Mendapatkan hasil prediksi dari respons model
    const prediction = response.data.prediction;

    return h.response(`Prediction: ${prediction}`);
  } catch (error) {
    console.error(error);
    return h.response("Internal Server Error").code(500);
  }
};

module.exports = { makePredictionRequest };
