const express = require('express');
const SupportMessage = require('../models/SupportMessage');
const { auth, optionalAuth } = require('../middleware/auth');
const router = express.Router();

/**
 * @route   POST /api/support/message
 * @desc    Submit a support message
 * @access  Public (but can be from authenticated users)
 */
router.post('/message', optionalAuth, async (req, res) => {
  try {
    const { message, category = 'other', userEmail } = req.body;

    // Basic validation
    if (!message || message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Message is required'
      });
    }

    if (message.length > 2000) {
      return res.status(400).json({
        success: false,
        message: 'Message cannot exceed 2000 characters'
      });
    }

    // Validate category
    const validCategories = ['technical', 'content', 'account', 'feedback', 'other'];
    if (!validCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category'
      });
    }

    // Create support message
    const supportMessageData = {
      message: message.trim(),
      category,
      userId: req.user ? req.user.id : null,
      userEmail: userEmail || (req.user ? req.user.email : null),
      userAgent: req.headers['user-agent'] || null,
      ipAddress: req.ip || req.connection.remoteAddress || null
    };

    const supportMessage = new SupportMessage(supportMessageData);
    await supportMessage.save();

    // Success response
    res.status(201).json({
      success: true,
      message: 'Message sent successfully! Our support team will get back to you soon.',
      data: {
        id: supportMessage._id,
        status: supportMessage.status,
        createdAt: supportMessage.createdAt
      }
    });

    // Admin log (optional)
    console.log(`📧 New support message received: ${supportMessage._id} - Category: ${category}`);

  } catch (error) {
    console.error('Error saving support message:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error. Please try again.'
    });
  }
});

/**
 * @route   GET /api/support/messages
 * @desc    Get all support messages (Admin only)
 * @access  Private (Admin)
 */
router.get('/messages', auth, async (req, res) => {
  try {
    // Por ahora, solo verificamos que el usuario esté autenticado
    // En una implementación completa, verificaríamos rol de admin
    
    const { 
      status, 
      category, 
      page = 1, 
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Construir filtros
    const filters = {};
    if (status) filters.status = status;
    if (category) filters.category = category;

    // Opciones de paginación
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { [sortBy]: sortOrder === 'desc' ? -1 : 1 },
      populate: {
        path: 'userId',
        select: 'email username'
      }
    };

    const messages = await SupportMessage.find(filters)
      .populate(options.populate)
      .sort(options.sort)
      .limit(options.limit * 1)
      .skip((options.page - 1) * options.limit)
      .exec();

    const total = await SupportMessage.countDocuments(filters);

    res.json({
      success: true,
      data: {
        messages,
        pagination: {
          current: options.page,
          pages: Math.ceil(total / options.limit),
          total,
          limit: options.limit
        }
      }
    });

  } catch (error) {
    console.error('Error getting support messages:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * @route   PUT /api/support/messages/:id/status
 * @desc    Update support message status (Admin only)
 * @access  Private (Admin)
 */
router.put('/messages/:id/status', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body;

    const validStatuses = ['open', 'in_progress', 'resolved', 'closed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const updateData = { 
      status,
      ...(adminNotes && { adminNotes })
    };

    if (status === 'resolved') {
      updateData.resolvedBy = req.user.id;
      updateData.resolvedAt = new Date();
    }

    const message = await SupportMessage.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('userId', 'email username');

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    res.json({
      success: true,
      message: 'Status updated successfully',
      data: message
    });

  } catch (error) {
    console.error('Error updating message status:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * @route   GET /api/support/stats
 * @desc    Get support statistics (Admin only)
 * @access  Private (Admin)
 */
router.get('/stats', auth, async (req, res) => {
  try {
    const stats = await SupportMessage.getStats();
    
    // Estadísticas adicionales
    const totalMessages = await SupportMessage.countDocuments();
    const todayMessages = await SupportMessage.countDocuments({
      createdAt: {
        $gte: new Date(new Date().setHours(0, 0, 0, 0))
      }
    });
    
    const avgResponseTime = await SupportMessage.aggregate([
      { $match: { resolved: true } },
      {
        $group: {
          _id: null,
          avgTime: {
            $avg: {
              $subtract: ['$resolvedAt', '$createdAt']
            }
          }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        statusBreakdown: stats,
        totalMessages,
        todayMessages,
        avgResponseTime: avgResponseTime.length > 0 ? avgResponseTime[0].avgTime : null
      }
    });

  } catch (error) {
    console.error('Error getting support statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;