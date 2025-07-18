// This is a serverless function (e.g., for Vercel, Netlify Functions, Render)
// Save this file as 'api/send-rsvp.js' or similar in your project structure.

// Import necessary modules
// 'node-fetch' is used for making HTTP requests in Node.js environments.
// If deploying to platforms like Vercel/Netlify, 'fetch' might be globally available,
// but explicitly importing is good practice for wider compatibility.
const fetch = require('node-fetch');

// This is the main function that will be executed when your frontend sends a POST request.
module.exports = async (req, res) => {
    // Set CORS headers to allow requests from your specific GitHub Pages domain.
    // This is crucial for resolving the 'Access-Control-Allow-Origin' error.
    res.setHeader('Access-Control-Allow-Origin', 'https://hakimilolw.github.io');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Max-Age', '86400'); // Cache preflight response for 24 hours

    // Handle preflight requests (OPTIONS method)
    if (req.method === 'OPTIONS') {
        // Use 204 No Content for successful OPTIONS response, as it typically has no body.
        res.status(204).end(); // End the response without a body
        return;
    }

    // Ensure the request method is POST
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        // Parse the request body to get the guestName
        const { guestName } = req.body;

        // Validate if guestName is provided
        if (!guestName) {
            return res.status(400).json({ message: 'Guest name is required.' });
        }

        // Hardcoded sensitive information as requested.
        // WARNING: In a production environment, it is highly recommended to use environment variables
        // instead of hardcoding sensitive data directly in the code for security reasons.
        const BOT_TOKEN = '8104058263:AAFsFTuSslwL0zJBDT91NyS-4_1DIliUuo8'; // Your Bot Token
        const CHAT_ID = '675538113';     // Your Chat ID

        // Construct the message to send to your Telegram bot
        const messageText = `🎉 New RSVP for Amirul & Aimi's Engagement!%0A👤 Guest Name: ${guestName}%0A🗓️ Date: 20/9/2025%0A⏰ Time: 10:30 AM onwards`;

        // Telegram Bot API endpoint for sending messages
        const telegramApiUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

        // Prepare the payload for the Telegram API request
        const payload = {
            chat_id: CHAT_ID,
            text: messageText,
            parse_mode: 'HTML' // Use HTML for formatting if needed, or 'MarkdownV2'
        };

        // Send the message to Telegram
        const telegramResponse = await fetch(telegramApiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        // Check if the Telegram API call was successful
        if (telegramResponse.ok) {
            const telegramData = await telegramResponse.json();
            // Log the Telegram API response for debugging
            console.log('Telegram API response:', telegramData);
            return res.status(200).json({ message: 'RSVP sent successfully to Telegram!' });
        } else {
            const errorData = await telegramResponse.json();
            console.error('Error from Telegram API:', errorData);
            return res.status(500).json({ message: `Failed to send RSVP via Telegram: ${errorData.description || 'Unknown error'}` });
        }

    } catch (error) {
        console.error('Server error processing RSVP:', error);
        return res.status(500).json({ message: 'An internal server error occurred.' });
    }
};
