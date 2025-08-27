import { useState, useEffect, lazy, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Phone, ArrowRight } from "lucide-react";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import logoUrl from "@assets/AASLOGO.png";

const LazyVideoBackground = lazy(() => import('./video-background'));

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
      <div className="text-xl font-bold text-brand-green animate-counter break-words" data-testid={`stat-${label.toLowerCase().replace(/\s+/g, '-')}`}>
        {displayValue}
      </div>
      <div className="text-sm text-gray-600">{label}</div>
    </GlassCard>
  );
}

export default function HeroSection() {

  const scrollToPackages = () => {
    document.getElementById("pg-packages")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="home" className="min-h-screen flex items-center relative overflow-hidden pt-16 pb-8">
      {/* Lazy-loaded YouTube Video Background */}
      <Suspense fallback={null}>
        <LazyVideoBackground />
      </Suspense>
      {/* Gradient Overlay */}
      <div className="absolute inset-0 gradient-bg"></div>
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="text-center space-y-8 lg:space-y-12 animate-fade-up">
          {/* Header Content */}
          <div className="space-y-6 lg:space-y-8">
            <div className="flex flex-col items-center space-y-6 mb-8">
              <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-full bg-white shadow-xl flex items-center justify-center overflow-hidden">
                <img 
                  src={logoUrl} 
                  alt="AAS Eduguide Logo" 
                  className="w-56 h-56 sm:w-64 sm:h-64 md:w-72 md:h-72 lg:w-80 lg:h-80 object-cover -mt-4"
                />
              </div>
              <div className="text-center">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-brand-navy leading-tight mb-2" data-testid="text-hero-title">
                  AAS Eduguide <span className="text-brand-green">Pvt. Ltd.</span>
                </h1>
                <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-brand-green font-semibold">All Admission Services</p>
              </div>
            </div>
            
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-gray-700 font-medium max-w-4xl mx-auto" data-testid="text-hero-subtitle">
              <span className="text-brand-green font-bold">"Your Career Is Our Concern"</span><br/>
              Expert guidance for medical admissions — <span className="text-brand-green font-semibold">NEET UG/PG, DNB, INI‑CET</span>
            </h2>
            
            <p className="text-lg sm:text-xl md:text-2xl text-gray-600 leading-relaxed max-w-5xl mx-auto" data-testid="text-hero-description">
              We offer comprehensive counselling for medical courses in <span className="font-semibold text-brand-green">India and Abroad</span>. Data-led counseling, live seat intelligence, and end‑to‑end choice filling across AIQ, State, Deemed, Private, and DNB seats.
            </p>
          </div>
          
          {/* Trust Badges */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 max-w-4xl mx-auto">
            <TrustBadge value="13+" label="Years Experience" counter={13} />
            <TrustBadge value="10 Lac+" label="Students Guided" counter={200000} />
            <TrustBadge value="India & Abroad" label="Counselling Coverage" />
            <TrustBadge value="24×7" label="Expert Support" />
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
            <Button 
              className="btn-primary text-white px-10 py-4 text-xl font-medium flex items-center justify-center space-x-3 min-w-[200px]"
              onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
              data-testid="button-get-callback"
            >
              <Phone className="w-6 h-6" />
              <span>Get Free Callback</span>
            </Button>
            <Button 
              variant="outline"
              className="btn-secondary text-white px-10 py-4 text-xl font-medium flex items-center justify-center space-x-3 min-w-[200px]"
              onClick={scrollToPackages}
              data-testid="button-explore-packages"
            >
              <span>Explore Packages</span>
              <ArrowRight className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
