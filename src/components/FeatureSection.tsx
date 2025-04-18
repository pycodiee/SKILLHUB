
import React from 'react';
import { Users, BookOpen, Trophy, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FeatureProps {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  features: string[];
  ctaText: string;
  ctaLink: string;
  imagePosition: 'left' | 'right';
  image: string; // Add this line
}

const FeatureSection = ({
  id,
  title,
  description,
  icon: Icon,
  features,
  ctaText,
  ctaLink,
  imagePosition,
  image,
}: FeatureProps) => {
  return (
    <section id={id} className="py-8 md:py-12 bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="container-custom">
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
          imagePosition === 'right' ? 'lg:flex-row-reverse' : ''
        }`}>
          <div className="space-y-6">
            <div className="inline-flex items-center justify-center p-3 bg-eduBlue/10 rounded-xl">
              <Icon className="h-6 w-6 text-eduBlue" />
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-eduGray">{title}</h2>
            
            <p className="text-lg text-gray-600">{description}</p>
            
            <ul className="space-y-3">
              {features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <div className="rounded-full bg-green-50 p-1 mr-3 mt-1">
                    <svg className="h-4 w-4 text-eduBlue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-600">{feature}</span>
                </li>
              ))}
            </ul>
            
            <Button asChild className="mt-4">
              <a href={ctaLink}>{ctaText}</a>
            </Button>
          </div>
          
          
          <div className={`feature-card w-full ${
            imagePosition === 'right' ? 'lg:order-last' : ''
          }`}>
            <div className="relative w-full aspect-[4/3] max-h-[350px] rounded-2xl overflow-hidden 
                          border-2 border-eduBlue/20 group hover:border-eduBlue/50 
                          transition-all duration-300 ease-in-out
                          hover:shadow-2xl hover:shadow-eduBlue/20
                          before:absolute before:inset-0 before:bg-eduBlue/0 
                          before:transition-all before:duration-300
                          hover:before:bg-eduBlue/10">
              <div className="absolute inset-0 bg-gradient-to-tr from-eduBlue/5 to-transparent opacity-0 
                            group-hover:opacity-100 transition-opacity duration-300" />
              <img 
                src={image} 
                alt={title}
                className="absolute inset-0 w-full h-full object-cover object-center 
                          transition-all duration-500 ease-in-out
                          group-hover:scale-105 group-hover:rotate-1
                          filter brightness-95 group-hover:brightness-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-eduBlue/10 
                            opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export const features = [
  {
    id: 'teacher-hub',
    title: 'Teacher Hub',
    description: 'Empower educators with tools to create, manage, and track student progress across interactive learning modules.',
    icon: Users,
    image: '/landing/Screenshot 2025-04-13 013117.png', // Remove 'public' from the path
    features: [
      'Curriculum builder with drag-and-drop interface',
      'Real-time analytics and student progress tracking',
      'Collaborative teaching tools and resource sharing',
      'Automated grading and feedback systems'
    ],
    ctaText: 'Explore Teacher Hub',
    ctaLink: '#',
    imagePosition: 'right' as const
  },
  {
    id: 'student-portal',
    title: 'Student Portal',
    description: 'Engage students with personalized learning paths, interactive content, and real-time progress tracking.',
    icon: BookOpen,
    image: '/landing/teacher dashbaord.png', // Add this line
    features: [
      'Personalized learning dashboard',
      'Interactive lessons and quizzes',
      'Progress tracking and achievement badges',
      'Collaborative study groups and discussion forums'
    ],
    ctaText: 'Discover Student Portal',
    ctaLink: '#',
    imagePosition: 'left' as const
  },
  {
    id: 'skill-hub',
    title: 'Skill Hub & Gamification',
    description: 'Transform learning into an engaging journey with skill trees, achievement badges, and interactive challenges.',
    icon: Trophy,
    image: '/landing/Gamification.png', // Add this line
    features: [
      'Visual skill progression trees',
      'Achievement badges and reward systems',
      'Competitive learning challenges and leaderboards',
      'Level-based progression with unlockable content'
    ],
    ctaText: 'Explore Skill Hub',
    ctaLink: '#',
    imagePosition: 'right' as const
  },
  {
    id: 'resume-builder',
    title: 'Resume Builder',
    description: 'Help students showcase their acquired skills with a professional resume builder that highlights their accomplishments.',
    icon: FileText,
    image: '/landing/resume.jpg', // Add this line
    features: [
      'Skill-based resume templates',
      'Automatic skill certification inclusion',
      'Portfolio integration with project showcases',
      'Direct sharing with potential employers'
    ],
    ctaText: 'Build Your Resume',
    ctaLink: '#',
    imagePosition: 'left' as const
  }
];

export default FeatureSection;
