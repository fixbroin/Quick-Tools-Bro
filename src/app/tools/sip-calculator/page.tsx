'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Landmark, LandmarkIcon } from 'lucide-react';

export default function SIPCalculatorPage() {
  const [monthlyInvestment, setMonthlyInvestment] = useState<number>(5000);
  const [expectedReturn, setExpectedReturn] = useState<number>(12);
  const [timePeriod, setTimePeriod] = useState<number>(10);

  // SIP formula: M = P * [ ( (1 + i)^n - 1 ) / i ] * (1 + i)
  const calculateSIP = () => {
    const P = monthlyInvestment;
    const i = expectedReturn / 12 / 100;
    const n = timePeriod * 12;

    if (i === 0) {
      const invested = P * n;
      return { invested, wealthGained: 0, total: invested };
    }

    const total = P * (((Math.pow(1 + i, n) - 1) / i) * (1 + i));
    const invested = P * n;
    const wealthGained = Math.max(0, total - invested);

    return {
      invested: Math.round(invested),
      wealthGained: Math.round(wealthGained),
      total: Math.round(total)
    };
  };

  const { invested, wealthGained, total } = calculateSIP();

  const data = [
    { name: 'Invested Amount', value: invested },
    { name: 'Est. Returns', value: wealthGained },
  ];

  const COLORS = ['#e2e8f0', '#29ABE2']; // Neutral vs primary blue

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
                <Landmark className="h-6 w-6 text-primary" /> SIP CALCULATOR
              </CardTitle>
              <CardDescription>Estimate future returns of your mutual fund systematic investment plans.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="monthly" className="text-xs font-bold uppercase tracking-wider">Monthly Investment (₹)</Label>
                    <span className="text-xs font-bold text-primary">{formatCurrency(monthlyInvestment)}</span>
                  </div>
                  <Input
                    id="monthly"
                    type="number"
                    value={monthlyInvestment}
                    onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
                    className="rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="returns" className="text-xs font-bold uppercase tracking-wider">Expected Annual Return (%)</Label>
                    <span className="text-xs font-bold text-primary">{expectedReturn}%</span>
                  </div>
                  <Input
                    id="returns"
                    type="number"
                    value={expectedReturn}
                    onChange={(e) => setExpectedReturn(Number(e.target.value))}
                    className="rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="period" className="text-xs font-bold uppercase tracking-wider">Time Period (Years)</Label>
                    <span className="text-xs font-bold text-primary">{timePeriod} Yr(s)</span>
                  </div>
                  <Input
                    id="period"
                    type="number"
                    value={timePeriod}
                    onChange={(e) => setTimePeriod(Number(e.target.value))}
                    className="rounded-xl"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-5 space-y-6">
          <Card className="shadow-lg border-primary/10 flex flex-col h-full">
            <CardHeader className="bg-muted/50 border-b">
              <CardTitle className="text-sm uppercase tracking-widest text-center text-muted-foreground">SIP Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-6 space-y-6">
              <div className="space-y-3 bg-muted/20 p-4 border rounded-2xl">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Invested Amount:</span>
                  <span className="font-bold">{formatCurrency(invested)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Est. Returns:</span>
                  <span className="font-bold text-green-600">+{formatCurrency(wealthGained)}</span>
                </div>
                <div className="flex justify-between text-md border-t pt-2 mt-2 font-black italic text-primary uppercase">
                  <span>Total Value:</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>

              <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
      
      <section className="mt-12 space-y-8 prose prose-slate dark:prose-invert max-w-none">
        <div className="bg-primary/5 rounded-2xl p-6 md:p-10 border border-primary/10">
            <h2 className="text-3xl font-bold font-headline mb-6">Why Use Our SIP Calculator?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm leading-relaxed">
                <div className="space-y-4">
                    <p>
                        <strong className="text-primary font-bold">Free & Secure:</strong> Our SIP Calculator is 100% free and runs completely in your web browser. No registration, signup, or installation is required.
                    </p>
                    <p>
                        Estimate future returns on mutual fund SIP investments.
                    </p>
                </div>
                <div className="space-y-4">
                    <p>
                        <strong className="text-primary font-bold">Step-by-Step Guide:</strong>
                    </p>
                    <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                        <li>Open the SIP Calculator tool on UseBro.</li>
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
                    <h4 className="font-bold mb-2 text-base">Is the SIP Calculator tool free to use?</h4>
                    <p className="text-muted-foreground text-sm">Yes! All tools on UseBro are 100% free with no monthly subscription limits, hidden fees, or signup forms.</p>
                </div>
                <div className="p-6 rounded-xl border border-border/50 bg-card hover:border-primary/50 transition-colors">
                    <h4 className="font-bold mb-2 text-base">Does this SIP Calculator upload my files to a server?</h4>
                    <p className="text-muted-foreground text-sm">No. To guarantee security and privacy, all processing is performed locally inside your web browser. Your private files never leave your device.</p>
                </div>
                <div className="p-6 rounded-xl border border-border/50 bg-card hover:border-primary/50 transition-colors">
                    <h4 className="font-bold mb-2 text-base">Can I use SIP Calculator on my mobile device?</h4>
                    <p className="text-muted-foreground text-sm">Yes! UseBro is fully mobile-friendly and responsive, running smoothly on Android, iPhone, iPad, and desktop browsers.</p>
                </div>
            </div>
        </div>
      </section>
    </>);
}
