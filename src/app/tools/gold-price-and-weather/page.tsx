'use client';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CloudSun, Gem, Loader2, MapPin, Search, Globe, ChevronRight } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { fetchMarketRates } from '@/app/actions/market';

const COUNTRIES = [
  {
    name: 'India',
    code: 'IN',
    currency: 'INR',
    symbol: '₹',
    markup: 1.15,
    cities: [
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
    ]
  },
  {
    name: 'United States',
    code: 'US',
    currency: 'USD',
    symbol: '$',
    markup: 1.05,
    cities: [
      { name: 'New York', lat: 40.7128, lon: -74.006 },
      { name: 'Los Angeles', lat: 34.0522, lon: -118.2437 },
      { name: 'Chicago', lat: 41.8781, lon: -87.6298 },
      { name: 'Houston', lat: 29.7604, lon: -95.3698 },
      { name: 'Phoenix', lat: 33.4484, lon: -112.074 },
      { name: 'San Francisco', lat: 37.7749, lon: -122.4194 }
    ]
  },
  {
    name: 'United Arab Emirates',
    code: 'AE',
    currency: 'AED',
    symbol: 'د.إ',
    markup: 1.05,
    cities: [
      { name: 'Dubai', lat: 25.2048, lon: 55.2708 },
      { name: 'Abu Dhabi', lat: 24.4539, lon: 54.3773 },
      { name: 'Sharjah', lat: 25.3463, lon: 55.4209 },
      { name: 'Al Ain', lat: 24.1302, lon: 55.8023 }
    ]
  },
  {
    name: 'United Kingdom',
    code: 'GB',
    currency: 'GBP',
    symbol: '£',
    markup: 1.05,
    cities: [
      { name: 'London', lat: 51.5074, lon: -0.1278 },
      { name: 'Birmingham', lat: 52.4862, lon: -1.8904 },
      { name: 'Glasgow', lat: 55.8642, lon: -4.2518 },
      { name: 'Manchester', lat: 53.4808, lon: -2.2426 }
    ]
  },
  {
    name: 'Canada',
    code: 'CA',
    currency: 'CAD',
    symbol: 'C$',
    markup: 1.06,
    cities: [
      { name: 'Toronto', lat: 43.6532, lon: -79.3832 },
      { name: 'Montreal', lat: 45.5017, lon: -73.5673 },
      { name: 'Vancouver', lat: 49.2827, lon: -123.1207 }
    ]
  },
  {
    name: 'Australia',
    code: 'AU',
    currency: 'AUD',
    symbol: 'A$',
    markup: 1.06,
    cities: [
      { name: 'Sydney', lat: -33.8688, lon: 151.2093 },
      { name: 'Melbourne', lat: -37.8136, lon: 144.9631 },
      { name: 'Brisbane', lat: -27.4705, lon: 153.026 }
    ]
  },
  {
    name: 'Singapore',
    code: 'SG',
    currency: 'SGD',
    symbol: 'S$',
    markup: 1.04,
    cities: [
      { name: 'Singapore', lat: 1.3521, lon: 103.8198 }
    ]
  },
  {
    name: 'Saudi Arabia',
    code: 'SA',
    currency: 'SAR',
    symbol: 'SR',
    markup: 1.08,
    cities: [
      { name: 'Riyadh', lat: 24.7136, lon: 46.6753 },
      { name: 'Jeddah', lat: 21.5433, lon: 39.1728 },
      { name: 'Mecca', lat: 21.3891, lon: 39.8579 }
    ]
  },
  {
    name: 'Germany',
    code: 'DE',
    currency: 'EUR',
    symbol: '€',
    markup: 1.05,
    cities: [
      { name: 'Berlin', lat: 52.52, lon: 13.405 },
      { name: 'Munich', lat: 48.1351, lon: 11.582 },
      { name: 'Frankfurt', lat: 50.1109, lon: 8.6821 }
    ]
  }
];

