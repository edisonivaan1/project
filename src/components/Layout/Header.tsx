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
      className="px-6 py-2 border border-blue-600 text-blue-600 rounded-full hover:bg-blue-50 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      aria-label="Go to login page"
    >
      LOGIN
    </button>
  );

  // Componente para el usuario autenticado
  const userSection = isAuthenticated && user ? (
    <div className="flex items-center space-x-4">
      <Link 
        to="/profile"
        className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg px-2 py-1"
        aria-label={`Go to ${user.first_name} ${user.last_name}'s profile`}
      >
        <User className="h-5 w-5" aria-hidden="true" />
        <span className="font-medium">{user.first_name} {user.last_name}</span>
      </Link>
      <button
        onClick={handleLogout}
        className="flex items-center space-x-1 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        title="Logout"
        aria-label="Logout from your account"
      >
        <LogOut className="h-5 w-5" aria-hidden="true" />
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
            <Link to="/" className="flex items-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg">
              <img src={logo} alt="Grammar Master Pro - Learn English Grammar" className="h-16 w-auto" />
            </Link>
            {!isLoginPage && loginButton}
          </div>
        </div>
      </header>
    );
  }
  
  // Para las demás páginas, mostramos la navegación completa
  return (
    <header className="bg-white shadow-sm" role="banner">
      <div className="container-custom py-4">
        <div className="flex items-center justify-between">
          {/* Logo y navegación principal agrupados */}
          <div className="flex items-center space-x-8">
            <Link 
              to="/" 
              className="flex items-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg"
              aria-label="Grammar Master Pro - Ir a página de inicio"
            >
              <img 
                src={logo} 
                alt="Grammar Master Pro - Logotipo de la aplicación para aprender gramática inglesa" 
                className="h-32 w-auto"
                tabIndex={0}
                role="img"
              />
            </Link>
            
            {/* Navegación principal al lado del logo */}
            <nav 
              id="navigation"
              className="hidden md:flex items-center space-x-8" 
              role="navigation" 
              aria-label="Navegación principal de la aplicación"
            >
              <Link 
                to="/topics" 
                className={`flex items-center space-x-2 font-medium text-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg px-2 py-1 ${
                  isActive('/topics') ? 'text-[rgb(var(--color-button))]' : 'text-gray-700 hover:text-blue-600'
                }`}
                aria-label="Explorar temas de gramática inglesa"
                aria-current={isActive('/topics') ? 'page' : undefined}
              >
                <Home className={`h-6 w-6 ${isActive('/topics') ? 'text-[rgb(var(--color-button))]' : ''}`} aria-hidden="true" />
                <span>Topics</span>
              </Link>
              <Link 
                to="/settings" 
                className={`flex items-center space-x-2 font-medium text-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg px-2 py-1 ${
                  isActive('/settings') ? 'text-[rgb(var(--color-button))]' : 'text-gray-700 hover:text-blue-600'
                }`}
                aria-label="Configuración de la aplicación"
                aria-current={isActive('/settings') ? 'page' : undefined}
              >
                <Settings className={`h-6 w-6 ${isActive('/settings') ? 'text-[rgb(var(--color-button))]' : ''}`} aria-hidden="true" />
                <span>Configuration</span>
              </Link>
              <Link 
                to="/help" 
                className={`flex items-center space-x-2 font-medium text-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg px-2 py-1 ${
                  isActive('/help') ? 'text-[rgb(var(--color-button))]' : 'text-gray-700 hover:text-blue-600'
                }`}
                aria-label="Obtener ayuda y soporte técnico"
                aria-current={isActive('/help') ? 'page' : undefined}
              >
                <HelpCircle className={`h-6 w-6 ${isActive('/help') ? 'text-[rgb(var(--color-button))]' : ''}`} aria-hidden="true" />
                <span>Help</span>
              </Link>
            </nav>
          </div>
          
          {/* User section - desktop */}
          <div className="hidden md:block">
            {userSection}
          </div>

          {/* Mobile menu and user section */}
          <div className="flex md:hidden items-center space-x-2">
            {userSection}
            <button 
              className="text-text hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg p-2"
              aria-label="Abrir menú de navegación móvil"
              aria-expanded="false"
              aria-controls="mobile-navigation"
              tabIndex={0}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor" 
                className="w-6 h-6"
                aria-hidden="true"
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