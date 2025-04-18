
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CTASection = () => {
  return (
    <section className="section-padding bg-eduBlue">
      <div className="container-custom">
        <div className="rounded-3xl bg-gradient-to-br from-eduBlue to-blue-700 p-8 md:p-12 lg:p-16 relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-eduYellow/20 rounded-full -translate-x-1/3 translate-y-1/3" />
          
          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Transform Your Educational Experience?
            </h2>
            
            <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of educators and students already using our platform to create engaging, skills-focused learning experiences.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" className="bg-white text-eduBlue hover:bg-gray-100">
                Start for Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-blue-700">
                Request Demo
              </Button>
            </div>
            
            <p className="text-sm text-blue-100 mt-6">
              No credit card required. Free plan includes core features.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
