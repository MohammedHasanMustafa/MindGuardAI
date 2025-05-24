import axios from 'axios';
import { Client } from "@gradio/client";
import { insertAnalysis, getAnalysesByUserId, getRiskLevelsByUserId, getTrendDataByUserId, getSuggestionsByUserId } from '../models/chatbotModel.js';

class MentalHealthChatbot {
    constructor() {
        this.sentimentClient = null;
        this.disorderClient = null;
        this.limeServerUrl = 'http://localhost:8000';
        
        this.labelMapping = {
            "LABEL_0": "ADHD",
            "LABEL_1": "BPD",
            "LABEL_2": "OCD",
            "LABEL_3": "PTSD",
            "LABEL_4": "Anxiety",
            "LABEL_5": "Autism",
            "LABEL_6": "Bipolar",
            "LABEL_7": "Depression",
            "LABEL_8": "Eating Disorders",
            "LABEL_9": "Health",
            "LABEL_10": "Mental Illness",
            "LABEL_11": "Schizophrenia",
            "LABEL_12": "Suicide Watch"
        };

        this.sentimentMapping = {
            "POS": "Positive",
            "NEG": "Negative",
            "NEU": "Neutral"
        };
    }

    async initialize() {
        try {
            this.sentimentClient = await Client.connect("hasanmustafa0503/sentiment");
            this.disorderClient = await Client.connect("hasanmustafa0503/disoreder-api");
            console.log("Gradio clients connected successfully");
        } catch (error) {
            throw new Error("Failed to connect to Gradio clients");
        }
    }

    async getSentiment(text) {
        if (!this.sentimentClient) throw new Error("Sentiment client not initialized");

        try {
            const result = await this.sentimentClient.predict("/predict", { text });
            
            if (result.data && result.data[0] && result.data[0][0]) {
                const prediction = result.data[0][0];
                return {
                    sentiment: this.sentimentMapping[prediction.label] || "Unknown",
                    confidence: prediction.score * 100
                };
            }
            return { sentiment: "Unknown", confidence: 0 };
        } catch (error) {
            console.error("Sentiment analysis error:", error);
            throw new Error("Sentiment analysis failed");
        }
    }

    async getDisorder(text, threshold = 35) {
        if (!this.disorderClient) throw new Error("Disorder client not initialized");

        try {
            const result = await this.disorderClient.predict("/predict", { text });
            
            if (result.data && result.data[0] && result.data[0][0]) {
                const prediction = result.data[0][0];
                return this.processDisorderResult([[prediction.label, prediction.score]], threshold);
            }
            return this.processDisorderResult([], threshold);
        } catch (error) {
            console.error("Disorder detection error:", error);
            throw new Error("Disorder detection failed");
        }
    }

    processDisorderResult(arr, threshold) {
        if (arr.length) {
            const [ label, score ] = arr[0];
            const disorderConfidence = score * 100;

            if (disorderConfidence > threshold) {
                const disorderLabel = this.labelMapping[label] || "Unknown Disorder";
                let riskLevel = disorderConfidence < 50
                    ? "Low Risk"
                    : disorderConfidence <= 75
                        ? "Moderate Risk"
                        : "High Risk";

                return {
                    disorder: disorderLabel,
                    confidence: disorderConfidence,
                    risk: riskLevel
                };
            }
        }
        return {
            disorder: "No significant disorder detected",
            confidence: 0,
            risk: "No Risk"
        };
    }

