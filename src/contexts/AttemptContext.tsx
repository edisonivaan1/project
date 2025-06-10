import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Attempt {
  id: string;
  topicId: string;
  startTime: number;
  answers: Record<number, string>;
  isCompleted: boolean;
}

interface AttemptContextType {
  getCurrentAttempt: (topicId: string) => Attempt | null;
  startNewAttempt: (topicId: string) => void;
  submitAnswer: (topicId: string, questionIndex: number, answer: string) => void;
  completeAttempt: (topicId: string) => void;
  hasInProgressAttempt: (topicId: string) => boolean;
  hasCompletedAttempt: (topicId: string) => boolean;
}

const AttemptContext = createContext<AttemptContextType | undefined>(undefined);

export const AttemptProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [attempts, setAttempts] = useState<Record<string, Attempt>>({});

  // Load attempts from localStorage on mount
  useEffect(() => {
    const savedAttempts = localStorage.getItem('topicAttempts');
    if (savedAttempts) {
      setAttempts(JSON.parse(savedAttempts));
    }
  }, []);

  // Save attempts to localStorage when they change
  useEffect(() => {
    localStorage.setItem('topicAttempts', JSON.stringify(attempts));
  }, [attempts]);

  const getCurrentAttempt = (topicId: string): Attempt | null => {
    return attempts[topicId] || null;
  };

  const startNewAttempt = (topicId: string) => {
    const newAttempt: Attempt = {
      id: `${topicId}-${Date.now()}`,
      topicId,
      startTime: Date.now(),
      answers: {},
      isCompleted: false
    };

    setAttempts(prev => ({
      ...prev,
      [topicId]: newAttempt
    }));
  };

  const submitAnswer = (topicId: string, questionIndex: number, answer: string) => {
    setAttempts(prev => {
      const currentAttempt = prev[topicId];
      if (!currentAttempt) return prev;

      return {
        ...prev,
        [topicId]: {
          ...currentAttempt,
          answers: {
            ...currentAttempt.answers,
            [questionIndex]: answer
          }
        }
      };
    });
  };

  const completeAttempt = (topicId: string) => {
    setAttempts(prev => {
      const currentAttempt = prev[topicId];
      if (!currentAttempt) return prev;

      return {
        ...prev,
        [topicId]: {
          ...currentAttempt,
          isCompleted: true
        }
      };
    });
  };

  const hasInProgressAttempt = (topicId: string): boolean => {
    const attempt = attempts[topicId];
    return attempt !== undefined && !attempt.isCompleted;
  };

  const hasCompletedAttempt = (topicId: string): boolean => {
    const attempt = attempts[topicId];
    return attempt !== undefined && attempt.isCompleted;
  };

  return (
    <AttemptContext.Provider
      value={{
        getCurrentAttempt,
        startNewAttempt,
        submitAnswer,
        completeAttempt,
        hasInProgressAttempt,
        hasCompletedAttempt
      }}
    >
      {children}
    </AttemptContext.Provider>
  );
};

export const useAttempt = () => {
  const context = useContext(AttemptContext);
  if (context === undefined) {
    throw new Error('useAttempt must be used within an AttemptProvider');
  }
  return context;
}; 