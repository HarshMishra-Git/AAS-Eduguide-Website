import { useEffect } from "react";
import BAMSNavigation from "@/components/bams-navigation";
import Footer from "@/components/footer";
import AnimatedBackground from "@/components/animated-background";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { insertBamsAdmissionSchema, type InsertBamsAdmission } from "@shared/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { GlassCard } from "@/components/ui/glass-card";
import { CheckCircle, Star, Users, Award, BookOpen, Stethoscope, GraduationCap, Heart, TrendingUp, Phone } from "lucide-react";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";

function TrustBadge({ value, label, icon: Icon }: { value: string; label: string; icon: any }) {
  const { isIntersecting, ref } = useIntersectionObserver({
    threshold: 0.5,
    freezeOnceVisible: true,
  });

  return (
    <GlassCard className="p-6 text-center hover-lift" ref={ref}>
      <div className="flex items-center justify-center mb-3">
        <Icon className="w-8 h-8 text-brand-green" />
      </div>
      <div className="text-2xl font-bold text-brand-green animate-counter" data-testid={`stat-${label.toLowerCase().replace(/\s+/g, '-')}`}>
        {isIntersecting ? value : "0"}
      </div>
      <div className="text-sm text-gray-600">{label}</div>
    </GlassCard>
  );
}

function FeatureCard({ icon: Icon, title, description }: { icon: any; title: string; description: string }) {
  return (
    <GlassCard className="p-6 text-center hover-lift">
      <div className="w-16 h-16 bg-brand-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
        <Icon className="w-8 h-8 text-brand-green" />
      </div>
      <h3 className="text-xl font-semibold text-brand-navy mb-3">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </GlassCard>
  );
}

function TestimonialCard({ name, college, text, rating }: { name: string; college: string; text: string; rating: number }) {
  return (
    <GlassCard className="p-6">
      <div className="flex items-center mb-4">
        {[...Array(rating)].map((_, i) => (
          <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
        ))}
      </div>
      <p className="text-gray-700 mb-4 italic">"{text}"</p>
      <div>
        <div className="font-semibold text-brand-navy">{name}</div>
        <div className="text-sm text-gray-600">{college}</div>
      </div>
    </GlassCard>
  );
}

