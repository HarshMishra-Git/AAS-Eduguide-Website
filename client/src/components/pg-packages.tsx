import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Check, X, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const packageCards = [
  {
    name: "No Call Support",
    price: "₹3,000",
    description: "Basic Portal Access",
    features: ["✓ All State Notifications", "✓ Seat Matrix Access", "✓ College Predictor", "✗ Call Support"],
    cta: "Buy Now",
    popular: false,
    premium: false,
  },
  {
    name: "No Call Support",
    price: "₹7,500",
    description: "Enhanced Portal Access",
    features: ["✓ All Portal Features", "✓ College Videos & Webinars", "✓ Fee & Bond Details", "✗ Call Support"],
    cta: "Buy Now",
    popular: false,
    premium: false,
  },
  {
    name: "Govt. Only",
    price: "₹15,000",
    description: "Government Seats Only",
    features: ["✓ Govt Choice Preference", "✓ Registration Support", "✓ Personalized Guidance", "✓ Limited Call Support"],
    cta: "Buy Now",
    popular: true,
    premium: false,
  },
  {
    name: "Govt. DNB + PVT + MG",
    price: "₹20,000",
    description: "Government + DNB",
    features: ["✓ DNB/Diploma Choice Order", "✓ OPD/IPD Department Beds", "✓ Rank Based Analysis", "✓ Round wise Support"],
    cta: "Buy Now",
    popular: false,
    premium: false,
  },
  {
    name: "DEEMED + Private + Govt.",
    price: "₹30,000",
    description: "Complete Coverage",
    features: ["✓ Private & DEEMED Choice", "✓ 24×7 Support", "✓ Security Deposit Protection", "✓ College Reviews"],
    cta: "Buy Now",
    popular: false,
    premium: false,
  },
  {
    name: "Seat Assurance",
    price: "₹1,00,000",
    description: "Premium Package",
    features: ["✓ Dedicated Personal Counselor", "✓ Complete Process Responsibility", "✓ NRI Documentation Support", "✓ College Negotiation"],
    cta: "Buy Now",
    popular: false,
    premium: true,
  },
];

