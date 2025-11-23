import { NextResponse } from 'next/server';
import { getSupabaseServiceRoleClient } from '@/lib/supabase-client'; // Import Service Client

export async function GET() {
    try {
        // Use Service Role to bypass RLS
        const supabase = getSupabaseServiceRoleClient();

        const contentsData = [
            { title: 'Abstrak', slug: 'abstrak', source: 'database', body: '# Abstrak\n\n(Isi abstrak otomatis dari sistem...)' },
            { title: 'BAB I - Pendahuluan', slug: 'pendahuluan', source: 'database', body: '# BAB I Pendahuluan\n\n## 1.1 Latar Belakang\n(Isi pendahuluan...)' },
            { title: 'BAB II - Landasan Teori', slug: 'landasan-teori', source: 'database', body: '# BAB II Landasan Teori\n\n(Teori tentang Phishing...)' },
            { title: 'BAB III - Pembahasan', slug: 'pembahasan', source: 'database', body: '# BAB III Pembahasan\n\n(Analisis kasus...)' },
            { title: 'BAB IV - Penutup', slug: 'penutup', source: 'database', body: '# BAB IV Penutup\n\n(Kesimpulan...)' },
            { title: 'Daftar Pustaka', slug: 'daftar-pustaka', source: 'database', body: '# Daftar Pustaka\n\n1. Referensi A...' },
            { title: 'Identitas Tim', slug: 'tim', source: 'database', body: '# Tim Pengembang\n\n- Nama 1\n- Nama 2' },
        ];

        const results = [];

        for (const item of contentsData) {
            // Upsert: Insert or Update if slug exists
            const { error } = await supabase
                .from('contents')
                .upsert(item, { onConflict: 'slug' });

            if (error) {
                console.error('Error seeding:', item.title, error);
                results.push({ title: item.title, status: 'Failed', error: error.message });
            } else {
                results.push({ title: item.title, status: 'Success' });
            }
        }

        return NextResponse.json({ message: 'Database Seeding Completed', details: results });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Server error';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
