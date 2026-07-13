'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Download, Youtube, X, Zap, ShieldCheck } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { scrollToDownload } from '@/lib/utils';
import Image from 'next/image';

interface QualityOption {
  key: string;
  name: string;
  url: string;
}

export default function ThumbnailDownloaderPage() {
  const [urlInput, setUrlInput] = useState('');
  const [videoId, setVideoId] = useState<string | null>(null);
  const [qualities, setQualities] = useState<QualityOption[]>([]);
  const { toast } = useToast();

  const extractVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2] && match[2].length === 11 ? match[2] : null;
  };

  const handleFetch = () => {
    const id = extractVideoId(urlInput);
    if (!id) {
      toast({ title: 'Invalid URL', description: 'Please enter a valid YouTube video link.', variant: 'destructive' });
      return;
    }

    setVideoId(id);
    setQualities([
      { key: 'maxres', name: 'High Definition (1080p / HD)', url: `https://img.youtube.com/vi/${id}/maxresdefault.jpg` },
      { key: 'sd', name: 'Standard Definition (640p / SD)', url: `https://img.youtube.com/vi/${id}/sddefault.jpg` },
      { key: 'hq', name: 'High Quality (480p / HQ)', url: `https://img.youtube.com/vi/${id}/hqdefault.jpg` },
      { key: 'mq', name: 'Medium Quality (360p / MQ)', url: `https://img.youtube.com/vi/${id}/mqdefault.jpg` },
    ]);
    toast({ title: 'Thumbnails Retrieved!' });
    scrollToDownload();
  };

  const handleClear = () => {
    setUrlInput('');
    setVideoId(null);
    setQualities([]);
  };

  return (
    <>
      <div className="space-y-8 pb-20 animate-in fade-in duration-500">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Fetcher */}
          <div className="lg:col-span-6 space-y-6">
            <Card className="shadow-lg border-primary/10">
              <CardHeader className="bg-primary/5 border-b p-4">
                <CardTitle className="flex items-center gap-2 italic font-black text-2xl">
                  <Youtube className="h-6 w-6 text-primary" /> THUMBNAIL DOWNLOADER
                </CardTitle>
                <CardDescription>Extract YouTube video thumbnail image files in multiple sizes and resolutions.</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="yturl" className="text-xs font-bold uppercase tracking-wider block">YouTube Video URL</Label>
                  <div className="flex gap-2">
                    <Input
                      id="yturl"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      placeholder="https://www.youtube.com/watch?v=..."
                      className="rounded-xl flex-1"
                    />
                    {urlInput && (
                      <Button size="icon" variant="ghost" onClick={handleClear} className="h-10 w-10"><X className="h-4 w-4" /></Button>
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-muted/30 p-6 border-t">
                <Button onClick={handleFetch} disabled={!urlInput.trim()} className="w-full h-12 rounded-xl font-bold">
                  <Zap className="mr-2 h-4 w-4" /> RETRIEVE IMAGES
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Preview & Download */}
          <div className="lg:col-span-6">
            <Card className="shadow-lg border-primary/10 h-full flex flex-col">
              <CardHeader className="bg-muted/50 border-b">
                <CardTitle className="text-sm uppercase tracking-widest text-center text-muted-foreground">Thumbnail Previews</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 p-6 space-y-6 max-h-[450px] overflow-y-auto custom-scrollbar">
                {qualities.length > 0 ? (
                  <div id="download-section" className="space-y-6 animate-in fade-in zoom-in duration-500">
                    {qualities.map((q) => (
                      <div key={q.key} className="p-4 border rounded-2xl bg-card space-y-3 shadow-sm">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold uppercase tracking-wider text-primary">{q.name}</span>
                          <a href={q.url} target="_blank" rel="noreferrer" download={`thumbnail-${videoId}-${q.key}.jpg`}>
                            <Button size="sm" className="h-8 rounded-lg text-xs"><Download className="h-3.5 w-3.5 mr-1" /> Download</Button>
                          </a>
                        </div>
                        <div className="relative h-40 w-full rounded-xl overflow-hidden border">
                          <Image src={q.url} alt={q.name} fill className="object-cover" unoptimized />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center space-y-3 opacity-40 my-auto">
                    <Youtube className="h-16 w-16 mx-auto stroke-[1.5]" />
                    <p className="text-sm font-bold uppercase tracking-widest">Awaiting Video Link</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

        </div>
      </div>

      <section className="mt-12 space-y-8 prose prose-slate dark:prose-invert max-w-none border-t pt-12">
        <div className="bg-primary/5 rounded-2xl p-6 md:p-10 border border-primary/10">
            <h2 className="text-3xl font-bold font-headline mb-6">Why Use Our YouTube Thumbnail Downloader?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm leading-relaxed">
                <div className="space-y-4">
                    <p>
                        <strong className="text-primary font-bold">Free & Secure:</strong> Our YouTube Thumbnail Downloader is 100% free and runs completely in your web browser. No registration, signup, or installation is required.
                    </p>
                    <p>
                        Retrieve YouTube video thumbnails in multiple sizes.
                    </p>
                </div>
                <div className="space-y-4">
                    <p>
                        <strong className="text-primary font-bold">Step-by-Step Guide:</strong>
                    </p>
                    <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                        <li>Open the YouTube Thumbnail Downloader tool on UseBro.</li>
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
                    <h4 className="font-bold mb-2 text-base">Is the YouTube Thumbnail Downloader tool free to use?</h4>
                    <p className="text-muted-foreground text-sm">Yes! All tools on UseBro are 100% free with no monthly subscription limits, hidden fees, or signup forms.</p>
                </div>
                <div className="p-6 rounded-xl border border-border/50 bg-card hover:border-primary/50 transition-colors">
                    <h4 className="font-bold mb-2 text-base">Does this YouTube Thumbnail Downloader upload my files to a server?</h4>
                    <p className="text-muted-foreground text-sm">No. To guarantee security and privacy, all processing is performed locally inside your web browser. Your private files never leave your device.</p>
                </div>
                <div className="p-6 rounded-xl border border-border/50 bg-card hover:border-primary/50 transition-colors">
                    <h4 className="font-bold mb-2 text-base">Can I use YouTube Thumbnail Downloader on my mobile device?</h4>
                    <p className="text-muted-foreground text-sm">Yes! UseBro is fully mobile-friendly and responsive, running smoothly on Android, iPhone, iPad, and desktop browsers.</p>
                </div>
            </div>
        </div>
      </section>
    </>
  );
}
