import { getSupabaseServiceRoleClient } from '@/lib/supabase-client';
import { notFound } from 'next/navigation';

export async function getPublicContent(slug: string) {
    const supabase = getSupabaseServiceRoleClient();

    const { data, error } = await supabase
        .from('contents')
        .select('*')
        .eq('slug', slug)
        .single();

    if (error || !data) {
        console.error(`Content not found for slug: ${slug}`, error);
        return null;
    }

    return data;
}
