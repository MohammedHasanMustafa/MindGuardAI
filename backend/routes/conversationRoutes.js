import express from "express";
import {
  createConversation,
  getUserConversations,
  getConversationById,
 
} from "../controllers/conversationController.js";
import userAuth from "../middlewares/auth.js";

const router = express.Router();

router.post("/", userAuth, createConversation); // Save new conversation
router.get("/", userAuth, getUserConversations); // Get all for logged-in user
router.get("/:id", userAuth, getConversationById); // Get specific conversation


export default router;