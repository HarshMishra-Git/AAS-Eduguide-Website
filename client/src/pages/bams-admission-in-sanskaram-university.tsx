import { useEffect } from "react";
import SanskaramNavigation from "@/components/sanskaram-navigation";
import Footer from "@/components/footer";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { GlassCard } from "@/components/ui/glass-card";
import { CheckCircle, Star, Users, Award, BookOpen, Stethoscope, GraduationCap, Heart, TrendingUp, Phone } from "lucide-react";

const formSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  state: z.string().min(1, "Please select your state"),
  message: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

function BAMSSanskaramContactForm() {
  const { toast } = useToast();
  const [, navigate] = useLocation();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      state: "",
      message: "",
    },
  });

  const createAdmissionMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.fullName,
          email: data.email,
          phone: data.phone,
          exam: "BAMS",
          preferredState: data.state,
          message: data.message,
          source: "bams_sanskaram_university"
        }),
      });
      if (!response.ok) throw new Error("Failed to submit");
      return response.json();
    },
    onSuccess: (result) => {
      console.log('Form submitted successfully:', result);
      form.reset();
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

  const onSubmit = (data: FormData) => {
    createAdmissionMutation.mutate(data);
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

        <FormField
          control={form.control}
          name="state"
          render={({ field }) => (
            <FormItem>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-white/80 backdrop-blur-sm">
                    <SelectValue placeholder="Select Your State" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="uttar-pradesh">Uttar Pradesh</SelectItem>
                  <SelectItem value="bihar">Bihar</SelectItem>
                  <SelectItem value="madhya-pradesh">Madhya Pradesh</SelectItem>
                  <SelectItem value="rajasthan">Rajasthan</SelectItem>
                  <SelectItem value="haryana">Haryana</SelectItem>
                  <SelectItem value="punjab">Punjab</SelectItem>
                  <SelectItem value="delhi">Delhi</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea 
                  placeholder="Tell us about your BAMS admission goals in Sanskaram University..."
                  className="bg-white/80 backdrop-blur-sm min-h-[100px]"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button 
            type="submit"
            className="btn-primary py-3 font-medium"
            disabled={createAdmissionMutation.isPending}
          >
            {createAdmissionMutation.isPending ? "Sending..." : "Get Free BAMS Counseling"}
          </Button>
          
          <Button 
            type="button"
            onClick={() => window.open("https://api.whatsapp.com/send/?phone=%2B917752944476&text=Hi, I want to know about BAMS admission in Sanskaram University&type=phone_number&app_absent=0", "_blank")}
            variant="outline"
            className="border-brand-green text-brand-green hover:bg-brand-green hover:text-white py-3 font-medium"
          >
            WhatsApp Now
          </Button>
        </div>
        
        <p className="text-sm text-gray-600 text-center">
          Our BAMS experts will contact you within 15 minutes
        </p>
      </form>
    </Form>
  );
}

export default function BAMSAdmissionInSanskaramUniversityPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const openWhatsApp = () => {
    window.open("https://api.whatsapp.com/send/?phone=%2B917752944476&text&type=phone_number&app_absent=0", "_blank");
  };

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Hero Section with Sanskaram University Background */}
      <div 
        className="relative min-h-screen bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/sanskaram-campus.png')`
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-brand-navy/50 to-brand-green/40"></div>
        
        <div className="relative z-10">
          <SanskaramNavigation />
          
          {/* Centered Hero Content */}
          <section className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Hero Content - Left Side */}
                <div className="text-center lg:text-left text-white">
                  {/* Content Backdrop */}
                  <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-8 border border-white/20 space-y-8">
                    <div className="space-y-6">
                      <h1 className="text-5xl md:text-7xl font-bold leading-tight" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.8)'}}>
                        <span className="block text-white">BAMS Admission in</span>
                        <span className="block text-brand-light-green" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.8)'}}>Sanskaram</span>
                        <span className="block text-brand-light-green" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.8)'}}>University</span>
                      </h1>
                      <p className="text-xl md:text-2xl font-medium text-white" style={{textShadow: '1px 1px 2px rgba(0,0,0,0.8)'}}>
                        through AAS Eduguide
                      </p>
                    </div>
                    
                    <p className="text-lg md:text-xl leading-relaxed text-white max-w-2xl" style={{textShadow: '1px 1px 2px rgba(0,0,0,0.6)'}}>
                      Secure your BAMS seat in Sanskaram University with expert guidance from AAS Eduguide Pvt. Ltd. 
                      Get personalized counseling and admission support from India's most trusted medical education consultants.
                    </p>
                    
                    {/* Key Benefits Grid */}
                    <div className="grid grid-cols-2 gap-4 text-sm md:text-base">
                      <div className="flex items-center space-x-2 bg-white/10 rounded-lg p-3">
                        <CheckCircle className="w-5 h-5 text-brand-light-green flex-shrink-0" />
                        <span className="text-white font-medium" style={{textShadow: '1px 1px 2px rgba(0,0,0,0.6)'}}>13+ Years Experience</span>
                      </div>
                      <div className="flex items-center space-x-2 bg-white/10 rounded-lg p-3">
                        <CheckCircle className="w-5 h-5 text-brand-light-green flex-shrink-0" />
                        <span className="text-white font-medium" style={{textShadow: '1px 1px 2px rgba(0,0,0,0.6)'}}>2L+ Students Guided</span>
                      </div>
                      <div className="flex items-center space-x-2 bg-white/10 rounded-lg p-3">
                        <CheckCircle className="w-5 h-5 text-brand-light-green flex-shrink-0" />
                        <span className="text-white font-medium" style={{textShadow: '1px 1px 2px rgba(0,0,0,0.6)'}}>95% Success Rate</span>
                      </div>
                      <div className="flex items-center space-x-2 bg-white/10 rounded-lg p-3">
                        <CheckCircle className="w-5 h-5 text-brand-light-green flex-shrink-0" />
                        <span className="text-white font-medium" style={{textShadow: '1px 1px 2px rgba(0,0,0,0.6)'}}>24×7 Support</span>
                      </div>
                    </div>

                    {/* CTA Buttons */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Button 
                        onClick={() => window.location.href = "tel:+917752944476"}
                        className="bg-brand-green hover:bg-brand-light-green text-white px-4 py-3 font-semibold shadow-xl transition-all border-2 border-brand-green"
                      >
                        <Phone className="w-4 h-4 mr-2" />
                        Call Now
                      </Button>
                      <Button 
                        onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })}
                        variant="outline"
                        className="border-2 border-white bg-white/20 text-white hover:bg-white hover:text-brand-navy px-4 py-3 font-semibold backdrop-blur-sm shadow-xl"
                      >
                        Fill Contact Form
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Contact Form - Right Side */}
                <div className="" id="contact-form">
                  <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-2xl">
                    <div className="text-center mb-6">
                      <h2 className="text-2xl md:text-3xl font-bold text-brand-navy mb-2">
                        BAMS Admission in Sanskaram University
                      </h2>
                      <p className="text-gray-600">Get expert guidance for your admission</p>
                    </div>
                    <BAMSSanskaramContactForm />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* About Sanskaram University */}
      <section id="about-sanskaram" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-brand-navy mb-6">
              About Sanskaram University
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Sanskaram University is a premier institution offering quality BAMS education with modern facilities, 
              experienced faculty, and excellent placement opportunities in the Ayurvedic healthcare sector.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <GlassCard className="p-6 text-center hover-lift">
              <div className="w-16 h-16 bg-brand-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Stethoscope className="w-8 h-8 text-brand-green" />
              </div>
              <h3 className="text-xl font-semibold text-brand-navy mb-3">Quality Education</h3>
              <p className="text-gray-600 leading-relaxed">
                Comprehensive BAMS curriculum with modern teaching methods and traditional Ayurvedic knowledge.
              </p>
            </GlassCard>
            
            <GlassCard className="p-6 text-center hover-lift">
              <div className="w-16 h-16 bg-brand-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-brand-green" />
              </div>
              <h3 className="text-xl font-semibold text-brand-navy mb-3">Modern Facilities</h3>
              <p className="text-gray-600 leading-relaxed">
                State-of-the-art laboratories, well-equipped library, and modern campus infrastructure.
              </p>
            </GlassCard>
            
            <GlassCard className="p-6 text-center hover-lift">
              <div className="w-16 h-16 bg-brand-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <GraduationCap className="w-8 h-8 text-brand-green" />
              </div>
              <h3 className="text-xl font-semibold text-brand-navy mb-3">Career Support</h3>
              <p className="text-gray-600 leading-relaxed">
                Excellent placement assistance and career guidance for successful Ayurvedic practice.
              </p>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* BAMS Admission Process */}
      <section id="admission-process" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-brand-navy mb-6">
              BAMS Admission Process in Sanskaram University
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Follow these simple steps to secure your BAMS seat in Sanskaram University with AAS Eduguide's expert guidance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-brand-green rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-semibold text-brand-navy mb-3">NEET Qualification</h3>
              <p className="text-gray-600">Qualify NEET with minimum required percentile for BAMS eligibility in Sanskaram University</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-brand-green rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-semibold text-brand-navy mb-3">Counseling Registration</h3>
              <p className="text-gray-600">Register for UP NEET counseling and complete document verification process</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-brand-green rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-semibold text-brand-navy mb-3">Choice Filling</h3>
              <p className="text-gray-600">Strategic choice filling with AAS Eduguide's expert guidance for optimal results</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-brand-green rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">4</span>
              </div>
              <h3 className="text-xl font-semibold text-brand-navy mb-3">Seat Allotment</h3>
              <p className="text-gray-600">Secure admission in Sanskaram University BAMS program through proper guidance</p>
            </div>
          </div>

          <div className="mt-16 bg-gray-50 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-brand-navy mb-6 text-center">Required Documents for BAMS Admission</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-brand-navy mb-3">Academic Documents:</h4>
                <ul className="space-y-2 text-gray-600">
                  <li>• NEET Scorecard & Rank Letter</li>
                  <li>• Class 10th & 12th Marksheets</li>
                  <li>• Class 10th & 12th Certificates</li>
                  <li>• Character Certificate</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-brand-navy mb-3">Personal Documents:</h4>
                <ul className="space-y-2 text-gray-600">
                  <li>• Aadhar Card</li>
                  <li>• Domicile Certificate</li>
                  <li>• Category Certificate (if applicable)</li>
                  <li>• Passport Size Photographs</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose AAS Eduguide */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-brand-navy mb-6">
              Why Choose AAS Eduguide for Sanskaram University BAMS Admission?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We have a proven track record of successful BAMS admissions with personalized guidance and expert counseling.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <GlassCard className="p-6 text-center hover-lift">
              <div className="w-16 h-16 bg-brand-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-brand-green" />
              </div>
              <h3 className="text-xl font-semibold text-brand-navy mb-3">Expert Guidance</h3>
              <p className="text-gray-600 leading-relaxed">
                13+ years of experience in medical admissions with specialized knowledge of BAMS counseling process.
              </p>
            </GlassCard>
            
            <GlassCard className="p-6 text-center hover-lift">
              <div className="w-16 h-16 bg-brand-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-brand-green" />
              </div>
              <h3 className="text-xl font-semibold text-brand-navy mb-3">Personalized Support</h3>
              <p className="text-gray-600 leading-relaxed">
                One-on-one counseling sessions tailored to your NEET score and career goals in Ayurveda.
              </p>
            </GlassCard>
            
            <GlassCard className="p-6 text-center hover-lift">
              <div className="w-16 h-16 bg-brand-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-brand-green" />
              </div>
              <h3 className="text-xl font-semibold text-brand-navy mb-3">Proven Success</h3>
              <p className="text-gray-600 leading-relaxed">
                95% success rate with 2L+ students successfully placed in top medical colleges across India.
              </p>
            </GlassCard>
            
            <GlassCard className="p-6 text-center hover-lift">
              <div className="w-16 h-16 bg-brand-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-brand-green" />
              </div>
              <h3 className="text-xl font-semibold text-brand-navy mb-3">24×7 Support</h3>
              <p className="text-gray-600 leading-relaxed">
                Round-the-clock support during counseling periods with dedicated admission experts.
              </p>
            </GlassCard>
            
            <GlassCard className="p-6 text-center hover-lift">
              <div className="w-16 h-16 bg-brand-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-brand-green" />
              </div>
              <h3 className="text-xl font-semibold text-brand-navy mb-3">Transparent Process</h3>
              <p className="text-gray-600 leading-relaxed">
                Clear, honest guidance with no hidden charges and complete transparency in counseling.
              </p>
            </GlassCard>
            
            <GlassCard className="p-6 text-center hover-lift">
              <div className="w-16 h-16 bg-brand-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-brand-green" />
              </div>
              <h3 className="text-xl font-semibold text-brand-navy mb-3">Complete Information</h3>
              <p className="text-gray-600 leading-relaxed">
                Comprehensive details about Sanskaram University including fees, facilities, and placement records.
              </p>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-brand-navy text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Secure Your BAMS Seat in Sanskaram University?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Don't miss the opportunity! Get expert guidance from AAS Eduguide and secure your admission in Sanskaram University's BAMS program.
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
  );
}