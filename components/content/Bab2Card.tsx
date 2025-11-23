import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

type Bab2CardProps = {
  title: string;
  slug: string;
  description: string;
  icon: LucideIcon;
  badge?: string;
};

export function Bab2Card({ title, slug, description, icon: Icon, badge }: Bab2CardProps) {
  return (
    <Card className="flex flex-col justify-between transition-all duration-200 hover:scale-[1.02] hover:shadow-lg">
      <CardHeader className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-slate-100 p-3 text-slate-700">
            <Icon className="h-5 w-5" />
          </div>
          {badge ? (
            <Badge variant="secondary" className="text-xs uppercase tracking-wide">
              {badge}
            </Badge>
          ) : null}
        </div>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardFooter>
        <Button asChild variant="default" className="w-full">
          <Link href={`/landasan-teori/${slug}`}>Pelajari</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

