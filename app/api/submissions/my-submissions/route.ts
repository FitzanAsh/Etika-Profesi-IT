import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServiceRoleClient } from '@/lib/supabase-client';

export async function GET(req: NextRequest) {
    try {
        const supabase = getSupabaseServiceRoleClient();

        // Get authenticated user
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Get query params
        const { searchParams } = new URL(req.url);
        const statusFilter = searchParams.get('status');

        // Build query
        let query = supabase
            .from('case_submissions')
            .select('*')
            .eq('submitted_by', user.id)
            .order('created_at', { ascending: false });

        // Apply status filter if provided
        if (statusFilter && ['pending', 'approved', 'rejected'].includes(statusFilter)) {
            query = query.eq('status', statusFilter);
        }

        const { data, error } = await query;

        if (error) {
            console.error('Query error:', error);
            return NextResponse.json(
                { error: 'Failed to fetch submissions' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            submissions: data
        });

    } catch (error: any) {
        console.error('My submissions error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}
