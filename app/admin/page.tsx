'use client';
import { useEffect, useState } from 'react';
import { supabaseBrowser } from '@/lib/supabase-client';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ chapters: 0, cases: 0, team: 0 });

  useEffect(() => {
    async function fetchStats() {
      const { count: chapters } = await supabaseBrowser.from('contents').select('*', { count: 'exact', head: true });
      const { count: cases } = await supabaseBrowser.from('cases').select('*', { count: 'exact', head: true });
      const { count: team } = await supabaseBrowser.from('team').select('*', { count: 'exact', head: true });
      setStats({ chapters: chapters || 0, cases: cases || 0, team: team || 0 });
    }
    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Dashboard Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1 */}
        <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow border border-slate-100 dark:border-slate-700">
          <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Chapters</h3>
          <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">{stats.chapters}</p>
        </div>
        {/* Card 2 */}
        <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow border border-slate-100 dark:border-slate-700">
          <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Case Studies</h3>
          <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">{stats.cases}</p>
        </div>
        {/* Card 3 */}
        <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow border border-slate-100 dark:border-slate-700">
          <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Team Members</h3>
          <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">{stats.team}</p>
        </div>
      </div>

      <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
        <h3 className="font-semibold text-blue-800 dark:text-blue-300">Quick Action</h3>
        <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
          You are logged in as Admin. Use the sidebar to manage content.
        </p>
      </div>
    </div>
  );
}
