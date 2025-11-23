'use client';
import { useState } from 'react';
import { CheckCircle, X } from 'lucide-react';

interface ToastProps {
    message: string;
    type: 'success' | 'error';
    onClose: () => void;
}

function Toast({ message, type, onClose }: ToastProps) {
    return (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-5 fade-in duration-300">
            <div className={`flex items-start gap-3 px-6 py-4 rounded-xl shadow-2xl border-2 min-w-[320px] ${type === 'success'
                ? 'bg-white dark:bg-slate-900 border-green-500'
                : 'bg-white dark:bg-slate-900 border-red-500'
                }`}>
                {type === 'success' ? (
                    <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                ) : (
                    <div className="w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                        !
                    </div>
                )}
                <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                        {message}
                    </p>
                </div>
                <button
                    onClick={onClose}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}

interface CaseSubmissionFormProps {
    initialData?: Partial<CaseSubmission>;
    onSuccess?: (submissionId: string) => void;
}

interface CaseSubmission {
    title: string;
    description: string;
    attack_type: string;
    impact_level: string;
    date: string;
    source_url: string;
    mitigation: string;
    submitter_email: string;
}

export default function CaseSubmissionForm({ initialData, onSuccess }: CaseSubmissionFormProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    const [formData, setFormData] = useState<Partial<CaseSubmission>>({
        title: initialData?.title || '',
        description: initialData?.description || '',
        attack_type: initialData?.attack_type || '',
        impact_level: initialData?.impact_level || '',
        date: initialData?.date || '',
        source_url: initialData?.source_url || '',
        mitigation: initialData?.mitigation || '',
        submitter_email: initialData?.submitter_email || '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Validation
            if (!formData.title || !formData.description) {
                throw new Error('Title and description are required');
            }

            if (formData.title.length > 255) {
                throw new Error('Title must be 255 characters or less');
            }

            const response = await fetch('/api/submissions/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to submit');
            }

            // Success - Show toast
            setToast({
                message: 'Terima kasih! Pengajuan Anda berhasil dikirim.',
                type: 'success'
            });

            // Reset form after 2 seconds
            setTimeout(() => {
                if (onSuccess) {
                    onSuccess(data.submission_id);
                } else {
                    setFormData({
                        title: '',
                        description: '',
                        attack_type: '',
                        impact_level: '',
                        date: '',
                        source_url: '',
                        mitigation: '',
                        submitter_email: '',
                    });
                    window.location.href = '/cases';
                }
            }, 2000);

        } catch (err: any) {
            setError(err.message);
            setToast({
                message: err.message,
                type: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}

            <form onSubmit={handleSubmit} className="space-y-6">

                {error && (
                    <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400">
                        {error}
                    </div>
                )}

                {/* Title */}
                <div className="grid md:grid-cols-2 gap-8">
                    {/* Left Column: Case Details */}
                    <div className="space-y-6">
                        {/* Title */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Judul Studi Kasus *
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                                placeholder="e.g., Serangan Phishing Massal E-Commerce"
                                maxLength={255}
                            />
                            <p className="text-xs text-slate-500 mt-1">{formData.title?.length || 0}/255 karakter</p>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Deskripsi Lengkap *
                            </label>
                            <textarea
                                required
                                rows={12}
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                                placeholder="Jelaskan kronologi insiden, dampak yang ditimbulkan, dan detail teknis lainnya..."
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {/* Attack Type */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Tipe Serangan
                                </label>
                                <select
                                    value={formData.attack_type}
                                    onChange={(e) => setFormData({ ...formData, attack_type: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">-- Pilih Tipe --</option>
                                    <option value="Phishing">Phishing</option>
                                    <option value="Ransomware">Ransomware</option>
                                    <option value="DDoS">DDoS</option>
                                    <option value="Malware">Malware</option>
                                    <option value="Data Breach">Data Breach</option>
                                    <option value="Social Engineering">Social Engineering</option>
                                    <option value="Other">Lainnya</option>
                                </select>
                            </div>

                            {/* Impact Level */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Tingkat Dampak
                                </label>
                                <select
                                    value={formData.impact_level}
                                    onChange={(e) => setFormData({ ...formData, impact_level: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">-- Pilih Tingkat --</option>
                                    <option value="Low">Low</option>
                                    <option value="Medium">Medium</option>
                                    <option value="High">High</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Metadata & Mitigation */}
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            {/* Date */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Tanggal Insiden
                                </label>
                                <input
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Email (Notifikasi)
                                </label>
                                <input
                                    type="email"
                                    value={formData.submitter_email}
                                    onChange={(e) => setFormData({ ...formData, submitter_email: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                                    placeholder="email@example.com"
                                />
                            </div>
                        </div>

                        {/* Source URL */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Link Sumber / Berita (opsional)
                            </label>
                            <input
                                type="url"
                                value={formData.source_url}
                                onChange={(e) => setFormData({ ...formData, source_url: e.target.value })}
                                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                                placeholder="https://example.com/news/..."
                            />
                        </div>

                        {/* Mitigation */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Strategi Mitigasi (opsional)
                            </label>
                            <textarea
                                rows={8}
                                value={formData.mitigation}
                                onChange={(e) => setFormData({ ...formData, mitigation: e.target.value })}
                                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                                placeholder="Jelaskan langkah-langkah yang dapat dilakukan untuk mencegah atau menangani serangan serupa..."
                            />
                        </div>
                    </div>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {loading ? 'Mengirim...' : 'Kirim Studi Kasus'}
                </button>

            </form>
        </>
    );
}
