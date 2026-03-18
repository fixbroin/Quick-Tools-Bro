import { Metadata } from 'next';
import Script from 'next/script';
import { SITE_CONFIG, getMetadata, getToolJsonLd } from '@/lib/config';

export const metadata: Metadata = getMetadata({
    title: 'Food Calorie & Nutrition Calculator - Track Your Daily Intake',
    description: 'Calculate calories, protein, carbs, and fats for various foods. Select a food item, enter the quantity, and get instant nutritional information to track your daily diet.',
    keywords: ['food calorie calculator', 'nutrition calculator', 'calorie counter', 'food nutrients', 'health calculator', 'diet tool', 'protein calculator', 'track calories'],
    path: '/tools/food-calorie-calculator',
});

export default function FoodCalorieCalculatorLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = getToolJsonLd({
    name: 'Food Calorie & Nutrition Calculator - Track Your Daily Intake',
    description: 'Calculate calories, protein, carbs, and fats for various foods. Select a food item, enter the quantity, and get instant nutritional information to track your daily diet.',
    url: `${SITE_CONFIG.url}/tools/food-calorie-calculator`,
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
