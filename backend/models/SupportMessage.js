const mongoose = require('mongoose');

const supportMessageSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
    trim: true,
    maxLength: 2000
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null // Para permitir mensajes de usuarios no registrados
  },
  userEmail: {
    type: String,
    trim: true,
    lowercase: true
  },
  status: {
    type: String,
    enum: ['open', 'in_progress', 'resolved', 'closed'],
    default: 'open'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  category: {
    type: String,
    enum: ['technical', 'content', 'account', 'feedback', 'other'],
    default: 'other'
  },
  userAgent: {
    type: String, // Para información del navegador/dispositivo
    default: null
  },
  ipAddress: {
    type: String,
    default: null
  },
  resolved: {
    type: Boolean,
    default: false
  },
  resolvedAt: {
    type: Date,
    default: null
  },
  resolvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  adminNotes: {
    type: String,
    default: null
  }
}, {
  timestamps: true // Esto agregará createdAt y updatedAt automáticamente
});

// Índices para mejorar las consultas
supportMessageSchema.index({ status: 1 });
supportMessageSchema.index({ priority: 1 });
supportMessageSchema.index({ category: 1 });
supportMessageSchema.index({ userId: 1 });
supportMessageSchema.index({ createdAt: -1 });

// Método virtual para obtener tiempo transcurrido
supportMessageSchema.virtual('timeElapsed').get(function() {
  return Date.now() - this.createdAt;
});

// Método estático para obtener estadísticas
supportMessageSchema.statics.getStats = function() {
  return this.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);
};

// Middleware para actualizar resolvedAt cuando se marca como resuelto
supportMessageSchema.pre('save', function(next) {
  if (this.status === 'resolved' && !this.resolvedAt) {
    this.resolvedAt = new Date();
    this.resolved = true;
  }
  next();
});

module.exports = mongoose.model('SupportMessage', supportMessageSchema);