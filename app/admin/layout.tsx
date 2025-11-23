'use client';
import type { ReactNode } from 'react';
import { AdminGuard } from '@/components/auth/AdminGuard';
import { supabaseBrowser } from '@/lib/supabase-client';
import { useRouter } from 'next/navigation';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter();

  async function handleLogout() {
    await supabaseBrowser.auth.signOut();
    router.push('/login');
    router.refresh();
  }

  return (
    <AdminGuard>
      <div className="flex min-h-screen">
        <aside className="w-64 p-6 border-r bg-slate-50 dark:bg-slate-900 dark:border-slate-700 hidden md:block flex flex-col">
          <div className="font-bold text-xl mb-8 text-slate-800 dark:text-white">Admin Panel</div>
          <nav className="space-y-2 text-sm font-medium text-slate-600 dark:text-slate-400 flex-1">
            <a href="/admin" className="block px-3 py-2 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition">Dashboard</a>
            <a href="/admin/contents" className="block px-3 py-2 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition">Contents (Makalah)</a>
            <a href="/admin/cases" className="block px-3 py-2 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition">Case Studies</a>
            <a href="/admin/team" className="block px-3 py-2 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition">Team & Identity</a>
            <a href="/admin/submissions" className="block px-3 py-2 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition">
              <span className="flex items-center justify-between">
                Submissions
                <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 text-xs rounded-full font-bold">New</span>
              </span>
            </a>
            <div className="pt-4 pb-2 text-xs font-bold text-slate-400 uppercase tracking-wider">Settings</div>
            <a href="/admin/settings" className="block px-3 py-2 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition">General Config</a>
          </nav>

          <div className="pt-6 border-t border-slate-200 dark:border-slate-700">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition"
            >
              <span>Log Out</span>
            </button>
          </div>
        </aside>
        <main className="flex-1 p-6 bg-white dark:bg-slate-950">
          {children}
        </main>
      </div>
    </AdminGuard>
  );
}
