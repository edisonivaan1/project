import React, { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {location.pathname !== '/' && <Header />}
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
};

export default MainLayout;