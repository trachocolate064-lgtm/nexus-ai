import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Modality } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Shared Gemini AI client helper with User-Agent set to 'aistudio-build'
function getGenAI() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is not configured.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// System prompt construction based on identity, mode, detail level and language
function buildSystemInstruction(
  mode: string,
  responseDetail: string,
  language: string,
  userCustomPrefix?: string
): string {
  const baseIdentity = `You are Nexus AI, a professional AI assistant designed to help people learn and work better.

Personality & Rules:
- Professional, friendly, patient, clear, and easy to understand.
- Provide structured, well-formatted answers using headings, bullet points, clean tables, and code blocks.
- Understand user intent before answering and explain complex topics step by step with concrete examples.
- For programming tasks, deliver clean, working, and well-commented code.
- For images or documents provided by the user, analyze them accurately and give insightful explanations.
- If unsure about something, clearly state it.
- Never invent false information.`;

  let modeInstruction = '';

  switch (mode) {
    case 'programming':
      modeInstruction = `
Specialization - Programming & Technical Architecture:
- Write robust, production-ready, highly clean code (prefer TypeScript / modern standards).
- Include clear syntax-highlighted code blocks with language identifiers.
- Explain key logic, potential edge cases, and performance considerations step by step.`;
      break;
    case 'learning':
      modeInstruction = `
Specialization - Learning & Socratic Educator:
- Break down concepts step by step using intuitive real-world analogies.
- Include quick self-check questions or practice summaries when helpful.
- Adapt explanation depth cleanly to beginner or intermediate learners.`;
      break;
    case 'writing':
      modeInstruction = `
Specialization - Writing, Editing & Content Strategy:
- Deliver well-structured, compelling text tailored precisely to requested tone (e.g. professional, casual, academic).
- Highlight key takeaways, edit improvements, and offer alternative phrasing options when appropriate.`;
      break;
    case 'research':
      modeInstruction = `
Specialization - Research & Fact-Finding:
- Synthesize facts logically with high precision.
- Organize comparisons into clean markdown tables or key bullet points.
- Cite facts accurately.`;
      break;
    case 'translation':
      modeInstruction = `
Specialization - Translation & Linguistics:
- Translate accurately while preserving nuance, idiom, and context.
- Provide brief notes on language nuances, formality levels, or cultural context when helpful.`;
      break;
    case 'brainstorm':
      modeInstruction = `
Specialization - Idea Generation & Problem Solving:
- Provide structured, creative, actionable ideas.
- Categorize concepts with feasibility and expected impact notes.`;
      break;
    default:
      modeInstruction = `
Specialization - General Intelligence:
- Provide helpful, well-structured, clear answers across all daily tasks and inquiries.`;
      break;
  }

  let detailInstruction = '';
  if (responseDetail === 'concise') {
    detailInstruction = '\nResponse style preference: Be concise, direct, and straight to the point without filler.';
  } else if (responseDetail === 'detailed') {
    detailInstruction = '\nResponse style preference: Provide thorough, in-depth explanations with complete examples and step-by-step reasoning.';
  } else {
    detailInstruction = '\nResponse style preference: Provide balanced detail—clear, comprehensive, yet easy to digest.';
  }

  const langInstruction = language && language !== 'Auto-Detect'
    ? `\nPrimary Response Language: Respond in ${language} unless explicitly requested otherwise.`
    : '';

  const customPrefix = userCustomPrefix ? `\nUser Custom Directive: ${userCustomPrefix}` : '';

  return `${baseIdentity}\n${modeInstruction}${detailInstruction}${langInstruction}${customPrefix}`;
}

// API Routes FIRST
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Streaming Chat API Endpoint (SSE)
app.post('/api/chat/stream', async (req, res) => {
  try {
    const {
      messages,
      mode = 'general',
      searchGrounding = false,
      responseDetail = 'balanced',
      language = 'Auto-Detect',
      systemPromptPrefix = '',
      model = 'gemini-3.6-flash'
    } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      res.status(400).json({ error: 'Messages array is required.' });
      return;
    }

    const ai = getGenAI();

    // Set SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const systemInstruction = buildSystemInstruction(mode, responseDetail, language, systemPromptPrefix);

    // Prepare contents for Gemini SDK with multimodal attachments
    const contents = messages.map((m: any) => {
      const parts: any[] = [];

      if (m.attachments && Array.isArray(m.attachments)) {
        for (const att of m.attachments) {
          if (att.base64 && att.mimeType) {
            parts.push({
              inlineData: {
                mimeType: att.mimeType,
                data: att.base64,
              },
            });
          } else if (att.content) {
            parts.push({
              text: `[Document Attachment: ${att.name}]\n${att.content}`,
            });
          }
        }
      }

      parts.push({ text: m.content || '' });

      return {
        role: m.role === 'assistant' ? 'model' : 'user',
        parts,
      };
    });

    // Setup config
    const config: any = {
      systemInstruction,
    };

    if (searchGrounding) {
      config.tools = [{ googleSearch: {} }];
    }

    // Call generateContentStream
    const responseStream = await ai.models.generateContentStream({
      model: model || 'gemini-3.6-flash',
      contents,
      config,
    });

    let collectedGroundingSources: Array<{ title: string; uri: string }> = [];

    for await (const chunk of responseStream) {
      const text = chunk.text || '';
      
      // Extract grounding metadata if present
      const candidate = chunk.candidates?.[0];
      const groundingChunks = candidate?.groundingMetadata?.groundingChunks;
      if (groundingChunks && Array.isArray(groundingChunks)) {
        for (const gChunk of groundingChunks) {
          if (gChunk.web?.uri) {
            collectedGroundingSources.push({
              title: gChunk.web.title || gChunk.web.uri,
              uri: gChunk.web.uri,
            });
          }
        }
      }

      res.write(`data: ${JSON.stringify({ chunk: text, groundingSources: collectedGroundingSources })}\n\n`);
    }

    // Send done signal
    res.write(`data: ${JSON.stringify({ done: true, groundingSources: collectedGroundingSources })}\n\n`);
    res.end();
  } catch (error: any) {
    console.error('Streaming error:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: error.message || 'An error occurred during AI generation.' });
    } else {
      res.write(`data: ${JSON.stringify({ error: error.message || 'Error occurred during streaming.' })}\n\n`);
      res.end();
    }
  }
});

// Text-To-Speech (TTS) Endpoint using Gemini TTS
app.post('/api/tts', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || typeof text !== 'string') {
      res.status(400).json({ error: 'Text string is required.' });
      return;
    }

    const ai = getGenAI();

    // Limit text length for reasonable TTS duration
    const cleanText = text.replace(/```[\s\S]*?```/g, 'Code snippet omitted.').slice(0, 1000);

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-tts-preview',
      contents: [{ parts: [{ text: `Read clearly: ${cleanText}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) {
      throw new Error('No audio returned from Gemini TTS.');
    }

    res.json({ audio: base64Audio, mimeType: 'audio/pcm;rate=24000' });
  } catch (error: any) {
    console.error('TTS error:', error);
    res.status(500).json({ error: error.message || 'TTS generation failed.' });
  }
});

// Vite Middleware for development / Static file serving for production
async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Nexus AI Server running on http://localhost:${PORT}`);
  });
}

start();
