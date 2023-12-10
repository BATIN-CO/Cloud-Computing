const Hapi = require("@hapi/hapi");
const routes = require("./src/routes.js");
require('@google-cloud/debug-agent').start()

const init = async () => {
  const server = Hapi.server({
    port: 7000,
    host: "localhost",
    routes: {
      cors: {
        origin: ["*"],
      },
    },
  });

  server.route({
    method: 'GET',
    path: '/',
    handler: (request, h) => {
      console.log('Response success');
      // Mengirim respons "Response Success!" ke klien
      return h.response('Response Success!');
    },
  });

  await server.route(routes);

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
