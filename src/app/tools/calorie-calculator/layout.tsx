import type { Metadata } from 'next';

const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Quick Tools Bro';

export const metadata: Metadata = {
    title: 'Daily Calorie Calculator - Estimate Your Calorie Needs',
    description: 'Estimate your daily calorie needs for weight loss, maintenance, or gain with our free and easy-to-use calorie calculator. Based on your age, gender, height, weight, and activity level.',
    keywords: ['calorie calculator', 'daily calories', 'weight loss calculator', 'tdee calculator', 'calorie needs', 'diet tool', 'health calculator'],
    alternates: {
        canonical: '/tools/calorie-calculator',
    }
}

export default function CalorieCalculatorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
