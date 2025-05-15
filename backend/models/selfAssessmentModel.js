import mongoose from "mongoose";
const selfAssessmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  phq9: {
    type: [Number],
    validate: {
      validator: function (v) {
        return Array.isArray(v) && v.length === 9;
      },
      message: "PHQ-9 must be an array of 9 numbers",
    },
    required: true,
  },
  gad7: {
    type: [Number],
    validate: {
      validator: function (v) {
        return Array.isArray(v) && v.length === 7;
      },
      message: "GAD-7 must be an array of 7 numbers",
    },
    required: true,
  },
  mood: { type: Number, required: true },
  sleep: { type: Number, required: true },
  energy: { type: Number, required: true },
  appetite: { type: Number, required: true },
  social: { type: Number, required: true },
  timestamp: {
    type: Date,
    default: Date.now, 
  },
}, {
  timestamps: true 
});

const SelfAssessmentModel = mongoose.model("SelfAssessment", selfAssessmentSchema);

export default SelfAssessmentModel;
