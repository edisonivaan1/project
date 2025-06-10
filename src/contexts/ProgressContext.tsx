import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { grammarTopics } from '../data/grammarTopics';

interface ProgressContextType {
  getProgress: (topicId: string) => number;
  setProgress: (topicId: string, questionCount: number) => void;
  getLastQuestionIndex: (topicId: string) => number;
  setLastQuestionIndex: (topicId: string, index: number) => void;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export const ProgressProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [progressMap, setProgressMap] = useState<Record<string, number>>({});
  const [lastQuestionMap, setLastQuestionMap] = useState<Record<string, number>>({});

  // Cargar progreso guardado al iniciar
  useEffect(() => {
    const savedProgress = localStorage.getItem('topicProgress');
    const savedLastQuestions = localStorage.getItem('lastQuestions');
    
    if (savedProgress) {
      setProgressMap(JSON.parse(savedProgress));
    }
    if (savedLastQuestions) {
      setLastQuestionMap(JSON.parse(savedLastQuestions));
    }
  }, []);

  // Guardar progreso cuando cambie
  useEffect(() => {
    localStorage.setItem('topicProgress', JSON.stringify(progressMap));
  }, [progressMap]);

  // Guardar última pregunta cuando cambie
  useEffect(() => {
    localStorage.setItem('lastQuestions', JSON.stringify(lastQuestionMap));
  }, [lastQuestionMap]);

  const getProgress = (topicId: string): number => {
    return progressMap[topicId] || 0;
  };

  const setProgress = (topicId: string, questionCount: number) => {
    const percentage = Math.min(Math.round((questionCount / 10) * 100), 100);
    setProgressMap(prev => ({
      ...prev,
      [topicId]: percentage
    }));

    // Actualizar también el progreso en grammarTopics para sincronización inmediata
    const topicIndex = grammarTopics.findIndex(t => t.id === topicId);
    if (topicIndex !== -1) {
      grammarTopics[topicIndex].completedPercentage = percentage;
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

  return (
    <ProgressContext.Provider
      value={{
        getProgress,
        setProgress,
        getLastQuestionIndex,
        setLastQuestionIndex
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