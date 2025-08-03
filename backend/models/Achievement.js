const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  icon: {
    type: String,
    required: true,
    default: '🏆'
  },
  category: {
    type: String,
    required: true,
    enum: ['completion', 'performance', 'consistency', 'exploration', 'medal'],
    index: true
  },
  // Requirements object to define conditions for earning the achievement
  requirements: {
    type: {
      type: String,
      required: true,
      enum: [
        'lessons_completed',
        'topics_completed', 
        'score_threshold',
        'average_score',
        'total_attempts',
        'hints_used',
        'difficulty_medals',
        'perfect_scores',
        'time_spent'
      ]
    },
    value: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    },
    operator: {
      type: String,
      enum: ['>=', '>', '=', '<', '<=', 'includes', 'all_true'],
      default: '>='
    }
  },
  // Points awarded when achievement is earned
  points: {
    type: Number,
    default: 10,
    min: 0
  },
  // Order for displaying achievements
  displayOrder: {
    type: Number,
    default: 0,
    index: true
  },
  // Whether this achievement is currently active
  isActive: {
    type: Boolean,
    default: true,
    index: true
  }
}, {
  timestamps: true
});

// Compound index for efficient querying
achievementSchema.index({ category: 1, displayOrder: 1 });
achievementSchema.index({ isActive: 1, displayOrder: 1 });

// Static method to initialize default achievements
achievementSchema.statics.initializeDefaultAchievements = async function() {
  const defaultAchievements = [
    // Completion achievements
    {
      id: 'first_steps',
      name: 'First Steps',
      description: 'Complete your first lesson',
      icon: '🎯',
      category: 'completion',
      requirements: {
        type: 'lessons_completed',
        value: 1,
        operator: '>='
      },
      points: 10,
      displayOrder: 1
    },
    {
      id: 'getting_started',
      name: 'Getting Started',
      description: 'Complete 5 lessons',
      icon: '🚀',
      category: 'completion',
      requirements: {
        type: 'lessons_completed',
        value: 5,
        operator: '>='
      },
      points: 25,
      displayOrder: 2
    },
    {
      id: 'grammar_explorer',
      name: 'Grammar Explorer',
      description: 'Complete 10 lessons',
      icon: '🗺️',
      category: 'completion',
      requirements: {
        type: 'lessons_completed',
        value: 10,
        operator: '>='
      },
      points: 50,
      displayOrder: 3
    },
    {
      id: 'dedicated_learner',
      name: 'Dedicated Learner',
      description: 'Complete 15 lessons',
      icon: '📚',
      category: 'completion',
      requirements: {
        type: 'lessons_completed',
        value: 15,
        operator: '>='
      },
      points: 75,
      displayOrder: 4
    },
    {
      id: 'course_complete',
      name: 'Course Master',
      description: 'Complete all available topics',
      icon: '🎉',
      category: 'completion',
      requirements: {
        type: 'topics_completed',
        value: 6, // Based on current grammar topics
        operator: '>='
      },
      points: 200,
      displayOrder: 5
    },
    
    // Performance achievements
    {
      id: 'perfectionist',
      name: 'Perfectionist',
      description: 'Achieve 100% on any lesson',
      icon: '⭐',
      category: 'performance',
      requirements: {
        type: 'score_threshold',
        value: 100,
        operator: '>='
      },
      points: 30,
      displayOrder: 6
    },
    {
      id: 'high_achiever',
      name: 'High Achiever',
      description: 'Maintain 85% average score',
      icon: '🏆',
      category: 'performance',
      requirements: {
        type: 'average_score',
        value: 85,
        operator: '>='
      },
      points: 50,
      displayOrder: 7
    },
    {
      id: 'scholar',
      name: 'Scholar',
      description: 'Maintain 90% average score',
      icon: '🎓',
      category: 'performance',
      requirements: {
        type: 'average_score',
        value: 90,
        operator: '>='
      },
      points: 75,
      displayOrder: 8
    },
    
    // Medal achievements (difficulty completion)
    {
      id: 'easy_master',
      name: 'Easy Master',
      description: 'Complete all Easy difficulty topics',
      icon: '🥉',
      category: 'medal',
      requirements: {
        type: 'difficulty_medals',
        value: 'easy',
        operator: 'includes'
      },
      points: 100,
      displayOrder: 9
    },
    {
      id: 'medium_master',
      name: 'Medium Master',
      description: 'Complete all Medium difficulty topics',
      icon: '🥈',
      category: 'medal',
      requirements: {
        type: 'difficulty_medals',
        value: 'medium',
        operator: 'includes'
      },
      points: 150,
      displayOrder: 10
    },
    {
      id: 'hard_master',
      name: 'Hard Master',
      description: 'Complete all Hard difficulty topics',
      icon: '🥇',
      category: 'medal',
      requirements: {
        type: 'difficulty_medals',
        value: 'hard',
        operator: 'includes'
      },
      points: 200,
      displayOrder: 11
    },
    
    // Consistency achievements
    {
      id: 'persistent',
      name: 'Persistent',
      description: 'Make 10 attempts',
      icon: '💪',
      category: 'consistency',
      requirements: {
        type: 'total_attempts',
        value: 10,
        operator: '>='
      },
      points: 20,
      displayOrder: 12
    },
    {
      id: 'determined',
      name: 'Determined',
      description: 'Make 25 attempts',
      icon: '🔥',
      category: 'consistency',
      requirements: {
        type: 'total_attempts',
        value: 25,
        operator: '>='
      },
      points: 40,
      displayOrder: 13
    },
    
    // Exploration achievements
    {
      id: 'help_seeker',
      name: 'Help Seeker',
      description: 'Use hints wisely (5+ hints used)',
      icon: '💡',
      category: 'exploration',
      requirements: {
        type: 'hints_used',
        value: 5,
        operator: '>='
      },
      points: 15,
      displayOrder: 14
    }
  ];

  try {
    // Use upsert to avoid duplicates
    for (const achievement of defaultAchievements) {
      await this.findOneAndUpdate(
        { id: achievement.id },
        achievement,
        { upsert: true, new: true }
      );
    }
    console.log('✅ Default achievements initialized successfully');
  } catch (error) {
    console.error('❌ Error initializing default achievements:', error);
    throw error;
  }
};

// Static method to get all active achievements
achievementSchema.statics.getActiveAchievements = async function() {
  return await this.find({ isActive: true })
    .sort({ category: 1, displayOrder: 1 })
    .lean();
};

// Static method to get achievements by category
achievementSchema.statics.getAchievementsByCategory = async function(category) {
  return await this.find({ category, isActive: true })
    .sort({ displayOrder: 1 })
    .lean();
};

module.exports = mongoose.model('Achievement', achievementSchema);