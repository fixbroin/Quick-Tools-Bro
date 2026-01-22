import Link from 'next/link';
import { ThemeToggle } from './ThemeToggle';
import { Search } from './Search';
import Image from 'next/image';

export function Header() {
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Quick Tools Bro';
  return (
    <header className="border-b bg-card">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/android-chrome-512x512.png" alt={siteName} width={32} height={32} className="rounded-lg" />
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
