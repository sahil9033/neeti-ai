import 'dotenv/config';
import express from 'express';
import axios from 'axios';
import cors from 'cors';
import helmet from 'helmet';
import { verifyAuth } from './middleware/auth.js';
import conflictRoutes from './routes/conflict.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Security headers
app.use(helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false }));

// CORS — allow local dev, Vercel preview, and production URLs
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    /\.vercel\.app$/
  ],
  credentials: true
}));

app.use(express.json());

// Request logger
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'NEETI backend alive', timestamp: new Date() });
});

// Phase 1 — OpenRouter smoke test (no auth)
app.post('/api/test', async (req, res) => {
  const { message } = req.body;
  console.log(`[${new Date().toISOString()}] POST /api/test — message: ${message}`);
  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'openrouter/free',
        messages: [
          { role: 'system', content: 'You are NEETI, an AI conflict resolution assistant.' },
          { role: 'user', content: message }
        ],
        max_tokens: 500
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://neeti-ai.vercel.app',
          'X-Title': 'NEETI'
        }
      }
    );
    const choice = response.data.choices?.[0];
    let aiText = choice?.message?.content || choice?.message?.reasoning;
    if (!aiText && choice?.message?.reasoning) {
      aiText = choice.message.reasoning;
    }
    if (!aiText) {
      console.error(`[${new Date().toISOString()}] Invalid response format:`, JSON.stringify(response.data).substring(0, 500));
      return res.status(500).json({ success: false, error: 'Invalid response structure', details: response.data });
    }
    console.log(`[${new Date().toISOString()}] AI replied: ${aiText.substring(0, 80)}...`);
    res.json({ success: true, response: aiText });
  } catch (err) {
    console.error(`[${new Date().toISOString()}] ERROR:`, err.response?.data || err.message);
    res.status(500).json({ success: false, error: err.response?.data || err.message });
  }
});

// Protected test endpoint — requires Firebase auth token
app.post('/api/protected-test', verifyAuth, (req, res) => {
  console.log(`[${new Date().toISOString()}] [PROTECTED] User: ${req.user.uid}`);
  res.json({ success: true, message: 'Auth working!', user: req.user });
});

// Conflict routes
app.use('/api/conflict', conflictRoutes);

// Global error handler
app.use((err, _req, res, _next) => {
  console.error(`[${new Date().toISOString()}] Unhandled error:`, err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// Export for Vercel serverless
export default app;

// Local dev server
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => console.log(`NEETI backend running on port ${PORT}`));
}