const comparisonFeatures = [
  { feature: "Regular & Timely Notifications of All States + MCC", rs3000: true, rs7500: true, rs15000: true, rs20000: true, rs30000: true, rs100000: true },
  { feature: "Closing Rank, Seat Matrix, Allotment, Updated Fee, Stipend & Bond Details", rs3000: true, rs7500: true, rs15000: true, rs20000: true, rs30000: true, rs100000: true },
  { feature: "College Predictor & Important Videos & Webinars", rs3000: true, rs7500: true, rs15000: true, rs20000: true, rs30000: true, rs100000: true },
  { feature: "Brochure, FAQs, Rules & Eligibility", rs3000: true, rs7500: true, rs15000: true, rs20000: true, rs30000: true, rs100000: true },
  { feature: "Required Documents", rs3000: true, rs7500: true, rs15000: true, rs20000: true, rs30000: true, rs100000: true },
  { feature: "Govt ( States + MCC ) Choice Preference Order", rs3000: false, rs7500: true, rs15000: true, rs20000: true, rs30000: true, rs100000: true },
  { feature: "DNB & Diploma Choice Preference Order", rs3000: false, rs7500: false, rs15000: false, rs20000: true, rs30000: true, rs100000: true },
  { feature: "Private & DEEMED Choice Preference Order", rs3000: false, rs7500: false, rs15000: false, rs20000: false, rs30000: true, rs100000: true },
  { feature: "Counselling Registration Support", rs3000: false, rs7500: false, rs15000: true, rs20000: true, rs30000: true, rs100000: true },
  { feature: "OPD/IPD Departmental Beds & Occupancy", rs3000: false, rs7500: false, rs15000: true, rs20000: true, rs30000: true, rs100000: true },
  { feature: "Personalized one to one Counselling Guidance", rs3000: false, rs7500: false, rs15000: true, rs20000: true, rs30000: true, rs100000: true },
  { feature: "Rank Based Analysis & Suggestions for Best Fit Colleges in your Budget & Branch Preference", rs3000: false, rs7500: false, rs15000: true, rs20000: true, rs30000: true, rs100000: true },
  { feature: "Unlimited Call Support & Discussion at any stage of the Counselling", rs3000: false, rs7500: false, rs15000: true, rs20000: true, rs30000: true, rs100000: true },
  { feature: "Round wise, Seat wise & Branch-wise Choice Filling support", rs3000: false, rs7500: false, rs15000: true, rs20000: true, rs30000: true, rs100000: true },
  { feature: "College Wise, Department Wise reviews - Very Important", rs3000: false, rs7500: false, rs15000: true, rs20000: true, rs30000: true, rs100000: true },
  { feature: "Resident's Contact Number from College/Hospital Department - Very Important", rs3000: false, rs7500: false, rs15000: true, rs20000: true, rs30000: true, rs100000: true },
  { feature: "Customized counselling plan to secure best seat at lowest possible cost - Very Important", rs3000: false, rs7500: false, rs15000: false, rs20000: false, rs30000: true, rs100000: true },
  { feature: "Security Deposit Protection Strategy - Very Important", rs3000: false, rs7500: false, rs15000: false, rs20000: false, rs30000: true, rs100000: true },
  { feature: "NRI Documentation & Admission Support", rs3000: false, rs7500: false, rs15000: false, rs20000: false, rs30000: true, rs100000: true },
  { feature: "College level Negotiation for Management & NRI Quota Seats - Very Important", rs3000: false, rs7500: false, rs15000: false, rs20000: false, rs30000: false, rs100000: true },
  { feature: "Counselling Registration & Choice Filling by our Experts", rs3000: false, rs7500: false, rs15000: false, rs20000: false, rs30000: false, rs100000: true },
  { feature: "Dedicated personal counsellor monitors entire process till admission - Very Important", rs3000: false, rs7500: false, rs15000: false, rs20000: false, rs30000: false, rs100000: true },
  { feature: "Complete counselling Responsibility till best college allotment - Very Important", rs3000: false, rs7500: false, rs15000: false, rs20000: false, rs30000: false, rs100000: true },
];

const colorMap = {
  "Limited": "bg-yellow-100 text-yellow-800",
  "Unlimited": "bg-green-100 text-green-800",
  "24×7": "bg-green-100 text-green-800",
  "Personal": "bg-blue-100 text-blue-800",
};

