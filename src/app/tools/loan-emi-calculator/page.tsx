
'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useState } from 'react';

const formSchema = z.object({
  amount: z.string().min(1, 'Loan amount is required.').refine(val => !isNaN(parseFloat(val)) && parseFloat(val) > 0, 'Must be a positive number.'),
  rate: z.string().min(1, 'Interest rate is required.').refine(val => !isNaN(parseFloat(val)) && parseFloat(val) >= 0, 'Must be a non-negative number.'),
  tenure: z.string().min(1, 'Loan tenure is required.').refine(val => !isNaN(parseFloat(val)) && parseFloat(val) > 0, 'Must be a positive number.'),
});

type FormValues = z.infer<typeof formSchema>;

export default function LoanEmiCalculatorPage() {
  const [emi, setEmi] = useState<number | null>(null);
  const [totalInterest, setTotalInterest] = useState<number | null>(null);
  const [totalPayment, setTotalPayment] = useState<number | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: '1000000',
      rate: '8.5',
      tenure: '20',
    },
  });

  const calculateEmi = (data: FormValues) => {
    const p = parseFloat(data.amount);
    const r = parseFloat(data.rate) / 100 / 12;
    const n = parseFloat(data.tenure) * 12;

    if (isNaN(p) || isNaN(r) || isNaN(n) || p <= 0 || n <= 0) {
      setEmi(null);
      return;
    }

    if (r === 0) {
        const emiValue = p / n;
        setEmi(emiValue);
        setTotalInterest(0);
        setTotalPayment(p);
        return;
    }

    const emiValue = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPaymentValue = emiValue * n;
    const totalInterestValue = totalPaymentValue - p;

    setEmi(emiValue);
    setTotalInterest(totalInterestValue);
    setTotalPayment(totalPaymentValue);
  };

  return (
    <Card>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(calculateEmi)}>
          <CardHeader>
            <CardTitle className="font-headline">Loan EMI Calculator</CardTitle>
            <CardDescription>Calculate your Equated Monthly Installment for a loan.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Loan Amount (₹)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 1000000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="rate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Annual Interest Rate (%)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 8.5" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tenure"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Loan Tenure (Years)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 20" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit">Calculate EMI</Button>
          </CardContent>
        </form>
      </Form>
      {emi !== null && totalInterest !== null && totalPayment !== null && (
        <CardFooter>
          <div className="w-full">
            <Alert>
              <AlertTitle className="text-xl font-bold font-headline">Your Loan EMI Details</AlertTitle>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                  <div>
                      <p className="text-sm text-muted-foreground">Monthly EMI</p>
                      <p className="text-2xl font-semibold text-primary">₹ {emi.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
                  </div>
                   <div>
                      <p className="text-sm text-muted-foreground">Total Interest</p>
                      <p className="text-2xl font-semibold">₹ {totalInterest.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
                  </div>
                   <div>
                      <p className="text-sm text-muted-foreground">Total Payment</p>
                      <p className="text-2xl font-semibold">₹ {totalPayment.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
                  </div>
              </div>
            </Alert>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