const COUNTRY_TO_CURRENCY: Record<string, { currency: string; symbol: string; markup: number }> = {
  IN: { currency: 'INR', symbol: '₹', markup: 1.15 },
  US: { currency: 'USD', symbol: '$', markup: 1.05 },
  AE: { currency: 'AED', symbol: 'د.إ', markup: 1.05 },
  GB: { currency: 'GBP', symbol: '£', markup: 1.05 },
  CA: { currency: 'CAD', symbol: 'C$', markup: 1.06 },
  AU: { currency: 'AUD', symbol: 'A$', markup: 1.06 },
  SG: { currency: 'SGD', symbol: 'S$', markup: 1.04 },
  SA: { currency: 'SAR', symbol: 'SR', markup: 1.08 },
  DE: { currency: 'EUR', symbol: '€', markup: 1.05 },
  FR: { currency: 'EUR', symbol: '€', markup: 1.05 },
  IT: { currency: 'EUR', symbol: '€', markup: 1.05 },
  ES: { currency: 'EUR', symbol: '€', markup: 1.05 },
  JP: { currency: 'JPY', symbol: '¥', markup: 1.05 },
  CN: { currency: 'CNY', symbol: '¥', markup: 1.06 },
  HK: { currency: 'HKD', symbol: 'HK$', markup: 1.04 },
  NZ: { currency: 'NZD', symbol: 'NZ$', markup: 1.05 },
  MY: { currency: 'MYR', symbol: 'RM', markup: 1.05 },
  TH: { currency: 'THB', symbol: '฿', markup: 1.05 },
  ZA: { currency: 'ZAR', symbol: 'R', markup: 1.08 },
  PK: { currency: 'PKR', symbol: '₨', markup: 1.10 },
  BD: { currency: 'BDT', symbol: '৳', markup: 1.10 },
  LK: { currency: 'LKR', symbol: 'Rs', markup: 1.10 },
  NP: { currency: 'NPR', symbol: 'Rs', markup: 1.10 },
  KW: { currency: 'KWD', symbol: 'KD', markup: 1.05 },
  OM: { currency: 'OMR', symbol: 'RO', markup: 1.05 },
  QA: { currency: 'QAR', symbol: 'QR', markup: 1.05 },
  BH: { currency: 'BHD', symbol: 'BD', markup: 1.05 },
  CH: { currency: 'CHF', symbol: 'CHF', markup: 1.04 },
};

