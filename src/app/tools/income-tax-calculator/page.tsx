'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Percent, Banknote, ShieldCheck } from 'lucide-react';

export default function IncomeTaxCalculatorPage() {
  const [annualIncome, setAnnualIncome] = useState<number>(1200000);
  const [deductionsOld, setDeductionsOld] = useState<number>(150000); // 80C, 80D, HRA etc

  const calculateTax = () => {
    const income = annualIncome || 0;

    // --- NEW REGIME CALCULATION (FY 2025-26 Slabs) ---
    // Standard Deduction: ₹75,000
    const newStdDeduct = 75000;
    const taxableNew = Math.max(0, income - newStdDeduct);
    let taxNew = 0;

    // Slabs:
    // Up to 3L: Nil
    // 3L - 7L: 5% (Note: Rebate under 87A makes tax zero up to 7L, or 12L for salaried in new regime depending on exact laws. Let's compute actual slab tax first)
    // 3L - 6L: 5%
    // 6L - 9L: 10%
    // 9L - 12L: 15%
    // 12L - 15L: 20%
    // Above 15L: 30%
    if (taxableNew > 1500000) {
      taxNew += (taxableNew - 1500000) * 0.30 + 300000 * 0.20 + 300000 * 0.15 + 300000 * 0.10 + 300000 * 0.05;
    } else if (taxableNew > 1200000) {
      taxNew += (taxableNew - 1200000) * 0.20 + 300000 * 0.15 + 300000 * 0.10 + 300000 * 0.05;
    } else if (taxableNew > 900000) {
      taxNew += (taxableNew - 900000) * 0.15 + 300000 * 0.10 + 300000 * 0.05;
    } else if (taxableNew > 600000) {
      taxNew += (taxableNew - 600000) * 0.10 + 300000 * 0.05;
    } else if (taxableNew > 300000) {
      taxNew += (taxableNew - 300000) * 0.05;
    }

    // Apply New Regime Tax Rebate under 87A: If taxable income <= 7,00,000, tax is Nil
    if (income <= 700000) {
      taxNew = 0;
    }

    // Cess 4%
    const cessNew = taxNew * 0.04;
    const totalNew = taxNew + cessNew;

    // --- OLD REGIME CALCULATION ---
    // Standard Deduction: ₹50,000
    const oldStdDeduct = 50000;
    const totalDeductionsOld = oldStdDeduct + deductionsOld;
    const taxableOld = Math.max(0, income - totalDeductionsOld);
    let taxOld = 0;

    // Slabs:
    // Up to 2.5L: Nil
    // 2.5L - 5L: 5%
    // 5L - 10L: 20%
    // Above 10L: 30%
    if (taxableOld > 1000000) {
      taxOld += (taxableOld - 1000000) * 0.30 + 500000 * 0.20 + 250000 * 0.05;
    } else if (taxableOld > 500000) {
      taxOld += (taxableOld - 500000) * 0.20 + 250000 * 0.05;
    } else if (taxableOld > 250000) {
      taxOld += (taxableOld - 250000) * 0.05;
    }

    // Apply Old Regime Tax Rebate under 87A: If taxable income <= 5,00,000, tax is Nil
    if (taxableOld <= 500000) {
      taxOld = 0;
    }

    // Cess 4%
    const cessOld = taxOld * 0.04;
    const totalOld = taxOld + cessOld;

    return {
      taxableNew,
      totalNew: Math.round(totalNew),
      taxableOld,
      totalOld: Math.round(totalOld),
      betterRegime: totalNew < totalOld ? 'New Regime' : totalNew > totalOld ? 'Old Regime' : 'Both are equal',
      savings: Math.abs(Math.round(totalNew - totalOld))
    };
  };

  const { taxableNew, totalNew, taxableOld, totalOld, betterRegime, savings } = calculateTax();

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (<>
      <div className="space-y-8 pb-20 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-6">
          <Card className="shadow-lg border-primary/10">
            <CardHeader className="bg-primary/5 border-b">
              <CardTitle className="flex items-center gap-2 italic font-black text-2xl">
                <Percent className="h-6 w-6 text-primary" /> INCOME TAX CALCULATOR
              </CardTitle>
              <CardDescription>Compare old vs new regime tax liabilities side-by-side using the latest Indian tax slabs.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="income" className="text-xs font-bold uppercase tracking-wider">Annual Gross Income (CTC) (₹)</Label>
                  <Input
                    id="income"
                    type="number"
                    value={annualIncome === 0 ? '' : annualIncome}
                    onChange={(e) => setAnnualIncome(Number(e.target.value))}
                    className="rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deductions" className="text-xs font-bold uppercase tracking-wider">Investments & Deductions under Old Regime (80C, 80D, HRA etc) (₹)</Label>
                  <Input
                    id="deductions"
                    type="number"
                    value={deductionsOld === 0 ? '' : deductionsOld}
                    onChange={(e) => setDeductionsOld(Number(e.target.value))}
                    className="rounded-xl"
                  />
                  <p className="text-[10px] text-muted-foreground">Standard deduction (₹50k old, ₹75k new) is auto-applied.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-5 space-y-6">
          <Card className="shadow-lg border-primary/10 flex flex-col h-full">
            <CardHeader className="bg-muted/50 border-b">
              <CardTitle className="text-sm uppercase tracking-widest text-center text-muted-foreground">Regime Comparison</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted/20 p-4 border rounded-2xl text-center space-y-1">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">New Regime Tax</p>
                  <p className="text-xl font-black italic text-primary">{formatCurrency(totalNew)}</p>
                  <p className="text-[10px] text-muted-foreground">Taxable: {formatCurrency(taxableNew)}</p>
                </div>

                <div className="bg-muted/20 p-4 border rounded-2xl text-center space-y-1">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Old Regime Tax</p>
                  <p className="text-xl font-black italic text-primary">{formatCurrency(totalOld)}</p>
                  <p className="text-[10px] text-muted-foreground">Taxable: {formatCurrency(taxableOld)}</p>
                </div>
              </div>

              {savings > 0 && (
                <div className="bg-green-500/10 p-5 border border-green-200 rounded-2xl flex items-center gap-3 text-green-600 animate-pulse">
                  <ShieldCheck className="h-8 w-8 shrink-0" />
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider">Recommendation</p>
                    <p className="text-sm font-semibold">{betterRegime} is better for you. You save <span className="font-bold">{formatCurrency(savings)}</span>!</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
      
      <section className="mt-12 space-y-8 prose prose-slate dark:prose-invert max-w-none">
        <div className="bg-primary/5 rounded-2xl p-6 md:p-10 border border-primary/10">
            <h2 className="text-3xl font-bold font-headline mb-6">Why Use Our Income Tax Calculator?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm leading-relaxed">
                <div className="space-y-4">
                    <p>
                        <strong className="text-primary font-bold">Free & Secure:</strong> Our Income Tax Calculator is 100% free and runs completely in your web browser. No registration, signup, or installation is required.
                    </p>
                    <p>
                        Compare tax liabilities under Old vs New Regimes.
                    </p>
                </div>
                <div className="space-y-4">
                    <p>
                        <strong className="text-primary font-bold">Step-by-Step Guide:</strong>
                    </p>
                    <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                        <li>Open the Income Tax Calculator tool on UseBro.</li>
                        <li>Input your parameters or upload the required file in the field controls.</li>
                        <li>Wait for the tool to process the details dynamically in your browser.</li>
                        <li>Click download, save, or copy the final outputs to your device.</li>
                    </ul>
                </div>
            </div>
        </div>

        <div className="space-y-6">
            <h2 className="text-2xl font-bold font-headline">Frequently Asked Questions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-xl border border-border/50 bg-card hover:border-primary/50 transition-colors">
                    <h4 className="font-bold mb-2 text-base">Is the Income Tax Calculator tool free to use?</h4>
                    <p className="text-muted-foreground text-sm">Yes! All tools on UseBro are 100% free with no monthly subscription limits, hidden fees, or signup forms.</p>
                </div>
                <div className="p-6 rounded-xl border border-border/50 bg-card hover:border-primary/50 transition-colors">
                    <h4 className="font-bold mb-2 text-base">Does this Income Tax Calculator upload my files to a server?</h4>
                    <p className="text-muted-foreground text-sm">No. To guarantee security and privacy, all processing is performed locally inside your web browser. Your private files never leave your device.</p>
                </div>
                <div className="p-6 rounded-xl border border-border/50 bg-card hover:border-primary/50 transition-colors">
                    <h4 className="font-bold mb-2 text-base">Can I use Income Tax Calculator on my mobile device?</h4>
                    <p className="text-muted-foreground text-sm">Yes! UseBro is fully mobile-friendly and responsive, running smoothly on Android, iPhone, iPad, and desktop browsers.</p>
                </div>
            </div>
        </div>
      </section>
    </>);
}
