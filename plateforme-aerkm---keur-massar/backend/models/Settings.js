
import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
  academicYear: { type: String, default: '2024-2025' },
  registrationOpen: { type: Boolean, default: true },
  maintenanceMode: { type: Boolean, default: false },
  emailNotifications: { type: Boolean, default: true },
  smsAlerts: { type: Boolean, default: false },
  dataRetention: { type: String, default: '5' }
}, { timestamps: true });

const Settings = mongoose.model('Settings', settingsSchema);
export default Settings;
