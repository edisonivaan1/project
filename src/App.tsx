import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './components/Layout/MainLayout';
import Home from './pages/Home';
import Tutorial from './pages/Tutorial';
import Game from './pages/Game';
import Results from './pages/Results';
import Settings from './pages/Settings';
import Help from './pages/Help';
import { GameProvider } from './contexts/GameContext';

function App() {
  return (
    <GameProvider>
      <Router>
        <MainLayout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tutorial/:topicId" element={<Tutorial />} />
            <Route path="/game/:topicId" element={<Game />} />
            <Route path="/results/:topicId" element={<Results />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/help" element={<Help />} />
          </Routes>
        </MainLayout>
      </Router>
    </GameProvider>
  );
}

export default App;