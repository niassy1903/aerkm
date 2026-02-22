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

router.get('/bureau', async (_, res) => {
  try {
    const members = await User.find({ isBureau: true }).select('-password');
    res.json(members);
  } catch {
    res.status(500).json({ message: 'Erreur lors de la récupération du bureau.' });
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
      role: 'ADMIN'
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

    const updatedUser = await User.findByIdAndUpdate(req.params.id, data, { new: true });

    if (data.isBureau !== undefined) {
      await new Log({
        action: 'BUREAU_STATUS_UPDATE',
        details: `Statut bureau de ${updatedUser.prenom} ${updatedUser.nom} mis à jour: ${data.isBureau ? 'OUI' : 'NON'} (${data.bureauPosition || 'N/A'})`,
        adminId: 'ADMIN'
      }).save();
    }

    res.json({
      message: 'Utilisateur mis à jour avec succès.',
    });

  } catch {
    res.status(400).json({
      message: "Impossible de mettre à jour l’utilisateur.",
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
      return res.status(400).json({ message: "Ce compte n'a pas de questions de sécurité configurées." });
    }

    // On renvoie uniquement l'énoncé des questions
    const questions = user.securityQuestions.map(q => q.question);
    res.json({ questions });
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la récupération des questions." });
  }
});

/* ================================
   🛡️ RÉCUPÉRATION : ÉTAPE 2 (VERIFY ANSWERS)
   Validation flexible : au moins une réponse correcte débloque la suite
================================ */
router.post('/verify-security-answers', async (req, res) => {
  try {
    const { email, answers } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé." });

    // Vérifie si AU MOINS UNE réponse non-vide est correcte
    const isVerified = user.securityQuestions.some((sq, idx) => {
      const userAnswer = (answers[idx] || '').toLowerCase().trim();
      return userAnswer !== '' && userAnswer === sq.answer;
    });

    if (!isVerified) {
      return res.status(401).json({ 
        verified: false, 
        message: "Réponse incorrecte. Répondez correctement à au moins une question pour continuer." 
      });
    }

    res.json({ verified: true, message: "Identité confirmée." });
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

    // Double vérification de sécurité avant le reset final
    const isVerified = user.securityQuestions.some((sq, idx) => {
      const userAnswer = (answers[idx] || '').toLowerCase().trim();
      return userAnswer !== '' && userAnswer === sq.answer;
    });

    if (!isVerified) {
      return res.status(401).json({ message: "Action refusée : validation de sécurité échouée." });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    await new Log({ 
      action: 'PASSWORD_RESET', 
      details: `Réinitialisation réussie pour ${email} via questions`, 
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

    // Validation des formats
    if (email && !emailRegex.test(email)) fieldErrors.email = "Format d'email invalide.";
    if (telephone && !telRegex.test(telephone)) fieldErrors.telephone = "Format téléphone invalide (Ex: 771234567).";
    if (nin && !ninRegex.test(nin)) fieldErrors.nin = "Le NIN doit comporter 13 à 15 chiffres.";
    
    if (tuteur) {
      if (tuteur.email && !emailRegex.test(tuteur.email)) fieldErrors['tuteur.email'] = "Email du tuteur invalide.";
      if (tuteur.telephone && !telRegex.test(tuteur.telephone)) fieldErrors['tuteur.telephone'] = "Téléphone du tuteur invalide.";
    }

    // Validation des questions de sécurité
    if (!securityQuestions || securityQuestions.length !== 3) {
      fieldErrors.securityQuestions = "Les 3 questions de sécurité sont obligatoires.";
    } else {
      securityQuestions.forEach((sq, idx) => {
        if (!sq.question || !sq.answer || sq.answer.trim().length < 2) {
          fieldErrors[`securityQuestions.${idx}`] = "Réponse trop courte.";
        }
      });
    }

    if (Object.keys(fieldErrors).length > 0) {
      return res.status(400).json({ errors: fieldErrors });
    }

    // Vérification des Doublons
    const exists = await User.findOne({ $or: [{ email }, { nin }, { telephone }] });
    if (exists) {
        if (exists.email === email) fieldErrors.email = "Cet email est déjà utilisé.";
        if (exists.nin === nin) fieldErrors.nin = "Ce NIN est déjà enregistré.";
        if (exists.telephone === telephone) fieldErrors.telephone = "Ce téléphone est déjà utilisé.";
        return res.status(409).json({ errors: fieldErrors });
    }

    const hashedPassword = await bcrypt.hash(req.body.password || 'aerkm2024', 10);
    const numeroRecensement = `KM-${Math.floor(1000 + Math.random() * 9000)}-${new Date().getFullYear()}`;

    // Normalisation des réponses (STOCKAGE PROPRE)
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

    await new Log({ action: 'RECENSEMENT', details: `Inscription: ${prenom} ${nom}`, adminId: 'SYSTEM' }).save();
    await new Notification({ titre: 'Nouveau membre', message: `${prenom} ${nom} s'est inscrit.`, type: 'SUCCESS' }).save();

    const token = jwt.sign({ id: newUser._id, role: newUser.role }, process.env.JWT_SECRET, { expiresIn: '24h' });
    const userResponse = newUser.toObject();
    delete userResponse.password;

    return res.status(201).json({ token, user: userResponse });
  } catch (err) {
    console.error('Register Error:', err);
    res.status(500).json({ message: 'Erreur serveur lors de l\'inscription.' });
  }
});

export default router;
