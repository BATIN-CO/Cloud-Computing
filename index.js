const Hapi = require("@hapi/hapi");
const routes = require("./src/routes.js");
const Inert = require('@hapi/inert');
const Multer = require('multer');
require('@google-cloud/debug-agent').start()

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT || 8000,
    host: "0.0.0.0",
    routes: {
      cors: {
        origin: ["*"],
      },
    },
  });

  await server.register(Inert);

  server.route({
    method: 'GET',
    path: '/',
    handler: (request, h) => {
      console.log('Response success');
      return h.response('Response Success!');
    },
  });

  // Konfigurasi multer
  const storage = Multer.memoryStorage();
  const upload = Multer({ storage: storage });

  server.route(routes);

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
