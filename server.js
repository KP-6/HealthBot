const express = require('express');
const cors = require('cors');
const path = require('path');
const axios = require('axios');
require('dotenv').config();

const app = express();

// Basic middleware
app.use(express.json());
app.use(cors());

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Log all requests
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
    next();
});

// Test route to verify API is working
app.get('/api/test', (req, res) => {
    res.json({ message: 'API is working!' });
});

// Health check route
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        time: new Date().toISOString(),
        apiKey: process.env.GOOGLE_GEMINI_API_KEY ? 'configured' : 'missing'
    });
});

// Chat endpoint
app.post('/api/chat', async (req, res) => {
    console.log('Chat request received:', req.body);
    
    try {
        const { message } = req.body;
        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ error: 'API key not configured' });
        }

        const response = await axios({
            method: 'post',
            url: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
            headers: {
                'Content-Type': 'application/json'
            },
            params: {
                key: apiKey
            },
            data: {
                contents: [{
                    parts: [{
                        text: `You are a friendly and empathetic healthcare assistant. Analyze the user's concern and provide a clear, concise response. Format your response in a conversational way, but include these key points:

1. Brief acknowledgment of their concern
2. Possible causes (if applicable)
3. Clear, actionable recommendations
4. When to seek professional help

Keep the tone warm and supportive. Avoid medical jargon unless necessary, and if used, explain it simply.

User's concern: ${message}`
                    }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 1024,
                }
            }
        });

        if (!response.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
            throw new Error('Invalid response from Gemini API');
        }

        const botResponse = response.data.candidates[0].content.parts[0].text;
        
        // Format the response to be more readable
        const formattedResponse = botResponse
            .replace(/\n\n/g, '\n')
            .trim();

        res.json({ response: formattedResponse });

    } catch (error) {
        console.error('Chat error:', error.message);
        res.status(500).json({
            error: 'Failed to process request',
            details: error.message
        });
    }
});

// Serve index.html for all other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('API Key status:', process.env.GOOGLE_GEMINI_API_KEY ? 'Present' : 'Missing');
    
    // Log available routes
    console.log('Available routes:');
    console.log('- GET  /api/test');
    console.log('- GET  /api/health');
    console.log('- POST /api/chat');
});
