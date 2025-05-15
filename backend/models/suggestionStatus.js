import mongoose from 'mongoose';

const suggestionStatusSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  suggestionId: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  riskLevel: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ['Relaxation', 'Activity', 'Habit'],
  },
  suggestion: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: ['completed', 'ongoing', 'pending'],
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  lastCompletedAt: {
    type: Date,
    default: null,
  },
  completedCount: {
    type: Number,
    default: 0,
  },
  lastResetDate: {
    type: Date,
    default: Date.now,
  }
});

suggestionStatusSchema.index({ userId: 1, suggestionId: 1 }, { unique: true });

const SuggestionStatus = mongoose.model('SuggestionStatus', suggestionStatusSchema);

export default SuggestionStatus;
