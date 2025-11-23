'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, CheckCircle, XCircle, MessageCircle } from 'lucide-react';

interface Submission {
    id: string;
    title: string;
    description: string;
    attack_type: string;
    impact_level: string;
    date: string;
    source_url: string;
    mitigation: string;
    status: string;
    submitted_at: string;
    submitter_email: string | null;
    admin_feedback: string | null;
}

import { supabaseBrowser } from '@/lib/supabase-client';

export default function AdminSubmissionDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [submission, setSubmission] = useState<Submission | null>(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [feedback, setFeedback] = useState('');

    useEffect(() => {
        fetchSubmission();
    }, [params.id]);

    // ... (inside component)

    async function fetchSubmission() {
        setLoading(true);
        try {
            const { data, error } = await supabaseBrowser
                .from('case_submissions')
                .select('*')
                .eq('id', params.id)
                .single();

            if (error) throw error;

            if (data) {
                setSubmission(data);
                setFeedback(data.admin_feedback || '');
            }
        } catch (error) {
            console.error('Failed to fetch submission:', error);
        } finally {
            setLoading(false);
        }
    }

    async function handleAction(action: 'approve' | 'reject' | 'request_changes') {
        if (!submission) return;

        if (action === 'reject' && !feedback.trim()) {
            alert('Mohon berikan alasan penolakan');
            return;
        }

        if (action === 'request_changes' && !feedback.trim()) {
            alert('Mohon berikan catatan revisi');
            return;
        }

        const confirmMessages = {
            approve: 'Approve submission ini? Akan dipublikasikan ke halaman public.',
            reject: 'Reject submission ini? User akan menerima notifikasi.',
            request_changes: 'Kirim request revisi ke user?',
        };

        if (!confirm(confirmMessages[action])) return;

        setActionLoading(true);
        try {
            // Get session token for auth
            const { data: { session } } = await supabaseBrowser.auth.getSession();
            const token = session?.access_token;

            if (!token) {
                alert('Unauthorized: No session found');
                return;
            }

            const response = await fetch(`/api/admin/submissions/${params.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    action,
                    admin_feedback: feedback,
                }),
            });

            const data = await response.json();

            if (data.success) {
                alert(`✅ Submission ${action === 'approve' ? 'approved' : action === 'reject' ? 'rejected' : 'updated'} successfully!`);
                router.push('/admin/submissions');
            } else {
                alert(data.error || 'Failed to process action');
            }
        } catch (error: any) {
            alert('Error: ' + error.message);
        } finally {
            setActionLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full"></div>
            </div>
        );
    }

    if (!submission) {
        return (
            <div className="text-center py-20">
                <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">Submission not found</h1>
                <Link href="/admin/submissions" className="text-blue-600 hover:underline">
                    ← Back to submissions
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-6">

            {/* Header */}
            <div className="flex items-center gap-4">
                <Link
                    href="/admin/submissions"
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                    <ChevronLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Review Submission</h1>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                        Status: <span className="font-medium capitalize">{submission.status}</span>
                    </p>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">

                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Submission Details */}
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-6 border border-slate-200 dark:border-slate-700">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                            {submission.title}
                        </h2>

                        <div className="grid md:grid-cols-2 gap-4 mb-6 text-sm">
                            <div>
                                <span className="text-slate-500 dark:text-slate-400">Attack Type:</span>
                                <p className="font-medium text-slate-900 dark:text-white">{submission.attack_type || '-'}</p>
                            </div>
                            <div>
                                <span className="text-slate-500 dark:text-slate-400">Impact Level:</span>
                                <p className="font-medium text-slate-900 dark:text-white">{submission.impact_level || '-'}</p>
                            </div>
                            <div>
                                <span className="text-slate-500 dark:text-slate-400">Date:</span>
                                <p className="font-medium text-slate-900 dark:text-white">
                                    {submission.date ? new Date(submission.date).toLocaleDateString('id-ID') : '-'}
                                </p>
                            </div>
                            <div>
                                <span className="text-slate-500 dark:text-slate-400">Submitted:</span>
                                <p className="font-medium text-slate-900 dark:text-white">
                                    {new Date(submission.submitted_at).toLocaleDateString('id-ID')}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Description</h3>
                                <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                                    {submission.description}
                                </p>
                            </div>

                            {submission.source_url && (
                                <div>
                                    <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Source URL</h3>
                                    <a
                                        href={submission.source_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 dark:text-blue-400 hover:underline break-all"
                                    >
                                        {submission.source_url}
                                    </a>
                                </div>
                            )}

                            {submission.mitigation && (
                                <div>
                                    <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Mitigation Strategy</h3>
                                    <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                                        {submission.mitigation}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                </div>

                {/* Sidebar - Review Actions */}
                <div className="space-y-6">

                    {/* Submitter Info */}
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-6 border border-slate-200 dark:border-slate-700">
                        <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Submitter Info</h3>
                        <div className="text-sm">
                            <p className="text-slate-600 dark:text-slate-400">
                                {submission.submitter_email || 'Anonymous (guest)'}
                            </p>
                        </div>
                    </div>

                    {/* Admin Feedback */}
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-6 border border-slate-200 dark:border-slate-700">
                        <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Admin Feedback</h3>
                        <textarea
                            rows={5}
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 text-sm"
                            placeholder="Add feedback or notes for the user..."
                        />
                        <p className="text-xs text-slate-500 mt-2">
                            This feedback will be sent to the user via email
                        </p>
                    </div>

                    {/* Action Buttons */}
                    {submission.status === 'pending' && (
                        <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-6 border border-slate-200 dark:border-slate-700 space-y-3">
                            <button
                                onClick={() => handleAction('approve')}
                                disabled={actionLoading}
                                className="w-full px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                            >
                                <CheckCircle className="w-5 h-5" />
                                Approve & Publish
                            </button>

                            <button
                                onClick={() => handleAction('request_changes')}
                                disabled={actionLoading}
                                className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                            >
                                <MessageCircle className="w-5 h-5" />
                                Request Changes
                            </button>

                            <button
                                onClick={() => handleAction('reject')}
                                disabled={actionLoading}
                                className="w-full px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                            >
                                <XCircle className="w-5 h-5" />
                                Reject
                            </button>
                        </div>
                    )}

                    {submission.status !== 'pending' && (
                        <div className="bg-slate-100 dark:bg-slate-900/50 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
                            <p className="text-sm text-slate-600 dark:text-slate-400 text-center">
                                This submission has been {submission.status}
                            </p>
                        </div>
                    )}

                </div>

            </div>

        </div>
    );
}
