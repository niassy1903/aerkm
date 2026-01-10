import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  titre: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ['INFO', 'SUCCESS', 'WARNING'], default: 'INFO' },
  read: { type: Boolean, default: false },
  date: { type: Date, default: Date.now }
});

export default mongoose.model('Notification', notificationSchema);
