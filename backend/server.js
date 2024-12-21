const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const crypto = require('crypto');

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

// Mock BillDesk payment gateway URL (for testing purposes)
const BILLDESK_MOCK_URL = 'https://uat1.billdesk.com/u2/payments/ve1_2/refunds/create';

// Simulate the creation of a payment request
app.post('/create-payment', (req, res) => {
    try {
        const { orderId, amount, customerEmail, customerPhone } = req.body;

        // You can simulate some business logic for payment creation here
        // For example, you can include extra parameters like a checksum, etc.

        // Create a mock response that will simulate a payment gateway URL
        const paymentData = {
            orderId,
            amount,
            customerEmail,
            customerPhone,
            redirectUrl: 'http://localhost:5000/payment-response', // Redirect URL after payment
            checksum: generateRequestHash(orderId, amount), // A mock checksum for security
        };

        // Simulate returning a payment URL (this could be from BillDesk or any gateway)
        const paymentUrl = `${BILLDESK_MOCK_URL}?orderId=${orderId}&amount=${amount}&checksum=${paymentData.checksum}`;

        res.json({ paymentUrl });
    } catch (error) {
        console.error('Error creating payment:', error);
        res.status(500).json({ error: 'Failed to create payment' });
    }
});

// Handle payment response (redirect after payment)
app.post('/payment-response', (req, res) => {
    const { orderId, status, checksum } = req.body;

    // Here, you can validate the checksum and the status of the payment
    const expectedChecksum = generateRequestHash(orderId, status);

    if (checksum === expectedChecksum) {
        res.json({ status: 'Payment successful', orderId, transactionId: 'TXN12345' });
    } else {
        res.json({ status: 'Payment failed', orderId });
    }
});

// Helper function to generate a mock checksum for validation
function generateRequestHash(orderId, amount) {
    const secret = 'yourSecretKey'; // This should be your actual secret key in a real scenario
    const data = `${orderId}|${amount}|${secret}`;
    return crypto.createHash('sha256').update(data).digest('hex');
}

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
