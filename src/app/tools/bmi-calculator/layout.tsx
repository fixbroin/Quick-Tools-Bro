import type { Metadata } from 'next';

const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Quick Tools Bro';

export const metadata: Metadata = {
    title: `Free BMI Calculator - Check Your Body Mass Index Online`,
    description: 'Use our free BMI calculator to instantly check your Body Mass Index. Enter your height and weight to find out if you are in a healthy weight range. Simple, fast, and accurate.',
    keywords: ['BMI calculator', 'body mass index', 'health calculator', 'weight calculator', 'check BMI', 'free BMI tool', 'online calculator'],
    alternates: {
        canonical: '/tools/bmi-calculator',
    }
}

export default function BmiCalculatorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
