
import type { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { SITE_CONFIG, getMetadata } from '@/lib/config';

export const metadata: Metadata = getMetadata({
    title: `Terms of Use`,
    description: `Read the official Terms of Use for ${SITE_CONFIG.name}. Understand your responsibilities when using our free online tools and services.`,
    keywords: ['terms of use', 'terms of service', 'legal', 'user agreement', 'conditions', SITE_CONFIG.name],
    path: '/terms',
});

export default function TermsOfUsePage() {
    return (
        <div className="container mx-auto max-w-4xl px-4 py-8">
            <Card className="shadow-lg border-primary/10">
                <CardHeader className="bg-muted/30 border-b p-6">
                    <CardTitle className="font-headline text-2xl font-black italic tracking-tight">Terms of Use</CardTitle>
                    <CardDescription>Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 p-6 md:p-8 text-sm leading-relaxed text-foreground/90">
                    <section className="space-y-2">
                        <h2 className="font-bold text-lg text-primary uppercase tracking-wider">1. Acceptance of Terms</h2>
                        <p>
                            By accessing and utilizing the web applications, online services, and tools provided on <strong>{SITE_CONFIG.name}</strong> (referred to as the "Service" or "Website"), you represent that you have read, understood, and agree to be bound by these Terms of Use and our companion Privacy Policy. If you do not accept these terms, you are prohibited from utilizing our tools.
                        </p>
                    </section>

                    <section className="space-y-2">
                        <h2 className="font-bold text-lg text-primary uppercase tracking-wider">2. Permitted Use of Tools</h2>
                        <p>
                            You may use our suite of tools—including converters, compressors, editors, QR tools, and calculators—solely for personal, educational, or commercial utilities. You agree not to:
                        </p>
                        <ul className="list-disc list-inside pl-4 space-y-1">
                            <li>Engage in automated extraction of tool outputs (web scraping) that causes denial-of-service or server load.</li>
                            <li>Process malicious files, scripts, or materials that violate intellectual property or copyright laws.</li>
                            <li>Attempt to reverse engineer or bypass payment/ad-gate elements of our applications.</li>
                        </ul>
                    </section>

                    <section className="space-y-2">
                        <h2 className="font-bold text-lg text-primary uppercase tracking-wider">3. Disclaimers for Calculators & Real-Time Data</h2>
                        <p>
                            Our platform hosts various mathematical, financial, and physiological tools:
                        </p>
                        <ul className="list-disc list-inside pl-4 space-y-2">
                            <li><strong>Financial & Health Calculators:</strong> Tools such as the Loan EMI Calculator, Calorie, and BMI Calculators provide estimations based on general formulas. They do not constitute certified financial advice, investment strategies, or medical recommendations. Always consult qualified experts.</li>
                            <li><strong>Market Spot Rates & Weather Tickers:</strong> Gold/silver rates and weather metrics are pulled via external API integrations. They are provided on an "as-is" basis for convenience only. We do not guarantee their accuracy, completeness, or timeliness, and accept no liability for financial losses.</li>
                            <li><strong>Deals & Discount Coupons:</strong> Coupon codes and deal listings are sourced from third-party promotions. We do not warrant that they will work or that retailers will honor them. Use at your own discretion.</li>
                        </ul>
                    </section>

                    <section className="space-y-2">
                        <h2 className="font-bold text-lg text-primary uppercase tracking-wider">4. Disclaimer of Warranties</h2>
                        <p>
                            The website and its utilities are provided on an "as-is" and "as-available" basis without representations or warranties of any kind. <strong>{SITE_CONFIG.name}</strong> makes no guarantees that the website will operate error-free, uninterrupted, or free of software bugs. You process files and download generated graphics (such as passport photo sheets) entirely at your own risk.
                        </p>
                    </section>

                    <section className="space-y-2">
                        <h2 className="font-bold text-lg text-primary uppercase tracking-wider">5. Limitation of Liability</h2>
                        <p>
                            To the maximum extent permitted by applicable law, in no event shall <strong>{SITE_CONFIG.name}</strong>, its authors, operators, or affiliates be held liable for any indirect, incidental, special, consequential, or punitive damages (including loss of profits, data, files, or reputation) arising out of or related to your use of or inability to use the tools.
                        </p>
                    </section>

                    <section className="space-y-2">
                        <h2 className="font-bold text-lg text-primary uppercase tracking-wider">6. Contact Us</h2>
                        <p>
                            If you have questions about these Terms of Use, please reach out to us at:
                            <br />
                            📧 <a href="mailto:sup@usebro.in" className="text-primary font-semibold hover:underline">sup@usebro.in</a>
                        </p>
                    </section>
                </CardContent>
            </Card>
        </div>
    );
}

