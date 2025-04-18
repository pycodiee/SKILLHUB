
import React from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import FeatureSection, { features } from '@/components/FeatureSection';
import CTASection from '@/components/CTASection';
import FooterSection from '@/components/FooterSection';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <HeroSection />
        
        {features.map((feature, index) => (
          <FeatureSection key={index} {...feature} />
        ))}
        
        <CTASection />
      </main>
      <FooterSection />
    </div>
  );
};

export default Index;
