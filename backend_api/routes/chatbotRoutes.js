import express from 'express';
import { 
    analyzeText,
    getUserResults,
    getUserRiskLevels,
    getTrendGraphData,
    getUserSuggestions,
    getCompletedSuggestions,
    markSuggestionCompleted,
    removeSuggestion
} from '../controllers/chatbotController.js';
import { verifySession } from '../middlewares/sessionMiddleware.js';

const router = express.Router();

// Analyze text - requires authentication
router.post('/analyze', verifySession, analyzeText);

// Get all analysis results for the authenticated user
router.get('/results', verifySession, getUserResults);

// Get risk levels for the authenticated user
router.get('/risk-levels', verifySession, getUserRiskLevels);

// Get trend graph data for the authenticated user
router.get('/trend-data', verifySession, getTrendGraphData);

// Get recommendations for the authenticated user
router.get('/suggestions', verifySession, getUserSuggestions);


// New routes for recommendation tracking
router.get('/suggestions/completed', verifySession, getCompletedSuggestions);
router.post('/suggestions/complete', verifySession, markSuggestionCompleted);
router.post('/suggestions/remove', verifySession, removeSuggestion);

export default router;