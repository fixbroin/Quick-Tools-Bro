'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Heart, Sparkles } from 'lucide-react';
import { cn, scrollToDownload } from '@/lib/utils';

interface ZodiacInfo {
  name: string;
  element: 'Fire' | 'Earth' | 'Air' | 'Water';
  modality: 'Cardinal' | 'Fixed' | 'Mutable';
  index: number;
}

const zodiacs: ZodiacInfo[] = [
  { name: 'Aries', element: 'Fire', modality: 'Cardinal', index: 0 },
  { name: 'Taurus', element: 'Earth', modality: 'Fixed', index: 1 },
  { name: 'Gemini', element: 'Air', modality: 'Mutable', index: 2 },
  { name: 'Cancer', element: 'Water', modality: 'Cardinal', index: 3 },
  { name: 'Leo', element: 'Fire', modality: 'Fixed', index: 4 },
  { name: 'Virgo', element: 'Earth', modality: 'Mutable', index: 5 },
  { name: 'Libra', element: 'Air', modality: 'Cardinal', index: 6 },
  { name: 'Scorpio', element: 'Water', modality: 'Fixed', index: 7 },
  { name: 'Sagittarius', element: 'Fire', modality: 'Mutable', index: 8 },
  { name: 'Capricorn', element: 'Earth', modality: 'Cardinal', index: 9 },
  { name: 'Aquarius', element: 'Air', modality: 'Fixed', index: 10 },
  { name: 'Pisces', element: 'Water', modality: 'Mutable', index: 11 },
];

const getZodiacSign = (dateStr: string): string => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const month = date.getMonth() + 1;
  const day = date.getDate();

  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'Aries';
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'Taurus';
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 'Gemini';
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 'Cancer';
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'Leo';
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'Virgo';
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 'Libra';
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'Scorpio';
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'Sagittarius';
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 'Capricorn';
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'Aquarius';
  if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return 'Pisces';
  return '';
};

const calculateZodiacCompatibility = (sign1: string, sign2: string) => {
  const z1 = zodiacs.find(z => z.name === sign1);
  const z2 = zodiacs.find(z => z.name === sign2);
  if (!z1 || !z2) return { score: 50, detail: '' };

  const diff = Math.abs(z1.index - z2.index);
  const distance = diff > 6 ? 12 - diff : diff;

  let baseScore = 50;
  let detail = '';

  if (distance === 0) {
    baseScore = 80;
    detail = `You share the same sign of ${z1.name}. You understand each other's motivations deeply, though you may share the same weaknesses.`;
  } else if (distance === 4) {
    baseScore = 95;
    detail = `Classic Trine! Both signs belong to the ${z1.element} element. Harmony, comfort, and an effortless flow of energy define your connection.`;
  } else if (distance === 2) {
    baseScore = 85;
    detail = `Friendly Sextile! Your elements (${z1.element} & ${z2.element}) are highly supportive. This connection thrives on excellent communication, friendship, and understanding.`;
  } else if (distance === 6) {
    baseScore = 78;
    detail = `Polar Opposites! You are opposite signs on the zodiac wheel. This creates a magnetic, powerful attraction where you balance each other's strengths.`;
  } else if (distance === 3) {
    baseScore = 45;
    detail = `Astrological Square! This creates tension and friction. While challenging, this friction can act as a catalyst for growth and deep passion if handled with patience.`;
  } else {
    baseScore = 55;
    detail = `Adjusting Connection. You have very different outlooks. To make it work, you will need to learn to appreciate and accommodate your differences.`;
  }

  // Element affinity adjustments
  if (z1.element === z2.element && distance !== 0) {
    baseScore = 92;
  } else if (
    (z1.element === 'Fire' && z2.element === 'Air') ||
    (z1.element === 'Air' && z2.element === 'Fire') ||
    (z1.element === 'Earth' && z2.element === 'Water') ||
    (z1.element === 'Water' && z2.element === 'Earth')
  ) {
    baseScore = Math.min(baseScore + 5, 98);
  }

  return { score: baseScore, detail };
};

