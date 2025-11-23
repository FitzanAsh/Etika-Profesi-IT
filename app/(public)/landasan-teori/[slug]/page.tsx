import { notFound } from 'next/navigation';
import { ContentContainer } from '@/components/layout/ContentContainer';
import { MarkdownRender } from '@/components/content/MarkdownRender';
import {
  BAB2_SUBTOPIC_SLUGS,
  type ContentSlug,
  getHybridContent,
} from '@/lib/hybrid-content';

type Bab2DetailPageProps = {
  params: {
    slug: string;
  };
};

export function generateStaticParams() {
  return BAB2_SUBTOPIC_SLUGS.map((slug) => ({ slug }));
}

export default async function Bab2DetailPage({ params }: Bab2DetailPageProps) {
  const { slug } = params;
  if (!BAB2_SUBTOPIC_SLUGS.includes(slug as (typeof BAB2_SUBTOPIC_SLUGS)[number])) {
    notFound();
  }

  const contentSlug = `bab2/${slug}` as ContentSlug;
  const { mdx, frontmatter, source } = await getHybridContent(contentSlug);
  const title = frontmatter.title ?? slug;
  const updated = typeof frontmatter.updated === 'string' ? frontmatter.updated : null;
  const formattedDate =
    updated && !Number.isNaN(Date.parse(updated))
      ? new Intl.DateTimeFormat('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        }).format(new Date(updated))
      : null;

  return (
    <ContentContainer>
      <header className="space-y-3 border-b border-slate-200 pb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          Bab II — Landasan Teori
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">{title}</h1>
        <div className="flex flex-wrap gap-4 text-sm text-slate-500">
          <span>Sumber: {source === 'database' ? 'Database' : 'File Lokal'}</span>
          {formattedDate ? <span>Diperbarui: {formattedDate}</span> : null}
        </div>
      </header>

      <MarkdownRender>{mdx}</MarkdownRender>
    </ContentContainer>
  );
}

