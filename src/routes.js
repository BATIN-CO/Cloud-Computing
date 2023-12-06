const {upImgHandler} = require('./handler');

const routes = [
  {
    method: "POST",
    path: "/",
    handler: (request, h) => {
      return "Homepage";
    },
  },
  {
    method: "POST",
    path: "/upload",
    options: {
      payload: {
        output: "stream",
        allow: "multipart/form-data",
      },
    },
    handler: upImgHandler,
  },
];

module.exports = routes;
