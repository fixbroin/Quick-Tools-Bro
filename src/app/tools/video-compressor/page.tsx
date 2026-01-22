
'use client';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const VideoCompressor = dynamic(
  () => import('@/components/VideoCompressor'),
  { 
    ssr: false,
    loading: () => (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Video Compressor</CardTitle>
                <CardDescription>Reduce video file size by re-encoding with FFmpeg.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-12 w-full" />
                </div>
                 <Skeleton className="h-10 w-36" />
            </CardContent>
        </Card>
    )
  }
);

export default function VideoCompressorPage() {
  return <VideoCompressor />;
}
