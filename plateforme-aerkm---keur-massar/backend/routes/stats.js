import express from 'express';
import User from '../models/User.js';
import Event from '../models/Event.js';

const router = express.Router();

router.get('/dashboard', async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'ETUDIANT' });
    const totalEvents = await Event.countDocuments();
    
    // Répartition par UFR
    const ufrStats = await User.aggregate([
      { $match: { role: 'ETUDIANT' } },
      { $group: { _id: '$ufr', count: { $sum: 1 } } }
    ]);

    // Statistiques sociales
    const healthStats = await User.countDocuments({ role: 'ETUDIANT', maladieHandicap: true });
    const housingStats = await User.countDocuments({ role: 'ETUDIANT', logementAmicale: true });

    res.json({
      totalStudents,
      totalEvents,
      ufrStats,
      social: {
        health: healthStats,
        housing: housingStats
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
