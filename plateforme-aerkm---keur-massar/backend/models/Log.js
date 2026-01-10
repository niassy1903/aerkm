import mongoose from 'mongoose';

const logSchema = new mongoose.Schema({
  action: { type: String, required: true },
  details: { type: String, required: true },
  adminId: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

export default mongoose.model('Log', logSchema);
