import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Load environment variables from the .env file
dotenv.config();
console.log("--- DEBUG: Your API Key is:", process.env.GEMINI_API_KEY);

const app = express();

// Middleware
app.use(cors()); // Allows our frontend to make requests to this backend
app.use(express.json()); // Parses incoming request bodies as JSON

// Initialize the Gemini AI SDK
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Define our text-to-flashcard generation endpoint
app.post('/api/generate', async (req, res) => {
  // Safely defaults to an empty object if req.body is missing/undefined
   const { topic } = req.body || {};
  // 1. Defend the API against empty requests
  if (!topic || !topic.trim()) {
    return res.status(400).json({ success: false, message: 'Topic or notes are required.' });
  }

  try {
    // We use gemini-1.5-flash as it's lightning-fast and covered heavily on the free tier
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    // 2. Prompt Engineering: Strictly demand raw JSON. No markdown summaries.
    const prompt = `
      You are an expert academic study assistant. Create 3 to 5 clear, high-yield educational flashcards based on the following user topic or notes:
      "${topic}"
      
      You must respond ONLY with a valid, raw JSON object. Do not include markdown formatting, backticks, or the word 'json'. Your response must be instantly machine-parsable.
      Use this exact JSON schema structure:
      {
        "title": "A short descriptive title summarizing the topic",
        "flashcards": [
          { 
            "id": 1, 
            "question": "A concise question testing a core concept", 
            "answer": "A clear, informative answer" 
          }
        ]
      }
    `;

    // Send the prompt to the model
    const result = await model.generateContent(prompt);
    let responseText = result.response.text();
    
    // 3. Resilience Handling: Sometimes LLMs ignore instructions and wrap JSON in markdown backticks.
    // If the text starts with ```json or contains backticks, clean it manually before forwarding to frontend.
    responseText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();

    // Send the clean, raw stringified JSON back to the client
    return res.json({ success: true, data: responseText });

  } catch (error) {
    console.error('AI Generation Error:', error);
    // Graceful server response instead of crashing the process
    return res.status(500).json({ success: false, message: 'The AI server encountered an issue generating content.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Backend proxy server running securely on http://localhost:${PORT}`);
});