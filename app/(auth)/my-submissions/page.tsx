'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Clock, CheckCircle, XCircle, ChevronRight } from 'lucide-react';

interface Submission {
    id: string;
    title: string;
    description: string;
    status: 'pending' | 'approved' | 'rejected';
    submitted_at: string;
    admin_feedback: string | null;
    attack_type: string;
    impact_level: string;
}

export default function MySubmissionsPage() {
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<string>('');

    useEffect(() => {
        fetchSubmissions();
    }, [filter]);

    async function fetchSubmissions() {
        setLoading(true);
        try {
            const url = filter
                ? `/api/submissions/my-submissions?status=${filter}`
                : '/api/submissions/my-submissions';

            const response = await fetch(url);
            const data = await response.json();

            if (data.success) {
                setSubmissions(data.submissions);
            }
        } catch (error) {
            console.error('Failed to fetch submissions:', error);
        } finally {
            setLoading(false);
        }
    }

    const getStatusBadge = (status: string) => {
        const badges = {
            pending: {
                icon: <Clock className="w-4 h-4" />,
                className: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800',
                label: 'Menunggu Review'
            },
            approved: {
                icon: <CheckCircle className="w-4 h-4" />,
                className: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800',
                label: 'Disetujui'
            },
            rejected: {
                icon: <XCircle className="w-4 h-4" />,
                className: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800',
                label: 'Ditolak'
            },
        };

        const badge = badges[status as keyof typeof badges];

        return (
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium border ${badge.className}`}>
                {badge.icon}
                {badge.label}
            </span>
        );
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-16 px-6">
            <div className="container max-w-6xl mx-auto">

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-3">
                        Pengajuan Saya
                    </h1>
                    <p className="text-lg text-slate-600 dark:text-slate-400">
                        Kelola dan pantau status pengajuan studi kasus Anda.
                    </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
                    <div className="flex gap-2">
                        <button
                            onClick={() => setFilter('')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === ''
                                ? 'bg-blue-600 text-white'
                                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700'
                                }`}
                        >
                            Semua
                        </button>
                        <button
                            onClick={() => setFilter('pending')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'pending'
                                ? 'bg-blue-600 text-white'
                                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700'
                                }`}
                        >
                            Pending
                        </button>
                        <button
                            onClick={() => setFilter('approved')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'approved'
                                ? 'bg-blue-600 text-white'
                                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700'
                                }`}
                        >
                            Disetujui
                        </button>
                        <button
                            onClick={() => setFilter('rejected')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'rejected'
                                ? 'bg-blue-600 text-white'
                                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700'
                                }`}
                        >
                            Ditolak
                        </button>
                    </div>

                    <Link
                        href="/submit-case?from=dashboard"
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition-colors text-center"
                    >
                        + Kirim Kasus Baru
                    </Link>
                </div>

                {/* Content */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800">
                    {loading ? (
                        <div className="p-12 text-center text-slate-500">
                            <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                            Loading...
                        </div>
                    ) : submissions.length === 0 ? (
                        <div className="p-12 text-center">
                            <p className="text-slate-500 dark:text-slate-400 mb-4">
                                Belum ada pengajuan.
                            </p>
                            <Link
                                href="/submit-case?from=dashboard"
                                className="inline-flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                            >
                                Kirim Kasus Pertama Anda
                                <ChevronRight className="w-4 h-4" />
                            </Link>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-200 dark:divide-slate-800">
                            {submissions.map((submission) => (
                                <div key={submission.id} className="p-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-3">
                                        <div className="flex-1">
                                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                                                {submission.title}
                                            </h3>
                                            <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-2">
                                                {submission.description}
                                            </p>
                                            <div className="flex flex-wrap gap-2 text-xs text-slate-500">
                                                {submission.attack_type && (
                                                    <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded">
                                                        {submission.attack_type}
                                                    </span>
                                                )}
                                                {submission.impact_level && (
                                                    <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded">
                                                        {submission.impact_level} Impact
                                                    </span>
                                                )}
                                                <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded">
                                                    {new Date(submission.submitted_at).toLocaleDateString('id-ID')}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex-shrink-0">
                                            {getStatusBadge(submission.status)}
                                        </div>
                                    </div>

                                    {/* Admin Feedback */}
                                    {submission.admin_feedback && (
                                        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                                            <p className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-1">
                                                💬 Feedback Admin:
                                            </p>
                                            <p className="text-sm text-blue-800 dark:text-blue-200">
                                                {submission.admin_feedback}
                                            </p>
                                        </div>
                                    )}

                                    {/* View Link if Approved */}
                                    {submission.status === 'approved' && (
                                        <div className="mt-4">
                                            <Link
                                                href="/cases"
                                                className="text-sm text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
                                            >
                                                Lihat di halaman publik
                                                <ChevronRight className="w-3 h-3" />
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
