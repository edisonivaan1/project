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

function App() {
  return (
    <ProgressProvider>
      <GameProvider>
        <QuestionStatusProvider>
          <AttemptProvider>
            <AudioProvider>
              <Router>
                <MainLayout>
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
                </MainLayout>
              </Router>
            </AudioProvider>
          </AttemptProvider>
        </QuestionStatusProvider>
      </GameProvider>
    </ProgressProvider>
  );
}

export default App;