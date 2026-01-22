import type { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Quick Tools Bro';

export const metadata: Metadata = {
    title: `Contact Us - Get in Touch with ${siteName}`,
    description: `Have a question, feedback, or suggestion? Contact the ${siteName} team. We are here to help you with our free online tools.`,
    keywords: ['contact', 'support', 'feedback', 'help', 'inquiry', 'Quick Tools Bro'],
    alternates: {
        canonical: '/contact',
    }
}

export default function ContactPage() {
    return (
        <div className="container mx-auto max-w-4xl px-4 py-8">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Contact Us</CardTitle>
                    <CardDescription>We'd love to hear from you.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p>If you have any questions, feedback, or inquiries, please don't hesitate to reach out to us.</p>
                    <p>
                        You can email us at: <a href="mailto:djdjapps@gmail.com" className="text-primary hover:underline">djdjapps@gmail.com</a>
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
