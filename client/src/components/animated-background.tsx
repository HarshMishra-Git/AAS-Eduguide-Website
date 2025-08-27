import { Stethoscope, GraduationCap, BookOpen, Award, Heart, Brain, Microscope, Pill } from "lucide-react";

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Floating Medical Icons */}
      <div className="absolute top-10 left-10 opacity-5 animate-float">
        <Stethoscope className="w-12 h-12 text-brand-green" />
      </div>
      <div className="absolute top-20 right-20 opacity-5 animate-float-delayed">
        <GraduationCap className="w-16 h-16 text-brand-navy" />
      </div>
      <div className="absolute top-1/3 left-1/4 opacity-5 animate-float">
        <BookOpen className="w-10 h-10 text-brand-green" />
      </div>
      <div className="absolute top-1/2 right-1/3 opacity-5 animate-float-delayed">
        <Award className="w-14 h-14 text-brand-navy" />
      </div>
      <div className="absolute bottom-1/3 left-1/5 opacity-5 animate-float">
        <Heart className="w-12 h-12 text-red-500" />
      </div>
      <div className="absolute bottom-20 right-1/4 opacity-5 animate-float-delayed">
        <Brain className="w-13 h-13 text-purple-500" />
      </div>
      <div className="absolute top-2/3 left-1/3 opacity-5 animate-float">
        <Microscope className="w-11 h-11 text-blue-500" />
      </div>
      <div className="absolute bottom-1/4 right-1/5 opacity-5 animate-float-delayed">
        <Pill className="w-9 h-9 text-green-500" />
      </div>

      {/* Animated Particles */}
      <div className="absolute top-1/4 left-1/6 w-2 h-2 bg-brand-green rounded-full opacity-30 animate-ping"></div>
      <div className="absolute top-3/4 right-1/4 w-3 h-3 bg-brand-navy rounded-full opacity-30 animate-pulse"></div>
      <div className="absolute top-1/2 left-1/3 w-1 h-1 bg-brand-green rounded-full opacity-40 animate-bounce"></div>
      <div className="absolute bottom-1/3 right-1/6 w-2 h-2 bg-blue-400 rounded-full opacity-30 animate-ping"></div>
      <div className="absolute top-1/6 right-1/2 w-1 h-1 bg-purple-400 rounded-full opacity-40 animate-pulse"></div>

      {/* Gradient Orbs */}
      <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-gradient-to-r from-blue-200 to-purple-200 rounded-full opacity-10 animate-pulse"></div>
      <div className="absolute bottom-1/4 left-1/4 w-40 h-40 bg-gradient-to-r from-green-200 to-blue-200 rounded-full opacity-10 animate-pulse"></div>
      <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full opacity-10 animate-bounce"></div>

      {/* DNA Helix Animation */}
      <div className="absolute top-1/3 right-1/6 opacity-5">
        <div className="relative w-8 h-32">
          <div className="absolute top-0 left-0 w-2 h-2 bg-brand-green rounded-full animate-dna-1"></div>
          <div className="absolute top-4 right-0 w-2 h-2 bg-brand-navy rounded-full animate-dna-2"></div>
          <div className="absolute top-8 left-0 w-2 h-2 bg-brand-green rounded-full animate-dna-1"></div>
          <div className="absolute top-12 right-0 w-2 h-2 bg-brand-navy rounded-full animate-dna-2"></div>
          <div className="absolute top-16 left-0 w-2 h-2 bg-brand-green rounded-full animate-dna-1"></div>
          <div className="absolute top-20 right-0 w-2 h-2 bg-brand-navy rounded-full animate-dna-2"></div>
          <div className="absolute top-24 left-0 w-2 h-2 bg-brand-green rounded-full animate-dna-1"></div>
          <div className="absolute top-28 right-0 w-2 h-2 bg-brand-navy rounded-full animate-dna-2"></div>
        </div>
      </div>

      {/* Medical Cross Animation */}
      <div className="absolute bottom-1/6 left-1/6 opacity-5 animate-spin-slow">
        <div className="relative w-8 h-8">
          <div className="absolute top-0 left-1/2 w-1 h-8 bg-red-400 transform -translate-x-1/2"></div>
          <div className="absolute top-1/2 left-0 w-8 h-1 bg-red-400 transform -translate-y-1/2"></div>
        </div>
      </div>
    </div>
  );
}