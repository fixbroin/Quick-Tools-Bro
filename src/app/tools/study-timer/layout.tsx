import { Metadata } from 'next';
import Script from 'next/script';
import { SITE_CONFIG, getMetadata, getToolJsonLd } from '@/lib/config';

export const metadata: Metadata = getMetadata({
    title: 'Free Online Pomodoro Study Timer - Focus Booster',
    description: 'Booster your academic focus online client-side. Set customizable work and break intervals (25/5 Pomodoro method) with alarm sounds.',
    keywords: ['study timer', 'pomodoro timer', 'focus timer online', 'productivity timer', 'free student tool'],
    path: '/tools/study-timer',
});

export default function StudyTimerLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = getToolJsonLd({
    name: 'Free Online Pomodoro Study Timer - Focus Booster',
    description: 'Booster your academic focus online client-side. Set customizable work and break intervals (25/5 Pomodoro method) with alarm sounds.',
    url: `${SITE_CONFIG.url}/tools/study-timer`,
  });
  return (
    <>
      <Script
        id="study-timer-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
