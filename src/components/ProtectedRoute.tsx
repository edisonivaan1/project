import React, { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  redirectTo = '/' 
}) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 focus:outline-none focus:ring-2 focus:ring-white rounded"
        tabIndex={0}
        role="text"
        aria-label="Authentication verification in progress"
      >
        <div className="text-center">
          <div 
            className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4 focus:outline-none focus:ring-2 focus:ring-white rounded"
            tabIndex={0}
            role="img"
            aria-label="Loading spinner for authentication"
          ></div>
          <p 
            className="text-white text-lg focus:outline-none focus:ring-2 focus:ring-white rounded px-1"
            tabIndex={0}
            role="text"
          >
            Verificando sesión...
          </p>
        </div>
      </div>
    );
  }

  // Si no está autenticado, redirigir al login con la ruta actual para redirección posterior
  if (!isAuthenticated) {
    return (
      <Navigate 
        to={redirectTo} 
        state={{ from: location.pathname }} 
        replace 
      />
    );
  }

  // Si está autenticado, mostrar el contenido
  return <>{children}</>;
};

export default ProtectedRoute; 