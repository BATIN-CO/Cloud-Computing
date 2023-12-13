const {
  // upImageHandler,
  discoverHandler,
  cariBatikHandler,
  // discoverFtr,
  // testUp,
} = require("./handler");
const { imgUpHandler } = require("./gcs");
const { findPIHandler } = require("../map/placeIdFinder");
const { makePredictionRequest } = require("./modelConnection");
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
    method: "GET",
    path: "/placeIdFinder",
    handler: findPIHandler,
  },
  // HOLDING DULU
  {
    method: "POST",
    path: "/upload",
    options: {
      payload: {
        output: "stream",
        allow: "multipart/form-data",
      },
    },
    handler: imgUpHandler,
  },
  // HOLDING DULU
  {
    method: 'POST',
    path: '/predictAPI',
    handler: makePredictionRequest,
  },
];

module.exports = routes;
