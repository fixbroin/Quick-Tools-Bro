
'use client';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const formSchema = z.object({
  weight: z.string().min(1, 'Weight is required.').refine(val => !isNaN(parseFloat(val)) && parseFloat(val) > 0, 'Must be a positive number.'),
  purity: z.string(),
  ltv: z.string().min(1, 'LTV is required.').refine(val => !isNaN(parseFloat(val)) && parseFloat(val) > 0 && parseFloat(val) <= 100, 'Must be between 1-100.'),
  goldPrice24k: z.string().min(1, 'Gold price is required.').refine(val => !isNaN(parseFloat(val)) && parseFloat(val) > 0, 'Must be a positive number.'),
});

type FormValues = z.infer<typeof formSchema>;

export default function GoldLoanCalculatorPage() {
  const [eligibleLoan, setEligibleLoan] = useState<number | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      weight: '10',
      purity: '22',
      ltv: '75',
      goldPrice24k: '6650',
    },
  });
  
  const calculateLoan = (data: FormValues) => {
    const weightVal = parseFloat(data.weight);
    const purityVal = parseInt(data.purity);
    const ltvVal = parseInt(data.ltv);
    const priceVal = parseFloat(data.goldPrice24k);

    if (isNaN(weightVal) || isNaN(purityVal) || isNaN(ltvVal) || isNaN(priceVal) || weightVal <= 0 || priceVal <= 0) {
      setEligibleLoan(null);
      return;
    }

    let currentGoldPrice = priceVal;
    if (purityVal === 22) {
      currentGoldPrice = priceVal * (22 / 24);
    } else if (purityVal < 22) {
      currentGoldPrice = priceVal * (purityVal / 24);
    }
    
    const totalGoldValue = weightVal * currentGoldPrice;
    const maxLoanAmount = totalGoldValue * (ltvVal / 100);
    setEligibleLoan(maxLoanAmount);
  };

  useEffect(() => {
      form.handleSubmit(calculateLoan)();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Card>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(calculateLoan)}>
                <CardHeader>
                    <CardTitle className="font-headline">Gold Loan Calculator</CardTitle>
                    <CardDescription>Estimate the maximum loan amount you can get against your gold.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="weight"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Gold Weight (grams)</FormLabel>
                                <FormControl><Input type="number" placeholder="e.g., 50" {...field} /></FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name="purity"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Purity (Karats)</FormLabel>
                                 <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="24">24K (99.9% pure)</SelectItem>
                                        <SelectItem value="22">22K (91.6% pure)</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name="ltv"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Loan-to-Value (LTV %)</FormLabel>
                                <FormControl><Input type="number" placeholder="e.g., 75" {...field} /></FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="goldPrice24k"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Current Gold Price (₹ per gram, 24K)</FormLabel>
                                <FormControl><Input type="number" placeholder="e.g., 6650" {...field} /></FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    </div>
                    <Button type="submit">
                    Calculate Loan Amount
                    </Button>
                </CardContent>
            </form>
        </Form>
      {eligibleLoan !== null && (
        <CardFooter>
            <Alert>
                <AlertTitle className="text-2xl font-bold font-headline">Eligible Loan Amount</AlertTitle>
                <AlertDescription className="text-3xl text-primary font-bold mt-2">
                    ₹ {eligibleLoan.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </AlertDescription>
                 <AlertDescription className="text-sm text-muted-foreground mt-2">
                    This is an estimate. The actual amount may vary based on the lender's policies.
                </AlertDescription>
            </Alert>
        </CardFooter>
      )}
    </Card>
  );
}
