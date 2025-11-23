'use client';
import CaseSubmissionForm from '@/components/forms/case-submission-form';
import Link from 'next/link';
import { Info, ChevronLeft } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

export default function SubmitCasePage() {
    const searchParams = useSearchParams();
    const from = searchParams.get('from');

    const backLink = from === 'home' ? '/' : from === 'dashboard' ? '/my-submissions' : '/cases';
    const backText = from === 'home' ? 'Kembali ke Beranda' : from === 'dashboard' ? 'Kembali ke Dashboard' : 'Kembali ke Studi Kasus';

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8 px-4 md:px-6">
            <div className="container max-w-6xl mx-auto">

                {/* Header */}
                <div className="mb-8">
                    <Link
                        href={backLink}
                        className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline text-sm mb-4"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        {backText}
                    </Link>

                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-3">
                        Kirim Studi Kasus Anda
                    </h1>
                    <p className="text-lg text-slate-600 dark:text-slate-400">
                        Berbagi pengalaman atau pengetahuan Anda tentang insiden keamanan siber untuk membantu komunitas belajar.
                    </p>
                </div>

                {/* Info Notice */}
                <div className="mb-8 p-5 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
                    <div className="flex items-start gap-3">
                        <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-blue-900 dark:text-blue-200">
                            <p className="font-medium mb-1">ℹ️ Catatan Penting:</p>
                            <ul className="list-disc list-inside space-y-1 text-blue-800 dark:text-blue-300">
                                <li>Semua pengajuan akan direview oleh admin sebelum dipublikasikan</li>
                                <li>Anda akan menerima notifikasi email saat status berubah</li>
                                <li>Pastikan informasi yang diberikan akurat dan tidak melanggar privasi</li>
                                <li>Field dengan tanda (*) wajib diisi</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg p-8 border border-slate-200 dark:border-slate-800">
                    <CaseSubmissionForm
                        onSuccess={(id) => {
                            alert('✅ Terima kasih! Pengajuan Anda berhasil dikirim. Kami akan mengirimkan email notifikasi setelah direview.');
                            window.location.href = '/cases';
                        }}
                    />
                </div>

                {/* Footer Help */}
                <div className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
                    <p>
                        Butuh bantuan? Hubungi tim kami di{' '}
                        <a href="mailto:anonym@gmail.com" className="text-blue-600 dark:text-blue-400 hover:underline">
                            anonym@gmail.com
                        </a>
                    </p>
                </div>

            </div>
        </div>
    );
}
