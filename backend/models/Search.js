import mongoose from 'mongoose';

const searchSchema = new mongoose.Schema({
  query: { type: String, required: true },
  searchedAt: { type: Date, default: Date.now },
});

export default mongoose.model('Search', searchSchema);
