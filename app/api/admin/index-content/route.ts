import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { embedText } from "@/lib/ai/embed-text";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function chunkText(text: string, maxLength = 800) {
    const chunks: string[] = [];
    let current = text.trim();

    while (current.length > 0) {
        chunks.push(current.slice(0, maxLength));
        current = current.slice(maxLength);
    }

    return chunks;
}

export async function GET() {
    console.log("🔍 Starting re-index...");

    const { data: contents, error } = await supabase.from("contents").select("*");

    if (error) {
        console.error("❌ Failed fetching contents", error);
        return NextResponse.json({ success: false, error: error.message });
    }

    let totalChunks = 0;

    for (const item of contents) {
        if (!item.body || item.body.trim() === "") continue;

        // delete existing embeddings for content (re-indexing)
        await supabase.from("embeddings").delete().eq("content_id", item.id);

        const chunks = chunkText(item.body, 800);

        for (let i = 0; i < chunks.length; i++) {
            const embedding = await embedText(chunks[i]);

            await supabase.from("embeddings").insert({
                content_id: item.id,
                chunk_text: chunks[i],
                chunk_index: i,
                embedding
            });

            totalChunks++;
        }
    }

    return NextResponse.json({
        success: true,
        indexed_contents: contents.length,
        generated_chunks: totalChunks
    });
}
