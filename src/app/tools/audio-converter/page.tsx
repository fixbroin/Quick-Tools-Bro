'use client';
import { useState, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Download, Loader2, Upload, RefreshCw, Sparkles } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function AudioConverterPage() {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [convertedUrl, setConvertedUrl] = useState<string | null>(null);
  const [convertedSize, setConvertedSize] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [targetFormat, setTargetFormat] = useState('mp3');
  const [progressMessage, setProgressMessage] = useState('');
  const { toast } = useToast();
  const ffmpegRef = useRef<any>(null);

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
      setConvertedUrl(null);
      setConvertedSize(null);
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

  const handleConvert = useCallback(async () => {
    if (!originalFile) return;
    setIsLoading(true);
    setProgress(0);
    setConvertedUrl(null);
    setProgressMessage('Initializing converter...');

    try {
      await loadFFmpeg();
      const ffmpeg = ffmpegRef.current;
      const inputName = originalFile.name;
      const outputName = `converted-${Date.now()}.${targetFormat}`;

      const { fetchFile } = await import('@ffmpeg/util');
      await ffmpeg.writeFile(inputName, await fetchFile(originalFile));
      setProgressMessage(`Converting to ${targetFormat.toUpperCase()}...`);

      // Let FFmpeg auto-encode based on file extension
      const command = [
        '-i', inputName,
        outputName
      ];

      await ffmpeg.exec(command);
      
      const data = await ffmpeg.readFile(outputName);
      
      // Determine correct mime type
      let mimeType = 'audio/mpeg';
      if (targetFormat === 'wav') mimeType = 'audio/wav';
      else if (targetFormat === 'aac') mimeType = 'audio/aac';
      else if (targetFormat === 'm4a') mimeType = 'audio/mp4';
      else if (targetFormat === 'ogg') mimeType = 'audio/ogg';

      const audioBlob = new Blob([(data as Uint8Array).buffer as ArrayBuffer], { type: mimeType });
      const audioUrl = URL.createObjectURL(audioBlob);

      setConvertedUrl(audioUrl);
      setConvertedSize(audioBlob.size);
      toast({ title: "Conversion complete!", description: `Audio converted to ${targetFormat.toUpperCase()} successfully.` });
    } catch (err: any) {
      console.error(err);
      toast({ title: "Conversion failed", description: err.message || "Failed to convert audio.", variant: "destructive" });
    } finally {
      setIsLoading(false);
      setProgress(0);
      setProgressMessage('');
    }
  }, [originalFile, targetFormat, toast]);

  const handleDownload = () => {
    if (!convertedUrl) return;
    const a = document.createElement('a');
    a.href = convertedUrl;
    const originalName = originalFile ? originalFile.name.substring(0, originalFile.name.lastIndexOf('.')) : 'converted';
    a.download = `${originalName}.${targetFormat}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className="shadow-lg border-primary/10">
        <CardHeader className="bg-primary/5 border-b p-6">
          <CardTitle className="flex items-center gap-2 font-black text-2xl">
            <RefreshCw className="text-primary h-6 w-6" /> AUDIO CONVERTER
          </CardTitle>
          <CardDescription>
            Convert audio files between MP3, WAV, AAC, M4A, and OGG formats completely in your browser.
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
                    {originalFile ? originalFile.name : 'Choose an audio file to convert'}
                  </p>
                  <p className="text-xs text-muted-foreground">Supports MP3, WAV, AAC, M4A, OGG, FLAC up to 100MB</p>
                </div>
              </div>
            </div>
          </div>

          {originalFile && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
              <div className="space-y-2">
                <Label htmlFor="format-select">Target Format</Label>
                <Select value={targetFormat} onValueChange={setTargetFormat}>
                  <SelectTrigger id="format-select" className="rounded-xl h-11">
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="mp3">MP3 (MPEG Layer 3)</SelectItem>
                    <SelectItem value="wav">WAV (Waveform Audio)</SelectItem>
                    <SelectItem value="aac">AAC (Advanced Audio Coding)</SelectItem>
                    <SelectItem value="m4a">M4A (Apple Lossless/AAC)</SelectItem>
                    <SelectItem value="ogg">OGG Vorbis</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button onClick={handleConvert} disabled={isLoading} className="w-full h-11 rounded-xl bg-primary hover:bg-primary/95 text-white font-bold shadow-md">
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  {isLoading ? `${progressMessage} ${progress}%` : 'Convert Format'}
                </Button>
              </div>
            </div>
          )}

          {convertedUrl && !isLoading && (
            <div className="border-t pt-6 flex flex-col items-center justify-center space-y-4 bg-muted/10 p-6 rounded-2xl border">
              <div className="flex items-center gap-2 font-bold text-foreground">
                <Sparkles className="text-primary h-5 w-5 animate-pulse" /> Converted Audio File Ready!
              </div>
              <audio src={convertedUrl} controls className="w-full max-w-md" />
              {convertedSize && (
                <p className="text-xs text-muted-foreground font-mono">File Size: {formatSize(convertedSize)}</p>
              )}
              <Button onClick={handleDownload} className="rounded-xl h-11 px-8 font-bold bg-primary hover:bg-primary/95 text-white shadow-md">
                <Download className="mr-2 h-4 w-4" /> Download Audio File
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
