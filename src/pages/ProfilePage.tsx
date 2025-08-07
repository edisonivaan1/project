import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit2, ChevronRight } from 'lucide-react';
import perfilImage from '../assets/img/perfil.jpg';
import trofeoImage from '../assets/img/trofeo.png';
import estrellaImage from '../assets/img/estrella.png';
import medallaImage from '../assets/img/medalla.jpeg';
import { useAuth } from '../contexts/AuthContext';
import { useGameProgress } from '../contexts/GameProgressContext';
import { progressService, authService } from '../services/api';
import { grammarTopics } from '../data/grammarTopics';

interface UserStats {
  totalPoints: number;
  completedLessons: number;
  totalLessons: number;
  completedTopics: number;
  totalTopics: number;
  overallProgress: number;
  easyMedal: boolean;
  mediumMedal: boolean;
  hardMedal: boolean;
  completedTopicsByDifficulty: {
    easy: string[];
    medium: string[];
    hard: string[];
  };
  // Enhanced gamification data
  totalAttempts: number;
  averageScore: number;
  bestScore: number;
  totalTimeSpent: number; // in seconds
  totalHintsUsed: number;
  streakData: {
    currentStreak: number;
    longestStreak: number;
    lastPlayedAt: string | null;
  };
  achievements: Achievement[];
  levelInfo: {
    currentLevel: number;
    pointsToNextLevel: number;
    levelProgress: number;
  };
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedAt?: string;
  category: 'completion' | 'performance' | 'consistency' | 'exploration';
}

