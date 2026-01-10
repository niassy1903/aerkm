import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Log from '../models/Log.js';
import Notification from '../models/Notification.js';
import { sendRecensementEmail } from '../utils/mailer.js';

const router = express.Router();

// Recensement (Register Student)
router.post('/register', async (req, res) => {
  try {
    const { email, password, prenom, nom } = req.body;
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'Email déjà utilisé' });

    const hashedPassword = await bcrypt.hash(password || 'aerkm2024', 10);
    const numRecensement = `KM-${Math.floor(1000 + Math.random() * 9000)}-${new Date().getFullYear()}`;

    const newUser = new User({
      ...req.body,
      password: hashedPassword,
      numeroRecensement: numRecensement,
      role: 'ETUDIANT'
    });

    await newUser.save();

    await new Log({ action: 'RECENSEMENT', details: `Nouvel étudiant: ${prenom} ${nom}`, adminId: 'SYSTEM' }).save();
    await new Notification({ titre: 'Nouveau recensement', message: `${prenom} ${nom} vient de s'inscrire.`, type: 'SUCCESS' }).save();

    await sendRecensementEmail(newUser);

    const token = jwt.sign({ id: newUser._id, role: newUser.role }, process.env.JWT_SECRET || 'secret_key', { expiresIn: '24h' });
    res.status(201).json({ token, user: { id: newUser._id, email: newUser.email, role: newUser.role, prenom: newUser.prenom, nom: newUser.nom } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin - Liste
router.get('/admins', async (req, res) => {
  try {
    const admins = await User.find({ role: 'ADMIN' }).select('-password');
    res.json(admins);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin - Ajouter
router.post('/admins', async (req, res) => {
  try {
    const { email, password, prenom, nom } = req.body;
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'Cet email est déjà utilisé.' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new User({ email, password: hashedPassword, prenom, nom, role: 'ADMIN' });
    await newAdmin.save();

    await new Log({ action: 'CREATION_ADMIN', details: `Nouvel admin: ${prenom} ${nom}`, adminId: 'ROOT' }).save();
    res.status(201).json(newAdmin);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin - Modifier
router.put('/admins/:id', async (req, res) => {
  try {
    const { password, ...updateData } = req.body;
    if (password && password.trim() !== '') {
      updateData.password = await bcrypt.hash(password, 10);
    }
    const admin = await User.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(admin);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Admin - Supprimer
router.delete('/admins/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'Admin supprimé' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Connexion
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Identifiants invalides' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Identifiants invalides' });
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'secret_key', { expiresIn: '24h' });
    res.json({ token, user: { id: user._id, email: user.email, role: user.role, prenom: user.prenom, nom: user.nom } });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Forgot password
router.post('/forgot-password', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).json({ message: "Cet email n'existe pas." });
    res.json({ message: "Email vérifié." });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Reset password
router.post('/reset-password', async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.findOneAndUpdate({ email }, { password: hashedPassword });
    res.json({ message: "Mot de passe mis à jour." });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

export default router;
