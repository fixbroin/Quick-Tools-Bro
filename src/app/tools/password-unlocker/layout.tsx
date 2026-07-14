import { Metadata } from 'next';
import Script from 'next/script';
import { SITE_CONFIG, getMetadata, getToolJsonLd } from '@/lib/config';

export const metadata: Metadata = getMetadata({
    title: 'PDF Password Unlocker - Remove PDF Password Online',
    description: 'Free online PDF Password Unlocker to remove passwords, decryption restrictions, and security keys from your protected PDF files. 100% private, client-side browser processing.',
    keywords: ['pdf password remover', 'unlock pdf', 'remove pdf password', 'pdf decrypter', 'free pdf unlocker', 'remove pdf security', 'online tool'],
    path: '/tools/password-unlocker',
});

export default function PasswordUnlockerLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = getToolJsonLd({
    name: 'PDF Password Unlocker - Remove PDF Password Online',
    description: 'Free online PDF Password Unlocker to remove passwords, decryption restrictions, and security keys from your protected PDF files. 100% private, client-side browser processing.',
    url: `${SITE_CONFIG.url}/tools/password-unlocker`,
  });
  return (
    <>
      <Script
        id="tool-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
