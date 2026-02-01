import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User.js';
import Log from '../models/Log.js';
import Notification from '../models/Notification.js';
import {
  sendResetPasswordEmail,
} from '../utils/mailer.js';

const router = express.Router();

/* ================================
   🎓 RECENSEMENT (REGISTER)
================================ */
router.post('/register', async (req, res) => {
  try {
    const { email, password, prenom, nom } = req.body;

    if (!email || !prenom || !nom) {
      return res.status(400).json({
        message: 'Tous les champs obligatoires doivent être remplis.',
      });
    }

    if (await User.findOne({ email })) {
      return res.status(409).json({
        message: 'Cet email est déjà utilisé.',
      });
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

    /* 🔔 Emails SUPPRIMÉS comme demandé */
    // sendRecensementEmail(newUser).catch(() => {});
    // sendAdminRegistrationAlert(newUser).catch(() => {});

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

    return res.status(201).json({
      message: 'Inscription réussie. Votre compte a été créé avec succès.',
      token,
      user: userResponse,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: 'Une erreur est survenue. Veuillez réessayer plus tard.',
    });
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
    res.status(500).json({
      message: 'Une erreur est survenue. Veuillez réessayer plus tard.',
    });
  }
});

router.post('/admins', async (req, res) => {
  try {
    const { email, password, prenom, nom } = req.body;

    if (!email || !password || !prenom || !nom) {
      return res.status(400).json({
        message: 'Tous les champs obligatoires doivent être remplis.',
      });
    }

    if (await User.findOne({ email })) {
      return res.status(409).json({
        message: 'Cet email est déjà utilisé.',
      });
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

    res.status(201).json({
      message: 'Administrateur créé avec succès.',
    });
  } catch {
    res.status(500).json({
      message: 'Une erreur est survenue. Veuillez réessayer plus tard.',
    });
  }
});

router.put('/admins/:id', async (req, res) => {
  try {
    const { password, ...data } = req.body;

    if (password && password.trim()) {
      data.password = await bcrypt.hash(password, 10);
    }

    await User.findByIdAndUpdate(req.params.id, data);

    res.json({
      message: 'Administrateur mis à jour avec succès.',
    });
  } catch {
    res.status(400).json({
      message: "Impossible de mettre à jour l’administrateur.",
    });
  }
});

router.delete('/admins/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({
      message: 'Administrateur supprimé avec succès.',
    });
  } catch {
    res.status(500).json({
      message: 'Une erreur est survenue. Veuillez réessayer plus tard.',
    });
  }
});

/* ================================
   🔑 LOGIN
================================ */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'Veuillez renseigner votre email et votre mot de passe.',
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: 'Email ou mot de passe incorrect.',
      });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({
        message: 'Email ou mot de passe incorrect.',
      });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    const userResponse = user.toObject();
    delete userResponse.password;

    res.json({
      message: 'Connexion réussie.',
      token,
      user: userResponse,
    });
  } catch {
    res.status(500).json({
      message: 'Une erreur est survenue. Veuillez réessayer plus tard.',
    });
  }
});

/* ================================
   🔐 FORGOT PASSWORD
================================ */
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: 'Veuillez saisir votre adresse email.',
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "Cet email n'existe pas.",
      });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000;
    await user.save();

    const resetUrl = `https://aerkm.netlify.app/#/login?token=${resetToken}`;
    await sendResetPasswordEmail(user.email, resetUrl);

    res.json({
      message: 'Un lien de réinitialisation a été envoyé à votre adresse email.',
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: 'Une erreur est survenue. Veuillez réessayer plus tard.',
    });
  }
});

/* ================================
   🔁 RESET PASSWORD
================================ */
router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        message: 'Informations invalides.',
      });
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: 'Lien de réinitialisation invalide ou expiré.',
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.json({
      message: 'Mot de passe réinitialisé avec succès.',
    });
  } catch {
    res.status(500).json({
      message: 'Une erreur est survenue. Veuillez réessayer plus tard.',
    });
  }
});

export default router;