
'use client';

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";

const bmiCategories = [
  { name: 'Underweight', range: '< 18.5', risk: 'Low', color: 'bg-blue-400' },
  { name: 'Normal Weight', range: '18.5 - 24.9', risk: 'Ideal', color: 'bg-green-500' },
  { name: 'Overweight', range: '25.0 - 29.9', risk: 'High', color: 'bg-yellow-400' },
  { name: 'Obese', range: '30.0 - 39.9', risk: 'Very High', color: 'bg-orange-500' },
  { name: 'Morbidly Obese', range: '≥ 40.0', risk: 'Extremely High', color: 'bg-red-500' },
];

export function BmiCategoryChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">BMI Categories</CardTitle>
        <CardDescription>This chart shows the standard BMI categories for adults.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row rounded-lg overflow-hidden border">
          {bmiCategories.map((category) => (
            <div key={category.name} className={`flex-1 p-4 text-white ${category.color}`}>
              <div className="font-bold uppercase text-sm">{category.name}</div>
              <div className="text-2xl font-bold my-2">{category.range}</div>
              <div className="text-sm opacity-90">{category.risk} Risk</div>
            </div>
          ))}
        </div>
         <p className="text-xs text-muted-foreground mt-4">
            Note: BMI is a general guide and may not be accurate for all body types, such as athletes or pregnant women. Consult a healthcare professional for personalized advice.
          </p>
      </CardContent>
    </Card>
  );
}
