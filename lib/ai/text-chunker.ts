/**
 * Split text into chunks for embedding
 * @param text - Full text to chunk
 * @param chunkSize - Target size per chunk (in characters)
 * @param overlap - Overlap between chunks for context continuity
 */
export function chunkText(
    text: string,
    chunkSize: number = 1000,
    overlap: number = 200
): string[] {
    const chunks: string[] = [];
    let startIndex = 0;

    while (startIndex < text.length) {
        const endIndex = Math.min(startIndex + chunkSize, text.length);
        const chunk = text.substring(startIndex, endIndex);
        chunks.push(chunk.trim());

        // Move to next chunk with overlap
        startIndex += chunkSize - overlap;
    }

    return chunks.filter(chunk => chunk.length > 50); // Filter out very small chunks
}

/**
 * Chunk text by sentences for better semantic boundaries
 */
export function chunkBySentences(
    text: string,
    maxChunkSize: number = 1000
): string[] {
    // Split by period, exclamation, or question mark followed by space
    const sentences = text.split(/(?<=[.!?])\s+/);
    const chunks: string[] = [];
    let currentChunk = '';

    for (const sentence of sentences) {
        if ((currentChunk + sentence).length > maxChunkSize && currentChunk.length > 0) {
            chunks.push(currentChunk.trim());
            currentChunk = sentence;
        } else {
            currentChunk += (currentChunk ? ' ' : '') + sentence;
        }
    }

    if (currentChunk) {
        chunks.push(currentChunk.trim());
    }

    return chunks;
}

/**
 * Extract text from markdown content
 */
export function extractTextFromMarkdown(markdown: string): string {
    // Remove markdown formatting
    let text = markdown
        .replace(/#{1,6}\s/g, '') // Headers
        .replace(/\*\*(.+?)\*\*/g, '$1') // Bold
        .replace(/\*(.+?)\*/g, '$1') // Italic
        .replace(/`(.+?)`/g, '$1') // Inline code
        .replace(/```[\s\S]*?```/g, '') // Code blocks
        .replace(/\[(.+?)\]\(.+?\)/g, '$1') // Links
        .replace(/!\[.*?\]\(.+?\)/g, '') // Images
        .replace(/^\s*[-*+]\s/gm, '') // Lists
        .replace(/^\s*\d+\.\s/gm, ''); // Numbered lists

    return text.trim();
}
