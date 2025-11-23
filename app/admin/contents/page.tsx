'use client';
import { useEffect, useState } from 'react';
import { supabaseBrowser } from '@/lib/supabase-client';
import Link from 'next/link';

interface Content {
  id: number;
  title: string;
  slug: string;
  section: string;
  updated_at: string;
}

export default function AdminContentsPage() {
  const [contents, setContents] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContents();
  }, []);

  async function fetchContents() {
    setLoading(true);
    const { data } = await supabaseBrowser
      .from('contents')
      .select('*')
      .order('id', { ascending: true }); // Assuming ID order or add a generic 'order' column later
    if (data) setContents(data);
    setLoading(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Manage Content</h1>
        <div className="flex gap-3">
          <Link
            href="/admin/contents/create"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition-colors"
          >
            + Add New
          </Link>
          <button
            onClick={fetchContents}
            className="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-sm"
          >
            Refresh
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow overflow-hidden border border-slate-200 dark:border-slate-700">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
            <tr>
              <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300">Title</th>
              <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300">Section Slug</th>
              <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300">Last Updated</th>
              <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
            {loading ? (
              <tr><td colSpan={4} className="px-6 py-8 text-center text-slate-500">Loading data...</td></tr>
            ) : contents.length === 0 ? (
              <tr><td colSpan={4} className="px-6 py-8 text-center text-slate-500">No content found in database. Did you run migration?</td></tr>
            ) : (
              contents.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition">
                  <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{item.title || 'Untitled'}</td>
                  <td className="px-6 py-4 text-slate-500">{item.slug || item.section}</td>
                  <td className="px-6 py-4 text-slate-500">
                    {item.updated_at ? new Date(item.updated_at).toLocaleDateString() : '-'}
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      href={`/admin/contents/${item.id}`}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Edit
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
