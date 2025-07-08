import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { progressService } from '../services/api';
import { useAuth } from './AuthContext';

interface LevelProgress {
  topicId: string;
  difficulty: 'easy' | 'medium' | 'hard';
  isCompleted: boolean;
  bestScore: {
    correct: number;
    total: number;
    percentage: number;
  };
  completedAt: string | null;
  attempts: Array<{
    score: {
      correct: number;
      total: number;
      percentage: number;
    };
    completedAt: string;
  }>;
}

interface GameProgressContextType {
  levels: LevelProgress[];
  unlockedDifficulties: string[];
  isLoading: boolean;
  
  // Métodos para consultar progreso
  getLevelProgress: (topicId: string, difficulty: 'easy' | 'medium' | 'hard') => LevelProgress | null;
  isLevelCompleted: (topicId: string, difficulty: 'easy' | 'medium' | 'hard') => boolean;
  canAccessDifficulty: (difficulty: 'easy' | 'medium' | 'hard') => boolean;
  getLevelPercentage: (topicId: string, difficulty: 'easy' | 'medium' | 'hard') => number;
  
  // Métodos para actualizar progreso
  completeLevel: (
    topicId: string, 
    difficulty: 'easy' | 'medium' | 'hard', 
    correct: number, 
    total: number,
    additionalData?: {
      timeSpent?: number;
      hintsUsed?: number;
      questionsDetails?: Array<{
        questionId: string;
        userAnswer: string;
        correctAnswer: string;
        isCorrect: boolean;
        timeSpent?: number;
        hintsUsed?: number;
      }>;
    }
  ) => Promise<{ success: boolean; message?: string; newUnlocks?: string[] }>;
  refreshProgress: () => Promise<void>;
  
  // Estadísticas
  getStats: () => {
    totalCompleted: number;
    averageScore: number;
    completedByDifficulty: { easy: number; medium: number; hard: number };
  };
}

const GameProgressContext = createContext<GameProgressContextType | undefined>(undefined);

