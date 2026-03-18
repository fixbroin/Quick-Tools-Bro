
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
import { scrollToDownload } from '@/lib/utils';

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
    scrollToDownload();
  };

  useEffect(() => {
      form.handleSubmit(calculateLoan)();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
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
            <Alert id="download-section">
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

    <section className="mt-12 space-y-8 prose prose-slate dark:prose-invert max-w-none border-t pt-12">
        <div className="bg-primary/5 rounded-2xl p-6 md:p-10 border border-primary/10">
            <h2 className="text-3xl font-bold font-headline mb-6">Why Use Our Gold Loan Calculator?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm leading-relaxed">
                <div>
                    <h3 className="text-xl font-bold mb-3">Real-Time Estimates</h3>
                    <p>Calculate your loan eligibility based on current market gold prices and the specific purity of your gold. Our tool provides instant feedback so you can plan your finances better.</p>
                </div>
                <div>
                    <h3 className="text-xl font-bold mb-3">Customizable LTV</h3>
                    <p>Different lenders offer different Loan-to-Value (LTV) ratios. Our calculator allows you to adjust this percentage to see how it affects your maximum loan amount.</p>
                </div>
                <div>
                    <h3 className="text-xl font-bold mb-3">Purity Support</h3>
                    <p>Whether you have 22K or 24K gold, our tool correctly adjusts the valuation to give you a realistic estimate of the loan you can receive.</p>
                </div>
            </div>
        </div>
        <div className="space-y-6">
            <h2 className="text-2xl font-bold font-headline">Frequently Asked Questions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-xl border border-border bg-card">
                    <h4 className="font-bold mb-2">What is LTV in a gold loan?</h4>
                    <p className="text-muted-foreground text-sm">LTV stands for Loan-to-Value. It is the percentage of the gold's total value that a lender is willing to give as a loan. In India, RBI usually caps this at 75%.</p>
                </div>
                <div className="p-6 rounded-xl border border-border bg-card">
                    <h4 className="font-bold mb-2">How is the loan amount calculated?</h4>
                    <p className="text-muted-foreground text-sm">It's calculated as: (Gold Weight × Current Gold Price for that Purity) × LTV Percentage. Our tool automates this for you.</p>
                </div>
                <div className="p-6 rounded-xl border border-border bg-card">
                    <h4 className="font-bold mb-2">Does the gold price include GST?</h4>
                    <p className="text-muted-foreground text-sm">Usually, gold loan valuations are based on the market price of gold excluding GST. You should enter the price accordingly.</p>
                </div>
                <div className="p-6 rounded-xl border border-border bg-card">
                    <h4 className="font-bold mb-2">Are stones or gems included in weight?</h4>
                    <p className="text-muted-foreground text-sm">No, lenders only consider the weight of the actual gold. You should subtract the estimated weight of any stones before using the calculator.</p>
                </div>
            </div>
        </div>
    </section>
    </>
  );
}
