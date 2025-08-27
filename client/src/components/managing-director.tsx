import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Quote } from "lucide-react";
import mdImage from "@assets/MD.png";

export default function ManagingDirector() {
  return (
    <section id="director" className="py-20 gradient-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <GlassCard variant="strong" className="p-8">
            <img 
              src={mdImage} 
              alt="Managing Director" 
              className="w-full h-96 object-cover object-center rounded-xl"
              loading="lazy"
              data-testid="img-managing-director"
              style={{ minHeight: '384px' }}
            />
          </GlassCard>
          
          <div className="space-y-6">
            <div>
              <h2 className="text-4xl font-bold text-brand-navy mb-2" data-testid="text-md-title">Managing Director</h2>
              <h3 className="text-2xl font-semibold text-brand-green mb-4" data-testid="text-md-name">Mr. Akhilesh Yadav</h3>
              <p className="text-lg text-gray-600 mb-6" data-testid="text-md-credentials">Founder of AAS Eduguide Pvt. Ltd. (formerly called as All Admission Servies)</p>
            </div>
            
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p data-testid="text-md-description-1">
                With over 13 years in medical admission counseling, Mr. Akhilesh Yadav founded AAS Eduguide with a vision to democratize access to medical education through ethical, transparent guidance.
              </p>
              <p data-testid="text-md-description-2">
                His philosophy centers on empowering students with data-driven insights and honest counseling, ensuring every student makes informed decisions about their medical career path.
              </p>
            </div>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  className="btn-primary text-white px-6 py-3 font-medium flex items-center space-x-2"
                  data-testid="button-md-message"
                >
                  <Quote className="w-5 h-5" />
                  <span>Message from the MD</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-2xl bg-white border-2 border-brand-green/20 shadow-2xl">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold text-brand-navy">Message from the Managing Director</DialogTitle>
                  <DialogDescription className="text-lg text-gray-600 mt-4">
                    Mr. Akhilesh Yadav shares his vision for medical education counseling
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 text-gray-800 leading-relaxed mt-6">
                  <p>
                    "When I started AAS Eduguide 14 years ago, my vision was simple yet ambitious: to ensure that no deserving student loses their chance at a medical career due to lack of proper guidance or misinformation."
                  </p>
                  <p>
                    "Having worked closely with the Medical Education Board, I witnessed firsthand how complex the admission process has become. The introduction of NEET, multiple quota systems, and varying state policies created a maze that even well-informed families struggle to navigate."
                  </p>
                  <p>
                    "Our approach is built on three pillars: complete transparency, data-driven decision making, and ethical practices. We never promise what we cannot deliver, and we always put the student's best interests first."
                  </p>
                  <p>
                    "Today, as we continue to evolve with changing policies and new admission pathways, our commitment remains unchanged - to be the most trusted partner in every student's medical education journey."
                  </p>
                  <div className="text-right mt-6">
                    <p className="font-semibold text-brand-navy">Mr. Akhilesh Yadav</p>
                    <p className="text-sm text-gray-600">Managing Director, AAS Eduguide Pvt. Ltd.</p>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </section>
  );
}
