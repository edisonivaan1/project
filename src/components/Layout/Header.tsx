import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Settings, HelpCircle, Home } from 'lucide-react';
import logo from '../../Assets/logo_GrammarMasterPro.png';

const Header: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <header className="bg-white shadow-sm">
      <div className="container-custom py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <img src={logo} alt="Grammar Master Pro Logo" className="h-24 w-auto" />
            <span className="text-2xl font-bold text-primary"></span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              to="/" 
              className={`flex items-center space-x-1 font-medium transition-colors ${
                isActive('/') ? 'text-[rgb(var(--color-button))]' : 'hover:text-primary'
              }`}
            >
              <Home className={`h-5 w-5 ${isActive('/') ? 'text-[rgb(var(--color-button))]' : ''}`} />
              <span>Home</span>
            </Link>
            <Link 
              to="/settings" 
              className={`flex items-center space-x-1 font-medium transition-colors ${
                isActive('/settings') ? 'text-[rgb(var(--color-button))]' : 'hover:text-primary'
              }`}
            >
              <Settings className={`h-5 w-5 ${isActive('/settings') ? 'text-[rgb(var(--color-button))]' : ''}`} />
              <span>Settings</span>
            </Link>
            <Link 
              to="/help" 
              className={`flex items-center space-x-1 font-medium transition-colors ${
                isActive('/help') ? 'text-[rgb(var(--color-button))]' : 'hover:text-primary'
              }`}
            >
              <HelpCircle className={`h-5 w-5 ${isActive('/help') ? 'text-[rgb(var(--color-button))]' : ''}`} />
              <span>Help</span>
            </Link>
          </nav>
          
          <div className="flex md:hidden">
            <button className="text-text hover:text-primary transition-colors">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor" 
                className="w-6 h-6"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;