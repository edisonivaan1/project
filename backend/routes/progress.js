const express = require('express');
const { body, validationResult } = require('express-validator');
const { auth } = require('../middleware/auth');
const User = require('../models/User');
const Attempt = require('../models/Attempt');
const Progress = require('../models/Progress');
const InProgressAttempt = require('../models/InProgressAttempt');
const AchievementService = require('../services/achievementService');

const router = express.Router();

// Verificar que los modelos estén disponibles
console.log('🔍 Verificando modelos:');
console.log('- User model:', !!User);
console.log('- Attempt model:', !!Attempt);
console.log('- Progress model:', !!Progress);
console.log('- InProgressAttempt model:', !!InProgressAttempt);

// @route   GET /api/progress
// @desc    Obtener el progreso completo del usuario
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const progressData = await Progress.getUserProgress(req.user._id);
    
    res.json({
      success: true,
      data: progressData
    });

  } catch (error) {
    console.error('Error getting progress:', error);
    res.status(500).json({
      success: false,
      message: 'Error del servidor al obtener progreso'
    });
  }
});

// @route   POST /api/progress/complete-level
// @desc    Registrar un intento y actualizar progreso del nivel
// @access  Private
router.post('/complete-level', [
  auth,
  body('topicId')
    .trim()
    .notEmpty()
    .withMessage('Topic ID es requerido')
    .isIn(['present-tenses', 'past-tenses', 'conditionals', 'prepositions', 'articles', 'modal-verbs'])
    .withMessage('Topic ID inválido'),
  body('difficulty')
    .isIn(['easy', 'medium', 'hard'])
    .withMessage('Dificultad debe ser easy, medium o hard'),
  body('correct')
    .isInt({ min: 0 })
    .withMessage('Respuestas correctas debe ser un número positivo'),
  body('total')
    .isInt({ min: 1 })
    .withMessage('Total de preguntas debe ser mayor a 0'),
  body('timeSpent')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Tiempo debe ser un número positivo'),
  body('hintsUsed')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Pistas usadas debe ser un número positivo'),
  body('questionsDetails')
    .optional()
    .isArray()
    .withMessage('Detalles de preguntas debe ser un array'),
  body('questionsDetails.*.questionId')
    .optional()
    .isString()
    .withMessage('ID de pregunta debe ser un string'),
  body('questionsDetails.*.userAnswer')
    .optional()
    .isString()
    .withMessage('Respuesta del usuario debe ser un string'),
  body('questionsDetails.*.correctAnswer')
    .optional()
    .isString()
    .withMessage('Respuesta correcta debe ser un string'),
  body('questionsDetails.*.isCorrect')
    .optional()
    .isBoolean()
    .withMessage('isCorrect debe ser un booleano'),
  body('questionsDetails.*.timeSpent')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Tiempo por pregunta debe ser un número positivo'),
  body('questionsDetails.*.hintsUsed')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Pistas usadas por pregunta debe ser un número positivo')
], async (req, res) => {
  try {
    console.log('\n📝 Recibida petición complete-level:');
    console.log('👤 Usuario:', req.user._id);
    console.log('📦 Datos recibidos:', JSON.stringify(req.body, null, 2));
    console.log('🔑 Headers:', JSON.stringify(req.headers, null, 2));

    // Verificar errores de validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorsArray = errors.array();
      console.log('❌ Errores de validación detallados:');
      errorsArray.forEach((error, index) => {
        console.log(`Error ${index + 1}:`, {
          campo: error.param,
          valor: req.body[error.param],
          mensaje: error.msg,
          ubicación: error.location
        });
      });
      return res.status(400).json({
        success: false,
        message: 'Error de validación',
        errors: errorsArray
      });
    }

    const { 
      topicId, 
      difficulty, 
      correct, 
      total, 
      timeSpent = 0, 
      hintsUsed = 0, 
      questionsDetails = [] 
    } = req.body;
    
    // Validar que correct no sea mayor que total
    if (correct > total) {
      console.log('❌ Error: correct > total');
      return res.status(400).json({
        success: false,
        message: 'Respuestas correctas no puede ser mayor que el total'
      });
    }

    // Verificar si el usuario puede acceder a esta dificultad
    const unlockedDifficulties = await Progress.getUnlockedDifficulties(req.user._id);
    console.log('🔓 Dificultades desbloqueadas:', unlockedDifficulties);
    
    if (!unlockedDifficulties.includes(difficulty)) {
      console.log('❌ Dificultad bloqueada:', difficulty);
      return res.status(403).json({
        success: false,
        message: `No tienes acceso a la dificultad ${difficulty}. Completa los niveles anteriores primero.`
      });
    }

    const percentage = Math.round((correct / total) * 100);

    // Crear el nuevo intento
    const attemptData = {
      userId: req.user._id,
      topicId,
      difficulty,
      correct,
      total,
      percentage: Math.round((correct / total) * 100),
      timeSpent,
      hintsUsed,
      questionsDetails
    };

    console.log('📊 Creando nuevo intento:', attemptData);
    const newAttempt = new Attempt(attemptData);
    
    try {
      await newAttempt.save();
      console.log('✅ Intento guardado:', newAttempt._id);
    } catch (error) {
      console.error('❌ Error al guardar intento:', error);
      throw error;
    }

    // Obtener o crear el progreso del nivel
    let levelProgress = await Progress.findOne({
      userId: req.user._id,
      topicId,
      difficulty
    });

    if (!levelProgress) {
      console.log('📈 Creando nuevo progreso para el nivel');
      levelProgress = new Progress({
        userId: req.user._id,
        topicId,
        difficulty,
        isCompleted: false,
        bestScore: {
          correct: 0,
          total: 0,
          percentage: 0
        },
        totalAttempts: 0,
        firstCompletedAt: null,
        lastAttemptAt: new Date(),
        averageScore: 0,
        totalTimeSpent: 0,
        totalHintsUsed: 0,
        isLocked: false
      });
    } else {
      console.log('📈 Actualizando progreso existente:', levelProgress._id);
    }

    // Actualizar progreso con el nuevo intento
    console.log('📊 Estado del progreso antes de actualizar:', {
      id: levelProgress._id,
      totalAttempts: levelProgress.totalAttempts,
      bestScore: levelProgress.bestScore,
      isCompleted: levelProgress.isCompleted
    });

    // Formatear los datos del intento correctamente
    const formattedAttemptData = {
      score: {
        correct,
        total,
        percentage
      },
      timeSpent,
      hintsUsed
    };

    levelProgress.updateWithAttempt(formattedAttemptData);
    
    console.log('📊 Estado del progreso después de actualizar:', {
      id: levelProgress._id,
      totalAttempts: levelProgress.totalAttempts,
      bestScore: levelProgress.bestScore,
      isCompleted: levelProgress.isCompleted
    });

    try {
      const savedProgress = await levelProgress.save();
      console.log('✅ Progreso guardado:', {
        id: savedProgress._id,
        totalAttempts: savedProgress.totalAttempts,
        bestScore: savedProgress.bestScore,
        isCompleted: savedProgress.isCompleted
      });
    } catch (error) {
      console.error('❌ Error al guardar progreso:', error);
      // Si falla el guardado del progreso, intentar eliminar el intento
      try {
        await Attempt.findByIdAndDelete(newAttempt._id);
        console.log('🧹 Intento eliminado después de error:', newAttempt._id);
      } catch (deleteError) {
        console.error('❌ Error al eliminar intento:', deleteError);
      }
      throw error;
    }

    // Actualizar el estado de desbloqueado de todos los progesos del usuario
    console.log('🔄 Actualizando estados de bloqueo');
    await Progress.updateMany(
      { userId: req.user._id },
      [
        {
          $set: {
            isLocked: {
              $cond: {
                if: { $eq: ["$difficulty", "easy"] },
                then: false,
                else: {
                  $not: {
                    $in: ["$difficulty", unlockedDifficulties]
                  }
                }
              }
            }
          }
        }
      ]
    );

    // Obtener las nuevas dificultades desbloqueadas
    const newUnlockedDifficulties = await Progress.getUnlockedDifficulties(req.user._id);
    const newUnlocks = newUnlockedDifficulties.filter(d => !unlockedDifficulties.includes(d));

    console.log(`✅ Progreso actualizado para usuario ${req.user._id}:`);
    console.log(`- Topic: ${topicId} ${difficulty}`);
    console.log(`- Score: ${correct}/${total} (${percentage}%)`);
    
    if (newUnlocks.length > 0) {
      console.log('🎉 Nuevas dificultades desbloqueadas:', newUnlocks);
    }

    // Check for new achievements after level completion
    let newAchievements = [];
    try {
      const achievementContext = {
        topicId,
        difficulty,
        score: percentage,
        attemptId: newAttempt._id
      };
      
      const achievementResult = await AchievementService.checkAndAwardAchievements(
        req.user._id, 
        achievementContext
      );
      
      if (achievementResult.success && achievementResult.newAchievements.length > 0) {
        newAchievements = achievementResult.newAchievements;
        console.log('🏆 Nuevos achievements ganados:', newAchievements.map(a => a.name));
      }
    } catch (achievementError) {
      console.error('❌ Error checking achievements:', achievementError);
      // Don't fail the entire request if achievement checking fails
    }

    res.json({
      success: true,
      message: 'Progreso actualizado exitosamente',
      data: {
        attempt: newAttempt,
        levelProgress,
        unlockedDifficulties: newUnlockedDifficulties,
        newUnlocks: newUnlocks.length > 0 ? newUnlocks : undefined,
        newAchievements: newAchievements.length > 0 ? newAchievements : undefined
      }
    });

  } catch (error) {
    console.error('❌ Error en complete-level:', error);
    res.status(500).json({
      success: false,
      message: 'Error del servidor al completar nivel'
    });
  }
});

