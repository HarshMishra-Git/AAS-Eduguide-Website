import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GlassCard } from "@/components/ui/glass-card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { insertContactSchema, type InsertContact } from "@shared/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Phone, Mail, MapPin, Clock, MessageCircle } from "lucide-react";

export default function Contact() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<InsertContact>({
    resolver: zodResolver(insertContactSchema.extend({
      firstName: insertContactSchema.shape.firstName.min(2, "First name must be at least 2 characters"),
      lastName: insertContactSchema.shape.lastName.min(2, "Last name must be at least 2 characters"),
      email: insertContactSchema.shape.email.email("Please enter a valid email"),
      phone: insertContactSchema.shape.phone.min(10, "Phone number must be at least 10 digits"),
    })),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      exam: "",
      preferredState: "",
      message: "",
    },
  });

  const createContactMutation = useMutation({
    mutationFn: (data: InsertContact) => apiRequest("POST", "/api/contacts", data),
    onSuccess: () => {
      toast({
        title: "Message Sent!",
        description: "Thank you for contacting us! We'll get back to you within 15 minutes.",
      });
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/contacts"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to send your message. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertContact) => {
    createContactMutation.mutate(data);
  };

  const openWhatsApp = () => {
    window.open("https://api.whatsapp.com/send/?phone=%2B917752944476&text&type=phone_number&app_absent=0", "_blank");
  };

  return (
    <section id="contact" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-brand-navy mb-6" data-testid="text-contact-title">
            Talk to a counselor
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto" data-testid="text-contact-description">
            Get personalized guidance from our expert counselors. We're here to help you navigate your medical admission journey.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <GlassCard className="p-8">
            <h3 className="text-2xl font-bold text-brand-navy mb-6" data-testid="text-form-title">Send us a message</h3>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input 
                            placeholder="First Name" 
                            className="bg-white/80 backdrop-blur-sm"
                            data-testid="input-first-name"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input 
                            placeholder="Last Name" 
                            className="bg-white/80 backdrop-blur-sm"
                            data-testid="input-last-name"
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
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input 
                          type="email"
                          placeholder="Email Address" 
                          className="bg-white/80 backdrop-blur-sm"
                          data-testid="input-contact-email"
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
                          data-testid="input-contact-phone"
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
                    name="exam"
                    render={({ field }) => (
                      <FormItem>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-white border-gray-300" data-testid="select-contact-exam">
                              <SelectValue placeholder="Select Exam" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="neet-ug">NEET UG</SelectItem>
                            <SelectItem value="neet-pg">NEET PG</SelectItem>
                            <SelectItem value="dnb">DNB</SelectItem>
                            <SelectItem value="ini-cet">INI-CET</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="preferredState"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input 
                            placeholder="Preferred State" 
                            className="bg-white/80 backdrop-blur-sm"
                            data-testid="input-contact-state"
                            {...field}
                            value={field.value || ""}
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
                          rows={4}
                          placeholder="Your Message" 
                          className="bg-white/80 backdrop-blur-sm resize-none"
                          data-testid="textarea-message"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="w-full btn-primary text-white py-3 text-lg font-medium"
                  disabled={createContactMutation.isPending}
                  data-testid="button-request-callback"
                >
                  {createContactMutation.isPending ? "Sending..." : "Request Callback"}
                </Button>
              </form>
            </Form>
            
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-center space-x-4 mb-6">
                <div className="text-center">
                  <div className="text-sm text-brand-green font-semibold" data-testid="text-india-counselling">India</div>
                  <div className="text-xs text-gray-600">Medical Counselling</div>
                </div>
                <div className="w-px h-8 bg-gray-300"></div>
                <div className="text-center">
                  <div className="text-sm text-brand-green font-semibold" data-testid="text-abroad-counselling">Abroad</div>
                  <div className="text-xs text-gray-600">Medical Counselling</div>
                </div>
              </div>
              
              {/* Additional Content */}
              <div className="bg-gradient-to-r from-brand-green/10 to-brand-navy/10 rounded-lg p-4 mb-4">
                <div className="text-center">
                  <h4 className="text-lg font-semibold text-brand-navy mb-2">Why Choose AAS Eduguide?</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-brand-green rounded-full"></div>
                      <span className="text-gray-700">13+ Years Experience</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-brand-green rounded-full"></div>
                      <span className="text-gray-700">10 Lac+ Students Guided</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-brand-green rounded-full"></div>
                      <span className="text-gray-700">24×7 Expert Support</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-brand-green rounded-full"></div>
                      <span className="text-gray-700">India & Abroad Coverage</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="text-center text-sm text-gray-600 bg-blue-50 rounded-lg p-3">
                <div className="flex items-center justify-center space-x-2 mb-1">
                  <Clock className="w-4 h-4 text-brand-green" />
                  <span className="font-semibold text-brand-navy">Quick Response Guarantee</span>
                </div>
                <p>We'll get back to you within <span className="font-semibold text-brand-green">15 minutes</span> during office hours</p>
              </div>
            </div>
          </GlassCard>
          
          {/* Contact Information */}
          <div className="space-y-8">
            <GlassCard className="p-6">
              <h3 className="text-xl font-bold text-brand-navy mb-4" data-testid="text-get-in-touch">Get in touch</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-brand-green rounded-lg flex items-center justify-center">
                    <Phone className="text-white w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-semibold text-brand-navy">Phone</div>
                    <div className="text-gray-600" data-testid="text-phone-number">+91-7752944476</div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-brand-green rounded-lg flex items-center justify-center">
                    <MessageCircle className="text-white w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-semibold text-brand-navy">WhatsApp</div>
                    <div className="text-gray-600" data-testid="text-whatsapp-number">+91-7752944476</div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-brand-green rounded-lg flex items-center justify-center">
                    <Mail className="text-white w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-semibold text-brand-navy">Email</div>
                    <div className="text-gray-600" data-testid="text-email-address">alladmission1@gmail.com</div>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-brand-green rounded-lg flex items-center justify-center mt-1">
                    <MapPin className="text-white w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-semibold text-brand-navy">Office</div>
                    <div className="text-gray-600" data-testid="text-office-address">
                      117/H-1/377, Pandu Nagar, near Agra Sweet House<br />
                      Kakadeo, Kanpur, Uttar Pradesh 208005
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-brand-green rounded-lg flex items-center justify-center">
                    <Clock className="text-white w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-semibold text-brand-navy">Office Hours</div>
                    <div className="text-gray-600" data-testid="text-office-hours">
                      Mon-Sat: 10:00 AM - 6:00 PM<br />
                      Sunday: 11:00 AM - 5:00 PM
                    </div>
                  </div>
                </div>
              </div>
              
              <Button 
                className="w-full btn-secondary text-white py-3 font-medium mt-6 flex items-center justify-center space-x-2"
                onClick={openWhatsApp}
                data-testid="button-whatsapp-chat"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Chat on WhatsApp</span>
              </Button>
            </GlassCard>
            
            {/* Interactive Map */}
            <GlassCard className="p-4">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3570.2847!2d80.3319!3d26.4499!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399c47d4542d4c7d%3A0x123456789!2s117%2FH-1%2F377%2C%20Pandu%20Nagar%2C%20near%20Agra%20Sweet%20House%2C%20Kakadeo%2C%20Kanpur%2C%20Uttar%20Pradesh%20208005!5e0!3m2!1sen!2sin!4v1234567890"
                width="100%"
                height="256"
                style={{ border: 0, borderRadius: '8px' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="AAS Eduguide Office Location"
                data-testid="interactive-map"
              />
            </GlassCard>
          </div>
        </div>
      </div>
    </section>
  );
}
