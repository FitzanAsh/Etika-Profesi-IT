import { DocumentChunk, VectorSearchResult } from '@/types/chat';

/**
 * Simple in-memory vector store using cosine similarity
 * Note: For production, use Supabase pg_vector or Pinecone
 */
class InMemoryVectorStore {
    private chunks: DocumentChunk[] = [];

    /**
     * Add document chunks to the store
     */
    async addDocuments(chunks: DocumentChunk[]) {
        this.chunks = [...this.chunks, ...chunks];
        console.log(`Added ${chunks.length} chunks to vector store. Total: ${this.chunks.length}`);
    }

    /**
     * Search for similar documents using cosine similarity
     * @param queryEmbedding - Embedding vector of the query
     * @param topK - Number of results to return
     */
    async search(queryEmbedding: number[], topK: number = 5): Promise<VectorSearchResult[]> {
        if (!this.chunks.length) {
            return [];
        }

        // Calculate similarity scores
        const results = this.chunks
            .filter(chunk => chunk.embedding && chunk.embedding.length > 0)
            .map(chunk => ({
                chunk,
                similarity: this.cosineSimilarity(queryEmbedding, chunk.embedding!),
            }))
            .sort((a, b) => b.similarity - a.similarity)
            .slice(0, topK);

        return results;
    }

    /**
     * Calculate cosine similarity between two vectors
     */
    private cosineSimilarity(vecA: number[], vecB: number[]): number {
        const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
        const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
        const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));

        return dotProduct / (magnitudeA * magnitudeB);
    }

    /**
     * Clear all stored chunks
     */
    clear() {
        this.chunks = [];
    }

    /**
     * Get total number of chunks
     */
    getCount(): number {
        return this.chunks.length;
    }
}

// Singleton instance
let vectorStore: InMemoryVectorStore | null = null;

export function getVectorStore(): InMemoryVectorStore {
    if (!vectorStore) {
        vectorStore = new InMemoryVectorStore();
    }
    return vectorStore;
}

/**
 * Initialize vector store with documents
 */
export async function initializeVectorStore(chunks: DocumentChunk[]) {
    const store = getVectorStore();
    store.clear();
    await store.addDocuments(chunks);
    return store;
}
