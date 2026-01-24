
import express from 'express';
const router = express.Router();
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User.js';
import Log from '../models/Log.js';
import Notification from '../models/Notification.js';
import { sendResetPasswordEmail } from '../utils/mailer.js';

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
    
    // Journalisation & Notification
    await new Log({ action: 'RECENSEMENT', details: `Nouvel étudiant: ${prenom} ${nom}`, adminId: 'SYSTEM' }).save();
    await new Notification({ titre: 'Nouveau recensement', message: `${prenom} ${nom} vient de s'inscrire.`, type: 'SUCCESS' }).save();
    
    const token = jwt.sign({ id: newUser._id, role: newUser.role }, process.env.JWT_SECRET || 'secret_key', { expiresIn: '24h' });
    res.status(201).json({ token, user: { id: newUser._id, email: newUser.email, role: newUser.role, prenom: newUser.prenom, nom: newUser.nom } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Gestion Admins - Liste
router.get('/admins', async (req, res) => {
  try {
    const admins = await User.find({ role: 'ADMIN' }).select('-password');
    res.json(admins);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Gestion Admins - Ajouter
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

// Gestion Admins - Modifier
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

// Gestion Admins - Supprimer
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

// Mot de passe oublié
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Cet email n'existe pas." });

    // Générer un token
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 heure
    await user.save();

    // Lien de réinitialisation vers la production Netlify
    const frontendUrl = 'https://aerkm.netlify.app';
    const resetUrl = `${frontendUrl}/#/login?token=${resetToken}`;
    
    const sent = await sendResetPasswordEmail(user.email, resetUrl);

    if (sent) {
      res.json({ message: "Email de réinitialisation envoyé." });
    } else {
      res.status(500).json({ message: "Erreur lors de l'envoi de l'email." });
    }
  } catch (err) { 
    res.status(500).json({ message: err.message }); 
  }
});

// Réinitialisation du mot de passe
router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    const user = await User.findOne({ 
      resetPasswordToken: token, 
      resetPasswordExpires: { $gt: Date.now() } 
    });

    if (!user) {
      return res.status(400).json({ message: "Lien de réinitialisation invalide ou expiré." });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: "Mot de passe mis à jour avec succès." });
  } catch (err) { 
    res.status(500).json({ message: err.message }); 
  }
});

export default router;