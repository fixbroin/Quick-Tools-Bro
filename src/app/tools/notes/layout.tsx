import { Metadata } from 'next';
import Script from 'next/script';
import { SITE_CONFIG, getMetadata, getToolJsonLd } from '@/lib/config';

export const metadata: Metadata = getMetadata({
    title: 'Free Online Notes Notepad - Auto-Save Notes',
    description: 'A private browser notepad to write, format, search, and save notes client-side. Works completely offline with auto-saving to local storage.',
    keywords: ['online notes', 'notepad online', 'private notepad', 'offline notepad', 'free text editor'],
    path: '/tools/notes',
});

export default function NotesLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = getToolJsonLd({
    name: 'Free Online Notes Notepad - Auto-Save Notes',
    description: 'A private browser notepad to write, format, search, and save notes client-side. Works completely offline with auto-saving to local storage.',
    url: `${SITE_CONFIG.url}/tools/notes`,
  });
  return (
    <>
      <Script
        id="notes-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
