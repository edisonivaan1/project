const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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
  profileImage: {
    type: String,
    default: null // Base64 encoded image or URL
  },
  isActive: {
    type: Boolean,
    default: true
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

// Initialize progress for new users
userSchema.post('save', async function(doc) {
  // Solo para nuevos usuarios
  if (this.wasNew) {
    try {
      const Progress = require('./Progress');
      await Progress.initializeUserProgress(doc._id);
      console.log(`Progress initialized for new user: ${doc._id}`);
    } catch (error) {
      console.error(`Error initializing progress for user ${doc._id}:`, error);
      // No lanzar error para no interrumpir el registro del usuario
    }
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password_hash);
};

// Compare security answer method
userSchema.methods.compareSecurityAnswer = async function(candidateAnswer) {
  return bcrypt.compare(candidateAnswer.toLowerCase().trim(), this.security_answer_hash);
};

// Método para obtener progreso del usuario desde las nuevas colecciones
userSchema.methods.getGameProgress = async function() {
  try {
    const Progress = require('./Progress');
    return await Progress.getUserProgress(this._id);
  } catch (error) {
    console.error(`Error getting progress for user ${this._id}:`, error);
    return {
      levels: [],
      unlockedDifficulties: ['easy'],
      totalScore: 0,
      totalCompletedLevels: 0,
      lastPlayedAt: null
    };
  }
};

// Remove password from JSON output
userSchema.methods.toJSON = function() {
  const userObject = this.toObject();
  delete userObject.password_hash;
  delete userObject.security_answer_hash;
  return userObject;
};

module.exports = mongoose.model('User', userSchema); 