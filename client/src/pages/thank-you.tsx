import { useEffect } from "react";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import AnimatedBackground from "@/components/animated-background";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowLeft, Phone, Mail, Clock, MessageCircle } from "lucide-react";
import { useLocation } from "wouter";

export default function ThankYouPage() {
  const [, navigate] = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const goHome = () => {
    navigate('/');
  };

  const openWhatsApp = () => {
    window.open("https://api.whatsapp.com/send/?phone=%2B917752944476&text&type=phone_number&app_absent=0", "_blank");
  };

  return (
    <div className="min-h-screen bg-gray-50 relative">
      <AnimatedBackground />
      <div className="relative z-10">
        <Navigation />
        <main className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Success Message */}
            <div className="text-center mb-12">
              <div className="flex items-center justify-center mb-8">
                <div className="w-20 h-20 bg-brand-green rounded-full flex items-center justify-center animate-scale-in">
                  <CheckCircle className="w-12 h-12 text-white" />
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-brand-navy mb-6 animate-fade-up">
                Thank You!
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto animate-fade-up" style={{animationDelay: '0.2s'}}>
                Your message has been successfully submitted. Our expert counselors will get back to you within 15 minutes.
              </p>
            </div>

            {/* Content Card */}
            <GlassCard className="p-8 md:p-12 animate-fade-up" style={{animationDelay: '0.4s'}}>
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-brand-navy mb-4">
                  What Happens Next?
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-brand-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Phone className="w-8 h-8 text-brand-green" />
                    </div>
                    <h3 className="font-semibold text-brand-navy mb-2">Quick Response</h3>
                    <p className="text-gray-600 text-sm">
                      Our counselors will contact you within 15 minutes during business hours
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-brand-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <MessageCircle className="w-8 h-8 text-brand-green" />
                    </div>
                    <h3 className="font-semibold text-brand-navy mb-2">Personalized Guidance</h3>
                    <p className="text-gray-600 text-sm">
                      Get tailored advice based on your NEET score and preferences
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-brand-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8 text-brand-green" />
                    </div>
                    <h3 className="font-semibold text-brand-navy mb-2">Complete Support</h3>
                    <p className="text-gray-600 text-sm">
                      From counseling to admission - we'll guide you every step
                    </p>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-brand-navy/5 p-6 rounded-lg mb-8">
                <h3 className="text-xl font-bold text-brand-navy mb-4 text-center">
                  Need Immediate Assistance?
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center md:text-left">
                  <div className="space-y-2">
                    <div className="flex items-center justify-center md:justify-start">
                      <Phone className="w-5 h-5 text-brand-green mr-2" />
                      <span className="text-gray-700">+91-7752944476</span>
                    </div>
                    <div className="flex items-center justify-center md:justify-start">
                      <Mail className="w-5 h-5 text-brand-green mr-2" />
                      <span className="text-gray-700">alladmission1@gmail.com</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-center md:justify-start">
                      <Clock className="w-5 h-5 text-brand-green mr-2" />
                      <span className="text-gray-700">Mon-Sat: 10 AM - 6 PM</span>
                    </div>
                    <div className="flex items-center justify-center md:justify-start">
                      <Clock className="w-5 h-5 text-brand-green mr-2" />
                      <span className="text-gray-700">Sun: 11 AM - 5 PM</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={goHome}
                  className="btn-primary px-8 py-3 font-medium"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
                <Button 
                  onClick={openWhatsApp}
                  variant="outline"
                  className="border-brand-green text-brand-green hover:bg-brand-green hover:text-white px-8 py-3 font-medium"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Chat on WhatsApp
                </Button>
              </div>

              {/* Additional Information */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="text-center">
                  <h4 className="font-semibold text-brand-navy mb-3">
                    Why Choose AAS Eduguide?
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                    <div className="text-center">
                      <div className="font-bold text-brand-green text-lg">13+</div>
                      <div>Years Experience</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-brand-green text-lg">10L+</div>
                      <div>Students Guided</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-brand-green text-lg">95%</div>
                      <div>Success Rate</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-brand-green text-lg">24×7</div>
                      <div>Support</div>
                    </div>
                  </div>
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