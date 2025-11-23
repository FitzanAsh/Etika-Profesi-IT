'use client';

import Link from 'next/link';
import { ChevronRight, ShieldAlert, TrendingUp, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';
import MeteorBackground from '@/components/ui/meteor-background';

// Animation Variants
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

const topics = [
  {
    title: "Teori Cybercrime",
    desc: "Karakteristik kejahatan siber: Borderless, Anonimitas, dan tantangan pembuktian digital.",
    href: "/topik/topik-cybercrime",
    img: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Klasifikasi Kejahatan",
    desc: "Analisis 'Computer as a Target' (Peretasan) vs 'Computer as a Tool' (Penipuan Online).",
    href: "/topik/topik-klasifikasi",
    img: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Teori Kriminologi",
    desc: "Mengapa orang meretas? Analisis Rational Choice Theory & Social Learning Theory.",
    href: "/topik/topik-kriminologi",
    img: "https://images.unsplash.com/photo-1589578527966-fdac0f44566c?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Cyberlaw Indonesia",
    desc: "Kerangka hukum UU ITE No. 19/2016 dan UU PDP No. 27/2022 tentang data pribadi.",
    href: "/topik/topik-cyberlaw",
    img: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Analisis Tri-Faktor",
    desc: "Koneksi antara kegagalan Teknis, Kelemahan Manusia, dan Kebijakan Organisasi.",
    href: "/topik/topik-trifaktor",
    img: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Mitigasi Zero Trust",
    desc: "Strategi pertahanan 'Never Trust, Always Verify' dan autentikasi FIDO2.",
    href: "/topik/topik-zerotrust",
    img: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=800&q=80"
  }
];

export default function PublicHomePage() {
  return (
    <div className="relative w-full overflow-hidden">

      {/* BACKGROUND LAYER: Only visible in Dark Mode */}
      <div className="fixed inset-0 z-0 pointer-events-none hidden dark:block">
        <MeteorBackground />
        {/* Gradient Overlay for better readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/50 to-slate-950/90 z-10" />
      </div>

      {/* CONTENT LAYER */}
      <div className="relative z-10 space-y-20 pb-20 pt-10">

        {/* HERO SECTION */}
        <section className="relative">
          <div className="grid gap-12 md:grid-cols-2 items-center">

            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              className="space-y-6"
            >
              <div className="inline-block rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                Etika Profesi IT • Politeknik Negeri Medan
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl md:text-6xl leading-tight">
                Analisis Korelasi{' '}
                <span className="animate-gradient-shift bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-400 bg-clip-text text-transparent">
                  Phishing
                </span>{' '}
                <br />
                terhadap Akses Ilegal
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed">
                Makalah ini menganalisis hubungan antara phishing dan unauthorized access, mengkaji aspek teknis, manusia, dan organisasi yang mempengaruhi kerentanan sistem.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Link
                  href="/abstrak"
                  className="inline-flex h-11 items-center justify-center rounded-full border border-slate-200 bg-white px-8 text-sm font-medium shadow-sm transition-colors hover:bg-slate-100 hover:text-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700"
                >
                  Baca Ringkasan
                </Link>
                <Link
                  href="/pendahuluan"
                  className="inline-flex h-11 items-center justify-center rounded-full bg-blue-600 px-8 text-sm font-medium text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-700 hover:scale-105"
                >
                  Mulai Membaca <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </div>

              <div className="text-sm font-medium text-slate-500 dark:text-slate-400 pt-4 border-t border-slate-200 dark:border-slate-800 w-fit">
                <span className="font-bold text-slate-900 dark:text-slate-200">Dosen Pembimbing:</span> Sri Novida Sari
              </div>
            </motion.div>

            {/* Hero Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              className="relative flex justify-center"
            >
              <div className="relative w-full max-w-md aspect-[4/3] rounded-2xl shadow-2xl overflow-hidden animate-float bg-slate-200 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <img
                  src="https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=1000"
                  alt="Cybersecurity Concept"
                  className="object-cover w-full h-full"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-transparent mix-blend-overlay" />
              </div>
            </motion.div>
          </div>
        </section>

        {/* STATISTICS SECTION */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid gap-6 md:grid-cols-3"
        >
          <motion.div variants={fadeInUp} className="p-6 rounded-xl bg-blue-600 text-white shadow-lg dark:bg-gradient-to-br dark:from-blue-900/50 dark:to-slate-900/50 dark:border dark:border-blue-800/30">
            <ShieldAlert className="h-8 w-8 mb-4 opacity-80 dark:text-blue-400" />
            <div className="text-4xl font-bold mb-1">90%</div>
            <div className="text-blue-100 dark:text-slate-300 font-medium text-sm">Serangan siber dimulai dengan phishing</div>
          </motion.div>
          <motion.div variants={fadeInUp} className="p-6 rounded-xl bg-blue-500 text-white shadow-lg dark:bg-gradient-to-br dark:from-blue-900/50 dark:to-slate-900/50 dark:border dark:border-blue-800/30">
            <TrendingUp className="h-8 w-8 mb-4 opacity-80 dark:text-blue-400" />
            <div className="text-4xl font-bold mb-1">36%</div>
            <div className="text-blue-100 dark:text-slate-300 font-medium text-sm">Kenaikan serangan phishing di 2023</div>
          </motion.div>
          <motion.div variants={fadeInUp} className="p-6 rounded-xl bg-sky-500 text-white shadow-lg dark:bg-gradient-to-br dark:from-cyan-900/50 dark:to-slate-900/50 dark:border dark:border-cyan-800/30">
            <DollarSign className="h-8 w-8 mb-4 opacity-80 dark:text-cyan-400" />
            <div className="text-4xl font-bold mb-1">$4.9M</div>
            <div className="text-blue-100 dark:text-slate-300 font-medium text-sm">Kerugian rata-rata per insiden BEC</div>
          </motion.div>
        </motion.section>

        {/* TOPIK UTAMA */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Landasan Teori & Analisis</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2">Poin-poin kunci yang dibahas.</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {topics.map((topic, index) => (
              <Link
                key={index}
                href={topic.href}
                className="group block bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1 dark:backdrop-blur-md"
              >
                <div className="relative h-48 w-full overflow-hidden">
                  <img
                    src={topic.img}
                    alt={topic.title}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 flex items-center justify-between">
                    {topic.title}
                    <ChevronRight className="h-5 w-5 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0" />
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                    {topic.desc}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </motion.section>

        {/* CTA SECTION - Submit Your Case */}
        <section className="relative mt-20 mb-10">
          <div className="border-2 border-slate-200 dark:border-slate-800 rounded-2xl p-12 bg-slate-50 dark:bg-slate-900/50">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                Punya Pengalaman atau Kasus Menarik?
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
                Bagikan studi kasus keamanan siber Anda. Kontribusi Anda akan membantu komunitas belajar dari pengalaman nyata.
              </p>
              <Link
                href="/submit-case?from=home"
                className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white transition-all bg-blue-600 rounded-full shadow-lg hover:bg-blue-700 hover:shadow-blue-500/30 hover:-translate-y-1"
              >
                Kirim Studi Kasus
                <ChevronRight className="w-4 h-4" />
              </Link>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-4">
                Setiap pengajuan akan direview oleh tim kami
              </p>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
