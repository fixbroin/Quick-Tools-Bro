
'use client';
import { useState, useMemo, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { foodData, type FoodItem } from '@/lib/food-data';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';

const formSchema = z.object({
  food: z.string().min(1, 'Please select a food.'),
  quantity: z.string().min(1, 'Quantity is required.').refine(val => !isNaN(parseFloat(val)) && parseFloat(val) > 0, 'Must be a positive number.'),
  unit: z.string().min(1, 'Please select a unit.'),
});

type FormValues = z.infer<typeof formSchema>;

interface NutritionResult {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

const foodCategories = [...new Set(foodData.map(item => item.category))];

export default function FoodCalorieCalculatorPage() {
  const [result, setResult] = useState<NutritionResult | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      food: '',
      quantity: '100',
      unit: '',
    },
  });

  const selectedFoodName = form.watch('food');
  const selectedFoodItem = useMemo(() => foodData.find(item => item.name === selectedFoodName), [selectedFoodName]);

  // Reset unit when food changes
  useEffect(() => {
    if (selectedFoodItem) {
      const availableUnits = Object.keys(selectedFoodItem.units);
      form.setValue('unit', availableUnits[0]);
    } else {
      form.setValue('unit', '');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFoodItem]);


  const calculateNutrition = (data: FormValues) => {
    const food = foodData.find(item => item.name === data.food);
    if (!food) return;

    const quantity = parseFloat(data.quantity);
    const unitMultiplier = food.units[data.unit] || 1;
    const totalGrams = quantity * unitMultiplier;
    
    const { calories, protein, carbs, fats } = food.nutrition;

    setResult({
      calories: (calories / 100) * totalGrams,
      protein: (protein / 100) * totalGrams,
      carbs: (carbs / 100) * totalGrams,
      fats: (fats / 100) * totalGrams,
    });
  };
  
  return (
    <>
    <Card>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(calculateNutrition)}>
          <CardHeader>
            <CardTitle className="font-headline">Food Calorie & Nutrition Calculator</CardTitle>
            <CardDescription>Select a food to find out its nutritional information.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="food"
                render={({ field }) => (
                  <FormItem className="md:col-span-3">
                    <Label>Food Item</Label>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="Select a food" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {foodCategories.map(category => (
                          <SelectGroup key={category}>
                            <SelectLabel>{category}</SelectLabel>
                            {foodData.filter(item => item.category === category).map(item => (
                              <SelectItem key={item.name} value={item.name}>{item.name}</SelectItem>
                            ))}
                          </SelectGroup>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <Label>Quantity</Label>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="unit"
                render={({ field }) => (
                  <FormItem>
                    <Label>Unit</Label>
                    <Select onValueChange={field.onChange} value={field.value} disabled={!selectedFoodItem}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="Select a unit"/></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {selectedFoodItem && Object.keys(selectedFoodItem.units).map(unit => (
                          <SelectItem key={unit} value={unit} className="capitalize">{unit}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit">Calculate</Button>
          </CardContent>
        </form>
      </Form>
      {result && (
        <CardFooter>
          <Alert>
            <AlertTitle className="text-xl font-bold font-headline">Nutritional Information</AlertTitle>
            <AlertDescription>For {form.getValues('quantity')} {form.getValues('unit')} of {form.getValues('food')}:</AlertDescription>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-center">
              <div className="p-4 rounded-lg bg-blue-100/60 dark:bg-blue-900/30">
                <p className="font-bold text-lg">Calories</p>
                <p className="text-2xl font-headline text-blue-600 dark:text-blue-400">{result.calories.toFixed(1)} kcal</p>
              </div>
              <div className="p-4 rounded-lg bg-green-100/60 dark:bg-green-900/30">
                <p className="font-bold text-lg">Protein</p>
                <p className="text-2xl font-headline text-green-600 dark:text-green-400">{result.protein.toFixed(1)}g</p>
              </div>
              <div className="p-4 rounded-lg bg-yellow-100/60 dark:bg-yellow-900/30">
                <p className="font-bold text-lg">Carbs</p>
                <p className="text-2xl font-headline text-yellow-600 dark:text-yellow-400">{result.carbs.toFixed(1)}g</p>
              </div>
              <div className="p-4 rounded-lg bg-red-100/60 dark:bg-red-900/30">
                <p className="font-bold text-lg">Fats</p>
                <p className="text-2xl font-headline text-red-600 dark:text-red-400">{result.fats.toFixed(1)}g</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-4">*Nutritional information is an estimate and can vary based on preparation and portion size.</p>
          </Alert>
        </CardFooter>
      )}
    </Card>

    <section className="mt-12 space-y-8 prose prose-slate dark:prose-invert max-w-none border-t pt-12">
        <div className="bg-primary/5 rounded-2xl p-6 md:p-10 border border-primary/10">
            <h2 className="text-3xl font-bold font-headline mb-6">Why Use Our Food Calorie Calculator?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm leading-relaxed">
                <div>
                    <h3 className="text-xl font-bold mb-3">Accurate Nutrition Data</h3>
                    <p>Get precise estimates for calories, protein, carbs, and fats. Our tool uses a comprehensive database to ensure you get the most accurate nutritional information for your meals.</p>
                </div>
                <div>
                    <h3 className="text-xl font-bold mb-3">Custom Portions</h3>
                    <p>Whether you're eating a small snack or a full meal, you can easily adjust the quantity and units to match your serving size perfectly.</p>
                </div>
                <div>
                    <h3 className="text-xl font-bold mb-3">Completely Free</h3>
                    <p>Track your nutrition without any subscription fees or limits. Our tool is free for everyone looking to maintain a healthy lifestyle.</p>
                </div>
            </div>
        </div>
        <div className="space-y-6">
            <h2 className="text-2xl font-bold font-headline">Frequently Asked Questions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-xl border border-border bg-card">
                    <h4 className="font-bold mb-2">How accurate is the calorie count?</h4>
                    <p className="text-muted-foreground text-sm">While we use high-quality nutritional data, counts are estimates. Actual values may vary based on specific brands, ripeness, or preparation methods.</p>
                </div>
                <div className="p-6 rounded-xl border border-border bg-card">
                    <h4 className="font-bold mb-2">Can I calculate custom recipes?</h4>
                    <p className="text-muted-foreground text-sm">You can calculate each ingredient separately and sum them up to get a total nutritional profile for your custom recipes.</p>
                </div>
                <div className="p-6 rounded-xl border border-border bg-card">
                    <h4 className="font-bold mb-2">Are the units adjustable?</h4>
                    <p className="text-muted-foreground text-sm">Yes, we support various units like grams, cups, pieces, and more, depending on the specific food item selected.</p>
                </div>
                <div className="p-6 rounded-xl border border-border bg-card">
                    <h4 className="font-bold mb-2">Is my data saved?</h4>
                    <p className="text-muted-foreground text-sm">No, we do not store your food logs. Your calculations are private and happen entirely within your current session.</p>
                </div>
            </div>
        </div>
    </section>
    </>
  );
}
