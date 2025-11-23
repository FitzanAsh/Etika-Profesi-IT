'use client';

import { useEffect, useRef } from 'react';
import { X, BookOpen, GraduationCap } from 'lucide-react';
import { useChat } from '@/hooks/use-chat';
import { ChatInput } from './chat-input';
import { MessageBubble } from './message-bubble';
import { TypingIndicator } from './typing-indicator';

interface ChatWindowProps {
    onClose: () => void;
}

export function ChatWindow({ onClose }: ChatWindowProps) {
    const { messages, isLoading, mode, sendMessage, toggleMode } = useChat();
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom when new message arrives
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                <div>
                    <h3 className="font-bold text-lg">AI Assistant</h3>
                    <p className="text-xs text-blue-100">Tanya tentang makalah</p>
                </div>
                <button
                    onClick={onClose}
                    className="p-1 hover:bg-blue-700 rounded-lg transition-colors"
                    aria-label="Close chat"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Mode Toggle */}
            <div className="flex gap-2 p-3 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                <button
                    onClick={toggleMode}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${mode === 'normal'
                            ? 'bg-blue-600 text-white'
                            : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600'
                        }`}
                >
                    <BookOpen className="w-4 h-4" />
                    Normal
                </button>
                <button
                    onClick={toggleMode}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${mode === 'academic'
                            ? 'bg-blue-600 text-white'
                            : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600'
                        }`}
                >
                    <GraduationCap className="w-4 h-4" />
                    Academic
                </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-900">
                {messages.length === 0 && (
                    <div className="text-center text-slate-500 dark:text-slate-400 text-sm py-8">
                        <p className="font-medium mb-2">👋 Halo! Saya siap membantu.</p>
                        <p className="text-xs">Tanyakan apa saja tentang makalah phishing ini.</p>
                    </div>
                )}

                {messages.map((message) => (
                    <MessageBubble key={message.id} message={message} />
                ))}

                {isLoading && <TypingIndicator />}

                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-slate-200 dark:border-slate-800">
                <ChatInput onSend={sendMessage} disabled={isLoading} />
            </div>
        </div>
    );
}
