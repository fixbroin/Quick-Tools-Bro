
'use client';
import { useState, useCallback, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import Image from 'next/image';
import { Loader2, Download, Upload, KeyRound, Save, XCircle } from 'lucide-react';
import { generateThumbnail } from '@/ai/flows/youtube-thumbnail-flow';
import imageCompression from 'browser-image-compression';

const API_KEY_STORAGE_KEY = 'googleAiApiKey';

export default function YouTubeThumbnailMakerPage() {
  const [sourceImage, setSourceImage] = useState<File | null>(null);
  const [sourceImageUrl, setSourceImageUrl] = useState<string | null>(null);
  const [letterboxedImageUrl, setLetterboxedImageUrl] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [generatedThumbnailUrl, setGeneratedThumbnailUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const savedApiKey = localStorage.getItem(API_KEY_STORAGE_KEY);
    if (savedApiKey) {
      setApiKey(savedApiKey);
      toast({ title: 'API Key Loaded', description: 'Your saved API key has been loaded from storage.' });
    }
  }, [toast]);
  
  const handleSaveApiKey = () => {
    if (!apiKey.trim()) {
        toast({ title: 'Cannot Save Empty Key', description: 'Please enter an API key before saving.', variant: 'destructive'});
        return;
    }
    localStorage.setItem(API_KEY_STORAGE_KEY, apiKey);
    toast({ title: 'API Key Saved', description: 'Your API key has been saved in your browser.' });
  };

  const handleClearApiKey = () => {
    localStorage.removeItem(API_KEY_STORAGE_KEY);
    setApiKey('');
    toast({ title: 'API Key Cleared', description: 'Your API key has been cleared.' });
  };
  
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast({ title: 'Invalid file type', description: 'Please upload an image.', variant: 'destructive' });
        return;
      }
       try {
        const compressedFile = await imageCompression(file, {
          maxSizeMB: 1,
          maxWidthOrHeight: 1280,
          useWebWorker: true,
        });
        setSourceImage(compressedFile);
        const objectUrl = URL.createObjectURL(compressedFile);
        setSourceImageUrl(objectUrl);
        setGeneratedThumbnailUrl(null);
        
        // --- Letterboxing Logic ---
        const img = new window.Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (!ctx) return;
            
            const targetAspectRatio = 16 / 9;
            canvas.width = 1280;
            canvas.height = 720;
            
            ctx.fillStyle = 'black';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            const imgAspectRatio = img.width / img.height;
            
            let drawWidth = canvas.width;
            let drawHeight = canvas.height;
            let x = 0;
            let y = 0;
            
            if (imgAspectRatio > targetAspectRatio) {
                // Image is wider than target
                drawHeight = canvas.width / imgAspectRatio;
                y = (canvas.height - drawHeight) / 2;
            } else {
                // Image is taller than target
                drawWidth = canvas.height * imgAspectRatio;
                x = (canvas.width - drawWidth) / 2;
            }
            
            ctx.drawImage(img, x, y, drawWidth, drawHeight);
            setLetterboxedImageUrl(canvas.toDataURL('image/jpeg'));
        };
        img.src = objectUrl;

      } catch (error) {
        console.error('Image processing error:', error);
        toast({ title: 'Image Processing Failed', description: 'Could not process the image. Please try another file.', variant: 'destructive' });
      }
    }
  };
  
  const handleGenerate = useCallback(async () => {
    if (!letterboxedImageUrl || !prompt.trim()) {
      toast({ title: 'Missing required fields', description: 'Please upload an image and enter a prompt.', variant: 'destructive' });
      return;
    }

    if (!apiKey.trim()) {
      toast({ title: 'API Key Required', description: 'Please enter your Google AI API key to generate images.', variant: 'destructive' });
      return;
    }
    
    setIsLoading(true);
    setGeneratedThumbnailUrl(null);
    
    try {
        const result = await generateThumbnail({
            photoDataUri: letterboxedImageUrl,
            prompt: prompt,
            apiKey: apiKey,
        });
        
        if (result.imageDataUri) {
            setGeneratedThumbnailUrl(result.imageDataUri);
            toast({ title: 'Success!', description: 'Your thumbnail has been generated.' });
        } else {
             throw new Error('The AI did not return a valid image.');
        }

    } catch (error: any) {
      console.error(error);
      toast({ title: 'Generation Failed', description: error.message || 'An unknown error occurred.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  }, [letterboxedImageUrl, prompt, apiKey, toast]);
  
  const handleDownload = () => {
    if (generatedThumbnailUrl) {
      const a = document.createElement('a');
      a.href = generatedThumbnailUrl;
      a.download = 'youtube-thumbnail.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">AI YouTube Thumbnail Maker</CardTitle>
        <CardDescription>Upload a photo, describe your vision, and let AI create a stunning thumbnail.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="api-key">Your Google AI API Key</Label>
                     <div className="flex items-center gap-2">
                        <KeyRound className="h-5 w-5 text-muted-foreground" />
                        <Input 
                            id="api-key"
                            type="password"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            placeholder="Enter your API key"
                        />
                        <Button variant="outline" size="icon" onClick={handleSaveApiKey} aria-label="Save API Key"><Save className="h-4 w-4"/></Button>
                        <Button variant="ghost" size="icon" onClick={handleClearApiKey} aria-label="Clear API Key"><XCircle className="h-4 w-4"/></Button>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="image-upload">1. Upload a Background Image</Label>
                     <div className="flex items-center gap-4 rounded-lg border p-4">
                      <Upload className="h-8 w-8 text-muted-foreground" />
                      <div className="flex-1">
                        <Input id="image-upload" type="file" accept="image/*" onChange={handleFileChange} ref={fileInputRef}/>
                        <p className="text-xs text-muted-foreground mt-1">Upload a high-quality JPG or PNG file.</p>
                      </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="prompt-input">2. Describe Your Thumbnail</Label>
                    <Textarea 
                        id="prompt-input"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="e.g., 'A dramatic scene with bold, yellow text saying MY EPIC VLOG'. Or 'Make this look like a MrBeast video thumbnail'."
                        rows={3}
                    />
                </div>

                 <Button onClick={handleGenerate} disabled={isLoading || !sourceImage || !apiKey}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    3. Generate Thumbnail
                </Button>
            </div>
            
            <div className="space-y-4">
                <Label>Preview</Label>
                <div className="relative aspect-video w-full rounded-lg border bg-muted flex items-center justify-center">
                    {isLoading ? (
                        <div className="flex flex-col items-center gap-2 text-muted-foreground">
                            <Loader2 className="h-10 w-10 animate-spin" />
                            <p>Generating... this can take a moment.</p>
                        </div>
                    ) : generatedThumbnailUrl ? (
                         <Image src={generatedThumbnailUrl} alt="Generated Thumbnail" layout="fill" className="object-contain rounded-lg" />
                    ) : letterboxedImageUrl ? (
                        <Image src={letterboxedImageUrl} alt="Image Preview" layout="fill" className="object-contain rounded-lg" />
                    ) : (
                         <div className="text-center text-muted-foreground">
                            <p>Your thumbnail will appear here.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
      </CardContent>
       {generatedThumbnailUrl && !isLoading && (
        <CardFooter>
            <Button onClick={handleDownload}>
                <Download className="mr-2 h-4 w-4"/>
                Download Thumbnail
            </Button>
        </CardFooter>
       )}
    </Card>
  );
}
