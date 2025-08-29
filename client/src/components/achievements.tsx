import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Award, Trophy, Star } from "lucide-react";

export default function Achievements() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const achievements = [
    { id: 1, image: "/1.png", title: "Excellence in Medical Education" },
    { id: 2, image: "/2.png", title: "Outstanding Counselling Services" },
    { id: 3, image: "/3.png", title: "Industry Recognition Award" },
    { id: 4, image: "/4.png", title: "Student Success Achievement" },
  ];

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % achievements.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, achievements.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % achievements.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + achievements.length) % achievements.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  return (
    <>
      <style>{`
        @keyframes shine {
          0% { transform: translateX(-100%) skewX(-12deg); }
          100% { transform: translateX(200%) skewX(-12deg); }
        }
        .animate-shine {
          animation: shine 3s infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
      
      <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-blue-50 relative overflow-hidden">
        {/* Creative Animated Background */}
        <div className="absolute inset-0">
          {/* Floating Trophy Icons */}
          <div className="absolute top-20 left-10 w-16 h-16 text-yellow-500/60 animate-bounce">
            <Trophy className="w-full h-full" />
          </div>
          <div className="absolute top-40 right-20 w-12 h-12 text-brand-teal/60 animate-bounce delay-1000">
            <Award className="w-full h-full" />
          </div>
          <div className="absolute bottom-32 left-1/4 w-14 h-14 text-yellow-500/60 animate-bounce delay-2000">
            <Star className="w-full h-full" />
          </div>
          
          {/* Geometric Shapes */}
          <div className="absolute top-32 right-1/4 w-20 h-20 border-4 border-brand-teal/40 rounded-full animate-spin-slow"></div>
          <div className="absolute bottom-20 right-10 w-24 h-24 border-4 border-yellow-500/40 rotate-45 animate-pulse"></div>
          <div className="absolute top-1/2 left-10 w-16 h-16 bg-gradient-to-r from-brand-teal/20 to-yellow-400/20 rounded-lg animate-float"></div>
          
          {/* Gradient Orbs */}
          <div className="absolute top-16 left-1/3 w-32 h-32 bg-gradient-to-r from-brand-teal/30 to-transparent rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-16 right-1/3 w-40 h-40 bg-gradient-to-l from-yellow-400/30 to-transparent rounded-full blur-xl animate-pulse delay-1000"></div>
          
          {/* Sparkle Effects */}
          <div className="absolute top-24 left-1/2 w-3 h-3 bg-yellow-500 rounded-full animate-ping"></div>
          <div className="absolute bottom-40 left-20 w-2 h-2 bg-brand-teal rounded-full animate-ping delay-500"></div>
          <div className="absolute top-60 right-32 w-2.5 h-2.5 bg-yellow-500 rounded-full animate-ping delay-1500"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-6">
              <Trophy className="w-12 h-12 text-yellow-500 mr-4 animate-bounce" />
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-brand-navy via-brand-teal to-brand-navy bg-clip-text text-transparent">
                Our Achievements
              </h2>
              <Award className="w-12 h-12 text-yellow-500 ml-4 animate-bounce delay-300" />
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Celebrating excellence and recognition in medical education counselling
            </p>
          </div>

          {/* Sliding Carousel Container */}
          <div className="relative max-w-4xl mx-auto">
            <div className="overflow-hidden rounded-2xl">
              <div 
                className="flex transition-transform duration-700 ease-in-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              >
                {achievements.map((achievement, index) => (
                  <div key={achievement.id} className="w-full flex-shrink-0 px-2">
                    <div className="relative bg-gradient-to-br from-white via-blue-50/30 to-white rounded-xl shadow-2xl overflow-hidden border-3 border-brand-teal hover:border-yellow-500 transition-all duration-500 hover:shadow-brand-teal/20 hover:scale-[1.02]">
                      {/* Shine Effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-brand-teal/10 to-transparent -skew-x-12 animate-shine"></div>
                      
                      {/* Image Container */}
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <img
                          src={achievement.image}
                          alt={achievement.title}
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600"><defs><linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%23f8fafc"/><stop offset="100%" stop-color="%23e2e8f0"/></linearGradient></defs><rect width="800" height="600" fill="url(%23bg)"/><rect x="100" y="150" width="600" height="300" fill="%23ffffff" stroke="%2306b6d4" stroke-width="4" rx="20" opacity="0.9"/><text x="400" y="280" text-anchor="middle" fill="%23374151" font-family="Arial" font-size="24" font-weight="bold">🏆 Achievement ${achievement.id}</text><text x="400" y="320" text-anchor="middle" fill="%236b7280" font-family="Arial" font-size="16">Add ${achievement.id}.png to public folder</text></svg>`;
                          }}
                        />
                        
                        {/* Floating Icons */}
                        <div className="absolute top-3 right-3">
                          <Star className="w-6 h-6 text-yellow-500 drop-shadow-lg animate-pulse" />
                        </div>
                        
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/70 via-transparent to-transparent"></div>
                      </div>
                      
                      {/* Title */}
                      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-brand-navy via-brand-navy/95 to-transparent">
                        <h3 className="text-white font-bold text-lg text-center leading-tight drop-shadow-lg">
                          {achievement.title}
                        </h3>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Buttons */}
            <button
              onClick={prevSlide}
              className="absolute -left-8 top-1/2 -translate-y-1/2 z-50 bg-brand-teal hover:bg-green-600 text-white p-4 rounded-full transition-all duration-300 hover:scale-110 shadow-2xl border-3 border-white"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
            
            <button
              onClick={nextSlide}
              className="absolute -right-8 top-1/2 -translate-y-1/2 z-50 bg-brand-teal hover:bg-green-600 text-white p-4 rounded-full transition-all duration-300 hover:scale-110 shadow-2xl border-3 border-white"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-12 space-x-3">
            {achievements.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-5 h-5 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "bg-gradient-to-r from-brand-teal to-yellow-500 scale-125 shadow-lg shadow-brand-teal/50"
                    : "bg-gray-400 hover:bg-gray-500"
                }`}
              />
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="text-center">
              <div className="text-5xl font-bold text-brand-green mb-3">13+</div>
              <div className="text-gray-800 font-semibold text-lg">Years of Excellence</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-brand-green mb-3">10+</div>
              <div className="text-gray-800 font-semibold text-lg">Awards & Recognition</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-brand-green mb-3">2L+</div>
              <div className="text-gray-800 font-semibold text-lg">Students Guided</div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}