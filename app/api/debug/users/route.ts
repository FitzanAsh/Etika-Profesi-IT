import { NextResponse } from 'next/server';
import { getSupabaseServiceRoleClient } from '@/lib/supabase-client';

export async function GET() {
    try {
        const supabase = getSupabaseServiceRoleClient();

        // Fetch one user to see the structure
        const { data: users, error } = await supabase
            .from('users')
            .select('*')
            .limit(1);

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({
            message: 'Users table inspection',
            sample_user: users?.[0] || 'No users found',
            columns: users?.[0] ? Object.keys(users[0]) : 'Unknown'
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
