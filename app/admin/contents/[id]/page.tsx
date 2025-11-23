'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabaseBrowser } from '@/lib/supabase-client';

interface Content {
    id: number;
    title: string;
    slug: string;
    section: string;
    body: string;
    updated_at: string;
    source: string;
}

export default function EditContentPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const { id } = params;
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [data, setData] = useState<Content | null>(null);

    useEffect(() => {
        async function load() {
            const { data, error } = await supabaseBrowser
                .from('contents')
                .select('*')
                .eq('id', id)
                .single();

            if (error) {
                alert('Error loading content. Ensure you have seeded the database.');
                router.push('/admin/contents');
                return;
            }
            setData(data);
            setLoading(false);
        }
        load();
    }, [id, router]);

    async function handleSave(e: React.FormEvent) {
        e.preventDefault();
        if (!data) return;
        setSaving(true);

        const { error } = await supabaseBrowser
            .from('contents')
            .update({
                title: data.title,
                body: data.body,
                updated_at: new Date().toISOString(),
                source: 'database' // Mark as database source to override local files
            })
            .eq('id', id);

        setSaving(false);
        if (error) {
            alert('Failed to save: ' + error.message);
        } else {
            alert('Saved successfully!');
            router.refresh();
        }
    }

    if (loading) return <div className="p-10 text-center text-slate-500">Loading editor...</div>;
    if (!data) return <div className="p-10 text-center text-slate-500">Content not found.</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Edit Chapter</h1>
                <button
                    onClick={() => router.back()}
                    className="text-sm text-slate-500 hover:text-slate-800 dark:text-slate-400 transition"
                >
                    ← Back to List
                </button>
            </div>

            <form onSubmit={handleSave} className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow border border-slate-200 dark:border-slate-700 space-y-6">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Section Slug (ID)</label>
                        <input
                            type="text"
                            disabled
                            value={data.slug || data.section || ''}
                            className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded px-3 py-2 text-slate-500 cursor-not-allowed font-mono text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Last Updated</label>
                        <div className="text-sm py-2 text-slate-500 dark:text-slate-400">
                            {data.updated_at ? new Date(data.updated_at).toLocaleString() : 'Never'}
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Chapter Title</label>
                    <input
                        type="text"
                        required
                        value={data.title || ''}
                        onChange={(e) => setData({ ...data, title: e.target.value })}
                        className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-600 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none transition dark:text-white"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Content (Markdown)
                        <span className="text-xs font-normal text-slate-500 ml-2">Supports **bold**, - lists, # headings</span>
                    </label>
                    <textarea
                        required
                        rows={20}
                        value={data.body || ''}
                        onChange={(e) => setData({ ...data, body: e.target.value })}
                        className="w-full font-mono text-sm bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-600 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none transition dark:text-slate-200"
                    />
                </div>

                <div className="flex items-center justify-end pt-4 border-t border-slate-100 dark:border-slate-700">
                    <button
                        type="submit"
                        disabled={saving}
                        className="px-6 py-2 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 transition disabled:opacity-50 flex items-center gap-2"
                    >
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>

            </form>
        </div>
    );
}
