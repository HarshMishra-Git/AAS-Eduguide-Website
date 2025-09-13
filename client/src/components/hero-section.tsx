import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Phone, ArrowRight, Stethoscope, GraduationCap, BookOpen, Award, Users, TrendingUp, Heart, Star } from "lucide-react";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import logoUrl from "@assets/AASLOGO.png";

interface TrustBadgeProps {
  value: string;
  label: string;
  counter?: number;
}

function TrustBadge({ value, label, counter }: TrustBadgeProps) {
  const [displayValue, setDisplayValue] = useState("0");
  const { isIntersecting, ref } = useIntersectionObserver({
    threshold: 0.5,
    freezeOnceVisible: true,
  });

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isIntersecting && counter) {
      let start = 0;
      const end = counter;
      const duration = 2000;
      const increment = end / (duration / 50);

      timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setDisplayValue(end.toLocaleString() + (value.includes('+') ? '+' : ''));
          clearInterval(timer);
        } else {
          setDisplayValue(Math.floor(start).toLocaleString() + (value.includes('+') ? '+' : ''));
        }
      }, 50);
    } else if (isIntersecting && !counter) {
      setDisplayValue(value);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isIntersecting, counter, value]);

  return (
    <GlassCard className="p-4 text-center hover-lift" ref={ref}>
      <div className="text-2xl font-bold text-brand-green animate-counter break-words" data-testid={`stat-${label.toLowerCase().replace(/\s+/g, '-')}`}>
        {displayValue}
      </div>
      <div className="text-sm text-gray-600">{label}</div>
    </GlassCard>
  );
}

// Medical Animation Components
function FloatingIcon({ icon: Icon, className, delay = 0 }: { icon: any, className: string, delay?: number }) {
  return (
    <div 
      className={`absolute animate-bounce ${className}`}
      style={{ animationDelay: `${delay}s`, animationDuration: '3s' }}
    >
      <div className="w-16 h-16 lg:w-20 lg:h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
        <Icon className="w-8 h-8 lg:w-10 lg:h-10 text-brand-green" />
      </div>
    </div>
  );
}

function PulsingOrb({ className, delay = 0 }: { className: string, delay?: number }) {
  return (
    <div 
      className={`absolute w-4 h-4 bg-brand-green/30 rounded-full animate-ping ${className}`}
      style={{ animationDelay: `${delay}s` }}
    />
  );
}

function MedicalGraphics() {
  return (
    <div className="relative w-full h-full">
      {/* Central Medical Hub */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="w-40 h-40 lg:w-48 lg:h-48 bg-gradient-to-br from-brand-green to-brand-navy rounded-full flex items-center justify-center shadow-2xl animate-pulse">
          <Stethoscope className="w-20 h-20 lg:w-24 lg:h-24 text-white" />
        </div>
        
        {/* Orbiting Elements */}
        <div className="absolute inset-0 animate-spin" style={{ animationDuration: '20s' }}>
          <div className="absolute -top-10 lg:-top-12 left-1/2 transform -translate-x-1/2">
            <div className="w-20 h-20 lg:w-24 lg:h-24 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
              <GraduationCap className="w-10 h-10 lg:w-12 lg:h-12 text-brand-green" />
            </div>
          </div>
          <div className="absolute top-1/2 -right-10 lg:-right-12 transform -translate-y-1/2">
            <div className="w-20 h-20 lg:w-24 lg:h-24 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
              <BookOpen className="w-10 h-10 lg:w-12 lg:h-12 text-brand-navy" />
            </div>
          </div>
          <div className="absolute -bottom-10 lg:-bottom-12 left-1/2 transform -translate-x-1/2">
            <div className="w-20 h-20 lg:w-24 lg:h-24 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
              <Award className="w-10 h-10 lg:w-12 lg:h-12 text-brand-green" />
            </div>
          </div>
          <div className="absolute top-1/2 -left-10 lg:-left-12 transform -translate-y-1/2">
            <div className="w-20 h-20 lg:w-24 lg:h-24 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
              <Users className="w-10 h-10 lg:w-12 lg:h-12 text-brand-navy" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Floating Medical Icons */}
      <FloatingIcon icon={Heart} className="top-16 left-16" delay={0} />
      <FloatingIcon icon={Star} className="top-32 right-20" delay={1} />
      <FloatingIcon icon={TrendingUp} className="bottom-32 left-12" delay={2} />
      <FloatingIcon icon={GraduationCap} className="bottom-16 right-16" delay={0.5} />
      
      {/* Pulsing Orbs */}
      <PulsingOrb className="top-20 left-1/3" delay={0} />
      <PulsingOrb className="top-1/3 right-20" delay={1} />
      <PulsingOrb className="bottom-20 left-20" delay={2} />
      <PulsingOrb className="bottom-1/3 right-1/3" delay={0.5} />
      
      {/* Success Stats Floating */}
      <div className="absolute top-12 right-12 animate-float">
        <GlassCard className="p-4 text-center">
          <div className="text-2xl font-bold text-brand-green">2L+</div>
          <div className="text-xs text-gray-600">Students</div>
        </GlassCard>
      </div>
      
      <div className="absolute bottom-12 left-8 animate-float" style={{ animationDelay: '1s' }}>
        <GlassCard className="p-4 text-center">
          <div className="text-2xl font-bold text-brand-green">13+</div>
          <div className="text-xs text-gray-600">Years</div>
        </GlassCard>
      </div>
      
      {/* DNA Helix Animation */}
      <div className="absolute top-1/4 right-1/4 w-2 h-32 overflow-hidden">
        <div className="w-full h-full bg-gradient-to-b from-brand-green to-transparent animate-pulse opacity-30" />
      </div>
    </div>
  );
}

