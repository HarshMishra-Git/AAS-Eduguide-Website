import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GlassCard } from "@/components/ui/glass-card";
import { MessageCircle, X, Send, Bot, User, Phone, Mail } from "lucide-react";

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  quickActions?: string[];
}

const quickActions = [
  "About AAS Eduguide",
  "NEET UG Packages",
  "NEET PG Packages", 
  "Our Services",
  "Success Stories",
  "Contact Details"
];

const botResponses = {
  "about": "<strong>AAS Eduguide Pvt. Ltd.</strong> - Your trusted partner in medical admissions! 🏥<br/><br/>📍 <strong>Established:</strong> 13+ years of excellence<br/>👥 <strong>Students Guided:</strong> 10+ Lakh successful admissions<br/>🎯 <strong>Motto:</strong> \"Your Career Is Our Concern\"<br/><br/>🏢 <strong>Office:</strong> 117/H-1/377, Pandu Nagar, Kanpur, UP<br/>📞 <strong>Contact:</strong> +91-7752944476<br/>✉️ <strong>Email:</strong> alladmission1@gmail.com<br/><br/>We specialize in NEET UG/PG, DNB, and INI-CET counseling across India & Abroad!<br/><br/>💡 <strong>Ready to start your journey?</strong> Fill our contact form for personalized guidance!",

  "services": "Our comprehensive services include: 🎯<br/><br/>🔍 <strong>College Predictor</strong> - AI-powered admission chances<br/>📊 <strong>Closing Rank Analysis</strong> - Real-time data<br/>💰 <strong>Fee Structure Details</strong> - Complete transparency<br/>🏥 <strong>Clinical Infrastructure Info</strong> - OPD/IPD details<br/>🔔 <strong>Notifications & Alerts</strong> - Never miss deadlines<br/>📝 <strong>Choice Filling Guidance</strong> - Personalized strategy<br/>👨‍⚕️ <strong>One-to-One Counseling</strong> - Expert guidance<br/>📚 <strong>Exclusive Content</strong> - Blogs & success stories<br/><br/>🎯 <strong>Want detailed guidance?</strong> Our experts are waiting! Fill the contact form now!",

  "ug_packages": "<strong>NEET UG 2025 Counseling Packages:</strong> 🎓<br/><br/>🥉 <strong>Govt. Only Counselling</strong> - ₹10,000<br/>• AIQ + State Quota Government seats only<br/>• Basic guidance & documentation support<br/>• Non-refundable<br/><br/>🥈 <strong>Counselling Guidance Only</strong> - ₹25,000 ⭐ RECOMMENDED<br/>• All quotas: Govt + Private + Deemed + Management<br/>• Full planning + hand-hold support<br/>• Group video meeting with MD Sir<br/>• Non-refundable<br/><br/>🥇 <strong>Premium Counselling</strong> - ₹1,00,000<br/>• Complete seat assurance package<br/>• Dedicated personal counselor<br/>• 1-to-1 meeting with Director<br/>• Negotiated tuition fees<br/>• 100% refund policy<br/><br/>📞 <strong>Which package suits your NEET score?</strong> Let our experts guide you! Fill the contact form for personalized package recommendation!",

  "pg_packages": "<strong>NEET PG 2025 Counseling Packages:</strong> 🩺<br/><br/>📱 <strong>Portal Access</strong> - ₹3,000 to ₹7,500<br/>• Notifications & seat matrix<br/>• College predictor access<br/>• No call support<br/><br/>🏛️ <strong>Government Focus</strong> - ₹15,000 to ₹20,000<br/>• Govt + DNB choice filling<br/>• Registration support<br/>• Limited call support<br/><br/>🏥 <strong>Complete Coverage</strong> - ₹30,000<br/>• All quotas: Govt + Private + Deemed<br/>• 24×7 support<br/>• Security deposit protection<br/><br/>⭐ <strong>Seat Assurance</strong> - ₹1,00,000<br/>• Dedicated personal counselor<br/>• Complete process responsibility<br/>• College-level negotiation<br/><br/>🎯 <strong>Confused about which package to choose?</strong> Our counselors will analyze your NEET PG score and recommend the perfect package! Fill the contact form now!",

  "testimonials": "Our students love us! Here are some success stories: ⭐<br/><br/>🎉 <strong>Success Rate:</strong> 95%+ admission success<br/>📈 <strong>Track Record:</strong> 2L+ Lakh students guided<br/>🏆 <strong>Recognition:</strong> India's leading medical counseling service<br/><br/>💬 <strong>Student Feedback:</strong><br/>\"AAS Eduguide helped me secure AIIMS Delhi!\" - Priya S.<br/>\"Best counseling service in India\" - Rahul M.<br/>\"Got my dream college through their guidance\" - Anjali K.<br/><br/>🌟 <strong>Want to be our next success story?</strong> Fill the contact form and let our experts guide you to your dream medical college!",

  "director": "Meet our <strong>Managing Director</strong> 👨‍💼<br/><br/>With 13+ years of experience in medical admission counseling, our MD has personally guided thousands of students to their dream medical colleges.<br/><br/>🎯 <strong>Expertise:</strong> NEET UG/PG, DNB, INI-CET<br/>📚 <strong>Experience:</strong> 13+ years in education consultancy<br/>🏆 <strong>Achievement:</strong> 10+ Lakh successful admissions<br/><br/>Available for exclusive 1-to-1 meetings in our Premium packages!<br/><br/>📞 <strong>Want to meet our MD personally?</strong> Fill the contact form and mention your interest in premium counseling!",

  "contact": "<strong>Get in touch with us:</strong> 📞<br/><br/>📱 <strong>Phone:</strong> +91-7752944476<br/>💬 <strong>WhatsApp:</strong> +91-7752944476<br/>✉️ <strong>Email:</strong> alladmission1@gmail.com<br/><br/>🏢 <strong>Office Address:</strong><br/>117/H-1/377, Pandu Nagar<br/>Near Agra Sweet House<br/>Kakadeo, Kanpur, UP 208005<br/><br/>🕒 <strong>Office Hours:</strong><br/>Mon-Sat: 10:00 AM - 6:00 PM<br/>Sunday: 11:00 AM - 5:00 PM<br/><br/>⚡ <strong>Quick Response:</strong> We respond within 15 minutes!<br/><br/>🎯 <strong>Ready to start your medical career journey?</strong> Fill our contact form below for immediate assistance!",

  "documents": "<strong>Required Documents Checklist:</strong> 📋<br/><br/>📄 <strong>For NEET UG:</strong><br/>• NEET UG Scorecard<br/>• 10th & 12th Marksheets<br/>• Category Certificate (if applicable)<br/>• Domicile Certificate<br/>• Aadhar Card & Passport<br/><br/>📄 <strong>For NEET PG:</strong><br/>• NEET PG Scorecard<br/>• MBBS Degree & Marksheets<br/>• Internship Completion Certificate<br/>• Registration Certificate<br/>• Category Certificate (if applicable)<br/><br/>📄 <strong>Additional Documents:</strong><br/>• Passport size photographs<br/>• Signature specimens<br/>• Income Certificate (for fee concession)<br/><br/>📞 <strong>Need help with documentation?</strong> Our experts will guide you through the entire process! Fill the contact form now!",

  "why_choose": "<strong>Why Choose AAS Eduguide?</strong> 🌟<br/><br/>✅ <strong>13+ Years Experience</strong> - Proven track record<br/>✅ <strong>10+ Lakh Students</strong> - Successfully guided<br/>✅ <strong>24×7 Support</strong> - Always available<br/>✅ <strong>India & Abroad</strong> - Complete coverage<br/>✅ <strong>Expert Team</strong> - Qualified counselors<br/>✅ <strong>Transparent Pricing</strong> - No hidden costs<br/>✅ <strong>Personalized Guidance</strong> - Tailored solutions<br/>✅ <strong>Quick Response</strong> - 15-minute guarantee<br/>✅ <strong>Success Rate</strong> - 95%+ admissions<br/>✅ <strong>Refund Policy</strong> - Available on premium packages<br/><br/>🎯 <strong>Ready to experience the AAS difference?</strong> Fill our contact form and get started today!",

  "cutoffs": "I can help with NEET cutoffs! 📊<br/><br/>• <strong>NEET UG 2024</strong>: General - 720+, OBC - 630+, SC/ST - 540+<br/>• <strong>NEET PG 2024</strong>: General - 50th percentile<br/><br/>🎯 <strong>Want college predictions based on your score?</strong> Our experts will analyze your rank and suggest the best colleges within your budget! Fill the contact form with your NEET score!",

  "fees": "Our counseling fees are completely transparent: 💰<br/><br/>🎓 <strong>UG Counseling:</strong> ₹10,000 - ₹1,00,000<br/>🩺 <strong>PG Counseling:</strong> ₹3,000 - ₹1,00,000<br/><br/>✅ No hidden charges<br/>✅ Refund policy available<br/>✅ EMI options for premium packages<br/>✅ Value for money guarantee<br/><br/>💡 <strong>Want to know which package fits your budget?</strong> Fill the contact form and our counselors will recommend the perfect package for your needs!",

  "default": "Hello! I'm <strong>AAS AI</strong> 🤖, your personal medical admission assistant from AAS Eduguide Pvt. Ltd.<br/><br/>With 13+ years of experience and 10+ Lakh successful admissions, we're here to guide you through NEET UG/PG, DNB, and INI-CET counseling.<br/><br/>🎯 <strong>I can help you with:</strong><br/>• Package recommendations<br/>• NEET cutoffs & college predictions<br/>• Documentation guidance<br/>• Counseling process<br/>• Success stories<br/><br/>💡 <strong>For personalized guidance, fill our contact form!</strong> Our experts are ready to help you achieve your medical career dreams!"
};

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasUserClosed, setHasUserClosed] = useState(false);
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm <strong>AAS AI</strong> 🤖<br/><br/>Welcome to <strong>AAS Eduguide Pvt. Ltd.</strong> - Your trusted partner for medical admissions with 13+ years of excellence!<br/><br/>🎯 I'm here to help you with:<br/>• NEET UG/PG counseling packages<br/>• College predictions & guidance<br/>• Documentation support<br/>• Success stories & testimonials<br/><br/>💡 <strong>For personalized guidance, don't forget to fill our contact form!</strong><br/><br/>How can I assist you today?",
      sender: 'bot',
      timestamp: new Date(),
      quickActions: quickActions
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const getBotResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    // Company information
    if (message.includes('about') || message.includes('company') || message.includes('aas eduguide')) {
      return botResponses["about"];
    }
    if (message.includes('service') || message.includes('what do you do')) {
      return botResponses["services"];
    }
    if (message.includes('ug') || message.includes('undergraduate') || message.includes('mbbs') || message.includes('neet ug')) {
      return botResponses["ug_packages"];
    }
    if (message.includes('pg') || message.includes('postgraduate') || message.includes('md') || message.includes('ms') || message.includes('neet pg')) {
      return botResponses["pg_packages"];
    }
    if (message.includes('testimonial') || message.includes('review') || message.includes('success') || message.includes('student')) {
      return botResponses["testimonials"];
    }
    if (message.includes('director') || message.includes('md') || message.includes('founder') || message.includes('management')) {
      return botResponses["director"];
    }
    if (message.includes('contact') || message.includes('phone') || message.includes('address') || message.includes('office')) {
      return botResponses["contact"];
    }
    if (message.includes('document') || message.includes('paper') || message.includes('certificate') || message.includes('requirement')) {
      return botResponses["documents"];
    }
    if (message.includes('why choose') || message.includes('why aas') || message.includes('benefits') || message.includes('advantage')) {
      return botResponses["why_choose"];
    }
    if (message.includes('cutoff') || message.includes('rank') || message.includes('score') || message.includes('marks')) {
      return botResponses["cutoffs"];
    }
    if (message.includes('fee') || message.includes('cost') || message.includes('price') || message.includes('charge')) {
      return botResponses["fees"];
    }
    if (message.includes('package') || message.includes('plan') || message.includes('counseling')) {
      return "We offer comprehensive counseling packages for both NEET UG and NEET PG! 🎯<br/><br/>🎓 <strong>NEET UG Packages:</strong> ₹10,000 - ₹1,00,000<br/>🩺 <strong>NEET PG Packages:</strong> ₹3,000 - ₹1,00,000<br/><br/>Each package is designed to maximize your admission chances within your budget.<br/><br/>💡 <strong>Want detailed package comparison?</strong> Fill our contact form and our experts will recommend the perfect package based on your NEET score and preferences!";
    }
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      return "Hello! 👋 Welcome to <strong>AAS Eduguide</strong>.<br/><br/>I'm here to help you with medical admissions guidance. What would you like to know about NEET counseling?<br/><br/>💡 <strong>Pro tip:</strong> Fill our contact form for personalized guidance from our expert counselors!";
    }
    if (message.includes('thank')) {
      return "You're welcome! 😊<br/><br/>Feel free to ask anything else about medical admissions. For detailed guidance, our counselors are available at <strong>+91-7752944476</strong>.<br/><br/>🎯 <strong>Ready to take the next step?</strong> Fill our contact form for personalized counseling!";
    }
    if (message.includes('form') || message.includes('contact form') || message.includes('fill')) {
      return "Great choice! 🎯 Our contact form is the best way to get personalized guidance.<br/><br/>📍 <strong>You can find it in the 'Contact' section</strong> of our website - just scroll down!<br/><br/>✅ <strong>What you'll get:</strong><br/>• Personalized counseling session<br/>• Package recommendations<br/>• College predictions<br/>• Expert guidance<br/>• Quick response within 15 minutes<br/><br/>💡 <strong>Fill it now and let our experts guide you to your dream medical college!</strong>";
    }
    
    return botResponses["default"];
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Removed auto-open behavior - chatbot stays closed until user clicks

  const handleSendMessage = (text?: string) => {
    const messageText = text || inputValue.trim();
    if (!messageText) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    setTimeout(() => {
      const botResponse = getBotResponse(messageText);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date(),
        quickActions: messageText.toLowerCase().includes('package') ? ['Fill Contact Form', 'About AAS Eduguide', 'Contact Details'] : quickActions.slice(0, 3)
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const handleQuickAction = (action: string) => {
    if (action === 'Fill Contact Form') {
      scrollToContact();
      return;
    }
    handleSendMessage(action);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => {
            if (isOpen) {
              setHasUserClosed(true);
            }
            setIsOpen(!isOpen);
          }}
          className="w-16 h-16 rounded-full bg-gradient-to-r from-brand-green to-brand-navy text-white shadow-2xl hover:scale-110 transition-all duration-300 hover:animate-none"
          style={{ animation: 'pulse 3s ease-in-out infinite' }}
        >
          {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
        </Button>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[500px] z-50 animate-fade-up">
          <GlassCard className="h-full flex flex-col overflow-hidden border-2 border-brand-green/20">
            
            {/* Header */}
            <div className="bg-gradient-to-r from-brand-green to-brand-navy text-white p-4 flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Bot className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold">AAS AI Assistant</h3>
                <p className="text-xs opacity-90">Medical Admission Expert</p>
              </div>
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] ${message.sender === 'user' ? 'order-2' : 'order-1'}`}>
                    <div className={`flex items-start space-x-2 ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${message.sender === 'user' ? 'bg-brand-navy' : 'bg-brand-green'}`}>
                        {message.sender === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
                      </div>
                      <div className={`px-4 py-2 rounded-2xl ${message.sender === 'user' ? 'bg-brand-navy text-white' : 'bg-white border border-gray-200'}`}>
                        <div className="text-sm whitespace-pre-line" dangerouslySetInnerHTML={{
                          __html: message.text
                            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                            .replace(/\*(.*?)\*/g, '<em>$1</em>')
                            .replace(/•/g, '•')
                            .replace(/\n/g, '<br/>')
                        }} />
                        <p className="text-xs opacity-70 mt-1">
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                    
                    {/* Quick Actions */}
                    {message.quickActions && message.quickActions.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {message.quickActions.map((action, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuickAction(action)}
                            className="text-xs border-brand-green text-brand-green hover:bg-brand-green hover:text-white"
                          >
                            {action}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-brand-green rounded-full flex items-center justify-center">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-white border border-gray-200 px-4 py-2 rounded-2xl">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="flex space-x-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about NEET counseling..."
                  className="flex-1"
                  disabled={isTyping}
                />
                <Button
                  onClick={() => handleSendMessage()}
                  disabled={!inputValue.trim() || isTyping}
                  className="bg-brand-green hover:bg-brand-green/90 text-white"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              
              {/* Quick Contact */}
              <div className="flex justify-center space-x-4 mt-3 text-xs text-gray-600">
                <div className="flex items-center space-x-1">
                  <Phone className="w-3 h-3" />
                  <span>+91-7752944476</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Mail className="w-3 h-3" />
                  <span>Quick Response</span>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      )}
    </>
  );
}