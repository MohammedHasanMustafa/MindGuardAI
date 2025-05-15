
import express from "express";
import { getChatbotResults ,getUserTrends,getUserRiskAlerts,getAllUserChatbotReports} from "../controllers/chatbotController.js";
import userAuth from "../middlewares/auth.js";

const router = express.Router();

router.get("/results", userAuth, getChatbotResults);
router.get("/trends", userAuth, getUserTrends);
router.get("/risk-alerts", userAuth, getUserRiskAlerts);   
router.get("/self-assessment/reports", userAuth, getAllUserChatbotReports);




export default router;
