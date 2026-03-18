import { Metadata } from 'next';
import Script from 'next/script';
import { SITE_CONFIG, getMetadata, getToolJsonLd } from '@/lib/config';

export const metadata: Metadata = getMetadata({
    title: 'Free Online Unit Converter - Convert Length, Mass, Temp & More',
    description: 'A comprehensive unit converter for length, mass, temperature, volume, speed, and more. Easily convert between various metric and imperial units of measurement.',
    keywords: ['unit converter', 'measurement converter', 'metric to imperial', 'length converter', 'mass converter', 'temperature converter', 'online tool'],
    path: '/tools/unit-converter',
});

export default function UnitConverterLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = getToolJsonLd({
    name: 'Free Online Unit Converter - Convert Length, Mass, Temp & More',
    description: 'A comprehensive unit converter for length, mass, temperature, volume, speed, and more. Easily convert between various metric and imperial units of measurement.',
    url: `${SITE_CONFIG.url}/tools/unit-converter`,
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
