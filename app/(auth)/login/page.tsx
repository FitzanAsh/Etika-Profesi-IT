'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabaseBrowser } from '@/lib/supabase-client';
import { Eye, EyeOff } from 'lucide-react'; // Import Icons

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // Toggle State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error } = await supabaseBrowser.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    router.refresh();
    router.push('/admin');
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-900">

      <form
        onSubmit={onSubmit}
        className="w-full max-w-md bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg space-y-6 border border-slate-100 dark:border-slate-700"
      >
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Admin Login</h1>
          <p className="text-sm text-slate-500 mt-2">Masukkan kredensial untuk akses dashboard</p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded flex items-center gap-2">
            <span>⚠️</span> {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
          <input
            required
            type="email"
            placeholder="admin@example.com"
            className="w-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition dark:text-white"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Password</label>
          <div className="relative">
            <input
              required
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              className="w-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition dark:text-white pr-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        <div className="space-y-4 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white font-bold rounded-lg py-3 hover:bg-blue-700 transition disabled:opacity-50 shadow-md shadow-blue-500/20"
          >
            {loading ? 'Memproses...' : 'Login ke Dashboard'}
          </button>

          {/* Back to Home Link */}
          <div className="text-center">
            <Link
              href="/"
              className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
            >
              Kembali ke Beranda
            </Link>
          </div>
        </div>

      </form>
    </div>
  );
}
