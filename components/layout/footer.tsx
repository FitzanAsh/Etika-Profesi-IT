import Link from 'next/link';

export function Footer() {
    return (
        <footer className="border-t border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950">
            <div className="container px-4 py-12 md:px-6">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-3">

                    {/* Col 1: Brand & Info */}
                    <div className="space-y-4">
                        <div className="flex flex-col leading-none">
                            <span className="font-extrabold text-lg tracking-tighter text-slate-900 dark:text-white">
                                ANONYM
                            </span>
                            <span className="text-[0.6rem] font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                                ETIKA IT
                            </span>
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs leading-relaxed">
                            Platform edukasi digital untuk menganalisis korelasi phishing terhadap keamanan sistem komputer.
                            <br />
                            Politeknik Negeri Medan — 2025.
                        </p>
                    </div>

                    {/* Col 2: Quick Links */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                            Navigasi
                        </h3>
                        <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                            <li><Link href="/" className="hover:text-blue-600">Home</Link></li>
                            <li><Link href="/abstrak" className="hover:text-blue-600">Abstrak</Link></li>
                            <li><Link href="/cases" className="hover:text-blue-600">Studi Kasus</Link></li>
                            <li><Link href="/login" className="hover:text-blue-600">Login Admin</Link></li>
                        </ul>
                    </div>

                    {/* Col 3: Team Members (Based on Document) */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                            Tim Pengembang
                        </h3>
                        <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                            <li className="flex items-center gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
                                Atha Rizky Putra Sinuraya
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
                                Fitzan Ashari
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
                                Muhammad Yusuf Aulia
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
                                Rangga Nugraha
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-12 border-t border-slate-200 pt-8 dark:border-slate-800 text-center">
                    <p className="text-xs text-slate-400">
                        © 2025 Kelompok ANONYM • Teknologi Rekayasa Perangkat Lunak • Polmed.
                    </p>
                </div>
            </div>
        </footer>
    );
}