function FeatureCell({ value }: { value: boolean | string }) {
  if (typeof value === "boolean") {
    return value ? (
      <Check className="text-brand-green w-5 h-5 mx-auto" />
    ) : (
      <X className="text-red-500 w-5 h-5 mx-auto" />
    );
  }
  
  const bgColor = colorMap[value as keyof typeof colorMap] || "bg-gray-100 text-gray-800";
  const sanitizedValue = String(value).replace(/[<>"'&]/g, '');

  return (
    <span className={`text-xs px-2 py-1 rounded ${bgColor}`}>
      {sanitizedValue}
    </span>
  );
}

export default function PGPackages() {
  const scrollToContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="pg-packages" className="py-20 gradient-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-brand-navy mb-6" data-testid="text-pg-packages-title">
            Package Details for NEET PG 2025
          </h2>
          <h3 className="text-2xl font-bold text-brand-green mb-4">COUNSELLING GUIDANCE</h3>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto" data-testid="text-pg-packages-description">
            Comprehensive packages designed for NEET PG 2025 with different levels of support to match your needs.
          </p>
          <div className="mt-6 flex justify-center">
            <div className="text-xl sm:text-2xl font-bold text-brand-navy bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-4 sm:px-6 py-2 rounded-lg">
              📞 +91-8565001261
            </div>
          </div>
        </div>
        
        {/* Quick Comparison Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-12">
          {packageCards.map((pkg, index) => (
            <GlassCard 
              key={index} 
              className={`p-6 text-center hover-lift relative ${
                pkg.popular ? "border-2 border-brand-green" : pkg.premium ? "border-2 border-yellow-400" : ""
              }`}
            >
              {pkg.popular && (
                <Badge className="bg-brand-green text-white text-xs font-bold absolute -top-3 left-1/2 transform -translate-x-1/2">
                  POPULAR
                </Badge>
              )}
              {pkg.premium && (
                <Badge className="bg-yellow-400 text-black text-xs font-bold absolute -top-3 left-1/2 transform -translate-x-1/2">
                  PREMIUM
                </Badge>
              )}
              
              <h3 className="font-bold text-brand-navy mb-2 text-sm" data-testid={`text-package-name-${index}`}>{pkg.name}</h3>
              <div className="text-xl font-bold text-brand-green mb-4" data-testid={`text-package-price-${index}`}>{pkg.price}</div>
              <ul className="text-xs text-gray-600 space-y-2 mb-4">
                {pkg.features.map((feature, featureIndex) => (
                  <li key={featureIndex} data-testid={`text-package-feature-${index}-${featureIndex}`}>{feature}</li>
                ))}
              </ul>
              <Button 
                className="btn-primary text-white w-full py-2 text-sm font-medium"
                onClick={scrollToContact}
                data-testid={`button-package-${index}`}
              >
                {pkg.cta}
              </Button>
            </GlassCard>
          ))}
        </div>
        
        {/* Detailed Feature Comparison Table */}
        <GlassCard variant="strong" className="p-6">
          <h3 className="text-2xl font-bold text-brand-navy mb-6 text-center" data-testid="text-comparison-title">
            Detailed Feature Comparison
          </h3>
          <div className="overflow-x-auto table-scroll">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-brand-navy min-w-64">Package Details</th>
                  <th className="text-center py-3 px-4 font-semibold text-brand-navy min-w-24">Rs. 3,000</th>
                  <th className="text-center py-3 px-4 font-semibold text-brand-navy min-w-24">Rs. 7,500</th>
                  <th className="text-center py-3 px-4 font-semibold text-brand-navy min-w-24">Rs. 15,000</th>
                  <th className="text-center py-3 px-4 font-semibold text-brand-navy min-w-24">Rs. 20,000</th>
                  <th className="text-center py-3 px-4 font-semibold text-brand-navy min-w-24">Rs. 30,000</th>
                  <th className="text-center py-3 px-4 font-semibold text-brand-navy min-w-24">Rs. 1,00,000</th>
                </tr>
              </thead>
              <tbody className="text-gray-600">
                {comparisonFeatures.map((row, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-3 px-4" data-testid={`text-feature-${index}`}>{row.feature}</td>
                    <td className="text-center py-3 px-4" data-testid={`cell-3000-${index}`}>
                      <FeatureCell value={row.rs3000} />
                    </td>
                    <td className="text-center py-3 px-4" data-testid={`cell-7500-${index}`}>
                      <FeatureCell value={row.rs7500} />
                    </td>
                    <td className="text-center py-3 px-4" data-testid={`cell-15000-${index}`}>
                      <FeatureCell value={row.rs15000} />
                    </td>
                    <td className="text-center py-3 px-4" data-testid={`cell-20000-${index}`}>
                      <FeatureCell value={row.rs20000} />
                    </td>
                    <td className="text-center py-3 px-4" data-testid={`cell-30000-${index}`}>
                      <FeatureCell value={row.rs30000} />
                    </td>
                    <td className="text-center py-3 px-4" data-testid={`cell-100000-${index}`}>
                      <FeatureCell value={row.rs100000} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-center mt-4 text-sm text-gray-600">
            <Info className="w-4 h-4 mr-2" />
            <span data-testid="text-disclaimer">
              All packages include documentation support and vacancy alerts. Refund policies apply as per terms and conditions.
            </span>
          </div>
        </GlassCard>
      </div>
    </section>
  );
}