// @route   GET /api/progress/level/:topicId/:difficulty
// @desc    Obtener progreso específico de un nivel
// @access  Private
router.get('/level/:topicId/:difficulty', auth, async (req, res) => {
  try {
    const { topicId, difficulty } = req.params;

    // Validar dificultad
    if (!['easy', 'medium', 'hard'].includes(difficulty)) {
      return res.status(400).json({
        success: false,
        message: 'Dificultad inválida'
      });
    }

    // Validar topicId
    const validTopics = ['present-tenses', 'past-tenses', 'conditionals', 'prepositions', 'articles', 'modal-verbs'];
    if (!validTopics.includes(topicId)) {
      return res.status(400).json({
        success: false,
        message: 'Topic ID inválido'
      });
    }

    // Obtener progreso del nivel
    const levelProgress = await Progress.findOne({
      userId: req.user._id,
      topicId,
      difficulty
    });

    // Obtener intentos recientes para este nivel
    const recentAttempts = await Attempt.getUserHistory(req.user._id, {
      topicId,
      difficulty,
      limit: 5
    });

    // Verificar si puede acceder
    const unlockedDifficulties = await Progress.getUnlockedDifficulties(req.user._id);
    const canAccess = unlockedDifficulties.includes(difficulty);

    res.json({
      success: true,
      data: {
        progress: levelProgress,
        recentAttempts,
        canAccess,
        isLocked: !canAccess
      }
    });

  } catch (error) {
    console.error('Error getting level progress:', error);
    res.status(500).json({
      success: false,
      message: 'Error del servidor al obtener progreso del nivel'
    });
  }
});

