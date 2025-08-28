import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";

function getBorderClass(pkg: { recommended: boolean; premium: boolean }) {
  if (pkg.recommended) return "p-8 hover-lift relative border-2 border-brand-green";
  if (pkg.premium) return "p-8 hover-lift relative border-2 border-yellow-400";
  return "p-8 hover-lift relative";
}

const ugPackages = [
  {
    name: "Govt. Only Counselling",
    price: "₹10,000",
    description: "One Shot Payment",
    originalPrice: "₹25,000",
    features: [
      "ALERTS & Detailed Information on Admission Procedure",
      "AIQ + State Quota Govt. + Best Only",
      "Guidance + Rank Based Choice List",
      "Personalized Planning Rank Based Analysis & Suggestions for Best Fit College list at your Rank/Budget",
      "Guidance on Documentation",
      "Counselling Registration Support",
      "Call / WhatsApp Guidance by Our Counsellor",
      "Choice List by Our Experts",
    ],
    cta: "Book Now",
    recommended: false,
    premium: false,
    refund: "Non-Refundable",
  },
  {
    name: "Counselling Guidance Only",
    price: "₹25,000",
    description: "One Shot Payment",
    originalPrice: "₹50,000",
    features: [
      "AIQ + State Quota Govt. + Private + Deemed + Mgmt Quota + Registered Fees",
      "Full Proof Planning + Hand Hold Support",
      "Guidance + Rank Based Choice List",
      "Personalized Planning Rank Based Analysis & Suggestions for Best Fit College list at your Rank/Budget",
      "Guidance on Documentation",
      "Counselling Registration Support",
      "Call / WhatsApp Guidance by Our Counsellor",
      "Choice List by Our Experts",
      "Group Video MEETING With MD SIR",
      "Exclusive Alerts of Vacant Seats At Stray Round",
    ],
    cta: "Book Now",
    recommended: true,
    premium: false,
    refund: "Non-Refundable",
  },
  {
    name: "Premium Counselling",
    price: "₹1,00,000",
    description: "Seat Assurance",
    originalPrice: "₹2,00,000",
    features: [
      "Govt + Private + Deemed + Mgmt Quota + Registered Fees",
      "Full Proof Planning + Hand Hold Support",
      "Guidance + Rank Based Choice List",
      "Personalized Planning Rank Based Analysis & Suggestions for Best Fit College list at your Rank/Budget",
      "Guidance on Documentation",
      "Counselling Registration Support",
      "Call / WhatsApp Guidance by Our Counsellor",
      "Choice List by Our Experts",
      "Group Video MEETING With MD SIR",
      "Exclusive Alerts of Vacant Seats At Stray Round",
      "Counselling Registration & Choice Filing by Our Experts",
      "A Dedicated Personal counsellor",
      "Call/ WhatsApp Guidance by our Director/ Akhilesh Sir",
      "EXCLUSIVE 1 to 1 Online/ Office MEETING WITH Director",
      "3 Level Plan to Obtain Maximum Chance to grab a Seat Within Your Budget & Choice",
      "Information About Lowest Budget Of M.Q/NRI/Other Quota Seats",
      "Admission On Negotiated Tuition Fees (If Available as Per Situation)",
    ],
    cta: "Secure MBBS Seat",
    recommended: false,
    premium: true,
    refund: "100% Refund",
  },
];

const comparisonData = [
  { feature: "ALERTS & Detailed Information on Admission Procedure", govt: true, guidance: true, premium: true },
  { feature: "Counselling Support for", govt: "AIQ + State Quota Govt. + Best Only", guidance: "AIQ + State Quota Govt. + Private + Deemed + Mgmt Quota + Registered Fees", premium: "Govt + Private + Deemed + Mgmt Quota + Registered Fees" },
  { feature: "Counselling Support Type", govt: "Guidance + Rank Based Choice List", guidance: "Full Proof Planning + Hand Hold Support", premium: "Full Proof Planning + Hand Hold Support" },
  { feature: "Personalized Planning Rank Based Analysis & Suggestions for Best Fit College list at your Rank/Budget", govt: true, guidance: true, premium: true },
  { feature: "Guidance on Documentation", govt: true, guidance: true, premium: true },
  { feature: "Counselling Registration Support", govt: true, guidance: true, premium: true },
  { feature: "Call / WhatsApp Guidance by Our Counsellor", govt: true, guidance: true, premium: true },
  { feature: "Choice List by Our Experts", govt: true, guidance: true, premium: true },
  { feature: "Group Video MEETING With MD SIR", govt: false, guidance: true, premium: true },
  { feature: "Exclusive Alerts of Vacant Seats At Stray Round", govt: false, guidance: true, premium: true },
  { feature: "Counselling Registration & Choice Filing by Our Experts", govt: false, guidance: false, premium: true },
  { feature: "A Dedicated Personal counsellor", govt: false, guidance: false, premium: true },
  { feature: "Call/ WhatsApp Guidance by our Director/ Akhilesh Sir", govt: false, guidance: false, premium: true },
  { feature: "EXCLUSIVE 1 to 1 Online/ Office MEETING WITH Director", govt: false, guidance: false, premium: true },
  { feature: "3 Level Plan to Obtain Maximum Chance to grab a Seat Within Your Budget & Choice", govt: false, guidance: false, premium: true },
  { feature: "Information About Lowest Budget Of M.Q/NRI/Other Quota Seats", govt: false, guidance: false, premium: true },
  { feature: "Admission On Negotiated Tuition Fees (If Available as Per Situation)", govt: false, guidance: false, premium: true },
  { feature: "Refund Policy of our Services Charges", govt: "Non-Refundable", guidance: "Non-Refundable", premium: "100% Refund" },
];

