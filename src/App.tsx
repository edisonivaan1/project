import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/Layout/MainLayout';
import Home from './pages/Home';
import TopicsPage from './pages/TopicsPage';
import Tutorial from './pages/Tutorial';
import Game from './pages/Game';
import Results from './pages/Results';
import Settings from './pages/Settings';
import Help from './pages/Help';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import { GameProvider } from './contexts/GameContext';
import { ProgressProvider } from './contexts/ProgressContext';
import { QuestionStatusProvider } from './contexts/QuestionStatusContext';
import { AttemptProvider } from './contexts/AttemptContext';
import { AudioProvider } from './contexts/AudioContext';
import { AuthProvider } from './contexts/AuthContext';

// Componente para rutas protegidas
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
      <ProgressProvider>
        <GameProvider>
          <QuestionStatusProvider>
            <AttemptProvider>
              <AudioProvider>
                <Router>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignUpPage />} />
                    <Route path="/topics" element={<TopicsPage />} />
                    <Route path="/tutorial/:topicId" element={<Tutorial />} />
                    <Route path="/game/:topicId" element={<Game />} />
                    <Route path="/results/:topicId" element={<Results />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/help" element={<Help />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </Router>
              </AudioProvider>
            </AttemptProvider>
          </QuestionStatusProvider>
        </GameProvider>
      </ProgressProvider>
    </AuthProvider>
  );
}

export default App;