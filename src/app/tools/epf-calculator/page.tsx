'use client';
import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Sparkles, Calculator, Landmark, CalendarRange, Coins } from 'lucide-react';

const INTEREST_RATE = 8.25; // 8.25% per annum for EPF

export default function EPFCalculatorPage() {
  const [monthlyBasic, setMonthlyBasic] = useState(30000);
  const [currentAge, setCurrentAge] = useState(25);
  const [retirementAge, setRetirementAge] = useState(58);
  const [currentBalance, setCurrentBalance] = useState(0);
  const [incrementRate, setIncrementRate] = useState(5);
  const [employeeContributionRate, setEmployeeContributionRate] = useState(12);

  const projections = useMemo(() => {
    let balance = currentBalance;
    let totalEmployeeContribution = 0;
    let totalEmployerContribution = 0;
    let totalInterest = 0;
    const list = [];

    const yearsToRetire = retirementAge - currentAge;
    let currentBasic = monthlyBasic;

    for (let year = 1; year <= yearsToRetire; year++) {
      const yearStartBalance = balance;
      let yearEmployeeContribution = 0;
      let yearEmployerContribution = 0;
      let yearInterest = 0;

      // Calculate month by month for compounding accuracy
      for (let month = 1; month <= 12; month++) {
        // Employee share (12% of basic)
        const empContrib = Math.round(currentBasic * (employeeContributionRate / 100));
        
        // Employer share: EPS Pension is capped at 8.33% of max 15,000 basic salary (= ₹1250)
        const epsContrib = currentBasic >= 15000 ? 1250 : Math.round(currentBasic * 0.0833);
        const totalEmployer12 = Math.round(currentBasic * 0.12);
        const epfEmployerShare = totalEmployer12 - epsContrib;

        yearEmployeeContribution += empContrib;
        yearEmployerContribution += epfEmployerShare;

        // Interest accumulated monthly: rate / 12
        const monthlyInterest = (balance + empContrib + epfEmployerShare) * ((INTEREST_RATE / 100) / 12);
        yearInterest += monthlyInterest;
        balance = balance + empContrib + epfEmployerShare;
      }

      // Round annual values
      yearEmployeeContribution = Math.round(yearEmployeeContribution);
      yearEmployerContribution = Math.round(yearEmployerContribution);
      yearInterest = Math.round(yearInterest);
      
      // Add interest to closing balance at the end of the year
      balance = yearStartBalance + yearEmployeeContribution + yearEmployerContribution + yearInterest;
      
      totalEmployeeContribution += yearEmployeeContribution;
      totalEmployerContribution += yearEmployerContribution;
      totalInterest += yearInterest;

      list.push({
        year: year,
        age: currentAge + year,
        salary: Math.round(currentBasic),
        opening: yearStartBalance,
        empContrib: yearEmployeeContribution,
        employerContrib: yearEmployerContribution,
        interest: yearInterest,
        closing: balance,
      });

      // Increase basic salary for the next year
      currentBasic = currentBasic * (1 + incrementRate / 100);
    }

    return {
      table: list,
      totalEmployeeContribution,
      totalEmployerContribution,
      totalInterest,
      finalCorpus: balance,
    };
  }, [monthlyBasic, currentAge, retirementAge, currentBalance, incrementRate, employeeContributionRate]);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className="shadow-lg border-primary/10">
        <CardHeader className="bg-primary/5 border-b p-6">
          <CardTitle className="flex items-center gap-2 font-black text-2xl">
            <Calculator className="text-primary h-6 w-6" /> EPF CALCULATOR
          </CardTitle>
          <CardDescription>
            Calculate retirement corpus from your Employee Provident Fund contributions and the current interest rate of {INTEREST_RATE}%.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Input Column */}
            <div className="md:col-span-1 space-y-6">
              {/* Basic Monthly Salary */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Basic Monthly Salary + DA (₹)</Label>
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

              {/* Current Age & Retirement Age */}
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Current Age</Label>
                  <Input type="number" value={currentAge} min={18} max={57} onChange={(e) => setCurrentAge(Math.min(57, Math.max(18, parseInt(e.target.value) || 18)))} className="h-11 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Retirement Age</Label>
                  <Input type="number" value={retirementAge} min={currentAge + 1} max={70} onChange={(e) => setRetirementAge(Math.min(70, Math.max(currentAge + 1, parseInt(e.target.value) || 58)))} className="h-11 rounded-xl" />
                </div>
              </div>

              {/* Current PF Balance */}
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Current EPF Balance (₹)</Label>
                <Input type="number" value={currentBalance} onChange={(e) => setCurrentBalance(Math.max(0, parseInt(e.target.value) || 0))} className="h-11 rounded-xl" />
              </div>

              {/* Yearly Increment % */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Salary Increment per Year (%)</Label>
                  <span className="text-sm font-bold text-primary">{incrementRate}%</span>
                </div>
                <Slider 
                  value={[incrementRate]} 
                  min={0} 
                  max={25} 
                  step={1} 
                  onValueChange={(val) => setIncrementRate(val[0])} 
                  className="py-2"
                />
              </div>
            </div>

            {/* Results Column */}
            <div className="md:col-span-2 bg-muted/20 border border-primary/5 rounded-2xl p-6 flex flex-col justify-between space-y-6">
              <h3 className="font-headline text-lg font-bold text-foreground flex items-center gap-1.5 border-b pb-3">
                <Sparkles className="text-primary h-5 w-5" /> Retirement EPF Projections
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Total Employee Contribution */}
                <div className="bg-card border p-4 rounded-xl space-y-1">
                  <div className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    <Coins className="h-3 w-3 text-muted-foreground" /> Your Contribution
                  </div>
                  <p className="text-base font-black text-foreground">₹{projections.totalEmployeeContribution.toLocaleString('en-IN')}</p>
                </div>

                {/* Total Employer Contribution */}
                <div className="bg-card border p-4 rounded-xl space-y-1">
                  <div className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    <Coins className="h-3 w-3 text-muted-foreground" /> Employer Contribution
                  </div>
                  <p className="text-base font-black text-foreground">₹{projections.totalEmployerContribution.toLocaleString('en-IN')}</p>
                </div>

                {/* Total Interest Gained */}
                <div className="bg-card border p-4 rounded-xl space-y-1">
                  <div className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    <Landmark className="h-3 w-3 text-emerald-500" /> Total Interest Gained
                  </div>
                  <p className="text-base font-black text-emerald-600">₹{projections.totalInterest.toLocaleString('en-IN')}</p>
                </div>

                {/* Total Retirement Corpus */}
                <div className="bg-primary/5 border border-primary/20 p-4 rounded-xl space-y-1">
                  <div className="flex items-center gap-1 text-[10px] font-bold text-primary uppercase tracking-wider">
                    <CalendarRange className="h-3 w-3" /> Retirement Corpus
                  </div>
                  <p className="text-lg font-black text-primary">₹{projections.finalCorpus.toLocaleString('en-IN')}</p>
                </div>
              </div>

              {/* Explainer note */}
              <p className="text-xs text-muted-foreground leading-relaxed bg-card p-3 rounded-lg border border-primary/5">
                Note: Standard employee contribution is 12%. The employer's 12% is split: 8.33% goes to the Employee Pension Scheme (EPS) capped at ₹1,250/month, and the remainder goes to the EPF.
              </p>
            </div>
          </div>

          {/* Projections Table */}
          <div className="space-y-4 border-t pt-6">
            <h3 className="font-headline text-lg font-bold text-foreground">Retirement Projection Ledger</h3>
            <div className="space-y-4">
              {/* Desktop Table View */}
              <div className="hidden md:block rounded-xl border overflow-x-auto">
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow>
                      <TableHead>Year</TableHead>
                      <TableHead>Age</TableHead>
                      <TableHead>Basic Salary</TableHead>
                      <TableHead>Employee Share</TableHead>
                      <TableHead>Employer Share</TableHead>
                      <TableHead>Interest</TableHead>
                      <TableHead className="text-right">Ending Balance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {projections.table.map((row) => (
                      <TableRow key={row.year}>
                        <TableCell className="font-medium text-xs">Year {row.year}</TableCell>
                        <TableCell className="font-medium text-xs">{row.age} Years</TableCell>
                        <TableCell className="font-mono text-xs">₹{row.salary.toLocaleString('en-IN')}</TableCell>
                        <TableCell className="font-mono text-xs">₹{row.empContrib.toLocaleString('en-IN')}</TableCell>
                        <TableCell className="font-mono text-xs">₹{row.employerContrib.toLocaleString('en-IN')}</TableCell>
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
                      <span className="font-bold text-xs text-primary">Year {row.year} (Age {row.age})</span>
                      <span className="text-xs font-mono font-extrabold text-foreground">Closing: ₹{row.closing.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-muted-foreground block text-[9px] uppercase font-bold tracking-wider">Basic Monthly Salary</span>
                        <span className="font-mono">₹{row.salary.toLocaleString('en-IN')}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-[9px] uppercase font-bold tracking-wider">Your Contribution (12%)</span>
                        <span className="font-mono">₹{row.empContrib.toLocaleString('en-IN')}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-[9px] uppercase font-bold tracking-wider">Employer Contribution</span>
                        <span className="font-mono">₹{row.employerContrib.toLocaleString('en-IN')}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-[9px] uppercase font-bold tracking-wider">Interest Credited (8.25%)</span>
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
    </div>
  );
}
