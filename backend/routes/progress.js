const express = require('express');
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

// @route   GET /api/progress
// @desc    Obtener el progreso completo del usuario
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    res.json({
      success: true,
      data: {
        levels: user.gameProgress.levels,
        unlockedDifficulties: user.gameProgress.unlockedDifficulties,
        totalScore: user.gameProgress.totalScore,
        lastPlayedAt: user.gameProgress.lastPlayedAt
      }
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
// @desc    Marcar un nivel como completado y actualizar puntuación
// @access  Private
router.post('/complete-level', [
  auth,
  body('topicId')
    .trim()
    .notEmpty()
    .withMessage('Topic ID es requerido'),
  body('difficulty')
    .isIn(['easy', 'medium', 'hard'])
    .withMessage('Dificultad debe ser easy, medium o hard'),
  body('correct')
    .isInt({ min: 0 })
    .withMessage('Respuestas correctas debe ser un número positivo'),
  body('total')
    .isInt({ min: 1 })
    .withMessage('Total de preguntas debe ser mayor a 0')
], async (req, res) => {
  try {
    // Verificar errores de validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Error de validación',
        errors: errors.array()
      });
    }

    const { topicId, difficulty, correct, total } = req.body;
    
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    // Verificar si el usuario puede acceder a esta dificultad
    if (!user.canAccessDifficulty(difficulty)) {
      return res.status(403).json({
        success: false,
        message: `No tienes acceso a la dificultad ${difficulty}. Completa los niveles anteriores primero.`
      });
    }

    // Guardar estado previo para detectar cambios
    const previousUnlockedDifficulties = [...user.gameProgress.unlockedDifficulties];
    
    // Actualizar progreso
    user.updateLevelProgress(topicId, difficulty, correct, total);
    await user.save();

    // Obtener el progreso actualizado
    const levelProgress = user.getLevelProgress(topicId, difficulty);
    const currentUnlockedDifficulties = user.gameProgress.unlockedDifficulties;
    
    // Detectar nuevos desbloqueos
    const newUnlocks = currentUnlockedDifficulties.filter(d => !previousUnlockedDifficulties.includes(d));

    console.log(`Progress updated for user ${user._id}: ${topicId} ${difficulty} - ${correct}/${total} (${Math.round((correct/total)*100)}%)`);
    if (newUnlocks.length > 0) {
      console.log(`New unlocks for user ${user._id}:`, newUnlocks);
    }

    res.json({
      success: true,
      message: 'Progreso actualizado exitosamente',
      data: {
        levelProgress,
        unlockedDifficulties: currentUnlockedDifficulties,
        newUnlocks: newUnlocks.length > 0 ? newUnlocks : undefined
      }
    });

  } catch (error) {
    console.error('Error completing level:', error);
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

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    const levelProgress = user.getLevelProgress(topicId, difficulty);
    const canAccess = user.canAccessDifficulty(difficulty);

    res.json({
      success: true,
      data: {
        progress: levelProgress,
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
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    // Actualizar dificultades desbloqueadas por si acaso
    user.updateUnlockedDifficulties();
    await user.save();

    res.json({
      success: true,
      data: {
        unlockedDifficulties: user.gameProgress.unlockedDifficulties,
        canAccessEasy: user.canAccessDifficulty('easy'),
        canAccessMedium: user.canAccessDifficulty('medium'),
        canAccessHard: user.canAccessDifficulty('hard')
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

// @route   GET /api/progress/stats
// @desc    Obtener estadísticas generales del usuario
// @access  Private
router.get('/stats', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    const levels = user.gameProgress.levels;
    
    // Calcular estadísticas
    const stats = {
      totalLevelsCompleted: levels.filter(l => l.isCompleted).length,
      totalLevelsPlayed: levels.length,
      averageScore: levels.length > 0 
        ? Math.round(levels.reduce((sum, l) => sum + l.bestScore.percentage, 0) / levels.length)
        : 0,
      completedByDifficulty: {
        easy: levels.filter(l => l.difficulty === 'easy' && l.isCompleted).length,
        medium: levels.filter(l => l.difficulty === 'medium' && l.isCompleted).length,
        hard: levels.filter(l => l.difficulty === 'hard' && l.isCompleted).length
      },
      totalAttempts: levels.reduce((sum, l) => sum + l.attempts.length, 0),
      lastPlayedAt: user.gameProgress.lastPlayedAt
    };

    res.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Error getting stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error del servidor al obtener estadísticas'
    });
  }
});

module.exports = router; 