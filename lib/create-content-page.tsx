import { ContentContainer } from '@/components/layout/ContentContainer';
import { MarkdownRender } from '@/components/content/MarkdownRender';
import type { ContentSlug } from './hybrid-content';
import { getHybridContent } from './hybrid-content';

type Options = {
  slug: ContentSlug;
  fallbackTitle: string;
};

export function createContentPage({ slug, fallbackTitle }: Options) {
  async function ContentPage() {
    const { mdx, frontmatter, source } = await getHybridContent(slug);
    const title = frontmatter.title ?? fallbackTitle;
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
            Makalah Etika Profesi
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

  return ContentPage;
}

