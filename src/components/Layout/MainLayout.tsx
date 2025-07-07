import React, { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const location = useLocation();

  const hideHeader = ['/', '/login', '/signup'].includes(location.pathname);
  const hideFooter = ['/login', '/signup'].includes(location.pathname);
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {!hideHeader && <Header />}
      <main className="flex-grow">{children}</main>
      {!hideFooter && <Footer />}
    </div>
  );
};

export default MainLayout;