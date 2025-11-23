import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with service role for searching
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get('q') || '';
        const type = searchParams.get('type') || 'all'; // 'all', 'contents', 'cases'

        if (!query || query.trim().length < 2) {
            return NextResponse.json({
                success: false,
                error: 'Query too short. Minimum 2 characters required.'
            }, { status: 400 });
        }

        const results: any = {
            contents: [],
            cases: []
        };

        // Search in contents (topics/chapters)
        if (type === 'all' || type === 'contents') {
            const { data: contentsData, error: contentsError } = await supabase
                .from('contents')
                .select('id, title, slug, body')
                .or(`title.ilike.%${query}%,body.ilike.%${query}%`)
                .limit(10);

            if (!contentsError && contentsData) {
                results.contents = contentsData.map((item: any) => ({
                    id: item.id,
                    title: item.title,
                    slug: item.slug,
                    type: 'content',
                    excerpt: item.body ? item.body.substring(0, 150) + '...' : '',
                    url: `/topik/${item.slug}`
                }));
            }
        }

        // Search in cases (studi kasus)
        if (type === 'all' || type === 'cases') {
            const { data: casesData, error: casesError } = await supabase
                .from('cases')
                .select('id, title, slug, description, attack_type')
                .or(`title.ilike.%${query}%,description.ilike.%${query}%,attack_type.ilike.%${query}%`)
                .limit(10);

            if (!casesError && casesData) {
                results.cases = casesData.map((item: any) => ({
                    id: item.id,
                    title: item.title,
                    slug: item.slug,
                    type: 'case',
                    excerpt: item.description ? item.description.substring(0, 150) + '...' : '',
                    attack_type: item.attack_type,
                    url: `/cases#${item.slug}`
                }));
            }
        }

        const totalResults = results.contents.length + results.cases.length;

        return NextResponse.json({
            success: true,
            query,
            totalResults,
            results
        });

    } catch (error) {
        console.error('Search error:', error);
        return NextResponse.json({
            success: false,
            error: 'Internal server error'
        }, { status: 500 });
    }
}
