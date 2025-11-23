'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Clock, CheckCircle, XCircle, Search } from 'lucide-react';
import { supabaseBrowser } from '../../../lib/supabase-client';

interface Submission {
    id: string;
    title: string;
    description: string;
    status: 'pending' | 'approved' | 'rejected';
    submitted_at: string;
    attack_type: string;
    impact_level: string;
    submitter_email: string | null;
}

export default function AdminSubmissionsPage() {
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchSubmissions();
    }, [filter]);

    async function fetchSubmissions() {
        setLoading(true);
        try {
            const { data: { user } } = await supabaseBrowser.auth.getUser();
            if (!user) {
                alert('Unauthorized');
                return;
            }

            // Check admin role
            console.log("DEBUG: Checking admin role for user:", user.id);
            const { data: userData, error: userError } = await supabaseBrowser
                .from('users')
                .select('role')
                .eq('auth_id', user.id) // FIX: Use auth_id (UUID) instead of id (BigInt)
                .single();

            if (userError) {
                console.error('Error fetching user role:', userError);
                alert(`Error checking permission: ${userError.message}`);
                return;
            }

            if (userData?.role !== 'admin') {
                alert(`Forbidden: Your role is '${userData?.role || 'null'}', but 'admin' is required.`);
                return;
            }

            let query = supabaseBrowser
                .from('case_submissions')
                .select('*')
                .order('created_at', { ascending: false });

            if (filter && ['pending', 'approved', 'rejected'].includes(filter)) {
                query = query.eq('status', filter);
            }

            const { data, error } = await query;

            if (error) {
                throw error;
            }

            setSubmissions(data || []);
        } catch (error: any) {
            console.error('Failed to fetch submissions:', error);
            alert('Error loading submissions: ' + error.message);
        } finally {
            setLoading(false);
        }
    }

    const filteredSubmissions = submissions.filter(sub =>
        sub.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusBadge = (status: string) => {
        const badges = {
            pending: {
                icon: <Clock className="w-4 h-4" />,
                className: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
                label: 'Pending'
            },
            approved: {
                icon: <CheckCircle className="w-4 h-4" />,
                className: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
                label: 'Approved'
            },
            rejected: {
                icon: <XCircle className="w-4 h-4" />,
                className: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
                label: 'Rejected'
            },
        };

        const badge = badges[status as keyof typeof badges];

        return (
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${badge.className}`}>
                {badge.icon}
                {badge.label}
            </span>
        );
    };

    return (
        <div className="space-y-6">

            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Review Submissions</h1>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                        Kelola dan review pengajuan studi kasus dari user
                    </p>
                </div>
                <button
                    onClick={fetchSubmissions}
                    className="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-sm"
                >
                    Refresh
                </button>
            </div>

            {/* Filters and Search */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex gap-2">
                    <button
                        onClick={() => setFilter('')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === ''
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                            }`}
                    >
                        All ({submissions.length})
                    </button>
                    <button
                        onClick={() => setFilter('pending')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'pending'
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                            }`}
                    >
                        Pending ({submissions.filter(s => s.status === 'pending').length})
                    </button>
                    <button
                        onClick={() => setFilter('approved')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'approved'
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                            }`}
                    >
                        Approved
                    </button>
                    <button
                        onClick={() => setFilter('rejected')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'rejected'
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                            }`}
                    >
                        Rejected
                    </button>
                </div>

                <div className="relative flex-1">
                    <Search className="absolute left-3 top-2.5 w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search submissions..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow border border-slate-200 dark:border-slate-700 overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
                        <tr>
                            <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300">Title</th>
                            <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300">Type</th>
                            <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300">Impact</th>
                            <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300">Status</th>
                            <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300">Submitted</th>
                            <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                        {loading ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                                    <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                                    Loading...
                                </td>
                            </tr>
                        ) : filteredSubmissions.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                                    No submissions found
                                </td>
                            </tr>
                        ) : (
                            filteredSubmissions.map((submission) => (
                                <tr key={submission.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-slate-900 dark:text-white max-w-xs truncate">
                                            {submission.title}
                                        </div>
                                        <div className="text-xs text-slate-500 truncate max-w-xs">
                                            {submission.description}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                                        {submission.attack_type || '-'}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${submission.impact_level === 'High' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                                            submission.impact_level === 'Medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                                                'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
                                            }`}>
                                            {submission.impact_level || '-'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {getStatusBadge(submission.status)}
                                    </td>
                                    <td className="px-6 py-4 text-slate-500 text-xs">
                                        {new Date(submission.submitted_at).toLocaleDateString('id-ID')}
                                    </td>
                                    <td className="px-6 py-4">
                                        <Link
                                            href={`/admin/submissions/${submission.id}`}
                                            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                                        >
                                            Review
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

        </div>
    );
}
