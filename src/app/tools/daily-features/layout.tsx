import { Metadata } from 'next';
import { getMetadata } from '@/lib/config';

export const metadata: Metadata = getMetadata({
    title: 'Daily Price Rates, Weather & Job Alerts Dashboard',
    description: 'Check gold & silver prices, petrol/diesel rates, real-time weather details, coupons, exam alerts, and government job updates completely free.',
    keywords: ['gold price daily', 'weather tracker online', 'petrol price india', 'government job updates', 'exam results online', 'free certification courses', 'today coupon codes'],
    path: '/tools/daily-features',
});

export default function DailyFeaturesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
