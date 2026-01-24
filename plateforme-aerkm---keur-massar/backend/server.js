import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.js';
import studentRoutes from './routes/students.js';
import eventRoutes from './routes/events.js';
import statsRoutes from './routes/stats.js';
import logsRoutes from './routes/logs.js';
import notifRoutes from './routes/notifications.js';
import contactRoutes from './routes/contact.js';

dotenv.config();

const app = express();

// 🌍 Config CORS pour ton frontend Netlify
const allowedOrigins = [
  'https://aerkm.netlify.app', // ton frontend
  'http://localhost:5173',      // si tu testes localement
];

app.use(cors({
  origin: function(origin, callback) {
    // Postman ou serveurs sans origin
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      const msg = `CORS policy: l'origine ${origin} n'est pas autorisée.`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

app.use(express.json({ limit: '50mb' }));

// 🌐 Routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/logs', logsRoutes);
app.use('/api/notifications', notifRoutes);
app.use('/api/contact', contactRoutes);

// ✅ MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Atlas connecté'))
  .catch(err => console.error('❌ MongoDB Error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur AERKM démarré sur port ${PORT}`);
});
