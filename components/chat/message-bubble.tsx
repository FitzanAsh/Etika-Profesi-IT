'use client';

import { ChatMessage } from '@/types/chat';
import { SourceCitation } from './source-citation';

interface MessageBubbleProps {
    message: ChatMessage;
}

export function MessageBubble({ message }: MessageBubbleProps) {
    const isUser = message.role === 'user';

    return (
        <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] ${isUser ? 'order-2' : 'order-1'}`}>
                <div
                    className={`rounded-2xl px-4 py-2.5 ${isUser
                            ? 'bg-blue-600 text-white rounded-br-sm'
                            : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-bl-sm'
                        }`}
                >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                </div>

                {/* Show sources if available (assistant messages only) */}
                {!isUser && message.sources && message.sources.length > 0 && (
                    <div className="mt-2">
                        <SourceCitation sources={message.sources} />
                    </div>
                )}

                {/* Timestamp */}
                <p className={`text-xs text-slate-400 mt-1 ${isUser ? 'text-right' : 'text-left'}`}>
                    {new Date(message.timestamp).toLocaleTimeString('id-ID', {
                        hour: '2-digit',
                        minute: '2-digit',
                    })}
                </p>
            </div>
        </div>
    );
}
