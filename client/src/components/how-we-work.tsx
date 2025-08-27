import { GlassCard } from "@/components/ui/glass-card";
import { Monitor, Lightbulb, DollarSign, FileCheck, GraduationCap, Award } from "lucide-react";

const steps = [
  {
    id: "01",
    icon: Monitor,
    title: "Entrance Exam",
    description: "Take the relevant medical entrance exam (NEET, AIIMS, JIPMER) with qualifying scores.",
    color: "from-blue-500 to-cyan-500"
  },
  {
    id: "02",
    icon: Award,
    title: "College Selection",
    description: "Research and shortlist medical colleges based on your rank, location preferences, and budget.",
    color: "from-purple-500 to-pink-500"
  },
  {
    id: "03",
    icon: Lightbulb,
    title: "Counselling Process",
    description: "Register and participate in centralized or state-level counselling processes.",
    color: "from-orange-500 to-red-500"
  },
  {
    id: "04",
    icon: FileCheck,
    title: "Document Verification",
    description: "Submit and verify all required documents at the allotted medical college.",
    color: "from-green-500 to-emerald-500"
  },
  {
    id: "05",
    icon: DollarSign,
    title: "Fee Payment",
    description: "Pay the required fees to confirm your admission at the medical college.",
    color: "from-yellow-500 to-orange-500"
  },
  {
    id: "06",
    icon: GraduationCap,
    title: "Final Admission",
    description: "Complete the final registration process and begin your medical education journey.",
    color: "from-indigo-500 to-purple-500"
  }
];

export default function HowWeWork() {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-green-50">
        <div className="absolute top-10 left-10 w-32 h-32 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-green-200 rounded-full opacity-20 animate-bounce"></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-purple-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-40 right-1/3 w-28 h-28 bg-orange-200 rounded-full opacity-20 animate-bounce"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-brand-navy mb-6">
            Medical College <span className="text-brand-green">Admission Process</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto">
            Understanding the admission process is crucial for securing a seat in your desired medical college.
            Follow these steps to navigate through the process smoothly.
          </p>
        </div>

        <div className="relative">
          {/* Animated Connecting Line with Flowing Dots */}
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 transform -translate-y-1/2 hidden lg:block opacity-30 overflow-hidden">
            <div className="absolute top-0 left-0 w-4 h-1 bg-white rounded-full animate-flow-right opacity-80"></div>
            <div className="absolute top-0 left-0 w-2 h-1 bg-yellow-400 rounded-full animate-flow-right-delayed opacity-60"></div>
          </div>
          
          {/* Floating Medical Elements */}
          <div className="absolute top-10 left-10 opacity-20 animate-float-slow">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"></div>
          </div>
          <div className="absolute top-20 right-20 opacity-20 animate-float-reverse">
            <div className="w-6 h-6 bg-gradient-to-r from-green-400 to-blue-400 rounded-full"></div>
          </div>
          <div className="absolute bottom-20 left-1/4 opacity-20 animate-bounce-slow">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <GlassCard 
                key={step.id} 
                className="p-8 text-center hover-lift relative group transition-all duration-500 hover:scale-105 mt-6"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                {/* Animated Background Particles */}
                <div className="absolute top-2 right-2 w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-ping opacity-40"></div>
                <div className="absolute bottom-4 left-4 w-1 h-1 bg-gradient-to-r from-green-400 to-blue-400 rounded-full animate-pulse opacity-60"></div>
                
                {/* Step Number with Pulse Animation */}
                <div className={`absolute -top-6 -right-6 w-12 h-12 bg-gradient-to-r ${step.color} rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg animate-pulse-slow z-10`}>
                  {step.id}
                </div>
                
                {/* Icon with Rotation Animation */}
                <div className={`w-20 h-20 mx-auto mb-6 bg-gradient-to-r ${step.color} rounded-full flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:animate-spin-once relative`}>
                  <step.icon className="w-10 h-10 text-white" />
                  {/* Orbiting Dot */}
                  <div className="absolute top-1 right-1 w-2 h-2 bg-white rounded-full animate-orbit opacity-80"></div>
                </div>
                
                {/* Content */}
                <h3 className="text-xl font-bold text-brand-navy mb-4 group-hover:text-brand-green transition-colors duration-300">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>
                
                {/* Animated Progress Bar */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200 overflow-hidden">
                  <div className={`h-full bg-gradient-to-r ${step.color} transform -translate-x-full group-hover:translate-x-0 transition-transform duration-1000`}></div>
                </div>
                
                {/* Hover Effect */}
                <div className={`absolute inset-0 bg-gradient-to-r ${step.color} opacity-0 group-hover:opacity-5 rounded-xl transition-opacity duration-300`}></div>
                
                {/* Ripple Effect on Hover */}
                <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className={`absolute top-1/2 left-1/2 w-0 h-0 bg-gradient-to-r ${step.color} rounded-full group-hover:w-full group-hover:h-full transform -translate-x-1/2 -translate-y-1/2 transition-all duration-700 opacity-10`}></div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}