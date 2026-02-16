import type { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Quick Tools Bro';
const contactEmail = "djdjapps@gmail.com";

export const metadata: Metadata = {
    title: `Privacy Policy - ${siteName}`,
    description: `Privacy Policy for ${siteName}. Learn how we protect your data using secure client-side processing and anonymous analytics including Microsoft Clarity.`,
    keywords: [
        'privacy policy',
        'Quick Tools Bro privacy',
        'data protection',
        'client-side processing',
        'PDF to JPG privacy',
        'JPG to PDF privacy',
        'Microsoft Clarity privacy',
        'user data security'
    ],
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
                    <CardDescription>
                        Last Updated: {new Date().toLocaleDateString()}
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-5 text-sm leading-relaxed">

                    {/* Introduction */}
                    <section>
                        <h2 className="font-semibold text-lg">1. Introduction</h2>
                        <p>
                            Welcome to {siteName}. Your privacy is important to us. This Privacy Policy explains how we collect, use,
                            and protect your information when you use our website, web app, and tools including PDF converters,
                            image tools, calculators, and business utilities.
                        </p>
                        <p>
                            By using {siteName}, you agree to this Privacy Policy.
                        </p>
                    </section>

                    {/* Client-side processing */}
                    <section>
                        <h2 className="font-semibold text-lg">2. Client-Side File Processing</h2>

                        <p>
                            Most tools on {siteName}, including but not limited to:
                        </p>

                        <ul className="list-disc ml-6">
                            <li>PDF to JPG Converter</li>
                            <li>JPG to PDF Converter</li>
                            <li>Image Compressor, Converter, Resizer, Cropper</li>
                            <li>QR Code Generator</li>
                            <li>Invoice and Quotation Maker</li>
                            <li>Calculators and Generators</li>
                        </ul>

                        <p className="mt-2">
                            operate entirely inside your browser using client-side processing.
                        </p>

                        <p className="font-semibold">
                            Your files are NOT uploaded to our servers. Your files never leave your device.
                        </p>

                        <p>
                            We do not collect, view, store, transmit, or access your files.
                        </p>
                    </section>

                    {/* Personal Data */}
                    <section>
                        <h2 className="font-semibold text-lg">3. Personal Data Collection</h2>

                        <p>
                            We do NOT require user accounts for most tools. We do NOT collect personal files you process.
                        </p>

                        <p>
                            However, we may collect limited information such as:
                        </p>

                        <ul className="list-disc ml-6">
                            <li>Browser type</li>
                            <li>Device type</li>
                            <li>Country or region (anonymous)</li>
                            <li>Tool usage statistics</li>
                        </ul>

                        <p>
                            This data is anonymous and cannot identify you personally.
                        </p>
                    </section>

                    {/* Microsoft Clarity */}
                    <section>
                        <h2 className="font-semibold text-lg">4. Microsoft Clarity Analytics</h2>

                        <p>
                            We use Microsoft Clarity to understand how users interact with our website and improve usability.
                        </p>

                        <p>
                            Microsoft Clarity may collect anonymous usage data such as:
                        </p>

                        <ul className="list-disc ml-6">
                            <li>Mouse clicks</li>
                            <li>Scroll behavior</li>
                            <li>Device information</li>
                            <li>Browser information</li>
                        </ul>

                        <p>
                            This data is anonymized and used only to improve user experience.
                        </p>

                        <p>
                            Microsoft Clarity Privacy Policy:
                        </p>

                        <a
                            href="https://privacy.microsoft.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                        >
                            https://privacy.microsoft.com/
                        </a>
                    </section>

                    {/* Third-party APIs */}
                    <section>
                        <h2 className="font-semibold text-lg">5. Third-Party Services</h2>

                        <p>
                            Some tools may use third-party APIs to fetch data such as:
                        </p>

                        <ul className="list-disc ml-6">
                            <li>Currency exchange rates</li>
                            <li>Gold prices</li>
                        </ul>

                        <p>
                            These requests do not include personal information.
                        </p>
                    </section>

                    {/* Data Security */}
                    <section>
                        <h2 className="font-semibold text-lg">6. Data Security</h2>

                        <p>
                            Since file processing happens locally on your device, your files remain secure and private.
                        </p>

                        <p>
                            We do not store user files on our servers.
                        </p>
                    </section>

                    {/* Children's Privacy */}
                    <section>
                        <h2 className="font-semibold text-lg">7. Children's Privacy</h2>

                        <p>
                            Our services are not directed to children under 13.
                        </p>

                        <p>
                            We do not knowingly collect personal information from children.
                        </p>
                    </section>

                    {/* Changes */}
                    <section>
                        <h2 className="font-semibold text-lg">8. Changes to This Privacy Policy</h2>

                        <p>
                            We may update this Privacy Policy from time to time.
                        </p>

                        <p>
                            Updates will be posted on this page with a new updated date.
                        </p>
                    </section>

                    {/* Contact */}
                    <section>
                        <h2 className="font-semibold text-lg">9. Contact Us</h2>

                        <p>
                            If you have any questions about this Privacy Policy, contact:
                        </p>

                        <p>
                            Email:{" "}
                            <a
                                href={`mailto:${contactEmail}`}
                                className="text-primary hover:underline"
                            >
                                {contactEmail}
                            </a>
                        </p>

                        <p>
                            Website: {siteName}
                        </p>

                    </section>

                </CardContent>
            </Card>
        </div>
    )
}
