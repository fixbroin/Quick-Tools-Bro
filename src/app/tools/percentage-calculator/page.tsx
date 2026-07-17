'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Percent } from 'lucide-react';

export default function PercentageCalculatorPage() {
  // Mode 1: What is X% of Y?
  const [m1X, setM1X] = useState<number>(10);
  const [m1Y, setM1Y] = useState<number>(200);

  // Mode 2: X is what % of Y?
  const [m2X, setM2X] = useState<number>(50);
  const [m2Y, setM2Y] = useState<number>(250);

  // Mode 3: % increase/decrease from X to Y?
  const [m3X, setM3X] = useState<number>(100);
  const [m3Y, setM3Y] = useState<number>(150);

  const getM1Result = () => {
    return ((m1X || 0) / 100) * (m1Y || 0);
  };

  const getM2Result = () => {
    if (!m2Y) return 0;
    return ((m2X || 0) / m2Y) * 100;
  };

  const getM3Result = () => {
    if (!m3X) return 0;
    const diff = (m3Y || 0) - m3X;
    return (diff / m3X) * 100;
  };

  return (
    <>
      <div className="space-y-8 pb-20 animate-in fade-in duration-500 max-w-2xl mx-auto">
        <Card className="shadow-lg border-primary/10">
          <CardHeader className="bg-primary/5 border-b p-4">
            <CardTitle className="flex items-center gap-2 italic font-black text-2xl">
              <Percent className="h-6 w-6 text-primary" /> PERCENTAGE CALCULATOR
            </CardTitle>
            <CardDescription>Solve various common percentage math problems in real time.</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-8">
            
            {/* Mode 1 */}
            <div className="space-y-4">
              <h3 className="font-bold text-xs uppercase tracking-wider text-primary border-b pb-1">1. Calculate Percentage Value</h3>
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <span className="text-sm font-semibold">What is</span>
                <Input type="number" value={m1X === 0 ? '' : m1X} placeholder="0" onChange={(e) => setM1X(Number(e.target.value))} className="w-20 text-center rounded-xl font-bold" />
                <span className="text-sm font-semibold">% of</span>
                <Input type="number" value={m1Y === 0 ? '' : m1Y} placeholder="0" onChange={(e) => setM1Y(Number(e.target.value))} className="w-24 text-center rounded-xl font-bold" />
                <span className="text-sm font-semibold sm:ml-auto">Result:</span>
                <div className="border px-4 py-2 bg-muted/20 font-black text-primary rounded-xl text-center min-w-[80px]">
                  {getM1Result().toFixed(2)}
                </div>
              </div>
            </div>

            {/* Mode 2 */}
            <div className="space-y-4 pt-4 border-t">
              <h3 className="font-bold text-xs uppercase tracking-wider text-primary border-b pb-1">2. Calculate Ratio Percentage</h3>
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <Input type="number" value={m2X === 0 ? '' : m2X} placeholder="0" onChange={(e) => setM2X(Number(e.target.value))} className="w-20 text-center rounded-xl font-bold" />
                <span className="text-sm font-semibold">is what percent of</span>
                <Input type="number" value={m2Y === 0 ? '' : m2Y} placeholder="0" onChange={(e) => setM2Y(Number(e.target.value))} className="w-24 text-center rounded-xl font-bold" />
                <span className="text-sm font-semibold sm:ml-auto">Result:</span>
                <div className="border px-4 py-2 bg-muted/20 font-black text-primary rounded-xl text-center min-w-[80px]">
                  {getM2Result().toFixed(2)}%
                </div>
              </div>
            </div>

            {/* Mode 3 */}
            <div className="space-y-4 pt-4 border-t">
              <h3 className="font-bold text-xs uppercase tracking-wider text-primary border-b pb-1">3. Percentage Increase / Decrease</h3>
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <span className="text-sm font-semibold">From</span>
                <Input type="number" value={m3X === 0 ? '' : m3X} placeholder="0" onChange={(e) => setM3X(Number(e.target.value))} className="w-20 text-center rounded-xl font-bold" />
                <span className="text-sm font-semibold">to</span>
                <Input type="number" value={m3Y === 0 ? '' : m3Y} placeholder="0" onChange={(e) => setM3Y(Number(e.target.value))} className="w-24 text-center rounded-xl font-bold" />
                <span className="text-sm font-semibold sm:ml-auto">Result:</span>
                <div className="border px-4 py-2 bg-muted/20 font-black text-primary rounded-xl text-center min-w-[80px]">
                  {getM3Result() >= 0 ? `+${getM3Result().toFixed(2)}%` : `${getM3Result().toFixed(2)}%`}
                </div>
              </div>
            </div>

          </CardContent>
        </Card>
      </div>

      <section className="mt-12 space-y-8 prose prose-slate dark:prose-invert max-w-none border-t pt-12">
        <div className="bg-primary/5 rounded-2xl p-6 md:p-10 border border-primary/10">
            <h2 className="text-3xl font-bold font-headline mb-6">Why Use Our Percentage Calculator?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm leading-relaxed">
                <div className="space-y-4">
                    <p>
                        <strong className="text-primary font-bold">Free & Secure:</strong> Our Percentage Calculator is 100% free and runs completely in your web browser. No registration, signup, or installation is required.
                    </p>
                    <p>
                        Calculate percentage values, ratios, and differences.
                    </p>
                </div>
                <div className="space-y-4">
                    <p>
                        <strong className="text-primary font-bold">Step-by-Step Guide:</strong>
                    </p>
                    <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                        <li>Open the Percentage Calculator tool on UseBro.</li>
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
                    <h4 className="font-bold mb-2 text-base">Is the Percentage Calculator tool free to use?</h4>
                    <p className="text-muted-foreground text-sm">Yes! All tools on UseBro are 100% free with no monthly subscription limits, hidden fees, or signup forms.</p>
                </div>
                <div className="p-6 rounded-xl border border-border/50 bg-card hover:border-primary/50 transition-colors">
                    <h4 className="font-bold mb-2 text-base">Does this Percentage Calculator upload my files to a server?</h4>
                    <p className="text-muted-foreground text-sm">No. To guarantee security and privacy, all processing is performed locally inside your web browser. Your private files never leave your device.</p>
                </div>
                <div className="p-6 rounded-xl border border-border/50 bg-card hover:border-primary/50 transition-colors">
                    <h4 className="font-bold mb-2 text-base">Can I use Percentage Calculator on my mobile device?</h4>
                    <p className="text-muted-foreground text-sm">Yes! UseBro is fully mobile-friendly and responsive, running smoothly on Android, iPhone, iPad, and desktop browsers.</p>
                </div>
            </div>
        </div>
      </section>
    </>
  );
}
