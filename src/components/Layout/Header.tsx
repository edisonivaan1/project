import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Settings, HelpCircle, Home, LogOut, User } from 'lucide-react';
import logo from '../../assets/logo_GrammarMasterPro.png';
import { useAuth } from '../../contexts/AuthContext';

const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const isHomePage = location.pathname === '/';
  const isLoginPage = location.pathname === '/login' || location.pathname === '/signup';
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const handleLogout = () => {
    logout();
    navigate('/');
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

  // Componente para el usuario autenticado
  const userSection = isAuthenticated && user ? (
    <div className="flex items-center space-x-4">
      <Link 
        to="/profile"
        className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors"
      >
        <User className="h-5 w-5" />
        <span className="font-medium">{user.first_name} {user.last_name}</span>
      </Link>
      <button
        onClick={handleLogout}
        className="flex items-center space-x-1 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        title="Logout"
      >
        <LogOut className="h-5 w-5" />
        <span className="font-medium">Logout</span>
      </button>
    </div>
  ) : null;
  
  // Si estamos en páginas públicas y no autenticado
  if ((isHomePage || isLoginPage) && !isAuthenticated) {
    return (
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center">
              <img src={logo} alt="Grammar Master Pro Logo" className="h-16 w-auto" />
            </Link>
            {!isLoginPage && loginButton}
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
              to="/topics" 
              className={`flex items-center space-x-1 font-medium transition-colors ${
                isActive('/topics') ? 'text-[rgb(var(--color-button))]' : 'hover:text-primary'
              }`}
            >
              <Home className={`h-5 w-5 ${isActive('/topics') ? 'text-[rgb(var(--color-button))]' : ''}`} />
              <span>Topics</span>
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
          
          {/* User section - desktop */}
          <div className="hidden md:block">
            {userSection}
          </div>

          {/* Mobile menu and user section */}
          <div className="flex md:hidden items-center space-x-2">
            {userSection}
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