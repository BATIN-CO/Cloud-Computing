const Hapi = require("@hapi/hapi");
const ml = require("./ml");

const server = Hapi.server({
    host: process.env.NODE_ENV !== 'production' ? 'localhost': '0.0.0.0',
    port: 8000
  });

server.route({
  method: "POST",
  path: "/predict",
  handler: async (request, h) => {
    const imageData = request.payload.imageData;
    const model = await ml.loadModel();
    const predictions = await ml.predictImage(model, imageData);
    return { predictions };
  },
});

async function start() {
  try {
    await server.start();
    console.log("Server running on %s", server.info.uri);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

start();
