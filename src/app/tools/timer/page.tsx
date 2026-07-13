'use client';
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Timer as TimerIcon, Play, Pause, RotateCcw, Volume2 } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function TimerPage() {
  const [hours, setHours] = useState<number>(0);
  const [minutes, setMinutes] = useState<number>(5);
  const [seconds, setSeconds] = useState<number>(0);

  const [totalSeconds, setTotalSeconds] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  // Load state on mount
  useEffect(() => {
    const savedRunning = localStorage.getItem('usebro_timer_running') === 'true';
    const savedTotal = Number(localStorage.getItem('usebro_timer_total') || 0);
    const savedTarget = Number(localStorage.getItem('usebro_timer_target') || 0);
    const savedLeft = Number(localStorage.getItem('usebro_timer_left') || 0);

    if (savedRunning && savedTarget > 0) {
      const remaining = Math.max(0, Math.ceil((savedTarget - Date.now()) / 1000));
      if (remaining > 0) {
        setTimeLeft(remaining);
        setTotalSeconds(savedTotal);
        setIsRunning(true);
      } else {
        localStorage.removeItem('usebro_timer_running');
        localStorage.removeItem('usebro_timer_target');
        localStorage.removeItem('usebro_timer_left');
        localStorage.removeItem('usebro_timer_total');
      }
    } else if (savedLeft > 0) {
      setTimeLeft(savedLeft);
      setTotalSeconds(savedTotal);
      setIsRunning(false);
    }
  }, []);

  // Sync state changes to localStorage
  useEffect(() => {
    if (totalSeconds > 0) {
      localStorage.setItem('usebro_timer_total', String(totalSeconds));
      localStorage.setItem('usebro_timer_left', String(timeLeft));
      localStorage.setItem('usebro_timer_running', String(isRunning));
      if (isRunning) {
        // Only calculate and save new target epoch if target does not exist or has reset
        const currentTarget = Number(localStorage.getItem('usebro_timer_target') || 0);
        if (currentTarget === 0 || Math.abs(currentTarget - (Date.now() + timeLeft * 1000)) > 2000) {
          const targetEpoch = Date.now() + timeLeft * 1000;
          localStorage.setItem('usebro_timer_target', String(targetEpoch));
        }
      } else {
        localStorage.removeItem('usebro_timer_target');
      }
    } else {
      localStorage.removeItem('usebro_timer_running');
      localStorage.removeItem('usebro_timer_target');
      localStorage.removeItem('usebro_timer_left');
      localStorage.removeItem('usebro_timer_total');
    }
  }, [isRunning, timeLeft, totalSeconds]);

  const playBeep = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      
      const playSingleBeep = (timeOffset: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, ctx.currentTime + timeOffset);
        gain.gain.setValueAtTime(0.5, ctx.currentTime + timeOffset);
        osc.start(ctx.currentTime + timeOffset);
        osc.stop(ctx.currentTime + timeOffset + 0.15);
      };

      // Play double-beep
      playSingleBeep(0);
      playSingleBeep(0.25);
    } catch (err) {
      console.warn("Web Audio API not allowed or supported yet.", err);
    }
  };

  const handleStart = () => {
    if (isRunning) return;

    if (timeLeft === 0) {
      const total = hours * 3600 + minutes * 60 + seconds;
      if (total <= 0) {
        toast({ title: "Invalid Time", description: "Please enter a value greater than 0.", variant: "destructive" });
        return;
      }
      setTotalSeconds(total);
      setTimeLeft(total);
    }

    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(0);
    setTotalSeconds(0);
  };

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            if (intervalRef.current) clearInterval(intervalRef.current);
            playBeep();
            toast({ title: "Time's Up!", description: "Your countdown timer has finished." });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  const formatDisplayTime = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const progressPercentage = totalSeconds > 0 ? (timeLeft / totalSeconds) * 100 : 0;

  return (
    <div className="space-y-8 pb-20 animate-in fade-in duration-500">
      <div className="max-w-md mx-auto space-y-6">
        <Card className="shadow-lg border-primary/10">
          <CardHeader className="bg-primary/5 border-b">
            <CardTitle className="flex items-center gap-2 italic font-black text-2xl">
              <TimerIcon className="h-6 w-6 text-primary" /> COUNTDOWN TIMER
            </CardTitle>
            <CardDescription>Setup customized countdown timers with synthesized sound alarms.</CardDescription>
          </CardHeader>
          <CardContent className="p-6 flex flex-col items-center space-y-6">
            
            {timeLeft === 0 && !isRunning ? (
              // Setup Inputs
              <div className="grid grid-cols-3 gap-3 w-full">
                <div className="space-y-2">
                  <Label htmlFor="hours" className="text-[10px] font-bold uppercase tracking-wider block text-center">Hours</Label>
                  <Input
                    id="hours"
                    type="number"
                    min={0}
                    max={23}
                    value={hours}
                    onChange={(e) => setHours(Math.max(0, Math.min(23, Number(e.target.value))))}
                    className="rounded-xl text-center font-bold text-lg"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minutes" className="text-[10px] font-bold uppercase tracking-wider block text-center">Minutes</Label>
                  <Input
                    id="minutes"
                    type="number"
                    min={0}
                    max={59}
                    value={minutes}
                    onChange={(e) => setMinutes(Math.max(0, Math.min(59, Number(e.target.value))))}
                    className="rounded-xl text-center font-bold text-lg"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="seconds" className="text-[10px] font-bold uppercase tracking-wider block text-center">Seconds</Label>
                  <Input
                    id="seconds"
                    type="number"
                    min={0}
                    max={59}
                    value={seconds}
                    onChange={(e) => setSeconds(Math.max(0, Math.min(59, Number(e.target.value))))}
                    className="rounded-xl text-center font-bold text-lg"
                  />
                </div>
              </div>
            ) : (
              // Circular animated display
              <div className="relative h-60 w-60 flex items-center justify-center">
                <svg className="absolute w-full h-full transform -rotate-90">
                  <circle
                    cx="120"
                    cy="120"
                    r="100"
                    stroke="rgba(0,0,0,0.05)"
                    strokeWidth="10"
                    fill="transparent"
                  />
                  <circle
                    cx="120"
                    cy="120"
                    r="100"
                    stroke="#29ABE2" // SITE_CONFIG primary blue
                    strokeWidth="10"
                    fill="transparent"
                    strokeDasharray={2 * Math.PI * 100}
                    strokeDashoffset={2 * Math.PI * 100 * (1 - progressPercentage / 100)}
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="text-center space-y-1">
                  <span className="font-mono text-3xl font-black italic tracking-tighter">{formatDisplayTime(timeLeft)}</span>
                  <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Remaining</p>
                </div>
              </div>
            )}

            <div className="flex gap-4 w-full">
              {isRunning ? (
                <Button onClick={handlePause} className="flex-1 h-12 rounded-xl bg-yellow-500 hover:bg-yellow-600 text-white font-bold">
                  <Pause className="mr-2 h-4 w-4" /> PAUSE
                </Button>
              ) : (
                <Button onClick={handleStart} className="flex-1 h-12 rounded-xl bg-primary text-white font-bold">
                  <Play className="mr-2 h-4 w-4" /> START
                </Button>
              )}
              
              <Button onClick={handleReset} variant="outline" className="h-12 w-12 rounded-xl">
                <RotateCcw className="h-4 w-4" />
              </Button>
              
              <Button onClick={playBeep} variant="ghost" className="h-12 w-12 rounded-xl text-muted-foreground hover:text-primary">
                <Volume2 className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <section className="mt-12 space-y-8 prose prose-slate dark:prose-invert max-w-none border-t pt-12">
        <div className="bg-primary/5 rounded-2xl p-6 md:p-10 border border-primary/10">
            <h2 className="text-3xl font-bold font-headline mb-6">Why Use Our Countdown Timer?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm leading-relaxed">
                <div className="space-y-4">
                    <p>
                        <strong className="text-primary font-bold">Free & Secure:</strong> Our Countdown Timer is 100% free and runs completely in your web browser. No registration, signup, or installation is required.
                    </p>
                    <p>
                        Circular ticking countdown timer with alarm sound.
                    </p>
                </div>
                <div className="space-y-4">
                    <p>
                        <strong className="text-primary font-bold">Step-by-Step Guide:</strong>
                    </p>
                    <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                        <li>Open the Countdown Timer tool on UseBro.</li>
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
                    <h4 className="font-bold mb-2 text-base">Is the Countdown Timer tool free to use?</h4>
                    <p className="text-muted-foreground text-sm">Yes! All tools on UseBro are 100% free with no monthly subscription limits, hidden fees, or signup forms.</p>
                </div>
                <div className="p-6 rounded-xl border border-border/50 bg-card hover:border-primary/50 transition-colors">
                    <h4 className="font-bold mb-2 text-base">Does this Countdown Timer upload my files to a server?</h4>
                    <p className="text-muted-foreground text-sm">No. To guarantee security and privacy, all processing is performed locally inside your web browser. Your private files never leave your device.</p>
                </div>
                <div className="p-6 rounded-xl border border-border/50 bg-card hover:border-primary/50 transition-colors">
                    <h4 className="font-bold mb-2 text-base">Can I use Countdown Timer on my mobile device?</h4>
                    <p className="text-muted-foreground text-sm">Yes! UseBro is fully mobile-friendly and responsive, running smoothly on Android, iPhone, iPad, and desktop browsers.</p>
                </div>
            </div>
        </div>
      </section>
    </div>
  );
}
