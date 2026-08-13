'use client';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowRightLeft } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { cn, scrollToDownload } from '@/lib/utils';

// Hardcoded exchange rates relative to USD (fallback)
const fallbackRates: { [key: string]: { name: string, rate: number } } = {
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
  AED: { name: 'United Arab Emirates Dirham', rate: 3.67 },
  SGD: { name: 'Singapore Dollar', rate: 1.35 },
  SAR: { name: 'Saudi Riyal', rate: 3.75 },
  NZD: { name: 'New Zealand Dollar', rate: 1.63 },
  MYR: { name: 'Malaysian Ringgit', rate: 4.72 },
};

const currencyNames: { [key: string]: { units: string, singular: string, fraction: string, fracSingular: string } } = {
  USD: { units: 'dollars', singular: 'dollar', fraction: 'cents', fracSingular: 'cent' },
  EUR: { units: 'euros', singular: 'euro', fraction: 'cents', fracSingular: 'cent' },
  JPY: { units: 'yen', singular: 'yen', fraction: 'sen', fracSingular: 'sen' },
  GBP: { units: 'pounds', singular: 'pound', fraction: 'pence', fracSingular: 'penny' },
  AUD: { units: 'dollars', singular: 'dollar', fraction: 'cents', fracSingular: 'cent' },
  CAD: { units: 'dollars', singular: 'dollar', fraction: 'cents', fracSingular: 'cent' },
  CHF: { units: 'francs', singular: 'franc', fraction: 'rappen', fracSingular: 'rappen' },
  CNY: { units: 'yuan', singular: 'yuan', fraction: 'fen', fracSingular: 'fen' },
  INR: { units: 'rupees', singular: 'rupee', fraction: 'paise', fracSingular: 'paisa' },
  BRL: { units: 'reais', singular: 'real', fraction: 'centavos', fracSingular: 'centavo' },
  RUB: { units: 'rubles', singular: 'ruble', fraction: 'kopecks', fracSingular: 'kopeck' },
  ZAR: { units: 'rand', singular: 'rand', fraction: 'cents', fracSingular: 'cent' },
  AED: { units: 'dirhams', singular: 'dirham', fraction: 'fils', fracSingular: 'fils' },
  SGD: { units: 'dollars', singular: 'dollar', fraction: 'cents', fracSingular: 'cent' },
  SAR: { units: 'riyals', singular: 'riyal', fraction: 'halalas', fracSingular: 'halala' },
  NZD: { units: 'dollars', singular: 'dollar', fraction: 'cents', fracSingular: 'cent' },
  MYR: { units: 'ringgits', singular: 'ringgit', fraction: 'sen', fracSingular: 'sen' },
};

function numberToWords(num: number): string {
  if (num === 0) return 'zero';

  const a = [
    '', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
    'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'
  ];
  const b = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
  const g = ['', 'thousand', 'million', 'billion', 'trillion'];

  const convertGroup = (n: number): string => {
    let s = '';
    if (n >= 100) {
      s += a[Math.floor(n / 100)] + ' hundred ';
      n %= 100;
    }
    if (n >= 20) {
      s += b[Math.floor(n / 10)] + (n % 10 !== 0 ? '-' + a[n % 10] : '');
    } else if (n > 0) {
      s += a[n];
    }
    return s.trim();
  };

  let wordList: string[] = [];
  let gIndex = 0;

  while (num > 0) {
    const rem = num % 1000;
    if (rem > 0) {
      const gWord = g[gIndex];
      const converted = convertGroup(rem);
      wordList.unshift(converted + (gWord ? ' ' + gWord : ''));
    }
    num = Math.floor(num / 1000);
    gIndex++;
  }

  return wordList.join(' ').trim();
}

function numberToWordsIndian(num: number): string {
  if (num === 0) return 'zero';

  const a = [
    '', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
    'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'
  ];
  const b = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

  let words: string[] = [];

  if (num >= 10000000) {
    const crore = Math.floor(num / 10000000);
    words.push(numberToWordsIndian(crore) + ' crore');
    num %= 10000000;
  }
  if (num >= 100000) {
    const lakh = Math.floor(num / 100000);
    words.push(numberToWordsIndian(lakh) + ' lakh');
    num %= 100000;
  }
  if (num >= 1000) {
    const thousand = Math.floor(num / 1000);
    words.push(numberToWordsIndian(thousand) + ' thousand');
    num %= 1000;
  }
  if (num >= 100) {
    const hundred = Math.floor(num / 100);
    words.push(a[hundred] + ' hundred');
    num %= 100;
  }
  if (num > 0) {
    if (num < 20) {
      words.push(a[num]);
    } else {
      const ten = Math.floor(num / 10);
      const unit = num % 10;
      words.push(b[ten] + (unit > 0 ? '-' + a[unit] : ''));
    }
  }

  return words.join(' ').trim();
}

