import Conversation from "../models/conversationModel.js";

export const createConversation = async (req, res) => {
  try {
    const { messages } = req.body;
    const userId = req.userId;

    if (!messages || messages.length === 0) {
      return res.status(400).json({ message: "Messages are required" });
    }

    // Format messages
    const cleanedMessages = messages.map(msg => {
      if (msg.role === 'assistant' && typeof msg.content === 'object') {
        const data = msg.content;

        // Structure to your required format
        return {
          role: msg.role,
          content: {
            sentiment_confidence: data.sentiment_confidence || null,
            disorder_confidence: data.disorder_confidence || null,
            risk_level: data.risk || null,
            explanation: data.lime_explanation || null,
            suggestions: data.recommendations || [],
            risk_alert: data.alert_message || null
          }
        };
      }

      return {
        role: msg.role,
        content: typeof msg.content === 'object' ? JSON.stringify(msg.content) : msg.content
      };
    });

    const newConversation = new Conversation({ userId, messages: cleanedMessages });
    await newConversation.save();

    res.status(201).json(newConversation);
  } catch (error) {
    console.error("Error saving conversation:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};


// Get all conversations for a user
export const getUserConversations = async (req, res) => {
  try {
    const userId = req.userId;
    const conversations = await Conversation.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(conversations);
  } catch (error) {
    console.error("❌ Error fetching conversations:", error);
    res.status(500).json({ message: "Server error fetching conversations" });
  }
};

// Get single conversation by ID
export const getConversationById = async (req, res) => {
  try {
    const { id } = req.params;
    const conversation = await Conversation.findOne({ _id: id, userId: req.userId });

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    res.status(200).json(conversation);
  } catch (error) {
    console.error("❌ Error fetching conversation:", error);
    res.status(500).json({ message: "Server error fetching conversation" });
  }
};
