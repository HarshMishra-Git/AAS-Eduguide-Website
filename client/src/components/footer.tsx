import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { insertNewsletterSchema, type InsertNewsletter } from "@shared/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Facebook, Instagram, Linkedin, Twitter, Youtube } from "lucide-react";
// import logoUrl from "@assets/AASLOGO.png";

export default function Footer() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<InsertNewsletter>({
    resolver: zodResolver(insertNewsletterSchema.extend({
      email: insertNewsletterSchema.shape.email.email("Please enter a valid email"),
    })),
    defaultValues: {
      email: "",
    },
  });

  const subscribeNewsletterMutation = useMutation({
    mutationFn: (data: InsertNewsletter) => apiRequest("POST", "/api/newsletter", data),
    onSuccess: () => {
      toast({
        title: "Subscribed!",
        description: "Thank you for subscribing to our newsletter!",
      });
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/newsletter"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to subscribe. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertNewsletter) => {
    subscribeNewsletterMutation.mutate(data);
  };

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="bg-brand-navy text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* About */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              {/* <img 
                src={logoUrl} 
                alt="AAS Eduguide Logo" 
                className="w-12 h-12 rounded-full object-cover bg-white p-1"
              /> */}
              <div className="flex flex-col">
                <span className="text-2xl font-bold" data-testid="text-footer-logo">AAS Eduguide Pvt. Ltd.</span>
                <span className="text-sm text-gray-300">All Admission Services</span>
              </div>
            </div>
            <p className="text-gray-300 leading-relaxed mb-6" data-testid="text-footer-description">
              Premier medical admissions counseling with 13+ years of experience. Dedicated exclusively to NEET UG/PG, DNB, and INI-CET guidance across India.
            </p>
            {/* <div className="text-gray-300 text-sm space-y-1">
              <div>📧 alladmission1@gmail.com</div>
              <div>📞 +91-8565001261</div>
              <div>📍 117/H-1/377, Pandu Nagar, near Agra Sweet House, Kakadeo, Kanpur, UP 208005</div>
              <div>🕐 Mon-Sat: 10 AM - 6 PM | Sun: 11 AM - 5 PM</div>
            </div> */}
            <button 
              className="text-brand-green hover:text-brand-light-green transition-colors"
              data-testid="link-md-message"
            >
              Read Message from MD →
            </button>
          </div>
          
          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4" data-testid="text-services-heading">Services</h4>
            <ul className="space-y-2 text-gray-300">
              <li>
                <button 
                  onClick={() => scrollToSection("services")} 
                  className="hover:text-brand-green transition-colors"
                  data-testid="link-neet-pg-counseling"
                >
                  NEET PG Counseling
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection("services")} 
                  className="hover:text-brand-green transition-colors"
                  data-testid="link-neet-ug-counseling"
                >
                  NEET UG Counseling
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection("services")} 
                  className="hover:text-brand-green transition-colors"
                  data-testid="link-dnb-guidance"
                >
                  DNB Guidance
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection("services")} 
                  className="hover:text-brand-green transition-colors"
                  data-testid="link-ini-cet-support"
                >
                  INI-CET Support
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection("services")} 
                  className="hover:text-brand-green transition-colors"
                  data-testid="link-choice-filling"
                >
                  Choice Filling
                </button>
              </li>
            </ul>
          </div>
          
          {/* Packages */}
          <div>
            <h4 className="text-lg font-semibold mb-4" data-testid="text-packages-heading">Packages</h4>
            <ul className="space-y-2 text-gray-300">
              <li>
                <button 
                  onClick={() => scrollToSection("pg-packages")} 
                  className="hover:text-brand-green transition-colors"
                  data-testid="link-pg-packages"
                >
                  PG Packages
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection("ug-packages")} 
                  className="hover:text-brand-green transition-colors"
                  data-testid="link-ug-packages"
                >
                  UG Packages
                </button>
              </li>
              {/* <li>
                <button 
                  className="hover:text-brand-green transition-colors"
                  data-testid="link-compare-packages"
                >
                  Compare Packages
                </button>
              </li> */}
              {/* <li>
                <button 
                  className="hover:text-brand-green transition-colors"
                  data-testid="link-package-calculator"
                >
                  Package Calculator
                </button>
              </li> */}
              <li>
                <button 
                  className="hover:text-brand-green transition-colors"
                  data-testid="link-refund-policy"
                >
                  Refund Policy
                </button>
              </li>
            </ul>
          </div>
          
          {/* Resources */}
          <div>
            <h4 className="text-lg font-semibold mb-4" data-testid="text-resources-heading">Resources</h4>
            <ul className="space-y-2 text-gray-300">
              <li>
                <button 
                  className="hover:text-brand-green transition-colors"
                  data-testid="link-faqs"
                >
                  FAQs
                </button>
              </li>
              {/* <li>
                <button 
                  className="hover:text-brand-green transition-colors"
                  data-testid="link-counseling-calendar"
                >
                  Counseling Calendar
                </button>
              </li> */}
              <li>
                <button 
                  className="hover:text-brand-green transition-colors"
                  data-testid="link-documents-checklist"
                >
                  Documents Checklist
                </button>
              </li>
              {/* <li>
                <button 
                  className="hover:text-brand-green transition-colors"
                  data-testid="link-refund-tracker"
                >
                  Refund Tracker
                </button>
              </li> */}
              <li>
                <button 
                  className="hover:text-brand-green transition-colors"
                  data-testid="link-blog-updates"
                >
                  Blog & Updates
                </button>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Newsletter */}
        <div className="mt-12 pt-8 border-t border-gray-700">
          <div className="max-w-md">
            <h4 className="text-lg font-semibold mb-4" data-testid="text-newsletter-heading">Stay Updated</h4>
            <p className="text-gray-300 mb-4" data-testid="text-newsletter-description">
              Get the latest counseling alerts and admission updates.
            </p>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="flex space-x-3">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input 
                          type="email"
                          placeholder="Enter your email" 
                          className="bg-white/10 border-gray-600 text-white placeholder:text-gray-400"
                          data-testid="input-newsletter-email"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button 
                  type="submit"
                  className="btn-primary px-6 py-2 font-medium"
                  disabled={subscribeNewsletterMutation.isPending}
                  data-testid="button-subscribe"
                >
                  {subscribeNewsletterMutation.isPending ? "..." : "Subscribe"}
                </Button>
              </form>
            </Form>
          </div>
        </div>
        
        {/* Social & Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center">
          <div className="flex space-x-6 mb-4 md:mb-0">
            <a 
              href="https://www.linkedin.com/company/all-admission-services-kanpur/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-brand-green transition-colors" 
              data-testid="link-linkedin"
            >
              <Linkedin className="w-6 h-6" />
            </a>
            <a 
              href="https://www.instagram.com/all_admission_services/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-brand-green transition-colors" 
              data-testid="link-instagram"
            >
              <Instagram className="w-6 h-6" />
            </a>
            <a 
              href="https://www.youtube.com/channel/UC4xmnaXpGiDvNB4d1RLgnMQ" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-brand-green transition-colors" 
              data-testid="link-youtube"
            >
              <Youtube className="w-6 h-6" />
            </a>
            <a 
              href="https://x.com/AdmissionAll" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-brand-green transition-colors" 
              data-testid="link-twitter"
            >
              <Twitter className="w-6 h-6" />
            </a>
            <a 
              href="https://www.facebook.com/alladmissionservices" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-brand-green transition-colors" 
              data-testid="link-facebook"
            >
              <Facebook className="w-6 h-6" />
            </a>
          </div>
          
          <div className="text-center md:text-right text-gray-300">
            <div className="mb-2" data-testid="text-copyright">© 2024 AAS Eduguide Pvt. Ltd. All rights reserved.</div>
            <div className="text-sm space-x-2">
              <button className="hover:text-brand-green transition-colors" data-testid="link-privacy">Privacy Policy</button>
              <span>•</span>
              <button className="hover:text-brand-green transition-colors" data-testid="link-terms">Terms of Service</button>
              <span>•</span>
              <button className="hover:text-brand-green transition-colors" data-testid="link-cookies">Cookie Policy</button>
              <span>•</span>
              <button className="hover:text-brand-green transition-colors" data-testid="link-accessibility">Accessibility</button>
            </div>
            {/* <div className="text-xs mt-2" data-testid="text-cin">CIN: U85110HR2009PTC040401</div> */}
          </div>
        </div>
      </div>
    </footer>
  );
}
