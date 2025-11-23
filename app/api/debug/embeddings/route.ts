import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
    const { data, error } = await supabase
        .from("embeddings")
        .select("id, content_id, chunk_text, chunk_index")
        .order('created_at', { ascending: false })
        .limit(2);

    if (error) {
        return NextResponse.json({
            rows: 0,
            sample: [],
            error: error.message
        });
    }

    // Also get total count
    const { count } = await supabase
        .from("embeddings")
        .select("*", { count: "exact", head: true });

    return NextResponse.json({
        rows: count || 0,
        sample: data || []
    });
}
