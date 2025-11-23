'use client';
import { useEffect, useState } from 'react';
import { supabaseBrowser } from '@/lib/supabase-client';
import Link from 'next/link';
import { Plus, Trash2, Edit, AlertCircle } from 'lucide-react';

export default function AdminCasesPage() {
  const [cases, setCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCases();
  }, []);

  async function fetchCases() {
    setLoading(true);
    const { data } = await supabaseBrowser
      .from('cases')
      .select('*')
      .order('date', { ascending: false });
    if (data) setCases(data);
    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this case?')) return;

    const { error } = await supabaseBrowser.from('cases').delete().eq('id', id);
    if (error) alert('Error deleting: ' + error.message);
    else fetchCases();
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Studi Kasus</h1>
        <Link
          href="/admin/cases/new"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <Plus className="h-4 w-4" /> Tambah Kasus
        </Link>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow border border-slate-200 dark:border-slate-700 overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400">
            <tr>
              <th className="px-6 py-4">Judul Kasus</th>
              <th className="px-6 py-4">Tanggal</th>
              <th className="px-6 py-4">Impact Level</th>
              <th className="px-6 py-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
            {loading ? (
              <tr><td colSpan={4} className="px-6 py-8 text-center text-slate-500">Memuat data...</td></tr>
            ) : cases.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-slate-500 flex flex-col items-center justify-center">
                  <AlertCircle className="h-10 w-10 mb-2 opacity-20" />
                  Belum ada studi kasus. Silakan tambah baru.
                </td>
              </tr>
            ) : (
              cases.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition">
                  <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{item.title}</td>
                  <td className="px-6 py-4 text-slate-500">{item.date}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${item.impact_level === 'High' ? 'bg-red-100 text-red-600' :
                        item.impact_level === 'Medium' ? 'bg-yellow-100 text-yellow-600' :
                          'bg-blue-100 text-blue-600'
                      }`}>
                      {item.impact_level || 'N/A'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right flex justify-end gap-2">
                    <Link href={`/admin/cases/${item.id}`} className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                      <Edit className="h-4 w-4" />
                    </Link>
                    <button onClick={() => handleDelete(item.id)} className="p-2 text-red-600 hover:bg-red-50 rounded">
                      <Trash2 className="h-4 w-4" />
                    </button>
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
