
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Close menu when route changes
    setIsMenuOpen(false);
  }, [location]);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { name: 'About', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Team', path: '/team' },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrollPosition > 20 
          ? 'bg-white/80 backdrop-blur-md shadow-sm' 
          : 'bg-transparent'
      }`}
    >
      <div className="container-custom h-20 flex items-center justify-between">
        <Link 
          to="/" 
          className="text-2xl font-medium tracking-tight hover:opacity-80 transition-opacity"
        >
          noievoi
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-10">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`relative py-2 text-sm tracking-wide font-medium hover:text-black transition-colors ${
                isActive(item.path) 
                  ? 'text-black after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-black'
                  : 'text-gray-600'
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden flex items-center"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          <Menu className={`w-6 h-6 transition-opacity duration-300 ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`} />
        </button>

        {/* Mobile Menu */}
        <div 
          className={`fixed inset-y-0 right-0 w-[75%] max-w-sm bg-white shadow-lg z-50 transition-transform duration-300 ease-in-out ${
            isMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="h-20 flex items-center justify-end px-6">
            <button 
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center"
              aria-label="Close menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <nav className="flex flex-col px-6 py-8 space-y-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-lg font-medium ${
                  isActive(item.path) ? 'text-black' : 'text-gray-600'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        {/* Overlay when mobile menu is open */}
        {isMenuOpen && (
          <div 
            className="md:hidden fixed inset-0 bg-black/20 z-40 animate-fade-in"
            onClick={() => setIsMenuOpen(false)}
          />
        )}
      </div>
    </header>
  );
};

export default Header;
