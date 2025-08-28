import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { UserCheck, TrendingUp, MapPin } from "lucide-react";

export default function CompanyOverview() {
  const scrollToServices = () => {
    document.getElementById("services")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="overview" className="py-20 bg-white relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Floating Medical Icons */}
        <div className="absolute top-20 left-10 opacity-10 animate-float-medical">
          <UserCheck className="w-12 h-12 text-brand-green" />
        </div>
        <div className="absolute top-40 right-20 opacity-10 animate-float-medical-delayed">
          <TrendingUp className="w-14 h-14 text-brand-navy" />
        </div>
        <div className="absolute bottom-32 left-1/4 opacity-10 animate-bounce-medical">
          <MapPin className="w-10 h-10 text-brand-green" />
        </div>
        
        {/* Animated Particles */}
        <div className="absolute top-1/4 left-1/3 w-3 h-3 bg-brand-green rounded-full animate-ping opacity-30"></div>
        <div className="absolute top-3/4 right-1/4 w-2 h-2 bg-brand-navy rounded-full animate-pulse opacity-40"></div>
        <div className="absolute top-1/2 left-1/5 w-4 h-4 bg-blue-400 rounded-full animate-bounce opacity-20"></div>
        
        {/* Gradient Orbs */}
        <div className="absolute top-1/3 right-1/3 w-32 h-32 bg-gradient-to-r from-blue-200 to-green-200 rounded-full opacity-20 animate-pulse-orb"></div>
        <div className="absolute bottom-1/4 left-1/6 w-24 h-24 bg-gradient-to-r from-green-200 to-purple-200 rounded-full opacity-20 animate-float-orb"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-brand-navy mb-6 animate-fade-in-up" data-testid="text-overview-title">
            Trusted medical admissions counseling in India & Abroad
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed animate-fade-in-up-delayed" data-testid="text-overview-description">
            With over 13+ years of experience and a mission rooted in ethics and transparency, we provide data-driven counseling for medical admissions in India and abroad. We have guided 2 Lac+ students successfully.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <GlassCard className="p-8 text-center hover-lift group relative overflow-hidden" style={{ animationDelay: '0.2s' }}>
            {/* Animated Background Particles */}
            <div className="absolute top-2 right-2 w-2 h-2 bg-brand-green rounded-full animate-ping opacity-40"></div>
            <div className="absolute bottom-4 left-4 w-1 h-1 bg-blue-400 rounded-full animate-pulse opacity-60"></div>
            
            <div className="w-16 h-16 bg-gradient-to-br from-brand-green to-brand-light-green rounded-full flex items-center justify-center mx-auto mb-6 group-hover:animate-spin-once shadow-lg group-hover:shadow-xl transition-all duration-300 relative">
              <UserCheck className="text-white text-2xl w-8 h-8" />
              {/* Orbiting Dot */}
              <div className="absolute top-1 right-1 w-2 h-2 bg-white rounded-full animate-orbit opacity-80"></div>
            </div>
            <h3 className="text-2xl font-bold text-brand-navy mb-4 group-hover:text-brand-green transition-colors duration-300" data-testid="text-expertise-title">Medical Expertise</h3>
            <p className="text-gray-600 leading-relaxed" data-testid="text-expertise-description">
              Dedicated exclusively to medical admissions with deep understanding of NEET, DNB, and INI-CET processes across all states in India and international medical programs abroad.
            </p>
            
            {/* Progress Bar */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-brand-green to-brand-light-green transform -translate-x-full group-hover:translate-x-0 transition-transform duration-1000"></div>
            </div>
          </GlassCard>
          
          <GlassCard className="p-8 text-center hover-lift group relative overflow-hidden" style={{ animationDelay: '0.4s' }}>
            {/* Animated Background Particles */}
            <div className="absolute top-2 right-2 w-2 h-2 bg-brand-navy rounded-full animate-ping opacity-40"></div>
            <div className="absolute bottom-4 left-4 w-1 h-1 bg-purple-400 rounded-full animate-pulse opacity-60"></div>
            
            <div className="w-16 h-16 bg-gradient-to-br from-brand-navy to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:animate-spin-once shadow-lg group-hover:shadow-xl transition-all duration-300 relative">
              <TrendingUp className="text-white text-2xl w-8 h-8" />
              {/* Orbiting Dot */}
              <div className="absolute top-1 right-1 w-2 h-2 bg-white rounded-full animate-orbit opacity-80"></div>
            </div>
            <h3 className="text-2xl font-bold text-brand-navy mb-4 group-hover:text-brand-green transition-colors duration-300" data-testid="text-data-title">Data & Tools</h3>
            <p className="text-gray-600 leading-relaxed" data-testid="text-data-description">
              Live seat matrices, historical closure data, predictive analytics, and real-time counseling round updates.
            </p>
            
            {/* Progress Bar */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-brand-navy to-blue-600 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-1000"></div>
            </div>
          </GlassCard>
          
          <GlassCard className="p-8 text-center hover-lift group relative overflow-hidden" style={{ animationDelay: '0.6s' }}>
            {/* Animated Background Particles */}
            <div className="absolute top-2 right-2 w-2 h-2 bg-purple-500 rounded-full animate-ping opacity-40"></div>
            <div className="absolute bottom-4 left-4 w-1 h-1 bg-green-400 rounded-full animate-pulse opacity-60"></div>
            
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:animate-spin-once shadow-lg group-hover:shadow-xl transition-all duration-300 relative">
              <MapPin className="text-white text-2xl w-8 h-8" />
              {/* Orbiting Dot */}
              <div className="absolute top-1 right-1 w-2 h-2 bg-white rounded-full animate-orbit opacity-80"></div>
            </div>
            <h3 className="text-2xl font-bold text-brand-navy mb-4 group-hover:text-brand-green transition-colors duration-300" data-testid="text-coverage-title">India & Abroad Coverage</h3>
            <p className="text-gray-600 leading-relaxed" data-testid="text-coverage-description">
              Complete guidance for AIQ, State quota, Deemed universities, Private colleges, and DNB seats across all 29 states in India, plus international medical colleges abroad.
            </p>
            
            {/* Progress Bar */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-1000"></div>
            </div>
          </GlassCard>
        </div>
        
        <div className="text-center mt-12">
          <Button 
            className="btn-secondary text-white px-8 py-3 text-lg font-medium hover:scale-105 transition-transform duration-300 animate-pulse-button"
            onClick={scrollToServices}
            data-testid="button-see-how-we-work"
          >
            See How We Work
          </Button>
        </div>
      </div>
    </section>
  );
}
