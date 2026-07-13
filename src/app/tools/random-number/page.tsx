'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Copy, RefreshCw, Sparkles, SwitchCamera } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

export default function RandomNumberPage() {
  const [min, setMin] = useState<number>(1);
  const [max, setMax] = useState<number>(100);
  const [count, setCount] = useState<number>(10);
  const [allowDuplicates, setAllowDuplicates] = useState<boolean>(false);
  const [numbers, setNumbers] = useState<number[]>([]);
  const { toast } = useToast();

  const handleGenerate = () => {
    if (min >= max) {
      toast({ title: "Invalid Range", description: "Min value must be less than Max value.", variant: "destructive" });
      return;
    }

    const range = max - min + 1;
    if (!allowDuplicates && count > range) {
      toast({
        title: "Too Many Numbers Requested",
        description: `Cannot generate ${count} unique numbers in a range of ${range}. Please enable duplicates or reduce count.`,
        variant: "destructive"
      });
      return;
    }

    const generated: number[] = [];
    const used = new Set<number>();

    while (generated.length < count) {
      const num = Math.floor(Math.random() * range) + min;
      if (allowDuplicates) {
        generated.push(num);
      } else {
        if (!used.has(num)) {
          used.add(num);
          generated.push(num);
        }
      }
    }

    setNumbers(generated);
  };

  useEffect(() => {
    handleGenerate();
  }, []);

  const handleCopy = () => {
    if (numbers.length === 0) return;
    navigator.clipboard.writeText(numbers.join(', '));
    toast({ title: 'Copied to Clipboard!', description: 'Copied all generated numbers.' });
  };

  const handleSortAsc = () => {
    setNumbers(prev => [...prev].sort((a, b) => a - b));
  };

  const handleSortDesc = () => {
    setNumbers(prev => [...prev].sort((a, b) => b - a));
  };

  return (<>
      <div className="space-y-8 pb-20 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-6">
          <Card className="shadow-lg border-primary/10">
            <CardHeader className="bg-primary/5 border-b">
              <CardTitle className="flex items-center gap-2 italic font-black text-2xl">
                <Sparkles className="h-6 w-6 text-primary" /> RANDOM NUMBERS
              </CardTitle>
              <CardDescription>Generate random integers in standard ranges client-side.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="min" className="text-xs font-bold uppercase tracking-wider">Min Value</Label>
                  <Input id="min" type="number" value={min} onChange={(e) => setMin(Number(e.target.value))} className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max" className="text-xs font-bold uppercase tracking-wider">Max Value</Label>
                  <Input id="max" type="number" value={max} onChange={(e) => setMax(Number(e.target.value))} className="rounded-xl" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="count" className="text-xs font-bold uppercase tracking-wider">Quantity to Generate</Label>
                <Input id="count" type="number" value={count} onChange={(e) => setCount(Number(e.target.value))} className="rounded-xl" />
              </div>

              <div className="flex items-center justify-between pt-2">
                <Label htmlFor="duplicates" className="text-sm font-semibold cursor-pointer">Allow Duplicate Numbers</Label>
                <Switch id="duplicates" checked={allowDuplicates} onCheckedChange={setAllowDuplicates} />
              </div>
            </CardContent>
            <CardFooter className="bg-muted/30 p-6 border-t">
              <Button className="w-full h-12 rounded-xl font-bold" onClick={handleGenerate}>
                <RefreshCw className="mr-2 h-4 w-4" /> GENERATE
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="lg:col-span-7">
          <Card className="shadow-lg border-primary/10 h-full flex flex-col">
            <CardHeader className="bg-muted/50 border-b flex flex-row justify-between items-center px-6">
              <CardTitle className="text-sm uppercase tracking-widest text-muted-foreground">Output Numbers</CardTitle>
              {numbers.length > 0 && (
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={handleSortAsc} className="h-8 rounded-lg text-xs">Sort Asc</Button>
                  <Button size="sm" variant="outline" onClick={handleSortDesc} className="h-8 rounded-lg text-xs">Sort Desc</Button>
                  <Button size="sm" variant="outline" onClick={handleCopy} className="h-8 rounded-lg text-xs"><Copy className="h-3.5 w-3.5 mr-1" /> Copy</Button>
                </div>
              )}
            </CardHeader>
            <CardContent className="flex-1 p-6 flex items-center justify-center min-h-[300px]">
              {numbers.length > 0 ? (
                <div className="grid grid-cols-5 gap-3 w-full max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                  {numbers.map((num, idx) => (
                    <div
                      key={idx}
                      className="border rounded-2xl bg-card p-4 text-center font-black italic text-lg text-primary shadow-sm hover:scale-105 transition-transform"
                    >
                      {num}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center space-y-3 opacity-40">
                  <Sparkles className="h-16 w-16 mx-auto stroke-[1.5]" />
                  <p className="text-sm font-bold uppercase tracking-widest">Awaiting Generator</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
      
      <section className="mt-12 space-y-8 prose prose-slate dark:prose-invert max-w-none">
        <div className="bg-primary/5 rounded-2xl p-6 md:p-10 border border-primary/10">
            <h2 className="text-3xl font-bold font-headline mb-6">Why Use Our Random Number Generator?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm leading-relaxed">
                <div className="space-y-4">
                    <p>
                        <strong className="text-primary font-bold">Free & Secure:</strong> Our Random Number Generator is 100% free and runs completely in your web browser. No registration, signup, or installation is required.
                    </p>
                    <p>
                        Generate list of unique random numbers in range.
                    </p>
                </div>
                <div className="space-y-4">
                    <p>
                        <strong className="text-primary font-bold">Step-by-Step Guide:</strong>
                    </p>
                    <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                        <li>Open the Random Number Generator tool on UseBro.</li>
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
                    <h4 className="font-bold mb-2 text-base">Is the Random Number Generator tool free to use?</h4>
                    <p className="text-muted-foreground text-sm">Yes! All tools on UseBro are 100% free with no monthly subscription limits, hidden fees, or signup forms.</p>
                </div>
                <div className="p-6 rounded-xl border border-border/50 bg-card hover:border-primary/50 transition-colors">
                    <h4 className="font-bold mb-2 text-base">Does this Random Number Generator upload my files to a server?</h4>
                    <p className="text-muted-foreground text-sm">No. To guarantee security and privacy, all processing is performed locally inside your web browser. Your private files never leave your device.</p>
                </div>
                <div className="p-6 rounded-xl border border-border/50 bg-card hover:border-primary/50 transition-colors">
                    <h4 className="font-bold mb-2 text-base">Can I use Random Number Generator on my mobile device?</h4>
                    <p className="text-muted-foreground text-sm">Yes! UseBro is fully mobile-friendly and responsive, running smoothly on Android, iPhone, iPad, and desktop browsers.</p>
                </div>
            </div>
        </div>
      </section>
    </>);
}
