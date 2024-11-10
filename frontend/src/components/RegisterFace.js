import React, { useState } from 'react';
import CameraComponent from './CameraComponent';
import axios from 'axios';

function RegisterFace() {
    const [pin, setPin] = useState('');
    const [capturedImage, setCapturedImage] = useState(null);

    const handleCapture = (image) => setCapturedImage(image);

    const registerFace = () => {
        if (!capturedImage || !pin) {
            alert("Please capture your face and enter a PIN.");
            return;
        }

        // Send the captured image and pin to the backend
        axios.post('http://localhost:5000/register_face', { image: capturedImage, pin })
            .then(response => alert('Face registered successfully'))
            .catch(error => {
                alert('Registration failed');
                console.error(error);
            });
    };

    return (
        <div>
            <h1>Register Face</h1>
            <CameraComponent onCapture={handleCapture} />
            <input type="password" placeholder="Enter PIN" value={pin} onChange={e => setPin(e.target.value)} />
            <button onClick={registerFace}>Register</button>
        </div>
    );
}

export default RegisterFace;