    getRecommendations(condition, riskLevel) {
        const exerciseRecommendations = {
            "Depression": {
                "High Risk": ["Try 10 minutes of deep breathing.", "Go for a 15-minute walk in nature.", "Practice guided meditation."],
                "Moderate Risk": ["Write down 3 things you're grateful for.", "Do light stretching or yoga for 10 minutes.", "Listen to calming music."],
                "Low Risk": ["Engage in a hobby you enjoy.", "Call a friend and have a short chat.", "Do a short 5-minute mindfulness exercise."]
            },
            "Anxiety": {
                "High Risk": ["Try progressive muscle relaxation.", "Use the 4-7-8 breathing technique.", "Write down your thoughts to clear your mind."],
                "Moderate Risk": ["Listen to nature sounds or white noise.", "Take a 15-minute break from screens.", "Try a short visualization exercise."],
                "Low Risk": ["Practice slow, deep breathing for 5 minutes.", "Drink herbal tea and relax.", "Read a book for 10 minutes."]
            },
            "Bipolar": {
                "High Risk": ["Engage in grounding techniques like 5-4-3-2-1.", "Try slow-paced walking in a quiet area.", "Listen to calm instrumental music."],
                "Moderate Risk": ["Do a 10-minute gentle yoga session.", "Keep a mood journal for self-awareness.", "Practice self-affirmations."],
                "Low Risk": ["Engage in light exercise like jogging.", "Practice mindful eating for a meal.", "Do deep breathing exercises."]
            },
            "OCD": {
                "High Risk": ["Use exposure-response prevention techniques.", "Try 5 minutes of guided meditation.", "Write down intrusive thoughts and challenge them."],
                "Moderate Risk": ["Take a short break from triggers.", "Practice progressive relaxation.", "Engage in a calming activity like drawing."],
                "Low Risk": ["Practice deep breathing with slow exhales.", "Listen to soft music and relax.", "Try focusing on one simple task at a time."]
            },
            "PTSD": {
                "High Risk": ["Try grounding techniques (hold an object, describe it).", "Do 4-7-8 breathing for relaxation.", "Write in a trauma journal."],
                "Moderate Risk": ["Practice mindfulness for 5 minutes.", "Engage in slow, rhythmic movement (walking, stretching).", "Listen to soothing music."],
                "Low Risk": ["Try positive visualization techniques.", "Engage in light exercise or stretching.", "Spend time in a quiet, safe space."]
            },
            "Suicide Watch": {
                "High Risk": ["Immediately reach out to a mental health professional.", "Call a trusted friend or family member.", "Try a grounding exercise like cold water on hands."],
                "Moderate Risk": ["Write a letter to your future self.", "Listen to uplifting music.", "Practice self-care (take a bath, make tea, etc.)."],
                "Low Risk": ["Watch a motivational video.", "Write down your emotions in a journal.", "Spend time with loved ones."]
            },
            "ADHD": {
                "High Risk": ["Try structured routines for the day.", "Use a timer for focus sessions.", "Engage in short bursts of physical activity."],
                "Moderate Risk": ["Do a quick exercise routine (jumping jacks, stretches).", "Use fidget toys to channel energy.", "Try meditation with background music."],
                "Low Risk": ["Practice deep breathing.", "Listen to classical or instrumental music.", "Organize your workspace."]
            },
            "BPD": {
                "High Risk": ["Try dialectical behavior therapy (DBT) techniques.", "Practice mindfulness.", "Use a weighted blanket for comfort."],
                "Moderate Risk": ["Write down emotions and analyze them.", "Engage in creative activities like painting.", "Listen to calming podcasts."],
                "Low Risk": ["Watch a lighthearted movie.", "Do breathing exercises.", "Call a friend for a short chat."]
            },
            "Autism": {
                "High Risk": ["Engage in deep-pressure therapy (weighted blanket).", "Use noise-canceling headphones.", "Try sensory-friendly relaxation techniques."],
                "Moderate Risk": ["Do repetitive physical activities like rocking.", "Practice structured breathing exercises.", "Engage in puzzles or memory games."],
                "Low Risk": ["Spend time in a quiet space.", "Listen to soft instrumental music.", "Follow a structured schedule."]
            },
            "Schizophrenia": {
                "High Risk": ["Seek immediate support from a trusted person.", "Try simple grounding exercises.", "Use distraction techniques like puzzles."],
                "Moderate Risk": ["Engage in light physical activity.", "Listen to calming sounds or music.", "Write thoughts in a journal."],
                "Low Risk": ["Read a familiar book.", "Do a 5-minute breathing exercise.", "Try progressive muscle relaxation."]
            },
            "Eating Disorders": {
                "High Risk": ["Seek professional help immediately.", "Try self-affirmations.", "Practice intuitive eating (listen to body cues)."],
                "Moderate Risk": ["Engage in mindful eating.", "Write down your emotions before meals.", "Do light stretching after meals."],
                "Low Risk": ["Try a gentle walk after eating.", "Listen to calming music.", "Write a gratitude journal about your body."]
            },
            "Mental Illness": {
                "High Risk": ["Reach out to a mental health professional.", "Engage in deep relaxation techniques.", "Talk to a support group."],
                "Moderate Risk": ["Write in a daily journal.", "Practice guided meditation.", "Do light physical activities like walking."],
                "Low Risk": ["Try deep breathing exercises.", "Watch an uplifting video.", "Call a friend for a chat."]
            },
            "Health": {
                "High Risk": ["Consult with a healthcare provider.", "Practice stress-reduction techniques.", "Ensure proper sleep and nutrition."],
                "Moderate Risk": ["Take short breaks throughout the day.", "Practice good sleep hygiene.", "Stay hydrated and eat balanced meals."],
                "Low Risk": ["Go for a short walk.", "Drink more water.", "Take deep breaths periodically."]
            }
        };

        if (exerciseRecommendations[condition] && exerciseRecommendations[condition][riskLevel]) {
            return exerciseRecommendations[condition][riskLevel];
        }
        return ["No specific recommendations available."];
    }

