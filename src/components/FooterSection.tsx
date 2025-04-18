
import React from 'react';
import Logo from './Logo';

const FooterSection = () => {
  const footerLinks = [
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
  ];

  return (
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
          
          {footerLinks.map((section) => (
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
  );
};

export default FooterSection;
