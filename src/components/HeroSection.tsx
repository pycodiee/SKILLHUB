
import React from 'react';
import { ArrowRight, CheckCircle2, BookOpen, Users, Award, Laptop } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const HeroSection = () => {
  return (
    <div className="min-h-[90vh] flex flex-col justify-center bg-gradient-to-br from-blue-100/50 via-white to-blue-50">
      <div className="container-custom py-8 md:py-12">
        {/* Center aligned hero content */}
        <div className="text-center max-w-4xl mx-auto animate-fade-in">
          <div className="inline-flex items-center bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-gray-100 shadow-sm">
            <span className="bg-eduBlue/10 text-eduBlue rounded-full px-3 py-1 text-sm font-medium">New</span>
            <span className="text-eduGray ml-2 text-sm">Introducing Skill Pathways</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-eduGray mb-6 leading-tight">
            Elevate <span className="text-eduBlue">Learning</span> with Interactive <span className="text-eduYellow">Skills</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-600 mb-8 mx-auto max-w-2xl">
            Connect teachers, students, and resources in one unified platform designed to make skill acquisition engaging and effective for the modern educational journey.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <Button className="btn-primary" size="lg">
              Start Learning
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
            <Button className="btn-secondary" size="lg" variant="outline">
              For Teachers
            </Button>
          </div>
          
          {/* Feature highlights grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              {
                icon: <BookOpen className="h-8 w-8 text-eduBlue mb-2" />,
                title: "Interactive Courses",
                description: "Engage with multimedia content that adapts to your learning style"
              },
              {
                icon: <Users className="h-8 w-8 text-eduBlue mb-2" />,
                title: "Collaborative Learning",
                description: "Connect with peers and educators in real-time discussion forums"
              },
              {
                icon: <Award className="h-8 w-8 text-eduBlue mb-2" />,
                title: "Skill Certifications",
                description: "Earn industry-recognized credentials as you master new skills"
              },
              {
                icon: <Laptop className="h-8 w-8 text-eduBlue mb-2" />,
                title: "Anywhere Access",
                description: "Learn on any device with our responsive platform design"
              }
            ].map((feature, index) => (
              <Card key={index} className="border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="flex flex-col items-center text-center p-6">
                  <div className="rounded-full bg-eduBlue/10 p-4 mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="font-bold text-lg text-eduGray mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Trust indicators */}
          <div className="flex flex-col items-center space-y-6">
            <p className="text-xl font-medium text-eduGray">Trusted by educators and students worldwide</p>
            <div className="flex flex-wrap justify-center gap-8 items-center">
              {['5,000+ Educators', '200+ Institutions', '50,000+ Students', '95% Satisfaction'].map((stat, index) => (
                <div key={index} className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-eduBlue mr-2" />
                  <span className="font-semibold">{stat}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
