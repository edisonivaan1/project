import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { progressService, inProgressAttemptService } from '../services/api';
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
  startNewAttempt: (topicId: string, difficulty?: string, totalQuestions?: number) => Promise<void>;
  submitAnswer: (topicId: string, questionIndex: number, answer: string, timeSpent?: number, hintsUsed?: number) => Promise<void>;
  completeAttempt: (topicId: string, correctAnswers: number, totalQuestions: number) => void;
  hasInProgressAttempt: (topicId: string) => boolean;
  hasInProgressAttemptForDifficulty: (topicId: string, difficulty: string) => Promise<boolean>;
  hasCompletedAttempt: (topicId: string, difficulty?: string) => boolean;
  getAttemptHistory: () => AttemptHistory[];
  resetAttempt: (topicId: string) => Promise<void>;
  getAttemptScore: (topicId: string) => { correct: number; total: number };
  recordHintUsage: (topicId: string, questionIndex: number) => void;
  getUsedHints: (topicId: string) => number[];
  refreshAttempts: () => Promise<void>;
  loadInProgressAttempt: (topicId: string, difficulty: string) => Promise<Attempt | null>;
}

const AttemptContext = createContext<AttemptContextType | undefined>(undefined);

export const AttemptProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentAttempt, setCurrentAttempt] = useState<Attempt | null>(null);
  const [currentDifficulty, setCurrentDifficulty] = useState<string | null>(null);
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

  // Cargar intento en progreso desde el backend
  const loadInProgressAttempt = async (topicId: string, difficulty: string) => {
    if (!user) return null;

    try {
      const response = await inProgressAttemptService.getInProgressAttempt(topicId, difficulty);
      
      if (response.success && response.data) {
        const backendAttempt = response.data;
        const attempt: Attempt = {
          id: backendAttempt.id,
          topicId: backendAttempt.topicId,
          startTime: backendAttempt.startTime,
          answers: backendAttempt.answers || {},
          isCompleted: false,
          score: 0,
          totalQuestions: backendAttempt.totalQuestions,
          correctAnswers: 0,
          usedHints: backendAttempt.usedHints || [],
          timePerQuestion: backendAttempt.timePerQuestion || {},
          hintsPerQuestion: backendAttempt.hintsPerQuestion || {}
        };

        setCurrentAttempt(attempt);
        setCurrentDifficulty(difficulty);
        console.log('📥 Intento en progreso cargado:', attempt.id);
        return attempt;
      }
      
      return null;
    } catch (error) {
      console.error('Error loading in-progress attempt:', error);
      return null;
    }
  };

  const getCurrentAttempt = (topicId: string): Attempt | null => {
    // Retornar el intento actual si es del mismo tema
    if (currentAttempt && currentAttempt.topicId === topicId) {
      return currentAttempt;
    }
    return null;
  };

  const startNewAttempt = async (topicId: string, difficulty: string = 'easy', totalQuestions: number = 10) => {
    if (!user) return;

    try {
      // Eliminar cualquier intento en progreso anterior
      await inProgressAttemptService.deleteInProgressAttempt(topicId, difficulty);

      // Crear nuevo intento en el backend
      const response = await inProgressAttemptService.saveInProgressAttempt({
        topicId,
        difficulty,
        totalQuestions,
        currentQuestionIndex: 0,
        answers: {},
        usedHints: [],
        timePerQuestion: {},
        hintsPerQuestion: {}
      });

      if (response.success && response.data) {
        const backendAttempt = response.data;
        const newAttempt: Attempt = {
          id: backendAttempt.id,
          topicId: backendAttempt.topicId,
          startTime: backendAttempt.startTime,
          answers: backendAttempt.answers || {},
          isCompleted: false,
          score: 0,
          totalQuestions: backendAttempt.totalQuestions,
          correctAnswers: 0,
          usedHints: backendAttempt.usedHints || [],
          timePerQuestion: backendAttempt.timePerQuestion || {},
          hintsPerQuestion: backendAttempt.hintsPerQuestion || {}
        };

        setCurrentAttempt(newAttempt);
        setCurrentDifficulty(difficulty);
        console.log('✨ Nuevo intento iniciado:', newAttempt.id);
      }
    } catch (error) {
      console.error('Error starting new attempt:', error);
    }
  };

  const submitAnswer = async (topicId: string, questionIndex: number, answer: string, timeSpent?: number, hintsUsed?: number) => {
    if (!currentAttempt || currentAttempt.topicId !== topicId || !currentDifficulty) return;

    try {
      // Guardar respuesta en el backend
      const response = await inProgressAttemptService.saveAnswer(topicId, currentDifficulty, {
        questionIndex,
        answer,
        timeSpent,
        hintsUsed
      });

      if (response.success && response.data) {
        // Actualizar el intento local con la respuesta del backend
        const updatedAttempt: Attempt = {
          ...currentAttempt,
          answers: response.data.answers || currentAttempt.answers,
          timePerQuestion: response.data.timePerQuestion || currentAttempt.timePerQuestion,
          hintsPerQuestion: response.data.hintsPerQuestion || currentAttempt.hintsPerQuestion
        };

        setCurrentAttempt(updatedAttempt);
        console.log('💾 Respuesta guardada:', { questionIndex, answer });
      }
    } catch (error) {
      console.error('Error saving answer:', error);
      // En caso de error, mantener la funcionalidad localmente
      setCurrentAttempt(prev => {
        if (!prev || prev.topicId !== topicId) return prev;
        return {
          ...prev,
          answers: {
            ...prev.answers,
            [questionIndex]: answer
          }
        };
      });
    }
  };

  const recordHintUsage = (topicId: string, questionIndex: number) => {
    if (currentAttempt && currentAttempt.topicId === topicId) {
      setCurrentAttempt(prev => {
        if (!prev || prev.topicId !== topicId) return prev;
        return {
          ...prev,
          usedHints: [...prev.usedHints, questionIndex]
        };
      });
    }
  };

  const getUsedHints = (topicId: string): number[] => {
    if (currentAttempt && currentAttempt.topicId === topicId) {
      return currentAttempt.usedHints || [];
    }
    return [];
  };

  const completeAttempt = (topicId: string, correctAnswers: number, totalQuestions: number) => {
    if (currentAttempt && currentAttempt.topicId === topicId) {
      setCurrentAttempt(prev => {
        if (!prev || prev.topicId !== topicId) return prev;
        return {
          ...prev,
          isCompleted: true,
          score: Math.round((correctAnswers / totalQuestions) * 100),
          totalQuestions,
          correctAnswers
        };
      });
    }
  };

  const hasInProgressAttempt = (topicId: string): boolean => {
    return currentAttempt !== null && 
           currentAttempt.topicId === topicId && 
           !currentAttempt.isCompleted;
  };

  // Función para verificar intentos en progreso desde el backend por tema y dificultad
  const hasInProgressAttemptForDifficulty = async (topicId: string, difficulty: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const response = await inProgressAttemptService.getInProgressAttempt(topicId, difficulty);
      return response.success && response.data !== null;
    } catch (error) {
      console.error('Error checking in-progress attempt:', error);
      return false;
    }
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
    if (currentAttempt && currentAttempt.topicId === topicId) {
      return currentAttempt.isCompleted;
    }
    return false;
  };

  const getAttemptHistory = (): AttemptHistory[] => {
    // Por ahora retornamos un array vacío ya que el historial se maneja en el backend
    // Este método podría ser expandido para cargar el historial desde el backend si es necesario
    return [];
  };

  const resetAttempt = async (topicId: string) => {
    if (currentAttempt && currentAttempt.topicId === topicId && currentDifficulty) {
      try {
        await inProgressAttemptService.deleteInProgressAttempt(topicId, currentDifficulty);
        console.log('🗑️ Intento eliminado del backend');
      } catch (error) {
        console.error('Error deleting in-progress attempt:', error);
      }
    }
    
    // Limpiar estado local
    setCurrentAttempt(null);
    setCurrentDifficulty(null);
  };

  const getAttemptScore = (topicId: string) => {
    if (currentAttempt && currentAttempt.topicId === topicId) {
      return { 
        correct: currentAttempt.correctAnswers, 
        total: currentAttempt.totalQuestions || 10 
      };
    }
    return { correct: 0, total: 10 }; // Default to 10 questions if no attempt
  };

  return (
    <AttemptContext.Provider
      value={{
        getCurrentAttempt,
        startNewAttempt,
        submitAnswer,
        completeAttempt,
        hasInProgressAttempt,
        hasInProgressAttemptForDifficulty,
        hasCompletedAttempt,
        getAttemptHistory,
        resetAttempt,
        getAttemptScore,
        recordHintUsage,
        getUsedHints,
        refreshAttempts,
        loadInProgressAttempt
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