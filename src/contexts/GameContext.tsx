import React, { createContext, useContext, useState, ReactNode } from 'react';
import { GameState, QuestionType, UserSettings } from '../types';

interface GameContextType {
  gameState: GameState;
  questions: QuestionType[];
  settings: UserSettings;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  setQuestions: React.Dispatch<React.SetStateAction<QuestionType[]>>;
  setSettings: React.Dispatch<React.SetStateAction<UserSettings>>;
  resetGame: () => void;
  showHint: () => void;
  updateScore: (isCorrect: boolean) => void;
  nextQuestion: () => void;
}

const defaultGameState: GameState = {
  currentScore: 0,
  totalQuestions: 0,
  currentQuestion: 0,
  isGameCompleted: false,
  hintUsed: false,
  attempts: 0,
};

const defaultSettings: UserSettings = {
  musicEnabled: true,
  soundEffectsEnabled: true,
  fullscreenMode: false,
  textSize: 'medium',
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [gameState, setGameState] = useState<GameState>(defaultGameState);
  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);

  const resetGame = () => {
    setGameState({
      ...defaultGameState,
      totalQuestions: questions.length,
    });
  };

  const showHint = () => {
    setGameState((prev) => ({ ...prev, hintUsed: true }));
  };

  const updateScore = (isCorrect: boolean) => {
    setGameState((prev) => ({
      ...prev,
      currentScore: isCorrect ? prev.currentScore + 1 : prev.currentScore,
      attempts: prev.attempts + 1,
    }));
  };

  const nextQuestion = () => {
    setGameState((prev) => {
      const nextQuestionIndex = prev.currentQuestion + 1;
      const isGameCompleted = nextQuestionIndex >= prev.totalQuestions;

      return {
        ...prev,
        currentQuestion: nextQuestionIndex,
        isGameCompleted,
        hintUsed: false,
        attempts: 0,
      };
    });
  };

  return (
    <GameContext.Provider
      value={{
        gameState,
        questions,
        settings,
        setGameState,
        setQuestions,
        setSettings,
        resetGame,
        showHint,
        updateScore,
        nextQuestion,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};