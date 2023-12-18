// const { bucket } = require("./gcs");
const { createConnection } = require("./sql");
const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");

// const upImageHandler = async (request, h) => {
//   try {
//     const { img } = request.payload;

//     if (!img) {
//       return h.response("No file uploaded").code(400);
//     }

//     const file = img;
//     const name = img.hapi.filename;
//     const path = `./images/batik/${name}`;
//     const pathFinder = `images/batik/${name}`;
//     const data = file._data;

//     // Cek apakah file sudah ada
//     const filesInDir = await readdir("./images/batik");
//     if (filesInDir.includes(name)) {
//       return h.response("File already exists").code(409);
//     }

//     // Simpan berkas di GCS
//     const fileUpload = bucket.file(name);
//     const stream = fileUpload.createWriteStream({
//       metadata: {
//       contentType: file.hapi.headers["content-type"],
//     },
//   });

//     stream.on("error", (err) => {
//       console.error(err);
//       return h.response("Upload failed").code(500);
//     });

//     stream.on("finish", () => {
//       return h.response("Upload success").code(200);
//     });

//     stream.end(data);
//   } catch (err) {
//     console.error(err);
//     return h.response("Internal Server Error").code(500);
//   }
// };

// const testUp = async (request, h) => {
//   try {
//     const { photo } = request.payload;

//     if (!photo) {
//       return h.response("Upload Picture Failed");
//     }

//     const file = photo;
//     const name = file.hapi.filename;
//     const path = `./images/batik/${name}`;
//     const pathFinder = `images/batik/${name}`;

//     // Cek apakah file sudah ada
//     const filesInDir = await readdir("./images/batik");
//     if (filesInDir.includes(name)) {
//       return h.response("File already exists").code(409);
//     }

//     // Jika tidak ada, simpan file
//     const fileStream = fs.createWriteStream(path);
//     await file.pipe(fileStream);

//   } catch (error) {
//     // Log error di konsol atau tempatkan di file log
//     console.error("Error occurred while uploading file:", error);

//     // Memberikan respons yang lebih ramah pengguna
//     return h.response("Something went wrong while uploading the file").code(500);
//   }
// };

// handlers/firestoreHandler.js

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
    // // Kirim permintaan ke model machine learning
    // const response = await axios.post(
    //   "https://model-api-motif-dot-capstone-ch2-ps526.et.r.appspot.com/predict",
    //   request.payload,
    //   {
    //     headers: {
    //       "Content-Type": "multipart/form-data",
    //     },
    //   }
    // );

    // // Mendapatkan hasil prediksi dari respons model
    // const prediction = response.data;

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

    return h.response(`Prediction: ${prediction}`);
  } catch (error) {
    console.error(error);
    return h.response("Internal Server Error").code(500);
  }
};

module.exports = {
  // upImageHandler,
  discoverHandler,
  cariBatikHandler,
  makePredictionRequest,
  // testUp,
};
