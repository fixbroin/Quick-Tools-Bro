'use client';
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Timer as TimerIcon, Play, Pause, RotateCcw, Volume2, Sparkles } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function StudyTimerPage() {
  const [mode, setMode] = useState<'work' | 'short' | 'long'>('work');
  const [timeLeft, setTimeLeft] = useState<number>(25 * 60);
  const [totalSeconds, setTotalSeconds] = useState<number>(25 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  // Load state on mount
  useEffect(() => {
    const savedMode = localStorage.getItem('usebro_study_mode') as 'work' | 'short' | 'long' | null;
    const savedRunning = localStorage.getItem('usebro_study_running') === 'true';
    const savedTotal = Number(localStorage.getItem('usebro_study_total') || 25 * 60);
    const savedTarget = Number(localStorage.getItem('usebro_study_target') || 0);
    const savedLeft = Number(localStorage.getItem('usebro_study_left') || 25 * 60);

    if (savedMode) setMode(savedMode);

    if (savedRunning && savedTarget > 0) {
      const remaining = Math.max(0, Math.ceil((savedTarget - Date.now()) / 1000));
      if (remaining > 0) {
        setTimeLeft(remaining);
        setTotalSeconds(savedTotal);
        setIsRunning(true);
      } else {
        localStorage.removeItem('usebro_study_running');
        localStorage.removeItem('usebro_study_target');
        localStorage.removeItem('usebro_study_left');
        localStorage.removeItem('usebro_study_total');
        localStorage.removeItem('usebro_study_mode');
      }
    } else {
      setTimeLeft(savedLeft);
      setTotalSeconds(savedTotal);
      setIsRunning(false);
    }
  }, []);

  // Sync state changes to localStorage
  useEffect(() => {
    localStorage.setItem('usebro_study_mode', mode);
    localStorage.setItem('usebro_study_running', String(isRunning));
    localStorage.setItem('usebro_study_total', String(totalSeconds));
    localStorage.setItem('usebro_study_left', String(timeLeft));

    if (isRunning) {
      const currentTarget = Number(localStorage.getItem('usebro_study_target') || 0);
      if (currentTarget === 0 || Math.abs(currentTarget - (Date.now() + timeLeft * 1000)) > 2000) {
        const targetEpoch = Date.now() + timeLeft * 1000;
        localStorage.setItem('usebro_study_target', String(targetEpoch));
      }
    } else {
      localStorage.removeItem('usebro_study_target');
    }
  }, [isRunning, timeLeft, totalSeconds, mode]);

  const getModeTime = (selectedMode: 'work' | 'short' | 'long') => {
    if (selectedMode === 'work') return 25 * 60;
    if (selectedMode === 'short') return 5 * 60;
    return 15 * 60;
  };

  const handleModeChange = (val: 'work' | 'short' | 'long') => {
    setMode(val);
    setIsRunning(false);
    const secs = getModeTime(val);
    setTimeLeft(secs);
    setTotalSeconds(secs);
  };

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
        osc.frequency.setValueAtTime(660, ctx.currentTime + timeOffset); // E5 note
        gain.gain.setValueAtTime(0.5, ctx.currentTime + timeOffset);
        osc.start(ctx.currentTime + timeOffset);
        osc.stop(ctx.currentTime + timeOffset + 0.15);
      };

      playSingleBeep(0);
      playSingleBeep(0.2);
      playSingleBeep(0.4);
    } catch (err) {
      console.warn("Web Audio API not supported yet.", err);
    }
  };

  const handleStart = () => {
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    const secs = getModeTime(mode);
    setTimeLeft(secs);
    setTotalSeconds(secs);
  };

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            if (intervalRef.current) clearInterval(intervalRef.current);
            playBeep();
            toast({
              title: mode === 'work' ? "Break Time!" : "Focus Time!",
              description: mode === 'work' ? "Great job focusing. Time to rest!" : "Time to get back to work!"
            });
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
  }, [isRunning, mode]);

  const formatDisplayTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const progressPercentage = totalSeconds > 0 ? (timeLeft / totalSeconds) * 100 : 0;

  return (
    <div className="space-y-8 pb-20 animate-in fade-in duration-500">
      <div className="max-w-md mx-auto space-y-6">
        <Card className="shadow-lg border-primary/10">
          <CardHeader className="bg-primary/5 border-b">
            <CardTitle className="flex items-center gap-2 italic font-black text-2xl">
              <TimerIcon className="h-6 w-6 text-primary" /> STUDY POMODORO
            </CardTitle>
            <CardDescription>Boost focus using the 25/5 interval method with alarms.</CardDescription>
          </CardHeader>
          <CardContent className="p-6 flex flex-col items-center space-y-6">
            
            <Tabs defaultValue="work" value={mode} onValueChange={(val: any) => handleModeChange(val)} className="w-full">
              <TabsList className="grid w-full grid-cols-3 rounded-xl">
                <TabsTrigger value="work" className="rounded-lg text-xs font-bold">Work (25m)</TabsTrigger>
                <TabsTrigger value="short" className="rounded-lg text-xs font-bold">Short Break</TabsTrigger>
                <TabsTrigger value="long" className="rounded-lg text-xs font-bold">Long Break</TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Circular display */}
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
                  stroke="#29ABE2"
                  strokeWidth="10"
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * 100}
                  strokeDashoffset={2 * Math.PI * 100 * (1 - progressPercentage / 100)}
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="text-center space-y-1">
                <span className="font-mono text-4xl font-black italic tracking-tighter">{formatDisplayTime(timeLeft)}</span>
                <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                  {mode === 'work' ? 'Focus Interval' : 'Rest Interval'}
                </p>
              </div>
            </div>

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
            <h2 className="text-3xl font-bold font-headline mb-6">Why Use Our Study Pomodoro Timer?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm leading-relaxed">
                <div className="space-y-4">
                    <p>
                        <strong className="text-primary font-bold">Free & Secure:</strong> Our Study Pomodoro Timer is 100% free and runs completely in your web browser. No registration, signup, or installation is required.
                    </p>
                    <p>
                        Boost focus using structured study-rest Pomodoros.
                    </p>
                </div>
                <div className="space-y-4">
                    <p>
                        <strong className="text-primary font-bold">Step-by-Step Guide:</strong>
                    </p>
                    <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                        <li>Open the Study Pomodoro Timer tool on UseBro.</li>
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
                    <h4 className="font-bold mb-2 text-base">Is the Study Pomodoro Timer tool free to use?</h4>
                    <p className="text-muted-foreground text-sm">Yes! All tools on UseBro are 100% free with no monthly subscription limits, hidden fees, or signup forms.</p>
                </div>
                <div className="p-6 rounded-xl border border-border/50 bg-card hover:border-primary/50 transition-colors">
                    <h4 className="font-bold mb-2 text-base">Does this Study Pomodoro Timer upload my files to a server?</h4>
                    <p className="text-muted-foreground text-sm">No. To guarantee security and privacy, all processing is performed locally inside your web browser. Your private files never leave your device.</p>
                </div>
                <div className="p-6 rounded-xl border border-border/50 bg-card hover:border-primary/50 transition-colors">
                    <h4 className="font-bold mb-2 text-base">Can I use Study Pomodoro Timer on my mobile device?</h4>
                    <p className="text-muted-foreground text-sm">Yes! UseBro is fully mobile-friendly and responsive, running smoothly on Android, iPhone, iPad, and desktop browsers.</p>
                </div>
            </div>
        </div>
      </section>
    </div>
  );
}
