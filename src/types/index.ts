export type GrammarTopic = {
  id: string;
  title: string;
  description: string;
  icon: string;
  difficulty: 'easy' | 'medium' | 'hard';
  completedPercentage?: number;
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
};