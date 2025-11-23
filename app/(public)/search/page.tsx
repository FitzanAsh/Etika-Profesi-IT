'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, FileText, Shield, Loader2, X } from 'lucide-react';

interface SearchResult {
  id: string;
  title: string;
  slug: string;
  type: 'content' | 'case';
  excerpt: string;
  attack_type?: string;
  url: string;
}

interface SearchResponse {
  success: boolean;
  query: string;
  totalResults: number;
  results: {
    contents: SearchResult[];
    cases: SearchResult[];
  };
}

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'contents' | 'cases'>('all');

  // Auto-search when query changes (with debounce)
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (query.length >= 2) {
        performSearch();
      } else {
        setResults(null);
      }
    }, 500); // Wait 500ms after user stops typing

    return () => clearTimeout(delayDebounce);
  }, [query, filterType]);

  const performSearch = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}&type=${filterType}`);
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setQuery('');
    setResults(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 md:px-6">
      <div className="container max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-3">
            🔍 Cari Konten
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Temukan topik, materi, dan studi kasus keamanan siber
          </p>
        </div>

        {/* Search Box */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari materi atau studi kasus..."
              className="w-full pl-12 pr-12 py-4 text-lg border-2 border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
            />
            {query && (
              <button
                onClick={clearSearch}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            )}
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => setFilterType('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filterType === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700'
                }`}
            >
              Semua
            </button>
            <button
              onClick={() => setFilterType('contents')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filterType === 'contents'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700'
                }`}
            >
              📄 Materi
            </button>
            <button
              onClick={() => setFilterType('cases')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filterType === 'cases'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700'
                }`}
            >
              🔐 Studi Kasus
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-3" />
            <p className="text-slate-600 dark:text-slate-400">Mencari...</p>
          </div>
        )}

        {/* Results */}
        {results && !loading && (
          <div>
            <div className="mb-4 text-sm text-slate-600 dark:text-slate-400">
              Ditemukan <span className="font-bold text-blue-600">{results.totalResults}</span> hasil untuk "{results.query}"
            </div>

            {results.totalResults === 0 && (
              <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                <p className="text-lg text-slate-600 dark:text-slate-400">
                  😔 Tidak ada hasil ditemukan
                </p>
                <p className="text-sm text-slate-500 mt-2">
                  Coba gunakan kata kunci yang berbeda
                </p>
              </div>
            )}

            {/* Contents Results */}
            {results.results.contents.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  Materi ({results.results.contents.length})
                </h2>
                <div className="space-y-3">
                  {results.results.contents.map((item) => (
                    <Link
                      key={item.id}
                      href={item.url}
                      className="block p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg hover:border-blue-500 hover:shadow-md transition-all"
                    >
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
                        {item.title}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                        {item.excerpt}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Cases Results */}
            {results.results.cases.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-red-600" />
                  Studi Kasus ({results.results.cases.length})
                </h2>
                <div className="space-y-3">
                  {results.results.cases.map((item) => (
                    <Link
                      key={item.id}
                      href={item.url}
                      className="block p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg hover:border-blue-500 hover:shadow-md transition-all"
                    >
                      <div className="flex items-start justify-between gap-3 mb-1">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                          {item.title}
                        </h3>
                        {item.attack_type && (
                          <span className="px-2 py-1 text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-full whitespace-nowrap">
                            {item.attack_type}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                        {item.excerpt}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {!query && !results && (
          <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
            <Search className="w-16 h-16 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Mulai Pencarian
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              Ketik minimal 2 karakter untuk mencari konten
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
