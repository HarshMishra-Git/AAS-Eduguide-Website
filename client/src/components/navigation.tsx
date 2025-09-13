import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Briefcase } from "lucide-react";
import { useScrollSpy } from "@/hooks/use-scroll-spy";
import { useLocation } from "wouter";
// import logoUrl from "@assets/AASLOGO.png";

const navItems = [
  { href: "#home", label: "Home" },
  { href: "#overview", label: "Overview" },
  { href: "#services", label: "Services" },
  { href: "#pg-packages", label: "PG Packages" },
  { href: "#ug-packages", label: "UG Packages" },
  { href: "#documents", label: "Documents" },
  { href: "#testimonials", label: "Testimonials" },
  { href: "/blogs", label: "Blog", external: true },
  { href: "#contact", label: "Contact" },
];

// const premiumNavItem = {
//   href: "http://localhost:3001", // Will be updated to production URL
//   label: "AASEduguide.ai",
//   external: true,
//   premium: true
// };

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [location, navigate] = useLocation();
  const activeSection = useScrollSpy(
    navItems.map(item => item.href.substring(1)),
    { offset: -100 }
  );

  const scrollToSection = (href: string) => {
    if (href.startsWith('/')) {
      navigate(href);
      setIsOpen(false);
      return;
    }
    
    if (location !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.querySelector(href);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } else {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
    setIsOpen(false);
  };

  const goToCareers = () => {
    navigate('/careers');
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 w-full z-50 glass-strong transition-all duration-300">
      <div className="w-full px-6 lg:px-12">
        <div className="flex justify-between items-center h-16 w-full">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            {/* <div className="w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center overflow-hidden">
              <img 
                src={logoUrl} 
                alt="AAS Eduguide Logo" 
                className="w-16 h-16 object-cover -mt-1"
              />
            </div> */}
            <span className="text-xl font-bold text-brand-navy">AAS Eduguide</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center justify-center flex-1 space-x-8">
            {navItems.map((item) => (
              <button
                key={item.href}
                onClick={() => scrollToSection(item.href)}
                className={`nav-link px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  item.href.startsWith('/') ? (location === item.href ? "active" : "") : (activeSection === item.href.substring(1) ? "active" : "")
                }`}
                data-testid={`nav-${item.href.substring(1)}`}
              >
                {item.label}
              </button>
            ))}

          </div>
          
          {/* CTA Button */}
          <div className="hidden md:block flex-shrink-0">
            <Button 
              className="btn-primary text-white px-6 py-2"
              onClick={() => scrollToSection("#contact")}
              data-testid="button-start-counselling"
            >
              Start Counselling
            </Button>
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden" data-testid="button-mobile-menu">
                <Menu className="h-6 w-6 text-brand-navy" />
              </Button>
            </SheetTrigger>
            <SheetContent className="bg-white border-l border-gray-200 w-80 sm:w-96">
              <div className="flex flex-col space-y-3 mt-8">
                <div className="mb-4">
                  <h2 className="text-xl font-bold text-brand-navy">AAS Eduguide</h2>
                  <p className="text-sm text-brand-green">Navigation Menu</p>
                </div>
                {navItems.map((item) => (
                  <button
                    key={item.href}
                    onClick={() => scrollToSection(item.href)}
                    className={`nav-link px-4 py-3 rounded-lg text-base font-medium transition-all text-left border border-transparent hover:border-gray-200 hover:bg-gray-50 ${
                      item.href.startsWith('/') 
                        ? (location === item.href ? "active bg-green-50 border-brand-green text-brand-green" : "text-brand-navy hover:text-brand-green")
                        : (activeSection === item.href.substring(1) 
                          ? "active bg-green-50 border-brand-green text-brand-green" 
                          : "text-brand-navy hover:text-brand-green")
                    }`}
                    data-testid={`mobile-nav-${item.href.substring(1)}`}
                  >
                    {item.label}
                  </button>
                ))}

                <Button 
                  className="btn-primary text-white px-6 py-3 mt-3 text-base font-medium"
                  onClick={() => scrollToSection("#contact")}
                  data-testid="button-mobile-start-counselling"
                >
                  Start Counselling
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
