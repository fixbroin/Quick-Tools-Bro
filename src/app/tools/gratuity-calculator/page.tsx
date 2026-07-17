'use client';
import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Sparkles, Calculator, Landmark, Coins, AlertTriangle } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

const MAX_LIMIT = 2500000; // Capped at ₹25 Lakhs by current Indian regulations

export default function GratuityCalculatorPage() {
  const [monthlyBasic, setMonthlyBasic] = useState(50000);
  const [serviceYears, setServiceYears] = useState(5);
  const [isCovered, setIsCovered] = useState(true);

  const gratuityDetails = useMemo(() => {
    const isEligible = serviceYears >= 5;
    
    // Formula changes based on Act Coverage
    // Covered: (15 * Basic * Years) / 26
    // Not Covered: (15 * Basic * Years) / 30
    const factor = isCovered ? 26 : 30;
    const rawGratuity = Math.round((15 * monthlyBasic * serviceYears) / factor);
    const finalGratuity = Math.min(MAX_LIMIT, rawGratuity);
    const isCapped = rawGratuity > MAX_LIMIT;

    return {
      isEligible,
      rawGratuity,
      finalGratuity,
      isCapped,
      factor,
    };
  }, [monthlyBasic, serviceYears, isCovered]);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className="shadow-lg border-primary/10">
        <CardHeader className="bg-primary/5 border-b p-6">
          <CardTitle className="flex items-center gap-2 font-black text-2xl">
            <Calculator className="text-primary h-6 w-6" /> GRATUITY CALCULATOR
          </CardTitle>
          <CardDescription>
            Estimate your gratuity payout based on your last drawn basic salary and continuous years of service under the Payment of Gratuity Act.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Input Column */}
            <div className="md:col-span-1 space-y-6">
              {/* Last Drawn Basic Salary */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Basic Salary + DA (₹)</Label>
                  <span className="text-sm font-extrabold text-primary">₹{monthlyBasic.toLocaleString('en-IN')}</span>
                </div>
                <Input 
                  type="number" 
                  value={monthlyBasic} 
                  min={1000} 
                  onChange={(e) => setMonthlyBasic(Math.max(0, parseInt(e.target.value) || 0))} 
                  className="h-11 rounded-xl"
                />
                <Slider 
                  value={[monthlyBasic]} 
                  min={5000} 
                  max={250000} 
                  step={1000} 
                  onValueChange={(val) => setMonthlyBasic(val[0])} 
                  className="py-2"
                />
              </div>

              {/* Service Years */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Years of Service</Label>
                  <span className="text-sm font-bold text-primary">{serviceYears} Years</span>
                </div>
                <Slider 
                  value={[serviceYears]} 
                  min={1} 
                  max={50} 
                  step={1} 
                  onValueChange={(val) => setServiceYears(val[0])} 
                  className="py-2"
                />
                <p className="text-[10px] text-muted-foreground">Minimum 5 years of continuous service required for eligibility</p>
              </div>

              {/* Covered under Gratuity Act */}
              <div className="flex items-center justify-between border-t pt-4">
                <div className="space-y-0.5">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Covered under Gratuity Act</Label>
                  <p className="text-[10px] text-muted-foreground">Generally applies to organizations with 10+ employees</p>
                </div>
                <Switch checked={isCovered} onCheckedChange={setIsCovered} />
              </div>
            </div>

            {/* Results Column */}
            <div className="md:col-span-2 bg-muted/20 border border-primary/5 rounded-2xl p-6 flex flex-col justify-between space-y-6">
              <h3 className="font-headline text-lg font-bold text-foreground flex items-center gap-1.5 border-b pb-3">
                <Sparkles className="text-primary h-5 w-5" /> Payout Summary
              </h3>

              <div className="space-y-6">
                {!gratuityDetails.isEligible && (
                  <div className="flex items-start gap-2 p-3 bg-yellow-500/10 border border-yellow-500/20 text-yellow-600 rounded-xl text-xs">
                    <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold">Not Eligible Yet</p>
                      <p className="text-muted-foreground mt-1">
                        By law, you must complete at least 5 years of continuous service to be eligible for gratuity. Current calculation is purely illustrative.
                      </p>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Estimated Gratuity */}
                  <div className="bg-primary/5 border border-primary/20 p-4 rounded-xl space-y-1">
                    <div className="flex items-center gap-1 text-[10px] font-bold text-primary uppercase tracking-wider">
                      <Coins className="h-3 w-3" /> Gratuity Amount
                    </div>
                    <p className="text-2xl font-black text-primary">₹{gratuityDetails.finalGratuity.toLocaleString('en-IN')}</p>
                    {gratuityDetails.isCapped && (
                      <span className="text-[9px] font-bold text-red-500 block mt-1 uppercase tracking-wider">Capped at Legal Limit (₹25L)</span>
                    )}
                  </div>

                  {/* Calculations Details */}
                  <div className="bg-card border p-4 rounded-xl space-y-2">
                    <div className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                      <Landmark className="h-3 w-3 text-muted-foreground" /> Calculation Formula
                    </div>
                    <p className="text-xs text-muted-foreground font-mono leading-relaxed">
                      (15 * ₹{monthlyBasic.toLocaleString('en-IN')} * {serviceYears} years) / {gratuityDetails.factor}
                    </p>
                  </div>
                </div>
              </div>

              {/* Explainer note */}
              <p className="text-xs text-muted-foreground leading-relaxed bg-card p-3 rounded-lg border border-primary/5">
                Note: Gratuity payout received is fully exempt from tax up to ₹25 Lakhs for employees covered under the Act. Any excess is taxable.
              </p>
            </div>
          </div>

          {/* Explanation Section */}
          <div className="space-y-4 border-t pt-6">
            <h3 className="font-headline text-lg font-bold text-foreground">How Gratuity Payout is Calculated</h3>
            <div className="space-y-4 text-xs text-muted-foreground leading-relaxed">
              <p>
                Gratuity is a financial reward given by an employer to an employee for their services rendered to the organization. It is governed by the <strong>Payment of Gratuity Act 1972</strong>.
              </p>
              <div className="bg-muted/30 p-4 rounded-xl border space-y-2 font-mono">
                <p className="font-bold text-foreground">Formula for Employees Covered under the Act:</p>
                <p>Gratuity = (15 * Last drawn salary * Number of completed years of service) / 26</p>
                <p className="text-[10px] mt-1">Here, 26 days represents working days in a month, and 15 represents half-month wages.</p>
              </div>
              <div className="bg-muted/30 p-4 rounded-xl border space-y-2 font-mono">
                <p className="font-bold text-foreground">Formula for Employees NOT Covered under the Act:</p>
                <p>Gratuity = (15 * Last drawn salary * Number of completed years of service) / 30</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
