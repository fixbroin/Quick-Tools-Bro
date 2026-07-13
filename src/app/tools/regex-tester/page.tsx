'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertCircle, Code, ShieldCheck } from 'lucide-react';

export default function RegexTesterPage() {
  const [pattern, setPattern] = useState<string>('([a-zA-Z0-9._-]+)@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}');
  const [flags, setFlags] = useState({ g: true, i: true, m: false });
  const [testText, setTestText] = useState<string>('Hello! Send your feedback to test@quicktools.bro or contact@fixbro.in.');
  
  const [matches, setMatches] = useState<string[]>([]);
  const [groups, setGroups] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const { toast } = useToast();

  const handleTest = () => {
    setError(null);
    setMatches([]);
    setGroups([]);

    if (!pattern) return;

    try {
      let flagStr = '';
      if (flags.g) flagStr += 'g';
      if (flags.i) flagStr += 'i';
      if (flags.m) flagStr += 'm';

      const regex = new RegExp(pattern, flagStr);
      
      if (flags.g) {
        let match;
        const matchesList = [];
        const groupsList = [];
        
        // Loop through all matches using exec
        // Prevent infinite loops for empty matches (e.g., matching zero-width like ^)
        let lastIndex = -1;
        while ((match = regex.exec(testText)) !== null) {
          if (regex.lastIndex === lastIndex) {
            regex.lastIndex++;
          }
          lastIndex = regex.lastIndex;
          
          matchesList.push(match[0]);
          if (match.length > 1) {
            groupsList.push(Array.from(match).slice(1));
          }
        }
        setMatches(matchesList);
        setGroups(groupsList);
      } else {
        const match = testText.match(regex);
        if (match) {
          setMatches([match[0]]);
          if (match.length > 1) {
            setGroups([Array.from(match).slice(1)]);
          }
        }
      }
    } catch (err: any) {
      setError(err.message || 'Invalid regex pattern');
    }
  };

  useEffect(() => {
    handleTest();
  }, [pattern, flags, testText]);

  return (<>
      <div className="space-y-8 pb-20 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Editor Inputs */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="shadow-lg border-primary/10">
            <CardHeader className="bg-primary/5 border-b">
              <CardTitle className="flex items-center gap-2 italic font-black text-2xl">
                <Code className="h-6 w-6 text-primary" /> REGEX TESTER
              </CardTitle>
              <CardDescription>Test regular expression matching rules and capture groups against sample texts.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              
              <div className="space-y-2">
                <Label htmlFor="pattern" className="text-xs font-bold uppercase tracking-wider block">Regular Expression</Label>
                <div className="flex gap-2">
                  <span className="text-muted-foreground font-mono text-lg select-none">/</span>
                  <Input
                    id="pattern"
                    value={pattern}
                    onChange={(e) => setPattern(e.target.value)}
                    className="font-mono text-sm rounded-xl flex-1"
                    placeholder="[a-zA-Z]+"
                  />
                  <span className="text-muted-foreground font-mono text-lg select-none">/</span>
                  
                  {/* Inline flags display */}
                  <span className="font-mono text-sm flex items-center text-primary font-bold">
                    {flags.g && 'g'}{flags.i && 'i'}{flags.m && 'm'}
                  </span>
                </div>
              </div>

              {error && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive font-semibold text-xs flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox id="flag-g" checked={flags.g} onCheckedChange={(val: any) => setFlags(prev => ({ ...prev, g: val }))} />
                  <Label htmlFor="flag-g" className="text-xs font-bold uppercase cursor-pointer">Global (g)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="flag-i" checked={flags.i} onCheckedChange={(val: any) => setFlags(prev => ({ ...prev, i: val }))} />
                  <Label htmlFor="flag-i" className="text-xs font-bold uppercase cursor-pointer">Case Insensitive (i)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="flag-m" checked={flags.m} onCheckedChange={(val: any) => setFlags(prev => ({ ...prev, m: val }))} />
                  <Label htmlFor="flag-m" className="text-xs font-bold uppercase cursor-pointer">Multiline (m)</Label>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="testtext" className="text-xs font-bold uppercase tracking-wider">Test Text String</Label>
                <Textarea
                  id="testtext"
                  value={testText}
                  onChange={(e) => setTestText(e.target.value)}
                  placeholder="Insert sample text here..."
                  className="min-h-[150px] font-mono text-sm rounded-xl p-4 bg-background border"
                />
              </div>

            </CardContent>
          </Card>
        </div>

        {/* Results */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="shadow-lg border-primary/10 flex flex-col h-full">
            <CardHeader className="bg-muted/50 border-b">
              <CardTitle className="text-sm uppercase tracking-widest text-center text-muted-foreground">Match Outcomes</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-6 space-y-6">
              
              <div className="space-y-3 bg-muted/20 p-4 border rounded-2xl">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Match Status:</span>
                  <span className={`font-bold ${matches.length > 0 ? 'text-green-600' : 'text-destructive'}`}>
                    {matches.length > 0 ? 'MATCH FOUND' : 'NO MATCH'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Matches:</span>
                  <span className="font-bold">{matches.length}</span>
                </div>
              </div>

              {matches.length > 0 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider block">Matching Blocks</Label>
                    <div className="max-h-[150px] overflow-y-auto pr-2 custom-scrollbar space-y-1.5">
                      {matches.map((m, idx) => (
                        <div key={idx} className="font-mono text-xs p-2 border rounded-lg bg-card">
                          <span className="text-primary font-bold mr-2">[{idx + 1}]</span>
                          {m}
                        </div>
                      ))}
                    </div>
                  </div>

                  {groups.length > 0 && (
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase tracking-wider block">Capture Groups</Label>
                      <div className="max-h-[150px] overflow-y-auto pr-2 custom-scrollbar space-y-2">
                        {groups.map((group, idx) => (
                          <div key={idx} className="space-y-1 font-mono text-xs p-2 border rounded-lg bg-card">
                            <span className="text-green-600 font-bold block">Match Group #{idx + 1}</span>
                            {group.map((g: string, subIdx: number) => (
                              <div key={subIdx} className="pl-4">
                                <span className="text-muted-foreground font-semibold">Group {subIdx + 1}:</span> {g || 'undefined'}
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

            </CardContent>
          </Card>
        </div>

      </div>
    </div>
      
      <section className="mt-12 space-y-8 prose prose-slate dark:prose-invert max-w-none">
        <div className="bg-primary/5 rounded-2xl p-6 md:p-10 border border-primary/10">
            <h2 className="text-3xl font-bold font-headline mb-6">Why Use Our Regex Tester?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm leading-relaxed">
                <div className="space-y-4">
                    <p>
                        <strong className="text-primary font-bold">Free & Secure:</strong> Our Regex Tester is 100% free and runs completely in your web browser. No registration, signup, or installation is required.
                    </p>
                    <p>
                        Validate regular expressions and capture groups.
                    </p>
                </div>
                <div className="space-y-4">
                    <p>
                        <strong className="text-primary font-bold">Step-by-Step Guide:</strong>
                    </p>
                    <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                        <li>Open the Regex Tester tool on UseBro.</li>
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
                    <h4 className="font-bold mb-2 text-base">Is the Regex Tester tool free to use?</h4>
                    <p className="text-muted-foreground text-sm">Yes! All tools on UseBro are 100% free with no monthly subscription limits, hidden fees, or signup forms.</p>
                </div>
                <div className="p-6 rounded-xl border border-border/50 bg-card hover:border-primary/50 transition-colors">
                    <h4 className="font-bold mb-2 text-base">Does this Regex Tester upload my files to a server?</h4>
                    <p className="text-muted-foreground text-sm">No. To guarantee security and privacy, all processing is performed locally inside your web browser. Your private files never leave your device.</p>
                </div>
                <div className="p-6 rounded-xl border border-border/50 bg-card hover:border-primary/50 transition-colors">
                    <h4 className="font-bold mb-2 text-base">Can I use Regex Tester on my mobile device?</h4>
                    <p className="text-muted-foreground text-sm">Yes! UseBro is fully mobile-friendly and responsive, running smoothly on Android, iPhone, iPad, and desktop browsers.</p>
                </div>
            </div>
        </div>
      </section>
    </>);
}
