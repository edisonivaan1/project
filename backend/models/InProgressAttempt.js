const mongoose = require('mongoose');

const inProgressAttemptSchema = new mongoose.Schema({
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
  startTime: {
    type: Date,
    default: Date.now
  },
  lastActivity: {
    type: Date,
    default: Date.now
  },
  currentQuestionIndex: {
    type: Number,
    default: 0,
    min: 0
  },
  answers: {
    type: Map,
    of: String,
    default: new Map()
  },
  usedHints: [{
    type: Number
  }],
  timePerQuestion: {
    type: Map,
    of: Number,
    default: new Map()
  },
  hintsPerQuestion: {
    type: Map,
    of: Number,
    default: new Map()
  },
  totalQuestions: {
    type: Number,
    required: true,
    min: 1
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Índice único para evitar múltiples intentos en progreso por usuario/tema/dificultad
inProgressAttemptSchema.index({ 
  userId: 1, 
  topicId: 1, 
  difficulty: 1 
}, { 
  unique: true 
});

// Índice para consultas por actividad reciente
inProgressAttemptSchema.index({ userId: 1, lastActivity: -1 });

// Middleware para actualizar lastActivity en cada save
inProgressAttemptSchema.pre('save', function(next) {
  if (this.isModified() && !this.isModified('lastActivity')) {
    this.lastActivity = new Date();
  }
  next();
});

// Método para calcular el progreso actual
inProgressAttemptSchema.methods.calculateProgress = function() {
  const answeredQuestions = this.answers.size;
  const percentage = Math.round((answeredQuestions / this.totalQuestions) * 100);
  
  return {
    answeredQuestions,
    totalQuestions: this.totalQuestions,
    percentage,
    currentQuestionIndex: this.currentQuestionIndex
  };
};

// Método para calcular el tiempo total transcurrido
inProgressAttemptSchema.methods.getTotalTimeSpent = function() {
  let totalTime = 0;
  for (const time of this.timePerQuestion.values()) {
    totalTime += time;
  }
  return totalTime;
};

// Método para calcular el total de pistas usadas
inProgressAttemptSchema.methods.getTotalHintsUsed = function() {
  let totalHints = 0;
  for (const hints of this.hintsPerQuestion.values()) {
    totalHints += hints;
  }
  return totalHints;
};

// Método estático para obtener el intento en progreso de un usuario
inProgressAttemptSchema.statics.findUserAttempt = async function(userId, topicId, difficulty) {
  return await this.findOne({
    userId,
    topicId,
    difficulty,
    isActive: true
  });
};

// Método estático para limpiar intentos antiguos (más de 24 horas sin actividad)
inProgressAttemptSchema.statics.cleanupOldAttempts = async function() {
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  
  const result = await this.deleteMany({
    lastActivity: { $lt: twentyFourHoursAgo }
  });
  
  console.log(`🧹 Cleaned up ${result.deletedCount} old in-progress attempts`);
  return result.deletedCount;
};

// Método para convertir a objeto compatible con el frontend
inProgressAttemptSchema.methods.toFrontendFormat = function() {
  const answersObj = {};
  for (const [key, value] of this.answers.entries()) {
    answersObj[key] = value;
  }
  
  const timePerQuestionObj = {};
  for (const [key, value] of this.timePerQuestion.entries()) {
    timePerQuestionObj[key] = value;
  }
  
  const hintsPerQuestionObj = {};
  for (const [key, value] of this.hintsPerQuestion.entries()) {
    hintsPerQuestionObj[key] = value;
  }
  
  return {
    id: this._id.toString(),
    topicId: this.topicId,
    difficulty: this.difficulty,
    startTime: this.startTime.getTime(),
    currentQuestionIndex: this.currentQuestionIndex,
    answers: answersObj,
    usedHints: this.usedHints,
    timePerQuestion: timePerQuestionObj,
    hintsPerQuestion: hintsPerQuestionObj,
    totalQuestions: this.totalQuestions,
    isCompleted: false,
    lastActivity: this.lastActivity.getTime()
  };
};

module.exports = mongoose.model('InProgressAttempt', inProgressAttemptSchema);