function ComparisonCell({ value }: { value: boolean | string }) {
  if (typeof value === "boolean") {
    return value ? (
      <Check className="text-brand-green w-5 h-5 mx-auto" />
    ) : (
      <X className="text-red-500 w-5 h-5 mx-auto" />
    );
  }
  return <span className="text-xs">{value}</span>;
}

export default function UGPackages() {
  const scrollToContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="ug-packages" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-brand-navy mb-6" data-testid="text-ug-packages-title">
            OUR SERVICE PACKAGES FOR NEET UG 2025-COUNSELLING
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto" data-testid="text-ug-packages-description">
            Tailored packages for NEET UG 2025 admissions with comprehensive support for undergraduate medical aspirants.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {ugPackages.map((pkg, index) => (
            <GlassCard 
              key={pkg.name} 
              className={getBorderClass(pkg)}
            >
              {pkg.recommended && (
                <Badge className="bg-brand-green text-white text-sm font-bold absolute -top-4 left-1/2 transform -translate-x-1/2 px-6 py-2">
                  RECOMMENDED
                </Badge>
              )}
              {pkg.premium && (
                <Badge className="bg-yellow-400 text-black text-sm font-bold absolute -top-4 left-1/2 transform -translate-x-1/2 px-6 py-2">
                  PREMIUM
                </Badge>
              )}
              
              <div className={`text-center mb-6 ${pkg.recommended || pkg.premium ? "mt-4" : ""}`}>
                <h3 className="text-xl font-bold text-brand-navy mb-2" data-testid={`text-ug-package-name-${index}`}>
                  {pkg.name}
                </h3>
                <div className="mb-2">
                  <span className="text-sm text-gray-500 line-through">{pkg.originalPrice}</span>
                </div>
                <div className="text-3xl font-bold text-brand-green mb-2" data-testid={`text-ug-package-price-${index}`}>
                  {pkg.price}
                </div>
                <p className="text-gray-600 text-sm mb-2" data-testid={`text-ug-package-description-${index}`}>
                  {pkg.description}
                </p>
                <div className={`text-sm font-semibold ${pkg.refund === "100% Refund" ? "text-green-600" : "text-red-600"}`}>
                  {pkg.refund}
                </div>
              </div>
              
              <ul className="space-y-2 mb-8 max-h-80 overflow-y-auto">
                {pkg.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start space-x-2">
                    <Check className="text-brand-green w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 text-sm" data-testid={`text-ug-package-feature-${index}-${featureIndex}`}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
              
              <Button 
                className={`w-full py-3 text-lg font-medium ${
                  pkg.recommended || pkg.premium ? "btn-primary text-white" : "btn-secondary text-white"
                }`}
                onClick={scrollToContact}
                data-testid={`button-ug-package-${index}`}
              >
                {pkg.cta}
              </Button>
            </GlassCard>
          ))}
        </div>
        
        {/* UG Package Comparison Table */}
        <GlassCard variant="strong" className="p-6">
          <h3 className="text-2xl font-bold text-brand-navy mb-6 text-center" data-testid="text-ug-comparison-title">
            Our Packages for Counselling Support
          </h3>
          <div className="overflow-x-auto table-scroll">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-brand-navy min-w-64">Offer Price (Before MCC Counselling)</th>
                  <th className="text-center py-3 px-4 font-semibold text-brand-navy">Premium Counselling<br/>(Seat Assurance)<br/>Rs. 1,00,000/-</th>
                  <th className="text-center py-3 px-4 font-semibold text-brand-navy">Counselling Guidance<br/>Only<br/>Rs. 25,000/-</th>
                  <th className="text-center py-3 px-4 font-semibold text-brand-navy">Govt. Only<br/>Counselling<br/>Rs. 10,000/-</th>
                </tr>
              </thead>
              <tbody className="text-gray-600">
                {comparisonData.map((row, index) => (
                  <tr key={row.feature} className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium" data-testid={`text-ug-feature-${index}`}>{row.feature}</td>
                    <td className="text-center py-3 px-4" data-testid={`cell-ug-premium-${index}`}>
                      <ComparisonCell value={row.premium} />
                    </td>
                    <td className="text-center py-3 px-4" data-testid={`cell-ug-guidance-${index}`}>
                      <ComparisonCell value={row.guidance} />
                    </td>
                    <td className="text-center py-3 px-4" data-testid={`cell-ug-govt-${index}`}>
                      <ComparisonCell value={row.govt} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </div>
    </section>
  );
}