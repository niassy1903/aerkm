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
import settingsRoutes from './routes/settings.js';

dotenv.config();

const app = express();

/* ⏱️ Timeout global (anti Render timeout) */
app.use((req, res, next) => {
  res.setTimeout(120000, () => {
    console.log('⏰ Timeout atteint');
    res.status(408).json({ message: 'Timeout serveur' });
  });
  next();
});

/* 🌍 CORS */
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://aerkm.netlify.app',
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.options('*', cors());

/* 📦 Body parser */
app.use(express.json({ limit: '10mb' }));

/* 🚦 Routes */
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/logs', logsRoutes);
app.use('/api/notifications', notifRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/settings', settingsRoutes);

/* 🗄️ MongoDB */
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connecté'))
  .catch(err => console.error('❌ MongoDB error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur AERKM lancé sur le port ${PORT}`);
});
