const {
  // upImageHandler,
  discoverHandler,
  detailBatikHandler,
  cariBatikHandler,
  cariTokoHandler,
  tampilTokoHandler,
  testUp,
} = require("./handler");
const { imgUpHandler } = require("./gcs");

const routes = [
  {
    method: "GET",
    path: "/tampil",
    handler: discoverHandler,
  },
  {
    method: "GET",
    path: "/tampil/{batikId}",
    handler: detailBatikHandler,
  },
  {
    method: "GET",
    path: "/cari/{searchTerm}",
    handler: cariBatikHandler,
  },
  {
    method: "GET",
    path: "/cariToko/{searchTerm}",
    handler: cariTokoHandler,
  },
  {
    method: "GET",
    path: "/tampilToko",
    handler: tampilTokoHandler,
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
];

module.exports = routes;
