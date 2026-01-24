
import express from 'express';
const router = express.Router();
import { sendContactEmail } from '../utils/mailer.js';
import Log from '../models/Log.js';

router.post('/', async (req, res) => {
  try {
    console.log('📨 Réception d\'un nouveau message de contact:', req.body.email);
    const { nom, email, sujet, message } = req.body;

    if (!nom || !email || !sujet || !message) {
      return res.status(400).json({ message: 'Tous les champs sont obligatoires.' });
    }

    // On tente d'envoyer l'email
    const emailSent = await sendContactEmail({ nom, email, sujet, message });

    if (emailSent) {
      try {
        await new Log({ 
          action: 'CONTACT_FORM', 
          details: `Message envoyé par ${nom} (${email})`, 
          adminId: 'SYSTEM' 
        }).save();
      } catch (logErr) {
        console.error('⚠️ Erreur lors de la journalisation du contact:', logErr);
        // On ne bloque pas la réponse si seul le log échoue
      }
      
      return res.status(200).json({ message: 'Message envoyé avec succès.' });
    } else {
      return res.status(500).json({ message: "Le service d'envoi d'emails est indisponible pour le moment." });
    }
  } catch (err) {
    console.error('❌ Contact route error:', err);
    res.status(500).json({ message: 'Une erreur interne est survenue sur le serveur.' });
  }
});

export default router;
