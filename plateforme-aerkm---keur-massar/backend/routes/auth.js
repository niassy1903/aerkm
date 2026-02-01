import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Log from '../models/Log.js';
import Notification from '../models/Notification.js';

const router = express.Router();

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ninRegex = /^\d{13,15}$/;
const telRegex = /^(77|78|70|76|33)\d{7}$/;

/* ================================
   🔐 LOGIN
================================ */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Identifiants incorrects." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Identifiants incorrects." });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '24h' });
    const userResponse = user.toObject();
    delete userResponse.password;

    res.json({ token, user: userResponse });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur." });
  }
});

/* ================================
   🛡️ RÉCUPÉRATION : ÉTAPE 1 (FETCH QUESTIONS)
================================ */
router.post('/forgot-password-questions', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "Aucun compte associé à cet email." });
    }

    if (!user.securityQuestions || user.securityQuestions.length === 0) {
      return res.status(400).json({ message: "Ce compte n'a pas de questions de sécurité configurées. Contactez l'administrateur." });
    }

    const questions = user.securityQuestions.map(q => q.question);
    res.json({ questions });
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la récupération des questions." });
  }
});

/* ================================
   🛡️ RÉCUPÉRATION : ÉTAPE 2 (VERIFY ANSWERS)
================================ */
router.post('/verify-security-answers', async (req, res) => {
  try {
    const { email, answers } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé." });

    const isVerified = user.securityQuestions.every((sq, idx) => {
      const userAnswer = (answers[idx] || '').toLowerCase().trim();
      return userAnswer === sq.answer;
    });

    if (!isVerified) {
      return res.status(401).json({ verified: false, message: "Une ou plusieurs réponses sont incorrectes." });
    }

    res.json({ verified: true, message: "Sécurité validée." });
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la vérification." });
  }
});

/* ================================
   🔑 RÉCUPÉRATION : ÉTAPE 3 (FINAL RESET)
================================ */
router.post('/reset-password-security', async (req, res) => {
  try {
    const { email, answers, newPassword } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé." });

    const isVerified = user.securityQuestions.every((sq, idx) => {
      const userAnswer = (answers[idx] || '').toLowerCase().trim();
      return userAnswer === sq.answer;
    });

    if (!isVerified) {
      return res.status(401).json({ message: "Tentative invalide : réponses incorrectes." });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    await new Log({ 
      action: 'PASSWORD_RESET', 
      details: `Mot de passe réinitialisé pour ${email}`, 
      adminId: 'SYSTEM' 
    }).save();

    res.json({ message: "Mot de passe mis à jour avec succès !" });
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la réinitialisation." });
  }
});

/* ================================
   🎓 RECENSEMENT (REGISTER)
================================ */
router.post('/register', async (req, res) => {
  try {
    const { email, telephone, nin, tuteur, prenom, nom, securityQuestions } = req.body;
    const fieldErrors = {};

    if (email && !emailRegex.test(email)) fieldErrors.email = "Format d'email invalide.";
    if (telephone && !telRegex.test(telephone)) fieldErrors.telephone = "Format téléphone invalide.";
    if (nin && !ninRegex.test(nin)) fieldErrors.nin = "Le NIN doit comporter 13 à 15 chiffres.";

    if (!securityQuestions || securityQuestions.length !== 3) {
      fieldErrors.securityQuestions = "Les 3 questions de sécurité sont obligatoires.";
    }

    if (Object.keys(fieldErrors).length > 0) return res.status(400).json({ errors: fieldErrors });

    const exists = await User.findOne({ $or: [{ email }, { nin }, { telephone }] });
    if (exists) return res.status(409).json({ message: "Email, NIN ou téléphone déjà utilisé." });

    const hashedPassword = await bcrypt.hash(req.body.password || 'aerkm2024', 10);
    const numeroRecensement = `KM-${Math.floor(1000 + Math.random() * 9000)}-${new Date().getFullYear()}`;

    const normalizedSecurityQuestions = securityQuestions.map(sq => ({
      question: sq.question,
      answer: sq.answer.toLowerCase().trim()
    }));

    const newUser = new User({
      ...req.body,
      password: hashedPassword,
      numeroRecensement,
      securityQuestions: normalizedSecurityQuestions,
      role: 'ETUDIANT',
    });

    await newUser.save();
    res.status(201).json({ message: "Inscription réussie" });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur lors de l\'inscription.' });
  }
});

export default router;