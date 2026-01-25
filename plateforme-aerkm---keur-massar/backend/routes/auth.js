import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

import User from '../models/User.js';
import Log from '../models/Log.js';
import Notification from '../models/Notification.js';

import {
  sendResetPasswordEmail,
  sendRecensementEmail,
  sendAdminRegistrationAlert,
} from '../utils/mailer.js';

const router = express.Router();

/* ================================
   🎓 RECENSEMENT (REGISTER)
================================ */
router.post('/register', async (req, res) => {
  try {
    const { email, password, prenom, nom } = req.body;

    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({ message: 'Email déjà utilisé' });
    }

    const hashedPassword = await bcrypt.hash(password || 'aerkm2024', 10);
    const numeroRecensement = `KM-${Math.floor(1000 + Math.random() * 9000)}-${new Date().getFullYear()}`;

    const newUser = new User({
      ...req.body,
      password: hashedPassword,
      numeroRecensement,
      role: 'ETUDIANT',
    });

    await newUser.save();

    /* 🔔 Emails NON BLOQUANTS */
    sendRecensementEmail(newUser).catch(() => {});
    sendAdminRegistrationAlert(newUser).catch(() => {});

    await new Log({
      action: 'RECENSEMENT',
      details: `Nouvel étudiant: ${prenom} ${nom}`,
      adminId: 'SYSTEM',
    }).save();

    await new Notification({
      titre: 'Nouveau recensement',
      message: `${prenom} ${nom} vient de s'inscrire.`,
      type: 'SUCCESS',
    }).save();

    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    const userResponse = newUser.toObject();
    delete userResponse.password;

    res.status(201).json({ token, user: userResponse });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

/* ================================
   👤 ADMINS
================================ */
router.get('/admins', async (_, res) => {
  try {
    const admins = await User.find({ role: 'ADMIN' }).select('-password');
    res.json(admins);
  } catch {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.post('/admins', async (req, res) => {
  try {
    const { email, password, prenom, nom } = req.body;

    if (await User.findOne({ email })) {
      return res.status(400).json({ message: 'Email déjà utilisé' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = new User({
      email,
      password: hashedPassword,
      prenom,
      nom,
      role: 'ADMIN',
    });

    await newAdmin.save();

    await new Log({
      action: 'CREATION_ADMIN',
      details: `Nouvel admin: ${prenom} ${nom}`,
      adminId: 'ROOT',
    }).save();

    res.status(201).json({ message: 'Admin créé' });

  } catch {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.put('/admins/:id', async (req, res) => {
  try {
    const { password, ...data } = req.body;

    if (password && password.trim()) {
      data.password = await bcrypt.hash(password, 10);
    }

    const admin = await User.findByIdAndUpdate(req.params.id, data, { new: true });
    res.json(admin);

  } catch {
    res.status(400).json({ message: 'Erreur mise à jour' });
  }
});

router.delete('/admins/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'Admin supprimé' });
  } catch {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

/* ================================
   🔑 LOGIN
================================ */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Identifiants invalides' });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(400).json({ message: 'Identifiants invalides' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    const userResponse = user.toObject();
    delete userResponse.password;

    res.json({ token, user: userResponse });

  } catch {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

/* ================================
   🔐 FORGOT PASSWORD (SAFE)
================================ */
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    // ❌ Email inexistant → réponse claire
    if (!user) {
      return res.status(404).json({
        message: "Cet email n'existe pas dans notre base de données."
      });
    }

    // ✅ Email existant
    const resetToken = crypto.randomBytes(32).toString('hex');

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1h
    await user.save();

    const resetUrl = `https://aerkm.netlify.app/#/login?token=${resetToken}`;

    await sendResetPasswordEmail(user.email, resetUrl);

    return res.status(200).json({
      message: "Lien de réinitialisation envoyé avec succès."
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});



/* ================================
   🔁 RESET PASSWORD
================================ */
router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: 'Lien invalide ou expiré',
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.json({ message: 'Mot de passe mis à jour' });

  } catch {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

export default router;
