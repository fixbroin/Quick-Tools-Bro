
'use client';
import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Copy } from 'lucide-react';
import { scrollToDownload } from '@/lib/utils';

export default function ShortLinkMakerPage() {
  const [longUrl, setLongUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [aliasError, setAliasError] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleShorten = useCallback(async () => {
    if (!longUrl.trim()) {
      toast({ title: 'Please enter a URL', description: 'The URL field cannot be empty.', variant: 'destructive' });
      return;
    }
    
    try {
        new URL(longUrl);
    } catch (_) {
        toast({ title: 'Invalid URL', description: 'Please enter a valid URL (e.g., https://example.com).', variant: 'destructive' });
        return;
    }

    setIsLoading(true);
    setShortUrl('');
    setAliasError('');
    
    try {
      const apiUrl = '/api/shorten';
      
      const requestBody: { originalUrl: string; customAlias?: string } = {
        originalUrl: longUrl,
      };

      if (customAlias.trim()) {
        requestBody.customAlias = customAlias.trim();
      }

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.shortUrl) {
          setShortUrl(data.shortUrl);
          scrollToDownload();
        } else {
          throw new Error('API did not return a short URL.');
        }
      } else {
         const errorData = await response.json();
        console.error('API Error:', errorData);
        throw new Error(errorData.message || `Failed to shorten URL. Status: ${response.status}`);
      }

    } catch (error: any) {
      console.error(error);
      if (error.message && error.message.toLowerCase().includes('alias')) {
        setAliasError('This custom alias is already taken. Try a different one.');
      }
      toast({ title: 'Creation Failed', description: error.message || 'Could not shorten the URL. Please check the console for details.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  }, [longUrl, customAlias, toast]);
  
  const handleCopy = () => {
    if(shortUrl) {
      navigator.clipboard.writeText(shortUrl);
      toast({ title: 'Copied to clipboard!', description: shortUrl });
    }
  }

  return (<>
      <Card>
      <CardHeader>
        <CardTitle className="font-headline">Short Link Maker</CardTitle>
        <CardDescription>Enter a long URL to create a shortened link instantly. Optionally add a custom alias.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="long-url">Long URL</Label>
          <Input 
            id="long-url" 
            value={longUrl}
            onChange={(e) => setLongUrl(e.target.value)}
            placeholder="https://example.com/a-very-long/url-to-shorten" 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="custom-alias">Custom Alias (Optional)</Label>
          <Input 
            id="custom-alias" 
            value={customAlias}
            onChange={(e) => {
              setCustomAlias(e.target.value);
              setAliasError('');
            }}
            placeholder="e.g., my-cool-link" 
            className={aliasError ? 'border-destructive focus-visible:ring-destructive' : ''}
          />
          {aliasError && (
            <p className="text-xs font-semibold text-destructive mt-1">
              {aliasError}
            </p>
          )}
        </div>
        <Button onClick={handleShorten} disabled={isLoading}>
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Shorten URL
        </Button>
      </CardContent>
      {shortUrl && !isLoading && (
        <CardFooter id="download-section" className="flex flex-col items-start gap-4">
            <div className="w-full space-y-2">
                <Label htmlFor="short-url">Shortened URL</Label>
                <div className="flex gap-2">
                    <Input id="short-url" value={shortUrl} readOnly className="bg-muted"/>
                    <Button variant="outline" size="icon" onClick={handleCopy} aria-label="Copy short URL">
                        <Copy className="h-4 w-4"/>
                    </Button>
                </div>
            </div>
            <p className="text-xs text-muted-foreground">Powered by your own database shortlink service.</p>
        </CardFooter>
      )}
    </Card>
      
      <section className="mt-12 space-y-8 prose prose-slate dark:prose-invert max-w-none">
        <div className="bg-primary/5 rounded-2xl p-6 md:p-10 border border-primary/10">
            <h2 className="text-3xl font-bold font-headline mb-6">Why Use Our Short Link Maker?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm leading-relaxed">
                <div className="space-y-4">
                    <p>
                        <strong className="text-primary font-bold">Free & Secure:</strong> Our Short Link Maker is 100% free and runs completely in your web browser. No registration, signup, or installation is required.
                    </p>
                    <p>
                        Create a short, shareable URL from a long link.
                    </p>
                </div>
                <div className="space-y-4">
                    <p>
                        <strong className="text-primary font-bold">Step-by-Step Guide:</strong>
                    </p>
                    <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                        <li>Open the Short Link Maker tool on UseBro.</li>
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
                    <h4 className="font-bold mb-2 text-base">Is the Short Link Maker tool free to use?</h4>
                    <p className="text-muted-foreground text-sm">Yes! All tools on UseBro are 100% free with no monthly subscription limits, hidden fees, or signup forms.</p>
                </div>
                <div className="p-6 rounded-xl border border-border/50 bg-card hover:border-primary/50 transition-colors">
                    <h4 className="font-bold mb-2 text-base">Does this Short Link Maker upload my files to a server?</h4>
                    <p className="text-muted-foreground text-sm">No. To guarantee security and privacy, all processing is performed locally inside your web browser. Your private files never leave your device.</p>
                </div>
                <div className="p-6 rounded-xl border border-border/50 bg-card hover:border-primary/50 transition-colors">
                    <h4 className="font-bold mb-2 text-base">Can I use Short Link Maker on my mobile device?</h4>
                    <p className="text-muted-foreground text-sm">Yes! UseBro is fully mobile-friendly and responsive, running smoothly on Android, iPhone, iPad, and desktop browsers.</p>
                </div>
            </div>
        </div>
      </section>
    </>);
}
