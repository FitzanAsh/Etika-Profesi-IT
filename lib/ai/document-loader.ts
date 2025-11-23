import { getSupabaseServiceRoleClient } from '../supabase-client';
import { DocumentChunk } from '@/types/chat';
import { chunkBySentences, extractTextFromMarkdown } from './text-chunker';

/**
 * Load all content from Supabase and convert to document chunks
 */
export async function loadContentFromSupabase(): Promise<DocumentChunk[]> {
    const supabase = getSupabaseServiceRoleClient();

    const { data: contents, error } = await supabase
        .from('contents')
        .select('id, title, slug, body')
        .order('order_index', { ascending: true });

    if (error) {
        console.error('Error loading content:', error);
        return [];
    }

    const chunks: DocumentChunk[] = [];

    for (const content of contents || []) {
        // Extract plain text from markdown
        const plainText = extractTextFromMarkdown(content.body || '');

        // Chunk the text
        const textChunks = chunkBySentences(plainText, 800);

        // Create document chunks with metadata
        textChunks.forEach((chunkText, index) => {
            chunks.push({
                id: `${content.id}-${index}`,
                contentId: content.id,
                chunkText,
                metadata: {
                    title: content.title,
                    chapter: content.slug,
                    chunkIndex: index,
                },
            });
        });
    }

    return chunks;
}

/**
 * Load content from uploaded DOCX file
 * Note: This requires the file to be uploaded to /public/docs/ first
 */
export async function loadContentFromDOCX(): Promise<DocumentChunk[]> {
    // TODO: Implement DOCX parsing when file is uploaded
    // For now, return empty array
    // Will need to use a library like 'mammoth' to extract text from DOCX
    console.warn('DOCX loading not yet implemented - waiting for file upload');
    return [];
}

/**
 * Load all documents from available sources
 */
export async function loadAllDocuments(): Promise<DocumentChunk[]> {
    const [supabaseChunks, docxChunks] = await Promise.all([
        loadContentFromSupabase(),
        loadContentFromDOCX(),
    ]);

    return [...supabaseChunks, ...docxChunks];
}
