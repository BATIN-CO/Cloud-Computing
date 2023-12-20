const {
  discoverHandler,
  cariBatikHandler,
  makePredictionRequest,
  objectPredict,
} = require("./handler");

const routes = [
  {
    method: "GET",
    path: "/tampil/{batikId}",
    handler: discoverHandler,
  },
  {
    method: "GET",
    path: "/cari/{searchTerm}",
    handler: cariBatikHandler,
  },
  {
    method: "POST",
    path: "/predict",
    handler: makePredictionRequest,
    options: {
      payload: {
        output: "stream",
        parse: true,
        multipart: true,
      },
      plugins: {
        "hapi-swagger": {
          payloadType: "form",
        },
      },
    },
  },
  {
    method: "POST",
    path: "/object",
    handler: objectPredict,
    options: {
      payload: {
        output: "stream",
        parse: true,
        multipart: true,
      },
      plugins: {
        "hapi-swagger": {
          payloadType: "form",
        },
      },
    },
  },
];

module.exports = routes;
