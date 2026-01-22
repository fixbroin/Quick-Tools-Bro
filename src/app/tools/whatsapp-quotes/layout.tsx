import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: `WhatsApp Quotes - Find and Share Quotes`,
    description: 'Find the perfect quote for your WhatsApp status. Browse through categories like motivational, funny, love, and more.',
    keywords: ['WhatsApp quotes', 'status quotes', 'inspirational quotes', 'love quotes', 'funny quotes', 'daily quotes'],
    alternates: {
        canonical: '/tools/whatsapp-quotes',
    }
}

export default function WhatsAppQuotesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