    async explainPrediction(text, analysisType = 'disorder') {
        try {
            const response = await axios.post(`${this.limeServerUrl}/explain`, {
                text: text,
                type: analysisType  // 'disorder' or 'sentiment'
            });
            
            // Format the explanation for better frontend display
            const formattedExplanation = {
                prediction: analysisType === 'disorder' 
                    ? this.labelMapping[`LABEL_${response.data.predicted_label}`] || "Unknown"
                    : this.sentimentMapping[response.data.predicted_label] || "Unknown",
                confidence: response.data.prediction_confidence,
                topFeatures: response.data.explanation.map(item => ({
                    feature: item[0],
                    weight: item[1],
                    impact: item[1] > 0 ? "Supports" : "Contradicts"
                })),
                rawExplanation: response.data
            };

            return formattedExplanation;
        } catch (error) {
            console.error("LIME explanation error:", error);
            return {
                error: "Failed to generate explanation",
                details: error.message
            };
        }
    }
}

export async function analyzeText(req, res) {
    const { text } = req.body;
    const userId = req.user.id;

    if (!text) {
        return res.status(400).json({ error: "Text is required" });
    }

    try {
        const bot = new MentalHealthChatbot();
        await bot.initialize();

        // Get standard analysis - run these in parallel
        const [sentimentResult, disorderResult] = await Promise.all([
            bot.getSentiment(text),
            bot.getDisorder(text)
        ]);

        const { sentiment, confidence: sentimentConf } = sentimentResult;
        const { disorder, confidence: disorderConf, risk } = disorderResult;
        
        const alertMsg = risk === "High Risk" 
            ? "🚨 Alert Notification Triggered: High risk detected!" 
            : "Risk is not high. No alert triggered.";
        
        const recommendations = bot.getRecommendations(disorder, risk);
        
        // Get LIME explanations for both sentiment and disorder
        const [sentimentExplanation, disorderExplanation] = await Promise.all([
            bot.explainPrediction(text, 'sentiment').catch(e => ({ error: e.message })),
            bot.explainPrediction(text, 'disorder').catch(e => ({ error: e.message }))
        ]);

        // Save to database (without LIME explanation)
        insertAnalysis({
            userId,
            text,
            sentiment,
            sentiment_confidence: sentimentConf,
            disorder,
            disorder_confidence: disorderConf,
            risk_level: risk,
            recommendations: JSON.stringify(recommendations),
            lime_explanation: JSON.stringify({
                sentiment: sentimentExplanation,
                disorder: disorderExplanation
            })
        }, (err, id) => {
            if (err) {
                console.error("Database Error:", err);
                return res.status(500).json({ error: "Failed to save analysis" });
            }

            return res.status(200).json({
                id,
                userId,
                text,
                sentiment,
                sentiment_confidence: sentimentConf,
                disorder,
                disorder_confidence: disorderConf,
                risk_level: risk,
                recommendations,
                alert: alertMsg,
                explanations: {
                    sentiment: sentimentExplanation,
                    disorder: disorderExplanation
                }
            });
        });
    } catch (error) {
        console.error("Analysis Error:", error);
        return res.status(500).json({ error: "Failed to analyze text" });
    }
}

