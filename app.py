from flask import Flask, render_template, request
import os
import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator
import tensorflow_hub as hub
from tensorflow import keras
from tensorflow.keras.preprocessing import image
import numpy as np
from google.cloud import storage

app = Flask(__name__)

hub.KerasLayer(hub.load("tf_hub_saved_model"))
my_reloaded_model = tf.keras.models.load_model(
       'Batik_mobilenet.h5', custom_objects={'KerasLayer': hub.KerasLayer}
    )


# Set the path to your service account key (key.json)
SERVICE_ACCOUNT_KEY_PATH = 'key.json'

# Initialize Google Cloud Storage client with the service account key
storage_client = storage.Client.from_service_account_json(SERVICE_ACCOUNT_KEY_PATH)

# Set your Google Cloud Storage bucket name

BUCKET_NAME = 'uploads_predicts'
UPLOAD_FOLDER = 'uploads'


def predict_image(image_path):
    #image_path = 'uploads/coba.png'  # Ganti dengan path gambar Anda
    base_dir = 'Dataset'
    train_dir = os.path.join(base_dir, 'train')
    train_datagen = ImageDataGenerator(
        rescale=1./255,
    )
    train_generator = train_datagen.flow_from_directory(
        train_dir,  # This is the source directory for training images
        target_size=(224, 224),  # All images will be resized to 150x150
        batch_size=20,
        # Since we use binary_crossentropy loss, we need binary labels
        class_mode='categorical')
    # Load gambar dan praproses sesuai dengan format yang digunakan saat pelatihan
    img = image.load_img(image_path, target_size=(224, 224))
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array = img_array / 255.0  # Normalisasi

    # Lakukan prediksi dengan model yang sudah dilatih
    prediction = my_reloaded_model.predict(img_array)
    predicted_class = np.argmax(prediction)

    # Dapatkan nama kelas dari indeks prediksi
    class_names = sorted(train_generator.class_indices.keys())
    predicted_class_name = class_names[predicted_class]

    # For demonstration purposes, returning a dummy prediction
    return f"Hasil prediksi: {predicted_class_name}"


def upload_to_bucket(file_path, blob_name):
    bucket = storage_client.bucket(BUCKET_NAME)
    blob = bucket.blob(blob_name)
    blob.upload_from_filename(file_path)


@app.route('/')
def index():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    if 'picture' not in request.files:
        return "No picture uploaded", 400

    picture = request.files['picture']

    if picture.filename == '':
        return "No selected picture", 400

    if picture:
        # Save the uploaded image to the local 'uploads' folder
        picture_path = os.path.join(UPLOAD_FOLDER, picture.filename)
        picture.save(picture_path)

        # Get prediction using your processing function
        prediction = predict_image(picture_path)

        # Upload the image to Google Cloud Storage after prediction
        upload_to_bucket(picture_path, picture.filename)

        # Return the prediction result
        return f"Prediction: {prediction}"

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=3000)

