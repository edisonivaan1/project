import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, BarChart2, Users } from 'lucide-react';
import Button from '../components/UI/Button';
import { useAuth } from '../contexts/AuthContext';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();

  // Redirigir a TopicsPage si el usuario ya está autenticado
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate('/topics', { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  const features = [
    {
      icon: <BookOpen className="h-12 w-12 text-blue-600" />,
      title: "Learn Quickly",
      description: "Master grammar rules through engaging exercises and interactive lessons."
    },
    {
      icon: <BarChart2 className="h-12 w-12 text-green-600" />,
      title: "Real-Time Feedback",
      description: "Get instant feedback on your answers to improve your understanding."
    },
    {
      icon: <Users className="h-12 w-12 text-purple-600" />,
      title: "Track Your Growth",
      description: "Monitor your progress and see how you're improving over time."
    }
  ];

  return (
    <div className="py-0 mb-0">
      {/* Hero Section */}
      <main className="flex-grow">
        <section className="bg-[rgba(0,12,234,0.11)] pt-8 pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center">
              {/* Texto y botón */}
              <div className="w-full md:w-1/2 text-center md:text-left mb-8 md:mb-0 md:pr-8">
                <h1 
                  className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2"
                  tabIndex={0}
                  role="heading"
                  aria-level={1}
                >
                  A Classical Education <br /> for the <span className="text-blue-600">Future</span>
                </h1>
                <p 
                  className="text-xl text-gray-600 mb-10 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2"
                  tabIndex={0}
                  role="text"
                  aria-label="Application description: Master English grammar through interactive exercises and real-time feedback. Perfect for B1 level students looking to improve their language skills."
                >
                  Master English grammar through interactive exercises and real-time feedback.
                  Perfect for B1 level students looking to improve their language skills.
                </p>
                <Button 
                  onClick={() => navigate('/signup')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-32 py-3 text-lg font-medium rounded-full flex items-center md:mx-0 w-auto focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  variant="custom"
                  aria-label="Join Grammar Master Pro - Start learning English grammar"
                >
                  JOIN                
                </Button>
              </div>
              
              {/* Imagen */}
              <div className="w-full md:w-1/2 flex items-start justify-center -mt-20">
                <div 
                  className="relative w-80 h-80 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full"
                  tabIndex={0}
                  role="img"
                  aria-label="Hero image showing students actively learning English grammar with interactive exercises"
                >
                  <div className="absolute bg-[#083DED] opacity-25 inset-0 rounded-full"></div>
                  <div className="relative w-full h-full">
                    <img 
                      src="/src/assets/img/homeStudents.png" 
                      alt="Students actively learning English grammar with interactive exercises and engaging study materials" 
                      className="w-full h-full object-cover rounded-full object-top"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 
              className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2"
              tabIndex={0}
              role="heading"
              aria-level={2}
            >
              Why Choose Grammar Master Pro?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8" role="grid" aria-label="Features showcase">
              {features.map((feature, index) => (
                <div 
                  key={index} 
                  className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
                  tabIndex={0}
                  role="gridcell"
                  aria-label={`Feature ${index + 1}: ${feature.title} - ${feature.description}`}
                >
                  <div 
                    className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-6 mx-auto focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    tabIndex={0}
                    role="img"
                    aria-label={`${feature.title} icon`}
                  >
                    {feature.icon}
                  </div>
                  <h3 
                    className="text-xl font-bold text-center mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1"
                    tabIndex={0}
                    role="heading"
                    aria-level={3}
                  >
                    {feature.title}
                  </h3>
                  <p 
                    className="text-gray-600 text-center focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1"
                    tabIndex={0}
                    role="text"
                  >
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
    </div>
  );
};

export default Home;