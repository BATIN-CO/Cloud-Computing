from flask import Flask, render_template, request
import os
import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator
import tensorflow_hub as hub
from tensorflow import keras
from tensorflow.keras.preprocessing import image
import numpy as np
from google.cloud import storage
from PIL import Image
from io import BytesIO
import uuid

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

BUCKET_NAME = os.environ.get('CLOUD_STORAGE_BUCKET', 'batinco') # Change batinco to the bucket name used and change the bucket name in app.yaml

def predict_image(BUCKET_NAME, blob_name):
    # Load the image from Google Cloud Storage
    bucket = storage_client.bucket(BUCKET_NAME)
    blob = bucket.blob(blob_name)
    img_data = blob.download_as_bytes()

    # Load the image from bytes using PIL
    img = Image.open(BytesIO(img_data))
    img = img.resize((224, 224))  # Resize the image

    # Convert PIL Image to numpy array
    img_array = np.array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array = img_array / 255.0  # Normalization

    # Perform prediction with the trained model
    prediction = my_reloaded_model.predict(img_array)
    predicted_class = np.argmax(prediction)

    # Get the class name of the prediction index
    base_dir = 'Dataset'
    train_dir = os.path.join(base_dir, 'train')
    train_datagen = ImageDataGenerator(rescale=1./255)
    train_generator = train_datagen.flow_from_directory(
        train_dir,
        target_size=(224, 224),
        batch_size=20,
        class_mode='categorical'
    )
    class_names = sorted(train_generator.class_indices.keys())
    predicted_class_name = class_names[predicted_class]

    # For demonstration purposes, return a dummy prediction
    return f"Hasil prediksi: {predicted_class_name}"

def upload_to_bucket(file_storage, blob_name):
    bucket = storage_client.bucket(BUCKET_NAME)
    blob = bucket.blob(blob_name)

    # Save the file storage content to a temporary file
    temp_file_path = f"/tmp/{uuid.uuid4()}.jpg"  # Use a unique file name
    file_storage.save(temp_file_path)

    # Upload the temporary file to Google Cloud Storage
    blob.upload_from_filename(temp_file_path)

    # Clean up the temporary file
    os.remove(temp_file_path)


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
        # Generate a unique blob name using uuid (you may need to adjust this logic)
        blob_name = f"uploads/{uuid.uuid4()}.jpg"

        # Upload the image to Google Cloud Storage
        upload_to_bucket(picture, blob_name)

        # Get prediction using your processing function
        prediction = predict_image(BUCKET_NAME, blob_name)

        # Return the prediction result
        return f"Hasil: {prediction}"

if __name__ == '__main__':
    app.run(debug=True)
