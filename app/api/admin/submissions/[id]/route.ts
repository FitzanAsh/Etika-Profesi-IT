import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServiceRoleClient } from '@/lib/supabase-client';
import { sendSubmissionEmail } from '@/lib/email';
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

export async function PATCH(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const supabase = getSupabaseServiceRoleClient();

        let accessToken = '';

        // 1. Try to get token from Authorization header (Bearer token)
        const authHeader = req.headers.get('Authorization');
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.substring(7);
            if (token) {
                accessToken = token;
            }
        }

        // 2. If no Bearer token, try cookies
        if (!accessToken) {
            const cookieStore = cookies();
            const projectUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
            const projectRef = projectUrl.match(/https:\/\/([^.]+)\./)?.[1];

            if (projectRef) {
                const cookieName = `sb-${projectRef}-auth-token`;
                const authCookie = cookieStore.get(cookieName);

                if (authCookie) {
                    try {
                        const sessionData = JSON.parse(decodeURIComponent(authCookie.value));
                        accessToken = sessionData.access_token || sessionData[0];
                    } catch (e) {
                        console.error('Cookie parse error', e);
                    }
                }
            }
        }

        if (!accessToken) {
            return NextResponse.json({ error: 'Unauthorized - No token found' }, { status: 401 });
        }

        // Verify the user using the access token
        const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

        if (authError || !user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
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

        const body = await req.json();
        const { action, admin_feedback } = body;

        if (!action || !['approve', 'reject', 'request_changes'].includes(action)) {
            return NextResponse.json(
                { error: 'Invalid action. Must be: approve, reject, or request_changes' },
                { status: 400 }
            );
        }

        // Get submission
        const { data: submission, error: fetchError } = await supabase
            .from('case_submissions')
            .select('*')
            .eq('id', params.id)
            .single();

        if (fetchError || !submission) {
            return NextResponse.json(
                { error: 'Submission not found' },
                { status: 404 }
            );
        }

        const now = new Date().toISOString();
        let updateData: any = {
            reviewed_by: user.id,
            reviewed_at: now,
            admin_feedback: admin_feedback || null,
        };

        let emailSubject = '';
        let emailMessage = '';

        // Handle different actions
        if (action === 'approve') {
            updateData.status = 'approved';
            updateData.approved_at = now;

            // Insert into public cases table
            const { error: insertError } = await supabase
                .from('cases')
                .insert([{
                    title: submission.title,
                    description: submission.description,
                    attack_type: submission.attack_type,
                    impact_level: submission.impact_level,
                    date: submission.date,
                    image_url: submission.source_url || 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80',
                    mitigation: submission.mitigation,
                    source: 'user-contribution',
                }]);

            if (insertError) {
                console.error('Failed to insert into cases:', insertError);
            }

            emailSubject = "Pengajuan Anda Disetujui 🎉";
            emailMessage = `Selamat! Konten Anda dengan judul "${submission.title}" telah disetujui dan diterbitkan.`;

        } else if (action === 'reject') {
            updateData.status = 'rejected';

            emailSubject = "Pengajuan Ditolak ❌";
            emailMessage = `Maaf, pengajuan Anda dengan judul "${submission.title}" ditolak.\n\nAlasan: ${admin_feedback || 'Tidak ada alasan yang diberikan.'}`;

        } else if (action === 'request_changes') {
            // Keep status as pending

            emailSubject = "Pengajuan Perlu Revisi ✏️";
            emailMessage = `Admin meminta revisi pada konten Anda dengan judul "${submission.title}".\n\nCatatan: ${admin_feedback || 'Silakan perbaiki konten Anda.'}`;
        }

        // Update submission
        const { data: updatedSubmission, error: updateError } = await supabase
            .from('case_submissions')
            .update(updateData)
            .eq('id', params.id)
            .select()
            .single();

        if (updateError) {
            console.error('Update error:', updateError);
            return NextResponse.json(
                { error: 'Failed to update submission' },
                { status: 500 }
            );
        }

        // Send email notification if submitter email exists
        if (submission.submitter_email) {
            await sendSubmissionEmail(
                submission.submitter_email,
                emailSubject,
                emailMessage
            );
        }

        // Create notification record
        if (submission.submitted_by) {
            await supabase
                .from('notifications')
                .insert([{
                    user_id: submission.submitted_by,
                    type: `submission_${action}`,
                    title: emailSubject,
                    message: emailMessage,
                    link: `/my-submissions`,
                }]);
        }

        return NextResponse.json({
            success: true,
            submission: updatedSubmission,
            message: `Submission ${action}d successfully`
        });

    } catch (error: any) {
        console.error('Admin review error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}
