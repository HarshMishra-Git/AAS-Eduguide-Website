import { useEffect } from "react";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import Careers from "@/components/careers";
import AnimatedBackground from "@/components/animated-background";

export default function CareersPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <AnimatedBackground />
      <Navigation />
      <main className="pt-16">
        <Careers />
      </main>
      <Footer />
    </div>
  );
}