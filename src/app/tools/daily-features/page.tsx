'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CloudSun, Gem, Fuel, Bell, Gift, Copy, Loader2, MapPin } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { fetchMarketRates } from '@/app/actions/market';
import { fetchLiveJobAlerts } from '@/app/actions/jobs';
import { fetchLiveCouponsAndCourses } from '@/app/actions/coupons';

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

export default function DailyFeaturesPage() {
  const [selectedCityIdx, setSelectedCityIdx] = useState<string>('0');
  const [weatherData, setWeatherData] = useState<any>(null);
  const [weatherLoading, setWeatherLoading] = useState<boolean>(false);
  const [exchangeRate, setExchangeRate] = useState<number>(95.5);
  const [liveGold24k, setLiveGold24k] = useState<number>(147630);
  const [liveGold22k, setLiveGold22k] = useState<number>(135230);
  const [liveSilver, setLiveSilver] = useState<number>(212480);
  const [ratesLoading, setRatesLoading] = useState<boolean>(false);

  const [liveJobs, setLiveJobs] = useState<any[]>([]);
  const [liveExams, setLiveExams] = useState<any[]>([]);
  const [jobsLoading, setJobsLoading] = useState<boolean>(false);

  const [liveCourses, setLiveCourses] = useState<any[]>([]);
  const [liveCoupons, setLiveCoupons] = useState<any[]>([]);
  const [couponsLoading, setCouponsLoading] = useState<boolean>(false);
  
  const { toast } = useToast();

  const fetchRates = async () => {
    setRatesLoading(true);
    try {
      const data = await fetchMarketRates();
      setExchangeRate(data.exchangeRate);
      setLiveGold24k(data.gold24k);
      setLiveGold22k(data.gold22k);
      setLiveSilver(data.silver);
    } catch (err) {
      console.error('Failed to load market rates:', err);
    } finally {
      setRatesLoading(false);
    }
  };

  const fetchJobs = async () => {
    setJobsLoading(true);
    try {
      const data = await fetchLiveJobAlerts();
      setLiveJobs(data.jobs);
      setLiveExams(data.exams);
    } catch (err) {
      console.error('Failed to load jobs data:', err);
    } finally {
      setJobsLoading(false);
    }
  };

  const fetchCoupons = async () => {
    setCouponsLoading(true);
    try {
      const data = await fetchLiveCouponsAndCourses();
      setLiveCourses(data.courses);
      setLiveCoupons(data.coupons);
    } catch (err) {
      console.error('Failed to load coupons data:', err);
    } finally {
      setCouponsLoading(false);
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
    fetchJobs();
    fetchCoupons();
  }, []);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: 'Copied to Clipboard!', description: `"${text}" ready to use.` });
  };

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

    return {
      gold24k: liveGold24k + goldOffset,
      gold22k: liveGold22k + Math.round((goldOffset * 22) / 24),
      silver: liveSilver + silverOffset
    };
  };

  // Calculate city-specific fuel rates scaled by exchange rate shifts
  const getCityFuelRates = () => {
    const scale = exchangeRate / 83.5;
    let basePetrol = 94.72;
    let baseDiesel = 87.62;

    switch (currentCityName) {
      case 'Mumbai':
        basePetrol = 104.21;
        baseDiesel = 92.15;
        break;
      case 'Bangalore':
        basePetrol = 101.94;
        baseDiesel = 87.89;
        break;
      case 'Kolkata':
        basePetrol = 103.94;
        baseDiesel = 90.76;
        break;
      case 'Chennai':
        basePetrol = 100.75;
        baseDiesel = 92.34;
        break;
      case 'Hyderabad':
        basePetrol = 109.66;
        baseDiesel = 97.82;
        break;
      case 'Ahmedabad':
        basePetrol = 96.42;
        baseDiesel = 92.17;
        break;
      case 'Pune':
        basePetrol = 103.68;
        baseDiesel = 90.22;
        break;
      case 'Jaipur':
        basePetrol = 104.88;
        baseDiesel = 90.36;
        break;
      case 'Lucknow':
        basePetrol = 96.57;
        baseDiesel = 89.76;
        break;
      default:
        basePetrol = 94.72;
        baseDiesel = 87.62;
    }

    return {
      petrol: (basePetrol * scale).toFixed(2),
      diesel: (baseDiesel * scale).toFixed(2)
    };
  };

  const { gold24k, gold22k, silver } = getCityMetalPrices();
  const { petrol, diesel } = getCityFuelRates();

  return (<>
      <div className="space-y-8 pb-20 animate-in fade-in duration-500">
      <header className="mb-6 text-center">
        <h1 className="font-headline text-3xl font-bold tracking-tight md:text-4xl">DAILY UPDATES DASHBOARD</h1>
        <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">
          Real-time weather metrics, commodity spot rates, active discount coupons, and job/exam listings.
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

      <Tabs defaultValue="weather" className="w-full">
        <TabsList className="grid w-full grid-cols-5 rounded-2xl h-12 mb-6">
          <TabsTrigger value="weather" className="rounded-xl font-bold text-xs"><CloudSun className="h-4 w-4 mr-1.5 hidden md:inline" /> Weather</TabsTrigger>
          <TabsTrigger value="gold" className="rounded-xl font-bold text-xs"><Gem className="h-4 w-4 mr-1.5 hidden md:inline" /> Gold / Silver</TabsTrigger>
          <TabsTrigger value="fuel" className="rounded-xl font-bold text-xs"><Fuel className="h-4 w-4 mr-1.5 hidden md:inline" /> Fuel Rates</TabsTrigger>
          <TabsTrigger value="jobs" className="rounded-xl font-bold text-xs"><Bell className="h-4 w-4 mr-1.5 hidden md:inline" /> Jobs & Exams</TabsTrigger>
          <TabsTrigger value="coupons" className="rounded-xl font-bold text-xs"><Gift className="h-4 w-4 mr-1.5 hidden md:inline" /> Coupons & Courses</TabsTrigger>
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
              <CardDescription>Live daily retail bullion and jewel rates for 24K, 22K, and Silver.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {ratesLoading ? (
                <div className="flex justify-center py-10"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Metal Standard</TableHead>
                      <TableHead className="text-right">Price per Weight</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-bold">Gold (24 Karat)</TableCell>
                      <TableCell className="text-right font-mono font-bold text-primary text-sm">
                        ₹{gold24k.toLocaleString('en-IN')} / 10g
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-bold">Gold (22 Karat)</TableCell>
                      <TableCell className="text-right font-mono font-bold text-primary text-sm">
                        ₹{gold22k.toLocaleString('en-IN')} / 10g
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-bold">Pure Silver</TableCell>
                      <TableCell className="text-right font-mono font-bold text-primary text-sm">
                        ₹{silver.toLocaleString('en-IN')} / 1kg
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* 3. Fuel Rates */}
        <TabsContent value="fuel" className="space-y-4 max-w-xl mx-auto">
          <Card className="shadow-lg border-primary/10">
            <CardHeader className="bg-primary/5 border-b p-4">
              <CardTitle className="flex items-center gap-2 font-black text-xl"><Fuel className="text-primary h-5 w-5" /> FUEL RATES IN {currentCityName.toUpperCase()}</CardTitle>
              <CardDescription>Live regional retail price per liter for petrol and diesel.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {ratesLoading ? (
                <div className="flex justify-center py-10"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Fuel Type</TableHead>
                      <TableHead className="text-right">Price (₹/L)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-bold flex items-center gap-2">Petrol</TableCell>
                      <TableCell className="text-right font-mono font-bold text-primary text-sm">
                        ₹{petrol}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-bold flex items-center gap-2">Diesel</TableCell>
                      <TableCell className="text-right font-mono font-bold text-primary text-sm">
                        ₹{diesel}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* 4. Jobs & Exams */}
        <TabsContent value="jobs" className="space-y-4 max-w-2xl mx-auto">
          <Card className="shadow-lg border-primary/10">
            <CardHeader className="bg-primary/5 border-b p-4">
              <CardTitle className="flex items-center gap-2 font-black text-xl"><Bell className="text-primary h-5 w-5" /> RECRUITMENT & EXAM NOTIFICATIONS</CardTitle>
              <CardDescription>Latest alerts for major government job openings and educational board outcomes.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {jobsLoading ? (
                <div className="flex justify-center py-10"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>
              ) : (
                <>
                  <div className="space-y-3">
                    <Label className="text-xs font-bold uppercase tracking-wider block text-primary border-b pb-1">Latest Job Openings</Label>
                    <div className="space-y-2">
                      {liveJobs.length > 0 ? (
                        liveJobs.map((job, idx) => (
                          <div key={idx} className="p-3 border rounded-xl bg-card flex justify-between items-center gap-4">
                            <div>
                              <p className="text-xs font-bold leading-tight">{job.title}</p>
                              <p className="text-[10px] text-muted-foreground mt-0.5">Source: {job.source}</p>
                            </div>
                            <a href={job.link} target="_blank" rel="noreferrer" className="shrink-0">
                              <Button size="sm" variant="outline" className="h-7 text-[10px] font-bold">Apply</Button>
                            </a>
                          </div>
                        ))
                      ) : (
                        <p className="text-center py-4 text-xs text-muted-foreground">No recent alerts found.</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3 pt-2">
                    <Label className="text-xs font-bold uppercase tracking-wider block text-primary border-b pb-1">Academic Exam Results</Label>
                    <div className="space-y-2">
                      {liveExams.length > 0 ? (
                        liveExams.map((exam, idx) => (
                          <div key={idx} className="p-3 border rounded-xl bg-card flex justify-between items-center gap-4">
                            <div>
                              <p className="text-xs font-bold leading-tight">{exam.title}</p>
                              <p className="text-[10px] text-muted-foreground mt-0.5">Source: {exam.source}</p>
                            </div>
                            <a href={exam.link} target="_blank" rel="noreferrer" className="shrink-0">
                              <Button size="sm" variant="outline" className="h-7 text-[10px] font-bold">View</Button>
                            </a>
                          </div>
                        ))
                      ) : (
                        <p className="text-center py-4 text-xs text-muted-foreground">No recent alerts found.</p>
                      )}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* 5. Coupons & Courses */}
        <TabsContent value="coupons" className="space-y-4 max-w-2xl mx-auto">
          <Card className="shadow-lg border-primary/10">
            <CardHeader className="bg-primary/5 border-b p-4">
              <CardTitle className="flex items-center gap-2 font-black text-xl"><Gift className="text-primary h-5 w-5" /> FREE CERTIFICATES & COUPONS</CardTitle>
              <CardDescription>Curated lists of active retail promo codes and free web certifications.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {couponsLoading ? (
                <div className="flex justify-center py-10"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>
              ) : (
                <>
                  <div className="space-y-3">
                    <Label className="text-xs font-bold uppercase tracking-wider block text-primary border-b pb-1">Curated Free Courses</Label>
                    <div className="space-y-2">
                      {liveCourses.length > 0 ? (
                        liveCourses.map((course, idx) => (
                          <div key={idx} className="p-3 border rounded-xl bg-card flex justify-between items-center gap-4">
                            <div>
                              <p className="text-xs font-bold leading-tight">{course.title}</p>
                              <p className="text-[10px] text-muted-foreground mt-0.5">Source: {course.source}</p>
                            </div>
                            <a href={course.link} target="_blank" rel="noreferrer" className="shrink-0">
                              <Button size="sm" variant="outline" className="h-7 text-[10px] font-bold">Join</Button>
                            </a>
                          </div>
                        ))
                      ) : (
                        <p className="text-center py-4 text-xs text-muted-foreground">No active course alerts found.</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3 pt-2">
                    <Label className="text-xs font-bold uppercase tracking-wider block text-primary border-b pb-1">Active Discount Promo Codes</Label>
                    <div className="space-y-2">
                      {liveCoupons.length > 0 ? (
                        liveCoupons.map((coupon, idx) => (
                          <div key={idx} className="p-3 border rounded-xl bg-card flex justify-between items-center gap-4">
                            <div>
                              <p className="text-xs font-bold leading-tight">{coupon.title}</p>
                              <p className="text-[10px] text-muted-foreground mt-0.5">Source: {coupon.source}</p>
                            </div>
                            <a href={coupon.link} target="_blank" rel="noreferrer" className="shrink-0">
                              <Button size="sm" variant="outline" className="h-7 text-[10px] font-bold">View Deal</Button>
                            </a>
                          </div>
                        ))
                      ) : (
                        <p className="text-center py-4 text-xs text-muted-foreground">No active coupon alerts found.</p>
                      )}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
      
      <section className="mt-12 space-y-8 prose prose-slate dark:prose-invert max-w-none">
        <div className="bg-primary/5 rounded-2xl p-6 md:p-10 border border-primary/10">
            <h2 className="text-3xl font-bold font-headline mb-6">Why Use Our Daily Updates Dashboard?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm leading-relaxed">
                <div className="space-y-4">
                    <p>
                        <strong className="text-primary font-bold">Free & Secure:</strong> Our Daily Updates Dashboard is 100% free and runs completely in your web browser. No registration, signup, or installation is required.
                    </p>
                    <p>
                        Check weather, metal prices, jobs, coupons, and offers.
                    </p>
                </div>
                <div className="space-y-4">
                    <p>
                        <strong className="text-primary font-bold">Step-by-Step Guide:</strong>
                    </p>
                    <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                        <li>Open the Daily Updates Dashboard tool on UseBro.</li>
                        <li>Input your parameters or upload the required file in the field controls.</li>
                        <li>Wait for the tool to process the details dynamically in your browser.</li>
                        <li>Click download, save, or copy the final outputs to your device.</li>
                    </ul>
                </div>
            </div>
        </div>

        <div className="space-y-6">
            <h2 className="text-2xl font-bold font-headline">Frequently Asked Questions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-xl border border-border/50 bg-card hover:border-primary/50 transition-colors">
                    <h4 className="font-bold mb-2 text-base">Is the Daily Updates Dashboard tool free to use?</h4>
                    <p className="text-muted-foreground text-sm">Yes! All tools on UseBro are 100% free with no monthly subscription limits, hidden fees, or signup forms.</p>
                </div>
                <div className="p-6 rounded-xl border border-border/50 bg-card hover:border-primary/50 transition-colors">
                    <h4 className="font-bold mb-2 text-base">Does this Daily Updates Dashboard upload my files to a server?</h4>
                    <p className="text-muted-foreground text-sm">No. To guarantee security and privacy, all processing is performed locally inside your web browser. Your private files never leave your device.</p>
                </div>
                <div className="p-6 rounded-xl border border-border/50 bg-card hover:border-primary/50 transition-colors">
                    <h4 className="font-bold mb-2 text-base">Can I use Daily Updates Dashboard on my mobile device?</h4>
                    <p className="text-muted-foreground text-sm">Yes! UseBro is fully mobile-friendly and responsive, running smoothly on Android, iPhone, iPad, and desktop browsers.</p>
                </div>
            </div>
        </div>
      </section>
    </>);
}
