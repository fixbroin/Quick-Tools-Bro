'use client';
import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Sparkles, Calculator, Landmark, CalendarRange, Coins } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const INTEREST_RATE = 7.1; // 7.1% per annum for PPF

export default function PPFCalculatorPage() {
  const [yearlyContribution, setYearlyContribution] = useState(50000);
  const [duration, setDuration] = useState(15);
  const [startYear, setStartYear] = useState(() => new Date().getFullYear());

  const projections = useMemo(() => {
    let openingBalance = 0;
    const list = [];
    let totalInvested = 0;

    for (let year = 1; year <= duration; year++) {
      const contribution = yearlyContribution;
      const interestEarned = Math.round((openingBalance + contribution) * (INTEREST_RATE / 100));
      const closingBalance = openingBalance + contribution + interestEarned;
      totalInvested += contribution;

      list.push({
        year: year,
        calendarYear: startYear + year - 1,
        opening: openingBalance,
        contribution: contribution,
        interest: interestEarned,
        closing: closingBalance,
      });

      openingBalance = closingBalance;
    }

    return {
      table: list,
      totalInvested,
      maturityAmount: openingBalance,
      totalInterest: openingBalance - totalInvested,
    };
  }, [yearlyContribution, duration, startYear]);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className="shadow-lg border-primary/10">
        <CardHeader className="bg-primary/5 border-b p-6">
          <CardTitle className="flex items-center gap-2 font-black text-2xl">
            <Calculator className="text-primary h-6 w-6" /> PPF CALCULATOR
          </CardTitle>
          <CardDescription>
            Calculate Public Provident Fund maturity returns, total interest earned, and print a yearly ledger.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Input Column */}
            <div className="md:col-span-1 space-y-6">
              {/* Annual Contribution Input & Slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Annual Deposit (₹)</Label>
                  <span className="text-sm font-extrabold text-primary">₹{yearlyContribution.toLocaleString('en-IN')}</span>
                </div>
                <Input 
                  type="number" 
                  value={yearlyContribution === 0 ? '' : yearlyContribution} 
                  placeholder="0"
                  min={500} 
                  max={150000} 
                  step={500} 
                  onChange={(e) => setYearlyContribution(e.target.value === '' ? 0 : Math.min(150000, Math.max(0, parseInt(e.target.value) || 0)))} 
                  className="h-11 rounded-xl"
                />
                <Slider 
                  value={[yearlyContribution]} 
                  min={500} 
                  max={150000} 
                  step={500} 
                  onValueChange={(val) => setYearlyContribution(val[0])} 
                  className="py-2"
                />
                <p className="text-[10px] text-muted-foreground">Min: ₹500 | Max: ₹1,50,000 per financial year</p>
              </div>

              {/* PPF Duration */}
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Duration (Years)</Label>
                <Select value={duration.toString()} onValueChange={(val) => setDuration(parseInt(val))}>
                  <SelectTrigger className="rounded-xl border border-primary/15 bg-card shadow-sm h-11">
                    <SelectValue placeholder="Select Duration" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-primary/15">
                    <SelectItem value="15">15 Years (Default Maturity)</SelectItem>
                    <SelectItem value="20">20 Years (1 Extension Block)</SelectItem>
                    <SelectItem value="25">25 Years (2 Extension Blocks)</SelectItem>
                    <SelectItem value="30">30 Years (3 Extension Blocks)</SelectItem>
                    <SelectItem value="35">35 Years (4 Extension Blocks)</SelectItem>
                    <SelectItem value="40">40 Years (5 Extension Blocks)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-[10px] text-muted-foreground">PPF can be extended in blocks of 5 years indefinitely</p>
              </div>

              {/* Start Year */}
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Start Year</Label>
                <Input 
                  type="number" 
                  value={startYear} 
                  onChange={(e) => setStartYear(parseInt(e.target.value) || new Date().getFullYear())} 
                  className="h-11 rounded-xl" 
                />
              </div>
            </div>

            {/* Results Column */}
            <div className="md:col-span-2 bg-muted/20 border border-primary/5 rounded-2xl p-6 flex flex-col justify-between space-y-6">
              <h3 className="font-headline text-lg font-bold text-foreground flex items-center gap-1.5 border-b pb-3">
                <Sparkles className="text-primary h-5 w-5" /> Investment Summary
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Total Invested */}
                <div className="bg-card border p-4 rounded-xl space-y-1">
                  <div className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    <Coins className="h-3 w-3 text-muted-foreground" /> Total Invested
                  </div>
                  <p className="text-lg font-black text-foreground">₹{projections.totalInvested.toLocaleString('en-IN')}</p>
                </div>

                {/* Interest Gained */}
                <div className="bg-card border p-4 rounded-xl space-y-1">
                  <div className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    <Landmark className="h-3 w-3 text-emerald-500" /> Interest Earned
                  </div>
                  <p className="text-lg font-black text-emerald-600">₹{projections.totalInterest.toLocaleString('en-IN')}</p>
                </div>

                {/* Maturity Amount */}
                <div className="bg-primary/5 border border-primary/20 p-4 rounded-xl space-y-1">
                  <div className="flex items-center gap-1 text-[10px] font-bold text-primary uppercase tracking-wider">
                    <CalendarRange className="h-3 w-3" /> Maturity Value
                  </div>
                  <p className="text-lg font-black text-primary">₹{projections.maturityAmount.toLocaleString('en-IN')}</p>
                </div>
              </div>

              {/* Explainer note */}
              <p className="text-xs text-muted-foreground leading-relaxed bg-card p-3 rounded-lg border border-primary/5">
                Note: Interest on PPF is calculated on the lowest balance between the close of the 5th day and the end of the month, compounded annually.
              </p>
            </div>
          </div>

          {/* Projections Table */}
          <div className="space-y-4 border-t pt-6">
            <h3 className="font-headline text-lg font-bold text-foreground">Year-by-Year Compounding Projection</h3>
            <div className="space-y-4">
              {/* Desktop Table View */}
              <div className="hidden md:block rounded-xl border overflow-x-auto">
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow>
                      <TableHead>Year</TableHead>
                      <TableHead>Calendar Year</TableHead>
                      <TableHead>Opening Balance</TableHead>
                      <TableHead>Annual Deposit</TableHead>
                      <TableHead>Interest Earned</TableHead>
                      <TableHead className="text-right">Closing Balance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {projections.table.map((row) => (
                      <TableRow key={row.year}>
                        <TableCell className="font-medium text-xs">Year {row.year}</TableCell>
                        <TableCell className="font-medium text-xs">{row.calendarYear}</TableCell>
                        <TableCell className="font-mono text-muted-foreground text-xs">₹{row.opening.toLocaleString('en-IN')}</TableCell>
                        <TableCell className="font-mono text-xs font-bold text-foreground">₹{row.contribution.toLocaleString('en-IN')}</TableCell>
                        <TableCell className="font-mono text-emerald-600 text-xs">₹{row.interest.toLocaleString('en-IN')}</TableCell>
                        <TableCell className="text-right font-mono font-extrabold text-primary text-xs">₹{row.closing.toLocaleString('en-IN')}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Card List View */}
              <div className="block md:hidden space-y-3">
                {projections.table.map((row) => (
                  <div key={row.year} className="rounded-xl border p-4 space-y-2 bg-card hover:shadow-sm transition-all border-primary/5">
                    <div className="flex justify-between items-center border-b pb-2">
                      <span className="font-bold text-xs text-primary">Year {row.year} ({row.calendarYear})</span>
                      <span className="text-xs font-mono font-extrabold text-foreground">Closing: ₹{row.closing.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-muted-foreground block text-[9px] uppercase font-bold tracking-wider">Opening Balance</span>
                        <span className="font-mono">₹{row.opening.toLocaleString('en-IN')}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-[9px] uppercase font-bold tracking-wider">Annual Deposit</span>
                        <span className="font-mono font-semibold">₹{row.contribution.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="col-span-2 border-t pt-1.5 flex justify-between items-center">
                        <span className="text-[9px] uppercase font-bold tracking-wider text-muted-foreground">Interest Earned (7.1%)</span>
                        <span className="font-mono text-emerald-600 font-bold">+₹{row.interest.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <section className="space-y-8 prose prose-slate dark:prose-invert max-w-none">
        <div className="bg-primary/5 rounded-2xl p-6 md:p-10 border border-primary/10">
          <h2 className="text-2xl font-bold font-headline mb-4">PPF Rules and Benefits</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm leading-relaxed">
            <div className="space-y-2">
              <h3 className="font-bold text-primary">Tax Exempt status (EEE)</h3>
              <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                <li>Tax saving up to ₹1.5 Lakhs annually under 80C.</li>
                <li>Interest earned is completely tax-free.</li>
                <li>Final maturity withdrawals are exempt from tax.</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-primary">Extensions & Loans</h3>
              <p className="text-muted-foreground">
                You can take a loan against your PPF balance between the 3rd and 6th financial years. Post the 15-year maturity, you can extend the account in blocks of 5 years with or without fresh contributions.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
