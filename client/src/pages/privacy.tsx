import { useEffect } from "react";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import AnimatedBackground from "@/components/animated-background";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield, Lock, Eye, Database, AlertTriangle } from "lucide-react";
import { useLocation } from "wouter";

export default function PrivacyPage() {
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
                <Shield className="w-12 h-12 text-brand-green mr-4" />
                <h1 className="text-4xl md:text-5xl font-bold text-brand-navy">
                  Privacy Policy
                </h1>
              </div>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Your privacy is important to us. This policy explains how we collect, use, and protect your information.
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
                    <Eye className="w-6 h-6 mr-2 text-brand-green" />
                    1. Information We Collect
                  </h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    AAS Eduguide Pvt. Ltd. is committed to transparency in our data collection practices. 
                    We collect various types of information to provide personalized counseling services, 
                    improve our platform, and ensure the best possible user experience. The information 
                    we collect falls into several categories:
                  </p>
                  
                  <h3 className="text-xl font-semibold text-brand-navy mb-3">Personal Information You Provide</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mb-4">
                    <li><strong>Contact Information:</strong> Full name, email address, phone number, postal address</li>
                    <li><strong>Educational Details:</strong> Academic qualifications, exam scores (NEET UG/PG, DNB, INI-CET), rank, percentile</li>
                    <li><strong>Preferences:</strong> Preferred states, colleges, specializations, budget constraints</li>
                    <li><strong>Personal Details:</strong> Date of birth, gender, category (General/OBC/SC/ST), domicile state</li>
                    <li><strong>Financial Information:</strong> Payment details, billing address, transaction history</li>
                    <li><strong>Communication Records:</strong> Messages, queries, feedback, support conversations</li>
                    <li><strong>Documents:</strong> Academic certificates, identity proofs, category certificates (when uploaded)</li>
                    <li><strong>Family Information:</strong> Parent/guardian details, family income (for scholarship purposes)</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-brand-navy mb-3">Automatically Collected Information</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mb-4">
                    <li><strong>Technical Data:</strong> IP address, browser type and version, operating system, device information</li>
                    <li><strong>Usage Analytics:</strong> Pages visited, time spent, click patterns, search queries</li>
                    <li><strong>Location Data:</strong> Approximate geographic location based on IP address</li>
                    <li><strong>Cookies & Tracking:</strong> Session cookies, preference cookies, analytics cookies</li>
                    <li><strong>Performance Data:</strong> Page load times, error reports, system performance metrics</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-brand-navy mb-3">Information from Third Parties</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                    <li><strong>Social Media:</strong> Profile information when you connect via social platforms</li>
                    <li><strong>Payment Processors:</strong> Transaction confirmations and payment status</li>
                    <li><strong>Educational Institutions:</strong> Verification of academic credentials (with consent)</li>
                    <li><strong>Government Databases:</strong> Verification of category certificates and domicile (where applicable)</li>
                  </ul>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-brand-navy mb-4 flex items-center">
                    <Database className="w-6 h-6 mr-2 text-brand-green" />
                    2. How We Use Your Information
                  </h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    We use your information responsibly and only for legitimate business purposes. 
                    Our primary goal is to provide you with the best possible counseling experience 
                    while maintaining the highest standards of data protection:
                  </p>
                  
                  <h3 className="text-xl font-semibold text-brand-navy mb-3">Core Service Delivery</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mb-4">
                    <li><strong>Personalized Counseling:</strong> Create customized guidance based on your academic profile and preferences</li>
                    <li><strong>College Predictions:</strong> Generate accurate college and course predictions using your exam scores</li>
                    <li><strong>Choice Filling Assistance:</strong> Help you make informed decisions during counseling rounds</li>
                    <li><strong>Document Verification:</strong> Verify and validate your academic and personal documents</li>
                    <li><strong>Admission Support:</strong> Guide you through the entire admission process from application to enrollment</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-brand-navy mb-3">Account & Payment Management</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mb-4">
                    <li><strong>Account Creation:</strong> Set up and maintain your user account and profile</li>
                    <li><strong>Payment Processing:</strong> Handle secure payment transactions for our services</li>
                    <li><strong>Billing & Invoicing:</strong> Generate invoices, receipts, and manage payment records</li>
                    <li><strong>Refund Processing:</strong> Handle refund requests according to our refund policy</li>
                    <li><strong>Subscription Management:</strong> Manage your service subscriptions and renewals</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-brand-navy mb-3">Communication & Support</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mb-4">
                    <li><strong>Customer Support:</strong> Respond to your queries, complaints, and support requests</li>
                    <li><strong>Important Updates:</strong> Send critical information about counseling schedules, deadlines, and changes</li>
                    <li><strong>Educational Content:</strong> Share relevant articles, guides, and educational materials</li>
                    <li><strong>Event Notifications:</strong> Inform you about webinars, workshops, and counseling events</li>
                    <li><strong>Emergency Alerts:</strong> Send urgent notifications about last-minute changes or opportunities</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-brand-navy mb-3">Service Improvement & Analytics</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mb-4">
                    <li><strong>Platform Enhancement:</strong> Analyze usage patterns to improve our website and services</li>
                    <li><strong>Performance Monitoring:</strong> Track system performance and identify technical issues</li>
                    <li><strong>User Experience:</strong> Optimize user interface and navigation based on user behavior</li>
                    <li><strong>Success Rate Analysis:</strong> Monitor and improve our counseling success rates</li>
                    <li><strong>Market Research:</strong> Understand trends in medical education and admission patterns</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-brand-navy mb-3">Legal & Compliance</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                    <li><strong>Regulatory Compliance:</strong> Meet requirements of educational and financial regulations</li>
                    <li><strong>Fraud Prevention:</strong> Detect and prevent fraudulent activities and unauthorized access</li>
                    <li><strong>Legal Proceedings:</strong> Respond to legal requests, court orders, and government inquiries</li>
                    <li><strong>Tax Compliance:</strong> Maintain records for tax reporting and audit purposes</li>
                    <li><strong>Data Protection:</strong> Ensure compliance with data protection laws and regulations</li>
                  </ul>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-brand-navy mb-4 flex items-center">
                    <Lock className="w-6 h-6 mr-2 text-brand-green" />
                    3. Information Sharing and Disclosure
                  </h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except in the following circumstances:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                    <li>With your explicit consent</li>
                    <li>To comply with legal requirements or court orders</li>
                    <li>To protect our rights, property, or safety</li>
                    <li>With trusted service providers who assist in our operations (under strict confidentiality agreements)</li>
                    <li>In case of business merger, acquisition, or asset sale</li>
                  </ul>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-brand-navy mb-4">4. Data Security</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    We implement appropriate security measures to protect your personal information against unauthorized access, 
                    alteration, disclosure, or destruction. These measures include:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                    <li>Encryption of sensitive data during transmission</li>
                    <li>Secure servers with restricted access</li>
                    <li>Regular security audits and updates</li>
                    <li>Employee training on data protection</li>
                    <li>Multi-factor authentication for admin access</li>
                  </ul>
                  <div className="bg-blue-50 border-l-4 border-blue-400 p-4 my-4">
                    <div className="flex">
                      <AlertTriangle className="w-5 h-5 text-blue-400 mr-2 mt-0.5" />
                      <p className="text-blue-800">
                        <strong>Note:</strong> While we strive to protect your information, no method of transmission 
                        over the internet is 100% secure. We cannot guarantee absolute security.
                      </p>
                    </div>
                  </div>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-brand-navy mb-4">5. Cookies and Tracking Technologies</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Our website uses cookies and similar technologies to enhance your browsing experience. 
                    Cookies help us:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mb-4">
                    <li>Remember your preferences and settings</li>
                    <li>Analyze website traffic and usage patterns</li>
                    <li>Provide personalized content and recommendations</li>
                    <li>Improve website performance and functionality</li>
                  </ul>
                  <p className="text-gray-700 leading-relaxed">
                    You can control cookie settings through your browser preferences. However, disabling cookies 
                    may affect some website functionality.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-brand-navy mb-4">6. Your Rights and Choices</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    You have the following rights regarding your personal information:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                    <li><strong>Access:</strong> Request a copy of your personal data we hold</li>
                    <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                    <li><strong>Deletion:</strong> Request deletion of your personal data (subject to legal requirements)</li>
                    <li><strong>Portability:</strong> Request transfer of your data to another service provider</li>
                    <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
                    <li><strong>Restriction:</strong> Limit how we process your information</li>
                  </ul>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-brand-navy mb-4">7. Data Retention</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    We retain your personal information for as long as necessary to provide our services and 
                    comply with legal obligations. Specifically:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                    <li>Account information: Until account deletion or 7 years after last activity</li>
                    <li>Counseling records: 5 years for academic and legal compliance</li>
                    <li>Payment information: As required by financial regulations</li>
                    <li>Marketing data: Until you opt-out or 2 years of inactivity</li>
                  </ul>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-brand-navy mb-4">8. Third-Party Services</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Our website may contain links to third-party websites or services. We are not responsible 
                    for the privacy practices of these external sites. We encourage you to review their privacy 
                    policies before providing any personal information.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-brand-navy mb-4">9. Children's Privacy</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Our services are intended for individuals who are at least 16 years old or have parental consent. 
                    We do not knowingly collect personal information from children under 16 without parental consent. 
                    If we become aware of such collection, we will take steps to delete the information.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-brand-navy mb-4">10. International Data Transfers</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Your information may be transferred to and processed in countries other than your own. 
                    We ensure appropriate safeguards are in place to protect your data during such transfers, 
                    in accordance with applicable data protection laws.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-brand-navy mb-4">11. Changes to This Privacy Policy</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    We may update this Privacy Policy from time to time to reflect changes in our practices 
                    or legal requirements. We will notify you of significant changes by posting the updated 
                    policy on our website and updating the "Last updated" date.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-brand-navy mb-4">12. Contact Us</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    If you have any questions, concerns, or requests regarding this Privacy Policy or our 
                    data practices, please contact us:
                  </p>
                  <div className="bg-brand-navy/5 p-6 rounded-lg">
                    <div className="space-y-2 text-gray-700">
                      <div><strong>Data Protection Officer</strong></div>
                      <div><strong>AAS Eduguide Pvt. Ltd.</strong></div>
                      <div>📍 117/H-1/377, Pandu Nagar, Near Agra Sweet House, Kakadeo, Kanpur, UP 208005</div>
                      <div>📞 +91-7752944476</div>
                      <div>✉️ privacy@alladmission1.com</div>
                      <div>🕒 Mon-Sat: 10:00 AM - 6:00 PM | Sun: 11:00 AM - 5:00 PM</div>
                    </div>
                  </div>
                </section>

                <div className="border-t pt-6 mt-8">
                  <p className="text-sm text-gray-500 text-center">
                    By using our services, you acknowledge that you have read and understood this Privacy Policy 
                    and consent to the collection and use of your information as described herein.
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