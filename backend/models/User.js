const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Schema para el progreso de cada nivel
const levelProgressSchema = new mongoose.Schema({
  topicId: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    required: true
  },
  isCompleted: {
    type: Boolean,
    default: false
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
      default: 0
    }
  },
  completedAt: {
    type: Date,
    default: null
  },
  attempts: [{
    score: {
      correct: Number,
      total: Number,
      percentage: Number
    },
    completedAt: {
      type: Date,
      default: Date.now
    }
  }]
}, { _id: false });

const userSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [50, 'First name cannot be more than 50 characters']
  },
  last_name: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: [50, 'Last name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email'
    ]
  },
  password_hash: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  security_question: {
    type: String,
    required: [true, 'Security question is required'],
    enum: [
      'What is the name of your first pet?',
      'What is your mother\'s maiden name?',
      'What is your favorite book?',
      'What city were you born in?'
    ]
  },
  security_answer_hash: {
    type: String,
    required: [true, 'Security answer is required']
  },
  // Progreso del juego
  gameProgress: {
    levels: [levelProgressSchema],
    unlockedDifficulties: {
      type: [String],
      enum: ['easy', 'medium', 'hard'],
      default: ['easy'] // Por defecto solo easy está desbloqueado
    },
    totalScore: {
      type: Number,
      default: 0
    },
    lastPlayedAt: {
      type: Date,
      default: null
    }
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password_hash')) return next();
  
  try {
    // Hash password with cost of 12
    const salt = await bcrypt.genSalt(12);
    this.password_hash = await bcrypt.hash(this.password_hash, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Hash security answer before saving
userSchema.pre('save', async function(next) {
  // Only hash the security answer if it has been modified (or is new)
  if (!this.isModified('security_answer_hash')) return next();
  
  try {
    // Hash security answer with cost of 12
    const salt = await bcrypt.genSalt(12);
    this.security_answer_hash = await bcrypt.hash(this.security_answer_hash.toLowerCase().trim(), salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Initialize gameProgress for new users or existing users without it
userSchema.pre('save', function(next) {
  if (this.isNew || !this.gameProgress) {
    this.gameProgress = {
      levels: [],
      unlockedDifficulties: ['easy'],
      totalScore: 0,
      lastPlayedAt: null
    };
  }
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password_hash);
};

// Compare security answer method
userSchema.methods.compareSecurityAnswer = async function(candidateAnswer) {
  return bcrypt.compare(candidateAnswer.toLowerCase().trim(), this.security_answer_hash);
};

// Métodos para manejar progreso del juego
userSchema.methods.updateLevelProgress = function(topicId, difficulty, correct, total) {
  // Validaciones de entrada
  if (!topicId || typeof topicId !== 'string') {
    throw new Error('Topic ID is required and must be a string');
  }
  if (!['easy', 'medium', 'hard'].includes(difficulty)) {
    throw new Error('Difficulty must be easy, medium, or hard');
  }
  if (typeof correct !== 'number' || correct < 0) {
    throw new Error('Correct answers must be a non-negative number');
  }
  if (typeof total !== 'number' || total <= 0) {
    throw new Error('Total questions must be a positive number');
  }
  if (correct > total) {
    throw new Error('Correct answers cannot exceed total questions');
  }

  const percentage = Math.round((correct / total) * 100);
  
  // Inicializar gameProgress si no existe
  if (!this.gameProgress) {
    this.gameProgress = {
      levels: [],
      unlockedDifficulties: ['easy'],
      totalScore: 0,
      lastPlayedAt: null
    };
  }
  
  // Buscar si ya existe progreso para este nivel
  const existingLevelIndex = this.gameProgress.levels.findIndex(
    level => level.topicId === topicId && level.difficulty === difficulty
  );
  
  const newAttempt = {
    score: { correct, total, percentage },
    completedAt: new Date()
  };
  
  if (existingLevelIndex !== -1) {
    // Actualizar nivel existente - SIEMPRE agregar el intento
    const existingLevel = this.gameProgress.levels[existingLevelIndex];
    existingLevel.attempts.push(newAttempt);
    
    // Actualizar mejor puntuación si es necesaria
    if (percentage > existingLevel.bestScore.percentage) {
      existingLevel.bestScore = { correct, total, percentage };
      
      // Marcar como completado solo si tiene 100% de aciertos
      const wasCompleted = existingLevel.isCompleted;
      existingLevel.isCompleted = percentage === 100;
      
      // Solo actualizar completedAt si no estaba completado antes y ahora sí
      if (!wasCompleted && existingLevel.isCompleted) {
        existingLevel.completedAt = new Date();
      }
    }
  } else {
    // Crear nuevo progreso de nivel - SIEMPRE guardar el progreso
    this.gameProgress.levels.push({
      topicId,
      difficulty,
      isCompleted: percentage === 100, // Solo 100% para completar
      bestScore: { correct, total, percentage },
      completedAt: percentage === 100 ? new Date() : null,
      attempts: [newAttempt]
    });
  }
  
  // Actualizar score total (suma de todas las mejores puntuaciones)
  this.gameProgress.totalScore = this.gameProgress.levels.reduce((sum, level) => 
    sum + level.bestScore.correct, 0
  );
  
  this.gameProgress.lastPlayedAt = new Date();
  this.updateUnlockedDifficulties();
  
  console.log(`Level progress updated: ${topicId} ${difficulty} - ${correct}/${total} (${percentage}%) for user ${this._id}`);
};

userSchema.methods.updateUnlockedDifficulties = function() {
  // Asegurar que gameProgress existe
  if (!this.gameProgress) {
    this.gameProgress = {
      levels: [],
      unlockedDifficulties: ['easy'],
      totalScore: 0,
      lastPlayedAt: null
    };
    return;
  }

  const levels = this.gameProgress.levels;
  const unlockedDifficulties = ['easy']; // Easy siempre está desbloqueado
  
  // Definir topics por dificultad
  const topicsByDifficulty = {
    easy: ['present-tenses', 'articles'],
    medium: ['past-tenses', 'prepositions', 'modal-verbs'],
    hard: ['conditionals']
  };
  
  // Verificar si se pueden desbloquear medios - REQUIERE 100% en todos los easy
  const easyCompleted = topicsByDifficulty.easy.every(topicId => {
    const levelProgress = levels.find(level => 
      level.topicId === topicId && level.difficulty === 'easy'
    );
    return levelProgress && 
           levelProgress.isCompleted && 
           levelProgress.bestScore.percentage === 100;
  });
  
  if (easyCompleted) {
    unlockedDifficulties.push('medium');
    
    // Verificar si se pueden desbloquear difíciles - REQUIERE 100% en todos los medium
    const mediumCompleted = topicsByDifficulty.medium.every(topicId => {
      const levelProgress = levels.find(level => 
        level.topicId === topicId && level.difficulty === 'medium'
      );
      return levelProgress && 
             levelProgress.isCompleted && 
             levelProgress.bestScore.percentage === 100;
    });
    
    if (mediumCompleted) {
      unlockedDifficulties.push('hard');
    }
  }
  
  // Solo actualizar si hay cambios
  const currentUnlocked = this.gameProgress.unlockedDifficulties || ['easy'];
  const hasChanges = JSON.stringify(currentUnlocked.sort()) !== JSON.stringify(unlockedDifficulties.sort());
  
  if (hasChanges) {
    this.gameProgress.unlockedDifficulties = unlockedDifficulties;
    console.log(`Unlocked difficulties updated for user ${this._id}:`, unlockedDifficulties);
  }
};

userSchema.methods.canAccessDifficulty = function(difficulty) {
  return this.gameProgress.unlockedDifficulties.includes(difficulty);
};

userSchema.methods.getLevelProgress = function(topicId, difficulty) {
  // Asegurar que gameProgress existe
  if (!this.gameProgress || !this.gameProgress.levels) {
    return null;
  }
  
  // Validar parámetros
  if (!topicId || !difficulty) {
    return null;
  }
  
  return this.gameProgress.levels.find(
    level => level.topicId === topicId && level.difficulty === difficulty
  ) || null;
};

// Remove password from JSON output
userSchema.methods.toJSON = function() {
  const userObject = this.toObject();
  delete userObject.password_hash;
  delete userObject.security_answer_hash;
  return userObject;
};

module.exports = mongoose.model('User', userSchema); 