export default function GoldPriceAndWeatherPage() {
  const [selectedCity, setSelectedCity] = useState<string>('Mumbai');
  const [selectedCountry, setSelectedCountry] = useState<string>('India');
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>('IN');
  const [lat, setLat] = useState<number>(19.076);
  const [lon, setLon] = useState<number>(72.877);
  const [currency, setCurrency] = useState<string>('INR');
  const [symbol, setSymbol] = useState<string>('₹');
  const [markup, setMarkup] = useState<number>(1.15);

  const [weatherData, setWeatherData] = useState<any>(null);
  const [weatherLoading, setWeatherLoading] = useState<boolean>(false);

  const [exchangeRate, setExchangeRate] = useState<number>(83.5);
  const [xauPrice, setXauPrice] = useState<number>(2300);
  const [xagPrice, setXagPrice] = useState<number>(29);
  const [rates, setRates] = useState<Record<string, number>>({ INR: 83.5, USD: 1.0 });
  const [ratesLoading, setRatesLoading] = useState<boolean>(false);
  const [ratesLastUpdated, setRatesLastUpdated] = useState<string>('');

  const [isCountryDialogOpen, setIsCountryDialogOpen] = useState<boolean>(false);
  const [isCityDialogOpen, setIsCityDialogOpen] = useState<boolean>(false);
  const [osmQuery, setOsmQuery] = useState<string>('');
  const [osmResults, setOsmResults] = useState<any[]>([]);
  const [osmLoading, setOsmLoading] = useState<boolean>(false);

  const { toast } = useToast();

  const fetchRates = async () => {
    setRatesLoading(true);
    try {
      const data = await fetchMarketRates();
      setExchangeRate(data.exchangeRate);
      setXauPrice(data.xauPrice);
      setXagPrice(data.xagPrice);
      if (data.allRates) {
        setRates(data.allRates);
      }
      setRatesLastUpdated(
        new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) +
          ', ' +
          new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short' })
      );
    } catch (err) {
      console.error('Failed to load market rates:', err);
    } finally {
      setRatesLoading(false);
    }
  };

  const fetchWeather = async (latitude: number, longitude: number) => {
    setWeatherLoading(true);
    try {
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
      );
      const data = await res.json();
      setWeatherData({
        temp: data.current_weather.temperature,
        windspeed: data.current_weather.windspeed,
        weathercode: data.current_weather.weathercode,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setWeatherLoading(false);
    }
  };

  const detectLocation = async () => {
    try {
      const res = await fetch('https://ipapi.co/json/');
      if (res.ok) {
        const data = await res.json();
        if (data.city && data.country_code) {
          const code = data.country_code.toUpperCase();
          const currencyInfo = COUNTRY_TO_CURRENCY[code] || {
            currency: data.currency || 'USD',
            symbol: data.currency === 'INR' ? '₹' : '$',
            markup: 1.05
          };

          setSelectedCity(data.city);
          setSelectedCountry(data.country_name || code);
          setSelectedCountryCode(code);
          setLat(data.latitude || 19.076);
          setLon(data.longitude || 72.877);
          setCurrency(currencyInfo.currency);
          setSymbol(currencyInfo.symbol);
          setMarkup(currencyInfo.markup);

          fetchWeather(data.latitude || 19.076, data.longitude || 72.877);
          return;
        }
      }
    } catch (e) {
      console.error('IP detection error:', e);
    }
    // Fallback Mumbai
    fetchWeather(19.076, 72.877);
  };

  useEffect(() => {
    fetchRates();
    detectLocation();

    const interval = setInterval(() => {
      fetchRates();
    }, 300000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (lat !== 19.076 || lon !== 72.877) {
      fetchWeather(lat, lon);
    }
  }, [lat, lon]);

  const searchOsm = async () => {
    if (!osmQuery.trim()) return;
    setOsmLoading(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(osmQuery)}&format=json&addressdetails=1&limit=5&countrycodes=${selectedCountryCode.toLowerCase()}`
      );
      if (res.ok) {
        const data = await res.json();
        setOsmResults(data);
      }
    } catch (e) {
      console.error(e);
      toast({ title: 'Search Failed', description: 'Could not connect to OpenStreetMap.', variant: 'destructive' });
    } finally {
      setOsmLoading(false);
    }
  };

  const selectCountry = (c: typeof COUNTRIES[number]) => {
    setSelectedCountry(c.name);
    setSelectedCountryCode(c.code);
    setCurrency(c.currency);
    setSymbol(c.symbol);
    setMarkup(c.markup);

    // Reset city to first city of selected country
    const defaultCity = c.cities[0];
    if (defaultCity) {
      setSelectedCity(defaultCity.name);
      setLat(defaultCity.lat);
      setLon(defaultCity.lon);
    }
    setIsCountryDialogOpen(false);
  };

  const selectCity = (cityName: string, latitude: number, longitude: number) => {
    setSelectedCity(cityName);
    setLat(latitude);
    setLon(longitude);

    setIsCityDialogOpen(false);
    setOsmResults([]);
    setOsmQuery('');
  };

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

  // Calculate live dynamic prices per gram based on Spot XAU/XAG prices and current country settings
  const getDynamicMetalPrices = () => {
    const ozToGram = 31.1034768;
    const localRate = rates[currency] || (currency === 'USD' ? 1.0 : exchangeRate);

    // Spot price per gram in local currency
    const goldSpotGram = (xauPrice / ozToGram) * localRate;
    const silverSpotGram = (xagPrice / ozToGram) * localRate;

    // Final price with customs / GST markup
    const g24k = goldSpotGram * markup;
    const g22k = g24k * (22 / 24);
    const g18k = g24k * (18 / 24);
    const sil = silverSpotGram * markup;

    return {
      g24k,
      g22k,
      g18k,
      silver: sil,
      duty24k: g24k - goldSpotGram,
      duty22k: g22k - (goldSpotGram * 22 / 24),
      dutySilver: sil - silverSpotGram
    };
  };

  const prices = getDynamicMetalPrices();

  const formatPrice = (value: number) => {
    return symbol + Math.round(value).toLocaleString(currency === 'INR' ? 'en-IN' : 'en-US');
  };

  const activeCountryPreset = COUNTRIES.find(c => c.code === selectedCountryCode);

  return (
    <>
      <div className="space-y-4 pb-20 animate-in fade-in duration-500">
        {/* Dynamic compact side-by-side header in desktop to eliminate vertical blank space */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-primary/5 pb-4 md:pb-3 mb-2 text-left">
          <div>
            <h1 className="font-headline text-2xl font-black tracking-tight md:text-3xl text-foreground">GOLD PRICE AND WEATHER</h1>
            <p className="mt-1 text-xs text-muted-foreground max-w-xl">
              Real-time global weather forecasts and live 24K, 22K, 18K gold and silver rates by country.
            </p>
          </div>

          {/* Location settings mini panel */}
          <div className="flex items-center gap-3 bg-card border border-primary/10 rounded-2xl p-2.5 shadow-sm shrink-0 w-full md:w-auto justify-between md:justify-start">
            <div className="flex items-center gap-2 text-left pr-3 border-r border-primary/5">
              <MapPin className="text-primary h-4 w-4 animate-pulse shrink-0" />
              <div className="space-y-0.5">
                <Label className="text-[9px] uppercase font-black text-muted-foreground tracking-wider block leading-none">Location</Label>
                <span className="text-[11px] font-extrabold text-foreground block leading-none mt-0.5">Settings</span>
              </div>
            </div>

            <div className="flex gap-1.5 shrink-0">
              {/* Country Selector Trigger */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsCountryDialogOpen(true)}
                className="rounded-xl font-bold gap-1 text-[11px] px-2.5 h-8 border-primary/15 hover:border-primary/30 bg-card"
              >
                <Globe className="h-3.5 w-3.5 text-primary shrink-0" />
                <span className="truncate max-w-[80px]">{selectedCountry}</span>
              </Button>

              {/* City Selector Trigger */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsCityDialogOpen(true)}
                className="rounded-xl font-bold gap-1 text-[11px] px-2.5 h-8 border-primary/15 hover:border-primary/30 bg-card"
              >
                <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                <span className="truncate max-w-[80px]">{selectedCity}</span>
              </Button>
            </div>
          </div>
        </div>

        <Tabs defaultValue="gold" className="w-full">
          <TabsList className="grid w-full grid-cols-2 rounded-2xl h-12 mb-6 bg-muted p-1 gap-1">
            <TabsTrigger 
              value="gold" 
              className="rounded-xl font-bold text-xs shrink-0 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Gem className="h-4 w-4 mr-1.5" /> Gold / Silver
            </TabsTrigger>
            <TabsTrigger 
              value="weather" 
              className="rounded-xl font-bold text-xs shrink-0 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <CloudSun className="h-4 w-4 mr-1.5" /> Weather
            </TabsTrigger>
          </TabsList>

          {/* 1. Weather Tab */}
          <TabsContent value="weather" className="space-y-4 max-w-xl mx-auto">
            <Card className="shadow-lg border-primary/10">
              <CardHeader className="bg-primary/5 border-b p-4">
                <CardTitle className="flex items-center gap-2 font-black text-xl">
                  <CloudSun className="text-primary h-5 w-5" /> WEATHER IN {selectedCity.toUpperCase()}
                </CardTitle>
                <CardDescription>Live weather details retrieved from Open-Meteo forecasts.</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                {weatherLoading ? (
                  <div className="flex justify-center py-10">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                  </div>
                ) : weatherData ? (
                  <div className="text-center py-6 space-y-2 animate-in fade-in">
                    <p className="text-5xl font-black italic tracking-tighter text-primary">{weatherData.temp}°C</p>
                    <p className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                      {getWeatherDesc(weatherData.weathercode)}
                    </p>
                    <p className="text-xs text-muted-foreground">Wind speed: {weatherData.windspeed} km/h</p>
                  </div>
                ) : (
                  <p className="text-center py-6 text-xs text-muted-foreground">No data found.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* 2. Gold/Silver Tab */}
          <TabsContent value="gold" className="space-y-4 max-w-xl mx-auto">
            <Card className="shadow-lg border-primary/10">
              <CardHeader className="bg-primary/5 border-b p-4">
                <CardTitle className="flex items-center gap-2 font-black text-xl">
                  <Gem className="text-primary h-5 w-5" /> BULLION RATES IN {selectedCity.toUpperCase()} ({currency})
                </CardTitle>
                <CardDescription>
                  Live daily retail bullion and jewel rates for 24K, 22K, 18K, and Silver.
                  {ratesLastUpdated && (
                    <span className="block text-[10px] text-muted-foreground mt-1 font-medium">
                      Last updated: {ratesLastUpdated}
                    </span>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                {ratesLoading ? (
                  <div className="flex justify-center py-10">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                  </div>
                ) : (
                  <>
                    {/* Desktop Table View */}
                    <div className="hidden md:block">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Metal Standard</TableHead>
                            <TableHead>Unit weight</TableHead>
                            <TableHead className="text-right">Final Price</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {/* Gold 24k */}
                          <TableRow className="bg-yellow-500/[0.02] hover:bg-yellow-500/[0.08] transition-colors border-l-2 border-l-yellow-500 text-left">
                            <TableCell className="font-bold">
                              <span className="text-yellow-600 flex items-center gap-1.5 font-headline">
                                <span className="h-1.5 w-1.5 rounded-full bg-yellow-500 animate-pulse" />
                                Gold (24K) - Pure
                              </span>
                            </TableCell>
                            <TableCell className="text-xs text-muted-foreground font-semibold">10 grams</TableCell>
                            <TableCell className="text-right font-mono font-extrabold text-yellow-600 text-sm">
                              {formatPrice(prices.g24k * 10)}
                            </TableCell>
                          </TableRow>
                          <TableRow className="hover:bg-yellow-500/[0.04] text-left">
                            <TableCell className="text-xs text-muted-foreground/80 pl-6">↳ Per 1 gram</TableCell>
                            <TableCell className="text-xs text-muted-foreground">1 gram</TableCell>
                            <TableCell className="text-right font-mono font-bold text-xs text-foreground/80">
                              {formatPrice(prices.g24k)}
                            </TableCell>
                          </TableRow>
                          <TableRow className="hover:bg-yellow-500/[0.04] text-left">
                            <TableCell className="text-xs text-muted-foreground/80 pl-6">↳ Per Sovereign (Pawan)</TableCell>
                            <TableCell className="text-xs text-muted-foreground">8 grams</TableCell>
                            <TableCell className="text-right font-mono font-bold text-xs text-foreground/80">
                              {formatPrice(prices.g24k * 8)}
                            </TableCell>
                          </TableRow>

                          {/* Gold 22k */}
                          <TableRow className="bg-amber-600/[0.02] hover:bg-amber-600/[0.08] transition-colors border-l-2 border-l-amber-600 text-left">
                            <TableCell className="font-bold">
                              <span className="text-amber-600 flex items-center gap-1.5 font-headline">
                                <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                                Gold (22K) - Jewelry
                              </span>
                            </TableCell>
                            <TableCell className="text-xs text-muted-foreground font-semibold">10 grams</TableCell>
                            <TableCell className="text-right font-mono font-extrabold text-amber-600 text-sm">
                              {formatPrice(prices.g22k * 10)}
                            </TableCell>
                          </TableRow>
                          <TableRow className="hover:bg-amber-600/[0.04] text-left">
                            <TableCell className="text-xs text-muted-foreground/80 pl-6">↳ Per 1 gram</TableCell>
                            <TableCell className="text-xs text-muted-foreground">1 gram</TableCell>
                            <TableCell className="text-right font-mono font-bold text-xs text-foreground/80">
                              {formatPrice(prices.g22k)}
                            </TableCell>
                          </TableRow>
                          <TableRow className="hover:bg-amber-600/[0.04] text-left">
                            <TableCell className="text-xs text-muted-foreground/80 pl-6">↳ Per Sovereign (Pawan)</TableCell>
                            <TableCell className="text-xs text-muted-foreground">8 grams</TableCell>
                            <TableCell className="text-right font-mono font-bold text-xs text-foreground/80">
                              {formatPrice(prices.g22k * 8)}
                            </TableCell>
                          </TableRow>

                          {/* Gold 18k */}
                          <TableRow className="bg-orange-600/[0.02] hover:bg-orange-600/[0.08] transition-colors border-l-2 border-l-orange-500 text-left">
                            <TableCell className="font-bold">
                              <span className="text-orange-600 flex items-center gap-1.5 font-headline">
                                <span className="h-1.5 w-1.5 rounded-full bg-orange-400 animate-pulse" />
                                Gold (18K) - Value
                              </span>
                            </TableCell>
                            <TableCell className="text-xs text-muted-foreground font-semibold">10 grams</TableCell>
                            <TableCell className="text-right font-mono font-extrabold text-orange-600 text-sm">
                              {formatPrice(prices.g18k * 10)}
                            </TableCell>
                          </TableRow>
                          <TableRow className="hover:bg-orange-600/[0.04] text-left">
                            <TableCell className="text-xs text-muted-foreground/80 pl-6">↳ Per 1 gram</TableCell>
                            <TableCell className="text-xs text-muted-foreground">1 gram</TableCell>
                            <TableCell className="text-right font-mono font-bold text-xs text-foreground/80">
                              {formatPrice(prices.g18k)}
                            </TableCell>
                          </TableRow>

                          {/* Silver */}
                          <TableRow className="bg-slate-400/[0.02] hover:bg-slate-400/[0.08] transition-colors border-l-2 border-l-slate-400 text-left">
                            <TableCell className="font-bold">
                              <span className="text-slate-600 flex items-center gap-1.5 font-headline">
                                <span className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-pulse" />
                                Pure Silver
                              </span>
                            </TableCell>
                            <TableCell className="text-xs text-muted-foreground font-semibold">1 Kilogram (1kg)</TableCell>
                            <TableCell className="text-right font-mono font-extrabold text-slate-600 text-sm">
                              {formatPrice(prices.silver * 1000)}
                            </TableCell>
                          </TableRow>
                          <TableRow className="hover:bg-slate-400/[0.04] text-left">
                            <TableCell className="text-xs text-muted-foreground/80 pl-6">↳ Per 1 gram</TableCell>
                            <TableCell className="text-xs text-muted-foreground">1 gram</TableCell>
                            <TableCell className="text-right font-mono font-bold text-xs text-foreground/80">
                              {symbol + prices.silver.toFixed(2)}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>

                    {/* Mobile Card List View */}
                    <div className="block md:hidden p-4 space-y-4 text-left">
                      {/* Card 1: Gold 24K */}
                      <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-4 space-y-3">
                        <div className="flex justify-between items-center border-b border-yellow-500/10 pb-2">
                          <span className="font-bold text-sm text-yellow-600 flex items-center gap-1.5">
                            <span className="h-2 w-2 rounded-full bg-yellow-500 animate-pulse" />
                            Gold (24K) - Pure
                          </span>
                          <span className="text-[10px] text-muted-foreground uppercase font-black tracking-wider">Live Rates</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-muted-foreground">Per 10 grams</span>
                          <span className="font-mono font-extrabold text-yellow-600">{formatPrice(prices.g24k * 10)}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-muted-foreground">Per 8g (Sovereign)</span>
                          <span className="font-mono font-bold">{formatPrice(prices.g24k * 8)}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-muted-foreground">Per 1 gram</span>
                          <span className="font-mono font-bold">{formatPrice(prices.g24k)}</span>
                        </div>
                      </div>

                      {/* Card 2: Gold 22K */}
                      <div className="rounded-xl border border-amber-600/20 bg-amber-600/5 p-4 space-y-3">
                        <div className="flex justify-between items-center border-b border-amber-600/10 pb-2">
                          <span className="font-bold text-sm text-amber-600 flex items-center gap-1.5">
                            <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                            Gold (22K) - Jewelry
                          </span>
                          <span className="text-[10px] text-muted-foreground uppercase font-black tracking-wider">Live Rates</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-muted-foreground">Per 10 grams</span>
                          <span className="font-mono font-extrabold text-amber-600">{formatPrice(prices.g22k * 10)}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-muted-foreground">Per 8g (Sovereign)</span>
                          <span className="font-mono font-bold">{formatPrice(prices.g22k * 8)}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-muted-foreground">Per 1 gram</span>
                          <span className="font-mono font-bold">{formatPrice(prices.g22k)}</span>
                        </div>
                      </div>

                      {/* Card 3: Gold 18K */}
                      <div className="rounded-xl border border-orange-500/20 bg-orange-500/5 p-4 space-y-3">
                        <div className="flex justify-between items-center border-b border-orange-500/10 pb-2">
                          <span className="font-bold text-sm text-orange-600 flex items-center gap-1.5">
                            <span className="h-2 w-2 rounded-full bg-orange-400 animate-pulse" />
                            Gold (18K) - Value
                          </span>
                          <span className="text-[10px] text-muted-foreground uppercase font-black tracking-wider">Live Rates</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-muted-foreground">Per 10 grams</span>
                          <span className="font-mono font-extrabold text-orange-600">{formatPrice(prices.g18k * 10)}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-muted-foreground">Per 1 gram</span>
                          <span className="font-mono font-bold">{formatPrice(prices.g18k)}</span>
                        </div>
                      </div>

                      {/* Card 4: Silver */}
                      <div className="rounded-xl border border-slate-400/20 bg-slate-400/5 p-4 space-y-3">
                        <div className="flex justify-between items-center border-b border-slate-400/10 pb-2">
                          <span className="font-bold text-sm text-slate-600 flex items-center gap-1.5">
                            <span className="h-2 w-2 rounded-full bg-slate-400 animate-pulse" />
                            Pure Silver
                          </span>
                          <span className="text-[10px] text-muted-foreground uppercase font-black tracking-wider">Live Rates</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-muted-foreground">Per 1 Kilogram (1kg)</span>
                          <span className="font-mono font-extrabold text-slate-600">{formatPrice(prices.silver * 1000)}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-muted-foreground">Per 1 gram</span>
                          <span className="font-mono font-bold">{symbol + prices.silver.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Pop-up 1: Country Selection Dialog (Full height with 4px gap, compact width md:max-w-md on desktop) */}
      <Dialog open={isCountryDialogOpen} onOpenChange={setIsCountryDialogOpen}>
        <DialogContent className="w-[calc(100vw-8px)] md:max-w-md h-[calc(100vh-8px)] max-h-[calc(100vh-8px)] max-w-none p-5 rounded-2xl border border-primary/10 shadow-xl bg-card flex flex-col">
          <DialogHeader className="text-left shrink-0">
            <DialogTitle className="font-headline font-black text-2xl flex items-center gap-2">
              <Globe className="text-primary h-5 w-5" />
              SELECT COUNTRY
            </DialogTitle>
            <DialogDescription className="text-xs">
              Select a country to adjust currency conversions and retail bullion tax markups.
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto mt-4 pr-1 grid grid-cols-2 gap-3 content-start">
            {COUNTRIES.map((c) => (
              <Button
                key={c.code}
                variant={selectedCountryCode === c.code ? 'default' : 'outline'}
                onClick={() => selectCountry(c)}
                className="rounded-xl font-bold text-xs h-12 justify-start px-4 gap-2.5"
              >
                <Globe className="h-4 w-4 shrink-0 opacity-70" />
                <span className="truncate">{c.name}</span>
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Pop-up 2: City Selection Dialog (Full height with 4px gap, compact width md:max-w-md on desktop) */}
      <Dialog open={isCityDialogOpen} onOpenChange={setIsCityDialogOpen}>
        <DialogContent className="w-[calc(100vw-20px)] md:max-w-md h-[calc(100vh-8px)] max-h-[calc(100vh-8px)] max-w-none p-5 rounded-2xl border border-primary/10 shadow-xl bg-card flex flex-col">
          <DialogHeader className="text-left shrink-0">
            <DialogTitle className="font-headline font-black text-2xl flex items-center gap-2">
              <MapPin className="text-primary h-5 w-5 animate-pulse" />
              SELECT CITY
            </DialogTitle>
            <DialogDescription className="text-xs">
              Search any city or select a preset location in {selectedCountry}.
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto mt-4 pr-1 space-y-5">
            {/* Search Input (restricted to selected country code) */}
            <div className="space-y-1.5 text-left">
              <Label className="text-xs font-bold text-muted-foreground">Search Cities in {selectedCountry}</Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={`E.g. cities in ${selectedCountry}...`}
                    value={osmQuery}
                    onChange={(e) => setOsmQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && searchOsm()}
                    className="pl-9 rounded-xl font-medium border-primary/20"
                  />
                </div>
                <Button onClick={searchOsm} className="rounded-xl font-bold bg-primary hover:bg-primary/95 text-white">
                  {osmLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Search'}
                </Button>
              </div>
            </div>

            {/* Search Results */}
            {osmResults.length > 0 && (
              <div className="space-y-1.5 text-left">
                <Label className="text-xs font-bold text-muted-foreground">Search Results</Label>
                <div className="border border-primary/15 rounded-xl overflow-hidden divide-y divide-primary/5 max-h-[160px] overflow-y-auto bg-card">
                  {osmResults.map((result, idx) => {
                    const cityName =
                      result.address.city ||
                      result.address.town ||
                      result.address.village ||
                      result.address.municipality ||
                      result.display_name.split(',')[0];
                    const countryCode = (result.address.country_code || '').toUpperCase();
                    return (
                      <button
                        key={idx}
                        onClick={() =>
                          selectCity(cityName, parseFloat(result.lat), parseFloat(result.lon))
                        }
                        className="w-full text-left p-3 text-xs font-semibold hover:bg-primary/5 transition-colors flex items-center justify-between text-foreground/80"
                      >
                        <span className="truncate pr-4">{result.display_name}</span>
                        <ChevronRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quick Cities Grid under Selected Country */}
            {activeCountryPreset && (
              <div className="space-y-1.5 pt-2 border-t border-primary/5 text-left">
                <Label className="text-xs font-bold text-muted-foreground">
                  Preset Cities in {selectedCountry}
                </Label>
                <div className="grid grid-cols-2 gap-2 max-h-[480px] overflow-y-auto pr-1">
                  {activeCountryPreset.cities.map((city: any) => (
                    <Button
                      key={city.name}
                      variant="outline"
                      onClick={() => selectCity(city.name, city.lat, city.lon)}
                      className="rounded-xl font-semibold text-xs h-9 justify-start px-3 bg-muted/40 hover:bg-primary/5 hover:border-primary/30"
                    >
                      <MapPin className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                      <span className="truncate">{city.name}</span>
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <section className="mt-12 space-y-8 prose prose-slate dark:prose-invert max-w-none">
        <div className="bg-primary/5 rounded-2xl p-6 md:p-10 border border-primary/10">
          <h2 className="text-3xl font-bold font-headline mb-6">Why Use Our Gold Price and Weather Tool?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm leading-relaxed text-left">
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
                <li>Tap the Country selector to pick your target country.</li>
                <li>Tap the City selector to search any global city or pick a preset local city.</li>
                <li>Review the current temperature, wind speed, condition, and live bullion prices instantly.</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-bold font-headline">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            <div className="p-6 rounded-xl border border-border/50 bg-card hover:border-primary/50 transition-colors">
              <h4 className="font-bold mb-2 text-base">How does the automatic location detection work?</h4>
              <p className="text-muted-foreground text-sm">On page load, our tool performs a secure client-side lookup via your IP address to detect your local country, currency, and city. No location permission dialog is required.</p>
            </div>
            <div className="p-6 rounded-xl border border-border/50 bg-card hover:border-primary/50 transition-colors">
              <h4 className="font-bold mb-2 text-base">Can I check rates for any city in the world?</h4>
              <p className="text-muted-foreground text-sm">Yes! Select your country, then click the City button and type any city name (like Paris, Tokyo, or New York) inside the selected country to fetch weather and live currency rates.</p>
            </div>
            <div className="p-6 rounded-xl border border-border/50 bg-card hover:border-primary/50 transition-colors">
              <h4 className="font-bold mb-2 text-base">Does this tool upload my selection to a server?</h4>
              <p className="text-muted-foreground text-sm">No. To guarantee security and privacy, all processing is performed locally inside your web browser. Your private details never leave your device.</p>
            </div>
            <div className="p-6 rounded-xl border border-border/50 bg-card hover:border-primary/50 transition-colors">
              <h4 className="font-bold mb-2 text-base">Is the Gold Price and Weather tool free to use?</h4>
              <p className="text-muted-foreground text-sm">Yes! All tools on UseBro are 100% free with no monthly subscription limits, hidden fees, or signup forms.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
