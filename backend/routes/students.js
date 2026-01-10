import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// Tous les étudiants
router.get('/', async (req, res) => {
  try {
    const students = await User.find({ role: 'ETUDIANT' }).sort({ dateInscription: -1 });
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Modifier
router.put('/:id', async (req, res) => {
  try {
    const student = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(student);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Supprimer
router.delete('/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'Étudiant supprimé' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
