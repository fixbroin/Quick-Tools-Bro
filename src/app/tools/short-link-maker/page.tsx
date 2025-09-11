
'use client';
import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Copy } from 'lucide-react';

export default function ShortLinkMakerPage() {
  const [longUrl, setLongUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
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
    
    try {
      const apiUrl = 'https://s.fixbro.in/api/shorten';
      
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

  return (
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
            onChange={(e) => setCustomAlias(e.target.value)}
            placeholder="e.g., my-cool-link" 
          />
        </div>
        <Button onClick={handleShorten} disabled={isLoading}>
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Shorten URL
        </Button>
      </CardContent>
      {shortUrl && !isLoading && (
        <CardFooter className="flex flex-col items-start gap-4">
            <div className="w-full space-y-2">
                <Label htmlFor="short-url">Shortened URL</Label>
                <div className="flex gap-2">
                    <Input id="short-url" value={shortUrl} readOnly className="bg-muted"/>
                    <Button variant="outline" size="icon" onClick={handleCopy} aria-label="Copy short URL">
                        <Copy className="h-4 w-4"/>
                    </Button>
                </div>
            </div>
            <p className="text-xs text-muted-foreground">Powered by FixBro Shortlink service.</p>
        </CardFooter>
      )}
    </Card>
  );
}
