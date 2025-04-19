from flask import Flask, render_template, request, jsonify
from transformers import pipeline
import numpy as np
from gradio_client import Client
import matplotlib.pyplot as plt
from lime.lime_text import LimeTextExplainer
from datetime import datetime
import sqlite3
import logging
import os

app = Flask(__name__)

DB_NAME = "mental_health_analysis.db"

# --- Database Setup ---
def create_database():
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS mental_health_analysis (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            text TEXT NOT NULL,
            sentiment TEXT,
            sentiment_confidence REAL,
            disorder TEXT,
            disorder_confidence REAL,
            risk_level TEXT,
            recommendations TEXT,
            date TEXT
        )
    """)
    conn.commit()
    conn.close()

# --- Insert Results into Database ---
def insert_into_database(text, sentiment, sentiment_confidence, disorder, disorder_confidence, risk_level, recommendations, date):
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()

    # Convert list to string for recommendations
    recommendations_str = "; ".join(recommendations)

    cursor.execute("""
        INSERT INTO mental_health_analysis (
            text, sentiment, sentiment_confidence, disorder, disorder_confidence, risk_level, recommendations, date
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        text, sentiment, sentiment_confidence, disorder,
        disorder_confidence, risk_level, recommendations_str, date
    ))

    conn.commit()
    conn.close()

create_database()

class MentalHealthChatbot:
    def __init__(self):
        self.sentiment_client = Client("hasanmustafa0503/sentiment-api")
        self.disorder_client = Client("hasanmustafa0503/disoreder-api")

        # Label mappings
        self.label_mapping = {
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
        }

        self.sentiment_mapping = {
            "POS": "Positive",
            "NEG": "Negative",
            "NEU": "Neutral"
        }

        self.exercise_recommendations = {
            # Exercise recommendations data as defined in the original code
        }

        # Initialize the LIME explainer
        self.explainer = LimeTextExplainer(class_names=list(self.sentiment_mapping.values()) + list(self.label_mapping.values()))

    def get_sentiment(self, text):
        results = self.sentiment_client.predict(text=text, api_name="/predict")
    
        if results and isinstance(results, list):
            label = results[0]['label']
            confidence_score = results[0]['score']*100
            sentiment = self.sentiment_mapping.get(label, "Unknown")
            return sentiment, confidence_score
        return "Unknown", 0
        


    def get_disorder(self, text, threshold=35):
        results = self.disorder_client.predict(text=text, api_name="/predict")
        if results and isinstance(results, list):  
            best_result = results[0]
            disorder_confidence = best_result["score"] * 100
        
            if disorder_confidence > threshold:
                disorder_label = self.label_mapping.get(best_result["label"], "Unknown Disorder")

                if disorder_confidence < 50:
                    risk_level = "Low Risk"
                elif 50 <= disorder_confidence <= 75:
                    risk_level = "Moderate Risk"
                else:
                    risk_level = "High Risk"
            
                return disorder_label, disorder_confidence, risk_level

        return "No significant disorder detected", 0.0, "No Risk"
      

    def predict_fn(self, texts):
        sentiment_probs = []
        disorder_probs = []
        sentiment_labels = []
        disorder_labels = []

        for text in texts:
            sentiment, sentiment_confidence = self.get_sentiment(text)
            sentiment_probs.append([sentiment_confidence / 100])
            sentiment_labels.append(sentiment)

            disorder_label, disorder_confidence, risk_level = self.get_disorder(text)
            disorder_probs.append([disorder_confidence / 100])
            disorder_labels.append(disorder_label)

        sentiment_probs = np.array(sentiment_probs)
        disorder_probs = np.array(disorder_probs)

        result = np.hstack([sentiment_probs, disorder_probs])

        return result, sentiment_labels, disorder_labels
    
    def lime_predict_fn(self, texts):
        result, _, _ = self.predict_fn(texts)
        return result


    def explain_text(self, text):
        explanation = self.explainer.explain_instance(text, self.lime_predict_fn, num_features=5, num_samples=25)
        explanation.as_pyplot_figure()  # Display the plot
        plt.show()

        explanation_str = "The model's prediction is influenced by the following factors: "
        explanation_str += "; ".join([f'"{feature}" contributes with a weight of {weight:.4f}' 
                                      for feature, weight in explanation.as_list()]) + "."
        return explanation_str

    def get_recommendations(self, condition, risk_level):
        exercise_recommendations = {
            "Depression": {
            "High Risk": ["Try 10 minutes of deep breathing.", "Go for a 15-minute walk in nature.", "Practice guided meditation."],
            "Moderate Risk": ["Write down 3 things you’re grateful for.", "Do light stretching or yoga for 10 minutes.", "Listen to calming music."],
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
            "Mental Health": {
            "High Risk": ["Reach out to a mental health professional.", "Engage in deep relaxation techniques.", "Talk to a support group."],
            "Moderate Risk": ["Write in a daily journal.", "Practice guided meditation.", "Do light physical activities like walking."],
            "Low Risk": ["Try deep breathing exercises.", "Watch an uplifting video.", "Call a friend for a chat."]
            }
            
        }
        if condition in exercise_recommendations:
            if risk_level in exercise_recommendations[condition]:
                return exercise_recommendations[condition][risk_level]
        return ["No specific recommendations available."]
    
@app.route('/')
def home():
    return "Welcome to the MentalBot AI!"

@app.route('/analyze', methods=['POST'])
def analyze_text():
    text = request.form.get("text", "") 
    
    if not text:
        return jsonify({"error": "No text provided"}), 400

    bot = MentalHealthChatbot()

    sentiment, sentiment_conf = bot.get_sentiment(text)
    disorder, disorder_conf, risk = bot.get_disorder(text)

    # Log and alert if high risk
    if risk == "High Risk":
        logging.info("🚨 High risk detected! Alert triggered.")
        alert_msg = "✔ 🚨 Alert Notification Triggered: High risk detected!"
    else:
        alert_msg = "✔ Risk is not high. No alert triggered."

    recs = bot.get_recommendations(disorder, risk)
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    # Insert data into the database
    insert_into_database(text, sentiment, sentiment_conf, disorder, disorder_conf, risk, recs, timestamp)

    # Prepare response
    response = {
        "sentiment": sentiment,
        "sentiment_confidence": sentiment_conf,
        "disorder": disorder,
        "disorder_confidence": disorder_conf,
        "risk": risk,
        "recommendations": recs,
        "alert_message": alert_msg
    }

    # LIME explanation
    lime_explanation = bot.explain_text(text)
    response["lime_explanation"] = lime_explanation

    return jsonify(response)



if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))
    app.run(host="0.0.0.0", port=port)
