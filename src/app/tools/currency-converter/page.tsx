'use client';
import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowRightLeft } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

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
            <Alert>
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
  );
}
