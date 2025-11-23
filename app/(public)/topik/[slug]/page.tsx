import { getPublicContent } from '@/lib/get-content';
import { MarkdownViewer } from '@/components/ui/markdown-viewer';
import Link from 'next/link';
import { ChevronLeft, Circle } from 'lucide-react';

export default async function TopicPage({ params }: { params: { slug: string } }) {
    // Fetch data matching the slug from URL
    const data = await getPublicContent(params.slug);

    if (!data) {
        return (
            <div className="container py-20 text-center">
                <h1 className="text-2xl font-bold">Topik tidak ditemukan</h1>
                <Link href="/" className="text-blue-600 mt-4 inline-block">Kembali ke Home</Link>
            </div>
        );
    }

    // Map topic slugs to hero images
    const heroImages: { [key: string]: string } = {
        'topik-cybercrime': 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1920&q=80',
        'topik-klasifikasi': 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1920&q=80',
        'topik-kriminologi': 'https://images.unsplash.com/photo-1589578527966-fdac0f44566c?auto=format&fit=crop&w=1920&q=80',
        'topik-cyberlaw': 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=1920&q=80',
        'topik-trifaktor': 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1920&q=80',
        'topik-zerotrust': 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=1920&q=80',
    };

    const heroImage = heroImages[params.slug] || 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1920&q=80';

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950">

            {/* HERO IMAGE SECTION */}
            <div className="relative h-[400px] w-full overflow-hidden">
                {/* Background Image with Overlay */}
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${heroImage})` }}
                >
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/60 to-slate-950" />
                </div>

                {/* Hero Content */}
                <div className="relative h-full container max-w-7xl mx-auto px-6 flex flex-col justify-end pb-16">
                    <Link
                        href="/"
                        className="inline-flex items-center text-sm text-white/80 hover:text-white mb-6 transition-colors group w-fit"
                    >
                        <ChevronLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                        Kembali ke Beranda
                    </Link>

                    <div className="inline-block px-3 py-1 mb-4 text-xs font-bold tracking-wider text-blue-400 uppercase bg-blue-900/40 backdrop-blur-sm rounded-full w-fit border border-blue-400/30">
                        Materi Pembelajaran
                    </div>

                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight max-w-4xl drop-shadow-2xl">
                        {data.title}
                    </h1>
                </div>
            </div>

            {/* CONTENT SECTION */}
            <div className="container max-w-7xl mx-auto px-6 py-16">

                {/* Main Grid Layout: Sidebar + Content */}
                <div className="grid lg:grid-cols-[1fr_300px] gap-12">

                    {/* Main Content */}
                    <div className="bg-white dark:bg-slate-900/50 p-8 lg:p-12 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg">
                        <MarkdownViewer content={data.body || ''} />
                    </div>

                    {/* Sidebar */}
                    <aside className="space-y-6">

                        {/* Quick Info Card */}
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 rounded-xl border border-blue-100 dark:border-blue-800">
                            <h3 className="text-sm font-bold text-blue-900 dark:text-blue-300 uppercase tracking-wider mb-4">
                                Info Materi
                            </h3>
                            <div className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
                                <div className="flex items-start gap-2">
                                    <span className="text-blue-600 dark:text-blue-400">📚</span>
                                    <span>Kategori: Keamanan Siber</span>
                                </div>
                                <div className="flex items-start gap-2">
                                    <span className="text-blue-600 dark:text-blue-400">⏱️</span>
                                    <span>Estimasi Baca: 5-10 menit</span>
                                </div>
                                <div className="flex items-start gap-2">
                                    <span className="text-blue-600 dark:text-blue-400">🎯</span>
                                    <span>Level: Intermediate</span>
                                </div>
                            </div>
                        </div>

                        {/* Related Topics */}
                        <div className="bg-slate-50 dark:bg-slate-900/30 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">
                                Materi Terkait
                            </h3>
                            <div className="space-y-3">
                                <Link href="/" className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:underline group">
                                    <Circle className="w-2 h-2 fill-current opacity-60 group-hover:opacity-100 transition-opacity" />
                                    Lihat Semua Topik
                                </Link>
                                <Link href="/landasan-teori" className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:underline group">
                                    <Circle className="w-2 h-2 fill-current opacity-60 group-hover:opacity-100 transition-opacity" />
                                    Landasan Teori
                                </Link>
                                <Link href="/pembahasan" className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:underline group">
                                    <Circle className="w-2 h-2 fill-current opacity-60 group-hover:opacity-100 transition-opacity" />
                                    Pembahasan Lengkap
                                </Link>
                            </div>
                        </div>

                    </aside>

                </div>

            </div>

        </div>
    );
}
