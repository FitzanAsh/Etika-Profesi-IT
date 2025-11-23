import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServiceRoleClient } from '@/lib/supabase-client';
import { sendSubmissionEmail } from '@/lib/email';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        // Validate required fields
        if (!body.title || !body.description) {
            return NextResponse.json(
                { error: 'Title and description are required' },
                { status: 400 }
            );
        }

        // Validate field lengths
        if (body.title.length > 255) {
            return NextResponse.json(
                { error: 'Title must be 255 characters or less' },
                { status: 400 }
            );
        }

        if (body.description.length > 10000) {
            return NextResponse.json(
                { error: 'Description must be 10000 characters or less' },
                { status: 400 }
            );
        }

        // Validate impact_level if provided
        if (body.impact_level && !['Low', 'Medium', 'High'].includes(body.impact_level)) {
            return NextResponse.json(
                { error: 'Impact level must be Low, Medium, or High' },
                { status: 400 }
            );
        }

        const supabase = getSupabaseServiceRoleClient();

        // Get authenticated user if exists
        const { data: { user } } = await supabase.auth.getUser();

        // Prepare submission data
        const submissionData = {
            title: body.title,
            description: body.description,
            attack_type: body.attack_type || null,
            impact_level: body.impact_level || null,
            date: body.date || null,
            source_url: body.source_url || null,
            mitigation: body.mitigation || null,
            status: 'pending',
            submitted_by: user?.id || null,
            submitter_email: body.submitter_email || user?.email || null,
        };

        // Insert submission
        const { data, error } = await supabase
            .from('case_submissions')
            .insert([submissionData])
            .select()
            .single();

        if (error) {
            console.error('Supabase insert error:', error);
            return NextResponse.json(
                { error: 'Failed to create submission' },
                { status: 500 }
            );
        }

        // Send confirmation email if email provided
        if (submissionData.submitter_email) {
            await sendSubmissionEmail(
                submissionData.submitter_email,
                "Pengajuan Studi Kasus Berhasil Masuk",
                `Halo, pengajuan studi kasus Anda dengan judul "${body.title}" berhasil dikirim dan sedang menunggu review admin.`
            );
        }

        return NextResponse.json({
            success: true,
            submission_id: data.id,
            message: 'Submission created successfully'
        });

    } catch (error: any) {
        console.error('Submission creation error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}
