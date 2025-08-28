import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  TrendingUp, 
  Heart, 
  Award, 
  MapPin, 
  Clock, 
  Briefcase, 
  GraduationCap,
  Phone,
  Mail,
  ExternalLink,
  CheckCircle,
  Star
} from "lucide-react";

const jobRoles = [
  {
    title: "Admission Counsellor",
    department: "Counselling",
    type: "Full-time",
    experience: "0-3 years",
    location: "Kanpur",
    description: "Guide students through medical admission processes, provide personalized counseling, and help them achieve their dreams.",
    skills: ["Communication", "Counseling", "NEET Knowledge", "Student Psychology"],
    popular: true
  },
  {
    title: "Digital Marketing Executive",
    department: "Marketing",
    type: "Full-time", 
    experience: "1-3 years",
    location: "Kanpur",
    description: "Drive digital marketing campaigns, manage social media, and enhance our online presence to reach more students.",
    skills: ["SEO/SEM", "Social Media", "Content Marketing", "Analytics"],
    popular: false
  },
  {
    title: "Telecaller",
    department: "Operations",
    type: "Full-time",
    experience: "0-2 years", 
    location: "Kanpur",
    description: "Connect with prospective students, provide initial guidance, and schedule counseling sessions.",
    skills: ["Communication", "Sales", "Customer Service", "CRM"],
    popular: false
  },
  {
    title: "Business Development Executive",
    department: "Business Development",
    type: "Full-time",
    experience: "2-5 years",
    location: "Kanpur",
    description: "Identify new business opportunities, build partnerships, and expand our reach in the education sector.",
    skills: ["Business Strategy", "Networking", "Sales", "Market Research"],
    popular: false
  },
  // {
  //   title: "HR Executive",
  //   department: "Human Resources",
  //   type: "Full-time",
  //   experience: "1-3 years",
  //   location: "Kanpur", 
  //   description: "Manage recruitment, employee relations, and organizational development to build a strong team.",
  //   skills: ["Recruitment", "Employee Relations", "HR Policies", "Training"],
  //   popular: false
  // },
  {
    title: "Content Writer",
    department: "Content",
    type: "Full-time",
    experience: "1-2 years",
    location: "Kanpur",
    description: "Create engaging academic content, blogs, and educational materials for our students and website.",
    skills: ["Academic Writing", "Research", "SEO Writing", "Medical Knowledge"],
    popular: false
  },
  // {
  //   title: "Graphic Designer",
  //   department: "Creative",
  //   type: "Full-time",
  //   experience: "1-3 years",
  //   location: "Kanpur",
  //   description: "Design marketing materials, social media graphics, and educational content to enhance our brand.",
  //   skills: ["Adobe Creative Suite", "UI/UX Design", "Brand Design", "Social Media Graphics"],
  //   popular: false
  // }
];

const benefits = [
  {
    icon: <TrendingUp className="w-6 h-6" />,
    title: "Career Growth",
    description: "Clear career progression paths with regular skill development opportunities"
  },
  {
    icon: <Heart className="w-6 h-6" />,
    title: "Work-Life Balance", 
    description: "Flexible working hours and supportive work environment"
  },
  {
    icon: <Award className="w-6 h-6" />,
    title: "Recognition & Rewards",
    description: "Performance-based incentives and recognition programs"
  },
  {
    icon: <GraduationCap className="w-6 h-6" />,
    title: "Learning & Development",
    description: "Continuous training programs and educational support"
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "Team Culture",
    description: "Collaborative and inclusive work environment with passionate colleagues"
  },
  {
    icon: <CheckCircle className="w-6 h-6" />,
    title: "Job Security",
    description: "Stable employment with a growing company in the education sector"
  }
];

const companyStats = [
  { number: "13+", label: "Years Experience" },
  { number: "2L+", label: "Students Guided" },
  { number: "150+", label: "Team Members" },
  { number: "24×7", label: "Support Available" }
];

