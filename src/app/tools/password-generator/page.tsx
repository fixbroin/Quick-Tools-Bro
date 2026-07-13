'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Copy, Key, RefreshCw } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';

export default function PasswordGeneratorPage() {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState<number>(16);
  const [includeUpper, setIncludeUpper] = useState(true);
  const [includeLower, setIncludeLower] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [strength, setStrength] = useState<'Weak' | 'Medium' | 'Strong' | 'Very Strong'>('Strong');
  const [strengthColor, setStrengthColor] = useState('bg-yellow-500');
  
  const { toast } = useToast();

  const generatePassword = () => {
    let chars = '';
    if (includeUpper) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeLower) chars += 'abcdefghijklmnopqrstuvwxyz';
    if (includeNumbers) chars += '0123456789';
    if (includeSymbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (!chars) {
      setPassword('');
      return;
    }

    let generated = '';
    const array = new Uint32Array(length);
    window.crypto.getRandomValues(array);
    for (let i = 0; i < length; i++) {
      generated += chars[array[i] % chars.length];
    }
    setPassword(generated);
  };

  useEffect(() => {
    generatePassword();
  }, [length, includeUpper, includeLower, includeNumbers, includeSymbols]);

  // Evaluate password strength
  useEffect(() => {
    if (!password) {
      setStrength('Weak');
      setStrengthColor('bg-destructive');
      return;
    }

    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 14) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 2) {
      setStrength('Weak');
      setStrengthColor('bg-destructive');
    } else if (score <= 4) {
      setStrength('Medium');
      setStrengthColor('bg-yellow-500');
    } else if (score === 5) {
      setStrength('Strong');
      setStrengthColor('bg-green-500');
    } else {
      setStrength('Very Strong');
      setStrengthColor('bg-green-600');
    }
  }, [password]);

  const handleCopy = () => {
    if (!password) return;
    navigator.clipboard.writeText(password);
    toast({ title: 'Copied to Clipboard!', description: 'Your secure password has been copied.' });
  };

  return (<>
      <div className="space-y-8 pb-20 animate-in fade-in duration-500">
      <div className="max-w-2xl mx-auto space-y-6">
        <Card className="shadow-lg border-primary/10">
          <CardHeader className="bg-primary/5 border-b">
            <CardTitle className="flex items-center gap-2 italic font-black text-2xl">
              <Key className="h-6 w-6 text-primary" /> PASSWORD GENERATOR
            </CardTitle>
            <CardDescription>Generate ultra-secure cryptographic passwords client-side to protect your accounts.</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            
            {/* Display & Actions */}
            <div className="flex gap-2">
              <Input
                readOnly
                value={password}
                placeholder="Select options to generate password"
                className="font-mono text-lg font-bold rounded-xl h-12 text-center select-all"
              />
              <Button size="icon" variant="outline" onClick={generatePassword} className="h-12 w-12 rounded-xl"><RefreshCw className="h-4 w-4" /></Button>
              <Button size="icon" onClick={handleCopy} disabled={!password} className="h-12 w-12 rounded-xl bg-primary text-white"><Copy className="h-4 w-4" /></Button>
            </div>

            {/* Strength Meter */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-muted-foreground">
                <span>Password Strength</span>
                <span className="text-primary">{strength}</span>
              </div>
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full ${strengthColor} transition-all duration-500`}
                  style={{ width: `${strength === 'Weak' ? 25 : strength === 'Medium' ? 50 : strength === 'Strong' ? 75 : 100}%` }}
                />
              </div>
            </div>

            {/* Settings */}
            <div className="space-y-4 pt-4 border-t">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  <span>Password Length</span>
                  <span>{length} characters</span>
                </div>
                <Slider value={[length]} onValueChange={(val) => setLength(val[0])} min={6} max={64} step={1} />
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="upper" checked={includeUpper} onCheckedChange={(val: any) => setIncludeUpper(val)} />
                  <Label htmlFor="upper" className="text-sm font-semibold cursor-pointer">Uppercase (A-Z)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="lower" checked={includeLower} onCheckedChange={(val: any) => setIncludeLower(val)} />
                  <Label htmlFor="lower" className="text-sm font-semibold cursor-pointer">Lowercase (a-z)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="numbers" checked={includeNumbers} onCheckedChange={(val: any) => setIncludeNumbers(val)} />
                  <Label htmlFor="numbers" className="text-sm font-semibold cursor-pointer">Numbers (0-9)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="symbols" checked={includeSymbols} onCheckedChange={(val: any) => setIncludeSymbols(val)} />
                  <Label htmlFor="symbols" className="text-sm font-semibold cursor-pointer">Special Symbols</Label>
                </div>
              </div>
            </div>

          </CardContent>
        </Card>
      </div>
    </div>
      
      <section className="mt-12 space-y-8 prose prose-slate dark:prose-invert max-w-none">
        <div className="bg-primary/5 rounded-2xl p-6 md:p-10 border border-primary/10">
            <h2 className="text-3xl font-bold font-headline mb-6">Why Use Our Password Generator?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm leading-relaxed">
                <div className="space-y-4">
                    <p>
                        <strong className="text-primary font-bold">Free & Secure:</strong> Our Password Generator is 100% free and runs completely in your web browser. No registration, signup, or installation is required.
                    </p>
                    <p>
                        Generate secure, cryptographically random keys.
                    </p>
                </div>
                <div className="space-y-4">
                    <p>
                        <strong className="text-primary font-bold">Step-by-Step Guide:</strong>
                    </p>
                    <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                        <li>Open the Password Generator tool on UseBro.</li>
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
                    <h4 className="font-bold mb-2 text-base">Is the Password Generator tool free to use?</h4>
                    <p className="text-muted-foreground text-sm">Yes! All tools on UseBro are 100% free with no monthly subscription limits, hidden fees, or signup forms.</p>
                </div>
                <div className="p-6 rounded-xl border border-border/50 bg-card hover:border-primary/50 transition-colors">
                    <h4 className="font-bold mb-2 text-base">Does this Password Generator upload my files to a server?</h4>
                    <p className="text-muted-foreground text-sm">No. To guarantee security and privacy, all processing is performed locally inside your web browser. Your private files never leave your device.</p>
                </div>
                <div className="p-6 rounded-xl border border-border/50 bg-card hover:border-primary/50 transition-colors">
                    <h4 className="font-bold mb-2 text-base">Can I use Password Generator on my mobile device?</h4>
                    <p className="text-muted-foreground text-sm">Yes! UseBro is fully mobile-friendly and responsive, running smoothly on Android, iPhone, iPad, and desktop browsers.</p>
                </div>
            </div>
        </div>
      </section>
    </>);
}
