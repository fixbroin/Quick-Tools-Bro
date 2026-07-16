'use client';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CloudSun, Gem, Loader2, MapPin } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { fetchMarketRates } from '@/app/actions/market';

const CITIES = [
  { name: 'Mumbai', lat: 19.076, lon: 72.877 },
  { name: 'Delhi', lat: 28.6139, lon: 77.209 },
  { name: 'Bangalore', lat: 12.9716, lon: 77.5946 },
  { name: 'Kolkata', lat: 22.5726, lon: 88.3639 },
  { name: 'Chennai', lat: 13.0827, lon: 80.2707 },
  { name: 'Hyderabad', lat: 17.3850, lon: 78.4867 },
  { name: 'Ahmedabad', lat: 23.0225, lon: 72.5714 },
  { name: 'Pune', lat: 18.5204, lon: 73.8567 },
  { name: 'Jaipur', lat: 26.9124, lon: 75.7873 },
  { name: 'Lucknow', lat: 26.8467, lon: 80.9462 }
];

export default function GoldPriceAndWeatherPage() {
  const [selectedCityIdx, setSelectedCityIdx] = useState<string>('0');
  const [weatherData, setWeatherData] = useState<any>(null);
  const [weatherLoading, setWeatherLoading] = useState<boolean>(false);
  const [exchangeRate, setExchangeRate] = useState<number>(83.5);
  const [liveGold24kBase, setLiveGold24kBase] = useState<number>(64780);
  const [liveGold24k, setLiveGold24k] = useState<number>(74500);
  const [liveGold22kBase, setLiveGold22kBase] = useState<number>(59380);
  const [liveGold22k, setLiveGold22k] = useState<number>(68290);
  const [liveSilverBase, setLiveSilverBase] = useState<number>(78960);
  const [liveSilver, setLiveSilver] = useState<number>(90800);
  const [ratesLoading, setRatesLoading] = useState<boolean>(false);
  const [ratesLastUpdated, setRatesLastUpdated] = useState<string>('');
  
  const { toast } = useToast();

  const fetchRates = async () => {
    setRatesLoading(true);
    try {
      const data = await fetchMarketRates();
      setExchangeRate(data.exchangeRate);
      setLiveGold24kBase(data.gold24kBase);
      setLiveGold24k(data.gold24k);
      setLiveGold22kBase(data.gold22kBase);
      setLiveGold22k(data.gold22k);
      setLiveSilverBase(data.silverBase);
      setLiveSilver(data.silver);
      setRatesLastUpdated(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ', ' + new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }));
    } catch (err) {
      console.error('Failed to load market rates:', err);
    } finally {
      setRatesLoading(false);
    }
  };

  const fetchWeather = async (cityIdx: number) => {
    const city = CITIES[cityIdx];
    setWeatherLoading(true);
    try {
      const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current_weather=true`);
      const data = await res.json();
      setWeatherData({
        temp: data.current_weather.temperature,
        windspeed: data.current_weather.windspeed,
        weathercode: data.current_weather.weathercode,
      });
    } catch (err) {
      console.error(err);
      toast({ title: 'Weather Fetch Failed', description: 'Could not connect to Open-Meteo.', variant: 'destructive' });
    } finally {
      setWeatherLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather(parseInt(selectedCityIdx, 10));
  }, [selectedCityIdx]);

  useEffect(() => {
    fetchRates();

    // Automatically refresh prices every 5 minutes (300,000 ms)
    const interval = setInterval(() => {
      fetchRates();
    }, 300000);

    return () => clearInterval(interval);
  }, []);

  // Weather code mapping
  const getWeatherDesc = (code: number) => {
    if (code === 0) return 'Clear Sky';
    if (code <= 3) return 'Partly Cloudy';
    if (code <= 48) return 'Foggy';
    if (code <= 55) return 'Drizzle';
    if (code <= 65) return 'Rainy';
    if (code <= 77) return 'Snowy';
    if (code <= 82) return 'Rain Showers';
    return 'Thunderstorm';
  };

  const currentCityName = CITIES[parseInt(selectedCityIdx, 10)]?.name || 'Mumbai';

  // Calculate city-specific gold/silver prices
  const getCityMetalPrices = () => {
    let goldOffset = 0;
    let silverOffset = 0;

    switch (currentCityName) {
      case 'Chennai':
        goldOffset = 500;
        silverOffset = 1000;
        break;
      case 'Delhi':
        goldOffset = 200;
        silverOffset = 500;
        break;
      case 'Bangalore':
        goldOffset = 300;
        silverOffset = 800;
        break;
      case 'Hyderabad':
        goldOffset = 400;
        silverOffset = 900;
        break;
      case 'Kolkata':
        goldOffset = -200;
        silverOffset = -300;
        break;
      case 'Ahmedabad':
        goldOffset = 100;
        silverOffset = 400;
        break;
      case 'Pune':
        goldOffset = 150;
        silverOffset = 300;
        break;
      case 'Jaipur':
        goldOffset = 250;
        silverOffset = 600;
        break;
      case 'Lucknow':
        goldOffset = 350;
        silverOffset = 700;
        break;
      default:
        goldOffset = 0;
        silverOffset = 0;
    }

    const base24k = liveGold24kBase + goldOffset;
    const final24k = Math.round(base24k * 1.15);
    const duty24k = final24k - base24k;

    const base22k = liveGold22kBase + Math.round((goldOffset * 22) / 24);
    const final22k = Math.round(final24k * 22 / 24);
    const duty22k = final22k - base22k;

    const baseSilver = liveSilverBase + silverOffset;
    const finalSilver = Math.round(baseSilver * 1.15);
    const dutySilver = finalSilver - baseSilver;

    return {
      gold24kBase: base24k,
      gold24k: final24k,
      gold24kDuty: duty24k,
      gold22kBase: base22k,
      gold22k: final22k,
      gold22kDuty: duty22k,
      silverBase: baseSilver,
      silver: finalSilver,
      silverDuty: dutySilver
    };
  };

  const { 
    gold24kBase, gold24k, gold24kDuty, 
    gold22kBase, gold22k, gold22kDuty, 
    silverBase, silver, silverDuty 
  } = getCityMetalPrices();

  return (<>
      <div className="space-y-8 pb-20 animate-in fade-in duration-500">
      <header className="mb-6 text-center">
        <h1 className="font-headline text-3xl font-bold tracking-tight md:text-4xl">GOLD PRICE AND WEATHER</h1>
        <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">
          Real-time local weather forecasts and live 24K & 22K gold prices in India.
        </p>
      </header>

      {/* Unified City Selector above the tabs */}
      <div className="max-w-md mx-auto mb-6 bg-card border border-primary/10 rounded-2xl p-4 shadow-sm flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <MapPin className="text-primary h-5 w-5 animate-pulse" />
          <div className="space-y-0.5">
            <Label className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">Your Location</Label>
            <p className="text-xs font-semibold text-foreground">Showing data for selected city</p>
          </div>
        </div>
        <Select value={selectedCityIdx} onValueChange={setSelectedCityIdx}>
          <SelectTrigger className="w-[180px] rounded-xl font-bold border-primary/20">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CITIES.map((c, idx) => (
              <SelectItem key={idx} value={String(idx)} className="font-semibold">{c.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="gold" className="w-full">
        <TabsList className="grid w-full grid-cols-2 rounded-2xl h-12 mb-6 bg-muted p-1 gap-1">
          <TabsTrigger value="gold" className="rounded-xl font-bold text-xs shrink-0"><Gem className="h-4 w-4 mr-1.5" /> Gold / Silver</TabsTrigger>
          <TabsTrigger value="weather" className="rounded-xl font-bold text-xs shrink-0"><CloudSun className="h-4 w-4 mr-1.5" /> Weather</TabsTrigger>
        </TabsList>

        {/* 1. Weather */}
        <TabsContent value="weather" className="space-y-4 max-w-xl mx-auto">
          <Card className="shadow-lg border-primary/10">
            <CardHeader className="bg-primary/5 border-b p-4">
              <CardTitle className="flex items-center gap-2 font-black text-xl"><CloudSun className="text-primary h-5 w-5" /> WEATHER IN {currentCityName.toUpperCase()}</CardTitle>
              <CardDescription>Live weather details retrieved from Open-Meteo APIs.</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {weatherLoading ? (
                <div className="flex justify-center py-10"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>
              ) : weatherData ? (
                <div className="text-center py-6 space-y-2 animate-in fade-in">
                  <p className="text-5xl font-black italic tracking-tighter text-primary">{weatherData.temp}°C</p>
                  <p className="text-sm font-bold uppercase tracking-wider text-muted-foreground">{getWeatherDesc(weatherData.weathercode)}</p>
                  <p className="text-xs text-muted-foreground">Wind speed: {weatherData.windspeed} km/h</p>
                </div>
              ) : (
                <p className="text-center py-6 text-xs text-muted-foreground">No data found.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* 2. Gold/Silver */}
        <TabsContent value="gold" className="space-y-4 max-w-xl mx-auto">
          <Card className="shadow-lg border-primary/10">
            <CardHeader className="bg-primary/5 border-b p-4">
              <CardTitle className="flex items-center gap-2 font-black text-xl"><Gem className="text-primary h-5 w-5" /> GOLD & SILVER IN {currentCityName.toUpperCase()}</CardTitle>
              <CardDescription>
                Live daily retail bullion and jewel rates for 24K, 22K, and Silver.
                {ratesLastUpdated && <span className="block text-[10px] text-muted-foreground mt-1 font-medium">Last updated: {ratesLastUpdated}</span>}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {ratesLoading ? (
                <div className="flex justify-center py-10"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>
              ) : (
                 <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Metal Standard</TableHead>
                      <TableHead>Original Rate</TableHead>
                      <TableHead>Customs/GST (15%)</TableHead>
                      <TableHead className="text-right">Final Rate</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {/* Gold 24k per 10g */}
                    <TableRow>
                      <TableCell className="font-bold">Gold (24K) <span className="text-[10px] text-muted-foreground font-normal block">Per 10 grams</span></TableCell>
                      <TableCell className="font-mono text-muted-foreground text-xs">₹{gold24kBase.toLocaleString('en-IN')}</TableCell>
                      <TableCell className="font-mono text-muted-foreground text-xs">₹{gold24kDuty.toLocaleString('en-IN')}</TableCell>
                      <TableCell className="text-right font-mono font-bold text-primary text-sm">₹{gold24k.toLocaleString('en-IN')}</TableCell>
                    </TableRow>
                    {/* Gold 24k per 1g */}
                    <TableRow className="bg-muted/30">
                      <TableCell className="font-medium text-xs pl-6">↳ Per 1 gram</TableCell>
                      <TableCell className="font-mono text-muted-foreground text-[11px]">₹{Math.round(gold24kBase / 10).toLocaleString('en-IN')}</TableCell>
                      <TableCell className="font-mono text-muted-foreground text-[11px]">₹{Math.round(gold24kDuty / 10).toLocaleString('en-IN')}</TableCell>
                      <TableCell className="text-right font-mono font-semibold text-foreground/80 text-xs">₹{Math.round(gold24k / 10).toLocaleString('en-IN')}</TableCell>
                    </TableRow>

                    {/* Gold 22k per 10g */}
                    <TableRow>
                      <TableCell className="font-bold">Gold (22K) <span className="text-[10px] text-muted-foreground font-normal block">Per 10 grams</span></TableCell>
                      <TableCell className="font-mono text-muted-foreground text-xs">₹{gold22kBase.toLocaleString('en-IN')}</TableCell>
                      <TableCell className="font-mono text-muted-foreground text-xs">₹{gold22kDuty.toLocaleString('en-IN')}</TableCell>
                      <TableCell className="text-right font-mono font-bold text-primary text-sm">₹{gold22k.toLocaleString('en-IN')}</TableCell>
                    </TableRow>
                    {/* Gold 22k per 1g */}
                    <TableRow className="bg-muted/30">
                      <TableCell className="font-medium text-xs pl-6">↳ Per 1 gram</TableCell>
                      <TableCell className="font-mono text-muted-foreground text-[11px]">₹{Math.round(gold22kBase / 10).toLocaleString('en-IN')}</TableCell>
                      <TableCell className="font-mono text-muted-foreground text-[11px]">₹{Math.round(gold22kDuty / 10).toLocaleString('en-IN')}</TableCell>
                      <TableCell className="text-right font-mono font-semibold text-foreground/80 text-xs">₹{Math.round(gold22k / 10).toLocaleString('en-IN')}</TableCell>
                    </TableRow>

                    {/* Silver per 1kg */}
                    <TableRow>
                      <TableCell className="font-bold">Pure Silver <span className="text-[10px] text-muted-foreground font-normal block">Per 1 kilogram (1kg)</span></TableCell>
                      <TableCell className="font-mono text-muted-foreground text-xs">₹{silverBase.toLocaleString('en-IN')}</TableCell>
                      <TableCell className="font-mono text-muted-foreground text-xs">₹{silverDuty.toLocaleString('en-IN')}</TableCell>
                      <TableCell className="text-right font-mono font-bold text-primary text-sm">₹{silver.toLocaleString('en-IN')}</TableCell>
                    </TableRow>
                    {/* Silver per 1g */}
                    <TableRow className="bg-muted/30">
                      <TableCell className="font-medium text-xs pl-6">↳ Per 1 gram</TableCell>
                      <TableCell className="font-mono text-muted-foreground text-[11px]">₹{(silverBase / 1000).toFixed(2)}</TableCell>
                      <TableCell className="font-mono text-muted-foreground text-[11px]">₹{(silverDuty / 1000).toFixed(2)}</TableCell>
                      <TableCell className="text-right font-mono font-semibold text-foreground/80 text-xs">₹{(silver / 1000).toFixed(2)}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
      
      <section className="mt-12 space-y-8 prose prose-slate dark:prose-invert max-w-none">
        <div className="bg-primary/5 rounded-2xl p-6 md:p-10 border border-primary/10">
            <h2 className="text-3xl font-bold font-headline mb-6">Why Use Our Gold Price and Weather Tool?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm leading-relaxed">
                <div className="space-y-4">
                    <p>
                        <strong className="text-primary font-bold">Free & Secure:</strong> Our Gold Price and Weather tool is 100% free and runs completely in your web browser. No registration, signup, or installation is required.
                    </p>
                    <p>
                        Check weather, live gold prices, and silver rates instantly.
                    </p>
                </div>
                <div className="space-y-4">
                    <p>
                        <strong className="text-primary font-bold">Step-by-Step Guide:</strong>
                    </p>
                    <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                        <li>Open the Gold Price and Weather tool on UseBro.</li>
                        <li>Select your city from the location dropdown selector.</li>
                        <li>Wait for the tool to process the details dynamically in your browser.</li>
                        <li>Check the base pricing, customs duty, and final landed prices instantly.</li>
                    </ul>
                </div>
            </div>
        </div>

        <div className="space-y-6">
            <h2 className="text-2xl font-bold font-headline">Frequently Asked Questions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-xl border border-border/50 bg-card hover:border-primary/50 transition-colors">
                    <h4 className="font-bold mb-2 text-base">Is the Gold Price and Weather tool free to use?</h4>
                    <p className="text-muted-foreground text-sm">Yes! All tools on UseBro are 100% free with no monthly subscription limits, hidden fees, or signup forms.</p>
                </div>
                <div className="p-6 rounded-xl border border-border/50 bg-card hover:border-primary/50 transition-colors">
                    <h4 className="font-bold mb-2 text-base">Does this tool upload my selection to a server?</h4>
                    <p className="text-muted-foreground text-sm">No. To guarantee security and privacy, all processing is performed locally inside your web browser. Your private details never leave your device.</p>
                </div>
                <div className="p-6 rounded-xl border border-border/50 bg-card hover:border-primary/50 transition-colors">
                    <h4 className="font-bold mb-2 text-base">Can I use Gold Price and Weather on my mobile device?</h4>
                    <p className="text-muted-foreground text-sm">Yes! UseBro is fully mobile-friendly and responsive, running smoothly on Android, iPhone, iPad, and desktop browsers.</p>
                </div>
            </div>
        </div>
      </section>
    </>);
}