export default function Careers() {
  const applyNow = () => {
    window.open("https://forms.gle/d6Nt8319c5wZg8EF9", "_blank");
  };

  return (
    <section id="careers" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-brand-green/10 text-brand-green px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Briefcase className="w-4 h-4" />
            <span>Join Our Team</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-brand-navy mb-6">
            Build Your Career with 
            <span className="text-brand-green"> AAS Eduguide</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Join India's leading medical admission counseling company and help shape the future of thousands of medical aspirants while growing your own career.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={applyNow}
              className="btn-primary text-white px-8 py-3 text-lg font-medium"
            >
              Apply Now <ExternalLink className="w-5 h-5 ml-2" />
            </Button>
            <Button 
              variant="outline"
              className="border-brand-green text-brand-green hover:bg-brand-green hover:text-white px-8 py-3 text-lg font-medium"
              onClick={() => document.getElementById('open-positions')?.scrollIntoView({ behavior: 'smooth' })}
            >
              View Positions
            </Button>
          </div>
        </div>

        {/* Company Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {companyStats.map((stat, index) => (
            <GlassCard key={index} className="p-6 text-center">
              <div className="text-3xl font-bold text-brand-green mb-2">{stat.number}</div>
              <div className="text-gray-600 font-medium">{stat.label}</div>
            </GlassCard>
          ))}
        </div>

        {/* Why Join Us */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-navy mb-4">
              Why Choose AAS Eduguide?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We believe in building a strong, passionate, and innovative workforce that shares our vision of excellence in education consultancy.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <GlassCard key={index} className="p-6 hover-lift">
                <div className="w-12 h-12 bg-brand-green/10 rounded-lg flex items-center justify-center text-brand-green mb-4">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-semibold text-brand-navy mb-3">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </GlassCard>
            ))}
          </div>
        </div>

        {/* Open Positions */}
        <div id="open-positions" className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-navy mb-4">
              Open Positions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore exciting career opportunities across different departments and find the perfect role that matches your skills and aspirations.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {jobRoles.map((job, index) => (
              <GlassCard key={index} className={`p-6 hover-lift relative ${job.popular ? 'border-2 border-brand-green' : ''}`}>
                {job.popular && (
                  <Badge className="bg-brand-green text-white text-xs font-bold absolute -top-3 left-4">
                    POPULAR
                  </Badge>
                )}
                
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-brand-navy mb-2">{job.title}</h3>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <Badge variant="outline" className="text-xs">{job.department}</Badge>
                    <Badge variant="outline" className="text-xs">{job.type}</Badge>
                  </div>
                </div>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-sm text-gray-600">
                    <Briefcase className="w-4 h-4 mr-2" />
                    {job.experience}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    {job.location}
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm mb-4">{job.description}</p>
                
                <div className="mb-6">
                  <div className="text-sm font-medium text-brand-navy mb-2">Key Skills:</div>
                  <div className="flex flex-wrap gap-1">
                    {job.skills.map((skill, skillIndex) => (
                      <span key={skillIndex} className="bg-brand-green/10 text-brand-green text-xs px-2 py-1 rounded">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                
                <Button 
                  onClick={applyNow}
                  className="w-full btn-primary text-white py-2 font-medium"
                >
                  Apply Now
                </Button>
              </GlassCard>
            ))}
          </div>
        </div>

        {/* Application Process */}
        <GlassCard className="p-8 mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-brand-navy mb-4">Application Process</h2>
            <p className="text-gray-600">Simple and transparent hiring process</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-brand-green rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-4">1</div>
              <h3 className="font-semibold text-brand-navy mb-2">Apply Online</h3>
              <p className="text-sm text-gray-600">Fill out our comprehensive application form with your details and upload your resume</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-brand-green rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-4">2</div>
              <h3 className="font-semibold text-brand-navy mb-2">Initial Screening</h3>
              <p className="text-sm text-gray-600">Our HR team reviews your application and contacts shortlisted candidates</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-brand-green rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-4">3</div>
              <h3 className="font-semibold text-brand-navy mb-2">Interview Process</h3>
              <p className="text-sm text-gray-600">Face-to-face or virtual interviews with our team to assess your fit</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-brand-green rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-4">4</div>
              <h3 className="font-semibold text-brand-navy mb-2">Welcome Aboard</h3>
              <p className="text-sm text-gray-600">Join our team and start your journey with comprehensive onboarding</p>
            </div>
          </div>
        </GlassCard>

        {/* Contact HR */}
        <GlassCard className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl font-bold text-brand-navy mb-4">Have Questions?</h2>
              <p className="text-gray-600 mb-6">
                Our HR team is here to help you with any questions about career opportunities, application process, or company culture.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-brand-green/10 rounded-lg flex items-center justify-center">
                    <Mail className="w-5 h-5 text-brand-green" />
                  </div>
                  <div>
                    <div className="font-medium text-brand-navy">Email HR</div>
                    <div className="text-gray-600">alladmission1@gmail.com</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-brand-green/10 rounded-lg flex items-center justify-center">
                    <Phone className="w-5 h-5 text-brand-green" />
                  </div>
                  <div>
                    <div className="font-medium text-brand-navy">Call HR</div>
                    <div className="text-gray-600">+91-8565001261</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-brand-green/10 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-brand-green" />
                  </div>
                  <div>
                    <div className="font-medium text-brand-navy">Office Hours</div>
                    <div className="text-gray-600">Mon-Sat: 10 AM - 6 PM</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <div className="bg-gradient-to-br from-brand-green/10 to-brand-navy/10 rounded-2xl p-8">
                <Star className="w-16 h-16 text-brand-green mx-auto mb-4" />
                <h3 className="text-xl font-bold text-brand-navy mb-2">Ready to Join?</h3>
                <p className="text-gray-600 mb-6">
                  Take the first step towards an exciting career in education consultancy
                </p>
                <Button 
                  onClick={applyNow}
                  className="btn-primary text-white px-8 py-3 font-medium"
                >
                  Apply Now <ExternalLink className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
    </section>
  );
}