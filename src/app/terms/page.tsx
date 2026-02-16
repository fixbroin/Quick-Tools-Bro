import type { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Quick Tools Bro';
const contactEmail = "djdjapps@gmail.com";

export const metadata: Metadata = {
    title: `Terms of Use - ${siteName}`,
    description: `Official Terms of Use for ${siteName}. Learn the rules, responsibilities, and limitations when using our online tools and services.`,
    keywords: [
        'terms of use',
        'terms and conditions',
        'Quick Tools Bro terms',
        'user agreement',
        'legal terms',
        'PDF converter terms',
        'image converter terms'
    ],
    alternates: {
        canonical: '/terms',
    }
}

export default function TermsOfUsePage() {
    return (
        <div className="container mx-auto max-w-4xl px-4 py-8">
            <Card>

                <CardHeader>
                    <CardTitle className="font-headline">
                        Terms of Use
                    </CardTitle>

                    <CardDescription>
                        Last Updated: {new Date().toLocaleDateString()}
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-5 text-sm leading-relaxed">

                    {/* Agreement */}
                    <section>
                        <h2 className="font-semibold text-lg">
                            1. Agreement to Terms
                        </h2>

                        <p>
                            By accessing or using {siteName}, including our website, web application, and tools,
                            you agree to be bound by these Terms of Use and our Privacy Policy.
                        </p>

                        <p>
                            If you do not agree, you must stop using our services immediately.
                        </p>
                    </section>

                    {/* Services */}
                    <section>
                        <h2 className="font-semibold text-lg">
                            2. Description of Services
                        </h2>

                        <p>
                            {siteName} provides browser-based tools including but not limited to:
                        </p>

                        <ul className="list-disc ml-6">
                            <li>PDF to JPG Converter</li>
                            <li>JPG to PDF Converter</li>
                            <li>Image Compressor, Converter, Cropper, Resizer</li>
                            <li>QR Code Generator and Scanner</li>
                            <li>Invoice and Quotation Generator</li>
                            <li>Calculators (BMI, EMI, Calorie, Age, etc.)</li>
                            <li>Utility and Business Tools</li>
                        </ul>

                        <p>
                            These services are provided for personal and business use.
                        </p>
                    </section>

                    {/* Client side processing */}
                    <section>
                        <h2 className="font-semibold text-lg">
                            3. Client-Side Processing
                        </h2>

                        <p>
                            Most tools operate entirely within your browser.
                        </p>

                        <p className="font-semibold">
                            Your files are not uploaded to our servers.
                        </p>

                        <p>
                            You are solely responsible for your files and data.
                        </p>
                    </section>

                    {/* User responsibilities */}
                    <section>
                        <h2 className="font-semibold text-lg">
                            4. User Responsibilities
                        </h2>

                        <p>
                            You agree NOT to use our services to:
                        </p>

                        <ul className="list-disc ml-6">
                            <li>Violate any laws or regulations</li>
                            <li>Process illegal or copyrighted material without permission</li>
                            <li>Attempt to hack, damage, or disrupt our services</li>
                            <li>Use services for malicious purposes</li>
                        </ul>

                        <p>
                            You are fully responsible for your usage.
                        </p>
                    </section>

                    {/* Analytics */}
                    <section>
                        <h2 className="font-semibold text-lg">
                            5. Analytics and Tracking
                        </h2>

                        <p>
                            We use Microsoft Clarity and similar tools to improve user experience.
                        </p>

                        <p>
                            These tools collect anonymous usage data such as:
                        </p>

                        <ul className="list-disc ml-6">
                            <li>Clicks</li>
                            <li>Scroll behavior</li>
                            <li>Device type</li>
                            <li>Browser type</li>
                        </ul>

                        <p>
                            This data cannot identify you personally.
                        </p>
                    </section>

                    {/* Disclaimer */}
                    <section>
                        <h2 className="font-semibold text-lg">
                            6. Disclaimer of Warranty
                        </h2>

                        <p>
                            Services are provided "as is" and "as available".
                        </p>

                        <p>
                            We do not guarantee:
                        </p>

                        <ul className="list-disc ml-6">
                            <li>Error-free operation</li>
                            <li>Uninterrupted service</li>
                            <li>Accuracy of results</li>
                        </ul>
                    </section>

                    {/* Financial and Health */}
                    <section>
                        <h2 className="font-semibold text-lg">
                            7. Financial and Health Calculators Disclaimer
                        </h2>

                        <p>
                            Calculators are for informational purposes only.
                        </p>

                        <p>
                            They do NOT provide professional:
                        </p>

                        <ul className="list-disc ml-6">
                            <li>Financial advice</li>
                            <li>Medical advice</li>
                        </ul>

                        <p>
                            Always consult qualified professionals.
                        </p>
                    </section>

                    {/* Liability */}
                    <section>
                        <h2 className="font-semibold text-lg">
                            8. Limitation of Liability
                        </h2>

                        <p>
                            {siteName} is not liable for:
                        </p>

                        <ul className="list-disc ml-6">
                            <li>Data loss</li>
                            <li>File corruption</li>
                            <li>Business loss</li>
                            <li>Indirect damages</li>
                        </ul>

                        <p>
                            You use services at your own risk.
                        </p>
                    </section>

                    {/* Changes */}
                    <section>
                        <h2 className="font-semibold text-lg">
                            9. Changes to Terms
                        </h2>

                        <p>
                            We may update these Terms at any time.
                        </p>

                        <p>
                            Continued use means you accept updated terms.
                        </p>
                    </section>

                    {/* Termination */}
                    <section>
                        <h2 className="font-semibold text-lg">
                            10. Termination
                        </h2>

                        <p>
                            We may suspend or terminate access if Terms are violated.
                        </p>
                    </section>

                    {/* Contact */}
                    <section>
                        <h2 className="font-semibold text-lg">
                            11. Contact Information
                        </h2>

                        <p>
                            Email:
                            {" "}
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
