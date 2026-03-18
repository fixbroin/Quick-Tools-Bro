
import Link from 'next/link';
import { ThemeToggle } from './ThemeToggle';
import { Search } from './Search';
import Image from 'next/image';
import { SITE_CONFIG } from '@/lib/config';

export function Header() {
  return (
    <header className="border-b bg-card">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/android-chrome-512x512.png" alt={SITE_CONFIG.name} width={32} height={32} className="rounded-lg" />
          <span className="font-headline text-xl font-bold">{SITE_CONFIG.name}</span>
        </Link>
        <div className="flex items-center gap-2">
            <Search />
            <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

