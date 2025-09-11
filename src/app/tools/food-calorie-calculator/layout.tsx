import type { Metadata } from 'next';

const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Quick Tools Bro';

export const metadata: Metadata = {
    title: 'Food Calorie & Nutrition Calculator',
    description: 'Calculate calories, protein, carbs, and fats for various foods. Select a food item, enter the quantity, and get instant nutritional information.',
    keywords: ['food calorie calculator', 'nutrition calculator', 'calorie counter', 'food nutrients', 'health calculator', 'diet tool', 'protein calculator'],
    alternates: {
        canonical: '/tools/food-calorie-calculator',
    }
}

export default function FoodCalorieCalculatorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
