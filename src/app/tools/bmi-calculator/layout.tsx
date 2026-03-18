import { Metadata } from 'next';
import Script from 'next/script';
import { SITE_CONFIG, getMetadata, getToolJsonLd } from '@/lib/config';

export const metadata: Metadata = getMetadata({
  title: 'Accurate Online BMI Calculator - Check Your Body Mass Index',
  description: 'Calculate your Body Mass Index (BMI) easily with our free online calculator. Get instant results and clear health advice based on your weight and height.',
  keywords: ['bmi calculator', 'body mass index', 'calculate bmi online', 'weight status', 'health calculator', 'body fat calculator', 'healthy weight'],
  path: '/tools/bmi-calculator',
});

export default function BmiCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = getToolJsonLd({
    name: 'Accurate Online BMI Calculator - Check Your Body Mass Index',
    description: 'Calculate your Body Mass Index (BMI) easily with our free online calculator. Get instant results and clear health advice based on your weight and height.',
    url: `${SITE_CONFIG.url}/tools/bmi-calculator`,
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
