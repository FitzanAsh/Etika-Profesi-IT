import { createClient } from '@supabase/supabase-js';
import { embedText } from '@/lib/ai/embed-text';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function searchKnowledgeBase(query: string): Promise<string> {
    try {
        // Generate embedding for query
        const queryEmbedding = await embedText(query);

        // Vector similarity search
        const { data: similarChunks, error } = await supabase.rpc(
            'search_embeddings',
            {
                query_embedding: queryEmbedding,
                match_threshold: 0.5,
                match_count: 5
            }
        );

        if (error || !similarChunks || similarChunks.length === 0) {
            return "Tidak ada informasi relevan ditemukan.";
        }

        // Get content metadata
        const contentIds = [...new Set(similarChunks.map((c: any) => c.content_id))];
        const { data: contents } = await supabase
            .from('contents')
            .select('id, title')
            .in('id', contentIds);

        // Build context
        const context = similarChunks
            .map((chunk: any, idx: number) => {
                const content = contents?.find((c) => c.id === chunk.content_id);
                return `[${idx + 1}] ${content?.title || 'Unknown'}\n${chunk.chunk_text}`;
            })
            .join('\n\n');

        return context;
    } catch (error) {
        console.error('❌ Vector search error:', error);
        return "Error saat mencari informasi.";
    }
}
