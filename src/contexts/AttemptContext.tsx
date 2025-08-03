import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { progressService } from '../services/api';
import { useAuth } from './AuthContext';

interface Attempt {
  id: string;
  topicId: string;
  startTime: number;
  answers: Record<number, string>;
  isCompleted: boolean;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  usedHints: number[];
  timePerQuestion: Record<number, number>;
  hintsPerQuestion: Record<number, number>;
}

interface AttemptHistory {
  attemptNumber: number;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timestamp: number;
}

interface BackendAttempt {
  _id: string;
  topicId: string;
  difficulty: string;
  correct: number;
  total: number;
  percentage: number;
  timeSpent: number;
  hintsUsed: number;
  completedAt: string;
}

interface AttemptContextType {
  getCurrentAttempt: (topicId: string) => Attempt | null;
  startNewAttempt: (topicId: string) => void;
  submitAnswer: (topicId: string, questionIndex: number, answer: string) => void;
  completeAttempt: (topicId: string, correctAnswers: number, totalQuestions: number) => void;
  hasInProgressAttempt: (topicId: string) => boolean;
  hasCompletedAttempt: (topicId: string, difficulty?: string) => boolean;
  getAttemptHistory: (topicId: string) => AttemptHistory[];
  resetAttempt: (topicId: string) => void;
  getAttemptScore: (topicId: string) => { correct: number; total: number };
  recordHintUsage: (topicId: string, questionIndex: number) => void;
  getUsedHints: (topicId: string) => number[];
  refreshAttempts: () => Promise<void>;
}

const AttemptContext = createContext<AttemptContextType | undefined>(undefined);

export const AttemptProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [attempts, setAttempts] = useState<Record<string, Attempt>>({});
  const [attemptHistory, setAttemptHistory] = useState<Record<string, AttemptHistory[]>>({});
  const [completedAttempts, setCompletedAttempts] = useState<BackendAttempt[]>([]);
  const [isLoadingAttempts, setIsLoadingAttempts] = useState(false);
  const { user } = useAuth();

  // Load completed attempts from backend when user is available
  const loadCompletedAttempts = async () => {
    if (!user || isLoadingAttempts) return;
    
    try {
      setIsLoadingAttempts(true);
      const response = await progressService.getAttempts({
        limit: 1000, // Get all attempts
        sortBy: 'completedAt',
        sortOrder: 'desc'
      });
      
      if (response.success && response.data?.attempts) {
        setCompletedAttempts(response.data.attempts);
        console.log('✅ Intentos cargados desde el backend:', response.data.attempts);
      }
    } catch (error) {
      console.error('❌ Error cargando intentos desde el backend:', error);
    } finally {
      setIsLoadingAttempts(false);
    }
  };

  // Load attempts when user is available
  useEffect(() => {
    if (user) {
      loadCompletedAttempts();
    } else {
      // Clear attempts when user logs out
      setCompletedAttempts([]);
    }
  }, [user]);

  // Function to refresh attempts from backend
  const refreshAttempts = async () => {
    await loadCompletedAttempts();
  };

  const getCurrentAttempt = (topicId: string): Attempt | null => {
    return attempts[topicId] || null;
  };

  const startNewAttempt = (topicId: string) => {
    const newAttempt: Attempt = {
      id: `${topicId}-${Date.now()}`,
      topicId,
      startTime: Date.now(),
      answers: {},
      isCompleted: false,
      score: 0,
      totalQuestions: 10, // Set default total questions
      correctAnswers: 0,
      usedHints: [],
      timePerQuestion: {},
      hintsPerQuestion: {}
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

  const recordHintUsage = (topicId: string, questionIndex: number) => {
    setAttempts(prev => {
      const currentAttempt = prev[topicId];
      if (!currentAttempt) return prev;

      return {
        ...prev,
        [topicId]: {
          ...currentAttempt,
          usedHints: [...currentAttempt.usedHints, questionIndex]
        }
      };
    });
  };

  const getUsedHints = (topicId: string): number[] => {
    return attempts[topicId]?.usedHints || [];
  };

  const completeAttempt = (topicId: string, correctAnswers: number, totalQuestions: number) => {
    setAttempts(prev => {
      const currentAttempt = prev[topicId];
      if (!currentAttempt) return prev;

      const completedAttempt = {
        ...currentAttempt,
        isCompleted: true,
        score: Math.round((correctAnswers / totalQuestions) * 100),
        totalQuestions,
        correctAnswers
      };

      // Add to attempt history (only summary data)
      const history = attemptHistory[topicId] || [];
      const attemptNumber = history.length + 1;
      const newHistoryEntry: AttemptHistory = {
        attemptNumber,
        score: completedAttempt.score,
        totalQuestions,
        correctAnswers,
        timestamp: Date.now()
      };

      setAttemptHistory(prev => ({
        ...prev,
        [topicId]: [newHistoryEntry, ...history]
      }));

      return {
        ...prev,
        [topicId]: completedAttempt
      };
    });
  };

  const hasInProgressAttempt = (topicId: string): boolean => {
    const attempt = attempts[topicId];
    return attempt !== undefined && !attempt.isCompleted;
  };

  const hasCompletedAttempt = (topicId: string, difficulty?: string): boolean => {
    // Check backend attempts first
    const backendAttempts = completedAttempts.filter(attempt => 
      attempt.topicId === topicId && 
      (!difficulty || attempt.difficulty === difficulty)
    );
    
    if (backendAttempts.length > 0) {
      return true;
    }
    
    // Fallback to local attempts (for current session)
    const attempt = attempts[topicId];
    return attempt !== undefined && attempt.isCompleted;
  };

  const getAttemptHistory = (topicId: string): AttemptHistory[] => {
    return attemptHistory[topicId] || [];
  };

  const resetAttempt = (topicId: string) => {
    // Remove the current attempt completely
    setAttempts(prev => {
      const { [topicId]: _, ...rest } = prev;
      return rest;
    });
  };

  const getAttemptScore = (topicId: string) => {
    const attempt = attempts[topicId];
    if (!attempt) return { correct: 0, total: 10 }; // Default to 10 questions if no attempt
    return { 
      correct: attempt.correctAnswers, 
      total: attempt.totalQuestions || 10 
    };
  };

  return (
    <AttemptContext.Provider
      value={{
        getCurrentAttempt,
        startNewAttempt,
        submitAnswer,
        completeAttempt,
        hasInProgressAttempt,
        hasCompletedAttempt,
        getAttemptHistory,
        resetAttempt,
        getAttemptScore,
        recordHintUsage,
        getUsedHints,
        refreshAttempts
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