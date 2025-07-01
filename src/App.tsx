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
import ProtectedRoute from './components/ProtectedRoute';

// Contextos
import { AuthProvider } from './contexts/AuthContext';
import { GameProgressProvider } from './contexts/GameProgressContext';
import { GameProvider } from './contexts/GameContext';
import { ProgressProvider } from './contexts/ProgressContext';
import { QuestionStatusProvider } from './contexts/QuestionStatusContext';
import { AttemptProvider } from './contexts/AttemptContext';
import { AudioProvider } from './contexts/AudioContext';

function App() {
  return (
    <AuthProvider>
      <GameProgressProvider>
        <ProgressProvider>
          <GameProvider>
            <QuestionStatusProvider>
              <AttemptProvider>
                <AudioProvider>
                  <Router>
                    <MainLayout>
                      <Routes>
                        {/* Rutas públicas */}
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/signup" element={<SignUpPage />} />
                        <Route path="/help" element={<Help />} />
                        
                        {/* Rutas protegidas */}
                        <Route path="/topics" element={
                          <ProtectedRoute>
                            <TopicsPage />
                          </ProtectedRoute>
                        } />
                        <Route path="/tutorial/:topicId" element={
                          <ProtectedRoute>
                            <Tutorial />
                          </ProtectedRoute>
                        } />
                        <Route path="/game/:topicId" element={
                          <ProtectedRoute>
                            <Game />
                          </ProtectedRoute>
                        } />
                        <Route path="/results/:topicId" element={
                          <ProtectedRoute>
                            <Results />
                          </ProtectedRoute>
                        } />
                        <Route path="/settings" element={
                          <ProtectedRoute>
                            <Settings />
                          </ProtectedRoute>
                        } />
                        
                        {/* Redirección por defecto */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                      </Routes>
                    </MainLayout>
                  </Router>
                </AudioProvider>
              </AttemptProvider>
            </QuestionStatusProvider>
          </GameProvider>
        </ProgressProvider>
      </GameProgressProvider>
    </AuthProvider>
  );
}

export default App;