import Groq from 'groq-sdk';

// Initialize Groq client
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY || 'REPLACE_LATER',
});

export { groq };

// Available models
export const GROQ_MODELS = {
    LLAMA_3_1: 'llama-3.1-70b-versatile',
    LLAMA_3_1_8B: 'llama-3.1-8b-instant',
    MIXTRAL: 'mixtral-8x7b-32768',
} as const;

// Default model for chat
export const DEFAULT_CHAT_MODEL = GROQ_MODELS.LLAMA_3_1_8B;

// Embedding model (Groq doesn't have dedicated embedding model, we'll use OpenAI compatible)
export const EMBEDDING_MODEL = 'text-embedding-ada-002'; // Placeholder

/**
 * Generate chat completion using Groq
 */
export async function generateChatCompletion(
    messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>,
    options?: {
        model?: string;
        temperature?: number;
        maxTokens?: number;
    }
) {
    const response = await groq.chat.completions.create({
        model: options?.model || DEFAULT_CHAT_MODEL,
        messages,
        temperature: options?.temperature || 0.7,
        max_tokens: options?.maxTokens || 1024,
    });

    return response.choices[0]?.message?.content || '';
}

/**
 * Generate streaming chat completion
 */
export async function generateStreamingCompletion(
    messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>,
    options?: {
        model?: string;
        temperature?: number;
    }
) {
    const stream = await groq.chat.completions.create({
        model: options?.model || DEFAULT_CHAT_MODEL,
        messages,
        temperature: options?.temperature || 0.7,
        stream: true,
    });

    return stream;
}
