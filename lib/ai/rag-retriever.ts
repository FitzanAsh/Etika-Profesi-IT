import { loadAllDocuments } from './document-loader';
import { generateEmbeddings } from './embeddings';
import { getVectorStore, initializeVectorStore } from './vector-store';
import { VectorSearchResult } from '@/types/chat';

/**
 * RAG Retriever - orchestrates document loading, embedding, and retrieval
 */
class RAGRetriever {
    private initialized = false;

    /**
     * Initialize the RAG system by loading and embedding all documents
     */
    async initialize() {
        if (this.initialized) {
            console.log('RAG already initialized');
            return;
        }

        console.log('Initializing RAG system...');

        // Load documents from all sources
        const chunks = await loadAllDocuments();
        console.log(`Loaded ${chunks.length} document chunks`);

        if (chunks.length === 0) {
            console.warn('No documents loaded - RAG will not work properly');
            return;
        }

        // Generate embeddings for all chunks
        console.log('Generating embeddings...');
        const embeddings = await generateEmbeddings(chunks.map(c => c.chunkText));

        // Attach embeddings to chunks
        chunks.forEach((chunk, i) => {
            chunk.embedding = embeddings[i];
        });

        // Initialize vector store
        await initializeVectorStore(chunks);

        this.initialized = true;
        console.log('RAG system initialized successfully');
    }

    /**
     * Retrieve relevant documents for a query
     */
    async retrieve(query: string, topK: number = 5): Promise<VectorSearchResult[]> {
        if (!this.initialized) {
            await this.initialize();
        }

        // Generate embedding for query
        const queryEmbedding = await generateEmbeddings([query]);

        // Search vector store
        const store = getVectorStore();
        const results = await store.search(queryEmbedding[0], topK);

        return results;
    }

    /**
     * Get retrieval context for chat
     */
    async getContext(query: string, topK: number = 3): Promise<string> {
        const results = await this.retrieve(query, topK);

        if (results.length === 0) {
            return 'Tidak ada informasi relevan yang ditemukan dalam dokumen.';
        }

        // Format context from retrieved chunks
        const context = results
            .map((result, index) => {
                const { chunk, similarity } = result;
                return `[Sumber ${index + 1}: ${chunk.metadata.title} - ${chunk.metadata.chapter}]\n${chunk.chunkText}`;
            })
            .join('\n\n---\n\n');

        return context;
    }

    /**
     * Check if RAG system is initialized
     */
    isInitialized(): boolean {
        return this.initialized;
    }
}

// Singleton instance
let retriever: RAGRetriever | null = null;

export function getRAGRetriever(): RAGRetriever {
    if (!retriever) {
        retriever = new RAGRetriever();
    }
    return retriever;
}
