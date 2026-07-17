'use client';
import { useState, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Download, Loader2, Upload, Music, Sparkles } from 'lucide-react';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SeoSection } from '@/components/SeoSection';

export default function VideoToMP3Page() {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [compressedUrl, setCompressedUrl] = useState<string | null>(null);
  const [compressedSize, setCompressedSize] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [bitrate, setBitrate] = useState('192k');
  const [progressMessage, setProgressMessage] = useState('');
  const { toast } = useToast();
  const ffmpegRef = useRef(new FFmpeg());

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
      setCompressedUrl(null);
      setCompressedSize(null);
    }
  };

  const loadFFmpeg = async () => {
    const ffmpeg = ffmpegRef.current;
    if (!ffmpeg.loaded) {
      ffmpeg.on('progress', ({ progress }) => {
         setProgress(Math.round(progress * 100));
      });
      await ffmpeg.load({
        coreURL: `${window.location.origin}/ffmpeg/ffmpeg-core.js`,
        wasmURL: `${window.location.origin}/ffmpeg/ffmpeg-core.wasm`,
      });
    }
  };

  const handleExtract = useCallback(async () => {
    if (!originalFile) return;
    setIsLoading(true);
    setProgress(0);
    setCompressedUrl(null);
    setProgressMessage('Initializing encoder...');

    try {
      await loadFFmpeg();
      const ffmpeg = ffmpegRef.current;
      const inputName = originalFile.name;
      const outputName = `audio-${Date.now()}.mp3`;

      await ffmpeg.writeFile(inputName, await fetchFile(originalFile));
      setProgressMessage('Extracting audio track...');

      // command to extract audio without video: -vn -acodec libmp3lame
      const command = [
        '-i', inputName,
        '-vn',
        '-acodec', 'libmp3lame',
        '-ab', bitrate,
        outputName
      ];

      await ffmpeg.exec(command);
      
      const data = await ffmpeg.readFile(outputName);
      const audioBlob = new Blob([(data as Uint8Array).buffer as ArrayBuffer], { type: 'audio/mp3' });
      const audioUrl = URL.createObjectURL(audioBlob);

      setCompressedUrl(audioUrl);
      setCompressedSize(audioBlob.size);
      toast({ title: "Extraction complete!", description: "Audio extracted successfully to MP3." });
    } catch (err: any) {
      console.error(err);
      toast({ title: "Extraction failed", description: err.message || "Failed to extract audio track.", variant: "destructive" });
    } finally {
      setIsLoading(false);
      setProgress(0);
      setProgressMessage('');
    }
  }, [originalFile, bitrate, toast]);

  const handleDownload = () => {
    if (!compressedUrl) return;
    const a = document.createElement('a');
    a.href = compressedUrl;
    const originalName = originalFile ? originalFile.name.substring(0, originalFile.name.lastIndexOf('.')) : 'audio';
    a.download = `${originalName}.mp3`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className="shadow-lg border-primary/10">
        <CardHeader className="bg-primary/5 border-b p-6">
          <CardTitle className="flex items-center gap-2 font-black text-2xl">
            <Music className="text-primary h-6 w-6" /> VIDEO TO MP3 CONVERTER
          </CardTitle>
          <CardDescription>
            Extract audio tracks from video files and convert them into high-quality MP3 format completely in your browser.
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
                    {originalFile ? originalFile.name : 'Choose a video file to convert'}
                  </p>
                  <p className="text-xs text-muted-foreground">Supports MP4, WebM, MOV, MKV up to 500MB</p>
                </div>
              </div>
            </div>
          </div>

          {originalFile && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
              <div className="space-y-2">
                <Label htmlFor="bitrate-select">Audio Bitrate Quality</Label>
                <Select value={bitrate} onValueChange={setBitrate}>
                  <SelectTrigger id="bitrate-select" className="rounded-xl h-11">
                    <SelectValue placeholder="Select quality" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="128k">128 kbps (Standard Quality)</SelectItem>
                    <SelectItem value="192k">192 kbps (High Quality - Recommended)</SelectItem>
                    <SelectItem value="320k">320 kbps (Ultra High / CD Quality)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button onClick={handleExtract} disabled={isLoading} className="w-full h-11 rounded-xl bg-primary hover:bg-primary/95 text-white font-bold shadow-md">
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  {isLoading ? `${progressMessage} ${progress}%` : 'Extract MP3 Audio'}
                </Button>
              </div>
            </div>
          )}

          {compressedUrl && !isLoading && (
            <div className="border-t pt-6 flex flex-col items-center justify-center space-y-4 bg-muted/10 p-6 rounded-2xl border">
              <div className="flex items-center gap-2 font-bold text-foreground">
                <Sparkles className="text-primary h-5 w-5 animate-pulse" /> Your MP3 Audio is Ready!
              </div>
              <audio src={compressedUrl} controls className="w-full max-w-md" />
              {compressedSize && (
                <p className="text-xs text-muted-foreground font-mono">File Size: {formatSize(compressedSize)}</p>
              )}
              <Button onClick={handleDownload} className="rounded-xl h-11 px-8 font-bold bg-primary hover:bg-primary/95 text-white shadow-md">
                <Download className="mr-2 h-4 w-4" /> Download MP3 File
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      <SeoSection />
    </div>
  );
}
