// Chat message types
export interface ChatMessage {
    id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: Date;
    sources?: SourceReference[];
}

// Source reference from RAG
export interface SourceReference {
    contentId: number;
    title: string;
    chapter: string;
    snippet: string;
    relevanceScore?: number;
}

// Chat mode
export type ChatMode = 'normal' | 'academic';

// Chat request/response
export interface ChatRequest {
    message: string;
    mode: ChatMode;
    history?: ChatMessage[];
}

export interface ChatResponse {
    reply: string;
    sources: SourceReference[];
    mode: ChatMode;
}

// RAG document chunk
export interface DocumentChunk {
    id: string;
    contentId: number;
    chunkText: string;
    embedding?: number[];
    metadata: {
        title: string;
        chapter: string;
        chunkIndex: number;
    };
}

// Vector search result
export interface VectorSearchResult {
    chunk: DocumentChunk;
    similarity: number;
}
