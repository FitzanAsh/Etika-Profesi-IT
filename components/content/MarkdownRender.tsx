import type { ReactNode } from 'react';

type MarkdownRenderProps = {
  children: ReactNode;
};

export function MarkdownRender({ children }: MarkdownRenderProps) {
  return (
    <article className="prose prose-report max-w-none dark:prose-invert">
      {children}
    </article>
  );
}

