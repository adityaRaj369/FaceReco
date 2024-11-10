import React, { useRef, useEffect } from 'react';

function CameraComponent({ onCapture }) {
    const videoRef = useRef(null);

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(stream => {
                videoRef.current.srcObject = stream;
            })
            .catch(console.error);
    }, []);

    const captureImage = () => {
        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        canvas.getContext('2d').drawImage(videoRef.current, 0, 0);
        // Convert to base64 and pass to parent component
        onCapture(canvas.toDataURL('image/png'));
    };

    return (
        <div>
            <video ref={videoRef} autoPlay style={{ width: '100%' }} />
            <button onClick={captureImage}>Capture</button>
        </div>
    );
}

export default CameraComponent;