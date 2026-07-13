'use client';
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Play, Pause, RotateCcw, Timer as StopwatchIcon, Flag } from 'lucide-react';

interface Lap {
  index: number;
  time: number;
  overallTime: number;
}

export default function StopwatchPage() {
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [time, setTime] = useState<number>(0);
  const [laps, setLaps] = useState<Lap[]>([]);
  
  const startTimeRef = useRef<number>(0);
  const elapsedTimeRef = useRef<number>(0);
  const intervalRef = useRef<number | null>(null);

  // Load state on mount
  useEffect(() => {
    const savedRunning = localStorage.getItem('usebro_sw_running') === 'true';
    const savedStart = Number(localStorage.getItem('usebro_sw_start') || 0);
    const savedElapsed = Number(localStorage.getItem('usebro_sw_elapsed') || 0);
    const savedTime = Number(localStorage.getItem('usebro_sw_time') || 0);
    const savedLaps = localStorage.getItem('usebro_sw_laps');

    if (savedLaps) {
      try {
        setLaps(JSON.parse(savedLaps));
      } catch (e) {
        console.error(e);
      }
    }

    if (savedRunning && savedStart > 0) {
      startTimeRef.current = savedStart;
      setIsRunning(true);
      intervalRef.current = window.setInterval(() => {
        setTime(Date.now() - startTimeRef.current);
      }, 10);
    } else {
      elapsedTimeRef.current = savedElapsed;
      setTime(savedTime);
    }
  }, []);

  // Sync state changes to localStorage
  useEffect(() => {
    localStorage.setItem('usebro_sw_running', String(isRunning));
    localStorage.setItem('usebro_sw_elapsed', String(elapsedTimeRef.current));
    localStorage.setItem('usebro_sw_time', String(time));
    localStorage.setItem('usebro_sw_laps', JSON.stringify(laps));
    if (isRunning) {
      localStorage.setItem('usebro_sw_start', String(startTimeRef.current));
    } else {
      localStorage.removeItem('usebro_sw_start');
    }
  }, [isRunning, time, laps]);

  const formatTime = (ms: number) => {
    const min = Math.floor(ms / 60000);
    const sec = Math.floor((ms % 60000) / 1000);
    const centi = Math.floor((ms % 1000) / 10);
    return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}.${String(centi).padStart(2, '0')}`;
  };

  const handleStart = () => {
    if (isRunning) return;
    setIsRunning(true);
    startTimeRef.current = Date.now() - elapsedTimeRef.current;
    
    intervalRef.current = window.setInterval(() => {
      setTime(Date.now() - startTimeRef.current);
    }, 10); // Update every 10ms for high precision
  };

  const handlePause = () => {
    if (!isRunning) return;
    setIsRunning(false);
    elapsedTimeRef.current = Date.now() - startTimeRef.current;
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
    setLaps([]);
    elapsedTimeRef.current = 0;
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const handleLap = () => {
    if (!isRunning) return;
    const lastLapTime = laps.length > 0 ? laps[laps.length - 1].overallTime : 0;
    const lapDuration = time - lastLapTime;
    
    setLaps(prev => [
      ...prev,
      {
        index: prev.length + 1,
        time: lapDuration,
        overallTime: time
      }
    ]);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <div className="space-y-8 pb-20 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-6">
          <Card className="shadow-lg border-primary/10">
            <CardHeader className="bg-primary/5 border-b">
              <CardTitle className="flex items-center gap-2 italic font-black text-2xl">
                <StopwatchIcon className="h-6 w-6 text-primary" /> STOPWATCH
              </CardTitle>
              <CardDescription>Track events with millisecond resolution and precise lap splits.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 flex flex-col items-center space-y-6">
              
              <div className="text-center py-6">
                <span className="font-mono text-5xl font-black italic tracking-tighter text-primary">
                  {formatTime(time)}
                </span>
                <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider mt-2">Elapsed Time</p>
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
                
                <Button onClick={handleLap} disabled={!isRunning} className="h-12 w-12 rounded-xl bg-muted hover:bg-muted/80 text-muted-foreground">
                  <Flag className="h-4 w-4" />
                </Button>

                <Button onClick={handleReset} variant="outline" className="h-12 w-12 rounded-xl">
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-7">
          <Card className="shadow-lg border-primary/10 h-full flex flex-col">
            <CardHeader className="bg-muted/50 border-b">
              <CardTitle className="text-sm uppercase tracking-widest text-center text-muted-foreground">Lap Ledger</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-6 max-h-[300px] overflow-y-auto custom-scrollbar">
              {laps.length > 0 ? (
                <div className="space-y-2">
                  {laps.slice().reverse().map((lap) => (
                    <div key={lap.index} className="flex justify-between items-center p-3 border rounded-xl bg-card">
                      <span className="text-xs font-bold text-muted-foreground">Lap {lap.index}</span>
                      <span className="font-mono text-xs text-muted-foreground">+{formatTime(lap.time)}</span>
                      <span className="font-mono text-sm font-semibold">{formatTime(lap.overallTime)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 opacity-30 border border-dashed rounded-2xl flex flex-col justify-center items-center h-full">
                  <Flag className="h-10 w-10 mb-2" />
                  <p className="text-sm font-bold italic uppercase tracking-widest">No laps recorded yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <section className="mt-12 space-y-8 prose prose-slate dark:prose-invert max-w-none border-t pt-12">
        <div className="bg-primary/5 rounded-2xl p-6 md:p-10 border border-primary/10">
            <h2 className="text-3xl font-bold font-headline mb-6">Why Use Our Stopwatch?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm leading-relaxed">
                <div className="space-y-4">
                    <p>
                        <strong className="text-primary font-bold">Free & Secure:</strong> Our Stopwatch is 100% free and runs completely in your web browser. No registration, signup, or installation is required.
                    </p>
                    <p>
                        Precision split lap timer with milliseconds.
                    </p>
                </div>
                <div className="space-y-4">
                    <p>
                        <strong className="text-primary font-bold">Step-by-Step Guide:</strong>
                    </p>
                    <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                        <li>Open the Stopwatch tool on UseBro.</li>
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
                    <h4 className="font-bold mb-2 text-base">Is the Stopwatch tool free to use?</h4>
                    <p className="text-muted-foreground text-sm">Yes! All tools on UseBro are 100% free with no monthly subscription limits, hidden fees, or signup forms.</p>
                </div>
                <div className="p-6 rounded-xl border border-border/50 bg-card hover:border-primary/50 transition-colors">
                    <h4 className="font-bold mb-2 text-base">Does this Stopwatch upload my files to a server?</h4>
                    <p className="text-muted-foreground text-sm">No. To guarantee security and privacy, all processing is performed locally inside your web browser. Your private files never leave your device.</p>
                </div>
                <div className="p-6 rounded-xl border border-border/50 bg-card hover:border-primary/50 transition-colors">
                    <h4 className="font-bold mb-2 text-base">Can I use Stopwatch on my mobile device?</h4>
                    <p className="text-muted-foreground text-sm">Yes! UseBro is fully mobile-friendly and responsive, running smoothly on Android, iPhone, iPad, and desktop browsers.</p>
                </div>
            </div>
        </div>
      </section>
    </div>
  );
}