export default function LoveCalculatorPage() {
  const [matchMode, setMatchMode] = useState<'names' | 'astrology'>('names');
  const [name1, setName1] = useState('');
  const [name2, setName2] = useState('');
  const [zodiac1, setZodiac1] = useState('');
  const [zodiac2, setZodiac2] = useState('');
  const [percentage, setPercentage] = useState<number | null>(null);
  const [message, setMessage] = useState('');
  const [astroDetail, setAstroDetail] = useState('');
  const [errors, setErrors] = useState<{ name1?: string; name2?: string }>({});

  const validate = () => {
    const newErrors: { name1?: string; name2?: string } = {};
    if (!name1.trim()) {
      newErrors.name1 = "Your name is required.";
    }
    if (!name2.trim()) {
      newErrors.name2 = "Their name is required.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCalculate = () => {
    if (matchMode === 'names') {
      if (!validate()) {
        setPercentage(null);
        setMessage('');
        return;
      }
      
      const combinedNames = (name1 + name2).toLowerCase();
      let sum = 0;
      for (let i = 0; i < combinedNames.length; i++) {
          sum += combinedNames.charCodeAt(i);
      }
      const lovePercentage = (sum % 101);

      setPercentage(lovePercentage);
      setAstroDetail('');

      if (lovePercentage < 20) {
        setMessage("Maybe just friends... for now?");
      } else if (lovePercentage < 40) {
        setMessage("A little spark, but needs some fanning.");
      } else if (lovePercentage < 60) {
        setMessage("There's potential here! Give it a shot.");
      } else if (lovePercentage < 80) {
        setMessage("A strong connection! This could be something special.");
      } else if (lovePercentage < 95) {
        setMessage("Wow! You two are incredibly compatible!");
      } else {
        setMessage("It's a match made in heaven! Soulmates!");
      }
    } else {
      if (!zodiac1 || !zodiac2) {
        setErrors({
          name1: !zodiac1 ? 'Please select your Zodiac sign.' : undefined,
          name2: !zodiac2 ? 'Please select their Zodiac sign.' : undefined,
        });
        return;
      }
      setErrors({});
      const result = calculateZodiacCompatibility(zodiac1, zodiac2);
      setPercentage(result.score);
      setMessage(result.detail);
      const z1 = zodiacs.find(z => z.name === zodiac1);
      const z2 = zodiacs.find(z => z.name === zodiac2);
      if (z1 && z2) {
        setAstroDetail(`Your element: ${z1.element} (${z1.modality}) • Their element: ${z2.element} (${z2.modality})`);
      } else {
        setAstroDetail('');
      }
    }
    scrollToDownload();
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center justify-center gap-2">
            <Heart className="w-6 h-6 text-red-500 fill-red-500 animate-pulse" />
            Love Calculator
          </CardTitle>
          <CardDescription className="text-center">
            Find out your connection percentage using name compatibilities or real astrological planetary aspects!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex gap-2 justify-center mb-4">
            <Button
              variant={matchMode === 'names' ? 'default' : 'outline'}
              onClick={() => { setMatchMode('names'); setPercentage(null); setErrors({}); }}
              className="rounded-full text-xs font-semibold px-4 h-9"
            >
              Name Match (Fun)
            </Button>
            <Button
              variant={matchMode === 'astrology' ? 'default' : 'outline'}
              onClick={() => { setMatchMode('astrology'); setPercentage(null); setErrors({}); }}
              className="rounded-full text-xs font-semibold px-4 h-9 flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Astro Match (Astrology)
            </Button>
          </div>

          {matchMode === 'names' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
              <div className="space-y-2">
                <Label htmlFor="name1">Your Name</Label>
                <Input 
                  id="name1" 
                  value={name1} 
                  onChange={(e) => setName1(e.target.value)} 
                  placeholder="e.g., Alex"
                  className={cn(errors.name1 && "border-destructive")}
                />
                {errors.name1 && <p className="text-sm font-medium text-destructive">{errors.name1}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="name2">Their Name</Label>
                <Input 
                  id="name2" 
                  value={name2} 
                  onChange={(e) => setName2(e.target.value)} 
                  placeholder="e.g., Jamie"
                  className={cn(errors.name2 && "border-destructive")}
                />
                {errors.name2 && <p className="text-sm font-medium text-destructive">{errors.name2}</p>}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              <div className="space-y-3 p-4 border rounded-xl bg-muted/20">
                <Label className="text-sm font-bold">Your Details</Label>
                <div className="space-y-2">
                  <Label htmlFor="zodiac1">Your Zodiac Sign</Label>
                  <Select onValueChange={(val) => setZodiac1(val)} value={zodiac1}>
                    <SelectTrigger id="zodiac1">
                      <SelectValue placeholder="Select Sign" />
                    </SelectTrigger>
                    <SelectContent>
                      {zodiacs.map(z => (
                        <SelectItem key={z.name} value={z.name}>
                          {z.name} ({z.element})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.name1 && <p className="text-xs font-medium text-destructive">{errors.name1}</p>}
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground">Don't know it? Select birthdate:</span>
                  <Input
                    type="date"
                    onChange={(e) => {
                      const sign = getZodiacSign(e.target.value);
                      if (sign) setZodiac1(sign);
                    }}
                    className="h-9 text-xs"
                  />
                </div>
              </div>

              <div className="space-y-3 p-4 border rounded-xl bg-muted/20">
                <Label className="text-sm font-bold">Their Details</Label>
                <div className="space-y-2">
                  <Label htmlFor="zodiac2">Their Zodiac Sign</Label>
                  <Select onValueChange={(val) => setZodiac2(val)} value={zodiac2}>
                    <SelectTrigger id="zodiac2">
                      <SelectValue placeholder="Select Sign" />
                    </SelectTrigger>
                    <SelectContent>
                      {zodiacs.map(z => (
                        <SelectItem key={z.name} value={z.name}>
                          {z.name} ({z.element})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.name2 && <p className="text-xs font-medium text-destructive">{errors.name2}</p>}
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground">Don't know it? Select birthdate:</span>
                  <Input
                    type="date"
                    onChange={(e) => {
                      const sign = getZodiacSign(e.target.value);
                      if (sign) setZodiac2(sign);
                    }}
                    className="h-9 text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="text-center pt-2">
            <Button onClick={handleCalculate} size="lg" className="w-full sm:w-auto font-bold px-8">
              Check Compatibility
            </Button>
          </div>
        </CardContent>
        {percentage !== null && (
          <CardFooter id="download-section" className="border-t pt-6 bg-muted/5">
            <div className="w-full text-center space-y-4">
                <div className="relative w-48 h-48 mx-auto flex items-center justify-center animate-in zoom-in duration-300">
                  <Heart className="w-full h-full text-red-500 fill-red-500/10 animate-pulse" />
                  <div className="absolute text-5xl font-extrabold text-red-500 font-headline">
                      {percentage}%
                  </div>
                </div>
                {astroDetail && (
                  <p className="text-xs font-semibold tracking-wider uppercase text-muted-foreground">{astroDetail}</p>
                )}
                <p className="text-lg font-bold max-w-xl mx-auto leading-relaxed">{message}</p>
            </div>
          </CardFooter>
        )}
      </Card>

      <section className="mt-12 space-y-8 prose prose-slate dark:prose-invert max-w-none border-t pt-12">
        <div className="bg-primary/5 rounded-2xl p-6 md:p-10 border border-primary/10">
          <h2 className="text-3xl font-bold font-headline mb-6">Why Use Our Love Calculator?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm leading-relaxed">
            <div>
              <h3 className="text-lg font-semibold mb-2">Astrological Compatibility</h3>
              <p>Compare zodiac signs using element combinations (Fire, Earth, Air, Water) and distance aspects like Trines, Sextiles, and Squares to check for real cosmic harmony.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Birthdate Lookup</h3>
              <p>Don't know your zodiac signs? Simply pick your birthdates in our interactive calendar, and the calculator determines them for you instantly.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Private & Client-Side</h3>
              <p>Your privacy is absolute. Your names, birthdates, and compatibility calculations are computed entirely inside your local browser and never sent to any server.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Ice Breaker & Fun</h3>
              <p>Try the Name Match mode for a playful icebreaker or date-night comparison tool. Fun for all couples and friends.</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-bold font-headline">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">How does Astro Match compatibility work?</h3>
              <p>Astrology compatibility is based on aspects. A 120° distance (Trine) indicates natural element harmony (95% match), 60° (Sextile) represents friendly alignment (85% match), and opposite signs provide magnetic attraction (78% match), while 90° squares create friction (45% match).</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Is the name calculator accurate?</h3>
              <p>The Name Match is a playful calculation designed strictly for fun and games. The Astro Match mode represents actual traditional astrology rules, but is still meant for entertainment purposes!</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Can I enter date ranges?</h3>
              <p>Yes, just pick your exact birth date, and we'll extract your tropical sun sign (Aries through Pisces) automatically.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Do you log my search data?</h3>
              <p>No, we process 100% of inputs locally on your browser. Your information is never logged, stored, or shared.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
