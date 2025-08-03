const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
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
  isCompleted: {
    type: Boolean,
    default: false,
    index: true
  },
  bestScore: {
    correct: {
      type: Number,
      default: 0
    },
    total: {
      type: Number,
      default: 10
    },
    percentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    }
  },
  totalAttempts: {
    type: Number,
    default: 0
  },
  firstCompletedAt: {
    type: Date,
    default: null
  },
  lastAttemptAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  averageScore: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  totalTimeSpent: {
    type: Number, // en segundos
    default: 0
  },
  totalHintsUsed: {
    type: Number,
    default: 0
  },
  isLocked: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Índices compuestos únicos para evitar duplicados
progressSchema.index({ userId: 1, topicId: 1, difficulty: 1 }, { unique: true });
progressSchema.index({ userId: 1, isCompleted: 1 });
progressSchema.index({ userId: 1, lastAttemptAt: -1 });

// Middleware para determinar si está desbloqueado antes de guardar
progressSchema.pre('save', async function(next) {
  if (this.isNew) {
    // Para nuevos documentos, determinar si debe estar desbloqueado
    if (this.difficulty === 'easy') {
      this.isLocked = false; // Easy siempre está desbloqueado
    } else {
      // Verificar si las dificultades anteriores están completadas
      this.isLocked = !(await this.constructor.checkDifficultyUnlocked(this.userId, this.difficulty));
    }
  }
  next();
});

// Método estático para verificar si una dificultad está desbloqueada
progressSchema.statics.checkDifficultyUnlocked = async function(userId, difficulty) {
  if (difficulty === 'easy') return true;
  
  // Definir los temas por dificultad según grammarTopics.ts
  const topicsByDifficulty = {
    easy: ['present-tenses', 'articles'],
    medium: ['past-tenses', 'prepositions', 'modal-verbs'],
    hard: ['conditionals']
  };
  
  // Determinar qué dificultad se requiere completar
  let requiredDifficulty;
  let requiredTopics;
  
  if (difficulty === 'medium') {
    requiredDifficulty = 'easy';
    requiredTopics = topicsByDifficulty.easy;
  } else if (difficulty === 'hard') {
    requiredDifficulty = 'medium';
    requiredTopics = topicsByDifficulty.medium;
  } else {
    return false; // Dificultad no válida
  }
  
  // Verificar que TODOS los temas del nivel anterior estén completados
  for (const topicId of requiredTopics) {
    const progress = await this.findOne({
      userId,
      topicId,
      difficulty: requiredDifficulty,
      isCompleted: true
    });
    
    if (!progress) {
      console.log(`❌ Tema ${topicId} en dificultad ${requiredDifficulty} no completado para usuario ${userId}`);
      return false; // Si falta algún tema, no se puede desbloquear
    }
  }
  
  console.log(`✅ Todos los temas de ${requiredDifficulty} completados. Desbloqueando ${difficulty} para usuario ${userId}`);
  return true; // Todos los temas requeridos están completados
};

// Método estático para obtener dificultades desbloqueadas de un usuario
progressSchema.statics.getUnlockedDifficulties = async function(userId) {
  const unlocked = ['easy']; // Easy siempre está desbloqueado
  
  if (await this.checkDifficultyUnlocked(userId, 'medium')) {
    unlocked.push('medium');
  }
  
  if (await this.checkDifficultyUnlocked(userId, 'hard')) {
    unlocked.push('hard');
  }
  
  return unlocked;
};

// Método para actualizar progreso con un nuevo intento
progressSchema.methods.updateWithAttempt = function(attemptData) {
  console.log('🔄 Actualizando progreso con intento:', {
    currentState: {
      totalAttempts: this.totalAttempts,
      bestScore: this.bestScore,
      isCompleted: this.isCompleted,
      averageScore: this.averageScore
    },
    newAttempt: attemptData
  });

  const { score, timeSpent = 0, hintsUsed = 0 } = attemptData;
  
  // Incrementar total de intentos
  this.totalAttempts += 1;
  
  // Actualizar mejor puntaje si es necesario
  if (!this.bestScore || score.percentage > this.bestScore.percentage) {
    console.log('📈 Actualizando mejor puntaje:', {
      old: this.bestScore,
      new: score
    });
    
    this.bestScore = {
      correct: score.correct,
      total: score.total,
      percentage: score.percentage
    };
    
    // Marcar como completado si alcanza el 70% o más
    if (score.percentage >= 70 && !this.isCompleted) {
      console.log('🎉 Nivel completado! Porcentaje:', score.percentage);
      this.isCompleted = true;
      this.firstCompletedAt = new Date();
    }
  }
  
  // Recalcular promedio de puntajes
  const oldAverage = this.averageScore || 0;
  this.averageScore = Math.round(
    ((oldAverage * (this.totalAttempts - 1)) + score.percentage) / this.totalAttempts
  );
  
  console.log('📊 Promedio actualizado:', {
    old: oldAverage,
    new: this.averageScore,
    totalAttempts: this.totalAttempts
  });
  
  // Actualizar tiempo total y pistas usadas
  this.totalTimeSpent = (this.totalTimeSpent || 0) + timeSpent;
  this.totalHintsUsed = (this.totalHintsUsed || 0) + hintsUsed;
  
  // Actualizar último intento
  this.lastAttemptAt = new Date();
  
  console.log('✅ Estado final del progreso:', {
    totalAttempts: this.totalAttempts,
    bestScore: this.bestScore,
    isCompleted: this.isCompleted,
    averageScore: this.averageScore,
    totalTimeSpent: this.totalTimeSpent,
    totalHintsUsed: this.totalHintsUsed,
    lastAttemptAt: this.lastAttemptAt
  });
};

// Método estático para obtener el progreso completo de un usuario
progressSchema.statics.getUserProgress = async function(userId) {
  const progress = await this.find({ userId })
    .sort({ topicId: 1, difficulty: 1 })
    .lean();
    
  const unlockedDifficulties = await this.getUnlockedDifficulties(userId);
  
  // Calcular puntaje total
  const totalScore = progress.reduce((sum, p) => sum + p.bestScore.percentage, 0);
  
  return {
    levels: progress,
    unlockedDifficulties,
    totalScore,
    totalCompletedLevels: progress.filter(p => p.isCompleted).length,
    lastPlayedAt: progress.length > 0 ? 
      Math.max(...progress.map(p => new Date(p.lastAttemptAt).getTime())) : null
  };
};

// Método estático para inicializar progreso para un nuevo usuario
progressSchema.statics.initializeUserProgress = async function(userId) {
  const topics = ['present-tenses', 'past-tenses', 'conditionals', 'prepositions', 'articles', 'modal-verbs'];
  const difficulties = ['easy', 'medium', 'hard'];
  
  const progressDocs = [];
  
  for (const topicId of topics) {
    for (const difficulty of difficulties) {
      progressDocs.push({
        userId,
        topicId,
        difficulty,
        isLocked: difficulty !== 'easy' // Solo easy está desbloqueado inicialmente
      });
    }
  }
  
  try {
    await this.insertMany(progressDocs, { ordered: false });
  } catch (error) {
    // Ignorar errores de duplicados si ya existen
    if (error.code !== 11000) {
      throw error;
    }
  }
};

module.exports = mongoose.model('Progress', progressSchema); 