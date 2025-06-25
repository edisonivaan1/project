import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import bgLogin from '../assets/bgLogin.png';
import logo from '../assets/logo_GrammarMasterPro.png';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Simular inicio de sesión exitoso
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mostrar notificación de éxito
      toast.success('Inicio de sesión exitoso', {
        position: "top-center",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        onClose: () => {
          // Redirigir a la página de temas después del inicio de sesión exitoso
          navigate('/topics');
        }
      });
    } catch (error) {
      console.error('Error en el inicio de sesión:', error);
      toast.error('Error en las credenciales. Inténtalo de nuevo.');
      setIsLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex relative">
      <ToastContainer />
      {/* Botón de regresar */}
      <div className="absolute top-4 right-4">
        <Link 
          to="/" 
          className="flex items-center text-sm font-medium text-[#007AA2] hover:text-[#005f7a] transition-colors"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5 mr-1" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path 
              fillRule="evenodd" 
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" 
              clipRule="evenodd" 
            />
          </svg>
          Back to Home
        </Link>
      </div>
      
      {/* Lado izquierdo con imagen de fondo */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <img 
          src={bgLogin} 
          alt="Students studying" 
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
      
      {/* Lado derecho con el formulario */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-left w-full mb-8">
            <img src={logo} alt="Grammar Master Pro Logo" className="h-36 w-auto mb-6" />
            <h1 className="text-4xl font-bold text-[#007AA2E8] mb-2">Login</h1>
            <p className="text-gray-600 text-sm">Welcome back! Please login to your account.</p>
          </div>
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-extrabold text-gray-700 mb-1">
                Email 
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder="Enter your email"
              />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="password" className="block text-sm font-extrabold text-gray-700">
                  Password
                </label>
               
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder="Enter your password"
              />
            </div>
            
            <div className="flex items-center">
              <Link to="/forgot-password" className="text-sm text-gray-600 hover:text-blue-800">
                  Forgot password?
                </Link>
            </div>
            
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#000DFF] hover:bg-[#0000cc] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              {isLoading ? 'Iniciando sesión...' : 'Login'}
            </button>
          </form>
          
          <div className="mt-6">
            <button
              type="button"
              className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
              </svg>
              <span>Sign up with Google</span>
            </button>
          </div>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/signup" className="font-medium text-[#007AA2] hover:text-[#005f7a] focus:outline-none">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
