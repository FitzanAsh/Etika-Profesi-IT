import { getSupabaseServiceRoleClient } from '@/lib/supabase-client';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, ShieldAlert, ShieldCheck, AlertTriangle, Info, ChevronRight } from 'lucide-react';
import MeteorBackground from '@/components/ui/meteor-background';

export const revalidate = 0;

async function getCases() {
  const supabase = getSupabaseServiceRoleClient();
  const { data, error } = await supabase
    .from('cases')
    .select('*')
    .order('date', { ascending: false });

  if (error) console.error('Error fetching cases:', error);
  return data || [];
}

export default async function CasesPage() {
  const cases = await getCases();

  return (
    <div className="relative w-full overflow-hidden">

      {/* METEOR BACKGROUND LAYER - Only visible in Dark Mode */}
      <div className="fixed inset-0 z-0 pointer-events-none hidden dark:block">
        <MeteorBackground />
        {/* Gradient Overlay for better readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/50 to-slate-950/90 z-10" />
      </div>

      {/* CONTENT LAYER */}
      <div className="relative z-10 container py-10 max-w-6xl mx-auto">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl">
            Studi Kasus & Analisis
          </h1>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Kumpulan insiden nyata serangan siber, dianalisis mulai dari metode serangan, dampak, hingga strategi mitigasinya.
          </p>
        </div>

        {cases.length === 0 ? (
          <div className="text-center py-20 bg-slate-50 dark:bg-slate-900 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
            <p className="text-slate-500">Belum ada studi kasus yang dipublikasikan.</p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {cases.map((item) => (
              <article
                key={item.id}
                className="flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300"
              >
                {/* Image Header */}
                <div className="relative h-48 w-full bg-slate-100 dark:bg-slate-800">
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-slate-400">
                      <ShieldAlert className="h-12 w-12" />
                    </div>
                  )}

                  {/* Impact Badge */}
                  <div className="absolute top-4 right-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-sm ${item.impact_level === 'High' ? 'bg-red-100 text-red-700 border border-red-200' :
                      item.impact_level === 'Medium' ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                        'bg-blue-100 text-blue-700 border border-blue-200'
                      }`}>
                      {item.impact_level === 'High' && <AlertTriangle className="w-3 h-3 mr-1" />}
                      {item.impact_level} Impact
                    </span>
                  </div>
                </div>

                {/* Content Body */}
                <div className="flex-1 p-6 flex flex-col">
                  <div className="flex items-center text-xs text-slate-500 dark:text-slate-400 mb-3">
                    <Calendar className="w-3 h-3 mr-1" />
                    {new Date(item.date).toLocaleDateString('id-ID', { dateStyle: 'long' })}
                  </div>

                  <div className="flex items-center justify-between gap-2 mb-3">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-tight flex-1">
                      {item.title}
                    </h3>
                    {item.source === 'user-contribution' && (
                      <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 text-xs px-2 py-1 rounded-full font-medium border border-purple-200 dark:border-purple-800 flex-shrink-0">
                        ⭐ User Contribution
                      </span>
                    )}
                  </div>

                  <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-6 flex-1 line-clamp-3">
                    {item.description}
                  </p>

                  {/* Mitigation Box */}
                  <div className="mt-auto bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-900 rounded-lg p-4">
                    <h4 className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider mb-2 flex items-center">
                      <ShieldCheck className="w-3 h-3 mr-1" /> Strategi Mitigasi
                    </h4>
                    <p className="text-xs text-emerald-800 dark:text-emerald-300">
                      {item.mitigation}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* CTA SECTION - Submit Your Case */}
        <section className="relative mt-16 mb-6">
          <div className="border-2 border-slate-200 dark:border-slate-800 rounded-2xl p-10 bg-slate-50 dark:bg-slate-900/50">
            <div className="text-center max-w-2xl mx-auto">
              <div className="inline-block px-4 py-1.5 border border-slate-300 dark:border-slate-700 rounded-full text-slate-700 dark:text-slate-300 text-sm font-medium mb-4">
                Kontribusi Komunitas
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-3">
                Pernah Mengalami Insiden Keamanan Siber?
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                Bagikan pengalaman Anda. Setiap studi kasus yang disetujui akan membantu komunitas belajar dan meningkatkan awareness.
              </p>
              <Link
                href="/submit-case?from=cases"
                className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-white transition-all bg-blue-600 rounded-lg shadow-lg hover:bg-blue-700 hover:shadow-blue-500/30 hover:-translate-y-0.5"
              >
                + Kirim Studi Kasus
              </Link>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
