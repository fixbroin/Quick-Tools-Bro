
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { QrCode, Minimize, FileImage, HeartPulse, Home, Menu, FileText, Info, Shield, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useState } from 'react';

const navItems = [
  { href: '/', label: 'Home', Icon: Home },
  { href: '/tools/qr-generator', label: 'QR Gen', Icon: QrCode },
  { href: '/tools/image-compressor', label: 'Compress', Icon: Minimize },
  { href: '/tools/jpg-to-pdf', label: 'JPG to PDF', Icon: FileImage },
];

const legalLinks = [
    { href: '/contact', label: 'Contact Us', Icon: Mail },
    { href: '/privacy', label: 'Privacy Policy', Icon: Shield },
    { href: '/terms', label: 'Terms of Use', Icon: FileText },
]

export function BottomNavBar() {
  const pathname = usePathname();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/80 backdrop-blur-sm md:hidden">
      <div className="flex h-16 items-center justify-around">
        {navItems.map(({ href, label, Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex flex-col items-center justify-center gap-1 text-xs font-medium transition-colors',
              pathname === href ? 'text-primary' : 'text-muted-foreground hover:text-primary'
            )}
          >
            <Icon className="h-5 w-5" />
            <span>{label}</span>
          </Link>
        ))}
         <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
                <button className="flex flex-col items-center justify-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-primary">
                    <Menu className="h-5 w-5" />
                    <span>More</span>
                </button>
            </SheetTrigger>
            <SheetContent side="bottom" className="rounded-t-lg">
                <SheetHeader className="text-left">
                    <SheetTitle>More Options</SheetTitle>
                    <SheetDescription>Find legal information and other resources.</SheetDescription>
                </SheetHeader>
                <div className="grid gap-4 py-4">
                    {legalLinks.map(({ href, label, Icon }) => (
                         <Link
                            key={href}
                            href={href}
                            onClick={() => setIsSheetOpen(false)}
                            className="flex items-center gap-3 rounded-lg p-2 text-base font-medium text-foreground transition-colors hover:bg-muted"
                        >
                            <Icon className="h-5 w-5 text-muted-foreground" />
                            <span>{label}</span>
                        </Link>
                    ))}
                </div>
            </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
