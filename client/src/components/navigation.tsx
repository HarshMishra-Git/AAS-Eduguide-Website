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
  // { href: "#director", label: "MD" },
  { href: "#contact", label: "Contact" },
];

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [location, navigate] = useLocation();
  const activeSection = useScrollSpy(
    navItems.map(item => item.href.substring(1)),
    { offset: -100 }
  );

  const scrollToSection = (href: string) => {
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
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
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <button
                key={item.href}
                onClick={() => scrollToSection(item.href)}
                className={`nav-link px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeSection === item.href.substring(1) ? "active" : ""
                }`}
                data-testid={`nav-${item.href.substring(1)}`}
              >
                {item.label}
              </button>
            ))}
            {/* <Button 
              onClick={goToCareers}
              className="relative overflow-hidden bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-4 py-2 mr-3 font-medium transition-all duration-300 transform hover:scale-105 animate-pulse"
              data-testid="button-were-hiring"
            >
              <span className="relative z-10 flex items-center space-x-2">
                <Briefcase className="w-4 h-4" />
                <span>We're Hiring!</span>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400 opacity-0 hover:opacity-20 transition-opacity duration-300"></div>
            </Button> */}
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
                      activeSection === item.href.substring(1) 
                        ? "active bg-green-50 border-brand-green text-brand-green" 
                        : "text-brand-navy hover:text-brand-green"
                    }`}
                    data-testid={`mobile-nav-${item.href.substring(1)}`}
                  >
                    {item.label}
                  </button>
                ))}
                <Button 
                  onClick={goToCareers}
                  className="relative overflow-hidden bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 py-3 mt-4 text-base font-medium transition-all duration-300 animate-pulse"
                  data-testid="button-mobile-were-hiring"
                >
                  <span className="flex items-center space-x-2">
                    <Briefcase className="w-4 h-4" />
                    <span>We're Hiring!</span>
                  </span>
                </Button>
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
