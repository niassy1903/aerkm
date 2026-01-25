import express from 'express';
const router = express.Router();
import Settings from '../models/Settings.js';
import Log from '../models/Log.js';

// Récupérer les paramètres
router.get('/', async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings();
      await settings.save();
    }
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Mettre à jour les paramètres
router.put('/', async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) settings = new Settings();
    
    Object.assign(settings, req.body);
    await settings.save();

    await new Log({ 
      action: 'SETTINGS_UPDATE', 
      details: 'Mise à jour de la configuration système', 
      adminId: 'ADMIN' 
    }).save();

    res.json(settings);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;