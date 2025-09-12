import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { insertContactSchema, type InsertContact } from "@shared/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { X, Phone, MessageCircle } from "lucide-react";

interface ContactPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ContactPopup({ isOpen, onClose }: ContactPopupProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<InsertContact>({
    resolver: zodResolver(insertContactSchema.extend({
      fullName: insertContactSchema.shape.fullName.min(2, "Full name must be at least 2 characters"),
      email: insertContactSchema.shape.email.email("Please enter a valid email"),
      phone: insertContactSchema.shape.phone.min(10, "Phone number must be at least 10 digits"),
    })),
    defaultValues: {
      fullName: "",
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
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/contacts"] });
      toast({
        title: "Success!",
        description: "Your consultation request has been submitted. We'll contact you within 2 hours!",
      });
      onClose();
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader className="relative">
          <DialogTitle className="text-2xl font-bold text-brand-navy text-center pr-8">
            Get Free Consultation
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="text-center text-sm text-gray-700 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 border border-green-200">
            <p className="font-medium text-brand-navy">Expert guidance for NEET UG/PG, DNB & INI-CET admissions</p>
            <p className="font-bold text-brand-green mt-1">✅ Response within 2 hours!</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input 
                        placeholder="Full Name" 
                        className="bg-white/80"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input 
                        type="email"
                        placeholder="Email Address" 
                        className="bg-white/80"
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
                        className="bg-white/80"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="exam"
                  render={({ field }) => (
                    <FormItem>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-white">
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
                          className="bg-white/80"
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
                        rows={3}
                        placeholder="Your Message (Optional)" 
                        className="bg-white/80 resize-none"
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
                className="w-full bg-brand-green hover:bg-green-600 text-white py-3 font-medium rounded-lg transition-colors"
                disabled={createContactMutation.isPending}
              >
                {createContactMutation.isPending ? "Submitting..." : "Get Free Consultation"}
              </Button>
            </form>
          </Form>

          <div className="flex gap-2 pt-3">
            <Button 
              variant="outline" 
              className="flex-1 text-sm border-brand-green text-brand-green hover:bg-brand-green hover:text-white transition-colors"
              onClick={() => window.open("tel:+917752944476", "_self")}
            >
              <Phone className="w-4 h-4 mr-2" />
              Call Now
            </Button>
            <Button 
              variant="outline" 
              className="flex-1 text-sm border-brand-navy text-brand-navy hover:bg-brand-navy hover:text-white transition-colors"
              onClick={() => window.open("https://api.whatsapp.com/send/?phone=%2B917752944476&text&type=phone_number&app_absent=0", "_blank")}
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              WhatsApp
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}