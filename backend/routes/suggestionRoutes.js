import express from 'express';
import userAuth from '../middlewares/auth.js'; 
import {
  getSuggestionStatus,
  updateSuggestionStatus,
  resetDailySuggestions,
  getSuggestionStats,
} from '../controllers/suggestionsController.js'; 

const router = express.Router();

// Route to get suggestion statuses
router.get('/status', userAuth, getSuggestionStatus);

// Route to update suggestion status
router.put('/status', userAuth, updateSuggestionStatus);

// Route to reset all suggestions for a new day
router.post('/reset', userAuth, resetDailySuggestions);

// Route to get suggestion statistics
router.get('/stats', userAuth, getSuggestionStats);

export default router;
