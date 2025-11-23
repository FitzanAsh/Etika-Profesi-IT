'use client';

import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const chapters = [
    { slug: 'pendahuluan', title: 'Pendahuluan' },
    { slug: 'landasan-teori', title: 'Landasan Teori' },
    { slug: 'pembahasan', title: 'Pembahasan' },
    { slug: 'penutup', title: 'Penutup' },
    { slug: 'daftar-pustaka', title: 'Daftar Pustaka' },
    { slug: 'tim', title: 'Identitas Tim' }
];

export function ChapterPagination({ currentSlug }: { currentSlug: string }) {
    const currentIndex = chapters.findIndex((c) => c.slug === currentSlug);

    const prevChapter = currentIndex > 0 ? chapters[currentIndex - 1] : null;
    const nextChapter = currentIndex < chapters.length - 1 ? chapters[currentIndex + 1] : null;

    return (
        <div className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row justify-between gap-4">

            {/* PREV BUTTON */}
            {prevChapter ? (
                <Link
                    href={`/${prevChapter.slug}`}
                    className="group flex flex-col items-start p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 transition-all w-full sm:w-1/2"
                >
                    <span className="flex items-center text-xs font-medium text-slate-500 mb-1 group-hover:text-blue-600 transition-colors">
                        <ArrowLeft className="w-3 h-3 mr-1" /> Sebelumnya
                    </span>
                    <span className="font-bold text-slate-900 dark:text-white text-lg group-hover:text-blue-600 transition-colors">
                        {prevChapter.title}
                    </span>
                </Link>
            ) : <div className="hidden sm:block w-1/2" />}

            {/* NEXT BUTTON */}
            {nextChapter ? (
                <Link
                    href={`/${nextChapter.slug}`}
                    className="group flex flex-col items-end p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 transition-all w-full sm:w-1/2 text-right"
                >
                    <span className="flex items-center justify-end text-xs font-medium text-slate-500 mb-1 group-hover:text-blue-600 transition-colors">
                        Selanjutnya <ArrowRight className="w-3 h-3 ml-1" />
                    </span>
                    <span className="font-bold text-slate-900 dark:text-white text-lg group-hover:text-blue-600 transition-colors">
                        {nextChapter.title}
                    </span>
                </Link>
            ) : <div className="hidden sm:block w-1/2" />}

        </div>
    );
}
