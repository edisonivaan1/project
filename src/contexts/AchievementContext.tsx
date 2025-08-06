import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { useGameProgress } from './GameProgressContext';
import { progressService, achievementService } from '../services/api';
import { grammarTopics } from '../data/grammarTopics';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedAt?: string;
  category: 'completion' | 'performance' | 'consistency' | 'exploration' | 'medal';
}

interface AchievementContextType {
  achievements: Achievement[];
  pendingNotifications: Achievement[];
  checkForNewAchievements: (newStats: any) => Promise<Achievement[]>;
  markNotificationShown: (achievementId: string) => void;
  clearAllNotifications: () => void;
}

const AchievementContext = createContext<AchievementContextType | undefined>(undefined);

export const AchievementProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [pendingNotifications, setPendingNotifications] = useState<Achievement[]>([]);
  const { user } = useAuth();
  const { isLevelCompleted } = useGameProgress();

  // Load shown achievements from localStorage
  const getShownAchievements = (): string[] => {
    if (!user?._id) return [];
    const stored = localStorage.getItem(`achievements_shown_${user._id}`);
    return stored ? JSON.parse(stored) : [];
  };

  // Save shown achievements to localStorage
  const saveShownAchievements = (achievementIds: string[]) => {
    if (!user?._id) return;
    localStorage.setItem(`achievements_shown_${user._id}`, JSON.stringify(achievementIds));
  };

  // Generate all possible achievements
  // @ts-ignore - This function is kept for future use
  const generateAllAchievements = (stats: any): Achievement[] => {
    return [
      // Completion achievements
      {
        id: 'first_steps',
        name: 'First Steps',
        description: 'Complete your first lesson',
        icon: '🎯',
        earned: stats.completedLessons >= 1,
        category: 'completion'
      },
      {
        id: 'getting_started',
        name: 'Getting Started',
        description: 'Complete 5 lessons',
        icon: '🚀',
        earned: stats.completedLessons >= 5,
        category: 'completion'
      },
      {
        id: 'grammar_explorer',
        name: 'Grammar Explorer',
        description: 'Complete 10 lessons',
        icon: '🗺️',
        earned: stats.completedLessons >= 10,
        category: 'completion'
      },
      {
        id: 'dedicated_learner',
        name: 'Dedicated Learner',
        description: 'Complete 15 lessons',
        icon: '📚',
        earned: stats.completedLessons >= 15,
        category: 'completion'
      },
      {
        id: 'course_complete',
        name: 'Course Master',
        description: 'Complete all available topics',
        icon: '🎉',
        earned: stats.completedTopics >= stats.totalTopics && stats.totalTopics > 0,
        category: 'completion'
      },
      // Performance achievements
      {
        id: 'perfectionist',
        name: 'Perfectionist',
        description: 'Achieve 100% on any lesson',
        icon: '⭐',
        earned: stats.bestScore >= 100,
        category: 'performance'
      },
      {
        id: 'high_achiever',
        name: 'High Achiever',
        description: 'Maintain 85% average score',
        icon: '🏆',
        earned: stats.averageScore >= 85,
        category: 'performance'
      },
      {
        id: 'scholar',
        name: 'Scholar',
        description: 'Maintain 90% average score',
        icon: '🎓',
        earned: stats.averageScore >= 90,
        category: 'performance'
      },
      // Medal achievements
      {
        id: 'easy_master',
        name: 'Easy Master',
        description: 'Complete all Easy difficulty topics',
        icon: '🥉',
        earned: stats.easyMedal,
        category: 'medal'
      },
      {
        id: 'medium_master',
        name: 'Medium Master',
        description: 'Complete all Medium difficulty topics',
        icon: '🥈',
        earned: stats.mediumMedal,
        category: 'medal'
      },
      {
        id: 'hard_master',
        name: 'Hard Master',
        description: 'Complete all Hard difficulty topics',
        icon: '🥇',
        earned: stats.hardMedal,
        category: 'medal'
      },
      // Consistency achievements
      {
        id: 'persistent',
        name: 'Persistent',
        description: 'Make 10 attempts',
        icon: '💪',
        earned: stats.totalAttempts >= 10,
        category: 'consistency'
      },
      {
        id: 'determined',
        name: 'Determined',
        description: 'Make 25 attempts',
        icon: '🔥',
        earned: stats.totalAttempts >= 25,
        category: 'consistency'
      },
      // Exploration achievements
      {
        id: 'help_seeker',
        name: 'Help Seeker',
        description: 'Use hints wisely (5+ hints used)',
        icon: '💡',
        earned: stats.totalHintsUsed >= 5,
        category: 'exploration'
      }
    ];
  };

  // Calculate current stats for achievement checking
  // @ts-ignore - This function is kept for future use
  const calculateCurrentStats = async () => {
    try {
      // @ts-ignore - progressResponse is used in the destructuring
      const [progressResponse, statsResponse] = await Promise.all([
        progressService.getProgress(),
        progressService.getStats()
      ]);

      let completedLessons = 0;
      let completedTopics = 0;
      const totalTopics = grammarTopics.length;

      // Calculate completed lessons and topics
      grammarTopics.forEach(topic => {
        let topicCompleted = false;
        ['easy', 'medium', 'hard'].forEach(difficulty => {
          const difficultyKey = difficulty as 'easy' | 'medium' | 'hard';
          
          if (isLevelCompleted(topic.id, difficultyKey)) {
            completedLessons++;
            if (!topicCompleted) {
              topicCompleted = true;
              completedTopics++;
            }
          }
        });
      });

      // Check for difficulty medals
      const topicsByDifficulty = {
        easy: grammarTopics.filter(topic => topic.difficulty === 'easy'),
        medium: grammarTopics.filter(topic => topic.difficulty === 'medium'),
        hard: grammarTopics.filter(topic => topic.difficulty === 'hard')
      };

      const easyMedal = topicsByDifficulty.easy.length > 0 && 
        topicsByDifficulty.easy.every(topic => isLevelCompleted(topic.id, 'easy'));
      
      const mediumMedal = topicsByDifficulty.medium.length > 0 && 
        topicsByDifficulty.medium.every(topic => isLevelCompleted(topic.id, 'medium'));
      
      const hardMedal = topicsByDifficulty.hard.length > 0 && 
        topicsByDifficulty.hard.every(topic => isLevelCompleted(topic.id, 'hard'));

      const backendStats = statsResponse?.data?.attemptStats || {};

      return {
        completedLessons,
        completedTopics,
        totalTopics,
        easyMedal,
        mediumMedal,
        hardMedal,
        totalAttempts: backendStats.totalAttempts || 0,
        averageScore: Math.round(backendStats.avgScore || 0),
        bestScore: Math.round(backendStats.bestScore || 0),
        totalHintsUsed: backendStats.totalHintsUsed || 0
      };
    } catch (error) {
      console.error('Error calculating stats for achievements:', error);
      return null;
    }
  };

  // Check for new achievements using backend
  const checkForNewAchievements = async (_newStats?: any): Promise<Achievement[]> => { // @ts-ignore - newStats parameter is kept for future use
    try {
      console.log('🔍 Checking for new achievements...');
      
      // First trigger achievement check in backend
      console.log('🎯 Triggering backend achievement check...');
      const checkResponse = await achievementService.checkAchievements();
      console.log('🎯 Backend check response:', checkResponse);
      
      // Then get unnotified achievements from backend
      console.log('🔔 Getting unnotified achievements...');
      const response = await achievementService.getUnnotifiedAchievements();
      console.log('🔔 Unnotified response:', response);
      
      if (response.success && response.data) {
        const unnotifiedAchievements = response.data;
        
        if (unnotifiedAchievements.length > 0) {
          console.log('🏆 New achievements from backend:', unnotifiedAchievements.map((a: Achievement) => a.name));
          
          // Filter out achievements that have already been shown locally
          const shownAchievements = getShownAchievements();
          console.log('👁️ Already shown achievements:', shownAchievements);
          
          const newAchievements = unnotifiedAchievements.filter(
            (achievement: Achievement) => !shownAchievements.includes(achievement.id)
          );
          
          console.log('✨ Truly new achievements to show:', newAchievements.map((a: Achievement) => a.name));
          
          if (newAchievements.length > 0) {
            console.log('📝 Adding to pending notifications...');
            setPendingNotifications(prev => {
              const updated = [...prev, ...newAchievements];
              console.log('📝 Total pending after update:', updated.length);
              return updated;
            });
          }
          
          return newAchievements;
        } else {
          console.log('🔔 No unnotified achievements found');
        }
      } else {
        console.log('❌ Failed to get unnotified achievements:', response);
      }

      return [];
    } catch (error) {
      console.error('❌ Error checking for new achievements:', error);
      return [];
    }
  };

  // Mark notification as shown
  const markNotificationShown = async (achievementId: string) => {
    try {
      // Mark as notified in backend
      await achievementService.markAsNotified([achievementId]);
      
      // Also mark locally
      const shownAchievements = getShownAchievements();
      const updatedShown = [...shownAchievements, achievementId];
      saveShownAchievements(updatedShown);
      
      setPendingNotifications(prev => 
        prev.filter(achievement => achievement.id !== achievementId)
      );
    } catch (error) {
      console.error('Error marking achievement as notified:', error);
      // Still remove from local pending notifications even if backend fails
      setPendingNotifications(prev => 
        prev.filter(achievement => achievement.id !== achievementId)
      );
    }
  };

  // Clear all notifications
  const clearAllNotifications = () => {
    setPendingNotifications([]);
  };

  // Load initial achievements when user changes
  useEffect(() => {
    const loadAchievements = async () => {
      if (user) {
        try {
          // Load user achievements from backend
          const response = await achievementService.getUserAchievements(true);
          if (response.success && response.data) {
            setAchievements(response.data);
          }
          
          // Check for new achievements
          await checkForNewAchievements();
        } catch (error) {
          console.error('Error loading achievements:', error);
        }
      } else {
        setAchievements([]);
        setPendingNotifications([]);
      }
    };

    loadAchievements();
  }, [user]);

  const value: AchievementContextType = {
    achievements,
    pendingNotifications,
    checkForNewAchievements,
    markNotificationShown,
    clearAllNotifications
  };

  return (
    <AchievementContext.Provider value={value}>
      {children}
    </AchievementContext.Provider>
  );
};

export const useAchievements = () => {
  const context = useContext(AchievementContext);
  if (context === undefined) {
    throw new Error('useAchievements must be used within an AchievementProvider');
  }
  return context;
};

export default AchievementContext;