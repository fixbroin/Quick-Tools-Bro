'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Landmark, Scale, Banknote } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function SalaryCalculatorPage() {
  const [basic, setBasic] = useState<number>(30000);
  const [hra, setHra] = useState<number>(15000);
  const [allowance, setAllowance] = useState<number>(10000);
  const [pf, setPf] = useState<number>(1800);
  const [profTax, setProfTax] = useState<number>(200);
  const [otherDeduction, setOtherDeduction] = useState<number>(0);
  const [frequency, setFrequency] = useState<'monthly' | 'yearly'>('monthly');

  const calculateSalary = () => {
    // Basic math
    const gross = basic + hra + allowance;
    const deductions = pf + profTax + otherDeduction;
    const net = Math.max(0, gross - deductions);

    const factor = frequency === 'monthly' ? 12 : 1/12;
    const alternateGross = gross * (frequency === 'monthly' ? 12 : 1/12);
    const alternateNet = net * (frequency === 'monthly' ? 12 : 1/12);

    return {
      gross,
      deductions,
      net,
      altGross: Math.round(alternateGross),
      altNet: Math.round(alternateNet),
    };
  };

  const { gross, deductions, net, altGross, altNet } = calculateSalary();

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
                <Banknote className="h-6 w-6 text-primary" /> SALARY CALCULATOR
              </CardTitle>
              <CardDescription>Calculate your net take-home salary, gross income, and deductions client-side.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2 col-span-2">
                    <Label className="text-xs font-bold uppercase tracking-wider block">Input Salary Term</Label>
                    <Select value={frequency} onValueChange={(val: any) => setFrequency(val)}>
                      <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="monthly">Monthly Slabs</SelectItem>
                        <SelectItem value="yearly">Annual Slabs (CTC)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="basic" className="text-xs font-bold uppercase tracking-wider">Basic Salary (₹)</Label>
                    <Input id="basic" type="number" value={basic} onChange={(e) => setBasic(Number(e.target.value))} className="rounded-xl" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hra" className="text-xs font-bold uppercase tracking-wider">House Rent Allowance (HRA) (₹)</Label>
                    <Input id="hra" type="number" value={hra} onChange={(e) => setHra(Number(e.target.value))} className="rounded-xl" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="allowance" className="text-xs font-bold uppercase tracking-wider">Other Allowances (₹)</Label>
                    <Input id="allowance" type="number" value={allowance} onChange={(e) => setAllowance(Number(e.target.value))} className="rounded-xl" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pf" className="text-xs font-bold uppercase tracking-wider">PF Deduction / EPF (₹)</Label>
                    <Input id="pf" type="number" value={pf} onChange={(e) => setPf(Number(e.target.value))} className="rounded-xl" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="proftax" className="text-xs font-bold uppercase tracking-wider">Professional Tax (PT) (₹)</Label>
                    <Input id="proftax" type="number" value={profTax} onChange={(e) => setProfTax(Number(e.target.value))} className="rounded-xl" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="other" className="text-xs font-bold uppercase tracking-wider">Other Deductions (₹)</Label>
                    <Input id="other" type="number" value={otherDeduction} onChange={(e) => setOtherDeduction(Number(e.target.value))} className="rounded-xl" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-5 space-y-6">
          <Card className="shadow-lg border-primary/10 flex flex-col h-full">
            <CardHeader className="bg-muted/50 border-b">
              <CardTitle className="text-sm uppercase tracking-widest text-center text-muted-foreground">Salary Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-6 space-y-6">
              <div className="space-y-4 bg-muted/20 p-5 border rounded-2xl">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Gross Salary:</span>
                  <span className="font-bold">{formatCurrency(gross)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Deductions:</span>
                  <span className="font-bold text-destructive">-{formatCurrency(deductions)}</span>
                </div>
                <div className="flex justify-between text-lg border-t pt-3 mt-2 font-black italic text-primary uppercase">
                  <span>Net In-hand ({frequency}):</span>
                  <span>{formatCurrency(net)}</span>
                </div>
              </div>

              <div className="bg-primary/5 p-4 border border-primary/20 rounded-2xl text-xs space-y-2">
                <p className="font-bold text-primary uppercase tracking-wider">Projections & Equivalences</p>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{frequency === 'monthly' ? 'Annual gross:' : 'Monthly gross:'}</span>
                  <span className="font-semibold">{formatCurrency(altGross)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{frequency === 'monthly' ? 'Annual net take-home:' : 'Monthly net take-home:'}</span>
                  <span className="font-semibold text-green-600">{formatCurrency(altNet)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
      
      <section className="mt-12 space-y-8 prose prose-slate dark:prose-invert max-w-none">
        <div className="bg-primary/5 rounded-2xl p-6 md:p-10 border border-primary/10">
            <h2 className="text-3xl font-bold font-headline mb-6">Why Use Our Salary Calculator?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm leading-relaxed">
                <div className="space-y-4">
                    <p>
                        <strong className="text-primary font-bold">Free & Secure:</strong> Our Salary Calculator is 100% free and runs completely in your web browser. No registration, signup, or installation is required.
                    </p>
                    <p>
                        Estimate your gross salary, net income, and deductions.
                    </p>
                </div>
                <div className="space-y-4">
                    <p>
                        <strong className="text-primary font-bold">Step-by-Step Guide:</strong>
                    </p>
                    <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                        <li>Open the Salary Calculator tool on UseBro.</li>
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
                    <h4 className="font-bold mb-2 text-base">Is the Salary Calculator tool free to use?</h4>
                    <p className="text-muted-foreground text-sm">Yes! All tools on UseBro are 100% free with no monthly subscription limits, hidden fees, or signup forms.</p>
                </div>
                <div className="p-6 rounded-xl border border-border/50 bg-card hover:border-primary/50 transition-colors">
                    <h4 className="font-bold mb-2 text-base">Does this Salary Calculator upload my files to a server?</h4>
                    <p className="text-muted-foreground text-sm">No. To guarantee security and privacy, all processing is performed locally inside your web browser. Your private files never leave your device.</p>
                </div>
                <div className="p-6 rounded-xl border border-border/50 bg-card hover:border-primary/50 transition-colors">
                    <h4 className="font-bold mb-2 text-base">Can I use Salary Calculator on my mobile device?</h4>
                    <p className="text-muted-foreground text-sm">Yes! UseBro is fully mobile-friendly and responsive, running smoothly on Android, iPhone, iPad, and desktop browsers.</p>
                </div>
            </div>
        </div>
      </section>
    </>);
}
