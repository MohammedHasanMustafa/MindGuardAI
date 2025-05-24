import sqlite3 from "sqlite3";
const { verbose } = sqlite3;
const sqlite = verbose();
const DBSOURCE = "mental_health.db";

const db = new sqlite3.Database(DBSOURCE, (err) => {
  if (err) {
    console.error("Failed to connect to database:", err.message);
    throw err;
  } else {
    console.log("Connected to the SQLite database.");
    initializeDatabase();
  }
});

function initializeDatabase() {
  // Create users table with all required fields
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      bio TEXT DEFAULT '',
      profile_image TEXT DEFAULT '',
      reset_token TEXT,
      reset_token_expiry INTEGER,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create mental_health_analysis table with improved structure
  db.run(`
    CREATE TABLE IF NOT EXISTS mental_health (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL DEFAULT 1,
          text TEXT NOT NULL,
          sentiment TEXT,
          sentiment_confidence REAL,
          disorder TEXT,
          disorder_confidence REAL,
          risk_level TEXT,
          recommendations TEXT,
          timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id)
        )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS self_assessments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      phq9 TEXT, -- Stored as JSON string
      gad7 TEXT, -- Stored as JSON string
      pss TEXT, -- Stored as JSON string
      sleep_quality TEXT, -- Stored as JSON string
      mood INTEGER NOT NULL CHECK(mood BETWEEN 0 AND 4),
      sleep INTEGER NOT NULL CHECK(sleep BETWEEN 0 AND 4),
      energy INTEGER NOT NULL CHECK(energy BETWEEN 0 AND 4),
      appetite INTEGER NOT NULL CHECK(appetite BETWEEN 0 AND 4),
      social INTEGER NOT NULL CHECK(social BETWEEN 0 AND 4),
      notes TEXT DEFAULT '',
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);
}

// =========================
// User CRUD Operations
// =========================

function createUser(name, email, hashedPassword, callback) {
  const query = `
    INSERT INTO users (name, email, password)
    VALUES (?, ?, ?)
  `;
  db.run(query, [name, email, hashedPassword], function(err) {
    callback(err, this.lastID);
  });
}

function getUserByEmail(email, callback) {
  const query = `
    SELECT id, name, email, password, bio, profile_image 
    FROM users 
    WHERE email = ?
  `;
  db.get(query, [email], callback);
}

function getUserById(id, callback) {
  const query = `
    SELECT id, name, email, bio, profile_image, created_at
    FROM users 
    WHERE id = ?
  `;
  db.get(query, [id], callback);
}

function updateUserProfile(id, { name, email, bio, profile_image }, callback) {
  const query = `
    UPDATE users 
    SET name = ?, email = ?, bio = ?, profile_image = ?
    WHERE id = ?
  `;
  db.run(query, [name, email, bio, profile_image, id], function(err) {
    callback(err, this.changes);
  });
}

function updateUserPassword(id, newPassword, callback) {
  const query = `UPDATE users SET password = ? WHERE id = ?`;
  db.run(query, [newPassword, id], callback);
}

function setResetToken(id, token, expiry, callback) {
  const query = `
    UPDATE users 
    SET reset_token = ?, reset_token_expiry = ?
    WHERE id = ?
  `;
  db.run(query, [token, expiry, id], callback);
}

function getUserByResetToken(token, callback) {
  const query = `
    SELECT id, email, reset_token_expiry 
    FROM users 
    WHERE reset_token = ?
  `;
  db.get(query, [token], callback);
}

function clearResetToken(id, callback) {
  const query = `
    UPDATE users 
    SET reset_token = NULL, reset_token_expiry = NULL
    WHERE id = ?
  `;
  db.run(query, [id], callback);
}

// =========================
// Analysis CRUD Operations
// =========================

function insertAnalysis(userId, analysisData, callback) {
  const {
    text,
    sentiment,
    sentiment_confidence,
    disorder,
    disorder_confidence,
    risk_level,
    recommendations
  } = analysisData;

  const query = `
    INSERT INTO mental_health (
      user_id, text, sentiment, sentiment_confidence,
      disorder, disorder_confidence, risk_level,
      recommendations
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;
  
  db.run(query, [
    userId, text, sentiment, sentiment_confidence,
    disorder, disorder_confidence, risk_level,
    JSON.stringify(recommendations)
  ], function(err) {
    callback(err, this.lastID);
  });
}

function getAllUserAnalyses(userId, callback) {
  const query = `
    SELECT * FROM mental_health 
    WHERE user_id = ? 
    ORDER BY timestamp DESC
  `;
  db.all(query, [userId], (err, rows) => {
    if (err) return callback(err);
    
    // Parse recommendations from JSON string to array
    const analyses = rows.map(row => ({
      ...row,
      recommendations: JSON.parse(row.recommendations)
    }));
    
    callback(null, analyses);
  });
}

function getAnalysisById(id, callback) {
  const query = `
    SELECT * FROM mental_health 
    WHERE id = ?
  `;
  db.get(query, [id], (err, row) => {
    if (err || !row) return callback(err || new Error("Analysis not found"));
    
    // Parse recommendations from JSON string to array
    callback(null, {
      ...row,
      recommendations: JSON.parse(row.recommendations)
    });
  });
}

function getRecentAnalyses(userId, limit = 5, callback) {
  const query = `
    SELECT * FROM mental_health_analysis 
    WHERE user_id = ? 
    ORDER BY timestamp DESC 
    LIMIT ?
  `;
  db.all(query, [userId, limit], (err, rows) => {
    if (err) return callback(err);
    
    // Parse recommendations from JSON string to array
    const analyses = rows.map(row => ({
      ...row,
      recommendations: JSON.parse(row.recommendations)
    }));
    
    callback(null, analyses);
  });
}

function createOrUpdateAssessment(userId, assessmentData, callback) {
  const today = new Date().toISOString().split('T')[0];
  
  // Validate userId
  if (!userId) {
    return callback(new Error("User ID is required"));
  }

  // Check if assessment exists for today
  db.get(
    `SELECT id FROM self_assessments 
     WHERE user_id = ? AND date(timestamp) = ?`,
    [userId, today],
    (err, row) => {
      if (err) return callback(err);
      
      if (row) {
        // Update existing assessment
        const updateQuery = `
          UPDATE self_assessments 
          SET phq9 = ?, gad7 = ?, pss = ?, sleep_quality = ?,
              mood = ?, sleep = ?, energy = ?, appetite = ?, social = ?, notes = ?
          WHERE id = ?
        `;
        db.run(updateQuery, [
          JSON.stringify(assessmentData.phq9 || Array(9).fill(0)),
          JSON.stringify(assessmentData.gad7 || Array(7).fill(0)),
          JSON.stringify(assessmentData.pss || Array(10).fill(0)),
          JSON.stringify(assessmentData.sleepQuality || Array(4).fill(0)),
          assessmentData.mood || 2,
          assessmentData.sleep || 2,
          assessmentData.energy || 2,
          assessmentData.appetite || 2,
          assessmentData.social || 2,
          assessmentData.notes || '',
          row.id
        ], function(err) {
          callback(err, { id: row.id, isNew: false });
        });
      } else {
        // Create new assessment
        const insertQuery = `
          INSERT INTO self_assessments (
            user_id, phq9, gad7, pss, sleep_quality,
            mood, sleep, energy, appetite, social, notes
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        db.run(insertQuery, [
          userId,
          JSON.stringify(assessmentData.phq9 || Array(9).fill(0)),
          JSON.stringify(assessmentData.gad7 || Array(7).fill(0)),
          JSON.stringify(assessmentData.pss || Array(10).fill(0)),
          JSON.stringify(assessmentData.sleepQuality || Array(4).fill(0)),
          assessmentData.mood || 2,
          assessmentData.sleep || 2,
          assessmentData.energy || 2,
          assessmentData.appetite || 2,
          assessmentData.social || 2,
          assessmentData.notes || ''
        ], function(err) {
          callback(err, { id: this.lastID, isNew: true });
        });
      }
    }
  );
}

function getUserAssessments(userId, callback) {
  db.all(
    `SELECT * FROM self_assessments 
     WHERE user_id = ? 
     ORDER BY timestamp DESC`,
    [userId],
    (err, rows) => {
      if (err) return callback(err);
      
      // Parse JSON strings back to arrays
      const assessments = rows.map(row => ({
        ...row,
        phq9: JSON.parse(row.phq9),
        gad7: JSON.parse(row.gad7),
        pss: JSON.parse(row.pss),
        sleep_quality: JSON.parse(row.sleep_quality)
      }));
      
      callback(null, assessments);
    }
  );
}

function getStreakCount(userId, callback) {
  db.all(
    `SELECT date(timestamp) as date 
     FROM self_assessments 
     WHERE user_id = ? 
     ORDER BY date DESC`,
    [userId],
    (err, rows) => {
      if (err) return callback(err);
      
      if (!rows.length) return callback(null, 0);
      
      let streak = 0;
      let currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);
      
      for (let i = 0; i < rows.length; i++) {
        const rowDate = new Date(rows[i].date);
        rowDate.setHours(0, 0, 0, 0);
        
        if (i === 0) {
          // Check if most recent assessment is today
          if (rowDate.getTime() === currentDate.getTime()) {
            streak = 1;
            currentDate.setDate(currentDate.getDate() - 1);
            continue;
          } else {
            break; // No streak if most recent isn't today
          }
        }
        
        if (rowDate.getTime() === currentDate.getTime()) {
          streak++;
          currentDate.setDate(currentDate.getDate() - 1);
        } else {
          break;
        }
      }
      
      callback(null, streak);
    }
  );
}

function getAssessmentsByTimePeriod(userId, period, callback) {
  let dateFilter = '';
  const params = [userId];
  
  const now = new Date();
  const startDate = new Date();
  
  switch (period) {
    case 'week':
      startDate.setDate(now.getDate() - 7);
      dateFilter = ' AND date(timestamp) BETWEEN date(?) AND date(?)';
      params.push(startDate.toISOString().split('T')[0], now.toISOString().split('T')[0]);
      break;
    case 'month':
      startDate.setMonth(now.getMonth() - 1);
      dateFilter = ' AND date(timestamp) BETWEEN date(?) AND date(?)';
      params.push(startDate.toISOString().split('T')[0], now.toISOString().split('T')[0]);
      break;
    case 'year':
      startDate.setFullYear(now.getFullYear() - 1);
      dateFilter = ' AND date(timestamp) BETWEEN date(?) AND date(?)';
      params.push(startDate.toISOString().split('T')[0], now.toISOString().split('T')[0]);
      break;
  }
  
  db.all(
    `SELECT 
       id,
       date(timestamp) as date,
       mood, sleep, energy, appetite, social,
       phq9, gad7, pss, sleep_quality
     FROM self_assessments
     WHERE user_id = ? ${dateFilter}
     ORDER BY date ASC`,
    params,
    (err, rows) => {
      if (err) return callback(err);
      
      // Parse JSON strings and calculate averages
      const data = rows.map(row => {
        const phq9 = JSON.parse(row.phq9);
        const gad7 = JSON.parse(row.gad7);
        const pss = JSON.parse(row.pss);
        const sleepQuality = JSON.parse(row.sleep_quality);
        
        return {
          ...row,
          phq9,
          gad7,
          pss,
          sleep_quality: sleepQuality,
          phq9Total: phq9.reduce((a, b) => a + b, 0),
          gad7Total: gad7.reduce((a, b) => a + b, 0)
        };
      });
      
      callback(null, data);
    }
  );
}

// Export all functions at once
export {
  db,
  createUser,
  getUserByEmail,
  getUserById,
  updateUserProfile,
  updateUserPassword,
  setResetToken,
  getUserByResetToken,
  clearResetToken,
  insertAnalysis,
  getAllUserAnalyses,
  getAnalysisById,
  getRecentAnalyses,
  createOrUpdateAssessment,
  getUserAssessments,
  getStreakCount,
  getAssessmentsByTimePeriod
};