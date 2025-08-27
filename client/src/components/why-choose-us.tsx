import { GlassCard } from "@/components/ui/glass-card";
import { CheckCircle, Award, Users, Clock, BookOpen, Shield } from "lucide-react";

const features = [
  {
    icon: CheckCircle,
    title: "Verified College Information",
    description: "All college information is thoroughly verified for accuracy and reliability.",
    color: "from-green-500 to-emerald-500"
  },
  {
    icon: Award,
    title: "Top-Ranked Institutions",
    description: "We list only recognized and accredited medical institutions across the country.",
    color: "from-blue-500 to-cyan-500"
  },
  {
    icon: Users,
    title: "Expert Counselors",
    description: "Our team of experienced counselors guide you through the admission process.",
    color: "from-purple-500 to-pink-500"
  },
  {
    icon: BookOpen,
    title: "Comprehensive Resources",
    description: "Access detailed guides on exams, courses, and admission procedures.",
    color: "from-orange-500 to-red-500"
  },
  {
    icon: Shield,
    title: "Trusted by Students",
    description: "Over 1 million students have trusted us for their medical education needs.",
    color: "from-indigo-500 to-purple-500"
  },
  {
    icon: Clock,
    title: "Timely Updates",
    description: "Stay updated with the latest information on application deadlines and results.",
    color: "from-teal-500 to-cyan-500"
  }
];

export default function WhyChooseUs() {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background with Medical Theme */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-green-50">
        {/* Animated Background Elements */}
        <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-r from-blue-200 to-purple-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-green-200 to-blue-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full opacity-10 animate-spin" style={{animationDuration: '20s'}}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-brand-navy mb-6">
            Why Choose <span className="text-brand-green">Us</span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-4xl mx-auto px-4">
            AAS Eduguide is your trusted partner in finding the perfect medical college. We provide authentic
            information and personalized guidance for your medical career journey.
          </p>
        </div>

        {/* Desktop Layout */}
        <div className="hidden xl:block relative max-w-6xl mx-auto">
          <div className="relative w-96 h-96 mx-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-400 via-red-400 to-purple-600 rounded-full p-1 animate-spin" style={{animationDuration: '10s'}}>
              <div className="w-full h-full bg-white rounded-full"></div>
            </div>
            <div className="absolute inset-8 bg-gradient-to-br from-blue-50 to-green-50 rounded-full flex items-center justify-center shadow-2xl">
              <div className="text-center p-8">
                <div className="w-32 h-32 mx-auto mb-4 bg-gradient-to-br from-brand-navy to-brand-green rounded-full flex items-center justify-center shadow-xl">
                  <div className="text-white text-center">
                    <Users className="w-12 h-12 mx-auto mb-1" />
                    <div className="text-xl font-bold">2L+</div>
                    <div className="text-xs">Students Guided</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-center">
                  <div>
                    <div className="text-lg font-bold text-brand-navy">13+</div>
                    <div className="text-xs text-gray-600">Years Experience</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-brand-green">24×7</div>
                    <div className="text-xs text-gray-600">Support</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute top-8 -left-80 w-72">
              {features.slice(0, 3).map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <GlassCard key={index} className="p-4 mb-4 hover-lift group bg-white/60 backdrop-blur-sm border border-white/30">
                    <div className="flex items-start space-x-3">
                      <div className={`w-10 h-10 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center shadow-lg flex-shrink-0`}>
                        <IconComponent className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-brand-navy mb-1">{feature.title}</h3>
                        <p className="text-xs text-gray-600">{feature.description}</p>
                      </div>
                    </div>
                  </GlassCard>
                );
              })}
            </div>
            <div className="absolute top-8 -right-80 w-72">
              {features.slice(3, 6).map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <GlassCard key={index} className="p-4 mb-4 hover-lift group bg-white/60 backdrop-blur-sm border border-white/30">
                    <div className="flex items-start space-x-3">
                      <div className={`w-10 h-10 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center shadow-lg flex-shrink-0`}>
                        <IconComponent className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-brand-navy mb-1">{feature.title}</h3>
                        <p className="text-xs text-gray-600">{feature.description}</p>
                      </div>
                    </div>
                  </GlassCard>
                );
              })}
            </div>
          </div>
        </div>

        {/* Mobile & Tablet Layout */}
        <div className="xl:hidden">
          {/* Central Stats Card */}
          <div className="max-w-sm mx-auto mb-12">
            <GlassCard className="p-6 text-center bg-gradient-to-br from-blue-50 to-green-50 border border-white/30">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-brand-navy to-brand-green rounded-full flex items-center justify-center shadow-xl">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div className="text-2xl font-bold text-brand-navy mb-2">2L+ Students Guided</div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <div className="text-xl font-bold text-brand-navy">13+</div>
                  <div className="text-sm text-gray-600">Years Experience</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-brand-green">24×7</div>
                  <div className="text-sm text-gray-600">Support</div>
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <GlassCard key={index} className="p-6 hover-lift group bg-white/60 backdrop-blur-sm border border-white/30">
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center shadow-lg flex-shrink-0`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-brand-navy mb-2">{feature.title}</h3>
                      <p className="text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                </GlassCard>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}