import Navigation from "@/components/navigation";
import HeroSection from "@/components/hero-section";
import CompanyOverview from "@/components/company-overview";
import HowWeWork from "@/components/how-we-work";
import ServicesSection from "@/components/services-section";
import PGPackages from "@/components/pg-packages";
import UGPackages from "@/components/ug-packages";
import WhyChooseUs from "@/components/why-choose-us";
import DocumentChecklist from "@/components/document-checklist";
import Testimonials from "@/components/testimonials";
import Achievements from "@/components/achievements";
import ManagingDirector from "@/components/managing-director";
import Contact from "@/components/contact";
import Footer from "@/components/footer";
import AnimatedBackground from "@/components/animated-background";
import Chatbot from "@/components/chatbot";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 relative">
      <AnimatedBackground />
      <div className="relative z-10">
        <Navigation />
        <main>
          <HeroSection />
          <CompanyOverview />
          <ServicesSection />
          <HowWeWork />
          <PGPackages />
          <UGPackages />
          <WhyChooseUs />
          <DocumentChecklist />
          <Testimonials />
          <Achievements />
          <ManagingDirector />
          <Contact />
        </main>
        <Footer />
        <Chatbot />
      </div>
    </div>
  );
}
