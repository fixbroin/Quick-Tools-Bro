import type { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Quick Tools Bro';

export const metadata: Metadata = {
    title: `Privacy Policy - ${siteName}`,
    description: `Your privacy is our priority. Learn how ${siteName} handles your data. We use client-side processing, meaning your files and data never leave your device.`,
    keywords: ['privacy policy', 'data protection', 'client-side processing', 'user data', 'security', 'Quick Tools Bro'],
    alternates: {
        canonical: '/privacy',
    }
}

export default function PrivacyPolicyPage() {
    return (
        <div className="container mx-auto max-w-4xl px-4 py-8">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Privacy Policy</CardTitle>
                    <CardDescription>Last Updated: {new Date().toLocaleDateString()}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <h2 className="font-semibold text-lg">1. Introduction</h2>
                    <p>
                        Welcome to {siteName}. We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our services. By using our website, you consent to the data practices described in this policy.
                    </p>
                    <h2 className="font-semibold text-lg">2. Data Processing</h2>
                    <p>
                        The vast majority of our tools, including image converters, compressors, resizers, PDF/JPG converters, and calculators (BMI, Calorie, Loan, etc.), run entirely within your web browser. This means that any files you upload or data you enter are processed locally on your own device.
                    </p>
                    <p>
                        <strong>We do not upload, collect, store, or transmit any of the personal files or data you process with these client-side tools.</strong> Your data never leaves your computer.
                    </p>
                    <h2 className="font-semibold text-lg">3. Third-Party API Usage</h2>
                     <p>
                        To provide real-time data for certain tools, we may make requests to third-party services. For example, our Gold Loan Calculator fetches live gold prices from an external API.
                    </p>
                    <p>
                        These requests are anonymous and do not contain any personal or identifiable information. We only request the data needed for the tool's functionality (e.g., requesting the price of gold in a specific currency).
                    </p>
                    <h2 className="font-semibold text-lg">4. Usage Analytics</h2>
                    <p>
                        We may collect anonymous, non-personal usage data to understand how our tools are used and to improve our services. This data includes information like which tools are most popular and how users interact with the website. This information cannot be used to identify you personally.
                    </p>
                     <h2 className="font-semibold text-lg">5. Contact Us</h2>
                    <p>
                        If you have questions or comments about this Privacy Policy, please contact us at <a href="mailto:djdjapps@gmail.com" className="text-primary hover:underline">djdjapps@gmail.com</a>.
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
