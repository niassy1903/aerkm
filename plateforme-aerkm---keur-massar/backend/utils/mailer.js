import dotenv from 'dotenv';
dotenv.config();

import nodemailer from 'nodemailer';

// 🔒 Vérification des variables d'environnement
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
  console.error('❌ Variables email manquantes dans .env');
  console.error({
    EMAIL_USER: process.env.EMAIL_USER,
    EMAIL_PASSWORD: process.env.EMAIL_PASSWORD ? 'OK' : 'MANQUANT',
  });
  throw new Error('Configuration email invalide');
}

// 🚀 Transporteur Nodemailer (Gmail)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD, // mot de passe d'application Gmail
  },
});

/**
 * 📧 Email de confirmation de recensement
 */
export const sendRecensementEmail = async (student) => {
  const mailOptions = {
    from: `"AERKM Plateforme" <${process.env.EMAIL_USER}>`,
    to: student.email,
    subject: 'Confirmation de recensement - AERKM Bambey',
    html: `
      <div style="font-family: sans-serif; padding: 20px; color: #333;">
        <h2 style="color: #1e3a8a;">Bienvenue dans l'AERKM, ${student.prenom} !</h2>
        <p>Votre recensement a été validé avec succès.</p>
        <p><strong>Votre matricule :</strong> ${student.numeroRecensement}</p>
        <p>Vous pouvez désormais vous connecter à votre espace étudiant.</p>
        <br>
        <p style="font-size: 12px; color: #777;">
          Ceci est un message automatique, merci de ne pas y répondre.
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Email de recensement envoyé à ${student.email}`);
    return true;
  } catch (error) {
    console.error('❌ Erreur envoi email recensement:', error);
    return false;
  }
};

/**
 * 📩 Email de contact (site → admin)
 */
export const sendContactEmail = async (contactData) => {
  const mailOptions = {
    from: `"Contact Site Web" <${process.env.EMAIL_USER}>`,
    to: process.env.ADMIN_EMAIL,
    replyTo: contactData.email,
    subject: `Nouveau message de ${contactData.nom} : ${contactData.sujet}`,
    html: `
      <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee;">
        <h2 style="color: #1e3a8a;">Nouveau message de contact</h2>
        <p><strong>Nom :</strong> ${contactData.nom}</p>
        <p><strong>Email :</strong> ${contactData.email}</p>
        <p><strong>Sujet :</strong> ${contactData.sujet}</p>
        <hr>
        <p><strong>Message :</strong></p>
        <p style="white-space: pre-line;">${contactData.message}</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('✅ Email de contact envoyé à l’admin');
    return true;
  } catch (error) {
    console.error('❌ Erreur envoi email contact:', error);
    return false;
  }
};

/**
 * 🔐 Email de réinitialisation de mot de passe
 */
export const sendResetPasswordEmail = async (email, token) => {
  const mailOptions = {
    from: `"AERKM Sécurité" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Réinitialisation de votre mot de passe',
    html: `
      <div style="font-family: sans-serif; padding: 20px;">
        <h2>Réinitialisation de mot de passe</h2>
        <p>Vous avez demandé la réinitialisation de votre mot de passe.</p>
        <p>
          Code de vérification :
          <strong style="font-size: 18px;">${token}</strong>
        </p>
        <p>Si vous n'êtes pas à l'origine de cette demande, ignorez cet email.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Email de reset envoyé à ${email}`);
    return true;
  } catch (error) {
    console.error('❌ Erreur envoi email reset:', error);
    return false;
  }
};
