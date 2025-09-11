
'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { BmiCategoryChart } from '@/components/BmiCategoryChart';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const formSchema = z.object({
  heightUnit: z.enum(['cm', 'ft']),
  weightUnit: z.enum(['kg', 'lbs']),
  height: z.string().optional(),
  heightFt: z.string().optional(),
  heightIn: z.string().optional(),
  weight: z.string().min(1, { message: "Weight is required." }),
}).refine(data => {
    if (data.heightUnit === 'cm') {
        const heightVal = parseFloat(data.height || '0');
        return heightVal > 0;
    }
    const heightFtVal = parseFloat(data.heightFt || '0');
    const heightInVal = parseFloat(data.heightIn || '0');
    return heightFtVal > 0 || heightInVal > 0;
}, {
    message: "Height is required.",
    path: ["height"],
}).refine(data => {
    const weightVal = parseFloat(data.weight);
    return weightVal > 0;
}, {
    message: "Weight must be positive.",
    path: ["weight"],
});

type FormValues = z.infer<typeof formSchema>;

const underweightMessages = [
  "A bit light! Time to make friends with pasta and potatoes.",
  "Your BMI says: more fries, fewer sorries!",
  "Eat like nobody’s watching… because your BMI surely is.",
  "Underweight? Don’t worry—this is the only time gaining is winning!",
];

const normalMessages = [
  "Your BMI is spot on. Keep rocking that healthy vibe!",
  "Fit and fabulous! Whatever you're doing—don’t stop.",
  "Perfect balance! You’re what BMI dreams are made of.",
  "You're in the green zone! High five!",
];

const overweightMessages = [
  "A little extra to love! Time to run like your Wi-Fi password depends on it.",
  "Your BMI just said: 'Get on a treadmill... gently.'",
  "Maybe skip that third donut next time? Just a thought!",
  "Overweight? Stretch today, snack less tomorrow.",
];

const obeseMessages = [
  "Your BMI is on fire (not in a good way). Time to walk, not waddle!",
  "Your BMI called. It said: 'Block pizza for now.'",
  "Obese zone! It’s crunch time—literally!",
  "Let’s work on it—slow and steady wins the race.",
];

const morbidlyObeseMessages = [
    "It's a tough journey, but every step counts. Let's start today!",
    "Your health is your greatest wealth. Time to invest in it.",
    "Small changes lead to big results. You can do this!",
];


