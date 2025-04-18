import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowRight, CheckCircle2, BookOpen, Users, 
  Award, Laptop, Menu, X, FileText, Trophy,
  Sparkles, Rocket, Stars, GraduationCap, 
  Brain, Target, Lightbulb
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import Logo from '@/components/Logo';
import FeatureSection, { features } from '@/components/FeatureSection';
import { LogOut } from 'lucide-react';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem('user');
    setIsLoggedIn(!!user);
  }, []);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const navItems = [
    { name: 'Teacher Hub', href: '/teacher-dashboard' },
    { name: 'Student Portal', href: '/student-dashboard' },
    { name: 'Skill Hub', href: '/code-editor' },
    { name: 'Resume Builder', href: '#resume-builder' }
  ];

  return (
    <>
      <div className="min-h-screen flex flex-col">
        <nav className="sticky top-0 bg-white/80 backdrop-blur-md z-50 border-b border-gray-200">
          <div className="container-custom flex justify-between items-center h-16">
            <Link to="/">
              <Logo className="z-50" />
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              <ul className="flex gap-6">
                {navItems.map((item) => (
                  <li key={item.name}>
                    <Link 
                      to={item.href}
                      className="font-medium text-eduGray hover:text-eduBlue transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
              {isLoggedIn ? (
                <Link to="/logout">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </Button>
                </Link>
              ) : (
                <div className="flex items-center gap-3">
                  <Link to="/login">
                    <Button variant="outline" size="sm">Log In</Button>
                  </Link>
                  <Link to="/signup">
                    <Button size="sm">Sign Up Free</Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden text-eduGray z-50" 
              onClick={toggleMenu}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

            {/* Mobile Menu */}
            {isMenuOpen && (
              <div className="fixed inset-0 bg-white flex flex-col justify-center items-center md:hidden z-40">
                <ul className="flex flex-col gap-6 text-center">
                  {navItems.map((item) => (
                    <li key={item.name}>
                      <Link 
                        to={item.href}
                        className="text-xl font-medium text-eduGray hover:text-eduBlue transition-colors"
                        onClick={toggleMenu}
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                  {isLoggedIn && (
                    <li>
                      <Link 
                        to="/logout"
                        className="text-xl font-medium text-red-600 hover:text-red-700 transition-colors flex items-center justify-center gap-2"
                        onClick={toggleMenu}
                      >
                        <LogOut className="h-5 w-5" />
                        Logout
                      </Link>
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>
        </nav>

        <main className="flex-grow">
          {/* Hero Section */}
          <section className="min-h-[90vh] flex flex-col justify-center relative overflow-hidden">
            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-br from-eduBlue/30 via-white to-eduYellow/30 animate-gradient-xy">
              {/* Floating icons background */}
              <div className="absolute inset-0 overflow-hidden">
                {[Sparkles, Brain, Target, Lightbulb, GraduationCap].map((Icon, index) => (
                  <div
                    key={index}
                    className={`absolute animate-float-${index + 1} opacity-10`}
                    style={{
                      top: `${Math.random() * 100}%`,
                      left: `${Math.random() * 100}%`,
                      animation: `float ${10 + index * 2}s ease-in-out infinite`,
                      animationDelay: `${index * 0.5}s`
                    }}
                  >
                    <Icon className="w-12 h-12 text-eduBlue" />
                  </div>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="container-custom py-8 md:py-12 relative z-10">
              <div className="text-center max-w-4xl mx-auto animate-fade-in">
                {/* Enhanced announcement banner */}
                <Button
                  className="inline-flex items-center bg-white/90 backdrop-blur-sm rounded-full px-6 py-3 mb-8 border border-eduBlue/20 shadow-lg hover:shadow-xl transition-all duration-300 group"
                  variant="ghost"
                  onClick={() => navigate('/video-summary')}
                >
                  <span className="bg-eduBlue text-white rounded-full px-4 py-1.5 text-sm font-medium group-hover:scale-105 transition-transform">
                    <Sparkles className="w-4 h-4 inline-block mr-1 animate-pulse" />
                    Learn Genie
                  </span>
                  <span className="text-eduGray ml-3 text-sm group-hover:text-eduBlue transition-colors">
                    Introducing A.I Powered Learning
                    <ArrowRight className="w-4 h-4 inline-block ml-1 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Button>
                
                {/* Enhanced heading with animated gradient text */}
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight animate-fade-in-up">
                  Elevate{' '}
                  <span className="text-eduBlue animate-gradient-text">Learning</span>{' '}
                  with Interactive{' '}
                  <span className="text-eduYellow animate-bounce-slow">Skills</span>
                </h1>
                
                {/* Enhanced description */}
                <p className="text-lg md:text-xl text-gray-700 mb-8 mx-auto max-w-2xl animate-fade-in-up delay-200">
                  Connect teachers, students, and resources in one unified platform designed to make skill acquisition engaging and effective for the modern educational journey.
                </p>
                
                {/* Enhanced CTA buttons */}
                <div className="flex flex-wrap justify-center gap-6 mb-12 animate-fade-in-up delay-300">
                  <Button 
                    className="group bg-eduBlue hover:bg-eduBlue/90 text-white transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-eduBlue/50" 
                    size="lg" 
                    onClick={() => navigate('/student-dashboard')}
                  >
                    <Rocket className="h-5 w-5 mr-2 group-hover:animate-rocket" />
                    Start Learning
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  <Button 
                    className="group bg-eduYellow hover:bg-eduYellow/90 text-white transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-eduYellow/50" 
                    size="lg" 
                    onClick={() => navigate('/assessment')}
                  >
                    <Trophy className="h-5 w-5 mr-2 group-hover:rotate-12 transition-transform" />
                    Take Assessment
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  <Button 
                    className="group border-eduBlue text-eduBlue hover:bg-eduBlue hover:text-white transform hover:scale-105 transition-all duration-300" 
                    size="lg" 
                    variant="outline"
                    onClick={() => navigate('/teacher-dashboard')}
                  >
                    <GraduationCap className="h-5 w-5 mr-2 group-hover:rotate-12 transition-transform" />
                    For Teachers
                  </Button>
                </div>

                {/* Rest of the hero section content remains the same */}
              </div>
            </div>
          </section>

          {/* Features Section */}
          <div className="py-16 bg-gradient-to-b from-white via-eduBlue/5 to-white">
            {features.map((feature) => (
              <FeatureSection
                key={feature.id}
                {...feature}
              />
            ))}
          </div>

          {/* Footer Section */}
          <footer className="bg-eduGray text-white pt-16 pb-8">
            <div className="container-custom">
              <div className="grid grid-cols-2 md:grid-cols-12 gap-8">
                <div className="col-span-2 md:col-span-4">
                  <Logo variant="white" className="mb-6" />
                  <p className="text-gray-300 mb-6">
                    Connecting teachers, students, and resources in one unified platform designed to make skill acquisition engaging and effective.
                  </p>
                  <div className="flex space-x-4">
                    {['facebook', 'twitter', 'instagram', 'linkedin'].map((social) => (
                      <a 
                        key={social} 
                        href="#" 
                        className="bg-white/10 hover:bg-white/20 transition-colors p-2 rounded-full"
                        aria-label={`Follow on ${social}`}
                      >
                        <div className="w-5 h-5" />
                      </a>
                    ))}
                  </div>
                </div>
                
                {[
                  {
                    title: 'Product',
                    links: [
                      { name: 'Teacher Hub', href: '#teacher-hub' },
                      { name: 'Student Portal', href: '#student-portal' },
                      { name: 'Skill Hub', href: '#skill-hub' },
                      { name: 'Resume Builder', href: '#resume-builder' },
                      { name: 'Flashcards', href: '#' }
                    ]
                  },
                  {
                    title: 'Company',
                    links: [
                      { name: 'About Us', href: '#' },
                      { name: 'Careers', href: '#' },
                      { name: 'Blog', href: '#' },
                      { name: 'Press', href: '#' }
                    ]
                  },
                  {
                    title: 'Resources',
                    links: [
                      { name: 'Documentation', href: '#' },
                      { name: 'Help Center', href: '#' },
                      { name: 'Community', href: '#' },
                      { name: 'Webinars', href: '#' }
                    ]
                  },
                  {
                    title: 'Legal',
                    links: [
                      { name: 'Terms of Service', href: '#' },
                      { name: 'Privacy Policy', href: '#' },
                      { name: 'Cookie Policy', href: '#' },
                      { name: 'GDPR', href: '#' }
                    ]
                  }
                ].map((section) => (
                  <div key={section.title} className="col-span-1 md:col-span-2">
                    <h4 className="font-heading font-semibold text-white mb-4">{section.title}</h4>
                    <ul className="space-y-2">
                      {section.links.map((link) => (
                        <li key={link.name}>
                          <a 
                            href={link.href} 
                            className="text-gray-300 hover:text-eduYellow transition-colors text-sm"
                          >
                            {link.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-gray-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
                <p className="text-gray-400 text-sm">
                  © {new Date().getFullYear()} EduVerse. All rights reserved.
                </p>
                
                <div className="flex space-x-6 mt-4 md:mt-0">
                  <a href="#" className="text-gray-400 hover:text-eduYellow text-sm">
                    Terms
                  </a>
                  <a href="#" className="text-gray-400 hover:text-eduYellow text-sm">
                    Privacy
                  </a>
                  <a href="#" className="text-gray-400 hover:text-eduYellow text-sm">
                    Cookies
                  </a>
                </div>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </>
  );
};

export default LandingPage;