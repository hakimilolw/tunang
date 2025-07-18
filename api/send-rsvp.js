// api/send-rsvp.js

const fetch = require('node-fetch');

module.exports = async (req, res) => {


    // Ensure the request method is POST
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const { guestName } = req.body;

        if (!guestName) {
            return res.status(400).json({ message: 'Guest name is required.' });
        }

        // Use environment variables from Vercel
        const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
        const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

        // Construct the message to send to your Telegram bot
        const messageText = `🎉 New RSVP for Amirul & Aimi's Engagement!\n👤 Guest Name: ${guestName}\n🗓️ Date: 20/9/2025\n⏰ Time: 10:30 AM onwards`;

        const telegramApiUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

        const payload = {
            chat_id: CHAT_ID,
            text: messageText,
            parse_mode: 'HTML'
        };

        const telegramResponse = await fetch(telegramApiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (telegramResponse.ok) {
            return res.status(200).json({ message: 'RSVP sent successfully to Telegram!' });
        } else {
            const errorData = await telegramResponse.json();
            return res.status(500).json({ message: `Failed to send RSVP via Telegram: ${errorData.description || 'Unknown error'}` });
        }

    } catch (error) {
        console.error('Server error processing RSVP:', error);
        return res.status(500).json({ message: 'An internal server error occurred.' });
    }
};