export default function BmiCalculatorPage() {
  const [bmi, setBmi] = useState<number | null>(null);
  const [bmiCategory, setBmiCategory] = useState<string | null>(null);
  const [advice, setAdvice] = useState<string | null>(null);
  const [funnyAdvice, setFunnyAdvice] = useState<string | null>(null);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      heightUnit: 'cm',
      weightUnit: 'kg',
      height: '',
      heightFt: '',
      heightIn: '',
      weight: '',
    },
  });

  const heightUnit = form.watch('heightUnit');
  const weightUnit = form.watch('weightUnit');
  
  const calculateBmi = (data: FormValues) => {
    let heightInMeters: number;
    let weightInKg: number;
    
    const w = parseFloat(data.weight);
    weightInKg = data.weightUnit === 'kg' ? w : w * 0.453592;

    if (data.heightUnit === 'cm') {
      const h = parseFloat(data.height!);
      heightInMeters = h / 100;
    } else {
      const hFt = parseFloat(data.heightFt || '0');
      const hIn = parseFloat(data.heightIn || '0');
      const totalInches = hFt * 12 + hIn;
      heightInMeters = totalInches * 0.0254;
    }

    const bmiValue = weightInKg / (heightInMeters * heightInMeters);
    setBmi(bmiValue);
    
    const minHealthyWeight = 18.5 * (heightInMeters * heightInMeters);
    const maxHealthyWeight = 24.9 * (heightInMeters * heightInMeters);

    let category = '';
    let adviceMsg = '';
    let funnyMsg = '';

    if (bmiValue < 18.5) {
      category = 'Underweight';
      const weightToGain = minHealthyWeight - weightInKg;
      adviceMsg = `You are underweight. You need to gain at least ${weightToGain.toFixed(1)} kg to reach a healthy BMI.`;
      funnyMsg = underweightMessages[Math.floor(Math.random() * underweightMessages.length)];
    } else if (bmiValue < 25) {
      category = 'Normal weight';
      adviceMsg = 'You are in a healthy weight range. Keep up the good work!';
      funnyMsg = normalMessages[Math.floor(Math.random() * normalMessages.length)];
    } else if (bmiValue < 30) {
      category = 'Overweight';
       const weightToLose = weightInKg - maxHealthyWeight;
      adviceMsg = `You are overweight. You need to lose at least ${weightToLose.toFixed(1)} kg to reach a healthy BMI.`;
      funnyMsg = overweightMessages[Math.floor(Math.random() * overweightMessages.length)];
    } else if (bmiValue < 40) {
      category = 'Obese';
      const weightToLose = weightInKg - maxHealthyWeight;
      adviceMsg = `You are obese. You should aim to lose at least ${weightToLose.toFixed(1)} kg to improve your health.`;
      funnyMsg = obeseMessages[Math.floor(Math.random() * obeseMessages.length)];
    } else {
      category = 'Morbidly Obese';
      const weightToLose = weightInKg - maxHealthyWeight;
      adviceMsg = `You are morbidly obese. It's highly recommended to consult a doctor and aim to lose at least ${weightToLose.toFixed(1)} kg.`;
      funnyMsg = morbidlyObeseMessages[Math.floor(Math.random() * morbidlyObeseMessages.length)];
    }
    
    setBmiCategory(category);
    setAdvice(adviceMsg);
    setFunnyAdvice(funnyMsg);
  };

  const getBmiColor = () => {
      if (!bmi) return 'text-gray-500';
      if (bmi < 18.5) return 'text-blue-500';
      if (bmi < 25) return 'text-green-500';
      if (bmi < 30) return 'text-yellow-500';
      if (bmi < 40) return 'text-orange-500';
      return 'text-red-500';
  }

  return (
    <>
    <Card>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(calculateBmi)}>
          <CardHeader>
            <CardTitle className="font-headline">BMI Calculator</CardTitle>
            <CardDescription>Calculate your Body Mass Index.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="heightUnit"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>Height</FormLabel>
                      <FormControl>
                        <RadioGroup onValueChange={(value) => {
                          field.onChange(value);
                          form.trigger("height"); // re-validate height on unit change
                        }} defaultValue={field.value} className="flex gap-2">
                          <FormItem className="flex items-center space-x-1"><FormControl><RadioGroupItem value="cm" id="cm" /></FormControl><Label htmlFor="cm">cm</Label></FormItem>
                          <FormItem className="flex items-center space-x-1"><FormControl><RadioGroupItem value="ft" id="ft" /></FormControl><Label htmlFor="ft">ft/in</Label></FormItem>
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
                              <FormControl><Input type="number" placeholder="Feet" {...field} /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="heightIn"
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormControl><Input type="number" placeholder="Inches" {...field} /></FormControl>
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
            </div>
            
            <Button type="submit">Calculate BMI</Button>

            {bmi !== null && (
              <Alert className={getBmiColor().replace('text-', 'border-').replace('-500', '/50')}>
                 <AlertTitle className="text-2xl font-bold">Your BMI is {bmi.toFixed(1)}</AlertTitle>
                 <AlertDescription className={`text-lg ${getBmiColor()}`}>{bmiCategory}</AlertDescription>
                 {advice && <AlertDescription className="mt-2 text-foreground/80">{advice}</AlertDescription>}
                 {funnyAdvice && <AlertDescription className="mt-2 font-medium text-muted-foreground">"{funnyAdvice}"</AlertDescription>}
              </Alert>
            )}
          </CardContent>
        </form>
      </Form>
    </Card>
    <div className="mt-8">
        <BmiCategoryChart />
    </div>
    </>
  );
}
