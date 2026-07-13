
import type { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { SITE_CONFIG, getMetadata } from '@/lib/config';

export const metadata: Metadata = getMetadata({
    title: `Privacy Policy`,
    description: `Your privacy is our priority. Learn how ${SITE_CONFIG.name} handles your data. We use client-side processing, meaning your files and data never leave your device.`,
    keywords: ['privacy policy', 'data protection', 'client-side processing', 'user data', 'security', SITE_CONFIG.name],
    path: '/privacy',
});

export default function PrivacyPolicyPage() {
    return (
        <div className="container mx-auto max-w-4xl px-4 py-8">
            <Card className="shadow-lg border-primary/10">
                <CardHeader className="bg-muted/30 border-b p-6">
                    <CardTitle className="font-headline text-2xl font-black italic tracking-tight">Privacy Policy</CardTitle>
                    <CardDescription>Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 p-6 md:p-8 text-sm leading-relaxed text-foreground/90">
                    <section className="space-y-2">
                        <h2 className="font-bold text-lg text-primary uppercase tracking-wider">1. Introduction</h2>
                        <p>
                            Welcome to <strong>{SITE_CONFIG.name}</strong> (accessible at <a href={SITE_CONFIG.url} className="text-primary hover:underline">{SITE_CONFIG.url}</a>). We are highly committed to protecting your personal privacy. This Privacy Policy details how we collect, use, and secure your information when you interact with our website and online web utilities. By accessing our services, you consent to the policies described herein.
                        </p>
                    </section>

                    <section className="space-y-2">
                        <h2 className="font-bold text-lg text-primary uppercase tracking-wider">2. Zero Server Storage & Client-Side File Safety</h2>
                        <p>
                            The core functional tools on our website—including but not limited to image converters, file compressors, PDF mergers, image editors, calculators, QR generators, and minifiers—<strong>run entirely inside your local web browser</strong> using client-side JavaScript, WebAssembly, and native browser APIs.
                        </p>
                        <ul className="list-disc list-inside pl-4 space-y-1 font-semibold text-foreground">
                            <li>Your uploaded files (images, documents, PDFs, audio, video) are processed purely in-memory.</li>
                            <li>No files or input data processed inside browser tools are uploaded, stored, or transmitted to any server.</li>
                            <li>All processing is private, local, and secure on your own device.</li>
                        </ul>
                    </section>

                    <section className="space-y-2">
                        <h2 className="font-bold text-lg text-primary uppercase tracking-wider">3. AdSense, Meta Ads & Custom Advertising</h2>
                        <p>
                            We display advertisements to fund and keep our online tools 100% free. Our monetization channels include:
                        </p>
                        <ul className="list-disc list-inside pl-4 space-y-2">
                            <li><strong>Google AdSense & Google Ads:</strong> Google, as a third-party vendor, uses cookies to serve ads based on your visits to our site and other websites. Google's use of advertising cookies enables it and its partners to display relevant ads to you. You may opt out of personalized interest-based ads by visiting the <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google Ads Settings</a> page.</li>
                            <li><strong>Meta Ads (Facebook Audience Network):</strong> Meta utilizes cookies and tracking identifiers to measure ad interactions and display personalized advertising. You can control how Meta uses this data in your Facebook account Ad Settings.</li>
                            <li><strong>Custom Advertisements (Direct Sponsorships):</strong> We show custom uploaded ads (images and video banners) directly hosted on our website. These direct ads do not use third-party behavioral profiling cookies, but clicking them will redirect you to the advertiser's external landing pages.</li>
                            <li><strong>Opting Out globally:</strong> You can opt out of third-party vendors' cookies for personalized advertising by visiting the <a href="https://www.aboutads.info" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">About Ads Portal</a> or disabling cookies in your browser settings.</li>
                        </ul>
                    </section>

                    <section className="space-y-2">
                        <h2 className="font-bold text-lg text-primary uppercase tracking-wider">4. Analytics & Microsoft Clarity</h2>
                        <p>
                            We partner with <strong>Microsoft Clarity</strong> and <strong>Microsoft Advertising</strong> to capture how you use and interact with our website through behavioral metrics, heatmaps, and session replays. This anonymous tracking helps us audit, optimize, and market our web tools.
                        </p>
                        <p>
                            Website usage data is captured using first and third-party cookies and other tracking technologies. Microsoft uses this information for site performance analytics, security/fraud prevention, and targeted advertising purposes. For more information about how Microsoft collects and processes your data, please read the <a href="https://privacy.microsoft.com/en-us/privacystatement" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Microsoft Privacy Statement</a>.
                        </p>
                    </section>

                    <section className="space-y-2">
                        <h2 className="font-bold text-lg text-primary uppercase tracking-wider">5. Third-Party APIs & Affiliates</h2>
                        <p>
                            To fetch real-time updates (such as weather metrics, spot bullion gold/silver rates, and brand coupon deals), our website communicates with anonymous external APIs. These calls do not transmit any personal data.
                        </p>
                        <p>
                            We also include links to third-party services and affiliate products (such as Hostinger hosting services). If you click these links, you will be redirected to the provider's site, which operates under its own distinct privacy regulations. We have no responsibility or control over their content and practices.
                        </p>
                    </section>

                    <section className="space-y-2">
                        <h2 className="font-bold text-lg text-primary uppercase tracking-wider">6. GDPR & CCPA Compliance Rights</h2>
                        <p>
                            We respect global data rights. Because we do not collect or store personal files or databases, we do not possess files or details to extract, transfer, or delete. If you interact with our forms or signups, you hold the right to request:
                        </p>
                        <ul className="list-disc list-inside pl-4 space-y-1">
                            <li>Access to and correction of any email communication records.</li>
                            <li>Complete erasure of any query messages sent to our contact portals.</li>
                            <li>Withdrawal of any cookie tracking consents.</li>
                        </ul>
                    </section>

                    <section className="space-y-2">
                        <h2 className="font-bold text-lg text-primary uppercase tracking-wider">7. Contact Us</h2>
                        <p>
                            If you have questions, compliance requests, or suggestions regarding this Privacy Policy, please contact us at:
                            <br />
                            📧 <a href="mailto:sup@usebro.in" className="text-primary font-semibold hover:underline">sup@usebro.in</a>
                        </p>
                    </section>
                </CardContent>
            </Card>
        </div>
    );
}
