import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import mammoth from 'mammoth';
import fs from 'fs';
import path from 'path';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
    try {
        // Skip auto-import in production
        if (process.env.NODE_ENV === 'production') {
            return NextResponse.json({
                success: false,
                error: 'Auto-import disabled in production. Use admin panel instead.'
            });
        }

        console.log('📄 Starting DOCX import...');

        // Path to DOCX file
        const docxPath = path.join(process.cwd(), 'app', '(public)', 'docs', 'makalah.docx');

        // Check if file exists
        if (!fs.existsSync(docxPath)) {
            return NextResponse.json({
                success: false,
                error: 'File makalah.docx tidak ditemukan'
            });
        }

        // Read and parse DOCX
        const buffer = fs.readFileSync(docxPath);
        const result = await mammoth.extractRawText({ buffer });
        const fullText = result.value;

        console.log('✅ DOCX parsed successfully');
        console.log('📝 Total characters:', fullText.length);

        // Split into sections
        const sections = splitIntoSections(fullText);
        console.log('📚 Found sections:', sections.length);

        // Get existing content
        const { data: existingContents, error: fetchError } = await supabase
            .from('contents')
            .select('*');

        if (fetchError) {
            console.error('❌ Supabase error:', fetchError);
            return NextResponse.json({
                success: false,
                error: 'Failed to fetch existing contents: ' + fetchError.message
            });
        }

        if (!existingContents || existingContents.length === 0) {
            console.warn('⚠️ No existing contents found in database');
            return NextResponse.json({
                success: false,
                error: 'Database contents table is empty. Please seed database first using /api/seed'
            });
        }

        console.log('📋 Existing contents:', existingContents.length);
        console.log('📋 Slugs:', existingContents.map(c => c.slug).join(', '));

        let updatedCount = 0;

        // Update each section by matching slug
        for (const section of sections) {
            const matchingContent = existingContents.find(
                c => c.slug === section.slug
            );

            if (matchingContent) {
                console.log(`🔄 Updating ${section.slug}...`);

                const { error: updateError } = await supabase
                    .from('contents')
                    .update({
                        body: section.content,
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', matchingContent.id);

                if (!updateError) {
                    updatedCount++;
                    console.log(`✅ Updated: ${section.title}`);
                } else {
                    console.error(`❌ Failed to update ${section.slug}:`, updateError);
                }
            } else {
                console.warn(`⚠️ No match for slug: ${section.slug}`);
            }
        }

        return NextResponse.json({
            success: true,
            updated_sections: updatedCount,
            total_sections: sections.length,
            existing_slugs: existingContents.map(c => c.slug),
            message: updatedCount > 0
                ? `Updated ${updatedCount} sections! Run /api/admin/index-content to re-index.`
                : 'No sections matched. Check existing_slugs for available slugs.'
        });

    } catch (error) {
        console.error('❌ Import error:', error);
        return NextResponse.json({
            success: false,
            error: String(error)
        }, { status: 500 });
    }
}

function splitIntoSections(text: string) {
    const sections = [];

    const patterns = [
        {
            title: 'Abstrak',
            slug: 'abstrak',
            start: /ABSTRAK|Abstrak/i,
            end: /BAB\s*I|PENDAHULUAN|Pendahuluan|KATA PENGANTAR/i
        },
        {
            title: 'Pendahuluan',
            slug: 'pendahuluan',
            start: /BAB\s*I|PENDAHULUAN|Pendahuluan/i,
            end: /BAB\s*II|LANDASAN TEORI|Landasan Teori/i
        },
        {
            title: 'Landasan Teori',
            slug: 'landasan-teori',
            start: /BAB\s*II|LANDASAN TEORI|Landasan Teori/i,
            end: /BAB\s*III|PEMBAHASAN|Pembahasan/i
        },
        {
            title: 'Pembahasan',
            slug: 'pembahasan',
            start: /BAB\s*III|PEMBAHASAN|Pembahasan/i,
            end: /BAB\s*IV|BAB\s*V|PENUTUP|Penutup|KESIMPULAN/i
        },
        {
            title: 'Penutup',
            slug: 'penutup',
            start: /BAB\s*IV|BAB\s*V|PENUTUP|Penutup|KESIMPULAN/i,
            end: /DAFTAR PUSTAKA|Daftar Pustaka|REFERENSI/i
        },
        {
            title: 'Daftar Pustaka',
            slug: 'daftar-pustaka',
            start: /DAFTAR PUSTAKA|Daftar Pustaka|REFERENSI/i,
            end: null
        }
    ];

    for (const pattern of patterns) {
        const startMatch = text.match(pattern.start);

        if (startMatch && startMatch.index !== undefined) {
            const startIndex = startMatch.index;
            let endIndex = text.length;

            if (pattern.end) {
                const endMatch = text.match(pattern.end);
                if (endMatch && endMatch.index) {
                    endIndex = endMatch.index;
                }
            }

            let content = text.substring(startIndex, endIndex).trim();

            if (content.length > 50000) {
                content = content.substring(0, 50000);
            }

            sections.push({
                title: pattern.title,
                slug: pattern.slug,
                content: content
            });
        }
    }

    return sections;
}
