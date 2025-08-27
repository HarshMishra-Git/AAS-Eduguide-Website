import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { useEffect, useRef } from "react";

const testimonials = [
  {
    initials: "AS",
    name: "Ananya S.",
    exam: "NEET PG 2024, Karnataka",
    quote: "Secured MD Medicine at KIMS Bangalore. The choice filling strategy and DNB guidance were exceptional. Worth every penny!",
    result: "MD Medicine, KIMS Bangalore",
    bgColor: "bg-brand-green",
  },
  {
    initials: "RK",
    name: "Rajesh K.",
    exam: "NEET UG 2024, Tamil Nadu",
    quote: "Got MBBS at Madras Medical College through state quota. The counseling team's support was phenomenal throughout the process.",
    result: "MBBS, Madras Medical College",
    bgColor: "bg-brand-navy",
  },
  {
    initials: "PM",
    name: "Priya M.",
    exam: "INI-CET 2024, Delhi",
    quote: "Cleared INI-CET and got MD Radiology at AIIMS Delhi. The guidance for choice filling in INI-CET was spot on!",
    result: "MD Radiology, AIIMS Delhi",
    bgColor: "bg-purple-600",
  },
  {
    initials: "VT",
    name: "Vikash T.",
    exam: "DNB 2024, Maharashtra",
    quote: "Secured DNB Medicine at a top hospital in Mumbai. The hospital reviews and bond information helped me make the right choice.",
    result: "DNB Medicine, Mumbai",
    bgColor: "bg-orange-600",
  },
  {
    initials: "SG",
    name: "Shreya G.",
    exam: "NEET UG 2024, Rajasthan",
    quote: "Got MBBS at SMS Medical College, Jaipur through state quota. The real-time updates and documentation support were excellent.",
    result: "MBBS, SMS Medical College",
    bgColor: "bg-pink-600",
  },
  {
    initials: "AJ",
    name: "Amit J.",
    exam: "NEET PG 2024, West Bengal",
    quote: "Secured MS Ortho at Medical College Kolkata. The vacancy round alerts helped me get this seat in the final round!",
    result: "MS Orthopaedics, MCK",
    bgColor: "bg-indigo-600",
  },
];

function TestimonialCarousel() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const scrollWidth = scrollContainer.scrollWidth;
    const clientWidth = scrollContainer.clientWidth;
    let scrollPosition = 0;

    const autoScroll = () => {
      scrollPosition += 1;
      
      if (scrollPosition >= scrollWidth - clientWidth) {
        scrollPosition = 0;
      }
      
      scrollContainer.scrollLeft = scrollPosition;
    };

    const intervalId = setInterval(autoScroll, 100);

    return () => clearInterval(intervalId);
  }, []);

  // Duplicate testimonials for seamless infinite scroll
  const duplicatedTestimonials = [...testimonials, ...testimonials];

  return (
    <div className="relative overflow-hidden">
      <div 
        ref={scrollContainerRef}
        className="flex gap-8 overflow-x-auto scrollbar-hide"
        style={{
          scrollBehavior: 'auto',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
      >
        {duplicatedTestimonials.map((testimonial, index) => (
          <div key={`${testimonial.name}-${index < testimonials.length ? 'original' : 'duplicate'}`} className="flex-shrink-0 w-80 testimonial-card p-6 rounded-2xl shadow-lg hover-lift bg-white/20 backdrop-blur-sm border border-white/30">
            <div className="flex items-center space-x-4 mb-4">
              <div className={`w-12 h-12 ${testimonial.bgColor} rounded-full flex items-center justify-center text-white font-bold`}>
                {testimonial.initials}
              </div>
              <div>
                <h4 className="font-semibold text-brand-navy" data-testid={`text-testimonial-name-${index}`}>
                  {testimonial.name}
                </h4>
                <p className="text-sm text-gray-600" data-testid={`text-testimonial-exam-${index}`}>
                  {testimonial.exam}
                </p>
              </div>
            </div>
            <p className="text-gray-700 mb-4" data-testid={`text-testimonial-quote-${index}`}>
              "{testimonial.quote}"
            </p>
            <div className="text-sm text-brand-green font-semibold" data-testid={`text-testimonial-result-${index}`}>
              {testimonial.result}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-20 gradient-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-brand-navy mb-6" data-testid="text-testimonials-title">
            Results that speak
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto" data-testid="text-testimonials-description">
            Hear from our successful students who secured their dream medical college admissions with our guidance.
          </p>
        </div>
        
        <TestimonialCarousel />
        
        <div className="text-center mt-12">
          <Button 
            className="btn-secondary text-white px-8 py-3 text-lg font-medium"
            data-testid="button-view-all-stories"
          >
            View All Success Stories
          </Button>
        </div>
      </div>
    </section>
  );
}
