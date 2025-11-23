import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServiceRoleClient } from '@/lib/supabase-client';
import { cookies } from 'next/headers';

async function checkAdminRole(userId: string): Promise<boolean> {
    const supabase = getSupabaseServiceRoleClient();
    const { data } = await supabase
        .from('users')
        .select('role')
        .eq('id', userId)
        .single();

    return data?.role === 'admin';
}

export async function GET(req: NextRequest) {
    try {
        const supabase = getSupabaseServiceRoleClient();

        // Manually parse session from cookies
        const cookieStore = cookies();
        const projectUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        const projectRef = projectUrl.match(/https:\/\/([^.]+)\./)?.[1];

        // DEBUG: Log all cookies
        const allCookies = cookieStore.getAll();
        console.log('🍪 All Cookies:', allCookies.map(c => c.name));
        console.log('🎯 Target Project Ref:', projectRef);

        if (!projectRef) {
            console.error('Could not extract project ref from URL');
            return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
        }

        const cookieName = `sb-${projectRef}-auth-token`;
        let authCookie = cookieStore.get(cookieName); // Changed to `let` to allow reassigning

        if (!authCookie) {
            console.log('❌ No auth cookie found with name:', cookieName);
            // Try to find any cookie starting with sb- and ending with -auth-token
            const fallbackCookie = allCookies.find(c => c.name.startsWith('sb-') && c.name.endsWith('-auth-token'));
            if (fallbackCookie) {
                console.log('⚠️ Found fallback cookie:', fallbackCookie.name);
                // Use this one instead
                authCookie = fallbackCookie; // Now we can reassign
            } else {
                return NextResponse.json({
                    error: 'Unauthorized - No session',
                    debug_cookies: allCookies.map(c => c.name),
                    expected_cookie: cookieName
                }, { status: 401 });
            }
        }

        // Parse the cookie value (it's usually a JSON string with access_token)
        let accessToken = '';
        try {
            // The cookie value might be URI encoded and might be a stringified JSON
            // format: ["access_token","refresh_token",...] or {"access_token":...}
            // Supabase v2 cookies are complex.
            // Let's try to just use getUser with the raw token if we can find it.

            // Actually, for supabase-js v2, the cookie is a JSON array or object.
            // We need to parse it.
            const sessionData = JSON.parse(decodeURIComponent(authCookie.value));
            accessToken = sessionData.access_token || sessionData[0];
        } catch (e) {
            console.error('Error parsing auth cookie:', e);
            return NextResponse.json({ error: 'Unauthorized - Invalid session' }, { status: 401 });
        }

        if (!accessToken) {
            return NextResponse.json({ error: 'Unauthorized - No token' }, { status: 401 });
        }

        // Verify the user using the access token
        const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

        if (authError || !user) {
            console.error('Auth error:', authError);
            return NextResponse.json(
                { error: 'Unauthorized - Invalid token' },
                { status: 401 }
            );
        }

        // Check if user is admin
        const isAdmin = await checkAdminRole(user.id);

        if (!isAdmin) {
            return NextResponse.json(
                { error: 'Forbidden - Admin access required' },
                { status: 403 }
            );
        }

        // Get query params
        const { searchParams } = new URL(req.url);
        const statusFilter = searchParams.get('status');

        // Build query
        let query = supabase
            .from('case_submissions')
            .select(`
        *,
        submitter:submitted_by(email, id)
      `)
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
        console.error('Admin submissions error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}