function convertAmountToWords(amount: number, currencyCode: string): string {
  const roundedAmount = Math.round(amount * 100) / 100; // Round to 2 decimal places
  const integerPart = Math.floor(roundedAmount);
  const decimalPart = Math.round((roundedAmount - integerPart) * 100);

  const names = currencyNames[currencyCode] || { units: currencyCode.toLowerCase(), singular: currencyCode.toLowerCase(), fraction: 'cents', fracSingular: 'cent' };

  let result = '';

  if (currencyCode === 'INR') {
    if (integerPart === 0) {
      result += 'zero rupees';
    } else {
      result += numberToWordsIndian(integerPart) + ' rupees';
    }

    if (decimalPart > 0) {
      result += ' and ' + numberToWordsIndian(decimalPart) + ' paise';
    }
  } else {
    if (integerPart === 0) {
      result += 'zero ' + names.units;
    } else {
      result += numberToWords(integerPart) + ' ' + (integerPart === 1 ? names.singular : names.units);
    }

    if (decimalPart > 0) {
      result += ' and ' + numberToWords(decimalPart) + ' ' + (decimalPart === 1 ? names.fracSingular : names.fraction);
    }
  }

  return result.trim().replace(/\s+/g, ' ');
}

export default function CurrencyConverterPage() {
  const [rates, setRates] = useState(fallbackRates);
  const [isLive, setIsLive] = useState(false);
  const [lastUpdated, setLastUpdated] = useState('');
  const [amount, setAmount] = useState('1');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('INR');
  const [result, setResult] = useState<number | null>(null);

  const currencies = useMemo(() => {
    return Object.keys(rates).map(code => ({
        code,
        description: rates[code].name
    })).sort((a,b) => a.code.localeCompare(b.code));
  }, [rates]);

  const rateFromTo = useMemo(() => {
    const fromRate = rates[fromCurrency]?.rate || 1;
    const toRate = rates[toCurrency]?.rate || 1;
    return toRate / fromRate;
  }, [rates, fromCurrency, toCurrency]);

  const rateToFrom = useMemo(() => {
    const fromRate = rates[fromCurrency]?.rate || 1;
    const toRate = rates[toCurrency]?.rate || 1;
    return fromRate / toRate;
  }, [rates, fromCurrency, toCurrency]);

  const resultInWords = useMemo(() => {
    if (result === null) return '';
    try {
      const words = convertAmountToWords(result, toCurrency);
      return words ? words.charAt(0).toUpperCase() + words.slice(1) : '';
    } catch (e) {
      console.error('Words conversion error:', e);
      return '';
    }
  }, [result, toCurrency]);

  const handleConversion = useCallback(() => {
    const parsedAmount = parseFloat(amount);
    if(isNaN(parsedAmount)) {
        setResult(null);
        return;
    }
    
    const fromRate = rates[fromCurrency]?.rate || 1;
    const toRate = rates[toCurrency]?.rate || 1;
    
    // Convert amount to USD first, then to the target currency
    const amountInUsd = parsedAmount / fromRate;
    const convertedAmount = amountInUsd * toRate;

    setResult(convertedAmount);
    scrollToDownload();
  }, [amount, fromCurrency, toCurrency, rates]);

  // Fetch live exchange rates from public API on mount
  useEffect(() => {
    const fetchLiveRates = async () => {
      try {
        const res = await fetch('https://open.er-api.com/v6/latest/USD');
        if (!res.ok) throw new Error('API failed to respond');
        const data = await res.json();
        if (data && data.rates) {
          setRates(prev => {
            const updated = { ...prev };
            Object.keys(updated).forEach(code => {
              if (data.rates[code]) {
                updated[code] = {
                  ...updated[code],
                  rate: data.rates[code]
                };
              }
            });
            return updated;
          });
          setLastUpdated(data.time_last_update_utc ? new Date(data.time_last_update_utc).toLocaleString() : new Date().toLocaleString());
          setIsLive(true);
        }
      } catch (error) {
        console.error('Failed to fetch live currency rates, using fallback:', error);
      }
    };
    fetchLiveRates();
  }, []);

  // Perform conversion on rate updates
  useEffect(() => {
    handleConversion();
  }, [handleConversion, rates]);

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
        <CardDescription>Convert between global currencies using real-time live exchange rates.</CardDescription>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-2 border-t pt-2">
          <span className={cn("h-2 w-2 rounded-full", isLive ? "bg-green-500 animate-pulse" : "bg-amber-500")} />
          <span>
            {isLive ? `Live Rates Active (Updated: ${lastUpdated})` : 'Offline Rates Active (Using Fallback)'}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-[2fr_auto_2fr] gap-2 items-center">
                  <div className="space-y-2">
                    <Label htmlFor="from-currency">From</Label>
                    <Select value={fromCurrency} onValueChange={setFromCurrency}>
                        <SelectTrigger id="from-currency"><SelectValue/></SelectTrigger>
                        <SelectContent>
                            {currencies.map(c => (
                              <SelectItem key={c.code} value={c.code}>
                                {c.code} - {c.description} ({rates[c.code]?.rate.toFixed(4)})
                              </SelectItem>
                            ))}
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
                            {currencies.map(c => (
                              <SelectItem key={c.code} value={c.code}>
                                {c.code} - {c.description} ({rates[c.code]?.rate.toFixed(4)})
                              </SelectItem>
                            ))}
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
                    {result.toLocaleString(toCurrency === 'INR' ? 'en-IN' : undefined, { maximumFractionDigits: 4, style: 'currency', currency: toCurrency, currencyDisplay: 'symbol' })}
                </AlertDescription>
                {resultInWords && (
                  <AlertDescription className="text-[11px] font-medium text-foreground/75 mt-1 leading-relaxed">
                    In Words: <span className="font-bold">{resultInWords}</span>
                  </AlertDescription>
                )}
                 <AlertDescription className="text-sm text-muted-foreground mt-2">
                    {parseFloat(amount).toLocaleString(fromCurrency === 'INR' ? 'en-IN' : undefined)} {fromCurrency} = {result.toLocaleString(toCurrency === 'INR' ? 'en-IN' : undefined, { maximumFractionDigits: 4 })} {toCurrency}
                 </AlertDescription>
                 
                 <div className="mt-4 pt-3 border-t border-dashed border-border/80 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs text-muted-foreground">
                   <div className="flex flex-wrap gap-x-4 gap-y-1 font-mono">
                     <span>1 {fromCurrency} = {rateFromTo.toFixed(4)} {toCurrency}</span>
                     <span className="border-l border-muted-foreground/30 pl-4 hidden sm:inline" />
                     <span>1 {toCurrency} = {rateToFrom.toFixed(4)} {fromCurrency}</span>
                   </div>
                 </div>

                 <AlertDescription className="text-xs text-muted-foreground mt-4">
                    {isLive ? '*Rates are fetched live from global currency feeds and updated daily.' : '*Rates are calculated using offline fallback averages.'}
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
                        <strong className="text-primary font-bold">Real-time Live Prices:</strong> Our currency converter connects directly to standard public currency rate exchange APIs to fetch and calculate using live updates. It bypasses old static approximations and gives you real, daily-updated market values.
                    </p>
                    <p>
                        We support a wide range of currencies, including USD, EUR, GBP, JPY, INR, AED, SGD, and many more, making it a versatile tool for all your financial conversion needs.
                    </p>
                </div>
                <div className="space-y-4">
                    <p>
                        <strong className="text-primary font-bold">Key Benefits:</strong>
                    </p>
                    <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                        <li>Real-time exchange rate updates</li>
                        <li>Offline fault tolerance fallback rates</li>
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
                    <p className="text-muted-foreground text-sm">The rates provided are fetched in real-time from open market exchange APIs. However, they represent interbank mid-market rates. Your bank or card issuer may apply conversion spreads during transactions.</p>
                </div>
                <div className="p-6 rounded-xl border border-border/50 bg-card hover:border-primary/50 transition-colors">
                    <h4 className="font-bold mb-2 text-base">Which currencies do you support?</h4>
                    <p className="text-muted-foreground text-sm">We support major world currencies including the US Dollar, Euro, British Pound, Japanese Yen, Indian Rupee, Australian Dollar, UAE Dirham, Singapore Dollar, and more.</p>
                </div>
                <div className="p-6 rounded-xl border border-border/50 bg-card hover:border-primary/50 transition-colors">
                    <h4 className="font-bold mb-2 text-base">Is this converter free to use?</h4>
                    <p className="text-muted-foreground text-sm">Yes, our currency converter is 100% free and requires no registration or personal information.</p>
                </div>
                <div className="p-6 rounded-xl border border-border/50 bg-card hover:border-primary/50 transition-colors">
                    <h4 className="font-bold mb-2 text-base">Does it work offline?</h4>
                    <p className="text-muted-foreground text-sm">Yes! If your network is disconnected or the rate API is unavailable, the tool automatically falls back to our latest static index rates so it never breaks.</p>
                </div>
            </div>
        </div>
    </section>
    </>
  );
}
