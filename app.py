from flask import Flask, render_template, request
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
from tensorflow.keras.applications.inception_v3 import preprocess_input, decode_predictions
import numpy as np
import h5py
from PIL import Image

app = Flask(__name__)

model = load_model('Weight_batik.h5')

def process_image(img):
    img = img.resize((224, 224))
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array = preprocess_input(img_array)
    return img_array

def predict_image(img_path):
    img = Image.open(img_path)
    img_array = process_image(img)
    predictions = model.predict(img_array)
    decoded_predictions = decode_predictions(predictions)
    top_prediction = decoded_predictions[0][0]
    return top_prediction

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
        result = predict_image(file)
        return render_template('index.html', message='Prediction: {}'.format(result[1]))

if __name__ == '__main__':
    app.run(debug=True)
