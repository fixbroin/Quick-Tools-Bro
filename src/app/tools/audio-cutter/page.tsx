'use client';
import { useState, useCallback, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Download, Loader2, Upload, Scissors, Sparkles } from 'lucide-react';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';
import { Slider } from '@/components/ui/slider';

export default function AudioCutterPage() {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [duration, setDuration] = useState<number>(0);
  const [startTime, setStartTime] = useState<number>(0);
  const [endTime, setEndTime] = useState<number>(10);
  const [peaks, setPeaks] = useState<number[]>([]);

  const [trimmedUrl, setTrimmedUrl] = useState<string | null>(null);
  const [trimmedSize, setTrimmedSize] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [progressMessage, setProgressMessage] = useState('');
  const { toast } = useToast();
  const ffmpegRef = useRef(new FFmpeg());
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleSliderChange = useCallback((values: number[]) => {
    const [start, end] = values;
    const audio = audioRef.current;
    if (audio) {
      if (start !== startTime) {
        audio.currentTime = start;
      } else if (end !== endTime) {
        audio.currentTime = end;
      }
    }
    setStartTime(start);
    setEndTime(end);
  }, [startTime, endTime]);

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('audio/')) {
        toast({ title: "Invalid file type", description: "Please upload an audio file.", variant: "destructive" });
        return;
      }
      setOriginalFile(file);
      setOriginalUrl(URL.createObjectURL(file));
      setTrimmedUrl(null);
      setTrimmedSize(null);
      setStartTime(0);
      
      // Get audio duration & generate waveform peaks
      const audio = new Audio();
      audio.src = URL.createObjectURL(file);
      audio.onloadedmetadata = async () => {
        setDuration(audio.duration);
        setEndTime(Math.min(30, audio.duration)); // default trim end to 30s or full duration
        
        try {
          const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
          if (AudioContextClass) {
            const audioCtx = new AudioContextClass();
            const arrayBuffer = await file.arrayBuffer();
            const buffer = await audioCtx.decodeAudioData(arrayBuffer);
            
            const channelData = buffer.getChannelData(0);
            const numBars = 100; // number of bars to draw
            const step = Math.ceil(channelData.length / numBars);
            const computedPeaks: number[] = [];
            
            for (let i = 0; i < numBars; i++) {
              let max = 0;
              const start = i * step;
              const end = Math.min(start + step, channelData.length);
              for (let j = start; j < end; j++) {
                const val = Math.abs(channelData[j]);
                if (val > max) max = val;
              }
              computedPeaks.push(Math.max(0.05, max));
            }
            setPeaks(computedPeaks);
            audioCtx.close();
          }
        } catch (e) {
          console.error("Failed to decode audio waveform:", e);
        }
      };
    }
  };

  const loadFFmpeg = async () => {
    const ffmpeg = ffmpegRef.current;
    if (!ffmpeg.loaded) {
      await ffmpeg.load({
        coreURL: `${window.location.origin}/ffmpeg/ffmpeg-core.js`,
        wasmURL: `${window.location.origin}/ffmpeg/ffmpeg-core.wasm`,
      });
    }
  };

  const handleTrim = useCallback(async () => {
    if (!originalFile) return;
    if (startTime >= endTime) {
      toast({ title: "Invalid limits", description: "Start time must be less than end time.", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    setTrimmedUrl(null);
    setProgressMessage('Loading cutter...');

    try {
      await loadFFmpeg();
      const ffmpeg = ffmpegRef.current;
      const inputName = originalFile.name;
      const extension = inputName.substring(inputName.lastIndexOf('.') + 1);
      const outputName = `trimmed-${Date.now()}.${extension}`;

      await ffmpeg.writeFile(inputName, await fetchFile(originalFile));
      setProgressMessage('Cutting audio track...');

      // Fast trimming without re-encoding: -acodec copy
      const command = [
        '-i', inputName,
        '-ss', startTime.toString(),
        '-to', endTime.toString(),
        '-acodec', 'copy',
        outputName
      ];

      await ffmpeg.exec(command);
      
      const data = await ffmpeg.readFile(outputName);
      const audioBlob = new Blob([(data as Uint8Array).buffer as ArrayBuffer], { type: originalFile.type });
      const audioUrl = URL.createObjectURL(audioBlob);

      setTrimmedUrl(audioUrl);
      setTrimmedSize(audioBlob.size);
      toast({ title: "Audio trimmed!", description: "Track trimmed successfully." });
    } catch (err: any) {
      console.error(err);
      toast({ title: "Trimming failed", description: err.message || "Failed to trim audio track.", variant: "destructive" });
    } finally {
      setIsLoading(false);
      setProgressMessage('');
    }
  }, [originalFile, startTime, endTime, toast]);

  const handleDownload = () => {
    if (!trimmedUrl) return;
    const a = document.createElement('a');
    a.href = trimmedUrl;
    const inputName = originalFile ? originalFile.name : 'trimmed.mp3';
    const baseName = inputName.substring(0, inputName.lastIndexOf('.'));
    const extension = inputName.substring(inputName.lastIndexOf('.') + 1);
    a.download = `${baseName}_trimmed.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className="shadow-lg border-primary/10">
        <CardHeader className="bg-primary/5 border-b p-6">
          <CardTitle className="flex items-center gap-2 font-black text-2xl">
            <Scissors className="text-primary h-6 w-6" /> AUDIO CUTTER & RINGTONE MAKER
          </CardTitle>
          <CardDescription>
            Cut, trim, and slice audio tracks in seconds to create custom ringtones. Runs entirely in your browser.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="space-y-4">
            <Label htmlFor="audio-file">Upload Audio File</Label>
            <div className="border-2 border-dashed border-primary/20 rounded-2xl p-6 text-center bg-muted/20 hover:bg-muted/30 transition-colors">
              <input id="audio-file" type="file" accept="audio/*" onChange={handleFileChange} className="hidden" />
              <div onClick={() => document.getElementById('audio-file')?.click()} className="cursor-pointer space-y-3">
                <div className="inline-flex items-center justify-center p-3 rounded-full bg-primary/10 text-primary">
                  <Upload className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-foreground">
                    {originalFile ? originalFile.name : 'Choose an audio file to trim'}
                  </p>
                  <p className="text-xs text-muted-foreground">Supports MP3, WAV, AAC, M4A, OGG up to 50MB</p>
                </div>
              </div>
            </div>
          </div>

          {originalFile && originalUrl && (
            <div className="space-y-6 border-t pt-6">
              <div className="flex flex-col items-center justify-center space-y-3 bg-muted/5 p-4 rounded-xl border border-primary/5">
                <p className="text-xs font-bold text-muted-foreground">Original Track Preview</p>
                <audio ref={audioRef} src={originalUrl} controls className="w-full max-w-md" />
                {duration > 0 && (
                  <p className="text-[10px] text-muted-foreground font-mono">Total Duration: {duration.toFixed(1)}s</p>
                )}
              </div>

              <div className="space-y-4 border-t pt-4">
                <div className="flex justify-between items-center text-xs text-muted-foreground uppercase font-bold tracking-wider">
                  <span>Select Audio Range to Trim</span>
                  <span className="text-primary font-mono text-xs">
                    Trim: {startTime.toFixed(1)}s to {endTime.toFixed(1)}s ({ (endTime - startTime).toFixed(1) }s total)
                  </span>
                </div>
                {/* Waveform Visualization */}
                {peaks.length > 0 && (
                  <div className="h-16 w-full flex items-end gap-[2px] px-1 bg-muted/10 rounded-lg overflow-hidden border border-primary/5 mb-2">
                    {peaks.map((peak, idx) => {
                      const barPercent = (idx / peaks.length) * 100;
                      const startPercent = (startTime / duration) * 100;
                      const endPercent = (endTime / duration) * 100;
                      const isActive = barPercent >= startPercent && barPercent <= endPercent;
                      
                      return (
                        <div
                          key={idx}
                          className="flex-1 transition-colors duration-150 rounded-t-sm"
                          style={{
                            height: `${Math.min(100, peak * 100)}%`,
                            backgroundColor: isActive ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground) / 0.3)'
                          }}
                        />
                      );
                    })}
                  </div>
                )}

                <Slider
                  value={[startTime, endTime]}
                  min={0}
                  max={duration || 100}
                  step={0.1}
                  minStepsBetweenThumbs={1}
                  onValueChange={handleSliderChange}
                  className="py-4"
                />
                <div className="flex justify-between text-xs text-muted-foreground font-mono">
                  <span>0.0s</span>
                  <span>{(duration || 0).toFixed(1)}s</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start-time">Start Time (Seconds)</Label>
                  <Input 
                    id="start-time" 
                    type="number" 
                    value={startTime.toFixed(1)} 
                    step={0.1}
                    min={0}
                    max={duration}
                    onChange={(e) => setStartTime(Math.min(duration, Math.max(0, parseFloat(e.target.value) || 0)))}
                    className="h-11 rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end-time">End Time (Seconds)</Label>
                  <Input 
                    id="end-time" 
                    type="number" 
                    value={endTime.toFixed(1)} 
                    step={0.1}
                    min={0}
                    max={duration}
                    onChange={(e) => setEndTime(Math.min(duration, Math.max(startTime, parseFloat(e.target.value) || 0)))}
                    className="h-11 rounded-xl"
                  />
                </div>
              </div>

              <div className="flex justify-center">
                <Button onClick={handleTrim} disabled={isLoading} className="rounded-xl h-11 px-8 font-bold bg-primary hover:bg-primary/95 text-white shadow-md">
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  {isLoading ? progressMessage : 'Cut & Trim Audio'}
                </Button>
              </div>
            </div>
          )}

          {trimmedUrl && !isLoading && (
            <div className="border-t pt-6 flex flex-col items-center justify-center space-y-4 bg-muted/10 p-6 rounded-2xl border">
              <div className="flex items-center gap-2 font-bold text-foreground">
                <Sparkles className="text-primary h-5 w-5 animate-pulse" /> Trimmed Audio Ready!
              </div>
              <audio src={trimmedUrl} controls className="w-full max-w-md" />
              {trimmedSize && (
                <p className="text-xs text-muted-foreground font-mono">Trimmed File Size: {formatSize(trimmedSize)}</p>
              )}
              <Button onClick={handleDownload} className="rounded-xl h-11 px-8 font-bold bg-primary hover:bg-primary/95 text-white shadow-md">
                <Download className="mr-2 h-4 w-4" /> Download Trimmed Audio
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
