import { GlassCard } from "@/components/ui/glass-card";
import { 
  ClipboardCheck, 
  GraduationCap, 
  ListOrdered, 
  BarChart3, 
  IndianRupee, 
  FileText, 
  Bell, 
  Handshake 
} from "lucide-react";

const services = [
  {
    icon: ClipboardCheck,
    title: "Eligibility & Exam Strategy",
    description: "Complete eligibility verification and strategic exam preparation guidance.",
  },
  {
    icon: GraduationCap,
    title: "AIQ/State/Deemed/Private/DNB Guidance",
    description: "Expert guidance across all quota categories and institution types.",
  },
  {
    icon: ListOrdered,
    title: "Choice Filling & Mock Iterations",
    description: "Strategic choice filling with multiple mock runs for optimization.",
  },
  {
    icon: BarChart3,
    title: "Live Seat Matrix & Historical Closures",
    description: "Real-time seat availability and comprehensive historical data analysis.",
  },
  {
    icon: IndianRupee,
    title: "Fees, Bonds, Stipends, Refund Tracking",
    description: "Complete financial guidance and refund process tracking.",
  },
  {
    icon: FileText,
    title: "Documentation & Verification Support",
    description: "Complete document preparation and verification assistance.",
  },
  {
    icon: Bell,
    title: "Vacancy/Stray Alerts",
    description: "Instant notifications for vacancy rounds and stray vacancy opportunities.",
  },
  {
    icon: Handshake,
    title: "Post‑Allotment & Reporting Support",
    description: "Guidance through allotment acceptance and college reporting process.",
  },
];

export default function Services() {
  return (
    <section id="services" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-brand-navy mb-6" data-testid="text-services-title">
            End‑to‑end medical counseling
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto" data-testid="text-services-description">
            Comprehensive support from exam strategy to final admission, covering all aspects of the medical admissions process.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <GlassCard key={index} className="p-6 text-center hover-lift">
                <div className="w-12 h-12 bg-brand-green/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <IconComponent className="text-brand-green w-6 h-6" />
                </div>
                <h3 className="font-semibold text-brand-navy mb-2" data-testid={`text-service-title-${index}`}>
                  {service.title}
                </h3>
                <p className="text-sm text-gray-600" data-testid={`text-service-description-${index}`}>
                  {service.description}
                </p>
              </GlassCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
