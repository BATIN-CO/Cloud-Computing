const { createConnection } = require("./sql");
const axios = require("axios");
const FormData = require("form-data");

const discoverHandler = async (request, h) => {
  try {
    const connection = await createConnection();
    const { batikId } = request.params;

    if (batikId == 0) {
      const [rows, fields] = await connection.execute(
        "SELECT batikId, nama, asal, gambar FROM informasi;"
      );

      const response = h.response({
        error: false,
        message: "Menampilkan informasi batik berhasil",
        data: {
          rows,
        },
      });
      response.code(200);
      return response;
    }

    const [rows, fields] = await connection.execute(
      "SELECT * FROM informasi WHERE batikId = ?;",
      [batikId]
    );

    return {
      error: false,
      message: "Menampilkan detail batik berhasil",
      data: {
        rows,
      },
    };
  } catch (err) {
    console.error(err);
    return h
      .response({ error: true, message: "Internal Server Error" })
      .code(500);
  }
};

const cariBatikHandler = async (request, h) => {
  try {
    const connection = await createConnection();
    const { searchTerm } = request.params;

    const [rows, fields] = await connection.execute(
      `SELECT * FROM informasi WHERE nama LIKE '%${searchTerm}%'`
    );

    if (rows == "") {
      return {
        error: true,
        message: "Batik tidak ditemukan",
        data: {
          rows,
        },
      };
    }

    return {
      error: false,
      message: "Pencarian batik berhasil",
      data: {
        rows,
      },
    };
  } catch (err) {
    console.error(err);
    return h
      .response({ erro: true, message: "Internal Server Error" })
      .code(500);
  }
};

const makePredictionRequest = async (request, h) => {
  try {
    const data = new FormData();
    const imageBuffer = request.payload.picture._data; // Ganti dengan path gambar dari permintaan Hapi.js
    data.append("picture", imageBuffer, { filename: "image.jpg" });

    const response = await axios.post(
      "https://model-api-motif-dot-capstone-ch2-ps526.et.r.appspot.com/predict",
      data,
      {
        headers: {
          ...data.getHeaders(),
        },
      }
    );

    const prediction = response.data;

    const responsePredict = h.response({
      error: false,
      message: "Identifikasi batik berhasil",
      message: "Identifikasi batik berhasil",
      prediction,
    });
    responsePredict.code(200);

    return responsePredict;
  } catch (error) {
    console.error(error);
    const responsePredict = h.response({
      error: true,
      message: "Internal Server Error",
    });
    responsePredict.code(500);

    return responsePredict;
  }
};

const objectPredict = async (request, h) => {
  try {
    const data = new FormData();
    const imageBuffer = request.payload.picture._data; // Ganti dengan path gambar dari permintaan Hapi.js
    data.append("picture", imageBuffer, { filename: "image.jpg" });

    const response = await axios.post(
      "http://35.219.11.226:3689/object",
      data,
      {
        headers: {
          ...data.getHeaders(),
        },
      }
    );

    const prediction = response.data;
    const responsePredict = h.response({
      error: false,
      message: "Identifikasi batik berhasil",
      prediction,
    });
    responsePredict.code(200);

    return responsePredict;
  } catch (error) {
    console.error(error);
    const responsePredict = h.response({
      error: true,
      message: "Internal Server Error",
    });
    responsePredict.code(500);

    return responsePredict;
  }
};

module.exports = {
  discoverHandler,
  cariBatikHandler,
  makePredictionRequest,
  objectPredict,
};
