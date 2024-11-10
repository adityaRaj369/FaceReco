// frontend/src/components/PayToContacts.js
import React, { useState } from 'react';
import CameraComponent from './CameraComponent';
import axios from 'axios';

function PayToContacts() {
    const [amount, setAmount] = useState('');
    const [contact, setContact] = useState('Alice');
    const [capturedImage, setCapturedImage] = useState(null);
    const [showCamera, setShowCamera] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState('');

    const handleCapture = (image) => {
        setCapturedImage(image);
        verifyAndPay(image);
    };

    const verifyAndPay = async (image) => {
        try {
            const response = await axios.post('http://localhost:5000/pay', {
                image, amount, contact
            });
            setPaymentStatus(`Payment Successful! PIN: ${response.data.pin}`);
        } catch (error) {
            setPaymentStatus("Face not recognized. Transaction cannot be initiated.");
        }
        setShowCamera(false); // Close the camera after capture
    };

    const initiatePayment = () => {
        setPaymentStatus('');
        setShowCamera(true); // Open camera feed
    };

    return (
        <div>
            <h1>Pay to Contacts</h1>
            <select onChange={e => setContact(e.target.value)} value={contact}>
                <option>Alice</option>
                <option>Bob</option>
                <option>Charlie</option>
            </select>
            <input 
                type="number" 
                placeholder="Amount" 
                value={amount} 
                onChange={e => setAmount(e.target.value)} 
            />
            <button onClick={initiatePayment}>Pay</button>

            {/* Small camera feed */}
            {showCamera && (
                <div className="small-video-feed">
                    <CameraComponent onCapture={handleCapture} />
                </div>
            )}

            {/* Display payment status */}
            {paymentStatus && <div className="payment-status">{paymentStatus}</div>}
        </div>
    );
}

export default PayToContacts;
