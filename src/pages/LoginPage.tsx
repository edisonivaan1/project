import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import bgLogin from '../assets/bgLogin.png';
import logo from '../assets/logo_GrammarMasterPro.png';
import { authService, handleAuthError } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, isLoading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [shouldRedirect, setShouldRedirect] = useState(false);

  // Redirigir si ya está autenticado (solo en carga inicial, no durante login)
  useEffect(() => {
    if (isAuthenticated && !authLoading && !isLoading && !shouldRedirect) {
      const from = (location.state as any)?.from || '/topics';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, authLoading, navigate, location, isLoading, shouldRedirect]);
  
  // Modal states
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotStep, setForgotStep] = useState(1); // 1: email, 2: security question, 3: new password
  const [isLoadingForgot, setIsLoadingForgot] = useState(false);
  
  // Forgot password form data
  const [forgotEmail, setForgotEmail] = useState('');
  const [securityQuestion, setSecurityQuestion] = useState('');
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setShouldRedirect(true); // Evitar redirección automática
    
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const result = await login(email, password);

      if (result.success) {
        // Mostrar notificación de éxito
        toast.success('Login successful', {
          position: "top-center",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        
        // Redirigir después de un pequeño delay para que se vea el toast
        setTimeout(() => {
          const from = (location.state as any)?.from || '/topics';
          navigate(from, { replace: true });
        }, 1600);
      } else {
        toast.error(result.message || 'Login error');
        setShouldRedirect(false); // Permitir redirección automática si hay error
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Unexpected login error');
      setShouldRedirect(false); // Permitir redirección automática si hay error
    } finally {
      setIsLoading(false);
    }
  };

  // Reset modal state
  const resetForgotModal = () => {
    setShowForgotModal(false);
    setForgotStep(1);
    setForgotEmail('');
    setSecurityQuestion('');
    setSecurityAnswer('');
    setNewPassword('');
    setConfirmNewPassword('');
    setShowNewPassword(false);
    setShowConfirmNewPassword(false);
    setIsLoadingForgot(false);
  };

  // Handle email submission (Step 1)
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoadingForgot(true);
    

    
    try {
      // Usar el servicio de API para forgot password
      const response = await authService.forgotPassword(forgotEmail);
      
      if (response.securityQuestion) {
        setSecurityQuestion(response.securityQuestion);
        setForgotStep(2);
      } else {
        throw new Error('Security question could not be obtained');
      }
      
      toast.success('Email verified. Answer your security question.');
      
    } catch (error) {
      console.error('Error getting security question:', error);
      toast.error(handleAuthError(error));
    } finally {
      setIsLoadingForgot(false);
    }
  };

  // Handle security answer submission (Step 2)
  const handleSecuritySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoadingForgot(true);
    
    try {
      // Validate security answer is not empty
      if (!securityAnswer.trim()) {
        toast.error('Please enter your security answer.');
        setIsLoadingForgot(false);
        return;
      }
      
      // En el flujo real, la verificación de la respuesta de seguridad
      // se hace en el paso final de reset de contraseña
      setForgotStep(3);
      toast.success('Continue with the password change.');
      
    } catch (error) {
      console.error('Error verifying security answer:', error);
      toast.error('Server error. Please try again later.');
    } finally {
      setIsLoadingForgot(false);
    }
  };

  // Handle password reset (Step 3)
  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmNewPassword) {
      toast.error("Passwords don't match");
      return;
    }
    
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    
    setIsLoadingForgot(true);
    

    
    try {
      // Usar el servicio de API para reset password
      await authService.resetPassword({
        email: forgotEmail,
        securityAnswer,
        newPassword,
        confirmPassword: confirmNewPassword
      });
      
      toast.success('Password changed successfully! You can now login.');
      resetForgotModal();
      
    } catch (error) {
      console.error('Error resetting password:', error);
      toast.error(handleAuthError(error));
    } finally {
      setIsLoadingForgot(false);
    }
  };

  return (
    <div className="min-h-screen flex relative">
      <ToastContainer 
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
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
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
            
            <div className="flex items-center">
              <button 
                type="button"
                onClick={() => setShowForgotModal(true)}
                className="text-sm text-gray-600 hover:text-blue-800 focus:outline-none"
              >
                Forgot password?
              </button>
            </div>
            
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#000DFF] hover:bg-[#0000cc] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              {isLoading ? 'Logging in...' : 'Login'}
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

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
            {/* Close button */}
            <button
              onClick={resetForgotModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Progress Bar */}
            <div className="mb-6 mt-2">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    forgotStep >= 1 ? 'bg-[#000DFF] text-white' : 'bg-gray-200 text-gray-500'
                  }`}>
                    1
                  </div>
                  <span className={`ml-2 text-xs font-medium ${
                    forgotStep === 1 ? 'text-[#000DFF]' : 'text-gray-500'
                  }`}>
                    Email
                  </span>
                </div>
                
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    forgotStep >= 2 ? 'bg-[#000DFF] text-white' : 'bg-gray-200 text-gray-500'
                  }`}>
                    2
                  </div>
                  <span className={`ml-2 text-xs font-medium ${
                    forgotStep === 2 ? 'text-[#000DFF]' : 'text-gray-500'
                  }`}>
                    Security
                  </span>
                </div>
                
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    forgotStep >= 3 ? 'bg-[#000DFF] text-white' : 'bg-gray-200 text-gray-500'
                  }`}>
                    3
                  </div>
                  <span className={`ml-2 text-xs font-medium ${
                    forgotStep === 3 ? 'text-[#000DFF]' : 'text-gray-500'
                  }`}>
                    Password
                  </span>
                </div>
              </div>
              
              {/* Progress line */}
              <div className="relative">
                <div className="absolute top-0 left-0 w-full h-2 bg-gray-200 rounded-full"></div>
                <div 
                  className="absolute top-0 left-0 h-2 bg-[#000DFF] rounded-full transition-all duration-300 ease-in-out"
                  style={{ width: `${((forgotStep - 1) / 2) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Step 1: Email */}
            {forgotStep === 1 && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Forgot Password</h3>
                <p className="text-gray-600 text-sm mb-6">
                  Enter your email address and we'll help you reset your password.
                </p>
                
                <form onSubmit={handleEmailSubmit}>
                  <div className="mb-4">
                    <label htmlFor="forgotEmail" className="block text-sm font-extrabold text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      id="forgotEmail"
                      type="email"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      placeholder="Enter your email"
                    />
                  </div>
                  
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={resetForgotModal}
                      className="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isLoadingForgot}
                      className="flex-1 py-3 px-4 border border-transparent rounded-lg text-sm font-medium text-white bg-[#000DFF] hover:bg-[#0000cc] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50"
                    >
                      {isLoadingForgot ? 'Loading...' : 'Continue'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Step 2: Security Question */}
            {forgotStep === 2 && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Security Question</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Please answer your security question to verify your identity.
                </p>
                
                <form onSubmit={handleSecuritySubmit}>
                  <div className="mb-4">
                    <label className="block text-sm font-extrabold text-gray-700 mb-1">
                      Security Question
                    </label>
                    <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700">
                      {securityQuestion}
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="securityAnswer" className="block text-sm font-extrabold text-gray-700 mb-1">
                      Your Answer
                    </label>
                    <input
                      id="securityAnswer"
                      type="text"
                      value={securityAnswer}
                      onChange={(e) => setSecurityAnswer(e.target.value)}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      placeholder="Enter your answer"
                    />
                  </div>
                  
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setForgotStep(1)}
                      className="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={isLoadingForgot}
                      className="flex-1 py-3 px-4 border border-transparent rounded-lg text-sm font-medium text-white bg-[#000DFF] hover:bg-[#0000cc] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50"
                    >
                      {isLoadingForgot ? 'Verifying...' : 'Continue'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Step 3: New Password */}
            {forgotStep === 3 && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Reset Password</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Create a new password for your account.
                </p>
                
                <form onSubmit={handlePasswordReset}>
                  <div className="mb-4">
                    <label htmlFor="newPassword" className="block text-sm font-extrabold text-gray-700 mb-1">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        id="newPassword"
                        type={showNewPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        placeholder="Enter new password"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 flex items-center pr-3"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? (
                          <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                          </svg>
                        ) : (
                          <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="confirmNewPassword" className="block text-sm font-extrabold text-gray-700 mb-1">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        id="confirmNewPassword"
                        type={showConfirmNewPassword ? "text" : "password"}
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        required
                        className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        placeholder="Confirm new password"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 flex items-center pr-3"
                        onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                      >
                        {showConfirmNewPassword ? (
                          <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                          </svg>
                        ) : (
                          <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setForgotStep(2)}
                      className="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={isLoadingForgot}
                      className="flex-1 py-3 px-4 border border-transparent rounded-lg text-sm font-medium text-white bg-[#000DFF] hover:bg-[#0000cc] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50"
                    >
                      {isLoadingForgot ? 'Resetting...' : 'Reset Password'}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