// @route   GET /api/progress/unlocked-difficulties
// @desc    Verificar qué dificultades están desbloqueadas
// @access  Private
router.get('/unlocked-difficulties', auth, async (req, res) => {
  try {
    const unlockedDifficulties = await Progress.getUnlockedDifficulties(req.user._id);

    res.json({
      success: true,
      data: {
        unlockedDifficulties,
        canAccessEasy: unlockedDifficulties.includes('easy'),
        canAccessMedium: unlockedDifficulties.includes('medium'),
        canAccessHard: unlockedDifficulties.includes('hard')
      }
    });

  } catch (error) {
    console.error('Error checking unlocked difficulties:', error);
    res.status(500).json({
      success: false,
      message: 'Error del servidor al verificar dificultades desbloqueadas'
    });
  }
});

// @route   GET /api/progress/attempts
// @desc    Obtener historial de intentos del usuario
// @access  Private
router.get('/attempts', auth, async (req, res) => {
  try {
    const {
      topicId,
      difficulty,
      limit = 10,
      skip = 0,
      sortBy = 'completedAt',
      sortOrder = 'desc'
    } = req.query;

    const options = {
      topicId,
      difficulty,
      limit: parseInt(limit),
      skip: parseInt(skip),
      sortBy,
      sortOrder: sortOrder === 'desc' ? -1 : 1
    };

    const attempts = await Attempt.getUserHistory(req.user._id, options);

    res.json({
      success: true,
      data: {
        attempts,
        total: attempts.length,
        hasMore: attempts.length === parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Error getting attempts:', error);
    res.status(500).json({
      success: false,
      message: 'Error del servidor al obtener intentos'
    });
  }
});

// @route   GET /api/progress/stats
// @desc    Obtener estadísticas del usuario
// @access  Private
router.get('/stats', auth, async (req, res) => {
  try {
    const { topicId, difficulty } = req.query;

    const stats = await Attempt.getUserStats(req.user._id, topicId, difficulty);
    const progressData = await Progress.getUserProgress(req.user._id);

    res.json({
      success: true,
      data: {
        attemptStats: stats,
        progressSummary: {
          totalCompletedLevels: progressData.totalCompletedLevels,
          totalScore: progressData.totalScore,
          unlockedDifficulties: progressData.unlockedDifficulties,
          lastPlayedAt: progressData.lastPlayedAt
        }
      }
    });

  } catch (error) {
    console.error('Error getting stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error del servidor al obtener estadísticas'
    });
  }
});

// @route   POST /api/progress/reset
// @desc    Reiniciar progreso del usuario (solo para desarrollo/testing)
// @access  Private
router.post('/reset', auth, async (req, res) => {
  try {
    // Solo permitir en desarrollo
    if (process.env.NODE_ENV === 'production') {
      return res.status(403).json({
        success: false,
        message: 'Operación no permitida en producción'
      });
    }

    // Eliminar todos los intentos y progreso del usuario
    await Attempt.deleteMany({ userId: req.user._id });
    await Progress.deleteMany({ userId: req.user._id });

    // Reinicializar progreso
    await Progress.initializeUserProgress(req.user._id);

    res.json({
      success: true,
      message: 'Progreso reiniciado exitosamente'
    });

  } catch (error) {
    console.error('Error resetting progress:', error);
    res.status(500).json({
      success: false,
      message: 'Error del servidor al reiniciar progreso'
    });
  }
});

// =====================================================
// RUTAS PARA INTENTOS EN PROGRESO
// =====================================================

// @route   GET /api/progress/in-progress/:topicId/:difficulty
// @desc    Obtener intento en progreso del usuario
// @access  Private
router.get('/in-progress/:topicId/:difficulty', auth, async (req, res) => {
  try {
    const { topicId, difficulty } = req.params;
    
    const inProgressAttempt = await InProgressAttempt.findUserAttempt(
      req.user._id,
      topicId,
      difficulty
    );
    
    if (!inProgressAttempt) {
      return res.json({
        success: true,
        data: null,
        message: 'No hay intento en progreso'
      });
    }
    
    res.json({
      success: true,
      data: inProgressAttempt.toFrontendFormat()
    });
    
  } catch (error) {
    console.error('Error getting in-progress attempt:', error);
    res.status(500).json({
      success: false,
      message: 'Error del servidor al obtener intento en progreso'
    });
  }
});

// @route   POST /api/progress/in-progress
// @desc    Crear o actualizar intento en progreso
// @access  Private
router.post('/in-progress', auth, [
  body('topicId')
    .notEmpty()
    .withMessage('ID del tema es requerido')
    .isIn(['present-tenses', 'past-tenses', 'conditionals', 'prepositions', 'articles', 'modal-verbs'])
    .withMessage('ID del tema no válido'),
  body('difficulty')
    .notEmpty()
    .withMessage('Dificultad es requerida')
    .isIn(['easy', 'medium', 'hard'])
    .withMessage('Dificultad no válida'),
  body('totalQuestions')
    .isInt({ min: 1 })
    .withMessage('Total de preguntas debe ser un número positivo'),
  body('currentQuestionIndex')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Índice de pregunta actual debe ser un número no negativo'),
  body('answers')
    .optional()
    .isObject()
    .withMessage('Respuestas deben ser un objeto'),
  body('usedHints')
    .optional()
    .isArray()
    .withMessage('Pistas usadas deben ser un array'),
  body('timePerQuestion')
    .optional()
    .isObject()
    .withMessage('Tiempo por pregunta debe ser un objeto'),
  body('hintsPerQuestion')
    .optional()
    .isObject()
    .withMessage('Pistas por pregunta debe ser un objeto')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Errores de validación',
        errors: errors.array()
      });
    }
    
    const {
      topicId,
      difficulty,
      totalQuestions,
      currentQuestionIndex = 0,
      answers = {},
      usedHints = [],
      timePerQuestion = {},
      hintsPerQuestion = {}
    } = req.body;
    
    // Buscar intento existente
    let inProgressAttempt = await InProgressAttempt.findUserAttempt(
      req.user._id,
      topicId,
      difficulty
    );
    
    if (inProgressAttempt) {
      // Actualizar intento existente
      inProgressAttempt.currentQuestionIndex = currentQuestionIndex;
      inProgressAttempt.usedHints = usedHints;
      
      // Actualizar respuestas
      for (const [questionIndex, answer] of Object.entries(answers)) {
        inProgressAttempt.answers.set(questionIndex, answer);
      }
      
      // Actualizar tiempo por pregunta
      for (const [questionIndex, time] of Object.entries(timePerQuestion)) {
        inProgressAttempt.timePerQuestion.set(questionIndex, time);
      }
      
      // Actualizar pistas por pregunta
      for (const [questionIndex, hints] of Object.entries(hintsPerQuestion)) {
        inProgressAttempt.hintsPerQuestion.set(questionIndex, hints);
      }
      
      await inProgressAttempt.save();
      console.log('📝 Intento en progreso actualizado:', inProgressAttempt._id);
      
    } else {
      // Crear nuevo intento
      inProgressAttempt = new InProgressAttempt({
        userId: req.user._id,
        topicId,
        difficulty,
        totalQuestions,
        currentQuestionIndex,
        usedHints
      });
      
      // Establecer respuestas iniciales
      for (const [questionIndex, answer] of Object.entries(answers)) {
        inProgressAttempt.answers.set(questionIndex, answer);
      }
      
      // Establecer tiempo por pregunta inicial
      for (const [questionIndex, time] of Object.entries(timePerQuestion)) {
        inProgressAttempt.timePerQuestion.set(questionIndex, time);
      }
      
      // Establecer pistas por pregunta inicial
      for (const [questionIndex, hints] of Object.entries(hintsPerQuestion)) {
        inProgressAttempt.hintsPerQuestion.set(questionIndex, hints);
      }
      
      await inProgressAttempt.save();
      console.log('✨ Nuevo intento en progreso creado:', inProgressAttempt._id);
    }
    
    res.json({
      success: true,
      data: inProgressAttempt.toFrontendFormat(),
      message: inProgressAttempt.isNew ? 'Intento creado' : 'Intento actualizado'
    });
    
  } catch (error) {
    console.error('Error saving in-progress attempt:', error);
    res.status(500).json({
      success: false,
      message: 'Error del servidor al guardar intento en progreso'
    });
  }
});

