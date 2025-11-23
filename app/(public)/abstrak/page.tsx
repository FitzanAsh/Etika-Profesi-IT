import { getPublicContent } from '@/lib/get-content';
import { MarkdownViewer } from '@/components/ui/markdown-viewer';

const SLUG = 'abstrak';

// Force dynamic rendering to always fetch fresh data
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Page() {
  const data = await getPublicContent(SLUG);

  if (!data) {
    return <div className="p-10 text-center">Konten belum tersedia.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-6">
      <div className="mb-8 pb-4 border-b border-slate-200 dark:border-slate-700">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{data.title}</h1>
        <p className="text-sm text-slate-500 mt-2">Terakhir diperbarui: {new Date(data.updated_at).toLocaleDateString()}</p>
      </div>

      <MarkdownViewer content={data.body || ''} />
    </div>
  );
}
