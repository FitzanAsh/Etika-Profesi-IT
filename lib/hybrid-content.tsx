import { compileMDX } from 'next-mdx-remote/rsc';
import path from 'node:path';
import { promises as fs } from 'node:fs';
import { cache, type ReactElement } from 'react';
import { getSupabaseServiceRoleClient } from './supabase-client';

export type HybridSource = 'local' | 'database';

export const BAB2_SUBTOPIC_SLUGS = [
  'cybercrime',
  'karakteristik',
  'klasifikasi',
  'unauthorized-access',
  'cyberlaw',
  'hukum-indonesia',
] as const;

type Bab2Slug = (typeof BAB2_SUBTOPIC_SLUGS)[number];

export type ContentSlug =
  | 'abstrak'
  | 'pendahuluan'
  | 'landasan-teori'
  | 'pembahasan'
  | 'penutup'
  | `bab2/${Bab2Slug}`;

type Frontmatter = {
  title?: string;
  updated?: string | null;
  source?: HybridSource;
};

type HybridContent = {
  slug: ContentSlug;
  frontmatter: Frontmatter;
  source: HybridSource;
  mdx: ReactElement;
};

const CONTENT_DIR = path.join(process.cwd(), 'content');

async function readLocalFile(slug: ContentSlug) {
  const filePath = path.join(CONTENT_DIR, `${slug}.md`);
  return fs.readFile(filePath, 'utf8');
}

async function readRemoteContent(slug: ContentSlug) {
  const client = getSupabaseServiceRoleClient();
  if (!client) return null;

  const { data, error } = await client
    .from('contents')
    .select('title, body, updated_at, source')
    .eq('slug', slug)
    .maybeSingle();

  if (error || !data || !data.body) return null;

  const safeTitle = (data.title ?? '').replace(/"/g, "'");
  const safeSource = data.source === 'database' ? 'database' : 'local';
  const metadata = [
    `title: "${safeTitle || slug}"`,
    `updated: "${data.updated_at ?? ''}"`,
    `source: "${safeSource}"`,
  ].join('\n');

  return `---\n${metadata}\n---\n\n${data.body}`;
}

export const getHybridContent = cache(async (slug: ContentSlug): Promise<HybridContent> => {
  const remote = await readRemoteContent(slug);
  const sourceText = remote ?? (await readLocalFile(slug));

  const { content, frontmatter } = await compileMDX<Frontmatter>({
    source: sourceText,
    options: {
      parseFrontmatter: true,
    },
  });

  return {
    slug,
    mdx: content,
    frontmatter,
    source: (frontmatter.source as HybridSource) ?? (remote ? 'database' : 'local'),
  };
});

