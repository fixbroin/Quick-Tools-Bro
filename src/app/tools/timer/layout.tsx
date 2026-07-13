import { Metadata } from 'next';
import Script from 'next/script';
import { SITE_CONFIG, getMetadata, getToolJsonLd } from '@/lib/config';

export const metadata: Metadata = getMetadata({
    title: 'Free Online Countdown Timer - Circular Progress & Alarm',
    description: 'Set a countdown timer online client-side. Track time with a premium circular progress indicator and a built-in alarm audio warning.',
    keywords: ['online timer', 'countdown timer', 'set alarm', 'pomodoro study timer', 'free daily tool'],
    path: '/tools/timer',
});

export default function TimerLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = getToolJsonLd({
    name: 'Free Online Countdown Timer - Circular Progress & Alarm',
    description: 'Set a countdown timer online client-side. Track time with a premium circular progress indicator and a built-in alarm audio warning.',
    url: `${SITE_CONFIG.url}/tools/timer`,
  });
  return (
    <>
      <Script
        id="timer-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
