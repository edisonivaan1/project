const Achievement = require('../models/Achievement');
const UserAchievement = require('../models/UserAchievement');
const Progress = require('../models/Progress');
const Attempt = require('../models/Attempt');

class AchievementService {
  
  /**
   * Check and award new achievements for a user based on their current stats
   * @param {String} userId - User ID
   * @param {Object} context - Optional context (attemptId, topicId, difficulty, etc.)
   * @returns {Object} Result with newly awarded achievements
   */
  static async checkAndAwardAchievements(userId, context = {}) {
    try {
      console.log(`🔍 Checking achievements for user: ${userId}`);
      
      // Get user's current stats
      const userStats = await this.calculateUserStats(userId);
      
      // Get all active achievements
      const allAchievements = await Achievement.getActiveAchievements();
      
      // Get already earned achievements
      const earnedAchievements = await UserAchievement.find({ userId }).lean();
      const earnedIds = new Set(earnedAchievements.map(ea => ea.achievementId));
      
      // Check each achievement
      const newlyEarned = [];
      
      for (const achievement of allAchievements) {
        // Skip if already earned
        if (earnedIds.has(achievement.id)) {
          continue;
        }
        
        // Check if user meets requirements
        if (await this.meetsRequirements(userStats, achievement.requirements)) {
          const result = await UserAchievement.awardAchievement(
            userId, 
            achievement.id, 
            context
          );
          
          if (result.success) {
            newlyEarned.push(result.achievement);
            console.log(`🏆 NEW ACHIEVEMENT: ${achievement.name} awarded to user ${userId}`);
          }
        }
      }
      
      return {
        success: true,
        newAchievements: newlyEarned,
        totalChecked: allAchievements.length,
        alreadyEarned: earnedIds.size
      };
      
    } catch (error) {
      console.error('Error in checkAndAwardAchievements:', error);
      return {
        success: false,
        error: error.message,
        newAchievements: []
      };
    }
  }
  
  /**
   * Calculate comprehensive user statistics for achievement checking
   * @param {String} userId - User ID
   * @returns {Object} User statistics
   */
  static async calculateUserStats(userId) {
    try {
      // Get progress data
      const progressData = await Progress.getUserProgress(userId);
      
      // Get attempt statistics
      const attemptStats = await Attempt.getUserStats(userId);
      
      // Calculate completed lessons and topics
      let completedLessons = 0;
      let completedTopics = 0;
      const topics = ['present-tenses', 'past-tenses', 'conditionals', 'prepositions', 'articles', 'modal-verbs'];
      const topicCompletionMap = new Map();
      
      // Initialize topic completion tracking
      topics.forEach(topicId => {
        topicCompletionMap.set(topicId, {
          easy: false,
          medium: false,
          hard: false,
          anyCompleted: false
        });
      });
      
      // Process progress levels
      if (progressData.levels) {
        progressData.levels.forEach(level => {
          if (level.isCompleted) {
            completedLessons++;
            
            const topicData = topicCompletionMap.get(level.topicId);
            if (topicData) {
              topicData[level.difficulty] = true;
              topicData.anyCompleted = true;
            }
          }
        });
      }
      
      // Count completed topics (at least one difficulty completed)
      topicCompletionMap.forEach(topicData => {
        if (topicData.anyCompleted) {
          completedTopics++;
        }
      });
      
      // Check difficulty medals
      const difficultyMedals = [];
      topics.forEach(topicId => {
        const topicData = topicCompletionMap.get(topicId);
        if (topicData) {
          if (topicData.easy) difficultyMedals.push('easy');
          if (topicData.medium) difficultyMedals.push('medium');
          if (topicData.hard) difficultyMedals.push('hard');
        }
      });
      
      // Check for complete difficulty medals (all topics in a difficulty)
      const completeDifficultyMedals = [];
      ['easy', 'medium', 'hard'].forEach(difficulty => {
        const completedInDifficulty = topics.filter(topicId => {
          const topicData = topicCompletionMap.get(topicId);
          return topicData && topicData[difficulty];
        });
        
        if (completedInDifficulty.length === topics.length) {
          completeDifficultyMedals.push(difficulty);
        }
      });
      
      return {
        completedLessons,
        completedTopics,
        totalTopics: topics.length,
        totalAttempts: attemptStats.totalAttempts || 0,
        averageScore: Math.round(attemptStats.avgScore || 0),
        bestScore: Math.round(attemptStats.bestScore || 0),
        totalHintsUsed: attemptStats.totalHintsUsed || 0,
        totalTimeSpent: attemptStats.totalTimeSpent || 0,
        difficultyMedals: completeDifficultyMedals,
        lastPlayedAt: progressData.lastPlayedAt
      };
      
    } catch (error) {
      console.error('Error calculating user stats:', error);
      throw error;
    }
  }
  
