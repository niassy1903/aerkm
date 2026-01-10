import express from 'express';
import Log from '../models/Log.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const logs = await Log.find().sort({ date: -1 }).limit(100);
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const newLog = new Log(req.body);
    await newLog.save();
    res.status(201).json(newLog);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