export const GameProgressProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [levels, setLevels] = useState<LevelProgress[]>([]);
  const [unlockedDifficulties, setUnlockedDifficulties] = useState<string[]>(['easy']);
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated, user } = useAuth();

  // Cargar progreso cuando el usuario se autentica
  useEffect(() => {
    if (isAuthenticated && user) {
      loadProgress();
    } else {
      // Limpiar progreso si no hay usuario autenticado
      setLevels([]);
      setUnlockedDifficulties(['easy']);
    }
  }, [isAuthenticated, user]);

  const loadProgress = async () => {
    try {
      setIsLoading(true);
      console.log('Loading progress for user:', user?._id);
      
      const response = await progressService.getProgress();
      
      if (response.success && response.data) {
        const { levels, unlockedDifficulties } = response.data;
        console.log('Progress loaded:', { 
          levelsCount: levels?.length || 0, 
          unlockedDifficulties: unlockedDifficulties || ['easy'] 
        });
        
        setLevels(levels || []);
        setUnlockedDifficulties(unlockedDifficulties || ['easy']);
      } else {
        console.warn('Failed to load progress:', response.message);
        setLevels([]);
        setUnlockedDifficulties(['easy']);
      }
    } catch (error) {
      console.error('Error loading progress:', error);
      // En caso de error, usar datos por defecto pero no silenciar el error
      setLevels([]);
      setUnlockedDifficulties(['easy']);
    } finally {
      setIsLoading(false);
    }
  };

  const getLevelProgress = (topicId: string, difficulty: 'easy' | 'medium' | 'hard'): LevelProgress | null => {
    return levels.find(level => level.topicId === topicId && level.difficulty === difficulty) || null;
  };

  const isLevelCompleted = (topicId: string, difficulty: 'easy' | 'medium' | 'hard'): boolean => {
    const progress = getLevelProgress(topicId, difficulty);
    return progress?.isCompleted || false;
  };

  const canAccessDifficulty = (difficulty: 'easy' | 'medium' | 'hard'): boolean => {
    return unlockedDifficulties.includes(difficulty);
  };

  const getLevelPercentage = (topicId: string, difficulty: 'easy' | 'medium' | 'hard'): number => {
    const progress = getLevelProgress(topicId, difficulty);
    return progress?.bestScore.percentage || 0;
  };

  const completeLevel = async (
    topicId: string, 
    difficulty: 'easy' | 'medium' | 'hard', 
    correct: number, 
    total: number,
    additionalData?: {
      timeSpent?: number;
      hintsUsed?: number;
      questionsDetails?: Array<{
        questionId: string;
        userAnswer: string;
        correctAnswer: string;
        isCorrect: boolean;
        timeSpent?: number;
        hintsUsed?: number;
      }>;
    }
  ) => {
    try {
      setIsLoading(true);
      console.log(`Completing level: ${topicId} ${difficulty} - ${correct}/${total} for user:`, user?._id);
      
      const response = await progressService.completeLevel({
        topicId,
        difficulty,
        correct,
        total,
        timeSpent: additionalData?.timeSpent || 0,
        hintsUsed: additionalData?.hintsUsed || 0,
        questionsDetails: additionalData?.questionsDetails || []
      });

      if (response.success && response.data) {
        // Actualizar el progreso local con la respuesta del servidor
        const updatedLevel = response.data.levelProgress;
        const newUnlockedDifficulties = response.data.unlockedDifficulties;
        const newUnlocks = response.data.newUnlocks;

        console.log('Level completed successfully:', {
          levelProgress: updatedLevel,
          unlockedDifficulties: newUnlockedDifficulties,
          newUnlocks
        });

        // Actualizar o agregar el nivel en el estado local
        setLevels(prevLevels => {
          const existingIndex = prevLevels.findIndex(
            l => l.topicId === topicId && l.difficulty === difficulty
          );

          if (existingIndex !== -1) {
            // Actualizar nivel existente
            const newLevels = [...prevLevels];
            newLevels[existingIndex] = updatedLevel;
            console.log('Updated existing level at index:', existingIndex);
            return newLevels;
          } else {
            // Agregar nuevo nivel
            console.log('Added new level to progress');
            return [...prevLevels, updatedLevel];
          }
        });

        // Actualizar dificultades desbloqueadas
        setUnlockedDifficulties(newUnlockedDifficulties);

        return {
          success: true,
          message: response.message,
          newUnlocks: newUnlocks
        };
      } else {
        console.error('Failed to complete level:', response.message);
        return {
          success: false,
          message: response.message || 'Error al completar nivel'
        };
      }
    } catch (error: any) {
      console.error('Error completing level:', error);
      return {
        success: false,
        message: error.message || 'Error de conexión al completar nivel'
      };
    } finally {
      setIsLoading(false);
    }
  };

  const refreshProgress = async () => {
    await loadProgress();
  };

  const getStats = () => {
    const totalCompleted = levels.filter(l => l.isCompleted).length;
    const averageScore = levels.length > 0 
      ? Math.round(levels.reduce((sum, l) => sum + l.bestScore.percentage, 0) / levels.length)
      : 0;
    
    const completedByDifficulty = {
      easy: levels.filter(l => l.difficulty === 'easy' && l.isCompleted).length,
      medium: levels.filter(l => l.difficulty === 'medium' && l.isCompleted).length,
      hard: levels.filter(l => l.difficulty === 'hard' && l.isCompleted).length
    };

    return {
      totalCompleted,
      averageScore,
      completedByDifficulty
    };
  };

  const value: GameProgressContextType = {
    levels,
    unlockedDifficulties,
    isLoading,
    getLevelProgress,
    isLevelCompleted,
    canAccessDifficulty,
    getLevelPercentage,
    completeLevel,
    refreshProgress,
    getStats
  };

  return (
    <GameProgressContext.Provider value={value}>
      {children}
    </GameProgressContext.Provider>
  );
};

export const useGameProgress = () => {
  const context = useContext(GameProgressContext);
  if (context === undefined) {
    throw new Error('useGameProgress must be used within a GameProgressProvider');
  }
  return context;
}; 