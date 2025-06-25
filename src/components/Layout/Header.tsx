import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Settings, HelpCircle, Home } from 'lucide-react';
import logo from '../../Assets/logo_GrammarMasterPro.png';

const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === '/';
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  // Estilo para el botón de login
  const loginButton = (
    <button 
      onClick={() => navigate('/login')}
      className="px-6 py-2 border border-blue-600 text-blue-600 rounded-full hover:bg-blue-50 transition-colors font-medium"
    >
      LOGIN
    </button>
  );
  
  // Si estamos en la página de inicio, mostramos solo el logo y el botón de login
  if (isHomePage) {
    return (
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center">
              <img src={logo} alt="Grammar Master Pro Logo" className="h-16 w-auto" />
            </Link>
            {loginButton}
          </div>
        </div>
      </header>
    );
  }
  
  // Para las demás páginas, mostramos la navegación completa
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