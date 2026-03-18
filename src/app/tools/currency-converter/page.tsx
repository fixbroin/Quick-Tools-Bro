'use client';
import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowRightLeft } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { scrollToDownload } from '@/lib/utils';

// Hardcoded exchange rates relative to USD
const rates: { [key: string]: { name: string, rate: number } } = {
  USD: { name: 'United States Dollar', rate: 1 },
  EUR: { name: 'Euro', rate: 0.92 },
  JPY: { name: 'Japanese Yen', rate: 157.6 },
  GBP: { name: 'British Pound', rate: 0.78 },
  AUD: { name: 'Australian Dollar', rate: 1.5 },
  CAD: { name: 'Canadian Dollar', rate: 1.37 },
  CHF: { name: 'Swiss Franc', rate: 0.9 },
  CNY: { name: 'Chinese Yuan', rate: 7.25 },
  INR: { name: 'Indian Rupee', rate: 83.5 },
  BRL: { name: 'Brazilian Real', rate: 5.35 },
  RUB: { name: 'Russian Ruble', rate: 89.0 },
  ZAR: { name: 'South African Rand', rate: 18.7 },
};

const currencies = Object.keys(rates).map(code => ({
    code,
    description: rates[code].name
})).sort((a,b) => a.code.localeCompare(b.code));

export default function CurrencyConverterPage() {
  const [amount, setAmount] = useState('1');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('INR');
  const [result, setResult] = useState<number | null>(null);

  const handleConversion = useCallback(() => {
    const parsedAmount = parseFloat(amount);
    if(isNaN(parsedAmount)) {
        setResult(null);
        return;
    }
    
    const fromRate = rates[fromCurrency].rate;
    const toRate = rates[toCurrency].rate;
    
    // Convert amount to USD first, then to the target currency
    const amountInUsd = parsedAmount / fromRate;
    const convertedAmount = amountInUsd * toRate;

    setResult(convertedAmount);
    scrollToDownload();
  }, [amount, fromCurrency, toCurrency]);

  // Perform initial conversion on load
  useEffect(() => {
    handleConversion();
  }, [handleConversion]);


  const handleSwapCurrencies = () => {
    const newFrom = toCurrency;
    const newTo = fromCurrency;
    setFromCurrency(newFrom);
    setToCurrency(newTo);
  };
  
  return (
    <>
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Currency Converter</CardTitle>
        <CardDescription>Convert between currencies using fixed rates.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-[2fr_auto_2fr] gap-2 items-center">
                  <div className="space-y-2">
                    <Label htmlFor="from-currency">From</Label>
                    <Select value={fromCurrency} onValueChange={setFromCurrency}>
                        <SelectTrigger id="from-currency"><SelectValue/></SelectTrigger>
                        <SelectContent>
                            {currencies.map(c => <SelectItem key={c.code} value={c.code}>{c.code} - {c.description}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
                <Button variant="ghost" size="icon" className="self-end" onClick={handleSwapCurrencies} aria-label="Swap currencies">
                    <ArrowRightLeft className="h-4 w-4"/>
                </Button>
                <div className="space-y-2">
                    <Label htmlFor="to-currency">To</Label>
                     <Select value={toCurrency} onValueChange={setToCurrency}>
                        <SelectTrigger id="to-currency"><SelectValue/></SelectTrigger>
                        <SelectContent>
                            {currencies.map(c => <SelectItem key={c.code} value={c.code}>{c.code} - {c.description}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
            </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <Input id="amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
            </div>
            <Button onClick={handleConversion}>
                Convert
            </Button>
        </div>
      </CardContent>
      {result !== null && (
        <CardFooter>
            <Alert id="download-section">
                <AlertTitle className="text-xl font-bold font-headline">Converted Amount</AlertTitle>
                <AlertDescription className="text-3xl text-primary font-bold mt-2">
                    {result.toLocaleString(undefined, { maximumFractionDigits: 4, style: 'currency', currency: toCurrency, currencyDisplay: 'symbol' })}
                </AlertDescription>
                 <AlertDescription className="text-sm text-muted-foreground mt-2">
                    {parseFloat(amount).toLocaleString()} {fromCurrency} = {result.toLocaleString(undefined, { maximumFractionDigits: 4 })} {toCurrency}
                </AlertDescription>
                 <AlertDescription className="text-xs text-muted-foreground mt-4">
                    *Rates are for informational purposes only and may not be up-to-date.
                </AlertDescription>
            </Alert>
        </CardFooter>
      )}
    </Card>

    <section className="mt-12 space-y-8 prose prose-slate dark:prose-invert max-w-none">
        <div className="bg-primary/5 rounded-2xl p-6 md:p-10 border border-primary/10">
            <h2 className="text-3xl font-bold font-headline mb-6">Why Use Our Currency Converter?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm leading-relaxed">
                <div className="space-y-4">
                    <p>
                        <strong className="text-primary font-bold">Fast & Simple:</strong> Our currency converter is designed for speed and ease of use. Whether you're a traveler planning your next trip or a business professional tracking international payments, our tool provides instant conversions between major global currencies.
                    </p>
                    <p>
                        We support a wide range of currencies, including USD, EUR, GBP, JPY, INR, and many more, making it a versatile tool for all your financial conversion needs.
                    </p>
                </div>
                <div className="space-y-4">
                    <p>
                        <strong className="text-primary font-bold">Key Benefits:</strong>
                    </p>
                    <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                        <li>Instant multi-currency support</li>
                        <li>Clean, intuitive interface</li>
                        <li>Works on all devices (Mobile, Tablet, Desktop)</li>
                        <li>Completely free to use</li>
                    </ul>
                </div>
            </div>
        </div>

        <div className="space-y-6">
            <h2 className="text-2xl font-bold font-headline">Frequently Asked Questions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-xl border border-border/50 bg-card hover:border-primary/50 transition-colors">
                    <h4 className="font-bold mb-2 text-base">How accurate are these rates?</h4>
                    <p className="text-muted-foreground text-sm">The rates provided are based on general market averages and are intended for informational purposes. For actual transactions, please check with your financial institution.</p>
                </div>
                <div className="p-6 rounded-xl border border-border/50 bg-card hover:border-primary/50 transition-colors">
                    <h4 className="font-bold mb-2 text-base">Which currencies do you support?</h4>
                    <p className="text-muted-foreground text-sm">We support major world currencies including the US Dollar, Euro, British Pound, Japanese Yen, Indian Rupee, Australian Dollar, and more.</p>
                </div>
                <div className="p-6 rounded-xl border border-border/50 bg-card hover:border-primary/50 transition-colors">
                    <h4 className="font-bold mb-2 text-base">Is this converter free to use?</h4>
                    <p className="text-muted-foreground text-sm">Yes, our currency converter is 100% free and requires no registration or personal information.</p>
                </div>
                <div className="p-6 rounded-xl border border-border/50 bg-card hover:border-primary/50 transition-colors">
                    <h4 className="font-bold mb-2 text-base">Can I use this on my phone?</h4>
                    <p className="text-muted-foreground text-sm">Absolutely! Our tool is fully responsive and works perfectly on smartphones and tablets.</p>
                </div>
            </div>
        </div>
    </section>
    </>
  );
}
