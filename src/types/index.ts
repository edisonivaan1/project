export type GrammarTopic = {
  id: string;
  title: string;
  description: string;
  icon: string;
  difficulty: 'easy' | 'medium' | 'hard';
  completedPercentage?: number;
  youtubeUrl?: string;
};

export type GameState = {
  currentScore: number;
  totalQuestions: number;
  currentQuestion: number;
  isGameCompleted: boolean;
  hintUsed: boolean;
  attempts: number;
};

export type UserSettings = {
  musicEnabled: boolean;
  soundEffectsEnabled: boolean;
  fullscreenMode: boolean;
  textSize: 'small' | 'medium' | 'large';
};

export type QuestionType = {
  id: string;
  text: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation: string;
  hint: string;
  image?: string;
  alt?: string;
  audio?: string;
  isFillInTheBlank?: boolean;
  isDragAndDrop?: boolean;
  dragOptions?: string[];
};

// Tipos para el sistema de progreso del juego
export type LevelProgress = {
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
};

export type User = {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  gameProgress: {
    levels: LevelProgress[];
    unlockedDifficulties: string[];
    totalScore: number;
    lastPlayedAt: string | null;
  };
  createdAt: string;
  updatedAt: string;
};

export type ApiResponse<T = any> = {
  success: boolean;
  message?: string;
  data?: T;
  token?: string;
  user?: User;
  errors?: any[];
};

export interface CompleteLevelData {
  topicId: string;
  difficulty: 'easy' | 'medium' | 'hard';
  correct: number;
  total: number;
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