import SuggestionStatus from '../models/suggestionStatus.js';


// Get suggestion statuses for a user based on category and risk level
export const getSuggestionStatus = async (req, res) => {
  try {
    const { category, riskLevel } = req.query;
    const userId = req.user.id; // Assuming user authentication middleware

    // Check if required query parameters are provided
    if (!category || !riskLevel) {
      return res.status(400).json({
        success: false,
        message: 'Category and risk level are required',
      });
    }

    // Get all suggestion statuses for the user with the given category and risk level
    const suggestionStatuses = await SuggestionStatus.find({
      userId,
      category,
      riskLevel,
    });

    // Convert array to an object with suggestionId as keys for easier frontend handling
    const statusObject = {};
    suggestionStatuses.forEach((status) => {
      statusObject[status.suggestionId] = status.status;
    });

    res.status(200).json({
      success: true,
      data: statusObject,
    });
  } catch (error) {
    console.error('Error getting suggestion status:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// Update suggestion status
export const updateSuggestionStatus = async (req, res) => {
  try {
    const { suggestionId, status, category, riskLevel, type, suggestion } = req.body;
    const userId = req.user.id; // Assuming user authentication middleware

    // Check if required parameters are provided
    if (!suggestionId || !status) {
      return res.status(400).json({
        success: false,
        message: 'Suggestion ID and status are required',
      });
    }

    // Validate status value
    if (!['completed', 'ongoing', 'pending'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value. Must be "completed", "ongoing", or "pending"',
      });
    }

    // Try to find an existing suggestion status record
    let suggestionStatus = await SuggestionStatus.findOne({
      userId,
      suggestionId,
    });

    const now = new Date();

    // If record exists, update it
    if (suggestionStatus) {
      suggestionStatus.status = status;
      suggestionStatus.updatedAt = now;
      
      // If status is set to completed, update completion tracking
      if (status === 'completed') {
        suggestionStatus.lastCompletedAt = now;
        suggestionStatus.completedCount += 1;
      }
      
      await suggestionStatus.save();
    } else {
      // If no record exists, create a new one
      // Category, risk level, type, and suggestion text are required for new records
      if (!category || !riskLevel || !type || !suggestion) {
        return res.status(400).json({
          success: false,
          message: 'Category, risk level, type, and suggestion are required for new status records',
        });
      }

      suggestionStatus = await SuggestionStatus.create({
        userId,
        suggestionId,
        category,
        riskLevel,
        type,
        suggestion,
        status,
        updatedAt: now,
        lastCompletedAt: status === 'completed' ? now : null,
        completedCount: status === 'completed' ? 1 : 0,
      });
    }

    res.status(200).json({
      success: true,
      data: suggestionStatus,
    });
  } catch (error) {
    console.error('Error updating suggestion status:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// Reset all suggestions to pending status for a new day
export const resetDailySuggestions = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming user authentication middleware
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to beginning of day

    // Find all suggestions that need resetting (last reset was before today)
    const result = await SuggestionStatus.updateMany(
      {
        userId,
        lastResetDate: { $lt: today },
      },
      {
        $set: {
          status: 'pending',
          lastResetDate: today,
          updatedAt: new Date(),
        },
      }
    );

    res.status(200).json({
      success: true,
      message: `Reset ${result.modifiedCount} suggestions to pending status`,
    });
  } catch (error) {
    console.error('Error resetting suggestion statuses:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// Get suggestions completion statistics for analytics
export const getSuggestionStats = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming user authentication middleware
    const { startDate, endDate } = req.query;
    
    // Parse date range if provided, otherwise use last 30 days
    const end = endDate ? new Date(endDate) : new Date();
    const start = startDate 
      ? new Date(startDate) 
      : new Date(end.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    // Get completion statistics
    const stats = await SuggestionStatus.aggregate([
      {
        $match: {
          userId,
          lastCompletedAt: { $gte: start, $lte: end },
        },
      },
      {
        $group: {
          _id: {
            category: '$category',
            type: '$type',
          },
          completedCount: { $sum: '$completedCount' },
        },
      },
      {
        $group: {
          _id: '$_id.category',
          types: {
            $push: {
              type: '$_id.type',
              count: '$completedCount',
            },
          },
          totalCompleted: { $sum: '$completedCount' },
        },
      },
      {
        $sort: { totalCompleted: -1 },
      },
    ]);
    
    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('Error getting suggestion statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};