export default function HeroSection() {
  const scrollToPackages = () => {
    document.getElementById("pg-packages")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="home" className="min-h-screen flex items-center relative overflow-hidden pt-16 pb-8">
      {/* Premium Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-green-50"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-brand-navy/5 via-transparent to-brand-green/5"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Content */}
          <div className="space-y-8 animate-fade-up">
            {/* Logo & Brand */}
            <div className="flex flex-col items-center lg:items-start space-y-4 lg:space-y-6">
              <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-36 lg:h-36 rounded-full bg-white shadow-xl flex items-center justify-center overflow-hidden">
                <img 
                  src={logoUrl} 
                  alt="AAS Eduguide Logo" 
                  className="w-56 h-56 sm:w-64 sm:h-64 md:w-72 md:h-72 lg:w-80 lg:h-80 object-cover -mt-4"
                />
              </div>
              <div className="text-center lg:text-left">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-brand-navy leading-tight whitespace-nowrap" data-testid="text-hero-title">
                  AAS EduGuide <span className="text-brand-green">Pvt. Ltd.</span>
                </h1>
                <p className="text-lg sm:text-xl md:text-2xl text-brand-green font-semibold">"Your Career Is Our Concern"</p>
              </div>
            </div>
            
            {/* Main Headline */}
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-brand-navy leading-tight" data-testid="text-hero-subtitle">
                Your Medical
                <span className="text-brand-green block">Career Starts</span>
                <span className="bg-gradient-to-r from-brand-green to-brand-navy bg-clip-text text-transparent">Here</span>
              </h2>
              
              <p className="text-xl text-gray-600 leading-relaxed" data-testid="text-hero-description">
                {/* <span className="text-brand-green font-bold">"Your Career Is Our Concern"</span><br/> */}
                Expert guidance for <span className="font-semibold text-brand-navy">NEET UG/PG, DNB, INI‑CET</span> with 13+ years of proven success.
              </p>
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              <TrustBadge value="13+" label="Years Experience" counter={13} />
              <TrustBadge value="2 Lac+" label="Students Guided" counter={200056} />
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                className="btn-primary text-white px-8 py-4 text-lg font-medium flex items-center justify-center space-x-3"
                onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
                data-testid="button-get-callback"
              >
                <Phone className="w-5 h-5" />
                <span>Get Free Callback</span>
              </Button>
              <Button 
                variant="outline"
                className="relative overflow-hidden border-2 px-8 py-4 text-lg font-bold flex items-center justify-center space-x-3 transition-all duration-300 hover:scale-105 animate-blue-blink"
                onClick={scrollToPackages}
                data-testid="button-explore-packages"
              >
                <span className="relative z-10">Explore Packages</span>
                <ArrowRight className="w-5 h-5 relative z-10" />
              </Button>
            </div>
            
            {/* Trust Indicators */}
            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-brand-green rounded-full animate-pulse"></div>
                <span>India & Abroad Coverage</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-brand-green rounded-full animate-pulse"></div>
                <span>24×7 Expert Support</span>
              </div>
            </div>
          </div>
          
          {/* Right Graphics */}
          <div className="relative h-[550px] lg:h-[750px] xl:h-[850px]">
            <MedicalGraphics />
          </div>
        </div>
      </div>
      
      {/* Custom Animations - Moved to CSS file for security */}
      <style>
        {`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        @keyframes blue-blink {
          0%, 50% { 
            background-color: white;
            color: #1e3a8a;
            border-color: #1e3a8a;
          }
          51%, 100% { 
            background-color: #1e3a8a;
            color: white;
            border-color: #1e3a8a;
          }
        }
        .animate-blue-blink {
          animation: blue-blink 1.5s ease-in-out infinite;
        }
        `}
      </style>
    </section>
  );
}
