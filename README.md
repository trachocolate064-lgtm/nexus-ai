# Nexus AI - Enterprise-Grade Intelligent AI Platform

Nexus AI is a modern, responsive, ChatGPT-style web platform powered by Google Gemini models (`gemini-3.6-flash` and `gemini-3.1-pro-preview`). Designed as a full-stack AI assistant product, it features streaming AI responses, multimodal document & image analysis, live Google Search grounding, voice input, AI speech synthesis (TTS), custom prompt modes, and local conversation persistence.

---

## 🌟 Key Features

### 1. 🤖 Gemini Engine Integration & Streaming
- Real-time Server-Sent Events (SSE) streaming for instant response delivery.
- Model selector supporting `gemini-3.6-flash` (fast, multimodal) and `gemini-3.1-pro-preview` (deep reasoning).
- Live Google Search grounding for real-time web facts and citations.

### 2. 📄 Multimodal File & Image Understanding
- Support for images (`PNG`, `JPG`, `WEBP`) with inline vision analysis.
- Upload PDF, text, source code (`.ts`, `.js`, `.py`, `.json`, `.cpp`, `.md`), and data files.
- Automated document summarization, code explanation, and document analysis.

### 3. 🎙️ Voice Input & Text-to-Speech (TTS)
- Speech-to-text input via browser Speech Recognition API.
- AI response reading using Gemini Speech Synthesis (`gemini-3.1-flash-tts-preview`).

### 4. 🗂️ Conversation History & Session Management
- Multi-session chat history stored securely in local browser storage (`localStorage`).
- Create, rename, delete, and search past conversations.
- One-click JSON history export & clear functionality.

### 5. 🎯 Specialized Assistant Modes
- **General**: Versatile daily helper.
- **Code**: Technical architecture, code generation, debugging, and syntax highlighting.
- **Learning**: Step-by-step Socratic breakdown with analogies.
- **Writing**: Professional document editing, copywriting, and summaries.
- **Research**: Fact-finding and comparison tables.
- **Translate**: Nuanced multilingual translation with notes.
- **Brainstorm**: Creative concept generation with feasibility notes.

### 6. ⚙️ Custom Settings & Preferences
- Theme selection (Dark Mode default, Light Canvas option).
- Response detail controls (Concise, Balanced, In-Depth).
- Language preference configuration (Auto-Detect + 13 languages).
- Custom System Directive input for tailorable persona rules.

---

## 🏗️ Architecture & Technology Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, Lucide Icons, Motion, React Markdown, Remark GFM.
- **Backend Server**: Express.js server on Node.js, bundling via `esbuild`.
- **AI SDK**: `@google/genai` (Google GenAI SDK) with server-side API proxying (`/api/chat/stream` & `/api/tts`).
- **Security**: Server-side API key containment via `GEMINI_API_KEY` in environment variables.

---

## 🚀 Getting Started

### Environment Variables

Copy the example environment configuration:
```bash
cp .env.example .env
```

Define required variables:
```env
GEMINI_API_KEY="your-google-gemini-api-key"
APP_URL="http://localhost:3000"
```

### Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```
   Access the application at `http://localhost:3000`.

### Production Build & Deployment

1. Build for production:
   ```bash
   npm run build
   ```
   This compiles Vite static assets to `dist/` and bundles `server.ts` into CommonJS `dist/server.cjs`.

2. Start the production server:
   ```bash
   npm run start
   ```

---

## 🔒 Security Best Practices

- **Zero Client Key Exposure**: All calls to the Google Gemini API pass through server-side routes (`/api/chat/stream`, `/api/tts`).
- **Input Sanitization & Body Limits**: `express.json` is configured with a 10MB payload limit to safely support base64 image/file uploads without buffer overflow vulnerabilities.
- **Header Security & Error Shielding**: SSE headers (`text/event-stream`, `no-cache`, `keep-alive`) prevent proxy buffer delays, and backend exceptions are formatted gracefully to prevent raw stack trace exposure.

---

## 📄 License
MIT License. Created for Nexus AI Platform.
