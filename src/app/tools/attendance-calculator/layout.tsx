import { Metadata } from 'next';
import Script from 'next/script';
import { SITE_CONFIG, getMetadata, getToolJsonLd } from '@/lib/config';

export const metadata: Metadata = getMetadata({
    title: 'Free Online Attendance Calculator - Target Attendance Estimator',
    description: 'Calculate how many classes/lectures you need to attend or can safely miss to maintain your target attendance percentage client-side.',
    keywords: ['attendance calculator', 'target attendance finder', 'calculate classes to attend', 'safe classes to miss', 'free student tool'],
    path: '/tools/attendance-calculator',
});

export default function AttendanceCalculatorLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = getToolJsonLd({
    name: 'Free Online Attendance Calculator - Target Attendance Estimator',
    description: 'Calculate how many classes/lectures you need to attend or can safely miss to maintain your target attendance percentage client-side.',
    url: `${SITE_CONFIG.url}/tools/attendance-calculator`,
  });
  return (
    <>
      <Script
        id="attendance-calculator-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
