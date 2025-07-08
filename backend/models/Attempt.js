const mongoose = require('mongoose');

const attemptSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  topicId: {
    type: String,
    required: true,
    enum: ['present-tenses', 'past-tenses', 'conditionals', 'prepositions', 'articles', 'modal-verbs'],
    index: true
  },
  difficulty: {
    type: String,
    required: true,
    enum: ['easy', 'medium', 'hard'],
    index: true
  },
  correct: {
    type: Number,
    required: true,
    min: 0
  },
  total: {
    type: Number,
    required: true,
    min: 1
  },
  percentage: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  timeSpent: {
    type: Number, // en segundos
    default: 0
  },
  hintsUsed: {
    type: Number,
    default: 0
  },
  questionsDetails: [{
    questionId: String,
    userAnswer: mongoose.Schema.Types.Mixed,
    correctAnswer: mongoose.Schema.Types.Mixed,
    isCorrect: Boolean,
    timeSpent: Number, // en segundos
    hintsUsed: Number
  }],
  completedAt: {
    type: Date,
    default: Date.now,
    index: true
  }
}, {
  timestamps: true
});

// Índices compuestos para optimizar consultas
attemptSchema.index({ userId: 1, topicId: 1, difficulty: 1 });
attemptSchema.index({ userId: 1, completedAt: -1 });
attemptSchema.index({ topicId: 1, difficulty: 1, completedAt: -1 });

// Middleware para calcular porcentaje antes de guardar
attemptSchema.pre('save', function(next) {
  if (this.correct !== undefined && this.total !== undefined) {
    this.percentage = Math.round((this.correct / this.total) * 100);
  }
  next();
});

// Método estático para obtener estadísticas de un usuario
attemptSchema.statics.getUserStats = async function(userId, topicId = null, difficulty = null) {
  const match = { userId: new mongoose.Types.ObjectId(userId) };
  if (topicId) match.topicId = topicId;
  if (difficulty) match.difficulty = difficulty;

  const stats = await this.aggregate([
    { $match: match },
    {
      $group: {
        _id: null,
        totalAttempts: { $sum: 1 },
        avgScore: { $avg: '$percentage' },
        bestScore: { $max: '$percentage' },
        totalTimeSpent: { $sum: '$timeSpent' },
        totalHintsUsed: { $sum: '$hintsUsed' }
      }
    }
  ]);

  return stats[0] || {
    totalAttempts: 0,
    avgScore: 0,
    bestScore: 0,
    totalTimeSpent: 0,
    totalHintsUsed: 0
  };
};

// Método estático para obtener el historial de intentos
attemptSchema.statics.getUserHistory = async function(userId, options = {}) {
  const { 
    topicId, 
    difficulty, 
    limit = 10, 
    skip = 0, 
    sortBy = 'completedAt', 
    sortOrder = -1 
  } = options;

  const match = { userId: new mongoose.Types.ObjectId(userId) };
  if (topicId) match.topicId = topicId;
  if (difficulty) match.difficulty = difficulty;

  return await this.find(match)
    .sort({ [sortBy]: sortOrder })
    .limit(limit)
    .skip(skip)
    .populate('userId', 'first_name last_name email')
    .lean();
};

module.exports = mongoose.model('Attempt', attemptSchema); 