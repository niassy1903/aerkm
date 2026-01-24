import express from 'express';
const router = express.Router();
import { sendContactEmail } from '../utils/mailer.js';
import Log from '../models/Log.js';

router.post('/', async (req, res) => {
  try {
    const { nom, email, sujet, message } = req.body;

    if (!nom || !email || !sujet || !message) {
      return res.status(400).json({ message: 'Tous les champs sont obligatoires.' });
    }

    const emailSent = await sendContactEmail({ nom, email, sujet, message });

    if (emailSent) {
      await new Log({ 
        action: 'CONTACT_FORM', 
        details: `Message envoyé par ${nom} (${email})`, 
        adminId: 'SYSTEM' 
      }).save();
      
      return res.status(200).json({ message: 'Message envoyé avec succès.' });
    } else {
      return res.status(500).json({ message: "Erreur lors de l'envoi de l'email." });
    }
  } catch (err) {
    console.error('Contact route error:', err);
    res.status(500).json({ message: err.message });
  }
});

export default router;
