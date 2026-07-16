import { Metadata } from 'next';
import { getMetadata } from '@/lib/config';

export const metadata: Metadata = getMetadata({
    title: 'Gold Price Today: Live 24K & 22K Gold Rate & Weather Updates',
    description: 'Check live gold price today (24K & 22K) and silver rate in Chennai, Bangalore, Mumbai, Delhi, Hyderabad, Pune, Ahmedabad, Kolkata, Jaipur, Lucknow, and major cities in India. Get real-time weather updates & forecasts.',
    keywords: [
        'gold price today', 'today gold rate', '24k gold price today', '22k gold rate today', 'silver price today', 'gold price india', 
        'gold rate in mumbai', 'gold rate in delhi', 'gold rate in bangalore', 'gold rate in chennai', 'gold price today hyderabad', 
        'gold rate pune', 'gold rate ahmedabad', 'gold price kolkata', 'gold rate jaipur', 'gold rate lucknow',
        'live weather updates', 'today weather forecast', 'gold price in india', 'daily gold rate update'
    ],
    path: '/tools/gold-price-and-weather',
});

export default function GoldPriceAndWeatherLayout({ children }: { children: React.ReactNode }) {
  return children;
}
