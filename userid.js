const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const randomstring = require('randomstring');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// Send OTP route
app.post('/send-otp', (req, res) => {
    const email = req.body.email;
    const otp = generateOTP();

    // Send OTP to the user's email
    sendOTP(email, otp)
        .then(() => {
            res.status(200).send({ message: 'OTP sent successfully.' });
        })
        .catch(error => {
            console.error('Error sending OTP:', error);
            res.status(500).send({ message: 'Failed to send OTP. Please try again.' });
        });
});

// Verify OTP route
app.post('/verify', (req, res) => {
    const email = req.body.email;
    const otp = req.body.otp;

    // Verify OTP
    if (verifyOTP(email, otp)) {
        res.status(200).send({ success: true, message: 'Login successful.' });
    } else {
        res.status(401).send({ success: false, message: 'Incorrect OTP. Please try again.' });
    }
});

// Generate random OTP
function generateOTP() {
    return randomstring.generate({ length: 6, charset: 'numeric' });
}

// Send OTP to user's email
function sendOTP(email, otp) {
    // Configure nodemailer to send emails (replace with your SMTP settings)
    const transporter = nodemailer.createTransport({
        host: 'smtp.example.com',
        port: 587,
        secure: false,
        auth: {
            user: 'your_email@example.com',
            pass: 'your_email_password'
        }
    });

    // Email options
    const mailOptions = {
        from: 'your_email@example.com',
        to: email,
        subject: 'Your OTP for Login',
        text: `Your OTP is: ${otp}`
    };

    // Send email
    return transporter.sendMail(mailOptions);
}

// Verify OTP (dummy function, replace with your actual verification logic)
function verifyOTP(email, otp) {
    // Dummy verification logic (always return true for demonstration)
    return true;
}

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
