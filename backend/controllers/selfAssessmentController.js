import SelfAssessmentModel from "../models/selfAssessmentModel.js";
import moment from "moment";
import mongoose from 'mongoose';


// Create a new assessment
const createAssessment = async (req, res) => {
  try {
    const { phq9, gad7, mood, sleep, energy, appetite, social } = req.body;
    const userId = req.userId;

    const newAssessment = new SelfAssessmentModel({
      userId,
      phq9,
      gad7,
      mood,
      sleep,
      energy,
      appetite,
      social,
    });

    await newAssessment.save();
    res.status(201).json({ success: true, message: "Assessment created successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get all assessments for the user
const getAssessmentData = async (req, res) => {
  try {
    const userId = req.userId;
    const assessments = await SelfAssessmentModel.find({ userId }).sort({ timestamp: -1 });

    if (!assessments.length) {
      return res.status(404).json({ success: false, message: "No assessments found" });
    }

    res.status(200).json({ success: true, data: assessments });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get assessments grouped by day (for heatmap)
const getAssessmentDataByTimePeriod = async (req, res) => {
  try {
    const userId = req.userId;

    const data = await SelfAssessmentModel.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: {
            day: { $dayOfMonth: "$timestamp" },
            month: { $month: "$timestamp" },
            year: { $year: "$timestamp" },
          },
          assessments: { $push: "$$ROOT" },
        },
      },
      {
        $project: {
          date: {
            $dateFromParts: {
              year: "$_id.year",
              month: "$_id.month",
              day: "$_id.day",
            },
          },
          assessments: 1,
        },
      },
      { $sort: { date: -1 } },
    ]);

    res.status(200).json({ success: true, data });
  } catch (err) {
    console.error("Aggregation error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch heatmap data" });
  }
};

export {
  createAssessment,
  getAssessmentData,
  getAssessmentDataByTimePeriod,
};
