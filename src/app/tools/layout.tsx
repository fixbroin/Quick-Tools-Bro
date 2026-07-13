import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { SeoSection } from '@/components/SeoSection';
import { AdPlacement } from '@/components/AdPlacement';
import { HostingPromo } from '@/components/HostingPromo';

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container mx-auto px-4 py-8">
      <Button asChild variant="secondary" className="hidden md:inline-flex mb-6 rounded-xl border border-primary/5 shadow-sm font-bold text-xs tracking-wide">
        <Link href="/">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to All Tools
        </Link>
      </Button>
      <div className="space-y-6">
        <AdPlacement position="top" />
        {children}
        <HostingPromo />
        <AdPlacement position="bottom" />
        <SeoSection />
      </div>
    </div>
  );
}
