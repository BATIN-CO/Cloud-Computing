const tf = require("@tensorflow/tfjs-node");

async function loadModel() {
  const model = await tf.loadLayersModel(
    "https://storage.googleapis.com/model-ch2-ps526/tfjs/model.json"
  );
  return model;
}

async function predictImage(model, imageData) {
  const tensor = tf.node.decodeImage(imageData);
  const inputTensor = tensor.reshape([1, ...model.inputs[0].shape.slice(1)]);
  const predictions = model.predict(inputTensor);
  const result = Array.from(predictions.dataSync());
  return result;
}

module.exports = {
  loadModel,
  predictImage,
};
