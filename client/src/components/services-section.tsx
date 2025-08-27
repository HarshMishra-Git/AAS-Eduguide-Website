import { GlassCard } from "@/components/ui/glass-card";
import { 
  Building2, 
  TrendingUp, 
  DollarSign, 
  Stethoscope, 
  Bell, 
  CheckSquare, 
  Users, 
  Scale, 
  ArrowUpDown, 
  BookOpen 
} from "lucide-react";

const services = [
  {
    icon: Building2,
    title: "College Predictor",
    description: "AI-powered tool to predict your chances of admission in top medical colleges based on your NEET rank.",
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-50"
  },
  {
    icon: TrendingUp,
    title: "Closing Rank",
    description: "Get real-time closing rank data for all medical colleges across India with historical trends.",
    color: "from-orange-500 to-red-500",
    bgColor: "bg-orange-50"
  },
  {
    icon: DollarSign,
    title: "Fee Structure, Bond, Bond Penalty, Stipend",
    description: "Comprehensive fee details, bond information, penalties, and stipend data for informed decisions.",
    color: "from-green-500 to-emerald-500",
    bgColor: "bg-green-50"
  },
  {
    icon: Stethoscope,
    title: "OPD, IPD, Beds, Branch Wise Clinical Details",
    description: "Detailed clinical infrastructure information including OPD, IPD capacity, and department-wise facilities.",
    color: "from-purple-500 to-pink-500",
    bgColor: "bg-purple-50"
  },
  {
    icon: Bell,
    title: "Notification & Events",
    description: "Stay updated with latest admission notifications, important dates, and counselling events.",
    color: "from-yellow-500 to-orange-500",
    bgColor: "bg-yellow-50"
  },
  {
    icon: CheckSquare,
    title: "Customized Choice Filling Guidance",
    description: "Personalized choice filling strategy based on your preferences, rank, and career goals.",
    color: "from-indigo-500 to-purple-500",
    bgColor: "bg-indigo-50"
  },
  {
    icon: Users,
    title: "Counselling Type",
    description: "Expert guidance on different counselling processes - AIQ, State, Deemed, Private, and Management quota.",
    color: "from-teal-500 to-cyan-500",
    bgColor: "bg-teal-50"
  },
  {
    icon: Scale,
    title: "List of Institutes",
    description: "Comprehensive database of all medical colleges with detailed information and comparison tools.",
    color: "from-rose-500 to-pink-500",
    bgColor: "bg-rose-50"
  },
  {
    icon: ArrowUpDown,
    title: "One to One Counselling Guidance",
    description: "Personal counselling sessions with experienced advisors for customized admission strategy.",
    color: "from-emerald-500 to-teal-500",
    bgColor: "bg-emerald-50"
  },
  {
    icon: BookOpen,
    title: "Exclusive Blogs",
    description: "Access to premium content, success stories, and expert insights on medical admissions.",
    color: "from-violet-500 to-purple-500",
    bgColor: "bg-violet-50"
  }
];

export default function ServicesSection() {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Animated Medical Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-blue-50">
        {/* Floating Medical Icons */}
        <div className="absolute top-20 left-10 opacity-10">
          <Stethoscope className="w-16 h-16 text-brand-green animate-pulse" />
        </div>
        <div className="absolute top-40 right-20 opacity-10">
          <GraduationCap className="w-20 h-20 text-brand-navy animate-bounce" />
        </div>
        <div className="absolute bottom-32 left-1/4 opacity-10">
          <BookOpen className="w-14 h-14 text-brand-green animate-pulse" />
        </div>
        <div className="absolute bottom-20 right-1/3 opacity-10">
          <Building2 className="w-18 h-18 text-brand-navy animate-bounce" />
        </div>
        
        {/* Animated Particles */}
        <div className="absolute top-1/4 left-1/3 w-2 h-2 bg-brand-green rounded-full animate-ping"></div>
        <div className="absolute top-3/4 right-1/4 w-3 h-3 bg-brand-navy rounded-full animate-pulse"></div>
        <div className="absolute top-1/2 left-1/5 w-1 h-1 bg-brand-green rounded-full animate-bounce"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-brand-navy mb-6">
            Our <span className="text-brand-green">Services</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto">
            We offer expert counselling and tools to help medical aspirants choose the right college
            and secure admission confidently.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {services.map((service, index) => (
            <GlassCard 
              key={index}
              className={`p-6 text-center hover-lift group transition-all duration-500 hover:scale-105 ${service.bgColor} bg-opacity-30 backdrop-blur-sm border border-white/20`}
            >
              {/* Icon Container */}
              <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-r ${service.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:rotate-6`}>
                <service.icon className="w-8 h-8 text-white" />
              </div>
              
              {/* Content */}
              <h3 className="text-lg font-bold text-brand-navy mb-3 group-hover:text-brand-green transition-colors duration-300 leading-tight">
                {service.title}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {service.description}
              </p>
              
              {/* Hover Glow Effect */}
              <div className={`absolute inset-0 bg-gradient-to-r ${service.color} opacity-0 group-hover:opacity-10 rounded-xl transition-opacity duration-300`}></div>
              
              {/* Bottom Accent */}
              <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${service.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-b-xl`}></div>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}

// Import missing icon
import { GraduationCap } from "lucide-react";