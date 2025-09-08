import { useEffect } from "react";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import AnimatedBackground from "@/components/animated-background";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, Shield, AlertCircle } from "lucide-react";
import { useLocation } from "wouter";

export default function TermsPage() {
  const [, navigate] = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const goBack = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 relative">
      <AnimatedBackground />
      <div className="relative z-10">
        <Navigation />
        <main className="py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="text-center mb-12">
              <Button 
                variant="ghost" 
                onClick={goBack}
                className="mb-6 text-brand-navy hover:text-brand-green"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
              <div className="flex items-center justify-center mb-6">
                <FileText className="w-12 h-12 text-brand-green mr-4" />
                <h1 className="text-4xl md:text-5xl font-bold text-brand-navy">
                  Terms and Conditions
                </h1>
              </div>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Please read these terms and conditions carefully before using our services.
              </p>
              <div className="text-sm text-gray-500 mt-4">
                Last updated: January 2025
              </div>
            </div>

            {/* Content */}
            <GlassCard className="p-8 md:p-12">
              <div className="prose prose-lg max-w-none">
                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-brand-navy mb-4 flex items-center">
                    <Shield className="w-6 h-6 mr-2 text-brand-green" />
                    1. Acceptance of Terms
                  </h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    By accessing and using the services provided by AAS Eduguide Pvt. Ltd. ("Company", "we", "us", or "our"), 
                    you accept and agree to be bound by the terms and provision of this agreement.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    If you do not agree to abide by the above, please do not use this service.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-brand-navy mb-4">2. Services Description</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    AAS Eduguide Pvt. Ltd. is a comprehensive medical admission counseling service provider 
                    with over 13 years of experience in the field. Our services are designed to guide students 
                    through the complex process of medical admissions in India and abroad. We offer:
                  </p>
                  
                  <h3 className="text-xl font-semibold text-brand-navy mb-3">Core Counseling Services</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mb-4">
                    <li><strong>NEET UG Counseling:</strong> Complete guidance for undergraduate medical admissions including MBBS and BDS</li>
                    <li><strong>NEET PG Counseling:</strong> Comprehensive support for postgraduate medical admissions (MD/MS/Diploma)</li>
                    <li><strong>DNB Counseling:</strong> Specialized guidance for Diplomate of National Board admissions</li>
                    <li><strong>INI-CET Counseling:</strong> Expert support for Institute of National Importance Combined Entrance Test</li>
                    <li><strong>FMGE/NExT Guidance:</strong> Support for Foreign Medical Graduate Examination and National Exit Test</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-brand-navy mb-3">Specialized Support Services</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mb-4">
                    <li><strong>College Prediction:</strong> AI-powered college and course prediction based on ranks and preferences</li>
                    <li><strong>Choice Filling:</strong> Strategic choice filling assistance for optimal seat allocation</li>
                    <li><strong>Document Verification:</strong> Complete document verification and preparation support</li>
                    <li><strong>Seat Matrix Analysis:</strong> Detailed analysis of available seats across institutions</li>
                    <li><strong>Cut-off Analysis:</strong> Historical and predicted cut-off analysis for informed decisions</li>
                    <li><strong>Fee Structure Guidance:</strong> Comprehensive information about fees across colleges</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-brand-navy mb-3">Premium Services</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mb-4">
                    <li><strong>One-on-One Counseling:</strong> Personal counseling sessions with experienced counselors</li>
                    <li><strong>24×7 Support:</strong> Round-the-clock support during counseling periods</li>
                    <li><strong>Seat Assurance Programs:</strong> Premium packages with seat guarantee (subject to terms)</li>
                    <li><strong>Management Quota Guidance:</strong> Assistance with management quota admissions</li>
                    <li><strong>NRI/Foreign Quota Support:</strong> Specialized guidance for NRI and foreign quota seats</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-brand-navy mb-3">Additional Services</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                    <li><strong>Educational Loans:</strong> Guidance on educational loan procedures and documentation</li>
                    <li><strong>Scholarship Information:</strong> Information about available scholarships and eligibility</li>
                    <li><strong>Hostel & Accommodation:</strong> Assistance with hostel booking and accommodation arrangements</li>
                    <li><strong>Career Guidance:</strong> Long-term career planning and specialization advice</li>
                    <li><strong>Alumni Network:</strong> Access to our extensive alumni network for mentorship</li>
                  </ul>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-brand-navy mb-4">3. User Responsibilities</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    As a user of AAS Eduguide services, you have certain responsibilities to ensure 
                    the smooth functioning of our platform and the integrity of our counseling process. 
                    By using our services, you agree to:
                  </p>
                  
                  <h3 className="text-xl font-semibold text-brand-navy mb-3">Information Accuracy & Completeness</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mb-4">
                    <li><strong>Accurate Information:</strong> Provide truthful, accurate, and complete information about your academic records, personal details, and preferences</li>
                    <li><strong>Document Authenticity:</strong> Ensure all submitted documents are genuine and unaltered</li>
                    <li><strong>Timely Updates:</strong> Promptly update any changes in your information, contact details, or circumstances</li>
                    <li><strong>Verification Cooperation:</strong> Cooperate fully during document verification and authentication processes</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-brand-navy mb-3">Account Security & Privacy</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mb-4">
                    <li><strong>Credential Protection:</strong> Maintain the confidentiality of your account credentials and login information</li>
                    <li><strong>Unauthorized Access:</strong> Immediately report any unauthorized access or suspicious activity on your account</li>
                    <li><strong>Shared Devices:</strong> Ensure proper logout when using shared or public devices</li>
                    <li><strong>Password Security:</strong> Use strong passwords and change them regularly</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-brand-navy mb-3">Lawful & Ethical Use</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mb-4">
                    <li><strong>Legal Compliance:</strong> Use our services only for lawful purposes and in compliance with all applicable laws</li>
                    <li><strong>Ethical Conduct:</strong> Maintain ethical standards in all interactions with our staff and other users</li>
                    <li><strong>No Misrepresentation:</strong> Avoid any form of misrepresentation or fraudulent activity</li>
                    <li><strong>Respectful Communication:</strong> Communicate respectfully with our counselors and support staff</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-brand-navy mb-3">Platform Usage Guidelines</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mb-4">
                    <li><strong>Service Disruption:</strong> Not engage in any activity that disrupts, damages, or interferes with our services</li>
                    <li><strong>System Integrity:</strong> Avoid attempting to hack, reverse engineer, or compromise our systems</li>
                    <li><strong>Content Restrictions:</strong> Not upload or share inappropriate, offensive, or illegal content</li>
                    <li><strong>Bandwidth Usage:</strong> Use our services reasonably without excessive bandwidth consumption</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-brand-navy mb-3">Intellectual Property Respect</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mb-4">
                    <li><strong>Copyright Compliance:</strong> Respect all intellectual property rights of AAS Eduguide and third parties</li>
                    <li><strong>Content Usage:</strong> Not reproduce, distribute, or create derivative works from our proprietary content</li>
                    <li><strong>Trademark Respect:</strong> Not use our trademarks, logos, or brand names without explicit permission</li>
                    <li><strong>Trade Secrets:</strong> Maintain confidentiality of any proprietary information shared during counseling</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-brand-navy mb-3">Payment & Financial Obligations</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                    <li><strong>Timely Payments:</strong> Make all payments according to agreed terms and schedules</li>
                    <li><strong>Valid Payment Methods:</strong> Use only legitimate and authorized payment methods</li>
                    <li><strong>Refund Policy Compliance:</strong> Understand and comply with our refund and cancellation policies</li>
                    <li><strong>Fee Transparency:</strong> Acknowledge understanding of all fees and charges before making payments</li>
                  </ul>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-brand-navy mb-4">4. Payment Terms</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Our payment terms are designed to be transparent, fair, and secure. All payments must be made 
                    according to the agreed terms and conditions. We maintain strict financial policies to protect 
                    both our clients and our business interests.
                  </p>
                  
                  <h3 className="text-xl font-semibold text-brand-navy mb-3">Accepted Payment Methods</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mb-4">
                    <li><strong>Online Payments:</strong> Credit cards, debit cards, net banking, UPI, digital wallets</li>
                    <li><strong>Bank Transfers:</strong> NEFT, RTGS, IMPS to our designated bank accounts</li>
                    <li><strong>Demand Drafts:</strong> DD in favor of "AAS Eduguide Pvt. Ltd." payable at Kanpur</li>
                    <li><strong>Cash Payments:</strong> Accepted only at our office premises with proper receipt</li>
                    <li><strong>EMI Options:</strong> Available for premium packages through partner financial institutions</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-brand-navy mb-3">Payment Schedules & Due Dates</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mb-4">
                    <li><strong>Full Payment:</strong> Complete payment required before service activation</li>
                    <li><strong>Installment Plans:</strong> Available for packages above ₹50,000 with prior approval</li>
                    <li><strong>Advance Payments:</strong> 50% advance required for premium counseling packages</li>
                    <li><strong>Late Payment Charges:</strong> 2% per month on overdue amounts after 15-day grace period</li>
                    <li><strong>Service Suspension:</strong> Services may be suspended for payments overdue by 30+ days</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-brand-navy mb-3">Pricing & Fee Structure</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mb-4">
                    <li><strong>Transparent Pricing:</strong> All fees are clearly mentioned in package descriptions</li>
                    <li><strong>No Hidden Charges:</strong> No additional charges beyond the agreed package fee</li>
                    <li><strong>GST Compliance:</strong> All prices are inclusive of applicable GST</li>
                    <li><strong>Price Validity:</strong> Quoted prices are valid for 30 days from the date of quotation</li>
                    <li><strong>Dynamic Pricing:</strong> Prices may vary based on counseling round timing and urgency</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-brand-navy mb-3">Refund Policy</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mb-4">
                    <li><strong>Cooling-off Period:</strong> 7-day cooling-off period for cancellations (before service commencement)</li>
                    <li><strong>Partial Refunds:</strong> Available based on service utilization and package terms</li>
                    <li><strong>Non-refundable Services:</strong> Certain services like document verification are non-refundable</li>
                    <li><strong>Refund Processing:</strong> Refunds processed within 15-30 working days</li>
                    <li><strong>Refund Method:</strong> Refunds credited to the original payment method</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-brand-navy mb-3">Security & Fraud Prevention</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mb-4">
                    <li><strong>Secure Transactions:</strong> All online payments processed through secure, encrypted gateways</li>
                    <li><strong>Payment Verification:</strong> Large transactions may require additional verification</li>
                    <li><strong>Fraud Protection:</strong> Advanced fraud detection systems to protect against unauthorized transactions</li>
                    <li><strong>Chargeback Policy:</strong> Strict chargeback investigation process for disputed transactions</li>
                  </ul>

                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-4">
                    <div className="flex">
                      <AlertCircle className="w-5 h-5 text-yellow-400 mr-2 mt-0.5" />
                      <p className="text-yellow-800">
                        <strong>Important:</strong> Refund policies vary by package type and timing of cancellation. 
                        Please carefully review your specific package terms before making payment. For detailed 
                        refund information, contact our support team at +91-7752944476.
                      </p>
                    </div>
                  </div>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-brand-navy mb-4">5. Limitation of Liability</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    While we strive to provide accurate guidance and support, AAS Eduguide Pvt. Ltd. cannot guarantee 
                    admission to any specific medical college or institution. Our services are advisory in nature.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    We shall not be liable for any direct, indirect, incidental, special, or consequential damages 
                    resulting from the use or inability to use our services.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-brand-navy mb-4">6. Privacy and Data Protection</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    We are committed to protecting your privacy and personal information. Please refer to our 
                    Privacy Policy for detailed information about how we collect, use, and protect your data.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-brand-navy mb-4">7. Intellectual Property</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    All content, materials, and resources provided by AAS Eduguide Pvt. Ltd. are protected by 
                    intellectual property laws. You may not reproduce, distribute, or create derivative works 
                    without our express written permission.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-brand-navy mb-4">8. Termination</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    We reserve the right to terminate or suspend your access to our services at any time, 
                    without prior notice, for conduct that we believe violates these Terms and Conditions 
                    or is harmful to other users or our business.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-brand-navy mb-4">9. Changes to Terms</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    We reserve the right to modify these terms and conditions at any time. Changes will be 
                    effective immediately upon posting on our website. Your continued use of our services 
                    constitutes acceptance of the modified terms.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-brand-navy mb-4">10. Governing Law</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    These Terms and Conditions shall be governed by and construed in accordance with the 
                    laws of India. Any disputes arising under these terms shall be subject to the 
                    jurisdiction of the courts in Kanpur, Uttar Pradesh.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-brand-navy mb-4">11. Contact Information</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    If you have any questions about these Terms and Conditions, please contact us:
                  </p>
                  <div className="bg-brand-navy/5 p-6 rounded-lg">
                    <div className="space-y-2 text-gray-700">
                      <div><strong>AAS Eduguide Pvt. Ltd.</strong></div>
                      <div>📍 117/H-1/377, Pandu Nagar, Near Agra Sweet House, Kakadeo, Kanpur, UP 208005</div>
                      <div>📞 +91-7752944476</div>
                      <div>✉️ alladmission1@gmail.com</div>
                      <div>🕒 Mon-Sat: 10:00 AM - 6:00 PM | Sun: 11:00 AM - 5:00 PM</div>
                    </div>
                  </div>
                </section>

                <div className="border-t pt-6 mt-8">
                  <p className="text-sm text-gray-500 text-center">
                    By using our services, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.
                  </p>
                </div>
              </div>
            </GlassCard>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}