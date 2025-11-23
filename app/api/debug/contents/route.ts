import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET() {
    const { data, error } = await supabase.from("contents").select("*");

    return NextResponse.json({
        ok: !error,
        error,
        rows: data?.length || 0,
        sample: data?.[0] || null,
    });
}
