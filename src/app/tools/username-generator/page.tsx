'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Copy, Smile, Shuffle, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const ADJECTIVES = {
  gaming: ['Apex', 'Shadow', 'Ghost', 'Blaze', 'Quantum', 'Vortex', 'Cyber', 'Rogue', 'Slayer', 'Phantom', 'Storm', 'Nova'],
  cute: ['Fluffy', 'Happy', 'Tiny', 'Panda', 'Sunny', 'Sugar', 'Boba', 'Honey', 'Cosmic', 'Pixel', 'Peachy', 'Sparkle'],
  professional: ['Elite', 'Summit', 'Global', 'Apex', 'Prime', 'Focus', 'Alpha', 'Pro', 'Nova', 'Sigma', 'Core', 'Vanguard'],
  funny: ['Silly', 'Clumsy', 'Wobbly', 'Funky', 'Derpy', 'Goofy', 'Nutty', 'Wonky', 'Cheeky', 'Chunky', 'Loopo', 'Zany'],
  creative: ['Mystic', 'Lunar', 'Sol', 'Stardust', 'Neon', 'Echo', 'Drift', 'Aero', 'Zephyr', 'Aura', 'Karma', 'Fable']
};

const NOUNS = {
  gaming: ['Knight', 'Titan', 'Reaper', 'Rider', 'Spectre', 'Alpha', 'Wolf', 'Sniper', 'Zero', 'Matrix', 'Nexus', 'Gamer'],
  cute: ['Bear', 'Kitten', 'Bunny', 'Mochi', 'Star', 'Cloud', 'Berry', 'Koala', 'Corgi', 'Sprout', 'Butter', 'Cookie'],
  professional: ['Consult', 'Lead', 'Ventures', 'Labs', 'Group', 'Solutions', 'Partners', 'Systems', 'Tech', 'Network'],
  funny: ['Potato', 'Banana', 'Muffin', 'Noodle', 'Waffle', 'Goblin', 'Monkey', 'Pickle', 'Donut', 'Taco', 'Ninja', 'Squid'],
  creative: ['Dreamer', 'Voyage', 'Nomad', 'Wave', 'Muse', 'Spark', 'Oracle', 'Pulse', 'Haven', 'Craft', 'Vibe', 'Tale']
};

