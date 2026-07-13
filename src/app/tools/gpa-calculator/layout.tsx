import { Metadata } from 'next';
import Script from 'next/script';
import { SITE_CONFIG, getMetadata, getToolJsonLd } from '@/lib/config';

export const metadata: Metadata = getMetadata({
    title: 'Free Online GPA & CGPA Calculator - Student Tools',
    description: 'Calculate semester GPA and overall cumulative CGPA online client-side. Fast, safe, and completely free.',
    keywords: ['gpa calculator', 'cgpa calculator', 'calculate gpa online', 'student grade calculator', 'free student tool'],
    path: '/tools/gpa-calculator',
});

export default function GPACalculatorLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = getToolJsonLd({
    name: 'Free Online GPA & CGPA Calculator - Student Tools',
    description: 'Calculate semester GPA and overall cumulative CGPA online client-side. Fast, safe, and completely free.',
    url: `${SITE_CONFIG.url}/tools/gpa-calculator`,
  });
  return (
    <>
      <Script
        id="gpa-calculator-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
