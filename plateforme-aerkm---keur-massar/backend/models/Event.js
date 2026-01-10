import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  titre: { type: String, required: true },
  type: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  heure: { type: String, required: true },
  lieu: { type: String, required: true },
  imageUrl: { type: String },
  published: { type: Boolean, default: true },
  dateCreation: { type: Date, default: Date.now }
});

export default mongoose.model('Event', eventSchema);
