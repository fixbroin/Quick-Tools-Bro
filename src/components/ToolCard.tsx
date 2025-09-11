import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { LucideIcon } from 'lucide-react';

interface ToolCardProps {
  title: string;
  description: string;
  href: string;
  Icon: LucideIcon;
}

export function ToolCard({ title, description, href, Icon }: ToolCardProps) {
  return (
    <Link href={href} className="group block">
      <Card className="h-full transition-all duration-300 group-hover:-translate-y-1 group-hover:border-primary group-hover:shadow-lg">
        <CardHeader className="flex flex-row items-center gap-4">
          <div className="rounded-lg bg-primary/10 p-3 text-primary">
            <Icon className="h-6 w-6" />
          </div>
          <div>
            <CardTitle className="font-headline text-lg">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </CardHeader>
      </Card>
    </Link>
  );
}
