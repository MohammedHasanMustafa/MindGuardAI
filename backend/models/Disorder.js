import mongoose from 'mongoose';

const disorderSchema = new mongoose.Schema({
  disorder: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const Disorder = mongoose.model('Disorder', disorderSchema);

export default Disorder;