// @route   DELETE /api/progress/in-progress/:topicId/:difficulty
// @desc    Eliminar intento en progreso (al completar o cancelar)
// @access  Private
router.delete('/in-progress/:topicId/:difficulty', auth, async (req, res) => {
  try {
    const { topicId, difficulty } = req.params;
    
    const result = await InProgressAttempt.findOneAndDelete({
      userId: req.user._id,
      topicId,
      difficulty,
      isActive: true
    });
    
    if (!result) {
      return res.json({
        success: true,
        message: 'No había intento en progreso para eliminar'
      });
    }
    
    console.log('🗑️ Intento en progreso eliminado:', result._id);
    
    res.json({
      success: true,
      message: 'Intento en progreso eliminado exitosamente'
    });
    
  } catch (error) {
    console.error('Error deleting in-progress attempt:', error);
    res.status(500).json({
      success: false,
      message: 'Error del servidor al eliminar intento en progreso'
    });
  }
});

// @route   PUT /api/progress/in-progress/:topicId/:difficulty/answer
// @desc    Guardar respuesta de una pregunta específica
// @access  Private
router.put('/in-progress/:topicId/:difficulty/answer', auth, [
  body('questionIndex')
    .isInt({ min: 0 })
    .withMessage('Índice de pregunta debe ser un número no negativo'),
  body('answer')
    .notEmpty()
    .withMessage('Respuesta es requerida'),
  body('timeSpent')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Tiempo debe ser un número no negativo'),
  body('hintsUsed')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Pistas usadas debe ser un número no negativo')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Errores de validación',
        errors: errors.array()
      });
    }
    
    const { topicId, difficulty } = req.params;
    const { questionIndex, answer, timeSpent = 0, hintsUsed = 0 } = req.body;
    
    const inProgressAttempt = await InProgressAttempt.findUserAttempt(
      req.user._id,
      topicId,
      difficulty
    );
    
    if (!inProgressAttempt) {
      return res.status(404).json({
        success: false,
        message: 'No se encontró intento en progreso'
      });
    }
    
    // Guardar la respuesta
    inProgressAttempt.answers.set(questionIndex.toString(), answer);
    
    // Guardar tiempo si se proporciona
    if (timeSpent > 0) {
      inProgressAttempt.timePerQuestion.set(questionIndex.toString(), timeSpent);
    }
    
    // Guardar pistas si se proporcionan
    if (hintsUsed > 0) {
      inProgressAttempt.hintsPerQuestion.set(questionIndex.toString(), hintsUsed);
    }
    
    await inProgressAttempt.save();
    
    res.json({
      success: true,
      data: inProgressAttempt.toFrontendFormat(),
      message: 'Respuesta guardada exitosamente'
    });
    
  } catch (error) {
    console.error('Error saving answer:', error);
    res.status(500).json({
      success: false,
      message: 'Error del servidor al guardar respuesta'
    });
  }
});

module.exports = router; 