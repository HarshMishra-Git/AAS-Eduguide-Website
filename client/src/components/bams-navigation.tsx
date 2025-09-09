import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Phone, Home } from "lucide-react";
import { useLocation } from "wouter";
import logoUrl from "@assets/AASLOGO.png";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "#contact-form", label: "Contact", scroll: true },
  { href: "#bams-info", label: "BAMS Info", scroll: true },
];

export default function BAMSNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [location, navigate] = useLocation();

  const handleNavigation = (href: string, scroll?: boolean) => {
    if (scroll) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      navigate(href);
    }
    setIsOpen(false);
  };

  const openWhatsApp = () => {
    window.open("https://api.whatsapp.com/send/?phone=%2B917752944476&text&type=phone_number&app_absent=0", "_blank");
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 w-full z-50 glass-strong transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate("/")}>
            <div className="w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center overflow-hidden">
              <img 
                src={logoUrl} 
                alt="AAS Eduguide Logo" 
                className="w-16 h-16 object-cover -mt-1"
              />
            </div>
            <div>
              <span className="text-xl font-bold text-brand-navy">AAS Eduguide</span>
              <div className="text-xs text-brand-green font-medium">BAMS Admissions</div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <button
                key={item.href}
                onClick={() => handleNavigation(item.href, item.scroll)}
                className="nav-link px-3 py-2 rounded-lg text-sm font-medium transition-all hover:bg-white/20 text-brand-navy hover:text-brand-green"
              >
                {item.label}
              </button>
            ))}

            <Button 
              className="btn-primary text-white px-6 py-2 bg-brand-green hover:bg-brand-green/90"
              onClick={openWhatsApp}
            >
              <Phone className="w-4 h-4 mr-2" />
              WhatsApp
            </Button>
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6 text-brand-navy" />
              </Button>
            </SheetTrigger>
            <SheetContent className="bg-white border-l border-gray-200 w-80 sm:w-96">
              <div className="flex flex-col space-y-3 mt-8">
                <div className="mb-4 flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center overflow-hidden">
                    <img 
                      src={logoUrl} 
                      alt="AAS Eduguide Logo" 
                      className="w-16 h-16 object-cover -mt-1"
                    />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-brand-navy">AAS Eduguide</h2>
                    <p className="text-sm text-brand-green">BAMS Admissions</p>
                  </div>
                </div>
                
                {navItems.map((item) => (
                  <button
                    key={item.href}
                    onClick={() => handleNavigation(item.href, item.scroll)}
                    className="nav-link px-4 py-3 rounded-lg text-base font-medium transition-all text-left border border-transparent hover:border-gray-200 hover:bg-gray-50 text-brand-navy hover:text-brand-green flex items-center"
                  >
                    {item.icon && <item.icon className="w-4 h-4 mr-3" />}
                    {item.label}
                  </button>
                ))}

                <Button 
                  className="btn-primary text-white px-6 py-3 mt-3 text-base font-medium bg-brand-green hover:bg-brand-green/90"
                  onClick={openWhatsApp}
                >
                  <Phone className="w-4 h-4 mr-2" />
                  WhatsApp Support
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}