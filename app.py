from flask import Flask, render_template, request
from tensorflow.keras.models import model_from_json
from tensorflow.keras.preprocessing import image
import numpy as np
from tensorflow.keras.layers import Layer

app = Flask(__name__)

from tensorflow.keras.layers import Layer
import tensorflow as tf

# Deklarasikan ulang KerasLayer (jika digunakan)
class KerasLayer(Layer):
    def __init__(self, units, **kwargs):
        self.units = units
        super(KerasLayer, self).__init__(**kwargs)

    def build(self, input_shape):
        self.w = self.add_weight(
            shape=(input_shape[-1], self.units),
            initializer='random_normal',
            trainable=True,
        )
        self.b = self.add_weight(
            shape=(self.units,),
            initializer='random_normal',
            trainable=True,
        )
        super(KerasLayer, self).build(input_shape)

    def call(self, inputs):
        return tf.matmul(inputs, self.w) + self.b

    def compute_output_shape(self, input_shape):
        return (input_shape[0], self.units)

# Example usage of KerasLayer with units=10
keras_layer_instance = KerasLayer(units=10)

# Fungsi untuk memuat model
def load_model():
    # Baca file model JSON
    with open('model/Mobilenet_batik.json', 'r') as json_file:
        loaded_model_json = json_file.read()

    # Muat model dari JSON
    loaded_model = model_from_json(loaded_model_json, custom_objects={'KerasLayer': KerasLayer})

    # Muat bobot model dari file HDF5
    loaded_model.load_weights('model/Weight_batik.h5')

    return loaded_model

# Jalankan fungsi load_model untuk mendapatkan model yang dimuat
model = load_model()

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return render_template('index.html', message='No file part')

    file = request.files['file']

    if file.filename == '':
        return render_template('index.html', message='No selected file')

    if file:
        # Proses gambar untuk memenuhi input model
        img = image.load_img(file, target_size=(100, 100))
        img_array = image.img_to_array(img)
        img_array = np.expand_dims(img_array, axis=0)

        # Lakukan prediksi
        prediction = model.predict(img_array)
        predicted_class = np.argmax(prediction)

        return render_template('index.html', message=f'Predicted Class: {predicted_class}')

if __name__ == '__main__':
    app.run(debug=True)
