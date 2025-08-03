const mongoose = require('mongoose');

const userAchievementSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  achievementId: {
    type: String,
    required: true,
    index: true
  },
  // When the achievement was earned
  earnedAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  // Additional context about how it was earned
  earnedContext: {
    topicId: {
      type: String,
      default: null
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: null
    },
    score: {
      type: Number,
      default: null
    },
    attemptId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Attempt',
      default: null
    }
  },
  // Points awarded for this achievement
  pointsAwarded: {
    type: Number,
    default: 0,
    min: 0
  },
  // Whether the user has been notified of this achievement
  isNotified: {
    type: Boolean,
    default: false,
    index: true
  }
}, {
  timestamps: true
});

// Compound indexes for efficient querying
userAchievementSchema.index({ userId: 1, achievementId: 1 }, { unique: true });
userAchievementSchema.index({ userId: 1, earnedAt: -1 });
userAchievementSchema.index({ userId: 1, isNotified: 1 });

// Static method to award achievement to user
userAchievementSchema.statics.awardAchievement = async function(userId, achievementId, context = {}) {
  try {
    // Check if user already has this achievement
    const existing = await this.findOne({ userId, achievementId });
    if (existing) {
      return { success: false, message: 'Achievement already earned', userAchievement: existing };
    }

    // Get achievement details for points
    const Achievement = require('./Achievement');
    const achievement = await Achievement.findOne({ id: achievementId });
    if (!achievement) {
      return { success: false, message: 'Achievement not found' };
    }

    // Create new user achievement
    const userAchievement = new this({
      userId,
      achievementId,
      earnedContext: context,
      pointsAwarded: achievement.points
    });

    await userAchievement.save();

    console.log(`🏆 Achievement "${achievement.name}" awarded to user ${userId}`);
    
    return { 
      success: true, 
      message: 'Achievement awarded successfully',
      userAchievement,
      achievement
    };
  } catch (error) {
    console.error('Error awarding achievement:', error);
    return { success: false, message: 'Database error', error: error.message };
  }
};

// Static method to get user's achievements with details
userAchievementSchema.statics.getUserAchievements = async function(userId, includeAll = false) {
  try {
    const Achievement = require('./Achievement');
    
    if (includeAll) {
      // Get all achievements and mark which ones the user has earned
      const [allAchievements, userAchievements] = await Promise.all([
        Achievement.getActiveAchievements(),
        this.find({ userId }).lean()
      ]);

      const earnedMap = new Map(userAchievements.map(ua => [ua.achievementId, ua]));

      return allAchievements.map(achievement => ({
        ...achievement,
        earned: earnedMap.has(achievement.id),
        earnedAt: earnedMap.get(achievement.id)?.earnedAt || null,
        earnedContext: earnedMap.get(achievement.id)?.earnedContext || null,
        pointsAwarded: earnedMap.get(achievement.id)?.pointsAwarded || 0
      }));
    } else {
      // Get only earned achievements
      const userAchievements = await this.find({ userId })
        .sort({ earnedAt: -1 })
        .lean();

      const achievementIds = userAchievements.map(ua => ua.achievementId);
      const achievements = await Achievement.find({ 
        id: { $in: achievementIds },
        isActive: true 
      }).lean();

      const achievementMap = new Map(achievements.map(a => [a.id, a]));

      return userAchievements
        .filter(ua => achievementMap.has(ua.achievementId))
        .map(ua => ({
          ...achievementMap.get(ua.achievementId),
          earned: true,
          earnedAt: ua.earnedAt,
          earnedContext: ua.earnedContext,
          pointsAwarded: ua.pointsAwarded
        }));
    }
  } catch (error) {
    console.error('Error getting user achievements:', error);
    throw error;
  }
};

// Static method to get user's achievement stats
userAchievementSchema.statics.getUserAchievementStats = async function(userId) {
  try {
    const [earnedCount, totalPoints, recentAchievements] = await Promise.all([
      this.countDocuments({ userId }),
      this.aggregate([
        { $match: { userId: new mongoose.Types.ObjectId(userId) } },
        { $group: { _id: null, totalPoints: { $sum: '$pointsAwarded' } } }
      ]),
      this.find({ userId })
        .sort({ earnedAt: -1 })
        .limit(5)
        .lean()
    ]);

    const Achievement = require('./Achievement');
    const totalAchievements = await Achievement.countDocuments({ isActive: true });

    return {
      earnedCount,
      totalAchievements,
      totalPoints: totalPoints[0]?.totalPoints || 0,
      completionPercentage: totalAchievements > 0 ? Math.round((earnedCount / totalAchievements) * 100) : 0,
      recentAchievements
    };
  } catch (error) {
    console.error('Error getting user achievement stats:', error);
    throw error;
  }
};

// Static method to mark achievements as notified
userAchievementSchema.statics.markAsNotified = async function(userId, achievementIds) {
  try {
    await this.updateMany(
      { 
        userId, 
        achievementId: { $in: achievementIds }
      },
      { 
        isNotified: true 
      }
    );
    return { success: true };
  } catch (error) {
    console.error('Error marking achievements as notified:', error);
    return { success: false, error: error.message };
  }
};

// Static method to get unnotified achievements
userAchievementSchema.statics.getUnnotifiedAchievements = async function(userId) {
  try {
    const unnotified = await this.find({ 
      userId, 
      isNotified: false 
    }).sort({ earnedAt: 1 }).lean();

    const Achievement = require('./Achievement');
    const achievementIds = unnotified.map(ua => ua.achievementId);
    const achievements = await Achievement.find({ 
      id: { $in: achievementIds },
      isActive: true 
    }).lean();

    const achievementMap = new Map(achievements.map(a => [a.id, a]));

    return unnotified
      .filter(ua => achievementMap.has(ua.achievementId))
      .map(ua => ({
        ...achievementMap.get(ua.achievementId),
        earned: true,
        earnedAt: ua.earnedAt,
        earnedContext: ua.earnedContext,
        pointsAwarded: ua.pointsAwarded
      }));
  } catch (error) {
    console.error('Error getting unnotified achievements:', error);
    throw error;
  }
};

module.exports = mongoose.model('UserAchievement', userAchievementSchema);