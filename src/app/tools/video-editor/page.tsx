'use client';
import { useState, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Download, Loader2, Upload, Sliders, Sparkles } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';

export default function VideoEditorPage() {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [duration, setDuration] = useState<number>(0);
  const [startTime, setStartTime] = useState<number>(0);
  const [endTime, setEndTime] = useState<number>(10);
  const [crop, setCrop] = useState<string>('original');
  const [mute, setMute] = useState<boolean>(false);

  const [processedUrl, setProcessedUrl] = useState<string | null>(null);
  const [processedSize, setProcessedSize] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState('');
  const { toast } = useToast();
  const ffmpegRef = useRef<any>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleSliderChange = useCallback((values: number[]) => {
    const [start, end] = values;
    const video = videoRef.current;
    if (video) {
      if (start !== startTime) {
        video.currentTime = start;
      } else if (end !== endTime) {
        video.currentTime = end;
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
      if (!file.type.startsWith('video/')) {
        toast({ title: "Invalid file type", description: "Please upload a video file.", variant: "destructive" });
        return;
      }
      setOriginalFile(file);
      setOriginalUrl(URL.createObjectURL(file));
      setProcessedUrl(null);
      setProcessedSize(null);
      setStartTime(0);
      
      const video = document.createElement('video');
      video.src = URL.createObjectURL(file);
      video.onloadedmetadata = () => {
        setDuration(video.duration);
        setEndTime(Math.min(15, video.duration)); // default trim to first 15 seconds
      };
    }
  };

  const loadFFmpeg = async () => {
    if (!ffmpegRef.current) {
      const { FFmpeg } = await import('@ffmpeg/ffmpeg');
      ffmpegRef.current = new FFmpeg();
    }
    const ffmpeg = ffmpegRef.current;
    if (!ffmpeg.loaded) {
      ffmpeg.on('progress', ({ progress }: { progress: number }) => {
         setProgress(Math.round(progress * 100));
      });
      await ffmpeg.load({
        coreURL: `${window.location.origin}/ffmpeg/ffmpeg-core.js`,
        wasmURL: `${window.location.origin}/ffmpeg/ffmpeg-core.wasm`,
      });
    }
  };

  const handleExport = useCallback(async () => {
    if (!originalFile) return;
    if (startTime >= endTime) {
      toast({ title: "Invalid trim limits", description: "Start time must be less than end time.", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    setProgress(0);
    setProcessedUrl(null);
    setProgressMessage('Loading editor engine...');

    try {
      await loadFFmpeg();
      const ffmpeg = ffmpegRef.current;
      const inputName = originalFile.name;
      const outputName = `edited-${Date.now()}.mp4`;

      const { fetchFile } = await import('@ffmpeg/util');
      await ffmpeg.writeFile(inputName, await fetchFile(originalFile));
      setProgressMessage('Processing video edits...');

      // Dynamic crop calculation with H.264 divisible-by-2 check
      let filterArgs: string[] = [];
      if (crop === '1:1') {
        filterArgs = ['-vf', "crop='trunc(ih/2)*2:trunc(ih/2)*2'"];
      } else if (crop === '9:16') {
        filterArgs = ['-vf', "crop='trunc(ih*9/16/2)*2:trunc(ih/2)*2'"];
      } else if (crop === '16:9') {
        filterArgs = ['-vf', "crop='trunc(iw/2)*2:trunc(iw*9/16/2)*2'"];
      }

      // Compile export parameters
      const command = [
        '-i', inputName,
        '-ss', startTime.toString(),
        '-to', endTime.toString(),
        ...filterArgs,
        '-preset', 'ultrafast',
        ...(mute ? ['-an'] : []),
        '-c:v', 'libx264',
        '-c:a', 'aac',
        outputName
      ];

      await ffmpeg.exec(command);
      
      const data = await ffmpeg.readFile(outputName);
      const videoBlob = new Blob([(data as Uint8Array).buffer as ArrayBuffer], { type: 'video/mp4' });
      const videoUrl = URL.createObjectURL(videoBlob);

      setProcessedUrl(videoUrl);
      setProcessedSize(videoBlob.size);
      toast({ title: "Video exported!", description: "Video edited and exported successfully." });
    } catch (err: any) {
      console.error(err);
      toast({ title: "Export failed", description: err.message || "Failed to process and edit video.", variant: "destructive" });
    } finally {
      setIsLoading(false);
      setProgress(0);
      setProgressMessage('');
    }
  }, [originalFile, startTime, endTime, crop, mute, toast]);

  const handleDownload = () => {
    if (!processedUrl) return;
    const a = document.createElement('a');
    a.href = processedUrl;
    const originalName = originalFile ? originalFile.name.substring(0, originalFile.name.lastIndexOf('.')) : 'edited';
    a.download = `${originalName}_edited.mp4`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className="shadow-lg border-primary/10">
        <CardHeader className="bg-primary/5 border-b p-6">
          <CardTitle className="flex items-center gap-2 font-black text-2xl">
            <Sliders className="text-primary h-6 w-6" /> BASIC VIDEO EDITOR
          </CardTitle>
          <CardDescription>
            Trim length, crop aspect ratios, and mute video clips online without uploading to any server.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="space-y-4">
            <Label htmlFor="video-file">Upload Video File</Label>
            <div className="border-2 border-dashed border-primary/20 rounded-2xl p-6 text-center bg-muted/20 hover:bg-muted/30 transition-colors">
              <input id="video-file" type="file" accept="video/*" onChange={handleFileChange} className="hidden" />
              <div onClick={() => document.getElementById('video-file')?.click()} className="cursor-pointer space-y-3">
                <div className="inline-flex items-center justify-center p-3 rounded-full bg-primary/10 text-primary">
                  <Upload className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-foreground">
                    {originalFile ? originalFile.name : 'Choose a video file to edit'}
                  </p>
                  <p className="text-xs text-muted-foreground">Supports MP4, WebM, MOV up to 200MB</p>
                </div>
              </div>
            </div>
          </div>

          {originalFile && originalUrl && (
            <div className="space-y-6 border-t pt-6">
              <div className="flex flex-col items-center justify-center space-y-3 bg-muted/5 p-4 rounded-xl border border-primary/5">
                <p className="text-xs font-bold text-muted-foreground">Video Timeline Preview</p>
                <video ref={videoRef} src={originalUrl} controls className="w-full max-w-md rounded-xl shadow-sm border bg-black aspect-video" />
                {duration > 0 && (
                  <p className="text-[10px] text-muted-foreground font-mono">Total Duration: {duration.toFixed(1)}s</p>
                )}
              </div>

              <div className="space-y-4 border-t pt-4">
                <div className="flex justify-between items-center text-xs text-muted-foreground uppercase font-bold tracking-wider">
                  <span>Select Video Range to Trim</span>
                  <span className="text-primary font-mono text-xs">
                    Trim: {startTime.toFixed(1)}s to {endTime.toFixed(1)}s ({ (endTime - startTime).toFixed(1) }s total)
                  </span>
                </div>
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

              {/* Editing Controls Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
                <div className="space-y-2">
                  <Label htmlFor="start-time">Start Trim (Seconds)</Label>
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
                  <Label htmlFor="end-time">End Trim (Seconds)</Label>
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
                <div className="space-y-2">
                  <Label htmlFor="crop-select">Aspect Ratio Crop</Label>
                  <Select value={crop} onValueChange={setCrop}>
                    <SelectTrigger id="crop-select" className="rounded-xl h-11">
                      <SelectValue placeholder="Select ratio" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="original">Original Aspect Ratio</SelectItem>
                      <SelectItem value="1:1">1:1 (Square - Instagram)</SelectItem>
                      <SelectItem value="9:16">9:16 (Vertical - TikTok / Reels)</SelectItem>
                      <SelectItem value="16:9">16:9 (Landscape - YouTube)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between border rounded-xl p-4 bg-muted/5">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-bold">Mute Audio</Label>
                    <p className="text-[10px] text-muted-foreground">Completely remove audio track from export</p>
                  </div>
                  <Switch checked={mute} onCheckedChange={setMute} />
                </div>
              </div>

              <div className="flex justify-center border-t pt-6">
                <Button onClick={handleExport} disabled={isLoading} className="rounded-xl h-11 px-8 font-bold bg-primary hover:bg-primary/95 text-white shadow-md">
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  {isLoading ? `${progressMessage} ${progress}%` : 'Export Edited Video'}
                </Button>
              </div>
            </div>
          )}

          {processedUrl && !isLoading && (
            <div className="border-t pt-6 flex flex-col items-center justify-center space-y-4 bg-muted/10 p-6 rounded-2xl border">
              <div className="flex items-center gap-2 font-bold text-foreground">
                <Sparkles className="text-primary h-5 w-5 animate-pulse" /> Edited Video is Ready!
              </div>
              <video src={processedUrl} controls className="w-full max-w-md rounded-xl shadow-md border bg-black aspect-video" />
              {processedSize && (
                <p className="text-xs text-muted-foreground font-mono">Export Size: {formatSize(processedSize)}</p>
              )}
              <Button onClick={handleDownload} className="rounded-xl h-11 px-8 font-bold bg-primary hover:bg-primary/95 text-white shadow-md">
                <Download className="mr-2 h-4 w-4" /> Download Edited Video
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
