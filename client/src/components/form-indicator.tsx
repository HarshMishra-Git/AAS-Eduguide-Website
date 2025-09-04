import { useState, useEffect } from "react";
import { X, FileText, ArrowDown } from "lucide-react";

export default function FormIndicator() {
  const [isVisible, setIsVisible] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 3000); // Show after 3 seconds

    return () => clearTimeout(timer);
  }, []);

  const scrollToContact = () => {
    const element = document.querySelector("#contact");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    // Don't hide - stays visible until form is submitted
  };

  // Listen for form submission to hide the indicator
  useEffect(() => {
    const handleFormSubmit = () => {
      setIsVisible(false);
    };

    // Listen for successful form submission
    const contactForm = document.querySelector('form');
    if (contactForm) {
      contactForm.addEventListener('submit', handleFormSubmit);
      return () => contactForm.removeEventListener('submit', handleFormSubmit);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-24 right-6 z-40 animate-bounce">
      <div className={`bg-gradient-to-r from-brand-green to-green-600 text-white rounded-lg shadow-lg transition-all duration-300 ${
        isMinimized ? 'w-12 h-12' : 'w-72 p-4'
      }`}>
        {isMinimized ? (
          <button
            onClick={handleMinimize}
            className="w-full h-full flex items-center justify-center"
          >
            <FileText className="w-6 h-6" />
          </button>
        ) : (
          <>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5" />
                <span className="font-semibold text-sm">Quick Counselling</span>
              </div>
              <div className="flex space-x-1">
                <button
                  onClick={handleMinimize}
                  className="text-white/80 hover:text-white text-xs"
                >
                  −
                </button>
                <button
                  onClick={handleClose}
                  className="text-white/80 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            <p className="text-xs mb-3 text-white/90">
              Get personalized guidance in 2 minutes! Fill our quick form.
            </p>
            <button
              onClick={scrollToContact}
              className="w-full bg-white text-brand-green py-2 px-3 rounded-md text-sm font-medium hover:bg-gray-100 transition-colors flex items-center justify-center space-x-2"
            >
              <span>Fill Form Now</span>
              <ArrowDown className="w-4 h-4" />
            </button>
          </>
        )}
      </div>
      {!isMinimized && (
        <div className="absolute -top-2 right-4 w-0 h-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-brand-green"></div>
      )}
    </div>
  );
}