export function getUserResults(req, res) {
    const userId = req.user.id; // Get user ID from the authenticated session

    getAnalysesByUserId(userId, (err, analyses) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({
                error: "Database operation failed",
                message: err.message
            });
        }

        if (!analyses || analyses.length === 0) {
            return res.status(200).json({
                message: "No analyses found for this user",
                userId,
                analyses: []
            });
        }

        const formattedResponse = {
            userId,
            count: analyses.length,
            analyses: analyses.map(item => ({
                id: item.id,
                text: item.text,
                sentiment: item.sentiment,
                sentimentConfidence: item.sentimentConfidence,
                disorder: item.disorder,
                disorderConfidence: item.disorderConfidence,
                riskLevel: item.riskLevel,
                recommendations: item.recommendations,
                timestamp: item.timestamp
            }))
        };

        res.status(200).json(formattedResponse);
    });
}

// Get all risk levels for a user
export async function getUserRiskLevels(req, res) {
    const userId = req.user.id;

    try {
        const riskLevels = await new Promise((resolve, reject) => {
            getRiskLevelsByUserId(userId, (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });

        res.status(200).json({
            userId,
            count: riskLevels.length,
            riskLevels
        });
    } catch (error) {
        console.error('Error fetching risk levels:', error);
        res.status(500).json({ 
            error: "Failed to fetch risk levels",
            message: error.message 
        });
    }
}

// Get data for trend graph visualization
export async function getTrendGraphData(req, res) {
    const userId = req.user.id;

    try {
        const trendData = await new Promise((resolve, reject) => {
            getTrendDataByUserId(userId, (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });

        res.status(200).json({
            userId,
            count: trendData.length,
            trendData
        });
    } catch (error) {
        console.error('Error fetching trend data:', error);
        res.status(500).json({ 
            error: "Failed to fetch trend data",
            message: error.message 
        });
    }
}

// Get all recommendations for a user
export async function getUserSuggestions(req, res) {
    const userId = req.user.id;

    try {
        const suggestions = await new Promise((resolve, reject) => {
            getSuggestionsByUserId(userId, (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });

        res.status(200).json({
            userId,
            count: suggestions.length,
            suggestions
        });
    } catch (error) {
        console.error('Error fetching suggestions:', error);
        res.status(500).json({ 
            error: "Failed to fetch suggestions",
            message: error.message 
        });
    }
}
// Add these new controller functions

// Get completed suggestions for a user
export const getCompletedSuggestions = async (req, res) => {
  const userId = req.user.id;

  try {
    const completedSuggestions = await getCompletedSuggestionsByUserId(userId);
    res.status(200).json({
      success: true,
      completed: completedSuggestions
    });
  } catch (error) {
    console.error('Error fetching completed suggestions:', error);
    res.status(500).json({
      error: "Failed to fetch completed suggestions",
      message: error.message
    });
  }
};

// Mark a suggestion as completed
export const markSuggestionCompleted = async (req, res) => {
  const { userId, recommendationId } = req.body;

  try {
    await markRecommendationAsCompleted(userId, recommendationId);
    res.status(200).json({
      success: true,
      message: "Recommendation marked as completed"
    });
  } catch (error) {
    console.error('Error marking recommendation as completed:', error);
    res.status(500).json({
      error: "Failed to mark recommendation as completed",
      message: error.message
    });
  }
};

// Remove a suggestion
export const removeSuggestion = async (req, res) => {
  const { userId, recommendationId } = req.body;

  try {
    await removeRecommendation(userId, recommendationId);
    res.status(200).json({
      success: true,
      message: "Recommendation removed successfully"
    });
  } catch (error) {
    console.error('Error removing recommendation:', error);
    res.status(500).json({
      error: "Failed to remove recommendation",
      message: error.message
    });
  }
};
