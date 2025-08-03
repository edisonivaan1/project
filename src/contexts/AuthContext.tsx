import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService, handleAuthError } from '../services/api';

interface User {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  profileImage?: string; // Base64 encoded image or null
  gameProgress: {
    levels: any[];
    unlockedDifficulties: string[];
    totalScore: number;
    lastPlayedAt: string | null;
  };
  createdAt: string;
  updatedAt: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (userData: RegisterData) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  securityQuestion: string;
  securityAnswer: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Verificar si hay una sesión activa al cargar la aplicación
  useEffect(() => {
    const checkAuthStatus = async () => {
      const savedToken = localStorage.getItem('authToken');
      
      if (savedToken) {
        try {
          setToken(savedToken);
          const response = await authService.getCurrentUser();
          
          if (response.success && response.user) {
            setUser(response.user);
          } else {
            // Token inválido, limpiar
            localStorage.removeItem('authToken');
            setToken(null);
          }
        } catch (error) {
          console.error('Error verifying token:', error);
          // Token inválido o expirado, limpiar
          localStorage.removeItem('authToken');
          setToken(null);
        }
      }
      
      setIsLoading(false);
    };

    checkAuthStatus();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await authService.login({ email, password });
      
      if (response.success && response.token && response.user) {
        setToken(response.token);
        setUser(response.user);
        localStorage.setItem('authToken', response.token);
        
        return { success: true };
      } else {
        return { success: false, message: response.message || 'Error de login' };
      }
    } catch (error: any) {
      return { success: false, message: handleAuthError(error) };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      setIsLoading(true);
      const response = await authService.register(userData);
      
      if (response.success) {
        // Solo registrar la cuenta, no hacer login automático
        return { success: true };
      } else {
        return { success: false, message: response.message || 'Error de registro' };
      }
    } catch (error: any) {
      return { success: false, message: handleAuthError(error) };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('authToken');
    
    // Limpiar también el progreso local
    localStorage.removeItem('topicProgress');
    localStorage.removeItem('lastQuestions');
    localStorage.removeItem('highestScores');
  };

  const refreshUser = async () => {
    if (!token) return;
    
    try {
      const response = await authService.getCurrentUser();
      if (response.success && response.user) {
        setUser(response.user);
      }
    } catch (error) {
      console.error('Error refreshing user:', error);
      // Si falla, mantener los datos actuales
    }
  };

  const isAuthenticated = !!user && !!token;

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    refreshUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 