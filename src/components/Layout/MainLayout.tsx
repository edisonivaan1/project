import React, { ReactNode, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import KeyboardNavigationHelp from '../UI/KeyboardNavigationHelp';
import { useKeyboardNavigation } from '../../hooks/useKeyboardNavigation';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const location = useLocation();
  const { focusFirst } = useKeyboardNavigation({
    enableArrowKeys: true,
    enableHomeEnd: true,
    enablePageUpDown: true,
    onNavigate: (direction) => {
      // Anunciar la dirección de navegación para usuarios de lectores de pantalla
      const announcement = direction === 'next' ? 'Navegando al siguiente elemento' :
                          direction === 'previous' ? 'Navegando al elemento anterior' :
                          direction === 'first' ? 'Navegando al primer elemento' :
                          'Navegando al último elemento';
      
      // Crear anuncio temporal
      const announcer = document.createElement('div');
      announcer.setAttribute('aria-live', 'polite');
      announcer.className = 'sr-only';
      announcer.textContent = announcement;
      document.body.appendChild(announcer);
      
      setTimeout(() => {
        document.body.removeChild(announcer);
      }, 1000);
    }
  });

  const hideHeader = ['/login', '/signup'].includes(location.pathname);
  const hideFooter = ['/login', '/signup'].includes(location.pathname);

  // Enfocar el primer elemento cuando cambie la ruta
  useEffect(() => {
    const timer = setTimeout(() => {
      const skipLink = document.querySelector('.skip-link') as HTMLElement;
      if (skipLink) {
        skipLink.focus();
      } else {
        focusFirst();
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [location.pathname, focusFirst]);
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Skip links for keyboard navigation */}
      <div className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-50">
        <a 
          href="#main-content" 
          className="skip-link bg-blue-600 text-white px-4 py-2 rounded-b-md focus:outline-none focus:ring-2 focus:ring-blue-300"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              const mainContent = document.getElementById('main-content');
              mainContent?.focus();
            }
          }}
        >
          Saltar al contenido principal (Enter)
        </a>
        <a 
          href="#navigation" 
          className="skip-link bg-blue-600 text-white px-4 py-2 rounded-b-md focus:outline-none focus:ring-2 focus:ring-blue-300 ml-2"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              const navigation = document.getElementById('navigation');
              navigation?.focus();
            }
          }}
        >
          Saltar a la navegación (Enter)
        </a>
      </div>
      
      {!hideHeader && <Header />}
      <main 
        id="main-content" 
        className="flex-grow focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-inset" 
        tabIndex={-1}
        role="main"
        aria-label="Contenido principal de la aplicación"
      >
        {children}
      </main>
      {!hideFooter && <Footer />}
      
      {/* Componente de ayuda de navegación por teclado */}
      <KeyboardNavigationHelp />
    </div>
  );
};

export default MainLayout;