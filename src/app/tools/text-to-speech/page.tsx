'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Play, Pause, Square, Volume2, Sparkles, AlertCircle, Download, Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';

export default function TextToSpeechPage() {
  const [text, setText] = useState<string>('Hello! This is a free browser-based text-to-speech converter. Type or paste your text here, adjust the voice parameters, and click play to hear it read aloud.');
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>('');
  const [rate, setRate] = useState<number>(1);
  const [pitch, setPitch] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [isSupported, setIsSupported] = useState<boolean>(true);
  const { toast } = useToast();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if ('speechSynthesis' in window) {
        const updateVoices = () => {
          const systemVoices = window.speechSynthesis.getVoices();
          setVoices(systemVoices);
          
          // Try to set a default voice (prefer English/Google voices if available)
          if (systemVoices.length > 0) {
            const defaultVoice = systemVoices.find(v => v.lang.startsWith('en')) || systemVoices[0];
            setSelectedVoice(defaultVoice.name);
          }
        };

        updateVoices();
        // Chrome loads voices asynchronously
        window.speechSynthesis.onvoiceschanged = updateVoices;
      } else {
        setIsSupported(false);
      }
    }

    // Stop speaking when leaving the page
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleSpeak = useCallback(() => {
    if (!isSupported || !text.trim()) return;

    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      setIsPlaying(true);
      return;
    }

    window.speechSynthesis.cancel(); // Stop any current speech

    const utterance = new SpeechSynthesisUtterance(text);
    const voice = voices.find(v => v.name === selectedVoice);
    if (voice) {
      utterance.voice = voice;
    }
    utterance.rate = rate;
    utterance.pitch = pitch;

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
    setIsPaused(false);
  }, [isSupported, text, voices, selectedVoice, rate, pitch, isPaused]);

  const handlePause = () => {
    if (!isSupported) return;
    window.speechSynthesis.pause();
    setIsPaused(true);
    setIsPlaying(false);
  };

  const handleStop = () => {
    if (!isSupported) return;
    window.speechSynthesis.cancel();
    setIsPaused(false);
    setIsPlaying(false);
  };

  const handleDownload = async () => {
    if (!text.trim()) return;
    setIsDownloading(true);

    try {
      const voice = voices.find(v => v.name === selectedVoice);
      const langCode = voice ? voice.lang.substring(0, 2) : 'en';

      const response = await fetch(`/api/tts?text=${encodeURIComponent(text)}&lang=${langCode}`);
      if (!response.ok) {
        throw new Error('Failed to download audio file from translation stream.');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = `text-to-speech-${Date.now()}.mp3`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: 'Download Successful!',
        description: 'Successfully exported and downloaded your spoken audio as MP3.',
      });
    } catch (err: any) {
      console.error(err);
      toast({
        title: 'Download Failed',
        description: err.message || 'An error occurred while downloading the MP3 file.',
        variant: 'destructive',
      });
    } finally {
      setIsDownloading(false);
    }
  };

  // Estimate read time (avg 200 words per minute)
  const getReadTime = () => {
    const words = text.trim().split(/\s+/).filter(w => w.length > 0).length;
    const minutes = words / 200;
    const seconds = Math.ceil(minutes * 60);
    return seconds < 60 ? `${seconds}s` : `${Math.floor(minutes)}m ${seconds % 60}s`;
  };

  const characterCount = text.length;
  const wordCount = text.trim().split(/\s+/).filter(w => w.length > 0).length;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className="shadow-lg border-primary/10">
        <CardHeader className="bg-primary/5 border-b p-6">
          <CardTitle className="flex items-center gap-2 font-black text-2xl">
            <Volume2 className="text-primary h-6 w-6" /> TEXT-TO-SPEECH CONVERTER
          </CardTitle>
          <CardDescription>
            Convert your written text into high-quality spoken audio dynamically in your browser. 100% private.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {!isSupported && (
            <div className="flex items-center gap-2 p-4 rounded-xl border border-destructive/20 bg-destructive/5 text-destructive text-sm font-medium">
              <AlertCircle className="h-5 w-5" /> Your browser does not support the Web Speech API. Please use a modern browser like Chrome or Safari.
            </div>
          )}

          {isSupported && (
            <>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="tts-text">Enter Text to Read</Label>
                  <span className="text-xs text-muted-foreground font-mono">
                    Words: {wordCount} | Characters: {characterCount} | Est. Reading Time: {getReadTime()}
                  </span>
                </div>
                <textarea
                  id="tts-text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Type or paste your text here..."
                  className="w-full min-h-[160px] rounded-xl border border-primary/10 bg-card p-4 text-sm shadow-inner focus:outline-none focus:ring-1 focus:ring-primary/40 resize-y"
                />
              </div>

              {/* Voice and parameters controls */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-t pt-6">
                <div className="space-y-2">
                  <Label htmlFor="voice-select">Voice Language</Label>
                  <Select value={selectedVoice} onValueChange={setSelectedVoice}>
                    <SelectTrigger id="voice-select" className="rounded-xl h-11">
                      <SelectValue placeholder="Select voice" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      {voices.map((voice) => (
                        <SelectItem key={voice.name} value={voice.name}>
                          {voice.name} ({voice.lang})
                        </SelectItem>
                      ))}
                      {voices.length === 0 && (
                        <SelectItem value="none" disabled>Loading system voices...</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <Label>Speech Speed (Rate)</Label>
                    <span className="text-primary font-mono text-xs font-bold">{rate.toFixed(1)}x</span>
                  </div>
                  <Slider
                    value={[rate]}
                    min={0.5}
                    max={2.0}
                    step={0.1}
                    onValueChange={([val]) => setRate(val)}
                    className="py-4"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <Label>Voice Pitch</Label>
                    <span className="text-primary font-mono text-xs font-bold">{pitch.toFixed(1)}</span>
                  </div>
                  <Slider
                    value={[pitch]}
                    min={0.5}
                    max={2.0}
                    step={0.1}
                    onValueChange={([val]) => setPitch(val)}
                    className="py-4"
                  />
                </div>
              </div>

              {/* Controls bar */}
              <div className="flex flex-wrap items-center gap-3 justify-center border-t pt-6">
                <Button 
                  onClick={handleSpeak} 
                  disabled={!text.trim()} 
                  className={`rounded-xl h-11 px-8 font-bold shadow-md ${isPlaying ? 'bg-primary/20 text-primary border border-primary/20' : 'bg-primary text-white hover:bg-primary/95'}`}
                >
                  <Play className="mr-2 h-4 w-4 fill-current" />
                  {isPaused ? 'Resume Speech' : 'Play Speech'}
                </Button>
                <Button 
                  onClick={handlePause} 
                  disabled={!isPlaying} 
                  variant="outline" 
                  className="rounded-xl h-11 px-8 font-bold border-primary/20"
                >
                  <Pause className="mr-2 h-4 w-4 fill-current" /> Pause
                </Button>
                <Button 
                  onClick={handleStop} 
                  disabled={!isPlaying && !isPaused} 
                  variant="destructive" 
                  className="rounded-xl h-11 px-8 font-bold shadow-sm"
                >
                  <Square className="mr-2 h-4 w-4 fill-current" /> Stop
                </Button>
                <Button 
                  onClick={handleDownload} 
                  disabled={!text.trim() || isDownloading} 
                  variant="outline" 
                  className="rounded-xl h-11 px-8 font-bold border-primary/20 shadow-sm"
                >
                  {isDownloading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Download className="mr-2 h-4 w-4" />
                  )}
                  Download MP3
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
