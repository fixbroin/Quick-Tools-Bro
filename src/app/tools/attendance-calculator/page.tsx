'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Calendar, GraduationCap, ShieldCheck } from 'lucide-react';

export default function AttendanceCalculatorPage() {
  const [totalClasses, setTotalClasses] = useState<number>(40);
  const [attendedClasses, setAttendedClasses] = useState<number>(25);
  const [targetPercent, setTargetPercent] = useState<number>(75);

  const calculateAttendance = () => {
    const total = totalClasses || 0;
    const attended = attendedClasses || 0;
    const target = targetPercent || 0;

    if (total === 0) return { percent: 0, status: 'invalid', count: 0 };
    if (attended > total) return { percent: 0, status: 'invalid', count: 0 };

    const currentPercent = (attended / total) * 100;

    if (currentPercent < target) {
      // Calculate consecutive classes to attend
      // Formula: (target * total - 100 * attended) / (100 - target)
      const numerator = (target * total) - (100 * attended);
      const denominator = 100 - target;
      const needed = Math.ceil(numerator / denominator);
      return {
        percent: Math.round(currentPercent * 100) / 100,
        status: 'short',
        count: Math.max(0, needed)
      };
    } else {
      // Calculate safe classes to miss
      // Formula: (100 * attended - target * total) / target
      const numerator = (100 * attended) - (target * total);
      const safeToMiss = Math.floor(numerator / target);
      return {
        percent: Math.round(currentPercent * 100) / 100,
        status: 'safe',
        count: Math.max(0, safeToMiss)
      };
    }
  };

  const { percent, status, count } = calculateAttendance();

  return (<>
      <div className="space-y-8 pb-20 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Form fields */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="shadow-lg border-primary/10">
            <CardHeader className="bg-primary/5 border-b p-4">
              <CardTitle className="flex items-center gap-2 italic font-black text-2xl">
                <Calendar className="h-6 w-6 text-primary" /> ATTENDANCE CALCULATOR
              </CardTitle>
              <CardDescription>Determine classes to attend or safe splits to miss to maintain your target university attendance percentage.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="total">Total Classes Conducted</Label>
                  <Input id="total" type="number" value={totalClasses} onChange={(e) => setTotalClasses(Number(e.target.value))} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="attended">Classes You Attended</Label>
                  <Input id="attended" type="number" value={attendedClasses} onChange={(e) => setAttendedClasses(Number(e.target.value))} />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="target">Target Attendance Percentage (%)</Label>
                  <Input id="target" type="number" value={targetPercent} onChange={(e) => setTargetPercent(Number(e.target.value))} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Output */}
        <div className="lg:col-span-5">
          <Card className="shadow-lg border-primary/10 h-full flex flex-col justify-between">
            <CardHeader className="bg-muted/50 border-b">
              <CardTitle className="text-sm uppercase tracking-widest text-center text-muted-foreground flex items-center justify-center gap-1"><GraduationCap className="h-4 w-4 text-primary" /> Report Card</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-6 flex flex-col justify-center items-center space-y-4 min-h-[300px]">
              
              <div className="text-center">
                <span className="font-mono text-5xl font-black italic tracking-tighter text-primary">
                  {percent}%
                </span>
                <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider mt-1">Current Attendance</p>
              </div>

              {status === 'short' && (
                <div className="bg-destructive/10 p-4 border border-destructive/20 rounded-2xl text-center w-full space-y-1">
                  <p className="text-xs font-bold text-destructive uppercase tracking-wide">Attendance Shortage</p>
                  <p className="text-sm font-semibold">You need to attend <span className="font-bold text-base">{count}</span> more consecutive classes to reach {targetPercent}%.</p>
                </div>
              )}

              {status === 'safe' && (
                <div className="bg-green-500/10 p-4 border border-green-200 rounded-2xl text-center w-full space-y-1 text-green-600">
                  <p className="text-xs font-bold uppercase tracking-wide">Safe Zone</p>
                  <p className="text-sm font-semibold">You can safely miss next <span className="font-bold text-base">{count}</span> classes without dropping below {targetPercent}%.</p>
                </div>
              )}

              {status === 'invalid' && (
                <div className="text-xs text-muted-foreground text-center">
                  Please check that attended classes do not exceed total classes.
                </div>
              )}

            </CardContent>
          </Card>
        </div>

      </div>
    </div>
      
      <section className="mt-12 space-y-8 prose prose-slate dark:prose-invert max-w-none">
        <div className="bg-primary/5 rounded-2xl p-6 md:p-10 border border-primary/10">
            <h2 className="text-3xl font-bold font-headline mb-6">Why Use Our Attendance Calculator?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm leading-relaxed">
                <div className="space-y-4">
                    <p>
                        <strong className="text-primary font-bold">Free & Secure:</strong> Our Attendance Calculator is 100% free and runs completely in your web browser. No registration, signup, or installation is required.
                    </p>
                    <p>
                        Calculate class ratio updates to meet goals.
                    </p>
                </div>
                <div className="space-y-4">
                    <p>
                        <strong className="text-primary font-bold">Step-by-Step Guide:</strong>
                    </p>
                    <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                        <li>Open the Attendance Calculator tool on UseBro.</li>
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
                    <h4 className="font-bold mb-2 text-base">Is the Attendance Calculator tool free to use?</h4>
                    <p className="text-muted-foreground text-sm">Yes! All tools on UseBro are 100% free with no monthly subscription limits, hidden fees, or signup forms.</p>
                </div>
                <div className="p-6 rounded-xl border border-border/50 bg-card hover:border-primary/50 transition-colors">
                    <h4 className="font-bold mb-2 text-base">Does this Attendance Calculator upload my files to a server?</h4>
                    <p className="text-muted-foreground text-sm">No. To guarantee security and privacy, all processing is performed locally inside your web browser. Your private files never leave your device.</p>
                </div>
                <div className="p-6 rounded-xl border border-border/50 bg-card hover:border-primary/50 transition-colors">
                    <h4 className="font-bold mb-2 text-base">Can I use Attendance Calculator on my mobile device?</h4>
                    <p className="text-muted-foreground text-sm">Yes! UseBro is fully mobile-friendly and responsive, running smoothly on Android, iPhone, iPad, and desktop browsers.</p>
                </div>
            </div>
        </div>
      </section>
    </>);
}
