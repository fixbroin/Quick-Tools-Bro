'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ChevronRight } from 'lucide-react';
import { tools } from '@/lib/tools';

export function Breadcrumbs() {
  const pathname = usePathname();
  if (pathname === '/' || !pathname) return null;

  // Find tool details
  const currentTool = tools.find(
    (t) => t.href.toLowerCase().replace(/\/$/, '') === pathname.toLowerCase().replace(/\/$/, '')
  );
  const toolName = currentTool?.name || pathname.split('/').pop()?.replace(/-/g, ' ') || 'Tool';

  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center space-x-1.5 text-xs text-muted-foreground/80 mb-6 bg-card/40 backdrop-blur-sm border border-primary/5 py-2 px-3.5 rounded-xl w-fit shadow-sm"
    >
      <Link href="/" className="flex items-center gap-1 hover:text-primary transition-colors">
        <Home className="h-3.5 w-3.5" />
        <span>Home</span>
      </Link>

      <ChevronRight className="h-3 w-3 text-muted-foreground/40 shrink-0" />

      <Link href="/" className="hover:text-primary transition-colors">
        Tools
      </Link>

      <ChevronRight className="h-3 w-3 text-muted-foreground/40 shrink-0" />

      <span className="font-bold text-foreground truncate max-w-[150px] md:max-w-none capitalize">
        {toolName}
      </span>
    </nav>
  );
}
