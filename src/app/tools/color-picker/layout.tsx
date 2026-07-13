import { Metadata } from 'next';
import Script from 'next/script';
import { SITE_CONFIG, getMetadata, getToolJsonLd } from '@/lib/config';

export const metadata: Metadata = getMetadata({
    title: 'Free Online Color Picker & Harmony Generator',
    description: 'Pick colors online client-side. Convert Hex, RGB, HSL values, generate color harmonies (analogous, triadic) and perform WCAG contrast checks.',
    keywords: ['color picker', 'color palette generator', 'rgb to hex converter', 'wcag contrast checker', 'free design tool'],
    path: '/tools/color-picker',
});

export default function ColorPickerLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = getToolJsonLd({
    name: 'Free Online Color Picker & Harmony Generator',
    description: 'Pick colors online client-side. Convert Hex, RGB, HSL values, generate color harmonies (analogous, triadic) and perform WCAG contrast checks.',
    url: `${SITE_CONFIG.url}/tools/color-picker`,
  });
  return (
    <>
      <Script
        id="color-picker-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
