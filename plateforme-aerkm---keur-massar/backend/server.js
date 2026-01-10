// server.js
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

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/logs', logsRoutes);
app.use('/api/notifications', notifRoutes);

// Connexion MongoDB
const MONGODB_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/aerkm_db';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('✅ MongoDB Connecté via Atlas'))
  .catch(err => console.error('❌ MongoDB Error:', err));

// Démarrage serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur AERKM démarré sur le port ${PORT}`);
});
