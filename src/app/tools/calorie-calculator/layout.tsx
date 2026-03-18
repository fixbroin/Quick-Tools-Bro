import { Metadata } from 'next';
import Script from 'next/script';
import { SITE_CONFIG, getMetadata, getToolJsonLd } from '@/lib/config';

export const metadata: Metadata = getMetadata({
  title: 'Daily Calorie Calculator - Estimate Your Calorie Needs',
  description: 'Calculate your daily calorie needs for weight loss, maintenance, or gain with our free and easy-to-use calorie calculator. Get a personalized plan based on your profile.',
  keywords: ['calorie calculator', 'daily calories', 'weight loss calculator', 'tdee calculator', 'calorie needs', 'diet tool', 'health calculator', 'bmr calculator'],
  path: '/tools/calorie-calculator',
});

export default function CalorieCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = getToolJsonLd({
    name: 'Daily Calorie Calculator - Estimate Your Calorie Needs',
    description: 'Calculate your daily calorie needs for weight loss, maintenance, or gain with our free and easy-to-use calorie calculator. Get a personalized plan based on your profile.',
    url: `${SITE_CONFIG.url}/tools/calorie-calculator`,
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
