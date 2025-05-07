import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

console.log("API Key loaded:", process.env.OPENROUTER_API_KEY ? "✅ Yes" : "❌ No (Check .env)");
app.post('/translate', async (req, res) => {
  const { text, from, to } = req.body;

  if (!text || !from || !to) {
    return res.status(400).json({ error: 'Text, source language (from), and target language (to) are required.' });
  }

  try {
    const prompt = `You are a professional translator. Translate the following text from ${from} to ${to}:\n\n"${text}"`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "<YOUR_SITE_URL>",  
        "X-Title": "My AI Translation Tool"

      },
      body: JSON.stringify({
        model: "deepseek/deepseek-r1:free",
        messages: [
          { role: "user", content: prompt }
        ]
      })
    });

    const data = await response.json();
    const translated = data.choices?.[0]?.message?.content?.trim();

    if (!translated) {
      throw new Error("No response from model");
    }

    res.json({ translated });
  } catch (err) {
    console.error('Translation error:', err);
    res.status(500).json({ error: 'Translation failed. Check server logs for details.' });
  } 
});


app.post('/chat', async (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'User message is required.' });
  }
  try {
    const prompt = `You are a helpful and friendly manish kumar's AI assistant. Respond to the user's message:\n\n"${message}"`;
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "<YOUR_SITE_URL>",  
        "X-Title": "My AI Chatbot"
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-r1:free",
        messages: [
          { role: "user", content: prompt }
        ]
      })
    });
    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content?.trim();
    if (!reply) {
      throw new Error("No response from model");
    }
    const brandedReply = `${reply}\n\n🤖 *This AI Chatbot was developed by Manish Kumar.*`;
    res.json({ reply: brandedReply }); 
  } catch (err) {
    console.error('Chatbot error:', err);
    res.status(500).json({ error: 'Chatbot response failed. Check server logs for details.' });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
