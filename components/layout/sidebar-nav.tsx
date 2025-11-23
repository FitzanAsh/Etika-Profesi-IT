'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const items = [
    { title: "Overview", href: "/" },
    { title: "Abstrak", href: "/abstrak" },
    { title: "BAB I - Pendahuluan", href: "/pendahuluan" },
    { title: "BAB II - Landasan Teori", href: "/landasan-teori" },
    { title: "BAB III - Pembahasan", href: "/pembahasan" },
    { title: "BAB IV - Penutup", href: "/penutup" },
    { title: "Daftar Pustaka", href: "/daftar-pustaka" },
    { title: "Identitas Tim", href: "/tim" },
];

export function SidebarNav() {
    const pathname = usePathname();

    return (
        <nav className="w-64 hidden md:block sticky top-20 h-[calc(100vh-5rem)] overflow-y-auto py-6 pr-4 border-r border-slate-200 dark:border-slate-800">
            <h4 className="mb-4 px-2 text-sm font-semibold tracking-tight text-slate-900 dark:text-white">
                Table of Contents
            </h4>
            <div className="space-y-1">
                {items.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            "block rounded-md px-3 py-2 text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors",
                            pathname === item.href
                                ? "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white"
                                : "text-slate-500 dark:text-slate-400"
                        )}
                    >
                        {item.title}
                    </Link>
                ))}
            </div>
        </nav>
    );
}
