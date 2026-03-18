
'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Heart } from 'lucide-react';
import { cn, scrollToDownload } from '@/lib/utils';

export default function LoveCalculatorPage() {
  const [name1, setName1] = useState('');
  const [name2, setName2] = useState('');
  const [percentage, setPercentage] = useState<number | null>(null);
  const [message, setMessage] = useState('');
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

  const calculateLove = () => {
    if (!validate()) {
      setPercentage(null);
      setMessage('');
      return;
    }
    
    // A simple, predictable but fun calculation based on names
    const combinedNames = (name1 + name2).toLowerCase();
    let sum = 0;
    for (let i = 0; i < combinedNames.length; i++) {
        sum += combinedNames.charCodeAt(i);
    }
    const lovePercentage = (sum % 101); // % 101 to get a value between 0 and 100

    setPercentage(lovePercentage);

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
    scrollToDownload();
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Love Calculator</CardTitle>
          <CardDescription>Enter two names to see your compatibility. For fun only!</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
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
          <Button onClick={calculateLove}>Calculate Love</Button>
        </CardContent>
        {percentage !== null && (
          <CardFooter id="download-section">
            <div className="w-full text-center space-y-4">
                <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
                  <Heart className="w-full h-full text-red-500/20" fill="currentColor"/>
                  <div className="absolute text-5xl font-bold text-white font-headline">
                      {percentage}%
                  </div>
                </div>
                <p className="text-lg font-medium">{message}</p>
            </div>
          </CardFooter>
        )}
      </Card>

      <section className="mt-12 space-y-8 prose prose-slate dark:prose-invert max-w-none border-t pt-12">
        <div className="bg-primary/5 rounded-2xl p-6 md:p-10 border border-primary/10">
          <h2 className="text-3xl font-bold font-headline mb-6">Why Use Our Love Calculator?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm leading-relaxed">
            <div>
              <h3 className="text-lg font-semibold mb-2">Instant Fun</h3>
              <p>Get your love compatibility percentage in seconds by simply entering two names. It's a quick and entertaining way to spend a few moments.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Ice Breaker</h3>
              <p>Looking for a fun way to start a conversation? Our Love Calculator is a great icebreaker for parties, social gatherings, or even a date night.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Simple & Free</h3>
              <p>No sign-ups, no subscriptions, and no hidden fees. Our tool is 100% free to use for everyone, anytime, anywhere.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Private & Secure</h3>
              <p>We value your privacy. Your names and results are processed locally in your browser and are never stored on our servers.</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-bold font-headline">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">How does the Love Calculator work?</h3>
              <p>Our tool uses a playful algorithm that assigns numerical values to the letters in the names provided and calculates a compatibility score based on those values.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Is the result accurate?</h3>
              <p>No, the results are generated by a simple algorithm for fun and entertainment purposes only. Real compatibility depends on many complex factors beyond just names!</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Can I use it with nicknames?</h3>
              <p>Absolutely! You can try your full names, nicknames, or even just initials to see how the results change. It's all about having a good time.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Do you save the names I enter?</h3>
              <p>Not at all. We do not collect, save, or share any of the information you enter into the calculator. Your fun stays private.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
