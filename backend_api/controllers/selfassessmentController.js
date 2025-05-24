import {
  createOrUpdateAssessment,
  getUserAssessments,
  getStreakCount,
  getAssessmentsByTimePeriod
} from "../config/db.js";

// Create or update an assessment
const createAssessment = async (req, res) => {
  try {
    const { phq9, gad7, pss, sleepQuality, mood, sleep, energy, appetite, social, notes } = req.body;
    const userId = req.user.id; // Make sure this is getting the correct user ID

    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }

    createOrUpdateAssessment(userId, {
      phq9,
      gad7,
      pss,
      sleepQuality,
      mood,
      sleep,
      energy,
      appetite,
      social,
      notes
    }, (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ success: false, message: "Database error" });
      }
      
      res.status(result.isNew ? 201 : 200).json({ 
        success: true, 
        message: result.isNew ? "Assessment created" : "Assessment updated",
        assessmentId: result.id
      });
    });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get all assessments for the user
const getAssessmentData = async (req, res) => {
  try {
    const userId = req.user.id;
    
    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }

    getUserAssessments(userId, (err, assessments) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ success: false, message: "Database error" });
      }
      
      res.status(200).json({ 
        success: true, 
        data: assessments 
      });
    });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ 
      success: false, 
      message: "Server error" 
    });
  }
};

// Get streak count
const getStreakCounts = async (req, res) => {
  try {
    const userId = req.user.id;
    
    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }

    getStreakCount(userId, (err, streak) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ 
          success: false, 
          message: "Database error" 
        });
      }
      
      res.status(200).json({ 
        success: true, 
        streak 
      });
    });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ 
      success: false, 
      message: "Server error" 
    });
  }
};

// Export data
const exportAssessmentData = async (req, res) => {
  try {
    const userId = req.user.id;
    
    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }

    getUserAssessments(userId, (err, assessments) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ success: false, message: "Database error" });
      }
      
      res.status(200).json({ 
        success: true, 
        data: assessments,
        message: "PDF generation would happen here in a real implementation"
      });
    });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ 
      success: false, 
      message: "Server error" 
    });
  }
};

// Get assessments grouped by time period (for heatmap)
const getAssessmentDataByTimePeriod = async (req, res) => {
  try {
    const userId = req.user.id;
    const { period } = req.query; // 'week', 'month', 'year'
    
    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }
    
    if (!['week', 'month', 'year'].includes(period)) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid period. Use 'week', 'month', or 'year'" 
      });
    }
    
    getAssessmentsByTimePeriod(userId, period, (err, data) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ 
          success: false, 
          message: "Failed to fetch heatmap data" 
        });
      }
      
      res.status(200).json({ 
        success: true, 
        data 
      });
    });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ 
      success: false, 
      message: "Server error" 
    });
  }
};

export {
  createAssessment,
  getAssessmentData,
  getAssessmentDataByTimePeriod,
  getStreakCounts,
  exportAssessmentData,
};