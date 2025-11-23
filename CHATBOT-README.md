# 🤖 AI Chatbot Implementation - Setup Guide

## ✅ What Was Built

A complete AI chatbot system using:
- **Groq (Llama 3.1)** for AI responses
- **RAG (Retrieval Augmented Generation)** for context-aware answers
- **Supabase** as knowledge base
- **React + TypeScript** for UI

---

## 📁 Files Created

### Backend (8 files)
1. `lib/ai/groq-client.ts` - Groq SDK wrapper
2. `lib/ai/embeddings.ts` - Text embedding generator
3. `lib/ai/text-chunker.ts` - Document chunking utilities
4. `lib/ai/document-loader.ts` - Load content from Supabase
5. `lib/ai/vector-store.ts` - In-memory vector search
6. `lib/ai/rag-retriever.ts` - RAG orchestrator
7. `app/api/chat/route.ts` - Chat API endpoint
8. `app/api/admin/index-content/route.ts` - Reindex knowledge base

### Frontend (6 files)
1. `components/chat/chat-widget.tsx` - Floating button
2. `components/chat/chat-window.tsx` - Main chat UI
3. `components/chat/message-bubble.tsx` - Message display
4. `components/chat/chat-input.tsx` - Input box
5. `components/chat/typing-indicator.tsx` - Loading animation
6. `components/chat/source-citation.tsx` - Source references

### Utilities
1. `hooks/use-chat.ts` - Chat state management
2. `types/chat.ts` - TypeScript types

### Database
1. `supabase-chatbot-setup.sql` - PostgreSQL setup script

---

## 🚀 Setup Instructions

### Step 1: Install Dependencies
```bash
npm install
```

Dependencies installed:
- `groq-sdk` - Groq AI client
- `ai` - AI SDK utilities
- `@ai-sdk/groq` - Groq integration

### Step 2: Get Groq API Key
1. Go to: https://console.groq.com/
2. Sign up / Log in
3. Create an API key
4. Copy the key (starts with `gsk_...`)

### Step 3: Add API Key to .env.local
Add this line to your `.env.local` file:
```bash
GROQ_API_KEY=gsk_your_actual_api_key_here
```

### Step 4: Setup Supabase pgvector
1. Open Supabase SQL Editor
2. Copy content from `supabase-chatbot-setup.sql`
3. Run the script
4. Verify the `embeddings` table was created

### Step 5: Upload DOCX File (Optional)
1. Create folder: `app/(public)/docs/`
2. Upload your DOCX file there
3. Update `lib/ai/document-loader.ts` to parse it

### Step 6: Index Knowledge Base
After running the app:
```bash
npm run dev
```

Initialize the chatbot by calling:
```
POST http://localhost:3000/api/admin/index-content
```

This will load content from Supabase and create embeddings.

---

## 🎯 Features

### Chat Modes
1. **Normal Mode** - Friendly explanations
2. **Academic Mode** - Formal citations

### RAG System
- Automatically retrieves relevant content
- Shows source references
- Rejects off-topic questions

### UI Features
- Floating chat button (bottom-right)
- Real-time typing indicator
- Message history
- Source citations

---

## 📝 Important Notes

### Current Limitations

1. **Embeddings are placeholder**
   - Using simple hash-based embeddings
   - For production, replace with OpenAI embeddings API
   - See note in `lib/ai/embeddings.ts`

2. **Vector search is in-memory**
   - Resets on server restart
   - For production, implement Supabase pgvector integration
   - SQL setup provided in `supabase-chatbot-setup.sql`

3. **DOCX parsing not implemented**
   - Currently only uses Supabase content
   - Install `mammoth` library to parse DOCX
   - Update `lib/ai/document-loader.ts`

### Production Improvements Needed

1. **Use real embeddings:**
   ```bash
   npm install openai
   ```
   Replace `lib/ai/embeddings.ts` with OpenAI API

2. **Implement Supabase vector search:**
   - Update `lib/ai/vector-store.ts`
   - Use pgvector instead of in-memory

3. **Add rate limiting:**
   - Prevent API abuse
   - Use `@upstash/ratelimit` or similar

4. **Add authentication:**
   - Protect admin endpoints
   - Track usage per user

---

## 🧪 Testing

### Test Chat Functionality
1. Start dev server: `npm run dev`
2. Open homepage
3. Click floating chat button (bottom-right)
4. Try asking:
   - "Apa itu phishing?"
   - "Jelaskan tentang Rational Choice Theory"
   - "Apa dampak phishing terhadap akses ilegal?"

### Test Admin Endpoint
```bash
curl -X POST http://localhost:3000/api/admin/index-content
```

---

## 🐛 Troubleshooting

### "Cannot find module" errors
- Restart TypeScript server: Ctrl+Shift+P → "Restart TS Server"
- Or restart VS Code

### Chat not responding
1. Check Groq API key is set correctly
2. Check browser console for errors
3. Check server logs
4. Verify `/api/chat` endpoint is accessible

### No relevant results from RAG
1. Make sure knowledge base is indexed
2. Call `/api/admin/index-content` first
3. Check if content exists in Supabase

---

## 📚 Architecture

```
User Question
    ↓
Chat UI (ChatWidget)
    ↓
/api/chat endpoint
    ↓
RAG Retriever
    ├─ Load documents (Supabase)
    ├─ Generate embeddings
    ├─ Vector similarity search
    └─ Get top 3 relevant chunks
    ↓
Groq AI (with context)
    ↓
Response with sources
```

---

## 🎨 UI Integration

Chatbot is automatically added to all public routes via:
- `app/(public)/layout.tsx`

To hide on specific pages, modify the layout or add route checks.

---

## ✅ Next Steps

1. ✅ Get Groq API key
2. ✅ Add to .env.local
3. ✅ Run Supabase SQL setup
4. ✅ Test the chatbot
5. [ ] Replace with real embeddings (OpenAI)
6. [ ] Implement pgvector search
7. [ ] Add DOCX parsing
8. [ ] Deploy to production

---

**Built with ❤️ using Next.js 14, Groq AI, and Supabase**
