
'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { HealthyWeightChart } from '@/components/HealthyWeightChart';
import { useToast } from '@/hooks/use-toast';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const formSchema = z.object({
  age: z.string().min(1, { message: "Age is required." }),
  gender: z.enum(['male', 'female']),
  heightUnit: z.enum(['cm', 'ft']),
  height: z.string().optional(),
  heightFt: z.string().optional(),
  heightIn: z.string().optional(),
  weightUnit: z.enum(['kg', 'lbs']),
  weight: z.string().min(1, { message: "Weight is required." }),
  activityLevel: z.string(),
}).refine(data => {
    if (data.heightUnit === 'cm') {
        return !!data.height && !isNaN(parseFloat(data.height));
    }
    return (!!data.heightFt || !!data.heightIn) && (!data.heightFt || !isNaN(parseFloat(data.heightFt))) && (!data.heightIn || !isNaN(parseFloat(data.heightIn)));
}, {
    message: "Height is required.",
    path: ["height"],
});


type FormValues = z.infer<typeof formSchema>;

export default function CalorieCalculatorPage() {
  const [calories, setCalories] = useState<{ maintain: number; lose: number; gain: number } | null>(null);
  const [idealWeight, setIdealWeight] = useState<{ min: number; max: number; minLbs: number; maxLbs: number; } | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      age: '',
      gender: 'male',
      heightUnit: 'cm',
      height: '',
      heightFt: '',
      heightIn: '',
      weightUnit: 'kg',
      weight: '',
      activityLevel: 'sedentary',
    },
  });

  const heightUnit = form.watch('heightUnit');
  const weightUnit = form.watch('weightUnit');

  const calculateCalories = (data: FormValues) => {
    const ageVal = parseInt(data.age);
    let heightValCm: number;
    let weightValKg: number;

    if (data.heightUnit === 'cm') {
        heightValCm = parseFloat(data.height!);
    } else {
        const ft = parseFloat(data.heightFt!) || 0;
        const inches = parseFloat(data.heightIn!) || 0;
        heightValCm = (ft * 12 + inches) * 2.54;
    }

    if (data.weightUnit === 'kg') {
        weightValKg = parseFloat(data.weight);
    } else {
        weightValKg = parseFloat(data.weight) * 0.453592;
    }

    if (isNaN(ageVal) || isNaN(heightValCm) || isNaN(weightValKg) || ageVal <= 0 || heightValCm <= 0 || weightValKg <= 0) {
        setCalories(null);
        setIdealWeight(null);
        toast({
            title: 'Invalid Input',
            description: 'Please enter valid positive numbers for all fields.',
            variant: 'destructive',
        });
        return;
    }

    let bmr: number;
    if (data.gender === 'male') {
      bmr = 10 * weightValKg + 6.25 * heightValCm - 5 * ageVal + 5;
    } else {
      bmr = 10 * weightValKg + 6.25 * heightValCm - 5 * ageVal - 161;
    }

    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      veryActive: 1.9,
    };

    const maintenanceCalories = bmr * activityMultipliers[data.activityLevel as keyof typeof activityMultipliers];

    setCalories({
      maintain: Math.round(maintenanceCalories),
      lose: Math.round(maintenanceCalories - 500),
      gain: Math.round(maintenanceCalories + 500),
    });
    
    // Calculate Ideal Weight
    const heightInMeters = heightValCm / 100;
    const minBmi = 18.5;
    const maxBmi = 24.9;
    
    const minWeightKg = minBmi * Math.pow(heightInMeters, 2);
    const maxWeightKg = maxBmi * Math.pow(heightInMeters, 2);
    
    const minWeightLbs = minWeightKg * 2.20462;
    const maxWeightLbs = maxWeightKg * 2.20462;

    setIdealWeight({
        min: minWeightKg,
        max: maxWeightKg,
        minLbs: minWeightLbs,
        maxLbs: maxWeightLbs,
    });
  };

  return (
    <>
      <Card>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(calculateCalories)}>
            <CardHeader>
              <CardTitle className="font-headline">Calorie Calculator</CardTitle>
              <CardDescription>Estimate your daily calorie needs based on your activity level.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="age"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Age</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 25" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <FormControl>
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4 pt-2">
                          <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="male" id="male" /></FormControl><Label htmlFor="male">Male</Label></FormItem>
                          <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="female" id="female" /></FormControl><Label htmlFor="female">Female</Label></FormItem>
                        </RadioGroup>
                      </FormControl>
                       <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="heightUnit"
                  render={({ field }) => (
                    <FormItem>
                        <div className="flex items-center justify-between">
                            <FormLabel>Height</FormLabel>
                            <FormControl>
                                <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-2">
                                  <FormItem className="flex items-center space-x-1"><FormControl><RadioGroupItem value="cm" id="cm"/></FormControl><Label htmlFor="cm">cm</Label></FormItem>
                                  <FormItem className="flex items-center space-x-1"><FormControl><RadioGroupItem value="ft" id="ft"/></FormControl><Label htmlFor="ft">ft/in</Label></FormItem>
                                </RadioGroup>
                            </FormControl>
                        </div>
                         {heightUnit === 'cm' ? (
                            <FormField
                                control={form.control}
                                name="height"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input type="number" placeholder="e.g., 175" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        ) : (
                          <div className="flex gap-2">
                            <FormField
                                control={form.control}
                                name="heightFt"
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                        <FormControl>
                                            <Input type="number" placeholder="Feet" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="heightIn"
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                        <FormControl>
                                            <Input type="number" placeholder="Inches" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                          </div>
                        )}
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="weightUnit"
                  render={({ field }) => (
                     <FormItem>
                        <div className="flex items-center justify-between">
                           <FormLabel>Weight</FormLabel>
                           <FormControl>
                                <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-2">
                                    <FormItem className="flex items-center space-x-1"><FormControl><RadioGroupItem value="kg" id="kg"/></FormControl><Label htmlFor="kg">kg</Label></FormItem>
                                    <FormItem className="flex items-center space-x-1"><FormControl><RadioGroupItem value="lbs" id="lbs"/></FormControl><Label htmlFor="lbs">lbs</Label></FormItem>
                                </RadioGroup>
                           </FormControl>
                        </div>
                        <FormField
                            control={form.control}
                            name="weight"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input id="weight" type="number" placeholder={weightUnit === 'kg' ? "e.g., 70" : "e.g., 154"} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                     </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="activityLevel"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Activity Level</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your activity level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent position="item-aligned">
                          <SelectItem value="sedentary">Sedentary (little or no exercise)</SelectItem>
                          <SelectItem value="light">Lightly active (light exercise/sports 1-3 days/week)</SelectItem>
                          <SelectItem value="moderate">Moderately active (moderate exercise/sports 3-5 days/week)</SelectItem>
                          <SelectItem value="active">Very active (hard exercise/sports 6-7 days a week)</SelectItem>
                          <SelectItem value="veryActive">Super active (very hard exercise/sports & physical job)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit">Calculate Calories</Button>
            </CardContent>
          </form>
        </Form>
        {calories && (
          <CardFooter className="flex-col gap-4 items-start">
              <Alert>
                  <AlertTitle>Your Estimated Daily Calorie Needs</AlertTitle>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 text-center">
                      <div className="p-4 rounded-lg bg-red-100/60 dark:bg-red-900/30">
                          <p className="font-bold text-lg">Lose Weight</p>
                          <p className="text-2xl font-headline text-red-600 dark:text-red-400">{calories.lose.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">calories/day</p>
                      </div>
                      <div className="p-4 rounded-lg bg-green-100/60 dark:bg-green-900/30">
                          <p className="font-bold text-lg">Maintain Weight</p>
                          <p className="text-2xl font-headline text-green-600 dark:text-green-400">{calories.maintain.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">calories/day</p>
                      </div>
                      <div className="p-4 rounded-lg bg-blue-100/60 dark:bg-blue-900/30">
                          <p className="font-bold text-lg">Gain Weight</p>
                          <p className="text-2xl font-headline text-blue-600 dark:text-blue-400">{calories.gain.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">calories/day</p>
                      </div>
                  </div>
              </Alert>
              
              {idealWeight && (
                   <Alert>
                      <AlertTitle>Healthy Weight Range</AlertTitle>
                       <AlertDescription>
                          Based on your height, a healthy weight range is between <strong>{idealWeight.min.toFixed(1)} - {idealWeight.max.toFixed(1)} kg</strong> 
                          ({idealWeight.minLbs.toFixed(1)} - {idealWeight.maxLbs.toFixed(1)} lbs).
                       </AlertDescription>
                   </Alert>
              )}
          </CardFooter>
        )}
      </Card>
      <div className="mt-8">
        <HealthyWeightChart />
      </div>
    </>
  );
}
