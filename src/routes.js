const {
  // upImageHandler,
  discoverHandler,
  cariBatikHandler,
  makePredictionRequest,
  // discoverFtr,
  // testUp,
} = require("./handler");
const { findPIHandler } = require("../map/placeIdFinder");
// const { makePredictionRequest } = require("./modelConnection");
// const { tampilkan } = require("../fstore/fstr");

const routes = [
  {
    method: "GET",
    path: "/tampil/{batikId}",
    handler: discoverHandler,
  },
  // PENDING PUSING FIRESTORE
  // {
  //   method: "GET",
  //   path: "/tampil",
  //   handler: tampilkan,
  // },
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
          output: 'stream',
          parse: true,
          multipart: true,
      },
      plugins: {
          'hapi-swagger': {
              payloadType: 'form',
          },
      },
  },
  },
];

module.exports = routes;
