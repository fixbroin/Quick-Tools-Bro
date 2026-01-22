
import Link from 'next/link';
import { InstallPWAButton } from './InstallPWAButton';
import { tools } from '@/lib/tools';
import Image from 'next/image';


const legalLinks = [
    { name: 'Contact Us', href: '/contact' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Use', href: '/terms' },
]

export function Footer() {
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Quick Tools Bro';
  const half = Math.ceil(tools.length / 2);
  const firstHalf = tools.slice(0, half);
  const secondHalf = tools.slice(half);

  return (
    <footer className="border-t bg-card text-card-foreground">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="flex flex-col gap-4">
                 <Link href="/" className="flex items-center gap-2">
                    <Image src="/android-chrome-512x512.png" alt={siteName} width={32} height={32} className="rounded-lg" />
                    <span className="font-headline text-xl font-bold">{siteName}</span>
                </Link>
                <p className="text-sm text-muted-foreground">
                    Your all-in-one hub for quick file conversions and tool utilities.
                </p>
                <div className="mt-2">
                  <InstallPWAButton />
                </div>
            </div>
            <div className="md:col-start-3">
                <h3 className="font-headline text-lg font-semibold">Tools</h3>
                <ul className="mt-4 space-y-2">
                    {firstHalf.map((tool) => (
                        <li key={tool.href}>
                            <Link href={tool.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                {tool.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
             <div>
                <h3 className="font-headline text-lg font-semibold text-transparent max-md:hidden">.</h3>
                 <ul className="mt-4 space-y-2 max-md:hidden">
                    {secondHalf.map((tool) => (
                        <li key={tool.href}>
                            <Link href={tool.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                {tool.name}
                            </Link>
                        </li>
                    ))}
                </ul>
                <h3 className="font-headline text-lg font-semibold mt-4">Legal</h3>
                <ul className="mt-4 space-y-2">
                     {legalLinks.map((link) => (
                        <li key={link.href}>
                            <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                {link.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} {siteName}. All rights reserved. | A product of <a href="https://fixbro.in" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">FixBro.in</a></p>
        </div>
      </div>
    </footer>
  );
}
