
import React, { useState, useEffect } from 'react';
import { Menu, X, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from './Logo';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

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
                <a 
                  href={item.href}
                  className="font-medium text-eduGray hover:text-eduBlue transition-colors"
                >
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-3">
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
              <>
                <Link to="/login">
                  <Button variant="outline" size="sm">Log In</Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm">Sign Up Free</Button>
                </Link>
              </>
            )}
          </div>
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
                  <a 
                    href={item.href}
                    className="text-xl font-medium text-eduGray hover:text-eduBlue transition-colors"
                    onClick={toggleMenu}
                  >
                    {item.name}
                  </a>
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
  );
};

export default Navbar;
