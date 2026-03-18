
import Link from 'next/link';
import { InstallPWAButton } from './InstallPWAButton';
import { tools } from '@/lib/tools';
import Image from 'next/image';
import { Mail, Shield, FileText, ChevronRight, ExternalLink } from 'lucide-react';
import { SITE_CONFIG } from '@/lib/config';

const legalLinks = [
    { name: 'Contact Us', href: '/contact', icon: Mail },
    { name: 'Privacy Policy', href: '/privacy', icon: Shield },
    { name: 'Terms of Use', href: '/terms', icon: FileText },
]

export function Footer() {
  // Split tools into smaller chunks for better vertical balance
  const firstHalf = tools.slice(0, 8);
  const secondHalf = tools.slice(8, 16);

  return (
    <footer className="relative border-t bg-card text-card-foreground">
      {/* Subtle top border gradient */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-30" />
      
      <div className="container mx-auto px-4 py-12 md:py-16">
        {/* PWA Promo Banner - Now better integrated and full-width */}
        <div className="mb-16">
          <InstallPWAButton />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
            {/* Brand Section */}
            <div className="lg:col-span-2 flex flex-col gap-6 max-w-sm">
                 <Link href="/" className="flex items-center gap-3 group">
                    <div className="relative">
                        <Image src="/android-chrome-512x512.png" alt={SITE_CONFIG.name} width={40} height={40} className="rounded-xl shadow-sm transition-transform group-hover:scale-110" />
                        <div className="absolute -inset-1 rounded-xl bg-primary/20 blur opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <span className="font-headline text-2xl font-bold tracking-tight">{SITE_CONFIG.name}</span>
                </Link>
                <p className="text-base text-muted-foreground leading-relaxed">
                    The ultimate all-in-one hub for high-performance browser-based tools. 
                    Simple, fast, and secure file processing right at your fingertips.
                </p>
                <div className="flex items-center gap-4 mt-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Shield className="h-5 w-5" />
                    </div>
                    <span className="text-sm font-medium text-muted-foreground">100% Browser-Based Security</span>
                </div>
            </div>

            {/* Tools Columns */}
            <div className="lg:col-span-2 grid grid-cols-2 gap-8">
                <div>
                    <h3 className="font-headline text-sm font-bold uppercase tracking-[0.2em] text-muted-foreground/80 mb-6">Popular Tools</h3>
                    <ul className="space-y-3">
                        {firstHalf.map((tool) => (
                            <li key={tool.href}>
                                <Link href={tool.href} className="group flex items-center text-sm text-muted-foreground hover:text-primary transition-all duration-300">
                                    <span className="w-0 overflow-hidden group-hover:w-3 transition-all duration-300 opacity-0 group-hover:opacity-100 mr-0 group-hover:mr-2">
                                        <ChevronRight className="h-3 w-3" />
                                    </span>
                                    {tool.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
                <div>
                    <h3 className="font-headline text-sm font-bold uppercase tracking-[0.2em] text-muted-foreground/80 mb-6">More Tools</h3>
                    <ul className="space-y-3">
                        {secondHalf.map((tool) => (
                            <li key={tool.href}>
                                <Link href={tool.href} className="group flex items-center text-sm text-muted-foreground hover:text-primary transition-all duration-300">
                                    <span className="w-0 overflow-hidden group-hover:w-3 transition-all duration-300 opacity-0 group-hover:opacity-100 mr-0 group-hover:mr-2">
                                        <ChevronRight className="h-3 w-3" />
                                    </span>
                                    {tool.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Legal & Info */}
            <div className="flex flex-col gap-8">
                <div>
                    <h3 className="font-headline text-sm font-bold uppercase tracking-[0.2em] text-muted-foreground/80 mb-6">Legal</h3>
                    <ul className="space-y-4">
                        {legalLinks.map((link) => {
                            const Icon = link.icon;
                            return (
                                <li key={link.href}>
                                    <Link href={link.href} className="flex items-center gap-3 text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                                        <div className="p-2 rounded-lg bg-muted group-hover:bg-primary/10 transition-colors">
                                            <Icon className="h-4 w-4" />
                                        </div>
                                        {link.name}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-16 pt-8 border-t border-border/50">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-muted-foreground">
                <p className="font-medium">&copy; {new Date().getFullYear()} {SITE_CONFIG.name}. All rights reserved.</p>
                <div className="flex items-center gap-2 group">
                    <span>A premium product of</span>
                    <a 
                      href="https://fixbro.in" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="font-bold text-foreground hover:text-primary transition-colors flex items-center gap-1 group-hover:underline underline-offset-4"
                    >
                      FixBro.in <ExternalLink className="h-3 w-3 opacity-50" />
                    </a>
                </div>
            </div>
        </div>
      </div>
    </footer>
  );
}
