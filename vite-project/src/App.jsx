import React, { useState } from 'react';
import axios from 'axios';

const app = () => {
    const [paymentStatus, setPaymentStatus] = useState('');

    const handlePayment = async () => {
        try {
            // Request payment URL from the backend
            const paymentData = {
                orderId: 'ORD123456',
                amount: 1000,
                customerEmail: 'customer@example.com',
                customerPhone: '9876543210',
            };

            const response = await axios.post('http://localhost:5000/create-payment', paymentData, {
              headers: {
                  'Content-Type': 'application/json', // Ensure the header is set to 'application/json'
              }
          });

            // Simulate redirecting to a payment gateway
            const paymentUrl = response.data.paymentUrl;
            setPaymentStatus('Redirecting to the payment gateway...');

            // Redirect user to the payment gateway (simulated)
            window.location.href = paymentUrl;
        } catch (error) {
            console.error('Payment initiation failed:', error);
            setPaymentStatus('Payment initiation failed');
        }
    };

    return (
        <div>
            <h2>Payment Page</h2>
            <p>Status: {paymentStatus}</p>
            <button onClick={handlePayment}>Pay Now</button>
        </div>
    );
};

export default app;
