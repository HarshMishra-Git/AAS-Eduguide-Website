import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Phone } from "lucide-react";

export default function SanskaramNavigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const openWhatsApp = () => {
    window.open("https://api.whatsapp.com/send/?phone=%2B917752944476&text&type=phone_number&app_absent=0", "_blank");
  };

  const makeCall = () => {
    window.location.href = "tel:+917752944476";
  };

  return (
    <nav className="bg-white shadow-lg relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a href="/" className="flex items-center">
              <span className="text-2xl font-bold text-brand-navy">AAS</span>
              <span className="text-2xl font-bold text-brand-green ml-1">Eduguide</span>
            </a>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <a href="/" className="text-gray-700 hover:text-brand-green px-3 py-2 text-sm font-medium transition-colors">
                Home
              </a>
              <a href="#about-sanskaram" className="text-gray-700 hover:text-brand-green px-3 py-2 text-sm font-medium transition-colors">
                About University
              </a>
              <a href="#admission-process" className="text-gray-700 hover:text-brand-green px-3 py-2 text-sm font-medium transition-colors">
                Admission Process
              </a>
              <a href="#contact-form" className="text-gray-700 hover:text-brand-green px-3 py-2 text-sm font-medium transition-colors">
                Apply Now
              </a>
            </div>
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Button 
              onClick={makeCall}
              className="btn-primary"
            >
              <Phone className="w-4 h-4 mr-2" />
              Call Now
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-brand-green p-2"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <a href="/" className="block px-3 py-2 text-gray-700 hover:text-brand-green font-medium">
              Home
            </a>
            <a href="#about-sanskaram" className="block px-3 py-2 text-gray-700 hover:text-brand-green font-medium">
              About University
            </a>
            <a href="#admission-process" className="block px-3 py-2 text-gray-700 hover:text-brand-green font-medium">
              Admission Process
            </a>
            <a href="#contact-form" className="block px-3 py-2 text-gray-700 hover:text-brand-green font-medium">
              Apply Now
            </a>
            <div className="px-3 py-2">
              <Button 
                onClick={makeCall}
                className="btn-primary w-full"
              >
                <Phone className="w-4 h-4 mr-2" />
                Call Now
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}