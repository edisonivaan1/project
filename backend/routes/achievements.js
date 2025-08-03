const express = require('express');
const { body, validationResult } = require('express-validator');
const { auth } = require('../middleware/auth');
const Achievement = require('../models/Achievement');
const UserAchievement = require('../models/UserAchievement');
const AchievementService = require('../services/achievementService');

const router = express.Router();

// @route   GET /api/achievements
// @desc    Get all available achievements
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const achievements = await Achievement.getActiveAchievements();
    
    res.json({
      success: true,
      data: achievements
    });
  } catch (error) {
    console.error('Error fetching achievements:', error);
    res.status(500).json({
      success: false,
      message: 'Error del servidor al obtener achievements'
    });
  }
});

// @route   GET /api/achievements/user
// @desc    Get user's achievements (all achievements with earned status)
// @access  Private
router.get('/user', auth, async (req, res) => {
  try {
    const { includeAll = 'true' } = req.query;
    const shouldIncludeAll = includeAll === 'true';
    
    const userAchievements = await UserAchievement.getUserAchievements(
      req.user._id, 
      shouldIncludeAll
    );
    
    res.json({
      success: true,
      data: userAchievements
    });
  } catch (error) {
    console.error('Error fetching user achievements:', error);
    res.status(500).json({
      success: false,
      message: 'Error del servidor al obtener achievements del usuario'
    });
  }
});

// @route   GET /api/achievements/user/stats
// @desc    Get user's achievement statistics
// @access  Private
router.get('/user/stats', auth, async (req, res) => {
  try {
    const stats = await UserAchievement.getUserAchievementStats(req.user._id);
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching user achievement stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error del servidor al obtener estadísticas de achievements'
    });
  }
});

// @route   GET /api/achievements/user/unnotified
// @desc    Get user's unnotified achievements
// @access  Private
router.get('/user/unnotified', auth, async (req, res) => {
  try {
    const unnotifiedAchievements = await UserAchievement.getUnnotifiedAchievements(req.user._id);
    
    res.json({
      success: true,
      data: unnotifiedAchievements
    });
  } catch (error) {
    console.error('Error fetching unnotified achievements:', error);
    res.status(500).json({
      success: false,
      message: 'Error del servidor al obtener achievements no notificados'
    });
  }
});

// @route   POST /api/achievements/check
// @desc    Manually check for new achievements
// @access  Private
router.post('/check', auth, async (req, res) => {
  try {
    const result = await AchievementService.checkAndAwardAchievements(
      req.user._id,
      req.body.context || {}
    );
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error checking achievements:', error);
    res.status(500).json({
      success: false,
      message: 'Error del servidor al verificar achievements'
    });
  }
});

// @route   POST /api/achievements/mark-notified
// @desc    Mark achievements as notified
// @access  Private
router.post('/mark-notified', [
  auth,
  body('achievementIds')
    .isArray()
    .withMessage('achievementIds debe ser un array')
    .notEmpty()
    .withMessage('achievementIds no puede estar vacío')
], async (req, res) => {
  try {
    // Verificar errores de validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Datos de entrada inválidos',
        errors: errors.array()
      });
    }

    const { achievementIds } = req.body;
    
    const result = await UserAchievement.markAsNotified(req.user._id, achievementIds);
    
    if (result.success) {
      res.json({
        success: true,
        message: 'Achievements marcados como notificados exitosamente'
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Error al marcar achievements como notificados',
        error: result.error
      });
    }
  } catch (error) {
    console.error('Error marking achievements as notified:', error);
    res.status(500).json({
      success: false,
      message: 'Error del servidor al marcar achievements como notificados'
    });
  }
});

// @route   GET /api/achievements/leaderboard
// @desc    Get achievement leaderboard
// @access  Private
router.get('/leaderboard', auth, async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const limitNumber = parseInt(limit);
    
    if (limitNumber < 1 || limitNumber > 50) {
      return res.status(400).json({
        success: false,
        message: 'Limit debe estar entre 1 y 50'
      });
    }
    
    const leaderboard = await AchievementService.getAchievementLeaderboard(limitNumber);
    
    res.json({
      success: true,
      data: leaderboard
    });
  } catch (error) {
    console.error('Error fetching achievement leaderboard:', error);
    res.status(500).json({
      success: false,
      message: 'Error del servidor al obtener leaderboard de achievements'
    });
  }
});

// @route   GET /api/achievements/category/:category
// @desc    Get achievements by category
// @access  Private
router.get('/category/:category', auth, async (req, res) => {
  try {
    const { category } = req.params;
    const validCategories = ['completion', 'performance', 'consistency', 'exploration', 'medal'];
    
    if (!validCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        message: 'Categoría inválida'
      });
    }
    
    const achievements = await Achievement.getAchievementsByCategory(category);
    
    res.json({
      success: true,
      data: achievements
    });
  } catch (error) {
    console.error('Error fetching achievements by category:', error);
    res.status(500).json({
      success: false,
      message: 'Error del servidor al obtener achievements por categoría'
    });
  }
});

// ADMIN ROUTES (for development/testing)

// @route   POST /api/achievements/initialize
// @desc    Initialize default achievements (admin only)
// @access  Private
router.post('/initialize', auth, async (req, res) => {
  try {
    // Only allow in development environment
    if (process.env.NODE_ENV === 'production') {
      return res.status(403).json({
        success: false,
        message: 'Esta operación no está permitida en producción'
      });
    }
    
    await Achievement.initializeDefaultAchievements();
    
    res.json({
      success: true,
      message: 'Achievements por defecto inicializados exitosamente'
    });
  } catch (error) {
    console.error('Error initializing default achievements:', error);
    res.status(500).json({
      success: false,
      message: 'Error del servidor al inicializar achievements'
    });
  }
});

// @route   POST /api/achievements/reset-user
// @desc    Reset user achievements (development only)
// @access  Private
router.post('/reset-user', auth, async (req, res) => {
  try {
    // Only allow in development environment
    if (process.env.NODE_ENV === 'production') {
      return res.status(403).json({
        success: false,
        message: 'Esta operación no está permitida en producción'
      });
    }
    
    await UserAchievement.deleteMany({ userId: req.user._id });
    
    res.json({
      success: true,
      message: 'Achievements del usuario reseteados exitosamente'
    });
  } catch (error) {
    console.error('Error resetting user achievements:', error);
    res.status(500).json({
      success: false,
      message: 'Error del servidor al resetear achievements del usuario'
    });
  }
});

module.exports = router;