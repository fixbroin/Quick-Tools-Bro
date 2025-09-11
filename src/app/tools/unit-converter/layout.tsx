import type { Metadata } from 'next';

const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Quick Tools Bro';

export const metadata: Metadata = {
    title: 'Free Online Unit Converter - Convert Length, Mass, Temp & More',
    description: 'A comprehensive unit converter for length, mass, temperature, volume, speed, and more. Easily convert between various metric and imperial units of measurement.',
    keywords: ['unit converter', 'measurement converter', 'metric to imperial', 'length converter', 'mass converter', 'temperature converter', 'online tool'],
    alternates: {
        canonical: '/tools/unit-converter',
    }
}

export default function UnitConverterLayout({ children }: { children: React.ReactNode }) {
  return children;
}
