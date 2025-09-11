import { Wrench } from 'lucide-react';
import Link from 'next/link';
import { ThemeToggle } from './ThemeToggle';
import { Search } from './Search';

export function Header() {
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Quick Tools Bro';
  return (
    <header className="border-b bg-card">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="rounded-lg bg-primary/10 p-2 text-primary">
            <Wrench className="h-5 w-5" />
          </div>
          <span className="font-headline text-xl font-bold">{siteName}</span>
        </Link>
        <div className="flex items-center gap-2">
            <Search />
            <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
