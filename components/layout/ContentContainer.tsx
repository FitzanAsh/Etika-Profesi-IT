import type { ReactNode } from 'react';
import { Container } from './Container';

type ContentContainerProps = {
  children: ReactNode;
};

export function ContentContainer({ children }: ContentContainerProps) {
  return (
    <Container>
      <div className="py-8 md:py-12 space-y-8">{children}</div>
    </Container>
  );
}

