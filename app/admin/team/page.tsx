'use client';

import { Users, User } from 'lucide-react';

export default function AdminTeamPage() {
  const teamMembers = [
    { name: 'ATHA RIZKY PUTRA SINURAYA', nim: '2205181064' },
    { name: 'FITZAN ASHARI', nim: '2205181004' },
    { name: 'MUHAMMAD YUSUF AULIA', nim: '2205181006' },
    { name: 'RANGGA NUGRAHA', nim: '2205181046' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
          <Users className="w-8 h-8 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Team & Identity</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Informasi anggota kelompok pengembang
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            KELOMPOK ANONYM
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Etika Profesi - Semester 7
          </p>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-700">
          {teamMembers.map((member, index) => (
            <div key={index} className="p-4 flex items-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition">
              <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">
                  {member.name}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-mono">
                  NIM: {member.nim}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
