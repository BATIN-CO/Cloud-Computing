const { bucket } = require("./gcs");
const { createConnection } = require("./sql");

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

const discoverHandler = async (request, h) => {
  try {
    const connection = await createConnection();

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
  } catch (err) {
    console.error(err);
    return h
      .response({ erro: true, message: "Internal Server Error" })
      .code(500);
  }
};

const detailBatikHandler = async (request, h) => {
  try {
    const connection = await createConnection();
    const { batikId } = request.params;

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
      .response({ erro: true, message: "Internal Server Error" })
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

module.exports = { upImageHandler, discoverHandler, detailBatikHandler, cariBatikHandler };