export default function UsernameGeneratorPage() {
  const [seed, setSeed] = useState('');
  const [theme, setTheme] = useState<'gaming' | 'cute' | 'professional' | 'funny' | 'creative'>('gaming');
  const [usernames, setUsernames] = useState<string[]>([]);
  const { toast } = useToast();

  const generateUsernames = () => {
    const list: string[] = [];
    const adjList = ADJECTIVES[theme];
    const nounList = NOUNS[theme];

    for (let i = 0; i < 15; i++) {
      const adj = adjList[Math.floor(Math.random() * adjList.length)];
      const noun = nounList[Math.floor(Math.random() * nounList.length)];
      const num = Math.floor(Math.random() * 99) + 1;
      
      let name = '';
      const coin = Math.random();

      if (seed.trim()) {
        const cleanedSeed = seed.trim().replace(/\s+/g, '');
        if (coin < 0.3) {
          name = `${adj}${cleanedSeed}`;
        } else if (coin < 0.6) {
          name = `${cleanedSeed}${noun}`;
        } else {
          name = `${cleanedSeed}_${num}`;
        }
      } else {
        if (coin < 0.4) {
          name = `${adj}${noun}`;
        } else if (coin < 0.7) {
          name = `${adj}_${noun}`;
        } else {
          name = `${adj}${noun}${num}`;
        }
      }

      // Formatting adjustments for professional
      if (theme === 'professional') {
        name = name.replace(/[^A-Za-z]/g, '');
      }

      list.push(name);
    }

    // Remove duplicates and set
    setUsernames(Array.from(new Set(list)));
  };

  useEffect(() => {
    generateUsernames();
  }, [theme]);

  const handleCopy = (name: string) => {
    navigator.clipboard.writeText(name);
    toast({ title: 'Username Copied!', description: `"${name}" copied to clipboard.` });
  };

  return (<>
      <div className="space-y-8 pb-20 animate-in fade-in duration-500">
      <div className="max-w-2xl mx-auto space-y-6">
        <Card className="shadow-lg border-primary/10">
          <CardHeader className="bg-primary/5 border-b">
            <CardTitle className="flex items-center gap-2 italic font-black text-2xl">
              <Smile className="h-6 w-6 text-primary" /> USERNAME GENERATOR
            </CardTitle>
            <CardDescription>Generate catchy, memorable usernames for social media and gaming handles client-side.</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="seed" className="text-xs font-bold uppercase tracking-wider">Seed Word (Optional)</Label>
                <Input
                  id="seed"
                  value={seed}
                  onChange={(e) => setSeed(e.target.value)}
                  placeholder="e.g. Wolf"
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider block">Username Style / Category</Label>
                <Select value={theme} onValueChange={(val: any) => setTheme(val)}>
                  <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gaming">Gaming & Esports</SelectItem>
                    <SelectItem value="cute">Cute & Kawaii</SelectItem>
                    <SelectItem value="creative">Aesthetic & Creative</SelectItem>
                    <SelectItem value="professional">Professional / Brands</SelectItem>
                    <SelectItem value="funny">Funny & Silly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button onClick={generateUsernames} className="w-full h-12 rounded-xl font-bold">
              <Shuffle className="mr-2 h-4 w-4" /> RE-SHUFFLE USERNAMES
            </Button>

            <div className="space-y-3">
              <Label className="text-xs font-bold uppercase tracking-wider">Generated Usernames</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {usernames.map((name) => (
                  <div
                    key={name}
                    className="flex justify-between items-center p-3 border rounded-xl bg-card hover:border-primary transition-all group"
                  >
                    <span className="font-mono text-sm font-semibold">{name}</span>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleCopy(name)}
                      className="h-8 w-8 text-muted-foreground group-hover:text-primary rounded-lg"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
      
      <section className="mt-12 space-y-8 prose prose-slate dark:prose-invert max-w-none">
        <div className="bg-primary/5 rounded-2xl p-6 md:p-10 border border-primary/10">
            <h2 className="text-3xl font-bold font-headline mb-6">Why Use Our Username Generator?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm leading-relaxed">
                <div className="space-y-4">
                    <p>
                        <strong className="text-primary font-bold">Free & Secure:</strong> Our Username Generator is 100% free and runs completely in your web browser. No registration, signup, or installation is required.
                    </p>
                    <p>
                        Mix adjectives and nouns for gaming/social tags.
                    </p>
                </div>
                <div className="space-y-4">
                    <p>
                        <strong className="text-primary font-bold">Step-by-Step Guide:</strong>
                    </p>
                    <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                        <li>Open the Username Generator tool on UseBro.</li>
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
                    <h4 className="font-bold mb-2 text-base">Is the Username Generator tool free to use?</h4>
                    <p className="text-muted-foreground text-sm">Yes! All tools on UseBro are 100% free with no monthly subscription limits, hidden fees, or signup forms.</p>
                </div>
                <div className="p-6 rounded-xl border border-border/50 bg-card hover:border-primary/50 transition-colors">
                    <h4 className="font-bold mb-2 text-base">Does this Username Generator upload my files to a server?</h4>
                    <p className="text-muted-foreground text-sm">No. To guarantee security and privacy, all processing is performed locally inside your web browser. Your private files never leave your device.</p>
                </div>
                <div className="p-6 rounded-xl border border-border/50 bg-card hover:border-primary/50 transition-colors">
                    <h4 className="font-bold mb-2 text-base">Can I use Username Generator on my mobile device?</h4>
                    <p className="text-muted-foreground text-sm">Yes! UseBro is fully mobile-friendly and responsive, running smoothly on Android, iPhone, iPad, and desktop browsers.</p>
                </div>
            </div>
        </div>
      </section>
    </>);
}
