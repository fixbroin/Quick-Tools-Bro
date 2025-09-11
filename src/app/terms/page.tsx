import type { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Quick Tools Bro';

export const metadata: Metadata = {
    title: `Terms of Use - ${siteName}`,
    description: `Read the official Terms of Use for ${siteName}. Understand your responsibilities when using our free online tools and services.`,
    keywords: ['terms of use', 'terms of service', 'legal', 'user agreement', 'conditions', 'Quick Tools Bro'],
    alternates: {
        canonical: '/terms',
    }
}

export default function TermsOfUsePage() {
    return (
        <div className="container mx-auto max-w-4xl px-4 py-8">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Terms of Use</CardTitle>
                    <CardDescription>Last Updated: {new Date().toLocaleDateString()}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                     <h2 className="font-semibold text-lg">1. Agreement to Terms</h2>
                    <p>
                        By accessing and using {siteName} (the "Service"), you agree to be bound by these Terms of Use and our Privacy Policy. If you do not agree to these terms, please do not use our services.
                    </p>
                     <h2 className="font-semibold text-lg">2. Use of Services</h2>
                    <p>
                        You may use our services for lawful purposes only. You are responsible for any content you process through our tools and must ensure it does not infringe on any copyrights or violate any laws. You agree not to use the services for any illegal or unauthorized purpose.
                    </p>
                    <h2 className="font-semibold text-lg">3. Disclaimer of Warranties</h2>
                    <p>
                        Our services are provided "as is" and "as available" without any warranties, express or implied. We do not warrant that the services will be error-free, uninterrupted, or that the results obtained from the use of the services will be accurate or reliable.
                    </p>
                    <h2 className="font-semibold text-lg">4. Financial and Health Calculators</h2>
                     <p>
                        Our financial and health-related calculators (such as the Loan EMI Calculator, BMI Calculator, and Calorie Calculator) are provided for informational and educational purposes only. The results are not a substitute for professional financial or medical advice. You should consult with a qualified professional before making any financial or health-related decisions.
                    </p>
                    <h2 className="font-semibold text-lg">5. Limitation of Liability</h2>
                    <p>
                        In no event shall {siteName}, its owners, or affiliates be liable for any indirect, incidental, special, consequential or punitive damages arising out of or in connection with your use of the services. This includes, but is not limited to, any loss of data, revenue, or profits.
                    </p>
                     <h2 className="font-semibold text-lg">6. Contact Us</h2>
                    <p>
                        If you have any questions about these Terms, please contact us at <a href="mailto:djdjapps@gmail.com" className="text-primary hover:underline">djdjapps@gmail.com</a>.
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
