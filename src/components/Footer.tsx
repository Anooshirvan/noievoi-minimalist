
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-50 border-t border-gray-100">
      <div className="container-custom py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <Link to="/" className="text-xl font-medium tracking-tight">
              noievoi
            </Link>
            <p className="mt-4 text-gray-600 max-w-md">
              International experts in diverse industries providing exceptional solutions through our extensive global network.
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">
              Pages
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-gray-600 hover:text-black transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-600 hover:text-black transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/team" className="text-gray-600 hover:text-black transition-colors">
                  Team
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">
              Contact
            </h3>
            <address className="not-italic text-gray-600">
              <p>info@noievoi.com</p>
              <p className="mt-2">+1 (000) 000-0000</p>
            </address>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col md:flex-row md:items-center justify-between">
          <p className="text-gray-500 text-sm">
            © {currentYear} noievoi. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0 flex space-x-6">
            <a href="#" className="text-gray-500 hover:text-black transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-500 hover:text-black transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