const ProfilePage: React.FC = () => {
  const { user, logout, refreshUser } = useAuth();
  const navigate = useNavigate();
  const { 
    isLevelCompleted, 
    levels 
  } = useGameProgress();
  
  const [userStats, setUserStats] = useState<UserStats>({
    totalPoints: 0,
    completedLessons: 0,
    totalLessons: 0,
    completedTopics: 0,
    totalTopics: 0,
    overallProgress: 0,
    easyMedal: false,
    mediumMedal: false,
    hardMedal: false,
    completedTopicsByDifficulty: {
      easy: [],
      medium: [],
      hard: []
    },
    totalAttempts: 0,
    averageScore: 0,
    bestScore: 0,
    totalTimeSpent: 0,
    totalHintsUsed: 0,
    streakData: {
      currentStreak: 0,
      longestStreak: 0,
      lastPlayedAt: null
    },
    achievements: [],
    levelInfo: {
      currentLevel: 1,
      pointsToNextLevel: 100,
      levelProgress: 0
    }
  });
  const [isLoading, setIsLoading] = useState(true);
  const [profileImage, setProfileImage] = useState<string>(perfilImage);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      calculateUserStats();
    }
  }, [user, levels]);

  const calculateUserStats = async () => {
    try {
      setIsLoading(true);
      
      // Fetch comprehensive data from backend
      const [progressResponse, statsResponse] = await Promise.all([
        progressService.getProgress(),
        progressService.getStats()
      ]);

      console.log('Progress Response:', progressResponse);
      console.log('Stats Response:', statsResponse);

      let completedLessons = 0;
      let totalPoints = 0;
      const completedTopicsByDifficulty = {
        easy: [] as string[],
        medium: [] as string[],
        hard: [] as string[]
      };
      
      const questionsPerLesson = 10;
      const totalLessons = grammarTopics.length * 3;

      // Calculate completed lessons and topics
      let completedTopics = 0;
      const totalTopics = grammarTopics.length;

      grammarTopics.forEach(topic => {
        let topicCompleted = false;
        ['easy', 'medium', 'hard'].forEach(difficulty => {
          const difficultyKey = difficulty as 'easy' | 'medium' | 'hard';
          
          if (isLevelCompleted(topic.id, difficultyKey)) {
            completedLessons++;
            totalPoints += questionsPerLesson;
            completedTopicsByDifficulty[difficultyKey].push(topic.title);
            
            // Mark topic as completed if at least one difficulty is completed
            if (!topicCompleted) {
              topicCompleted = true;
              completedTopics++;
            }
          }
        });
      });

      const overallProgress = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

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

      // Extract backend statistics
      const backendStats = statsResponse?.data?.attemptStats || {};
      const progressSummary = statsResponse?.data?.progressSummary || {};

      // Calculate level information
      const levelInfo = calculateLevelInfo(totalPoints);

      // Generate achievements
      const achievements = generateAchievements({
        completedLessons,
        totalPoints,
        averageScore: backendStats.avgScore || 0,
        bestScore: backendStats.bestScore || 0,
        totalAttempts: backendStats.totalAttempts || 0,
        totalTimeSpent: backendStats.totalTimeSpent || 0,
        totalHintsUsed: backendStats.totalHintsUsed || 0,
        easyMedal,
        mediumMedal,
        hardMedal,
        overallProgress
      });

      // Calculate streak data
      const streakData = calculateStreakData(progressSummary.lastPlayedAt);

      setUserStats({
        totalPoints,
        completedLessons,
        totalLessons,
        completedTopics,
        totalTopics,
        overallProgress,
        easyMedal,
        mediumMedal,
        hardMedal,
        completedTopicsByDifficulty,
        totalAttempts: backendStats.totalAttempts || 0,
        averageScore: Math.round(backendStats.avgScore || 0),
        bestScore: Math.round(backendStats.bestScore || 0),
        totalTimeSpent: backendStats.totalTimeSpent || 0,
        totalHintsUsed: backendStats.totalHintsUsed || 0,
        streakData,
        achievements,
        levelInfo
      });

    } catch (error) {
      console.error('Error calculating user stats:', error);
      // Set fallback data on error
      setUserStats(prev => ({
        ...prev,
        totalAttempts: 0,
        averageScore: 0,
        bestScore: 0,
        totalTimeSpent: 0,
        totalHintsUsed: 0,
        achievements: []
      }));
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to calculate user level based on points
  const calculateLevelInfo = (totalPoints: number) => {
    const pointsPerLevel = 100;
    const currentLevel = Math.floor(totalPoints / pointsPerLevel) + 1;
    const pointsInCurrentLevel = totalPoints % pointsPerLevel;
    const pointsToNextLevel = pointsPerLevel - pointsInCurrentLevel;
    const levelProgress = (pointsInCurrentLevel / pointsPerLevel) * 100;

    return {
      currentLevel,
      pointsToNextLevel,
      levelProgress: Math.round(levelProgress)
    };
  };

  // Helper function to generate achievements
  const generateAchievements = (data: any): Achievement[] => {
    const achievements: Achievement[] = [
      // Completion achievements
      {
        id: 'first_steps',
        name: 'First Steps',
        description: 'Complete your first lesson',
        icon: '🎯',
        earned: data.completedLessons >= 1,
        category: 'completion'
      },
      {
        id: 'getting_started',
        name: 'Getting Started',
        description: 'Complete 5 lessons',
        icon: '🚀',
        earned: data.completedLessons >= 5,
        category: 'completion'
      },
      {
        id: 'grammar_explorer',
        name: 'Grammar Explorer',
        description: 'Complete 10 lessons',
        icon: '🗺️',
        earned: data.completedLessons >= 10,
        category: 'completion'
      },
      {
        id: 'dedicated_learner',
        name: 'Dedicated Learner',
        description: 'Complete 15 lessons',
        icon: '📚',
        earned: data.completedLessons >= 15,
        category: 'completion'
      },
      // Performance achievements
      {
        id: 'perfectionist',
        name: 'Perfectionist',
        description: 'Achieve 100% on any lesson',
        icon: '⭐',
        earned: data.bestScore >= 100,
        category: 'performance'
      },
      {
        id: 'high_achiever',
        name: 'High Achiever',
        description: 'Maintain 85% average score',
        icon: '🏆',
        earned: data.averageScore >= 85,
        category: 'performance'
      },
      {
        id: 'scholar',
        name: 'Scholar',
        description: 'Maintain 90% average score',
        icon: '🎓',
        earned: data.averageScore >= 90,
        category: 'performance'
      },
      // Difficulty medals
      {
        id: 'easy_master',
        name: 'Easy Master',
        description: 'Complete all Easy topics',
        icon: '🥉',
        earned: data.easyMedal,
        category: 'completion'
      },
      {
        id: 'medium_master',
        name: 'Medium Master',
        description: 'Complete all Medium topics',
        icon: '🥈',
        earned: data.mediumMedal,
        category: 'completion'
      },
      {
        id: 'hard_master',
        name: 'Hard Master',
        description: 'Complete all Hard topics',
        icon: '🥇',
        earned: data.hardMedal,
        category: 'completion'
      },
      // Consistency achievements
      {
        id: 'persistent',
        name: 'Persistent',
        description: 'Make 10 attempts',
        icon: '💪',
        earned: data.totalAttempts >= 10,
        category: 'consistency'
      },
      {
        id: 'determined',
        name: 'Determined',
        description: 'Make 25 attempts',
        icon: '🔥',
        earned: data.totalAttempts >= 25,
        category: 'consistency'
      },
      // Exploration achievements
      {
        id: 'help_seeker',
        name: 'Help Seeker',
        description: 'Use hints wisely (5+ hints used)',
        icon: '💡',
        earned: data.totalHintsUsed >= 5,
        category: 'exploration'
      },
      {
        id: 'course_complete',
        name: 'Course Complete',
        description: 'Complete 100% of the course',
        icon: '🎉',
        earned: data.overallProgress >= 100,
        category: 'completion'
      }
    ];

    return achievements;
  };

  // Helper function to calculate streak data
  const calculateStreakData = (lastPlayedAt: string | null) => {
    if (!lastPlayedAt) {
      return {
        currentStreak: 0,
        longestStreak: 0,
        lastPlayedAt: null
      };
    }

    const now = new Date();
    const lastPlayed = new Date(lastPlayedAt);
    const daysDifference = Math.floor((now.getTime() - lastPlayed.getTime()) / (1000 * 60 * 60 * 24));

    // Simple streak calculation - could be enhanced with more sophisticated logic
    const currentStreak = daysDifference <= 1 ? 1 : 0;

    return {
      currentStreak,
      longestStreak: Math.max(currentStreak, 1), // Simplified for now
      lastPlayedAt: lastPlayedAt
    };
  };

  const getMembershipDuration = () => {
    if (!user?.createdAt) return 'Unknown';
    const createdDate = new Date(user.createdAt);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - createdDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 30) {
      return `${diffDays} days`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} ${months === 1 ? 'month' : 'months'}`;
    } else {
      const years = Math.floor(diffDays / 365);
      return `${years} ${years === 1 ? 'year' : 'years'}`;
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Helper function to format time in seconds to readable format
  const formatTime = (seconds: number): string => {
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file.');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image is too large. Maximum 5MB.');
      return;
    }

    try {
      setIsUploadingImage(true);
      
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const imageData = e.target?.result as string;
          
          // Upload to backend
          const response = await authService.updateProfileImage(imageData);
          
          if (response.success) {
            setProfileImage(imageData);
            // Refresh user data to update the user context
            await refreshUser();
            console.log('✅ Profile image updated successfully');
          } else {
            throw new Error(response.message || 'Error updating profile image');
          }
        } catch (error) {
          console.error('❌ Error uploading image:', error);
          alert('Error uploading image. Please try again.');
        } finally {
          setIsUploadingImage(false);
        }
      };
      
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('❌ Error processing image:', error);
      alert('Error processing image.');
      setIsUploadingImage(false);
    }
  };

  const triggerImageUpload = () => {
    if (!isUploadingImage) {
      fileInputRef.current?.click();
    }
  };

  const handleDeleteProfileImage = async () => {
    if (isUploadingImage) return;
    
    try {
      setIsUploadingImage(true);
      
      const response = await authService.deleteProfileImage();
      
      if (response.success) {
        setProfileImage(perfilImage); // Reset to default image
        // Refresh user data to update the user context
        await refreshUser();
        console.log('✅ Profile image deleted successfully');
      } else {
        throw new Error(response.message || 'Error deleting profile image');
      }
    } catch (error) {
      console.error('❌ Error deleting image:', error);
      alert('Error deleting image.');
    } finally {
      setIsUploadingImage(false);
    }
  };

  // Load profile image from backend when user data is available
  useEffect(() => {
    if (user?.profileImage) {
      setProfileImage(user.profileImage);
    } else {
      setProfileImage(perfilImage); // Use default image
    }
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p 
            className="text-xl text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2"
            tabIndex={0}
            role="text"
          >
            No user data available
          </p>
          <button 
            onClick={() => navigate('/login')}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            tabIndex={0}
            aria-label="Ir a la página de inicio de sesión"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="text-center py-6 px-4">
        <h1 
          className="text-3xl font-bold text-gray-900 uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2"
          tabIndex={0}
          role="heading"
          aria-level={1}
        >
          Profile
        </h1>
      </div>

      {/* Profile Section */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
            {/* Profile Image */}
            <div className="flex flex-col items-center">
              <div 
                className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                tabIndex={0}
                role="img"
                aria-label={`Profile picture of ${user.first_name} ${user.last_name}`}
              >
                <img 
                  src={profileImage} 
                  alt={`${user.first_name} ${user.last_name}'s profile picture`}
                  className="w-full h-full object-cover object-top"
                  style={{ objectPosition: 'top' }}
                />
              </div>
              
              {/* Edit Button */}
              <button
                onClick={triggerImageUpload}
                disabled={isUploadingImage}
                className={`mt-3 flex items-center space-x-1 px-3 py-2 rounded-full transition-colors text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  isUploadingImage
                    ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                }`}
                aria-label="Edit profile picture"
                tabIndex={0}
              >
                <Edit2 className="w-4 h-4" aria-hidden="true" />
                <span>{isUploadingImage ? 'Uploading...' : 'Edit Photo'}</span>
              </button>

              {/* Delete Button (show if user has custom image OR if local image is different from default) */}
              {(profileImage !== perfilImage) && (
                <button
                  onClick={handleDeleteProfileImage}
                  disabled={isUploadingImage}
                  className={`mt-2 flex items-center space-x-1 px-3 py-1 rounded-full transition-colors text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    isUploadingImage
                      ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                      : 'bg-red-100 text-red-700 hover:bg-red-200'
                  }`}
                  aria-label="Delete profile picture"
                  tabIndex={0}
                >
                  <span>Reset to Default</span>
                </button>
              )}
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                aria-label="Upload new profile picture"
              />
            </div>
            
            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex flex-col md:flex-row justify-between w-full items-start gap-4">
                <div className="flex flex-col">
                  <h2 
                    className="text-3xl font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1"
                    tabIndex={0}
                    role="heading"
                    aria-level={2}
                  >
                    {user.first_name}
                  </h2>
                  <h3 
                    className="text-2xl font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1"
                    tabIndex={0}
                    role="heading"
                    aria-level={3}
                  >
                    {user.last_name}
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span 
                    className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 h-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    tabIndex={0}
                    role="text"
                  >
                    English Level: B1 Intermediate
                  </span>
                  <span 
                    className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 h-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    tabIndex={0}
                    role="text"
                  >
                    Member since {getMembershipDuration()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            {/* Lessons Completed */}
            <div 
              className="bg-blue-50 rounded-lg p-4 flex items-center focus:outline-none focus:ring-2 focus:ring-blue-500"
              tabIndex={0}
              role="region"
              aria-label="Lessons completed statistics"
            >
              <div className="bg-blue-100 p-3 rounded-lg mr-4">
                <img src={trofeoImage} alt="Lessons" className="w-8 h-8" aria-hidden="true" />
              </div>
              <div>
                <p 
                  className="text-sm font-medium text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1"
                  tabIndex={0}
                  role="text"
                >
                  Lessons Completed
                </p>
                <p 
                  className="text-2xl font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1"
                  tabIndex={0}
                  role="text"
                >
                  {isLoading ? '...' : userStats.completedLessons}
                </p>
                <p 
                  className="text-xs text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1"
                  tabIndex={0}
                  role="text"
                >
                  Level {userStats.levelInfo.currentLevel}
                </p>
              </div>
              <ChevronRight className="ml-auto text-gray-400" aria-hidden="true" />
            </div>
            
            {/* Points */}
            <div 
              className="bg-yellow-50 rounded-lg p-4 flex items-center focus:outline-none focus:ring-2 focus:ring-blue-500"
              tabIndex={0}
              role="region"
              aria-label="Total points statistics"
            >
              <div className="bg-yellow-100 p-3 rounded-lg mr-4">
                <img src={estrellaImage} alt="Points" className="w-8 h-8" aria-hidden="true" />
              </div>
              <div>
                <p 
                  className="text-sm font-medium text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1"
                  tabIndex={0}
                  role="text"
                >
                  Total Points
                </p>
                <p 
                  className="text-2xl font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1"
                  tabIndex={0}
                  role="text"
                >
                  {isLoading ? '...' : userStats.totalPoints}
                </p>
                <p 
                  className="text-xs text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1"
                  tabIndex={0}
                  role="text"
                >
                  {userStats.levelInfo.pointsToNextLevel} to next level
                </p>
              </div>
              <ChevronRight className="ml-auto text-gray-400" aria-hidden="true" />
            </div>
            
            {/* Achievements */}
            <div 
              className="bg-purple-50 rounded-lg p-4 flex items-center focus:outline-none focus:ring-2 focus:ring-blue-500"
              tabIndex={0}
              role="region"
              aria-label="Achievements statistics"
            >
              <div className="bg-purple-100 p-3 rounded-lg mr-4">
                <img src={medallaImage} alt="Achievements" className="w-8 h-8 rounded-full" aria-hidden="true" />
              </div>
              <div>
                <p 
                  className="text-sm font-medium text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1"
                  tabIndex={0}
                  role="text"
                >
                  Achievements
                </p>
                <p 
                  className="text-2xl font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1"
                  tabIndex={0}
                  role="text"
                >
                  {isLoading ? '...' : userStats.achievements.filter(a => a.earned).length}
                </p>
                <p 
                  className="text-xs text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1"
                  tabIndex={0}
                  role="text"
                >
                  of {userStats.achievements.length} earned
                </p>
              </div>
              <ChevronRight className="ml-auto text-gray-400" aria-hidden="true" />
            </div>
          </div>

          {/* Detailed Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div 
              className="bg-gray-50 rounded-lg p-4 text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
              tabIndex={0}
              role="region"
              aria-label="Average score statistics"
            >
              <div 
                className="text-2xl font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1"
                tabIndex={0}
                role="text"
              >
                {isLoading ? '...' : userStats.averageScore}%
              </div>
              <div 
                className="text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1"
                tabIndex={0}
                role="text"
              >
                Average Score
              </div>
            </div>
            
            <div 
              className="bg-gray-50 rounded-lg p-4 text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
              tabIndex={0}
              role="region"
              aria-label="Best score statistics"
            >
              <div 
                className="text-2xl font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1"
                tabIndex={0}
                role="text"
              >
                {isLoading ? '...' : userStats.bestScore}%
              </div>
              <div 
                className="text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1"
                tabIndex={0}
                role="text"
              >
                Best Score
              </div>
            </div>
            
            <div 
              className="bg-gray-50 rounded-lg p-4 text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
              tabIndex={0}
              role="region"
              aria-label="Total attempts statistics"
            >
              <div 
                className="text-2xl font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1"
                tabIndex={0}
                role="text"
              >
                {isLoading ? '...' : userStats.totalAttempts}
              </div>
              <div 
                className="text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1"
                tabIndex={0}
                role="text"
              >
                Total Attempts
              </div>
            </div>
            
            <div 
              className="bg-gray-50 rounded-lg p-4 text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
              tabIndex={0}
              role="region"
              aria-label="Time spent statistics"
            >
              <div 
                className="text-2xl font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1"
                tabIndex={0}
                role="text"
              >
                {isLoading ? '...' : formatTime(userStats.totalTimeSpent)}
              </div>
              <div 
                className="text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1"
                tabIndex={0}
                role="text"
              >
                Time Spent
              </div>
            </div>
          </div>

          {/* Progress Section */}
          <div className="mt-8">
            <h3 
              className="text-lg font-medium text-gray-900 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1"
              tabIndex={0}
              role="heading"
              aria-level={3}
            >
              Overall Progress
            </h3>
            <div 
              className="w-full bg-gray-200 rounded-full h-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              tabIndex={0}
              role="progressbar"
              aria-valuenow={userStats.overallProgress}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`Overall progress: ${userStats.overallProgress} percent complete`}
            >
              <div 
                className="bg-blue-600 h-4 rounded-full transition-all duration-300" 
                style={{ width: `${userStats.overallProgress}%` }}
              ></div>
            </div>
            <div className="flex justify-between mt-2 text-sm text-gray-500">
              <p 
                className="focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1"
                tabIndex={0}
                role="text"
              >
                {isLoading ? 'Loading...' : `${userStats.completedTopics} of ${userStats.totalTopics} topics completed`}
              </p>
              <p 
                className="focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1"
                tabIndex={0}
                role="text"
              >
                {isLoading ? '' : `${userStats.overallProgress}% Complete`}
              </p>
            </div>
          </div>

          {/* Level Progress Section */}
          <div className="mt-8">
            <h3 
              className="text-lg font-medium text-gray-900 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1"
              tabIndex={0}
              role="heading"
              aria-level={3}
            >
              Level Progress
            </h3>
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              tabIndex={0}
              role="region"
              aria-label="Level progress information"
            >
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h4 
                    className="text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1"
                    tabIndex={0}
                    role="heading"
                    aria-level={4}
                  >
                    Level {userStats.levelInfo.currentLevel}
                  </h4>
                  <p 
                    className="text-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1"
                    tabIndex={0}
                    role="text"
                  >
                    Grammar Master
                  </p>
                </div>
                <div className="text-right">
                  <p 
                    className="text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1"
                    tabIndex={0}
                    role="text"
                  >
                    {userStats.totalPoints} points
                  </p>
                  <p 
                    className="text-blue-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1"
                    tabIndex={0}
                    role="text"
                  >
                    {userStats.levelInfo.pointsToNextLevel} to next level
                  </p>
                </div>
              </div>
              <div 
                className="w-full bg-blue-300 bg-opacity-30 rounded-full h-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                tabIndex={0}
                role="progressbar"
                aria-valuenow={userStats.levelInfo.levelProgress}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`Level progress: ${userStats.levelInfo.levelProgress} percent complete`}
              >
                <div 
                  className="bg-white h-3 rounded-full transition-all duration-500" 
                  style={{ width: `${userStats.levelInfo.levelProgress}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Achievements Section */}
          <div className="mt-8">
            <h3 
              className="text-lg font-semibold text-gray-900 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1"
              tabIndex={0}
              role="heading"
              aria-level={3}
            >
              Achievements
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {userStats.achievements.map((achievement, index) => (
                <div 
                  key={achievement.id} 
                  className={`p-4 rounded-lg border-2 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    achievement.earned 
                      ? 'bg-yellow-50 border-yellow-200 shadow-md' 
                      : 'bg-gray-50 border-gray-200 opacity-60'
                  }`}
                  title={achievement.description}
                  tabIndex={0}
                  role="button"
                  aria-pressed={achievement.earned}
                  aria-label={`Achievement ${index + 1} of ${userStats.achievements.length}: ${achievement.name} - ${achievement.description}. ${achievement.earned ? 'Earned and unlocked' : 'Not earned yet, locked'}`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      // Anunciar el estado del logro cuando se presiona Enter o Space
                      const announcement = `${achievement.name}: ${achievement.description}. ${achievement.earned ? 'Earned and unlocked' : 'Not earned yet, locked'}`;
                      
                      // Crear anuncio temporal para screen readers
                      const announcer = document.createElement('div');
                      announcer.setAttribute('aria-live', 'polite');
                      announcer.className = 'sr-only';
                      announcer.textContent = announcement;
                      document.body.appendChild(announcer);
                      
                      setTimeout(() => {
                        document.body.removeChild(announcer);
                      }, 1000);
                    }
                  }}
                >
                  <div className="text-center">
                    <div className={`text-3xl mb-2 ${achievement.earned ? '' : 'grayscale'}`}>
                      {achievement.icon}
                    </div>
                    <h4 
                      className={`font-semibold text-sm mb-1 ${
                        achievement.earned ? 'text-gray-900' : 'text-gray-500'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1`}
                      tabIndex={-1}
                      role="heading"
                      aria-level={4}
                    >
                      {achievement.name}
                    </h4>
                    <p 
                      className={`text-xs ${
                        achievement.earned ? 'text-gray-600' : 'text-gray-400'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1`}
                      tabIndex={-1}
                      role="text"
                    >
                      {achievement.description}
                    </p>
                    {achievement.earned && (
                      <div 
                        className="mt-2 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                        tabIndex={-1}
                        role="text"
                        aria-label="Earned status"
                      >
                        Earned
                      </div>
                    )}
                    {!achievement.earned && (
                      <div 
                        className="mt-2 px-2 py-1 bg-gray-100 text-gray-500 rounded-full text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                        tabIndex={-1}
                        role="text"
                        aria-label="Locked status"
                      >
                        Locked
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Difficulty Medals */}
          <div className="mt-12">
            <h3 
              className="text-lg font-semibold text-gray-900 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1"
              tabIndex={0}
              role="heading"
              aria-level={3}
            >
              Difficulty Medals
            </h3>
            <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
              {[
                { name: 'Easy Topics', earned: userStats.easyMedal },
                { name: 'Medium Topics', earned: userStats.mediumMedal },
                { name: 'Hard Topics', earned: userStats.hardMedal }
              ].map((medal, i) => (
                <div 
                  key={i} 
                  className="flex flex-col items-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                  tabIndex={0}
                  role="region"
                  aria-label={`${medal.name} medal: ${medal.earned ? 'Earned' : 'Not earned yet'}`}
                >
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-2 ${
                    medal.earned ? 'bg-yellow-100' : 'bg-gray-100'
                  }`}>
                    <img 
                      src={medallaImage} 
                      alt={`Medal ${i+1}`}
                      className={`w-10 h-10 object-cover rounded-full ${
                        medal.earned ? 'opacity-100' : 'opacity-30 grayscale'
                      }`}
                      aria-hidden="true"
                    />
                  </div>
                  <span 
                    className="text-xs text-center text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1"
                    tabIndex={0}
                    role="text"
                  >
                    {medal.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Logout Button */}
          <div className="mt-8 flex justify-end">
            <button 
              onClick={handleLogout}
              className="px-6 py-2 bg-blue-600 text-white font-medium rounded-full hover:bg-blue-700 transition-colors shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              tabIndex={0}
              aria-label="Cerrar sesión de la aplicación"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