  /**
   * Check if user meets specific achievement requirements
   * @param {Object} userStats - User statistics
   * @param {Object} requirements - Achievement requirements
   * @returns {Boolean} Whether requirements are met
   */
  static async meetsRequirements(userStats, requirements) {
    const { type, value, operator } = requirements;
    let userValue;
    
    // Get the relevant user statistic
    switch (type) {
      case 'lessons_completed':
        userValue = userStats.completedLessons;
        break;
      case 'topics_completed':
        userValue = userStats.completedTopics;
        break;
      case 'score_threshold':
        userValue = userStats.bestScore;
        break;
      case 'average_score':
        userValue = userStats.averageScore;
        break;
      case 'total_attempts':
        userValue = userStats.totalAttempts;
        break;
      case 'hints_used':
        userValue = userStats.totalHintsUsed;
        break;
      case 'difficulty_medals':
        // Special case: check if user has earned specified difficulty medal
        return userStats.difficultyMedals.includes(value);
      case 'time_spent':
        userValue = userStats.totalTimeSpent;
        break;
      default:
        console.warn(`Unknown requirement type: ${type}`);
        return false;
    }
    
    // Apply operator
    switch (operator) {
      case '>=':
        return userValue >= value;
      case '>':
        return userValue > value;
      case '=':
        return userValue === value;
      case '<':
        return userValue < value;
      case '<=':
        return userValue <= value;
      case 'includes':
        return Array.isArray(userValue) ? userValue.includes(value) : false;
      case 'all_true':
        return Array.isArray(value) ? value.every(v => userValue.includes(v)) : false;
      default:
        console.warn(`Unknown operator: ${operator}`);
        return false;
    }
  }
  
  /**
   * Initialize achievements system for a new user
   * @param {String} userId - User ID
   */
  static async initializeUserAchievements(userId) {
    try {
      console.log(`🔄 Initializing achievements for new user: ${userId}`);
      
      // Check if user already has achievements (avoid duplicate initialization)
      const existingCount = await UserAchievement.countDocuments({ userId });
      if (existingCount > 0) {
        console.log(`User ${userId} already has ${existingCount} achievements`);
        return;
      }
      
      // Check for achievements they might already qualify for
      await this.checkAndAwardAchievements(userId);
      
    } catch (error) {
      console.error('Error initializing user achievements:', error);
    }
  }
  
  /**
   * Get achievement leaderboard
   * @param {Number} limit - Number of top users to return
   * @returns {Array} Leaderboard data
   */
  static async getAchievementLeaderboard(limit = 10) {
    try {
      const leaderboard = await UserAchievement.aggregate([
        {
          $group: {
            _id: '$userId',
            totalPoints: { $sum: '$pointsAwarded' },
            achievementCount: { $sum: 1 },
            latestAchievement: { $max: '$earnedAt' }
          }
        },
        { $sort: { totalPoints: -1, achievementCount: -1 } },
        { $limit: limit },
        {
          $lookup: {
            from: 'users',
            localField: '_id',
            foreignField: '_id',
            as: 'user'
          }
        },
        { $unwind: '$user' },
        {
          $project: {
            userId: '$_id',
            totalPoints: 1,
            achievementCount: 1,
            latestAchievement: 1,
            userName: { $concat: ['$user.first_name', ' ', '$user.last_name'] },
            userEmail: '$user.email'
          }
        }
      ]);
      
      return leaderboard;
    } catch (error) {
      console.error('Error getting achievement leaderboard:', error);
      throw error;
    }
  }
}

module.exports = AchievementService;