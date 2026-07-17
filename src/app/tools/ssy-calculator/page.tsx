'use client';
import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Sparkles, Calculator, Landmark, CalendarRange, Coins } from 'lucide-react';

const INTEREST_RATE = 8.2; // 8.2% per annum for SSY

export default function SSYCalculatorPage() {
  const [yearlyContribution, setYearlyContribution] = useState(50000);
  const [girlAge, setGirlAge] = useState(0);
  const [startYear, setStartYear] = useState(() => new Date().getFullYear());

  const projections = useMemo(() => {
    let openingBalance = 0;
    const list = [];
    let totalInvested = 0;

    for (let year = 1; year <= 21; year++) {
      const contribution = year <= 15 ? yearlyContribution : 0;
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
  }, [yearlyContribution, startYear]);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className="shadow-lg border-primary/10">
        <CardHeader className="bg-primary/5 border-b p-6">
          <CardTitle className="flex items-center gap-2 font-black text-2xl">
            <Calculator className="text-primary h-6 w-6" /> SUKANYA SAMRIDDHI YOJANA (SSY) CALCULATOR
          </CardTitle>
          <CardDescription>
            Calculate maturity returns for the Sukanya Samriddhi account based on your yearly deposits and the current interest rate of {INTEREST_RATE}%.
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
                  value={yearlyContribution} 
                  min={250} 
                  max={150000} 
                  step={500} 
                  onChange={(e) => setYearlyContribution(Math.min(150000, Math.max(0, parseInt(e.target.value) || 0)))} 
                  className="h-11 rounded-xl"
                />
                <Slider 
                  value={[yearlyContribution]} 
                  min={250} 
                  max={150000} 
                  step={500} 
                  onValueChange={(val) => setYearlyContribution(val[0])} 
                  className="py-2"
                />
                <p className="text-[10px] text-muted-foreground">Min: ₹250 | Max: ₹1,50,000 per financial year</p>
              </div>

              {/* Girl Age */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Girl Child's Age (Years)</Label>
                  <span className="text-sm font-bold text-primary">{girlAge} Years</span>
                </div>
                <Slider 
                  value={[girlAge]} 
                  min={0} 
                  max={10} 
                  step={1} 
                  onValueChange={(val) => setGirlAge(val[0])} 
                  className="py-2"
                />
                <p className="text-[10px] text-muted-foreground">Age limit is 0 to 10 years at account opening</p>
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
                Note: Deposits are required only for the first 15 years. The account earns interest for the remaining 6 years until it matures after exactly 21 years.
              </p>
            </div>
          </div>

          {/* Projections Table */}
          <div className="space-y-4 border-t pt-6">
            <h3 className="font-headline text-lg font-bold text-foreground">Year-by-Year Growth Ledger</h3>
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
                      <TableRow key={row.year} className={row.contribution === 0 ? 'bg-emerald-500/[0.02]' : ''}>
                        <TableCell className="font-medium text-xs">Year {row.year}</TableCell>
                        <TableCell className="font-medium text-xs">{row.calendarYear}</TableCell>
                        <TableCell className="font-mono text-muted-foreground text-xs">₹{row.opening.toLocaleString('en-IN')}</TableCell>
                        <TableCell className="font-mono text-xs font-bold text-foreground">
                          {row.contribution > 0 ? `₹${row.contribution.toLocaleString('en-IN')}` : '₹0 (No Deposit)'}
                        </TableCell>
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
                        <span className="font-mono font-semibold">
                          {row.contribution > 0 ? `₹${row.contribution.toLocaleString('en-IN')}` : '₹0'}
                        </span>
                      </div>
                      <div className="col-span-2 border-t pt-1.5 flex justify-between items-center">
                        <span className="text-[9px] uppercase font-bold tracking-wider text-muted-foreground">Interest Earned (8.2%)</span>
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
          <h2 className="text-2xl font-bold font-headline mb-4">Key Benefits of SSY Scheme</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm leading-relaxed">
            <div className="space-y-2">
              <h3 className="font-bold text-primary">Triple Tax Exemption (EEE)</h3>
              <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                <li>Deposits qualify for deduction under Sec 80C.</li>
                <li>Interest accrued annually is completely tax-free.</li>
                <li>Maturity amount at withdrawal is 100% tax-free.</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-primary">Withdrawal Policies</h3>
              <p className="text-muted-foreground">
                Partial withdrawals (up to 50% of the balance) are allowed for the girl child's higher education after she turns 18 or passes the 10th standard. The account matures completely after 21 years from the date of opening.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
