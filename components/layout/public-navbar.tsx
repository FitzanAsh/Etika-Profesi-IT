'use client';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { Moon, Sun, Search, Lock } from 'lucide-react';

export function PublicNavbar() {
    const { setTheme, theme } = useTheme();

    return (
        <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
            <div className="container flex h-14 items-center justify-between px-4 md:px-6">
                {/* LOGO SECTION */}
                <Link href="/" className="flex items-center gap-2 group select-none">
                    {/* Decorative element */}
                    <div className="h-8 w-1 bg-blue-600 rounded-full rotate-12 group-hover:rotate-0 transition-transform duration-300" />

                    <div className="flex flex-col justify-center leading-none">
                        <span className="font-extrabold text-lg tracking-tighter text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                            ANONYM
                        </span>
                        <span className="text-[0.6rem] font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 group-hover:text-blue-500 transition-colors">
                            ETIKA IT
                        </span>
                    </div>
                </Link>
                <div className="flex items-center gap-4">
                    <Link href="/search" className="text-sm font-medium text-slate-500 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-50 flex items-center gap-2">
                        <Search className="h-4 w-4" />
                        <span className="hidden sm:inline">Search</span>
                    </Link>
                    <Link href="/cases" className="text-sm font-medium text-slate-500 transition-colors hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400">
                        Studi Kasus
                    </Link>
                    <button
                        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                        className="h-9 w-9 flex items-center justify-center rounded-md border border-slate-200 bg-transparent hover:bg-slate-100 dark:border-slate-800 dark:hover:bg-slate-800"
                    >
                        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                        <span className="sr-only">Toggle theme</span>
                    </button>
                    <Link
                        href="/login"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 hover:bg-blue-50 text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-800/80 dark:hover:text-blue-400"
                    >
                        <Lock className="h-4 w-4" />
                        <span>Admin</span>
                    </Link>
                </div>
            </div>
        </header>
    );
}
