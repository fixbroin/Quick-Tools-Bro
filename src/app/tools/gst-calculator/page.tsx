'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Landmark, Percent } from 'lucide-react';

const GST_SLABS = [5, 12, 18, 28];

export default function GSTCalculatorPage() {
  const [amount, setAmount] = useState<number>(1000);
  const [gstRate, setGstRate] = useState<number>(18);
  const [isCustomGst, setIsCustomGst] = useState<boolean>(false);
  const [customRate, setCustomRate] = useState<number>(15);
  const [mode, setMode] = useState<'exclusive' | 'inclusive'>('exclusive');

  const calculateGST = () => {
    const activeRate = isCustomGst ? customRate : gstRate;
    const amt = amount || 0;

    let baseAmount = amt;
    let gstAmount = 0;
    let totalAmount = amt;

    if (mode === 'exclusive') {
      // Exclusive: GST is added on top of amount
      gstAmount = amt * (activeRate / 100);
      totalAmount = amt + gstAmount;
    } else {
      // Inclusive: GST is already included in amount
      baseAmount = amt / (1 + activeRate / 100);
      gstAmount = amt - baseAmount;
    }

    return {
      baseAmount: Math.round(baseAmount * 100) / 100,
      gstAmount: Math.round(gstAmount * 100) / 100,
      cgst: Math.round((gstAmount / 2) * 100) / 100, // Central GST is half
      sgst: Math.round((gstAmount / 2) * 100) / 100, // State GST is half
      totalAmount: Math.round(totalAmount * 100) / 100,
      rate: activeRate
    };
  };

  const { baseAmount, gstAmount, cgst, sgst, totalAmount, rate } = calculateGST();

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(val);
  };

  return (<>
      <div className="space-y-8 pb-20 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-6">
          <Card className="shadow-lg border-primary/10">
            <CardHeader className="bg-primary/5 border-b">
              <CardTitle className="flex items-center gap-2 italic font-black text-2xl">
                <Percent className="h-6 w-6 text-primary" /> GST TAX CALCULATOR
              </CardTitle>
              <CardDescription>Add or remove Goods & Services Tax (GST) easily and view standard Indian tax splits.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="amount" className="text-xs font-bold uppercase tracking-wider">Amount / Principal (₹)</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={amount === 0 ? '' : amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider block">GST Calculation Mode</Label>
                  <RadioGroup value={mode} onValueChange={(val: any) => setMode(val)} className="flex gap-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="exclusive" id="exclusive" />
                      <Label htmlFor="exclusive" className="cursor-pointer">GST Exclusive (Add Tax)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="inclusive" id="inclusive" />
                      <Label htmlFor="inclusive" className="cursor-pointer">GST Inclusive (Remove Tax)</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider block">GST Slabs / Rates (%)</Label>
                  <div className="grid grid-cols-5 gap-2">
                    {GST_SLABS.map((slab) => (
                      <Button
                        key={slab}
                        type="button"
                        variant={!isCustomGst && gstRate === slab ? 'default' : 'outline'}
                        onClick={() => { setGstRate(slab); setIsCustomGst(false); }}
                        className="rounded-xl font-bold"
                      >
                        {slab}%
                      </Button>
                    ))}
                    <Button
                      type="button"
                      variant={isCustomGst ? 'default' : 'outline'}
                      onClick={() => setIsCustomGst(true)}
                      className="rounded-xl font-bold"
                    >
                      Custom
                    </Button>
                  </div>
                </div>

                {isCustomGst && (
                  <div className="space-y-2">
                    <Label htmlFor="custom-gst" className="text-xs font-bold uppercase tracking-wider">Custom GST Rate (%)</Label>
                    <Input
                      id="custom-gst"
                      type="number"
                      value={customRate === 0 ? '' : customRate}
                      placeholder="0"
                      onChange={(e) => setCustomRate(Number(e.target.value))}
                      className="rounded-xl"
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-5 space-y-6">
          <Card className="shadow-lg border-primary/10 flex flex-col h-full">
            <CardHeader className="bg-muted/50 border-b">
              <CardTitle className="text-sm uppercase tracking-widest text-center text-muted-foreground">GST Split Report</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-6 space-y-6">
              <div className="space-y-4 bg-muted/20 p-5 border rounded-2xl">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Net Base Amount:</span>
                  <span className="font-bold">{formatCurrency(baseAmount)}</span>
                </div>
                
                <div className="border-t pt-3 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">CGST ({(rate / 2).toFixed(1)}%):</span>
                    <span className="font-semibold">{formatCurrency(cgst)}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">SGST ({(rate / 2).toFixed(1)}%):</span>
                    <span className="font-semibold">{formatCurrency(sgst)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-primary">
                    <span>Total GST Amount ({rate}%):</span>
                    <span>{formatCurrency(gstAmount)}</span>
                  </div>
                </div>

                <div className="flex justify-between text-lg border-t pt-3 mt-2 font-black italic text-primary uppercase">
                  <span>Gross Total:</span>
                  <span>{formatCurrency(totalAmount)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
      
      <section className="mt-12 space-y-8 prose prose-slate dark:prose-invert max-w-none">
        <div className="bg-primary/5 rounded-2xl p-6 md:p-10 border border-primary/10">
            <h2 className="text-3xl font-bold font-headline mb-6">Why Use Our GST Calculator?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm leading-relaxed">
                <div className="space-y-4">
                    <p>
                        <strong className="text-primary font-bold">Free & Secure:</strong> Our GST Calculator is 100% free and runs completely in your web browser. No registration, signup, or installation is required.
                    </p>
                    <p>
                        Calculate inclusive/exclusive GST tax amounts.
                    </p>
                </div>
                <div className="space-y-4">
                    <p>
                        <strong className="text-primary font-bold">Step-by-Step Guide:</strong>
                    </p>
                    <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                        <li>Open the GST Calculator tool on UseBro.</li>
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
                    <h4 className="font-bold mb-2 text-base">Is the GST Calculator tool free to use?</h4>
                    <p className="text-muted-foreground text-sm">Yes! All tools on UseBro are 100% free with no monthly subscription limits, hidden fees, or signup forms.</p>
                </div>
                <div className="p-6 rounded-xl border border-border/50 bg-card hover:border-primary/50 transition-colors">
                    <h4 className="font-bold mb-2 text-base">Does this GST Calculator upload my files to a server?</h4>
                    <p className="text-muted-foreground text-sm">No. To guarantee security and privacy, all processing is performed locally inside your web browser. Your private files never leave your device.</p>
                </div>
                <div className="p-6 rounded-xl border border-border/50 bg-card hover:border-primary/50 transition-colors">
                    <h4 className="font-bold mb-2 text-base">Can I use GST Calculator on my mobile device?</h4>
                    <p className="text-muted-foreground text-sm">Yes! UseBro is fully mobile-friendly and responsive, running smoothly on Android, iPhone, iPad, and desktop browsers.</p>
                </div>
            </div>
        </div>
      </section>
    </>);
}
