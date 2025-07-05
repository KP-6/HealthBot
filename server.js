const express = require('express');
const cors = require('cors');
const path = require('path');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.GOOGLE_GEMINI_API_KEY;

// === Middleware ===
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Request logger
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// === Routes ===

// Simple test endpoint
app.get('/api/test', (req, res) => {
    res.json({ message: 'API is working!' });
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        time: new Date().toISOString(),
        apiKey: API_KEY ? 'configured' : 'missing'
    });
});

// Chat endpoint
app.post('/api/chat', async (req, res) => {
    const { message } = req.body;
    console.log('Chat request received:', message);

    if (!message) {
        return res.status(400).json({ error: 'Message is required' });
    }

    if (!API_KEY) {
        return res.status(500).json({ error: 'API key not configured' });
    }

    const prompt = `You are a friendly and empathetic healthcare assistant. Analyze the user's concern and provide a clear, concise response. Format your response in a conversational way, but include these key points:

1. Brief acknowledgment of their concern
2. Possible causes (if applicable)
3. Clear, actionable recommendations
4. When to seek professional help

Keep the tone warm and supportive. Avoid medical jargon unless necessary, and if used, explain it simply.

User's concern: ${message}`;

    try {
        const { data } = await axios.post(
            'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
            {
                contents: [{
                    parts: [{ text: prompt }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 1024,
                }
            },
            {
                headers: { 'Content-Type': 'application/json' },
                params: { key: API_KEY }
            }
        );

        const botResponse = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!botResponse) {
            throw new Error('Invalid response from Gemini API');
        }

        const formatted = botResponse.replace(/\n\n/g, '\n').trim();
        res.json({ response: formatted });

    } catch (error) {
        console.error('Chat error:', error.message);
        res.status(500).json({
            error: 'Failed to process request',
            details: error.message
        });
    }
});

// Serve frontend
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// === Start server ===
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
    console.log(`🔑 API Key: ${API_KEY ? 'Present' : 'Missing'}`);
    console.log(`📡 Routes:
  - GET  /api/test
  - GET  /api/health
  - POST /api/chat`);
});
