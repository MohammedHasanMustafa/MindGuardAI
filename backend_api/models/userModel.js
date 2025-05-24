import { db } from '../config/db.js';

// User model methods
export function createUser(name, email, password, bio = '', profile_image = '', callback) {
  const query = `
    INSERT INTO users (name, email, password, bio, profile_image)
    VALUES (?, ?, ?, ?, ?)
  `;
  db.run(query, [name, email, password, bio, profile_image], function(err) {
    callback(err, this.lastID);
  });
}

export function getUserByEmail(email, callback) {
  const query = `
    SELECT id, name, email, password, bio, profile_image, reset_token, reset_token_expiry
    FROM users 
    WHERE email = ?
  `;
  db.get(query, [email], callback);
}

export function getUserById(id, callback) {
  const query = `
    SELECT id, name, email, bio, profile_image, created_at
    FROM users 
    WHERE id = ?
  `;
  db.get(query, [id], callback);
}

export function updateUserById(id, { name, email, bio, profile_image }, callback) {
  const query = `
    UPDATE users 
    SET name = ?, email = ?, bio = ?, profile_image = ?
    WHERE id = ?
  `;
  db.run(query, [name, email, bio, profile_image, id], function(err) {
    callback(err, this.changes);
  });
}

export function setResetToken(userId, resetToken, resetTokenExpiry, callback) {
  const query = `
    UPDATE users 
    SET reset_token = ?, reset_token_expiry = ?
    WHERE id = ?
  `;
  db.run(query, [resetToken, resetTokenExpiry, userId], callback);
}

export function getUserByResetToken(token, callback) {
  const query = `
    SELECT id, email, reset_token_expiry 
    FROM users 
    WHERE reset_token = ?
  `;
  db.get(query, [token], callback);
}

export function updatePassword(userId, newPassword, callback) {
  const query = `UPDATE users SET password = ? WHERE id = ?`;
  db.run(query, [newPassword, userId], callback);
}

export function clearResetToken(userId, callback) {
  const query = `
    UPDATE users 
    SET reset_token = NULL, reset_token_expiry = NULL 
    WHERE id = ?
  `;
  db.run(query, [userId], callback);
}

export function getUserAnalytics(userId, callback) {
  const query = `
    SELECT 
      COUNT(*) as totalAnalyses,
      AVG(sentiment_confidence) as avgSentimentConfidence,
      MAX(timestamp) as lastAnalysisDate
    FROM mental_health_analysis
    WHERE user_id = ?
  `;
  db.get(query, [userId], callback);
}

export function getMyAnalyses(userId, callback) {
  const query = `
    SELECT * FROM mental_health_analysis 
    WHERE user_id = ?
    ORDER BY timestamp DESC
  `;
  db.all(query, [userId], (err, rows) => {
    if (err) return callback(err);
    
    const analyses = rows.map(row => ({
      ...row,
      recommendations: JSON.parse(row.recommendations)
    }));
    
    callback(null, analyses);
  });
}

// In your userModel.js
export const getCurrentUserProfile = (userId, callback) => {
  const query = `
    SELECT id, name, email, bio, profile_image, timestamp
    FROM users 
    WHERE id = ?
  `;
  console.log('Executing query for user ID:', userId); // Add this for debugging
  db.get(query, [userId], (err, row) => {
    console.log('Query results:', {err, row}); // Add this for debugging
    callback(err, row);
  });
};