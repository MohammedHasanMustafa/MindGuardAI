import { db } from "../config/db.js";

// Insert analysis result with user ID
export function insertAnalysis(data, callback) {
  const {
    userId,
    text,
    sentiment,
    sentiment_confidence,
    disorder,
    disorder_confidence,
    risk_level,
    recommendations
  } = data;

  const query = `
    INSERT INTO mental_health (
      user_id, text, sentiment, sentiment_confidence,
      disorder, disorder_confidence, risk_level,
      recommendations
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const params = [
    userId,
    text,
    sentiment,
    sentiment_confidence,
    disorder,
    disorder_confidence,
    risk_level,
    JSON.stringify(recommendations || [])
  ];

  db.run(query, params, function(err) {
    if (err) {
      console.error('Database insert error:', err);
      return callback(err);
    }
    callback(null, this.lastID);
  });
}

// Get all analysis results for a user by ID
export function getAnalysesByUserId(userId, callback) {
    console.log(`[DB] Querying for user ID: ${userId}`);
    
    if (!userId || isNaN(Number(userId))) {
        console.log('[DB] Invalid user ID format');
        return callback(new Error('Invalid user ID'));
    }

    const query = `
        SELECT 
            id,
            user_id as userId,
            text,
            sentiment,
            sentiment_confidence as sentimentConfidence,
            disorder,
            disorder_confidence as disorderConfidence,
            risk_level as riskLevel,
            recommendations,
            timestamp
        FROM mental_health 
        WHERE user_id = ? 
        ORDER BY id ASC
    `;

    db.all(query, [userId], (err, rows) => {
        if (err) {
            console.error('[DB QUERY ERROR]', err);
            return callback(err);
        }

        console.log(`[DB] Found ${rows.length} rows`);
        
        try {
            const results = rows.map(row => ({
                id: row.id,
                userId: row.userId,
                text: row.text,
                sentiment: row.sentiment,
                sentimentConfidence: row.sentimentConfidence,
                disorder: row.disorder,
                disorderConfidence: row.disorderConfidence,
                riskLevel: row.riskLevel,
                recommendations: row.recommendations ? 
                    JSON.parse(row.recommendations) : [],
                timestamp: row.timestamp
            }));
            
            console.log('[DB] Successfully parsed results');
            callback(null, results);
        } catch (parseError) {
            console.error('[DB PARSE ERROR]', parseError);
            callback(parseError);
        }
    });
}

// Get single analysis by ID
export function getAnalysisById(id, callback) {
    if (!id || isNaN(Number(id))) {
        return callback(new Error('Invalid analysis ID'));
    }

    const query = `
        SELECT 
            id,
            user_id as userId,
            text,
            sentiment,
            sentiment_confidence as sentimentConfidence,
            disorder,
            disorder_confidence as disorderConfidence,
            risk_level as riskLevel,
            recommendations,
            timestamp
        FROM mental_health
        WHERE id = ?`;
    
    db.get(query, [id], (err, row) => {
        if (err) {
            console.error('Database query error:', err);
            return callback(err);
        }

        if (!row) {
            return callback(null, null);
        }

        try {
            const result = {
                ...row,
                recommendations: row.recommendations ? 
                    JSON.parse(row.recommendations) : []
            };
            callback(null, result);
        } catch (parseError) {
            console.error('Error parsing analysis:', parseError);
            callback(parseError);
        }
    });
}

// Delete analysis by ID
export function deleteAnalysis(id, callback) {
    if (!id || isNaN(Number(id))) {
        return callback(new Error('Invalid analysis ID'));
    }

    const query = `DELETE FROM mental_health WHERE id = ?`;
    
    db.run(query, [id], function(err) {
        if (err) {
            console.error('Database delete error:', err);
            return callback(err);
        }
        callback(null, this.changes > 0);
    });
}

// Get risk levels by user ID
export function getRiskLevelsByUserId(userId, callback) {
    if (!userId || isNaN(Number(userId))) {
        return callback(new Error('Invalid user ID'));
    }

    const query = `
        SELECT 
            id,
            timestamp,
            risk_level as riskLevel,
            disorder
        FROM mental_health 
        WHERE user_id = ? 
        ORDER BY timestamp DESC
    `;

    db.all(query, [userId], (err, rows) => {
        if (err) {
            console.error('Database query error:', err);
            return callback(err);
        }
        callback(null, rows);
    });
}

// Get trend graph data for a user by ID
export function getTrendDataByUserId(userId, callback) {
    if (!userId || isNaN(Number(userId))) {
        return callback(new Error('Invalid user ID'));
    }

    const query = `
        SELECT 
            id,
            timestamp,
            sentiment,
            sentiment_confidence as sentimentConfidence,
            disorder,
            disorder_confidence as disorderConfidence,
            risk_level as riskLevel
        FROM mental_health 
        WHERE user_id = ? 
        ORDER BY timestamp ASC
    `;

    db.all(query, [userId], (err, rows) => {
        if (err) {
            console.error('Database query error:', err);
            return callback(err);
        }
        callback(null, rows);
    });
}

// Get all recommendations for a user by ID
export function getSuggestionsByUserId(userId, callback) {
    if (!userId || isNaN(Number(userId))) {
        return callback(new Error('Invalid user ID'));
    }

    const query = `
        SELECT 
            id,
            timestamp,
            disorder,
            risk_level as riskLevel,
            recommendations
        FROM mental_health 
        WHERE user_id = ? 
        AND recommendations IS NOT NULL
        AND recommendations != '[]'
        ORDER BY timestamp DESC
    `;

    db.all(query, [userId], (err, rows) => {
        if (err) {
            console.error('Database query error:', err);
            return callback(err);
        }

        try {
            const results = rows.map(row => ({
                ...row,
                recommendations: row.recommendations ? 
                    JSON.parse(row.recommendations) : []
            }));
            callback(null, results);
        } catch (parseError) {
            console.error('Error parsing suggestions:', parseError);
            callback(parseError);
        }
    });
}

// Add these new model functions

// Get completed suggestions by user ID
export const getCompletedSuggestionsByUserId = (userId) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT recommendation_text 
      FROM completed_recommendations 
      WHERE user_id = ? 
      ORDER BY completed_at DESC
    `;
    
    connection.query(query, [userId], (err, results) => {
      if (err) return reject(err);
      resolve(results.map(r => r.recommendation_text));
    });
  });
};

// Mark recommendation as completed
export const markRecommendationAsCompleted = (userId, recommendationText) => {
  return new Promise((resolve, reject) => {
    const query = `
      INSERT INTO completed_recommendations (user_id, recommendation_text, completed_at)
      VALUES (?, ?, NOW())
      ON DUPLICATE KEY UPDATE completed_at = NOW()
    `;
    
    connection.query(query, [userId, recommendationText], (err, results) => {
      if (err) return reject(err);
      
      // Also update the analysis table to mark this as completed
      const updateQuery = `
        UPDATE analyses 
        SET is_completed = 1 
        WHERE user_id = ? AND recommendations LIKE ?
      `;
      
      connection.query(updateQuery, [userId, `%${recommendationText}%`], (err) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  });
};

// Remove a recommendation
export const removeRecommendation = (userId, recommendationId) => {
  return new Promise((resolve, reject) => {
    const query = `
      DELETE FROM analyses 
      WHERE user_id = ? AND id = ?
    `;
    
    connection.query(query, [userId, recommendationId], (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};