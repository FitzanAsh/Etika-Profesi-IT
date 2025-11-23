'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabaseBrowser } from '@/lib/supabase-client';
import { ChevronLeft, Save } from 'lucide-react';

export default function CaseEditorPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const isNew = params.id === 'new';
    const [loading, setLoading] = useState(!isNew);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        date: new Date().toISOString().split('T')[0],
        description: '',
        impact_level: 'High',
        mitigation: '',
        image_url: ''
    });

    useEffect(() => {
        if (!isNew) {
            // Load existing data
            supabaseBrowser.from('cases').select('*').eq('id', params.id).single()
                .then(({ data, error }) => {
                    if (data) setFormData(data);
                    setLoading(false);
                });
        }
    }, [params.id, isNew]);

    async function handleSave(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);

        const payload = { ...formData };
        let error;

        if (isNew) {
            const res = await supabaseBrowser.from('cases').insert(payload);
            error = res.error;
        } else {
            const res = await supabaseBrowser.from('cases').update(payload).eq('id', params.id);
            error = res.error;
        }

        setSaving(false);
        if (error) {
            alert('Gagal menyimpan: ' + error.message);
        } else {
            router.push('/admin/cases');
            router.refresh();
        }
    }

    if (loading) return <div className="p-10 text-center">Loading...</div>;

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.back()} className="p-2 hover:bg-slate-100 rounded-full transition">
                        <ChevronLeft className="h-5 w-5 text-slate-600" />
                    </button>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                        {isNew ? 'Tambah Kasus Baru' : 'Edit Kasus'}
                    </h1>
                </div>
            </div>

            <form onSubmit={handleSave} className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow space-y-6 border border-slate-200 dark:border-slate-700">

                {/* Title & Date */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Judul Kasus</label>
                        <input
                            type="text"
                            required
                            className="w-full border p-2 rounded bg-transparent"
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Tanggal Kejadian</label>
                        <input
                            type="date"
                            required
                            className="w-full border p-2 rounded bg-transparent"
                            value={formData.date}
                            onChange={e => setFormData({ ...formData, date: e.target.value })}
                        />
                    </div>
                </div>

                {/* Impact & Image */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Tingkat Dampak</label>
                        <select
                            className="w-full border p-2 rounded bg-transparent"
                            value={formData.impact_level}
                            onChange={e => setFormData({ ...formData, impact_level: e.target.value })}
                        >
                            <option value="High">High (Parah)</option>
                            <option value="Medium">Medium (Sedang)</option>
                            <option value="Low">Low (Rendah)</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">URL Gambar (Opsional)</label>
                        <input
                            type="url"
                            placeholder="https://..."
                            className="w-full border p-2 rounded bg-transparent"
                            value={formData.image_url || ''}
                            onChange={e => setFormData({ ...formData, image_url: e.target.value })}
                        />
                    </div>
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Kronologi / Deskripsi</label>
                    <textarea
                        rows={5}
                        required
                        className="w-full border p-2 rounded bg-transparent"
                        value={formData.description || ''}
                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                    />
                </div>

                {/* Mitigation */}
                <div>
                    <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Mitigasi / Solusi</label>
                    <textarea
                        rows={3}
                        className="w-full border p-2 rounded bg-transparent"
                        value={formData.mitigation || ''}
                        onChange={e => setFormData({ ...formData, mitigation: e.target.value })}
                    />
                </div>

                <div className="pt-4 flex justify-end">
                    <button
                        type="submit"
                        disabled={saving}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 font-medium disabled:opacity-50"
                    >
                        <Save className="h-4 w-4" />
                        {saving ? 'Menyimpan...' : 'Simpan Data'}
                    </button>
                </div>

            </form>
        </div>
    );
}
