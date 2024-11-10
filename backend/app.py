from flask import Flask, request, jsonify
import dlib
import cv2
import numpy as np
import base64
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Load face detector and shape predictor
detector = dlib.get_frontal_face_detector()
sp = dlib.shape_predictor("shape_predictor_68_face_landmarks.dat")
face_rec_model = dlib.face_recognition_model_v1("dlib_face_recognition_resnet_model_v1.dat")

# In-memory storage for face descriptors (for simplicity)
registered_faces = {}

def process_image(image_data):
    try:
        # Decode base64 string to image
        img_data = base64.b64decode(image_data.split(',')[1])  # Assuming image_data is base64
        np_arr = np.frombuffer(img_data, np.uint8)
        img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

        # Convert image to RGB (dlib expects RGB images)
        img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

        # Detect faces in the image
        faces = detector(img_rgb)
        if len(faces) == 0:
            return None  # No face detected

        # Assuming the first detected face is the one to register/verify
        shape = sp(img_rgb, faces[0])
        face_descriptor = face_rec_model.compute_face_descriptor(img_rgb, shape)
        return np.array(face_descriptor)
    
    except Exception as e:
        print(f"Error processing image: {e}")
        return None  # Return None if there's an error during processing

@app.route("/register_face", methods=["POST"])
def register_face():
    data = request.get_json()
    image = data.get("image")
    pin = data.get("pin")

    # Process the image to extract face descriptor
    face_descriptor = process_image(image)

    if face_descriptor is None:
        return jsonify({"message": "Face detection failed."}), 400

    # Save the face descriptor and pin
    registered_faces["user"] = {"face_descriptor": face_descriptor.tolist(), "pin": pin}
    return jsonify({"message": "Face registered successfully"}), 200

@app.route("/verify_face", methods=["POST"])
def verify_face():
    data = request.get_json()
    image = data.get("image")

    # Process the image to extract face descriptor
    face_descriptor = process_image(image)

    if face_descriptor is None:
        return jsonify({"message": "Face detection failed."}), 400

    # Compare with the registered face
    user_data = registered_faces.get("user")
    if user_data and np.linalg.norm(np.array(user_data["face_descriptor"]) - np.array(face_descriptor)) < 0.5:  # Reduced threshold for better accuracy
        return jsonify({"message": "Face verified", "pin": user_data["pin"]}), 200
    return jsonify({"message": "Face not recognized"}), 400

@app.route("/pay", methods=["POST"])
def pay():
    data = request.get_json()
    image = data.get("image")
    amount = data.get("amount")
    contact = data.get("contact")

    # Process the image to extract face descriptor
    face_descriptor = process_image(image)

    if face_descriptor is None:
        return jsonify({"message": "Face detection failed."}), 400

    # Compare with the registered face
    user_data = registered_faces.get("user")
    if user_data and np.linalg.norm(np.array(user_data["face_descriptor"]) - np.array(face_descriptor)) < 0.5:  # Reduced threshold for better accuracy
        # Here you would process the payment (e.g., update balance, etc.)
        return jsonify({"message": "Face verified", "pin": user_data["pin"]}), 200
    return jsonify({"message": "Face not recognized"}), 400

if __name__ == "__main__":
    app.run(debug=True)
