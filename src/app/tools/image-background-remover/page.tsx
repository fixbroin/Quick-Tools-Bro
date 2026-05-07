'use client';

import dynamic from 'next/dynamic';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ImageIcon } from 'lucide-react';

const ImageBackgroundRemover = dynamic(
  () => import('@/components/ImageBackgroundRemover'),
  { 
    ssr: false,
    loading: () => (
      <div className="container max-w-4xl mx-auto py-6 space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-2xl flex items-center gap-2">
              <ImageIcon className="h-6 w-6 text-primary" />
              Image Background Remover
            </CardTitle>
            <CardDescription>
              Remove backgrounds from JPG, PNG, and GIF images instantly. Everything runs 100% in your browser.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Skeleton className="h-[200px] w-full rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }
);

export default function BackgroundRemoverPage() {
  return <ImageBackgroundRemover />;
}
