
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
import { scrollToDownload } from '@/lib/utils';

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
    scrollToDownload();
  };

  return (
    <>
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
              <Alert id="download-section">
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

      <section className="mt-12 space-y-8 prose prose-slate dark:prose-invert max-w-none border-t pt-12">
        <div className="bg-primary/5 rounded-2xl p-6 md:p-10 border border-primary/10">
          <h2 className="text-3xl font-bold font-headline mb-6">Why Use Our Loan EMI Calculator?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm leading-relaxed">
            <div>
              <h3 className="text-lg font-semibold mb-2">Accurate Calculations</h3>
              <p>Get precise EMI figures instantly based on your loan amount, interest rate, and tenure. Our calculator uses standard financial formulas to ensure accuracy.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Financial Planning</h3>
              <p>Plan your budget effectively by knowing exactly how much you'll need to pay each month. Avoid surprises and stay on top of your monthly expenses.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Compare Loans</h3>
              <p>Easily compare different loan options by adjusting the parameters. See how a change in interest rate or tenure affects your monthly commitment.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Visual Breakdown</h3>
              <p>Get a clear breakdown of your total interest and the total amount you will pay over the life of the loan. Understanding these costs is crucial for smart borrowing.</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-bold font-headline">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">What is an EMI?</h3>
              <p>EMI stands for Equated Monthly Installment. It is a fixed amount of money that you pay to the lender at a specific date each calendar month until the loan is fully paid off.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">How is loan EMI calculated?</h3>
              <p>The EMI is calculated using the formula: [P x R x (1+R)^N] / [(1+R)^N-1], where P is the principal amount, R is the monthly interest rate, and N is the loan tenure in months.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Does the EMI change during the loan tenure?</h3>
              <p>For fixed-rate loans, the EMI stays the same. However, for floating-rate loans, the EMI can change if the benchmark interest rate fluctuates during the tenure.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Can I use this for any type of loan?</h3>
              <p>Yes, this versatile calculator can be used for various types of loans, including personal loans, home loans, car loans, and education loans, provided they have a fixed repayment schedule.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
