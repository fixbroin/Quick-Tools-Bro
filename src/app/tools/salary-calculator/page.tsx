'use client';

import { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { 
  Banknote, Scale, Percent, Sparkles, Download, 
  ArrowRightLeft, FileText, History, HelpCircle, 
  Briefcase, TrendingUp, DollarSign, Calculator, Plus, Trash2
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';

// Types
interface SalaryPreset {
  name: string;
  ctc: number;
  basic: number;
  hra: number;
  special: number;
  other: number;
  insurance: number;
}

const PRESETS: Record<string, SalaryPreset> = {
  software: {
    name: 'Software Engineer',
    ctc: 1200000,
    basic: 500000,
    hra: 250000,
    special: 300000,
    other: 69400,
    insurance: 6000
  },
  fresher: {
    name: 'IT Fresher',
    ctc: 360000,
    basic: 144000,
    hra: 57600,
    special: 100000,
    other: 34150,
    insurance: 2400
  },
  bpo: {
    name: 'BPO Executive',
    ctc: 240000,
    basic: 96000,
    hra: 38400,
    special: 70000,
    other: 19475,
    insurance: 1500
  },
  government: {
    name: 'Govt Employee',
    ctc: 800000,
    basic: 400000,
    hra: 96000,
    special: 200000,
    other: 48375,
    insurance: 5000
  },
  factory: {
    name: 'Factory Worker',
    ctc: 180000,
    basic: 90000,
    hra: 36000,
    special: 30000,
    other: 13000,
    insurance: 1000
  },
  teacher: {
    name: 'School Teacher',
    ctc: 480000,
    basic: 240000,
    hra: 96000,
    special: 100000,
    other: 15450,
    insurance: 3000
  }
};

export default function SalaryCalculatorPage() {
  // Input Selection States
  const [salaryType, setSalaryType] = useState<'annual' | 'monthly' | 'hourly' | 'daily'>('annual');
  const [inputVal, setInputVal] = useState<number>(1200000);
  
  // Salary Component States
  const [basic, setBasic] = useState<number>(500000);
  const [hra, setHra] = useState<number>(250000);
  const [special, setSpecial] = useState<number>(300000);
  const [otherAllowances, setOtherAllowances] = useState<number>(69400);
  
  // Employer / Deductions States
  const [gratuity, setGratuity] = useState<number>(24050);
  const [insurance, setInsurance] = useState<number>(6000);
  const [npsEmployer, setNpsEmployer] = useState<number>(0);
  
  const [autoPF, setAutoPF] = useState<boolean>(true);
  const [customPF, setCustomPF] = useState<number>(0);
  const [statePT, setStatePT] = useState<string>('Karnataka');
  const [taxRegime, setTaxRegime] = useState<'new' | 'old'>('new');
  
  const [otherDeductions, setOtherDeductions] = useState<number>(0);
  const [insuranceEmployee, setInsuranceEmployee] = useState<number>(0);
  const [npsEmployee, setNpsEmployee] = useState<number>(0);

  // Live Toggle for Monthly vs Annual display
  const [displayTerm, setDisplayTerm] = useState<'monthly' | 'annual'>('monthly');

  // History Log States
  const [savedHistory, setSavedHistory] = useState<{ year: string; ctc: number; takeHome: number }[]>([]);
  const [historyYear, setHistoryYear] = useState<string>(new Date().getFullYear().toString());

  // Comparison Tool States
  const [compCTC_A, setCompCTC_A] = useState<number>(1000000);
  const [compCTC_B, setCompCTC_B] = useState<number>(1200000);
  const [compState_A, setCompState_A] = useState<string>('Karnataka');
  const [compState_B, setCompState_B] = useState<string>('Telangana');
  const [compRegime_A, setCompRegime_A] = useState<'new' | 'old'>('new');
  const [compRegime_B, setCompRegime_B] = useState<'new' | 'old'>('new');

  // HRA Exemption States
  const [hraBasic, setHraBasic] = useState<number>(40000);
  const [hraReceived, setHraReceived] = useState<number>(20000);
  const [hraRentPaid, setHraRentPaid] = useState<number>(18000);
  const [hraMetro, setHraMetro] = useState<boolean>(true);

  // Auxiliary Tools States
  const [otSalary, setOtSalary] = useState<number>(50000);
  const [otDays, setOtDays] = useState<number>(22);
  const [otHours, setOtHours] = useState<number>(10);
  
  const [leaveSalary, setLeaveSalary] = useState<number>(50000);
  const [leaveDays, setLeaveDays] = useState<number>(22);
  const [leavesTaken, setLeavesTaken] = useState<number>(3);

  const [incSalary, setIncSalary] = useState<number>(50000);
  const [incPercent, setIncPercent] = useState<number>(12);

  const [noticeSalary, setNoticeSalary] = useState<number>(50000);
  const [noticeRequired, setNoticeRequired] = useState<number>(90);
  const [noticeServed, setNoticeServed] = useState<number>(60);

  const [bonusFixed, setBonusFixed] = useState<number>(50000);
  const [bonusVariable, setBonusVariable] = useState<number>(100000);
  const [bonusPerf, setBonusPerf] = useState<number>(90);

  // Load Saved History from LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem('salary_history');
    if (saved) {
      try {
        setSavedHistory(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // Sync Input Value to CTC Components when InputVal changes or SalaryType changes
  const annualCTC = useMemo(() => {
    if (salaryType === 'annual') return inputVal;
    if (salaryType === 'monthly') return inputVal * 12;
    if (salaryType === 'hourly') return inputVal * 8 * 22 * 12;
    if (salaryType === 'daily') return inputVal * 22 * 12;
    return 0;
  }, [inputVal, salaryType]);

  // Autodistribute CTC components when preset is chosen or input value changes
  const applyPreset = (presetKey: keyof typeof PRESETS) => {
    const preset = PRESETS[presetKey];
    setBasic(preset.basic);
    setHra(preset.hra);
    setSpecial(preset.special);
    setOtherAllowances(preset.other);
    setInsurance(preset.insurance);
    setGratuity(Math.round(preset.basic * 0.0481));
    setInputVal(salaryType === 'annual' ? preset.ctc : Math.round(preset.ctc / 12));
  };

  // If no preset chosen, automatically balance CTC variables
  const distributeCTC = () => {
    const basicRatio = 0.45; // 45% basic
    const hraRatio = 0.5; // HRA is 50% of Basic
    
    const computedBasic = Math.round(annualCTC * basicRatio);
    const computedHra = Math.round(computedBasic * hraRatio);
    const computedGratuity = Math.round(computedBasic * 0.0481);
    
    // Employer PF (capped at 12% of Basic, max 1800/month or 21600/year standard)
    const computedEmployerPF = Math.min(21600, Math.round(computedBasic * 0.12));
    
    const computedInsurance = 6000;
    const computedSpecial = Math.round(annualCTC * 0.2); // 20% special allowance
    
    const remaining = annualCTC - (computedBasic + computedHra + computedSpecial + computedEmployerPF + computedGratuity + computedInsurance);
    const computedOther = Math.max(0, remaining);

    setBasic(computedBasic);
    setHra(computedHra);
    setSpecial(computedSpecial);
    setOtherAllowances(computedOther);
    setGratuity(computedGratuity);
    setInsurance(computedInsurance);
  };

  // Perform Calculations
  const calculations = useMemo(() => {
    // Basic calculations
    const basicMonthly = Math.round(basic / 12);
    const hraMonthly = Math.round(hra / 12);
    const specialMonthly = Math.round(special / 12);
    const otherAllowancesMonthly = Math.round(otherAllowances / 12);
    
    // Employer PF calculation (12% of basic)
    const employerPFAnnual = autoPF ? Math.min(21600, Math.round(basic * 0.12)) : Math.round(customPF * 12);
    const employerPFMonthly = Math.round(employerPFAnnual / 12);

    // Employee PF calculation (typically matches Employer PF)
    const employeePFAnnual = employerPFAnnual;
    const employeePFMonthly = employerPFMonthly;

    // Gross Salary (CTC minus employer contributions)
    const grossAnnual = annualCTC - employerPFAnnual - gratuity - insurance - npsEmployer;
    const grossMonthly = Math.round(grossAnnual / 12);

    // State-wise Professional Tax (PT) Monthly calculation
    let ptMonthly = 200;
    if (statePT === 'Karnataka') {
      ptMonthly = grossMonthly > 25000 ? 200 : 0;
    } else if (statePT === 'Telangana') {
      ptMonthly = grossMonthly > 20000 ? 200 : grossMonthly > 15000 ? 150 : 0;
    } else if (statePT === 'Tamil Nadu') {
      ptMonthly = grossMonthly > 75000 ? 208 : grossMonthly > 50000 ? 170 : grossMonthly > 30000 ? 115 : grossMonthly > 15000 ? 35 : 0;
    } else if (statePT === 'Maharashtra') {
      ptMonthly = grossMonthly > 10000 ? 200 : 0;
    } else if (statePT === 'Kerala') {
      ptMonthly = grossMonthly > 125000 ? 208 : grossMonthly > 100000 ? 166 : grossMonthly > 75000 ? 125 : grossMonthly > 50000 ? 83 : grossMonthly > 25000 ? 41 : 0;
    } else if (statePT === 'Delhi') {
      ptMonthly = 0;
    }
    const ptAnnual = ptMonthly * 12;

    // ESI Calculation (if gross salary is under 21,000/month, ESI is auto-applicable)
    const employeeESIMonthly = grossMonthly <= 21000 ? Math.round(grossMonthly * 0.0075) : 0;
    const employeeESIAnnual = employeeESIMonthly * 12;

    // Income Tax/TDS Calculation for FY 2026-27
    const calculateTaxLiability = (gross: number, regime: 'new' | 'old') => {
      let taxableIncome = gross;
      
      if (regime === 'new') {
        // Standard Deduction: ₹75,000
        taxableIncome = Math.max(0, taxableIncome - 75000);
        
        // NPS Employee Sec 80CCD(1B) up to 50k
        taxableIncome = Math.max(0, taxableIncome - Math.min(50000, npsEmployee * 12));

        // Rebate check: Net taxable income <= 12,0,000 pays ₹0 tax under Section 87A
        if (taxableIncome <= 1200000) return 0;

        // Slabs
        let tax = 0;
        let temp = taxableIncome;
        
        if (temp > 2000000) {
          tax += (temp - 2000000) * 0.30;
          temp = 2000000;
        }
        if (temp > 1600000) {
          tax += (temp - 1600000) * 0.20;
          temp = 1600000;
        }
        if (temp > 1200000) {
          tax += (temp - 1200000) * 0.15;
          temp = 1200000;
        }
        if (temp > 800000) {
          tax += (temp - 800000) * 0.10;
          temp = 800000;
        }
        if (temp > 400000) {
          tax += (temp - 400000) * 0.05;
        }
        
        // Add 4% Health & Education Cess
        return Math.round(tax * 1.04);
      } else {
        // Old Regime: Standard Deduction ₹50,000
        taxableIncome = Math.max(0, taxableIncome - 50000);
        
        // Deductions: Sec 80C up to 1.5L + NPS up to 50k
        const deductions80C = Math.min(150000, employeePFAnnual + 100000); // PF + proxy investments
        taxableIncome = Math.max(0, taxableIncome - deductions80C);
        
        // NPS deduction
        taxableIncome = Math.max(0, taxableIncome - Math.min(50000, npsEmployee * 12));

        // Rebate check: Taxable income <= 5,00,000 pays ₹0 tax
        if (taxableIncome <= 500000) return 0;

        let tax = 0;
        let temp = taxableIncome;
        
        if (temp > 1000000) {
          tax += (temp - 1000000) * 0.30;
          temp = 1000000;
        }
        if (temp > 500000) {
          tax += (temp - 500000) * 0.20;
          temp = 500000;
        }
        if (temp > 250000) {
          tax += (temp - 250000) * 0.05;
        }
        
        return Math.round(tax * 1.04);
      }
    };

    const taxAnnual = calculateTaxLiability(grossAnnual, taxRegime);
    const taxMonthly = Math.round(taxAnnual / 12);

    // Total Employee Deductions
    const totalDeductionsMonthly = employeePFMonthly + ptMonthly + employeeESIMonthly + taxMonthly + insuranceEmployee + npsEmployee + (otherDeductions / 12);
    const totalDeductionsAnnual = totalDeductionsMonthly * 12;

    // Net In-Hand Take Home
    const netTakeHomeMonthly = Math.max(0, grossMonthly - totalDeductionsMonthly);
    const netTakeHomeAnnual = netTakeHomeMonthly * 12;

    return {
      basicMonthly,
      hraMonthly,
      specialMonthly,
      otherAllowancesMonthly,
      employerPFAnnual,
      employerPFMonthly,
      employeePFAnnual,
      employeePFMonthly,
      grossAnnual,
      grossMonthly,
      ptMonthly,
      ptAnnual,
      employeeESIMonthly,
      employeeESIAnnual,
      taxAnnual,
      taxMonthly,
      totalDeductionsMonthly,
      totalDeductionsAnnual,
      netTakeHomeMonthly,
      netTakeHomeAnnual
    };
  }, [basic, hra, special, otherAllowances, autoPF, customPF, gratuity, insurance, npsEmployer, npsEmployee, taxRegime, statePT, otherDeductions, insuranceEmployee, annualCTC]);

  // Offers Comparison Logic
  const comparisonResults = useMemo(() => {
    const calcOffer = (ctc: number, state: string, regime: 'new' | 'old') => {
      const basicAmt = ctc * 0.45;
      const employerPF = Math.min(21600, basicAmt * 0.12);
      const grat = basicAmt * 0.0481;
      const gross = ctc - employerPF - grat - 6000;
      const grossM = gross / 12;

      let ptM = 200;
      if (state === 'Karnataka') ptM = grossM > 25000 ? 200 : 0;
      else if (state === 'Telangana') ptM = grossM > 20000 ? 200 : grossM > 15000 ? 150 : 0;
      else if (state === 'Delhi') ptM = 0;

      let tax = 0;
      const stdDed = regime === 'new' ? 75000 : 50000;
      const taxable = Math.max(0, gross - stdDed);
      
      if (regime === 'new') {
        if (taxable > 1200000) {
          let temp = taxable;
          if (temp > 2000000) { tax += (temp - 2000000) * 0.30; temp = 2000000; }
          if (temp > 1600000) { tax += (temp - 1600000) * 0.20; temp = 1600000; }
          if (temp > 1200000) { tax += (temp - 1200000) * 0.15; temp = 1200000; }
          if (temp > 800000) { tax += (temp - 800000) * 0.10; temp = 800000; }
          if (temp > 400000) { tax += (temp - 400000) * 0.05; }
          tax = tax * 1.04;
        }
      } else {
        if (taxable > 500000) {
          let temp = taxable;
          if (temp > 1000000) { tax += (temp - 1000000) * 0.30; temp = 1000000; }
          if (temp > 500000) { tax += (temp - 500000) * 0.20; temp = 500000; }
          if (temp > 250000) { tax += (temp - 250000) * 0.05; }
          tax = tax * 1.04;
        }
      }

      const totalDedM = (employerPF / 12) + ptM + (tax / 12);
      const takeHomeM = Math.round(grossM - totalDedM);
      return { gross: Math.round(gross), netMonthly: takeHomeM };
    };

    const offerA = calcOffer(compCTC_A, compState_A, compRegime_A);
    const offerB = calcOffer(compCTC_B, compState_B, compRegime_B);

    return { offerA, offerB };
  }, [compCTC_A, compCTC_B, compState_A, compState_B, compRegime_A, compRegime_B]);

  // HRA Exemption calculation logic
  const hraExemption = useMemo(() => {
    const basic10Percent = (hraBasic * 12) * 0.1;
    const rentExcess = Math.max(0, (hraRentPaid * 12) - basic10Percent);
    const metroCap = (hraBasic * 12) * (hraMetro ? 0.5 : 0.4);
    const actualHRA = hraReceived * 12;

    const exemptAnnual = Math.min(actualHRA, rentExcess, metroCap);
    const exemptMonthly = Math.round(exemptAnnual / 12);
    
    return {
      exemptAnnual,
      exemptMonthly,
      taxableAnnual: Math.max(0, actualHRA - exemptAnnual),
      taxableMonthly: Math.max(0, hraReceived - exemptMonthly)
    };
  }, [hraBasic, hraReceived, hraRentPaid, hraMetro]);

  // Format Currency
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  // Recharts CTC Pie Chart Data
  const chartData = [
    { name: 'Basic Salary', value: calculations.basicMonthly },
    { name: 'HRA', value: calculations.hraMonthly },
    { name: 'Allowances', value: calculations.specialMonthly + calculations.otherAllowancesMonthly },
    { name: 'PF & Gratuity', value: calculations.employeePFMonthly + Math.round(gratuity / 12) },
    { name: 'Income Tax', value: calculations.taxMonthly },
    { name: 'Net Take-Home', value: calculations.netTakeHomeMonthly },
  ].filter(d => d.value > 0);

  const COLORS = ['#FF8042', '#00C49F', '#FFBB28', '#0088FE', '#EF4444', '#10B981'];

  // Save current calculation configuration into history list
  const saveToHistory = () => {
    const newEntry = {
      year: historyYear,
      ctc: annualCTC,
      takeHome: calculations.netTakeHomeAnnual
    };
    const updated = [...savedHistory, newEntry].sort((a, b) => Number(a.year) - Number(b.year));
    setSavedHistory(updated);
    localStorage.setItem('salary_history', JSON.stringify(updated));
  };

  const clearHistory = () => {
    setSavedHistory([]);
    localStorage.removeItem('salary_history');
  };

  // Trigger browser print dialog for printable payslip view
  const triggerPrintPayslip = () => {
    window.print();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20 animate-in fade-in duration-500">
      {/* Dynamic Header */}
      <div className="text-center md:text-left space-y-2">
        <h1 className="text-4xl font-extrabold italic text-primary uppercase tracking-tighter flex items-center justify-center md:justify-start gap-2">
          <Banknote className="h-10 w-10 text-primary animate-pulse" /> UseBro CTC to In-Hand Salary Calculator
        </h1>
        <p className="text-muted-foreground text-sm max-w-2xl">
          Redesigned around modern Indian corporate CTC compensation structures. Estimate your monthly net take-home salary, employee PF, Professional Tax (PT), Gratuity, and TDS liabilities instantly.
        </p>
      </div>

      {/* Main Suite Tab Navigation */}
      <Tabs defaultValue="calculator" className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2 bg-muted/40 p-1.5 rounded-2xl h-auto shadow-inner border border-primary/5">
          <TabsTrigger value="calculator" className="rounded-xl py-2.5 font-bold text-xs uppercase tracking-wide gap-1.5"><Calculator className="h-4 w-4" /> CTC Calculator</TabsTrigger>
          <TabsTrigger value="compare" className="rounded-xl py-2.5 font-bold text-xs uppercase tracking-wide gap-1.5"><ArrowRightLeft className="h-4 w-4" /> Compare Offers</TabsTrigger>
          <TabsTrigger value="taxexempt" className="rounded-xl py-2.5 font-bold text-xs uppercase tracking-wide gap-1.5"><Percent className="h-4 w-4" /> HRA Exemption</TabsTrigger>
          <TabsTrigger value="auxiliary" className="rounded-xl py-2.5 font-bold text-xs uppercase tracking-wide gap-1.5"><Sparkles className="h-4 w-4" /> Auxiliary Tools</TabsTrigger>
        </TabsList>

        {/* Tab 1: Primary CTC to In-Hand Calculator */}
        <TabsContent value="calculator" className="space-y-6 mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Input Configuration Column */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Presets Card */}
              <Card className="shadow-md border-primary/5">
                <CardHeader className="p-4 bg-muted/30 border-b">
                  <CardTitle className="text-xs font-bold uppercase tracking-wider flex items-center gap-1"><Briefcase className="h-4 w-4 text-primary" /> Indian Job Structure Presets</CardTitle>
                </CardHeader>
                <CardContent className="p-4 flex flex-wrap gap-2">
                  {Object.entries(PRESETS).map(([key, p]) => (
                    <Button 
                      key={key} 
                      variant="outline" 
                      onClick={() => applyPreset(key)} 
                      className="rounded-xl text-xs py-1 h-8 font-semibold hover:border-primary/50"
                    >
                      {p.name}
                    </Button>
                  ))}
                  <Button variant="default" onClick={distributeCTC} className="rounded-xl text-xs py-1 h-8 font-extrabold bg-primary/95 shadow-md">
                    Auto-Fill CTC
                  </Button>
                </CardContent>
              </Card>

              {/* Main Inputs Card */}
              <Card className="shadow-md border-primary/5">
                <CardHeader className="bg-primary/5 border-b p-6">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                    <div>
                      <CardTitle className="text-lg font-bold font-headline uppercase tracking-wider">Salary CTC & Slabs</CardTitle>
                      <CardDescription className="text-xs">Select frequency term and input salary</CardDescription>
                    </div>
                    
                    <RadioGroup 
                      value={salaryType} 
                      onValueChange={(val: any) => setSalaryType(val)} 
                      className="flex bg-muted/50 p-1 rounded-xl gap-1"
                    >
                      <div className="flex items-center space-x-1">
                        <RadioGroupItem value="annual" id="annual" className="sr-only" />
                        <Label 
                          htmlFor="annual" 
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${salaryType === 'annual' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted text-muted-foreground'}`}
                        >
                          Annual CTC
                        </Label>
                      </div>
                      <div className="flex items-center space-x-1">
                        <RadioGroupItem value="monthly" id="monthly" className="sr-only" />
                        <Label 
                          htmlFor="monthly" 
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${salaryType === 'monthly' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted text-muted-foreground'}`}
                        >
                          Monthly
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                </CardHeader>

                <CardContent className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Basic input value */}
                    <div className="space-y-2">
                      <Label htmlFor="salary-input" className="text-xs font-bold uppercase tracking-wider">
                        {salaryType === 'annual' ? 'Cost to Company (Annual CTC) (₹)' : 'Monthly Gross CTC (₹)'}
                      </Label>
                      <Input
                        id="salary-input"
                        type="number"
                        value={inputVal === 0 ? '' : inputVal}
                        placeholder={salaryType === 'annual' ? '1200000' : '100000'}
                        onChange={(e) => setInputVal(Number(e.target.value))}
                        className="rounded-xl h-11"
                      />
                    </div>

                    {/* Tax Regime Selection */}
                    <div className="space-y-2">
                      <Label htmlFor="regime-select" className="text-xs font-bold uppercase tracking-wider">Tax Regime (FY 2026-27)</Label>
                      <Select value={taxRegime} onValueChange={(val: any) => setTaxRegime(val)}>
                        <SelectTrigger id="regime-select" className="rounded-xl h-11"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">New Regime (Recommended - ₹75k Standard Ded.)</SelectItem>
                          <SelectItem value="old">Old Regime (Allows 80C, HRA, Medical)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* State Selection for PT */}
                    <div className="space-y-2">
                      <Label htmlFor="state-select" className="text-xs font-bold uppercase tracking-wider">Professional Tax State</Label>
                      <Select value={statePT} onValueChange={(val) => setStatePT(val)}>
                        <SelectTrigger id="state-select" className="rounded-xl h-11"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Karnataka">Karnataka (₹200/m if &gt;25k)</SelectItem>
                          <SelectItem value="Telangana">Telangana (₹200/m if &gt;20k)</SelectItem>
                          <SelectItem value="Tamil Nadu">Tamil Nadu (Slabs up to ₹208/m)</SelectItem>
                          <SelectItem value="Maharashtra">Maharashtra (₹200/m if &gt;10k)</SelectItem>
                          <SelectItem value="Kerala">Kerala (Slabs up to ₹208/m)</SelectItem>
                          <SelectItem value="Delhi">Delhi (No PT)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Calculate PF Automatically Checkbox */}
                    <div className="flex items-center space-x-2 pt-8">
                      <Checkbox 
                        id="auto-pf" 
                        checked={autoPF} 
                        onCheckedChange={(checked) => setAutoPF(checked as boolean)} 
                        className="rounded-md"
                      />
                      <label htmlFor="auto-pf" className="text-xs font-bold uppercase tracking-wider cursor-pointer">
                        Calculate PF Automatically (12% of Basic)
                      </label>
                    </div>
                  </div>

                  {/* CTC breakdown details */}
                  <div className="border-t pt-6 space-y-4">
                    <h3 className="font-bold text-xs uppercase tracking-wider text-primary">Salary Earnings Structure (Monthly Details)</h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="basic-salary" className="text-[11px] font-bold text-muted-foreground uppercase">Basic Salary (Annual) (₹)</Label>
                        <Input 
                          id="basic-salary" 
                          type="number" 
                          value={basic === 0 ? '' : basic} 
                          placeholder="e.g. 500000" 
                          onChange={(e) => setBasic(Number(e.target.value))} 
                          className="rounded-xl"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="hra-allowance" className="text-[11px] font-bold text-muted-foreground uppercase">HRA Allowance (Annual) (₹)</Label>
                        <Input 
                          id="hra-allowance" 
                          type="number" 
                          value={hra === 0 ? '' : hra} 
                          placeholder="e.g. 250000" 
                          onChange={(e) => setHra(Number(e.target.value))} 
                          className="rounded-xl"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="special-allowance" className="text-[11px] font-bold text-muted-foreground uppercase">Special Allowance (Annual) (₹)</Label>
                        <Input 
                          id="special-allowance" 
                          type="number" 
                          value={special === 0 ? '' : special} 
                          placeholder="e.g. 300000" 
                          onChange={(e) => setSpecial(Number(e.target.value))} 
                          className="rounded-xl"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="other-allowances" className="text-[11px] font-bold text-muted-foreground uppercase">Other Allowances (Annual) (₹)</Label>
                        <Input 
                          id="other-allowances" 
                          type="number" 
                          value={otherAllowances === 0 ? '' : otherAllowances} 
                          placeholder="e.g. 50000" 
                          onChange={(e) => setOtherAllowances(Number(e.target.value))} 
                          className="rounded-xl"
                        />
                      </div>
                    </div>

                    {!autoPF && (
                      <div className="space-y-2 pt-2 border-t">
                        <Label htmlFor="custom-pf-input" className="text-[11px] font-bold text-muted-foreground uppercase">Custom Employee PF Contribution (Monthly) (₹)</Label>
                        <Input 
                          id="custom-pf-input" 
                          type="number" 
                          value={customPF === 0 ? '' : customPF} 
                          placeholder="e.g. 1800" 
                          onChange={(e) => setCustomPF(Number(e.target.value))} 
                          className="rounded-xl"
                        />
                      </div>
                    )}
                  </div>

                  {/* Gratuity and Insurance Contributions */}
                  <div className="border-t pt-6 space-y-4">
                    <h3 className="font-bold text-xs uppercase tracking-wider text-primary">Other CTC Components & Deductions</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="gratuity" className="text-[11px] font-bold text-muted-foreground uppercase">Gratuity Contribution (Annual) (₹)</Label>
                        <Input id="gratuity" type="number" value={gratuity === 0 ? '' : gratuity} onChange={(e) => setGratuity(Number(e.target.value))} className="rounded-xl" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="insurance" className="text-[11px] font-bold text-muted-foreground uppercase">Employer Insurance (Annual) (₹)</Label>
                        <Input id="insurance" type="number" value={insurance === 0 ? '' : insurance} onChange={(e) => setInsurance(Number(e.target.value))} className="rounded-xl" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="other-deductions" className="text-[11px] font-bold text-muted-foreground uppercase">Other Monthly Deductions (₹)</Label>
                        <Input id="other-deductions" type="number" value={otherDeductions === 0 ? '' : otherDeductions} onChange={(e) => setOtherDeductions(Number(e.target.value))} className="rounded-xl" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="nps-employee" className="text-[11px] font-bold text-muted-foreground uppercase">NPS Employee Contribution (Monthly) (₹)</Label>
                        <Input id="nps-employee" type="number" value={npsEmployee === 0 ? '' : npsEmployee} onChange={(e) => setNpsEmployee(Number(e.target.value))} className="rounded-xl" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Calculations Breakdown & Visualizations Column */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Take-Home Results Card */}
              <Card className="shadow-md border-primary/5 bg-primary/[0.02]">
                <CardHeader className="bg-primary/5 border-b p-4">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Calculated Net Pay</CardTitle>
                    <Select value={displayTerm} onValueChange={(val: any) => setDisplayTerm(val)}>
                      <SelectTrigger className="w-28 h-8 rounded-lg"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="annual">Annual</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  {/* Big Number Display */}
                  <div className="text-center space-y-1">
                    <p className="text-xs uppercase font-extrabold text-muted-foreground tracking-wider">Estimated In-Hand Salary</p>
                    <p className="text-4xl font-black text-emerald-600 italic">
                      {displayTerm === 'monthly' ? formatCurrency(calculations.netTakeHomeMonthly) : formatCurrency(calculations.netTakeHomeAnnual)}
                    </p>
                    <p className="text-[10px] text-muted-foreground">Based on {taxRegime === 'new' ? 'New' : 'Old'} Tax Regime slabs (FY 2026-27)</p>
                  </div>

                  {/* Step-by-Step CTC breakdown panel */}
                  <div className="space-y-3 border-t pt-4">
                    <div className="flex justify-between text-xs font-bold uppercase tracking-wide">
                      <span className="text-muted-foreground">Total CTC Cost:</span>
                      <span>{formatCurrency(displayTerm === 'monthly' ? annualCTC / 12 : annualCTC)}</span>
                    </div>

                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">- Employer PF:</span>
                      <span className="font-semibold text-destructive">{formatCurrency(displayTerm === 'monthly' ? calculations.employerPFMonthly : calculations.employerPFAnnual)}</span>
                    </div>

                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">- Gratuity Contribution:</span>
                      <span className="font-semibold text-destructive">{formatCurrency(displayTerm === 'monthly' ? gratuity / 12 : gratuity)}</span>
                    </div>

                    <div className="flex justify-between text-xs border-t pt-2 font-bold uppercase tracking-wide">
                      <span className="text-foreground">Gross Salary:</span>
                      <span>{formatCurrency(displayTerm === 'monthly' ? calculations.grossMonthly : calculations.grossAnnual)}</span>
                    </div>

                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">- Employee PF (12%):</span>
                      <span className="font-semibold text-destructive">{formatCurrency(displayTerm === 'monthly' ? calculations.employeePFMonthly : calculations.employeePFAnnual)}</span>
                    </div>

                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">- Professional Tax (PT):</span>
                      <span className="font-semibold text-destructive">{formatCurrency(displayTerm === 'monthly' ? calculations.ptMonthly : calculations.ptAnnual)}</span>
                    </div>

                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">- Estimated TDS / Tax:</span>
                      <span className="font-semibold text-destructive">{formatCurrency(displayTerm === 'monthly' ? calculations.taxMonthly : calculations.taxAnnual)}</span>
                    </div>

                    <div className="flex justify-between text-xs border-t pt-2 font-black uppercase text-emerald-600">
                      <span>Net In-hand Take-home:</span>
                      <span>{displayTerm === 'monthly' ? formatCurrency(calculations.netTakeHomeMonthly) : formatCurrency(calculations.netTakeHomeAnnual)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* CTC Pie Chart Card */}
              <Card className="shadow-md border-primary/5">
                <CardHeader className="p-4 bg-muted/30 border-b">
                  <CardTitle className="text-xs font-bold uppercase tracking-wider">Salary CTC Cost Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="p-4 h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={75}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                      <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '10px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Saved History Log & Tracker */}
              <Card className="shadow-md border-primary/5">
                <CardHeader className="p-4 bg-muted/30 border-b flex flex-row justify-between items-center">
                  <CardTitle className="text-xs font-bold uppercase tracking-wider flex items-center gap-1"><History className="h-4 w-4 text-primary" /> Salary Progression Log</CardTitle>
                  {savedHistory.length > 0 && <Button variant="ghost" onClick={clearHistory} className="text-[10px] uppercase font-bold text-destructive hover:bg-destructive/15 h-6 px-2">Clear</Button>}
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                  <div className="flex gap-2">
                    <Input 
                      placeholder="Year (e.g. 2025)" 
                      value={historyYear} 
                      onChange={(e) => setHistoryYear(e.target.value)} 
                      className="rounded-xl h-9 text-xs" 
                    />
                    <Button onClick={saveToHistory} className="rounded-xl h-9 text-xs px-3 font-bold">Save Current</Button>
                  </div>

                  {savedHistory.length > 0 ? (
                    <div className="space-y-4">
                      <div className="h-40">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={savedHistory}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="year" tick={{ fontSize: 9 }} />
                            <YAxis tick={{ fontSize: 9 }} />
                            <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                            <Line type="monotone" dataKey="takeHome" stroke="#10B981" strokeWidth={2} name="Annual Net In-Hand" />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                        {savedHistory.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-xs bg-muted/30 p-2 rounded-lg border">
                            <span className="font-bold">{item.year}</span>
                            <span className="text-muted-foreground">CTC: {formatCurrency(item.ctc)}</span>
                            <span className="font-extrabold text-emerald-600">Net: {formatCurrency(item.takeHome)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="text-[10px] text-muted-foreground text-center py-4">No progression logged yet. Enter past years and save to see a growth graph.</p>
                  )}
                </CardContent>
              </Card>

            </div>
          </div>

          {/* Corporate Payslip Generator Section */}
          <Card className="shadow-md border-primary/5 print:border-none print:shadow-none mt-6">
            <CardHeader className="bg-muted/40 border-b p-6 print:hidden">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <div>
                  <CardTitle className="text-base font-bold uppercase tracking-wider flex items-center gap-1.5"><FileText className="h-5 w-5 text-primary" /> Live Salary Slip Preview</CardTitle>
                  <CardDescription className="text-xs">Perfect mock-up representation of standard Indian company payslips based on calculated items.</CardDescription>
                </div>
                <Button onClick={triggerPrintPayslip} variant="outline" className="rounded-xl text-xs font-bold gap-1.5"><Download className="h-4 w-4" /> Download / Print Payslip</Button>
              </div>
            </CardHeader>
            <CardContent className="p-8 space-y-6 max-w-3xl mx-auto border-2 border-border/80 rounded-2xl print:border-none print:shadow-none print:my-0">
              {/* Slip Header */}
              <div className="text-center border-b-2 pb-4 space-y-1.5">
                <h2 className="text-xl font-black italic tracking-tighter text-primary">ABC CORPORATION PVT. LTD.</h2>
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Payslip for the month of {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}</p>
              </div>

              {/* Employee & Payslip metadata */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <p className="text-muted-foreground">Employee Name: <span className="font-bold text-foreground">John Doe</span></p>
                  <p className="text-muted-foreground">Designation: <span className="font-bold text-foreground">Associate Engineer</span></p>
                  <p className="text-muted-foreground">Department: <span className="font-bold text-foreground">Technology</span></p>
                </div>
                <div className="text-right">
                  <p className="text-muted-foreground">Tax Regime: <span className="font-bold text-foreground">{taxRegime === 'new' ? 'New Regime (FY 2026-27)' : 'Old Regime'}</span></p>
                  <p className="text-muted-foreground">State for PT: <span className="font-bold text-foreground">{statePT}</span></p>
                  <p className="text-muted-foreground">Payment Mode: <span className="font-bold text-foreground">Bank Transfer</span></p>
                </div>
              </div>

              {/* Salary items tables */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t-2 pt-6">
                
                {/* Earnings List */}
                <div className="space-y-3">
                  <h4 className="font-extrabold text-xs text-primary border-b pb-1.5 uppercase tracking-wider">Earnings (Monthly)</h4>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between"><span>Basic Salary</span><span className="font-bold">{formatCurrency(calculations.basicMonthly)}</span></div>
                    <div className="flex justify-between"><span>HRA</span><span className="font-bold">{formatCurrency(calculations.hraMonthly)}</span></div>
                    <div className="flex justify-between"><span>Special Allowance</span><span className="font-bold">{formatCurrency(calculations.specialMonthly)}</span></div>
                    <div className="flex justify-between"><span>Other Allowances</span><span className="font-bold">{formatCurrency(calculations.otherAllowancesMonthly)}</span></div>
                    <div className="flex justify-between border-t pt-2 font-bold"><span>Total Earnings (Gross)</span><span>{formatCurrency(calculations.grossMonthly)}</span></div>
                  </div>
                </div>

                {/* Deductions List */}
                <div className="space-y-3">
                  <h4 className="font-extrabold text-xs text-primary border-b pb-1.5 uppercase tracking-wider">Deductions (Monthly)</h4>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between"><span>Employee PF</span><span className="font-bold text-destructive">-{formatCurrency(calculations.employeePFMonthly)}</span></div>
                    <div className="flex justify-between"><span>Professional Tax (PT)</span><span className="font-bold text-destructive">-{formatCurrency(calculations.ptMonthly)}</span></div>
                    <div className="flex justify-between"><span>Income Tax (TDS)</span><span className="font-bold text-destructive">-{formatCurrency(calculations.taxMonthly)}</span></div>
                    {calculations.employeeESIMonthly > 0 && <div className="flex justify-between"><span>ESI Deduction</span><span className="font-bold text-destructive">-{formatCurrency(calculations.employeeESIMonthly)}</span></div>}
                    {npsEmployee > 0 && <div className="flex justify-between"><span>NPS Contribution</span><span className="font-bold text-destructive">-{formatCurrency(npsEmployee)}</span></div>}
                    {otherDeductions > 0 && <div className="flex justify-between"><span>Other Deductions</span><span className="font-bold text-destructive">-{formatCurrency(Math.round(otherDeductions / 12))}</span></div>}
                    <div className="flex justify-between border-t pt-2 font-bold"><span>Total Deductions</span><span>{formatCurrency(calculations.totalDeductionsMonthly)}</span></div>
                  </div>
                </div>
              </div>

              {/* Net pay summary line */}
              <div className="bg-muted/50 p-4 border rounded-2xl flex justify-between items-center text-sm font-black italic tracking-tight border-primary/10">
                <span className="uppercase text-primary">NET PAY / TAKE-HOME:</span>
                <span className="text-emerald-600 text-lg">{formatCurrency(calculations.netTakeHomeMonthly)}</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Compare Offers */}
        <TabsContent value="compare" className="space-y-6 mt-4 animate-in slide-in-from-bottom duration-300">
          <Card className="shadow-md border-primary/5">
            <CardHeader className="bg-primary/5 border-b p-6">
              <CardTitle className="text-base font-bold uppercase tracking-wider flex items-center gap-1.5"><ArrowRightLeft className="h-5 w-5 text-primary" /> Offer Comparison (Company A vs Company B)</CardTitle>
              <CardDescription className="text-xs">Compare two CTC job offers side-by-side to discover which generates the highest net in-hand monthly pay.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Company A Card */}
                <div className="bg-muted/15 border p-5 rounded-2xl space-y-4">
                  <h3 className="font-black text-sm text-primary uppercase border-b pb-2">Offer A (Company A)</h3>
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <Label htmlFor="ctc-a" className="text-xs font-bold uppercase text-muted-foreground">Annual CTC (₹)</Label>
                      <Input id="ctc-a" type="number" value={compCTC_A === 0 ? '' : compCTC_A} onChange={(e) => setCompCTC_A(Number(e.target.value))} />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="state-a" className="text-xs font-bold uppercase text-muted-foreground">Work State (for PT)</Label>
                      <Select value={compState_A} onValueChange={(val) => setCompState_A(val)}>
                        <SelectTrigger id="state-a"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Karnataka">Karnataka</SelectItem>
                          <SelectItem value="Telangana">Telangana</SelectItem>
                          <SelectItem value="Delhi">Delhi</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="regime-a" className="text-xs font-bold uppercase text-muted-foreground">Tax Regime</Label>
                      <Select value={compRegime_A} onValueChange={(val: any) => setCompRegime_A(val)}>
                        <SelectTrigger id="regime-a"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">New Regime</SelectItem>
                          <SelectItem value="old">Old Regime</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="border-t pt-4 space-y-1 text-center">
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Estimated Monthly Net In-Hand</p>
                    <p className="text-2xl font-black text-primary">{formatCurrency(comparisonResults.offerA.netMonthly)}</p>
                  </div>
                </div>

                {/* Company B Card */}
                <div className="bg-muted/15 border p-5 rounded-2xl space-y-4">
                  <h3 className="font-black text-sm text-primary uppercase border-b pb-2">Offer B (Company B)</h3>
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <Label htmlFor="ctc-b" className="text-xs font-bold uppercase text-muted-foreground">Annual CTC (₹)</Label>
                      <Input id="ctc-b" type="number" value={compCTC_B === 0 ? '' : compCTC_B} onChange={(e) => setCompCTC_B(Number(e.target.value))} />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="state-b" className="text-xs font-bold uppercase text-muted-foreground">Work State (for PT)</Label>
                      <Select value={compState_B} onValueChange={(val) => setCompState_B(val)}>
                        <SelectTrigger id="state-b"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Karnataka">Karnataka</SelectItem>
                          <SelectItem value="Telangana">Telangana</SelectItem>
                          <SelectItem value="Delhi">Delhi</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="regime-b" className="text-xs font-bold uppercase text-muted-foreground">Tax Regime</Label>
                      <Select value={compRegime_B} onValueChange={(val: any) => setCompRegime_B(val)}>
                        <SelectTrigger id="regime-b"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">New Regime</SelectItem>
                          <SelectItem value="old">Old Regime</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="border-t pt-4 space-y-1 text-center">
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Estimated Monthly Net In-Hand</p>
                    <p className="text-2xl font-black text-primary">{formatCurrency(comparisonResults.offerB.netMonthly)}</p>
                  </div>
                </div>
              </div>

              {/* Decision helper alert */}
              <div className="bg-primary/5 border border-primary/20 p-5 rounded-2xl text-center space-y-2">
                <h4 className="font-extrabold text-xs uppercase tracking-wider text-primary">Offer Breakdown Verdict</h4>
                <p className="text-sm">
                  {comparisonResults.offerA.netMonthly > comparisonResults.offerB.netMonthly ? (
                    <>
                      <strong className="text-emerald-600 font-bold">Offer A</strong> yields higher monthly take-home salary by{' '}
                      <span className="font-bold text-base text-emerald-600">
                        {formatCurrency(comparisonResults.offerA.netMonthly - comparisonResults.offerB.netMonthly)}
                      </span>{' '}
                      ({formatCurrency((comparisonResults.offerA.netMonthly - comparisonResults.offerB.netMonthly) * 12)} annually).
                    </>
                  ) : comparisonResults.offerB.netMonthly > comparisonResults.offerA.netMonthly ? (
                    <>
                      <strong className="text-emerald-600 font-bold">Offer B</strong> yields higher monthly take-home salary by{' '}
                      <span className="font-bold text-base text-emerald-600">
                        {formatCurrency(comparisonResults.offerB.netMonthly - comparisonResults.offerA.netMonthly)}
                      </span>{' '}
                      ({formatCurrency((comparisonResults.offerB.netMonthly - comparisonResults.offerA.netMonthly) * 12)} annually).
                    </>
                  ) : (
                    <>Both offers produce identical monthly take-home earnings!</>
                  )}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: HRA Exemption Calculator */}
        <TabsContent value="taxexempt" className="space-y-6 mt-4 animate-in slide-in-from-bottom duration-300">
          <Card className="shadow-md border-primary/5">
            <CardHeader className="bg-primary/5 border-b p-6">
              <CardTitle className="text-base font-bold uppercase tracking-wider flex items-center gap-1.5"><Percent className="h-5 w-5 text-primary" /> House Rent Allowance (HRA) Exemption Calculator</CardTitle>
              <CardDescription className="text-xs">Estimate how much of your HRA is exempt from tax under Income Tax Act Section 10(13A).</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Inputs */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="hra-basic" className="text-xs font-bold uppercase tracking-wider">Basic Monthly Salary (₹)</Label>
                    <Input id="hra-basic" type="number" value={hraBasic === 0 ? '' : hraBasic} onChange={(e) => setHraBasic(Number(e.target.value))} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hra-received" className="text-xs font-bold uppercase tracking-wider">HRA Allowance Received (Monthly) (₹)</Label>
                    <Input id="hra-received" type="number" value={hraReceived === 0 ? '' : hraReceived} onChange={(e) => setHraReceived(Number(e.target.value))} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hra-rent" className="text-xs font-bold uppercase tracking-wider">Actual Rent Paid (Monthly) (₹)</Label>
                    <Input id="hra-rent" type="number" value={hraRentPaid === 0 ? '' : hraRentPaid} onChange={(e) => setHraRentPaid(Number(e.target.value))} />
                  </div>
                  <div className="flex items-center space-x-2 pt-2">
                    <Checkbox id="hra-metro" checked={hraMetro} onCheckedChange={(val) => setHraMetro(val as boolean)} />
                    <Label htmlFor="hra-metro" className="text-xs font-bold uppercase tracking-wider cursor-pointer">Live in Metro City (Delhi, Mumbai, Kolkata, Chennai)</Label>
                  </div>
                </div>

                {/* Outputs Panel */}
                <div className="bg-muted/15 border p-5 rounded-2xl flex flex-col justify-between space-y-6">
                  <h3 className="font-black text-sm text-primary uppercase border-b pb-2">Tax Exemption Summary</h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Exempt HRA (Monthly):</span>
                      <span className="font-extrabold text-emerald-600">{formatCurrency(hraExemption.exemptMonthly)}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Taxable HRA (Monthly):</span>
                      <span className="font-bold text-destructive">{formatCurrency(hraExemption.taxableMonthly)}</span>
                    </div>
                    <div className="flex justify-between text-xs border-t pt-2">
                      <span className="text-muted-foreground">Exempt HRA (Annual):</span>
                      <span className="font-extrabold text-emerald-600">{formatCurrency(hraExemption.exemptAnnual)}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Taxable HRA (Annual):</span>
                      <span className="font-bold text-destructive">{formatCurrency(hraExemption.taxableAnnual)}</span>
                    </div>
                  </div>

                  <p className="text-[10px] text-muted-foreground italic leading-tight">
                    *Exemption calculated using the lowest of three limits: 1) Actual HRA received, 2) Rent paid minus 10% of Basic, 3) 50% (Metro) or 40% (Non-Metro) of Basic.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 4: Auxiliary Tools Grid */}
        <TabsContent value="auxiliary" className="space-y-6 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Overtime Calculator */}
            <Card className="shadow-md border-primary/5">
              <CardHeader className="bg-muted/30 border-b p-4">
                <CardTitle className="text-xs font-bold uppercase tracking-wider">Overtime Payout Calculator</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                <div className="grid grid-cols-3 gap-2">
                  <div className="space-y-1">
                    <Label className="text-[10px] font-bold uppercase">Basic Salary</Label>
                    <Input type="number" value={otSalary === 0 ? '' : otSalary} onChange={(e) => setOtSalary(Number(e.target.value))} className="h-9 text-xs" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10px] font-bold uppercase">Working Days</Label>
                    <Input type="number" value={otDays === 0 ? '' : otDays} onChange={(e) => setOtDays(Number(e.target.value))} className="h-9 text-xs" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10px] font-bold uppercase">OT Hours</Label>
                    <Input type="number" value={otHours === 0 ? '' : otHours} onChange={(e) => setOtHours(Number(e.target.value))} className="h-9 text-xs" />
                  </div>
                </div>
                <div className="border-t pt-3 flex justify-between items-center text-xs">
                  <span className="text-muted-foreground">Estimated Overtime Earned:</span>
                  <span className="font-extrabold text-emerald-600">
                    {formatCurrency(Math.round((otSalary / otDays / 8) * 1.5 * otHours))}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Leave Deduction Calculator */}
            <Card className="shadow-md border-primary/5">
              <CardHeader className="bg-muted/30 border-b p-4">
                <CardTitle className="text-xs font-bold uppercase tracking-wider">Leave Deduction Calculator</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                <div className="grid grid-cols-3 gap-2">
                  <div className="space-y-1">
                    <Label className="text-[10px] font-bold uppercase">Salary (₹)</Label>
                    <Input type="number" value={leaveSalary === 0 ? '' : leaveSalary} onChange={(e) => setLeaveSalary(Number(e.target.value))} className="h-9 text-xs" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10px] font-bold uppercase">Work Days</Label>
                    <Input type="number" value={leaveDays === 0 ? '' : leaveDays} onChange={(e) => setLeaveDays(Number(e.target.value))} className="h-9 text-xs" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10px] font-bold uppercase">Leaves Taken</Label>
                    <Input type="number" value={leavesTaken === 0 ? '' : leavesTaken} onChange={(e) => setLeavesTaken(Number(e.target.value))} className="h-9 text-xs" />
                  </div>
                </div>
                <div className="border-t pt-3 flex justify-between items-center text-xs">
                  <span className="text-muted-foreground">Net Pay After Deduction:</span>
                  <span className="font-extrabold text-emerald-600">
                    {formatCurrency(Math.round(leaveSalary - (leaveSalary / leaveDays) * leavesTaken))}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Salary Increment Calculator */}
            <Card className="shadow-md border-primary/5">
              <CardHeader className="bg-muted/30 border-b p-4">
                <CardTitle className="text-xs font-bold uppercase tracking-wider">Salary Increment / Appraisal Calculator</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label className="text-[10px] font-bold uppercase">Current CTC (₹)</Label>
                    <Input type="number" value={incSalary === 0 ? '' : incSalary} onChange={(e) => setIncSalary(Number(e.target.value))} className="h-9 text-xs" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10px] font-bold uppercase">Appraisal (%)</Label>
                    <Input type="number" value={incPercent === 0 ? '' : incPercent} onChange={(e) => setIncPercent(Number(e.target.value))} className="h-9 text-xs" />
                  </div>
                </div>
                <div className="border-t pt-3 flex justify-between items-center text-xs">
                  <span className="text-muted-foreground">New CTC Post Appraisal:</span>
                  <span className="font-extrabold text-emerald-600">
                    {formatCurrency(Math.round(incSalary * (1 + incPercent / 100)))}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Notice Period Recovery */}
            <Card className="shadow-md border-primary/5">
              <CardHeader className="bg-muted/30 border-b p-4">
                <CardTitle className="text-xs font-bold uppercase tracking-wider">Notice Period Buyout/Recovery</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                <div className="grid grid-cols-3 gap-2">
                  <div className="space-y-1">
                    <Label className="text-[10px] font-bold uppercase">Gross Salary (₹)</Label>
                    <Input type="number" value={noticeSalary === 0 ? '' : noticeSalary} onChange={(e) => setNoticeSalary(Number(e.target.value))} className="h-9 text-xs" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10px] font-bold uppercase">Required Days</Label>
                    <Input type="number" value={noticeRequired === 0 ? '' : noticeRequired} onChange={(e) => setNoticeRequired(Number(e.target.value))} className="h-9 text-xs" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10px] font-bold uppercase">Served Days</Label>
                    <Input type="number" value={noticeServed === 0 ? '' : noticeServed} onChange={(e) => setNoticeServed(Number(e.target.value))} className="h-9 text-xs" />
                  </div>
                </div>
                <div className="border-t pt-3 flex justify-between items-center text-xs">
                  <span className="text-muted-foreground">Recovery Amount Due:</span>
                  <span className="font-extrabold text-destructive">
                    {formatCurrency(Math.round((noticeSalary / 30) * Math.max(0, noticeRequired - noticeServed)))}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* SEO prose guide */}
      <section className="mt-12 space-y-8 prose prose-slate dark:prose-invert max-w-none print:hidden">
        <div className="bg-primary/5 rounded-2xl p-6 md:p-10 border border-primary/10">
          <h2 className="text-3xl font-bold font-headline mb-6">Why Use Our Indian Corporate Salary Suite?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm leading-relaxed">
            <div className="space-y-4">
              <p>
                <strong className="text-primary font-bold">Indian Salary Structure Compliance:</strong> Standard salary calculators only deduct generic tax and PF. Our tool splits your CTC into **Basic, HRA, Special Allowance, Employer Contributions, Gratuity, state-wise PT**, and compares old vs new tax regimes for FY 2026-27 so you know your true take-home.
              </p>
              <p>
                <strong className="text-primary font-bold">Visual Splits & PDF Slips:</strong> Instantly check your CTC breakdown via an interactive Pie Chart, preview salary progression graphs, and generate printable mock payslips.
              </p>
            </div>
            <div className="space-y-4">
              <p>
                <strong className="text-primary font-bold">Step-by-Step Salary Walkthrough:</strong>
              </p>
              <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                <li>Input your target Annual CTC or Monthly CTC.</li>
                <li>Choose a state (like Telangana or Karnataka) for exact Professional Tax calculations.</li>
                <li>Compare Old vs New regime tax options side-by-side.</li>
                <li>Toggle the Monthly/Annual display, save history records locally, or trigger PDF printing.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
