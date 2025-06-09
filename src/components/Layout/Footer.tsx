import React from 'react';
import { Heart } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Footer: React.FC = () => {
  const location = useLocation();
  
  // Don't show the footer on the game activity screen
  if (location.pathname.includes('/game/')) {
    return null;
  }

  return (
    <footer className="bg-white shadow-inner mt-auto">
      <div className="container-custom py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-gray-600">
              © {new Date().getFullYear()} GrammarQuest. All rights reserved.
            </p>
          </div>
          
          <div className="flex items-center justify-center space-x-6">
            <Link to="/privacy" className="text-sm text-gray-600 hover:text-primary">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-sm text-gray-600 hover:text-primary">
              Terms of Service
            </Link>
            <Link to="/contact" className="text-sm text-gray-600 hover:text-primary">
              Contact Us
            </Link>
          </div>
          
          <div className="mt-4 md:mt-0 flex items-center text-sm text-gray-600">
            <span>Made with</span>
            <Heart className="h-4 w-4 mx-1 text-error" />
            <span>for English learners</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;