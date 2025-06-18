import express from 'express';
import transporter from '../utils/config.js';

const router = express.Router();

router.post('/send-email', (req, res) => {
    const { to, subject, message } = req.body;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        text: message,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            return res.status(500).send('Error sending email');
        }
        console.log('Email sent:', info.response);
        return res.status(200).send('Email sent successfully');
    });
});

export default router;
