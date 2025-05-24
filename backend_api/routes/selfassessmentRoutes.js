import express from 'express';
import {
  createAssessment,
  getAssessmentData,
  getAssessmentDataByTimePeriod,
  getStreakCounts,
  exportAssessmentData,
} from '../controllers/selfassessmentController.js';
import { verifySession} from '../middlewares/sessionMiddleware.js';

const router = express.Router();

// Assessment routes
router.post('/', verifySession, createAssessment);
router.get('/', verifySession, getAssessmentData);
router.get('/streak', verifySession, getStreakCounts);
router.get('/export', verifySession, exportAssessmentData);
router.get('/time-period', verifySession, getAssessmentDataByTimePeriod);

export default router;