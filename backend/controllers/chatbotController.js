import Conversation from "../models/conversationModel.js";
import mongoose from 'mongoose';

// Normalize the content in the conversation message
const normalizeContent = (content) => {
  if (typeof content === 'object') {
    return JSON.stringify(content);
  }
  return content;
};

// Normalize the risk level (if it includes any variant of 'high', 'moderate', or 'low')
const normalizeRiskLevel = (risk) => {
  const normalized = risk?.toLowerCase();
  if (normalized?.includes("high")) return "High";
  if (normalized?.includes("moderate")) return "Moderate";
  return "Low";
};

// Legacy text content parser
const parseLegacyTextContent = (text) => {
  const sentimentMatch = text.match(/Sentiment:\s*(\w+)\s*\((\d+)%\)/);
  const disorderMatch = text.match(/Disorder:\s*([\w\s]+)\s*\((\d+)%\)/);
  const riskMatch = text.match(/Risk Level:\s*([\w\s]+)/);
  const suggestionsMatch = text.match(/Suggestions:\s*([\s\S]*)/i);
  const recommendationMatch = text.match(/Recommendation:\s*(.+)/);

  const recommendation = suggestionsMatch
    ? suggestionsMatch[1].split("\n").filter(line => line.trim()).map(s => s.replace(/^\d+\.\s*/, '')).join("; ")
    : recommendationMatch?.[1] || "No recommendation";

  return {
    sentiment: sentimentMatch?.[1] || "Unknown",
    sentiment_confidence: parseFloat(sentimentMatch?.[2] || "0"),
    disorder: disorderMatch?.[1] || "Unknown",
    disorder_confidence: parseFloat(disorderMatch?.[2] || "0"),
    risk: normalizeRiskLevel(riskMatch?.[1] || "Low"),
    recommendation,
    alert_message: null, 
  };
};

// Controller to get chatbot results 
const getChatbotResults = async (req, res) => {
  try {
    const userId = req.userId;

    // Aggregation to get the latest conversation for the user
    const latestConvoAgg = await Conversation.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      {
        $addFields: {
          latestMessageTime: { $max: "$messages.createdAt" },
        }
      },
      { $sort: { latestMessageTime: -1 } },
      { $limit: 1 }
    ]);

    if (!latestConvoAgg.length || latestConvoAgg[0].messages.length < 2) {
      return res.status(404).json({ message: "No valid conversation found with at least 2 messages" });
    }

    const latestConversation = latestConvoAgg[0];
    const assistantMessage = latestConversation.messages.find(msg => msg.role === "assistant");

    if (!assistantMessage || !assistantMessage.content) {
      return res.status(404).json({ message: "No assistant message content found" });
    }

    // Normalize and parse the assistant message content
    const rawContent = normalizeContent(assistantMessage.content);
    const parsedContent = typeof rawContent === 'string' ? JSON.parse(rawContent) : rawContent;

    //  format response for chatbot results
    const formattedResponse = {
      sentiment: parsedContent.sentiment ?? "Unknown",
      sentiment_confidence: parsedContent.sentiment_confidence ?? 0,
      disorder: parsedContent.disorder ?? "Unknown",
      disorder_confidence: parsedContent.disorder_confidence ?? 0,
      risk: parsedContent.risk ?? parsedContent.risk_level ?? "Low",
      recommendations: parsedContent.recommendations ?? parsedContent.suggestions ?? [],
      explanation: parsedContent.lime_explanation ?? null,
      risk_alert: parsedContent.alert_message ?? null
    };

    return res.status(200).json(formattedResponse);
  } catch (error) {
    console.error("Error in getChatbotResults:", error);
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};

// Controller to get user trends based on historical conversations
const getUserTrends = async (req, res) => {
  try {
    const userId = req.userId;
    const userConversations = await Conversation.find({ userId }).sort({ createdAt: 1 });

    const trendData = userConversations
      .map((convo) => {
        const assistantMsg = convo.messages.find(msg => msg.role === "assistant");
        if (!assistantMsg || !assistantMsg.content) return null;

        let content;
        try {
          content = typeof assistantMsg.content === "string"
            ? JSON.parse(assistantMsg.content)
            : assistantMsg.content;
        } catch (err) {
          // Fallback to legacy text parser in case of invalid JSON
          console.warn("Fallback parsing for:", convo._id);
          content = parseLegacyTextContent(assistantMsg.content);
        }

        return {
          date: convo.createdAt.toISOString().split('T')[0],
          sentiment: content.sentiment ?? "Unknown",
          sentiment_confidence: content.sentiment_confidence ?? 0,
          disorder: content.disorder ?? "Unknown",
          disorder_confidence: content.disorder_confidence ?? 0,
          risk: normalizeRiskLevel(content.risk ?? content.risk_level ?? "Low"),
        };
      })
      .filter(Boolean);

    res.json({ trendData });
  } catch (err) {
    console.error("Error fetching trend data", err);
    res.status(500).json({ message: "Server error fetching trend data" });
  }
};

// Controller to get user risk alerts based on their conversations
const getUserRiskAlerts = async (req, res) => {
  try {
    const userId = req.userId;
    const conversations = await Conversation.find({ userId }).sort({ createdAt: 1 });

    const alerts = conversations
      .map((convo) => {
        const assistantMsg = convo.messages.find(msg => msg.role === "assistant");
        if (!assistantMsg || !assistantMsg.content) return null;

        let content;
        let risk, recommendation, alertMessage;

        try {
          content = typeof assistantMsg.content === "string"
            ? JSON.parse(assistantMsg.content)
            : assistantMsg.content;

          risk = normalizeRiskLevel(content.risk ?? content.risk_level ?? "Low");
          recommendation = Array.isArray(content.recommendations)
            ? content.recommendations.join("; ")
            : content.recommendation || "No recommendation";
          alertMessage = content.alert_message ?? null;

        } catch (err) {
          console.warn("Fallback parsing for:", convo._id);
          const legacy = parseLegacyTextContent(assistantMsg.content);
          risk = normalizeRiskLevel(legacy.risk);
          recommendation = legacy.recommendation;
          alertMessage = legacy.alert_message;
        }

        return {
          createdAt: convo.createdAt,
          riskLevel: risk,
          recommendation,
          alertMessage,
        };
      })
      .filter(alert => alert && alert.riskLevel !== "Unknown");

    res.json({ alerts });
  } catch (error) {
    console.error("❌ Error fetching risk alerts:", error);
    res.status(500).json({ message: "Failed to fetch risk alerts." });
  }
};

// Controller to get all user chatbot reports
const getAllUserChatbotReports = async (req, res) => {
  try {
    const userId = req.userId;
    const conversations = await Conversation.find({ userId }).sort({ createdAt: -1 });

    const reports = conversations
      .map((conv) => ({
        createdAt: conv.createdAt,
        messages: conv.messages,
      }))
      .filter(Boolean);

    res.status(200).json({ reports });
  } catch (err) {
    console.error("❌ Error fetching reports:", err);
    res.status(500).json({ message: "Failed to fetch reports" });
  }
};

export {
  getChatbotResults,
  getUserTrends,
  getUserRiskAlerts,
  getAllUserChatbotReports
};
