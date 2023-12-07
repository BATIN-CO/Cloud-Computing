const {upImgHandler,
  discoverHandler,
  detailBatikHandler,
  cariBatikHandler} = require('./handler');

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
  // HOLDING DULU
  // {
  //   method: "POST",
  //   path: "/upload",
  //   options: {
  //     payload: {
  //       output: "stream",
  //       allow: "multipart/form-data",
  //     },
  //   },
  //   handler: upImgHandler,
  // },
  // HOLDING DULU
];

module.exports = routes;
