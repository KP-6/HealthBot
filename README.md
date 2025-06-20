# Healthcare Chatbot

A modern, responsive healthcare chatbot powered by Google's Gemini AI. This chatbot provides helpful medical information and guidance while maintaining a professional and empathetic tone.

## Features

- Real-time chat interface
- Powered by Google Gemini AI
- Responsive design
- Professional medical guidance
- Beautiful UI with smooth animations

## Tech Stack

- Frontend: HTML, CSS, JavaScript
- Backend: Netlify Functions
- AI: Google Gemini API

## Local Development

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory with your Google Gemini API key:
   ```
   GOOGLE_GEMINI_API_KEY=your_api_key_here
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Deployment

This project is configured for deployment on Netlify:

1. Push your code to a GitHub repository
2. Connect your repository to Netlify
3. Add your environment variables in Netlify:
   - Go to Site Settings > Environment variables
   - Add `GOOGLE_GEMINI_API_KEY` with your API key
4. Deploy! Netlify will automatically build and deploy your site

## Environment Variables

- `GOOGLE_GEMINI_API_KEY`: Your Google Gemini API key

## Important Note

This chatbot is for informational purposes only and should not be used as a substitute for professional medical advice, diagnosis, or treatment.
