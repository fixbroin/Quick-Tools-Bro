
'use client';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Copy, Share2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const quotesData = {
  motivational: [
    "The only way to do great work is to love what you do.",
    "Believe you can and you're halfway there.",
    "The secret of getting ahead is getting started.",
    "Don't watch the clock; do what it does. Keep going.",
    "The future belongs to those who believe in the beauty of their dreams.",
  ],
  love: [
    "To love and be loved is to feel the sun from both sides.",
    "You don't find love, it finds you. It's got a little bit to do with destiny, fate, and what's written in the stars.",
    "The best thing to hold onto in life is each other.",
    "I have found the one whom my soul loves.",
    "To be brave is to love someone unconditionally, without expecting anything in return.",
  ],
  funny: [
    "I'm not lazy, I'm on energy-saving mode.",
    "Life is short. Smile while you still have teeth.",
    "I'm on a seafood diet. I see food and I eat it.",
    "I'm not arguing, I'm just explaining why I'm right.",
    "I need a six-month holiday, twice a year.",
  ],
  life: [
    "Life is what happens when you're busy making other plans.",
    "The purpose of our lives is to be happy.",
    "Get busy living or get busy dying.",
    "You only live once, but if you do it right, once is enough.",
    "The unexamined life is not worth living.",
  ],
};

type QuoteCategory = keyof typeof quotesData;

export default function WhatsAppQuotesPage() {
  const { toast } = useToast();
  const [category, setCategory] = useState<QuoteCategory>('motivational');

  const handleCopy = (quote: string) => {
    navigator.clipboard.writeText(quote);
    toast({ title: 'Copied!', description: 'Quote copied to clipboard.' });
  };

  const handleShare = (quote: string) => {
    if (navigator.share) {
      navigator.share({
        title: 'WhatsApp Quote',
        text: quote,
      }).catch(console.error);
    } else {
        const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(quote)}`;
        window.open(whatsappUrl, '_blank');
    }
  };

  return (
    <div className="space-y-8">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">WhatsApp Quotes</CardTitle>
                <CardDescription>Find the perfect quote to share with your friends and family.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="max-w-xs">
                 <Select value={category} onValueChange={(value) => setCategory(value as QuoteCategory)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Categories</SelectLabel>
                      {Object.keys(quotesData).map(cat => (
                        <SelectItem key={cat} value={cat} className="capitalize">{cat}</SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                </div>
            </CardContent>
        </Card>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {quotesData[category].map((quote, index) => (
                <Card key={index} className="flex flex-col">
                    <CardContent className="p-6 flex-grow">
                        <p className="text-lg font-medium">"{quote}"</p>
                    </CardContent>
                    <CardFooter className="p-4 bg-muted/50 border-t flex justify-end gap-2">
                        <Button variant="outline" size="icon" onClick={() => handleCopy(quote)}>
                            <Copy className="h-4 w-4" />
                            <span className="sr-only">Copy</span>
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => handleShare(quote)}>
                            <Share2 className="h-4 w-4" />
                             <span className="sr-only">Share</span>
                        </Button>
                    </CardFooter>
                </Card>
            ))}
        </div>
    </div>
  );
}
