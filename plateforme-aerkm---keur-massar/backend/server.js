
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

// Configuration CORS simplifiée pour la production
const allowedOrigins = [
  'https://aerkm.netlify.app',
  'http://localhost:5173',
  'http://localhost:3000'
];

app.use(cors({
  origin: function (origin, callback) {
    // Permettre les requêtes sans origine (comme les apps mobiles)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || origin.endsWith('.netlify.app')) {
      return callback(null, true);
    } else {
      return callback(new Error('Interdit par CORS'), false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));

// Route de santé pour Render
app.get('/', (req, res) => res.status(200).send('API AERKM Opérationnelle'));

app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/logs', logsRoutes);
app.use('/api/notifications', notifRoutes);
app.use('/api/contact', contactRoutes);

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/aerkm_db';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ MongoDB Connecté'))
  .catch(err => console.error('❌ MongoDB Error:', err));

const PORT = process.env.PORT || 5000;
// Écouter sur 0.0.0.0 est crucial pour Render
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Serveur AERKM démarré sur port ${PORT}`);
});