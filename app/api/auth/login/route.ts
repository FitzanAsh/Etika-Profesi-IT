import { NextResponse } from 'next/server';
import { supabaseBrowser } from '@/lib/supabase-client';

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();
        if (!email || !password) {
            return NextResponse.json({ error: 'Missing credentials' }, { status: 400 });
        }

        const { data, error } = await supabaseBrowser.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 401 });
        }

        return NextResponse.json({ success: true, user: data.user });
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Server error';
        return NextResponse.json(
            { error: message },
            { status: 500 }
        );
    }
}
