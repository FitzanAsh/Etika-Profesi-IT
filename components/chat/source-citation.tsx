'use client';

import { BookOpen } from 'lucide-react';
import { SourceReference } from '@/types/chat';

interface SourceCitationProps {
    sources: SourceReference[];
}

export function SourceCitation({ sources }: SourceCitationProps) {
    if (sources.length === 0) return null;

    return (
        <div className="space-y-1">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <BookOpen className="w-3 h-3" />
                Sumber:
            </p>
            {sources.map((source, index) => (
                <div
                    key={index}
                    className="text-xs bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900 rounded-lg px-2.5 py-1.5"
                >
                    <p className="font-medium text-blue-700 dark:text-blue-400">
                        {source.title}
                    </p>
                    <p className="text-blue-600 dark:text-blue-300 text-[10px]">
                        {source.chapter}
                    </p>
                </div>
            ))}
        </div>
    );
}