function BAMSContactForm() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, navigate] = useLocation();

  const form = useForm<InsertBamsAdmission>({
    resolver: zodResolver(insertBamsAdmissionSchema.extend({
      fullName: insertBamsAdmissionSchema.shape.fullName.min(2, "Full name must be at least 2 characters"),
      email: insertBamsAdmissionSchema.shape.email.email("Please enter a valid email"),
      phone: insertBamsAdmissionSchema.shape.phone.min(10, "Phone number must be at least 10 digits"),
      neetScore: insertBamsAdmissionSchema.shape.neetScore.min(1, "NEET Score is required"),
      neetRank: insertBamsAdmissionSchema.shape.neetRank.min(1, "NEET Rank is required"),
    })),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      category: "general",
      domicileState: "uttar-pradesh",
      counselingType: "state",
      neetScore: undefined,
      neetRank: undefined,
      message: "",
    },
  });

  const createBamsAdmissionMutation = useMutation({
    mutationFn: (data: InsertBamsAdmission) => apiRequest("POST", "/api/bams-admissions", data),
    onSuccess: () => {
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/bams-admissions"] });
      navigate('/thank-you');
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to send your message. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertBamsAdmission) => {
    createBamsAdmissionMutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input 
                  placeholder="Full Name" 
                  className="bg-white/80 backdrop-blur-sm"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input 
                    type="email"
                    placeholder="Email Address" 
                    className="bg-white/80 backdrop-blur-sm"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input 
                    type="tel"
                    placeholder="Phone Number" 
                    className="bg-white/80 backdrop-blur-sm"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="neetScore"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input 
                    type="number"
                    placeholder="NEET Score" 
                    className="bg-white/80 backdrop-blur-sm"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="neetRank"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input 
                    type="number"
                    placeholder="NEET Rank" 
                    className="bg-white/80 backdrop-blur-sm"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea 
                  placeholder="Tell us about your BAMS admission goals and any specific questions..."
                  className="bg-white/80 backdrop-blur-sm min-h-[100px]"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button 
          type="submit"
          className="w-full btn-primary py-3 font-medium"
          disabled={createBamsAdmissionMutation.isPending}
        >
          {createBamsAdmissionMutation.isPending ? "Sending..." : "Get Free BAMS Counseling"}
        </Button>
        
        <p className="text-sm text-gray-600 text-center">
          Our BAMS experts will contact you within 15 minutes
        </p>
      </form>
    </Form>
  );
}

export default function BAMSAdmissionsPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const openWhatsApp = () => {
    window.open("https://api.whatsapp.com/send/?phone=%2B917752944476&text&type=phone_number&app_absent=0", "_blank");
  };

  return (
    <div className="min-h-screen bg-gray-50 relative">
      <AnimatedBackground />
      <div className="relative z-10">
        <BAMSNavigation />
        
        {/* Hero Section with Contact Form */}
        <section className="py-20 lg:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Contact Form - Prominent Display - Shows first on mobile */}
              <div className="animate-fade-up order-1 lg:order-2" style={{animationDelay: '0.8s'}} id="contact-form">
                <GlassCard className="p-8">
                  <h2 className="text-2xl font-bold text-brand-navy mb-6 text-center">
                    Get Free BAMS Counseling
                  </h2>
                  <BAMSContactForm />
                </GlassCard>
              </div>

              {/* Hero Content - Shows second on mobile */}
              <div className="text-center lg:text-left order-2 lg:order-1">
                <h1 className="text-4xl md:text-6xl font-bold text-brand-navy mb-6 animate-fade-up">
                  Get BAMS Admissions in Top Colleges in UP
                  <span className="block text-brand-green">Secure Your Future</span>
                </h1>
                <p className="text-xl text-gray-600 mb-8 leading-relaxed animate-fade-up" style={{animationDelay: '0.2s'}}>
                  Expert guidance for Bachelor of Ayurvedic Medicine and Surgery (BAMS) admissions in Uttar Pradesh. 
                  Get personalized counseling from India's most trusted medical admission consultants.
                </p>
                
                {/* Key Benefits */}
                <div className="grid grid-cols-2 gap-4 mb-8 animate-fade-up" style={{animationDelay: '0.4s'}}>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-brand-green mr-2" />
                    <span className="text-gray-700">13+ Years Experience</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-brand-green mr-2" />
                    <span className="text-gray-700">2L+ Students Guided</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-brand-green mr-2" />
                    <span className="text-gray-700">95% Success Rate</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-brand-green mr-2" />
                    <span className="text-gray-700">24×7 Support</span>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 animate-fade-up" style={{animationDelay: '0.6s'}}>
                  <Button 
                    onClick={openWhatsApp}
                    className="btn-primary px-8 py-3 font-medium"
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Get Instant Guidance
                  </Button>
                  <Button 
                    onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })}
                    variant="outline"
                    className="border-brand-green text-brand-green hover:bg-brand-green hover:text-white px-8 py-3 font-medium"
                  >
                    Fill Contact Form
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Indicators */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-brand-navy mb-4">
                Trusted by Thousands of BAMS Aspirants
              </h2>
              <p className="text-xl text-gray-600">
                Join the success stories of students who achieved their BAMS dreams with our guidance
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <TrustBadge value="2L+" label="BAMS Students Guided" icon={Users} />
              <TrustBadge value="95%" label="Success Rate" icon={TrendingUp} />
              <TrustBadge value="13+" label="Years Experience" icon={Award} />
              <TrustBadge value="24×7" label="Expert Support" icon={Heart} />
            </div>
          </div>
        </section>

        {/* BAMS Overview */}
        <section className="py-20" id="bams-info">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-brand-navy mb-6">
                Why Choose BAMS in Uttar Pradesh?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Uttar Pradesh offers excellent opportunities for BAMS education with top-quality colleges, 
                experienced faculty, and strong placement records in the Ayurvedic healthcare sector.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard 
                icon={Stethoscope}
                title="Top BAMS Colleges"
                description="Access to premier Ayurvedic medical colleges in UP with excellent infrastructure and experienced faculty members."
              />
              <FeatureCard 
                icon={BookOpen}
                title="Comprehensive Curriculum"
                description="5.5-year integrated program covering traditional Ayurvedic medicine with modern medical knowledge and practices."
              />
              <FeatureCard 
                icon={GraduationCap}
                title="Career Opportunities"
                description="Diverse career paths including clinical practice, research, teaching, pharmaceutical industry, and wellness centers."
              />
            </div>
          </div>
        </section>

        {/* BAMS Admission Process */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-brand-navy mb-6">
                BAMS Admission Process in UP
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Navigate the BAMS admission process with our expert guidance and secure your seat in top colleges.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-brand-green rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">1</span>
                </div>
                <h3 className="text-xl font-semibold text-brand-navy mb-3">NEET Qualification</h3>
                <p className="text-gray-600">Qualify NEET with minimum required percentile for BAMS eligibility</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-brand-green rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">2</span>
                </div>
                <h3 className="text-xl font-semibold text-brand-navy mb-3">Counseling Registration</h3>
                <p className="text-gray-600">Register for UP NEET counseling and document verification process</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-brand-green rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">3</span>
                </div>
                <h3 className="text-xl font-semibold text-brand-navy mb-3">Choice Filling</h3>
                <p className="text-gray-600">Strategic choice filling with our expert guidance for optimal results</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-brand-green rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">4</span>
                </div>
                <h3 className="text-xl font-semibold text-brand-navy mb-3">Seat Allotment</h3>
                <p className="text-gray-600">Secure admission in your preferred BAMS college through proper guidance</p>
              </div>
            </div>
          </div>
        </section>

        {/* Success Stories */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-brand-navy mb-6">
                BAMS Success Stories
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Hear from our successful BAMS students who achieved their dreams with our expert guidance.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <TestimonialCard 
                name="Priya Sharma"
                college="Government Ayurvedic College, Lucknow"
                text="AAS Eduguide helped me secure admission in my dream BAMS college. Their guidance was invaluable throughout the counseling process."
                rating={5}
              />
              <TestimonialCard 
                name="Rahul Verma"
                college="Rishikul Campus, Haridwar"
                text="The expert counseling and choice filling strategy helped me get into a top BAMS college. Highly recommended for all BAMS aspirants."
                rating={5}
              />
              <TestimonialCard 
                name="Anjali Singh"
                college="Ayurvedic College, Gorakhpur"
                text="Professional guidance and 24x7 support made my BAMS admission journey smooth and successful. Thank you AAS Eduguide!"
                rating={5}
              />
            </div>
          </div>
        </section>

        {/* Why Choose Us for BAMS */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-brand-navy mb-6">
                Why Choose AAS Eduguide for BAMS Admissions?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Specialized expertise in BAMS admissions with proven track record and personalized guidance.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard 
                icon={Award}
                title="BAMS Specialization"
                description="Dedicated expertise in Ayurvedic medical admissions with deep understanding of BAMS counseling process."
              />
              <FeatureCard 
                icon={Users}
                title="Personalized Guidance"
                description="One-on-one counseling sessions tailored to your NEET score, preferences, and career goals in Ayurveda."
              />
              <FeatureCard 
                icon={BookOpen}
                title="Complete Information"
                description="Comprehensive database of BAMS colleges in UP with fee structure, facilities, and placement records."
              />
              <FeatureCard 
                icon={TrendingUp}
                title="Proven Success"
                description="95% success rate in BAMS admissions with thousands of satisfied students across India."
              />
              <FeatureCard 
                icon={Heart}
                title="24×7 Support"
                description="Round-the-clock support during counseling periods with dedicated BAMS admission experts."
              />
              <FeatureCard 
                icon={CheckCircle}
                title="Transparent Process"
                description="Clear, honest guidance with no hidden charges and complete transparency in our counseling process."
              />
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-20 bg-brand-navy text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Start Your BAMS Journey?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Don't wait! BAMS counseling deadlines are approaching. Get expert guidance now and secure your admission in top Ayurvedic colleges in UP.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={openWhatsApp}
                className="bg-brand-green hover:bg-brand-light-green text-white px-8 py-3 font-medium"
              >
                <Phone className="w-4 h-4 mr-2" />
                Call Now: +91-7752944476
              </Button>
              <Button 
                onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })}
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-brand-navy px-8 py-3 font-medium"
              >
                Get Free Counseling
              </Button>
            </div>
            
            <div className="mt-8 text-sm opacity-75">
              <p>📞 Available 24×7 | 📧 alladmission1@gmail.com | 🏢 Kanpur, UP</p>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
}