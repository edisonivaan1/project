import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { grammarTopics } from '../data/grammarTopics';

interface ProgressContextType {
  getProgress: (topicId: string) => number;
  setProgress: (topicId: string, correctAnswers: number, totalQuestions: number) => void;
  getLastQuestionIndex: (topicId: string) => number;
  setLastQuestionIndex: (topicId: string, index: number) => void;
  resetLastQuestionIndex: (topicId: string) => void;
  getHighestScore: (topicId: string) => { correct: number; total: number };
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export const ProgressProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [progressMap, setProgressMap] = useState<Record<string, number>>({});
  const [lastQuestionMap, setLastQuestionMap] = useState<Record<string, number>>({});
  const [highestScores, setHighestScores] = useState<Record<string, { correct: number; total: number }>>({});

  // Load saved data on mount
  useEffect(() => {
    const savedProgress = localStorage.getItem('topicProgress');
    const savedLastQuestions = localStorage.getItem('lastQuestions');
    const savedHighestScores = localStorage.getItem('highestScores');
    
    if (savedProgress) {
      setProgressMap(JSON.parse(savedProgress));
    }
    if (savedLastQuestions) {
      setLastQuestionMap(JSON.parse(savedLastQuestions));
    }
    if (savedHighestScores) {
      setHighestScores(JSON.parse(savedHighestScores));
    }
  }, []);

  // Save data when it changes
  useEffect(() => {
    localStorage.setItem('topicProgress', JSON.stringify(progressMap));
  }, [progressMap]);

  useEffect(() => {
    localStorage.setItem('lastQuestions', JSON.stringify(lastQuestionMap));
  }, [lastQuestionMap]);

  useEffect(() => {
    localStorage.setItem('highestScores', JSON.stringify(highestScores));
  }, [highestScores]);

  const getProgress = (topicId: string): number => {
    return progressMap[topicId] || 0;
  };

  const setProgress = (topicId: string, correctAnswers: number, totalQuestions: number) => {
    const currentHighest = highestScores[topicId] || { correct: 0, total: totalQuestions };
    
    // Only update if this attempt has more correct answers
    if (correctAnswers > currentHighest.correct) {
      const percentage = Math.min(Math.round((correctAnswers / totalQuestions) * 100), 100);
      
      setProgressMap(prev => ({
        ...prev,
        [topicId]: percentage
      }));

      setHighestScores(prev => ({
        ...prev,
        [topicId]: { correct: correctAnswers, total: totalQuestions }
      }));

      // Update grammarTopics for immediate sync
      const topicIndex = grammarTopics.findIndex(t => t.id === topicId);
      if (topicIndex !== -1) {
        grammarTopics[topicIndex].completedPercentage = percentage;
      }
    }
  };

  const getLastQuestionIndex = (topicId: string): number => {
    return lastQuestionMap[topicId] || 0;
  };

  const setLastQuestionIndex = (topicId: string, index: number) => {
    setLastQuestionMap(prev => ({
      ...prev,
      [topicId]: index
    }));
  };

  const resetLastQuestionIndex = (topicId: string) => {
    setLastQuestionMap(prev => {
      const { [topicId]: _, ...rest } = prev;
      return rest;
    });
  };

  const getHighestScore = (topicId: string) => {
    return highestScores[topicId] || { correct: 0, total: 10 };
  };

  return (
    <ProgressContext.Provider
      value={{
        getProgress,
        setProgress,
        getLastQuestionIndex,
        setLastQuestionIndex,
        resetLastQuestionIndex,
        getHighestScore
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (context === undefined) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
}; 