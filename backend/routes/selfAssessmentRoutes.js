import express from 'express';
import {
  createAssessment,
  getAssessmentData,
  getAssessmentDataByTimePeriod,
} from '../controllers/selfAssessmentController.js';
import userAuth from '../middlewares/auth.js';

const router = express.Router();

router.post('/assessment', userAuth,  createAssessment); // Create/update for logged-in user
router.get('/assessment', userAuth, getAssessmentData); // Get latest for logged-in user
router.get('/assessment/time-period', userAuth, getAssessmentDataByTimePeriod); // Filtered data

export default router;
