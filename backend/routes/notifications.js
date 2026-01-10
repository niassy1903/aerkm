import express from 'express';
import Notification from '../models/Notification.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const notifs = await Notification.find().sort({ date: -1 });
    res.json(notifs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const notif = await Notification.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
    res.json(notif);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/', async (req, res) => {
  try {
    await Notification.deleteMany({});
    res.json({ message: 'Notifications effacées' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
