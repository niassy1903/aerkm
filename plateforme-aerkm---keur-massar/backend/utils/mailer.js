import dotenv from 'dotenv';
dotenv.config();

import nodemailer from 'nodemailer';

// 🔒 Vérification des variables d'environnement
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
  console.error('❌ Variables email manquantes dans .env');
  console.error({
    EMAIL_USER: process.env.EMAIL_USER ? 'OK' : 'MANQUANT',
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
 * 📧 Email de confirmation de recensement pour l'étudiant
 */
export const sendRecensementEmail = async (student) => {
  const mailOptions = {
    from: `"AERKM Plateforme" <${process.env.EMAIL_USER}>`,
    to: student.email,
    subject: 'Confirmation de recensement - AERKM Bambey',
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; border-radius: 20px; overflow: hidden; background-color: #ffffff;">
        <div style="background-color: #1e3a8a; padding: 30px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px; text-transform: uppercase; letter-spacing: 2px;">Bienvenue dans l'AERKM</h1>
        </div>
        <div style="padding: 30px; color: #334155; line-height: 1.6;">
          <h2 style="color: #1e3a8a; margin-top: 0;">Félicitations, ${student.prenom} !</h2>
          <p>Votre recensement au sein de l'Amicale des Étudiants Ressortissants de Keur Massar a été enregistré avec succès.</p>
          
          <div style="background-color: #f8fafc; border-radius: 12px; padding: 20px; margin: 25px 0; border: 1px dashed #cbd5e1; text-align: center;">
            <p style="margin: 0; font-size: 14px; color: #64748b; text-transform: uppercase; font-weight: bold;">Votre Matricule Unique</p>
            <p style="margin: 5px 0 0 0; font-size: 28px; color: #1e3a8a; font-weight: 800; letter-spacing: 1px;">${student.numeroRecensement}</p>
          </div>

          <p>Vous pouvez désormais vous connecter à votre espace personnel en utilisant votre email institutionnel.</p>
          
          <div style="text-align: center; margin-top: 30px;">
            <a href="https://aerkm.netlify.app/#/login" style="background-color: #fbbf24; color: #1e3a8a; padding: 14px 28px; text-decoration: none; border-radius: 10px; font-weight: bold; display: inline-block;">Accéder à mon espace</a>
          </div>
        </div>
        <div style="background-color: #f1f5f9; padding: 20px; text-align: center; font-size: 12px; color: #94a3b8;">
          <p style="margin: 0;">© ${new Date().getFullYear()} AERKM Bambey • Excellence & Solidarité</p>
          <p style="margin: 5px 0 0 0;">Ceci est un message automatique, merci de ne pas y répondre.</p>
        </div>
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
 * 🔔 Alerte Admin pour une nouvelle inscription
 */
export const sendAdminRegistrationAlert = async (student) => {
  const mailOptions = {
    from: `"Système AERKM" <${process.env.EMAIL_USER}>`,
    to: process.env.ADMIN_EMAIL,
    subject: `📢 Nouveau recensement : ${student.prenom} ${student.nom}`,
    html: `
      <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 12px; max-width: 500px;">
        <h2 style="color: #78350f; border-bottom: 2px solid #fbbf24; padding-bottom: 10px;">Alerte Bureau : Nouveau Membre</h2>
        <p>Un nouvel étudiant vient de finaliser son recensement.</p>
        <ul style="list-style: none; padding: 0;">
          <li style="margin-bottom: 8px;"><strong>Nom complet :</strong> ${student.prenom} ${student.nom}</li>
          <li style="margin-bottom: 8px;"><strong>Matricule :</strong> ${student.numeroRecensement}</li>
          <li style="margin-bottom: 8px;"><strong>UFR :</strong> ${student.ufr}</li>
          <li style="margin-bottom: 8px;"><strong>Téléphone :</strong> ${student.telephone}</li>
        </ul>
        <div style="margin-top: 20px;">
           <a href="https://aerkm.netlify.app/#/admin/etudiants" style="color: #1e3a8a; font-weight: bold;">Gérer dans le tableau de bord</a>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('✅ Alerte admin envoyée');
    return true;
  } catch (error) {
    console.error('❌ Erreur envoi alerte admin:', error);
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
      <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 12px;">
        <h2 style="color: #1e3a8a;">Nouveau message de contact</h2>
        <p><strong>Nom :</strong> ${contactData.nom}</p>
        <p><strong>Email :</strong> ${contactData.email}</p>
        <p><strong>Sujet :</strong> ${contactData.sujet}</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p><strong>Message :</strong></p>
        <p style="white-space: pre-line; background-color: #f9fafb; padding: 15px; border-radius: 8px;">${contactData.message}</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('❌ Erreur envoi email contact:', error);
    return false;
  }
};

/**
 * 🔐 Email de réinitialisation de mot de passe
 */
export const sendResetPasswordEmail = async (email, resetUrl) => {
  const mailOptions = {
    from: `"AERKM Sécurité" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Réinitialisation de votre mot de passe - AERKM',
    html: `
      <div style="font-family: sans-serif; padding: 30px; text-align: center; max-width: 500px; margin: auto; border: 1px solid #e2e8f0; border-radius: 20px;">
        <h2 style="color: #1e3a8a;">Réinitialisation</h2>
        <p>Vous avez demandé la réinitialisation de votre mot de passe.</p>
        <div style="margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #1e3a8a; color: white; padding: 15px 25px; text-decoration: none; border-radius: 12px; font-weight: bold; display: inline-block;">Réinitialiser mon mot de passe</a>
        </div>
        <p style="font-size: 11px; color: #94a3b8;">Si vous n'êtes pas à l'origine de cette demande, ignorez cet email.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('❌ Erreur envoi email reset:', error);
    return false;
  }
};