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

// 🚀 Transporteur Nodemailer (CONFIG SAFE POUR RENDER)
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // STARTTLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
  // ⏱️ TIMEOUTS (ANTI ETIMEDOUT)
  connectionTimeout: 20000, // 20s
  greetingTimeout: 20000,   // 20s
  socketTimeout: 30000,     // 30s
  tls: {
    rejectUnauthorized: false,
  },
});

// ✅ Vérification SMTP au démarrage
transporter.verify((error) => {
  if (error) {
    console.error('❌ SMTP Gmail indisponible:', error.message);
  } else {
    console.log('✅ SMTP Gmail prêt à envoyer des emails');
  }
});

/**
 * 📧 Email de confirmation de recensement
 */
export const sendRecensementEmail = async (student) => {
  try {
    await transporter.sendMail({
      from: `"AERKM Plateforme" <${process.env.EMAIL_USER}>`,
      to: student.email,
      subject: 'Confirmation de recensement - AERKM',
      html: `
        <p>Bonjour ${student.prenom},</p>
        <p>Votre recensement a été enregistré avec succès.</p>
        <p><strong>Matricule :</strong> ${student.numeroRecensement}</p>
      `,
    });

    console.log(`✅ Email recensement envoyé à ${student.email}`);
    return true;
  } catch (error) {
    console.error('❌ Erreur email recensement:', error);
    return false;
  }
};

/**
 * 🔔 Alerte admin inscription
 */
export const sendAdminRegistrationAlert = async (student) => {
  try {
    await transporter.sendMail({
      from: `"Système AERKM" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: `📢 Nouveau recensement : ${student.prenom} ${student.nom}`,
      html: `
        <p><strong>Nom :</strong> ${student.prenom} ${student.nom}</p>
        <p><strong>Matricule :</strong> ${student.numeroRecensement}</p>
        <p><strong>Téléphone :</strong> ${student.telephone}</p>
      `,
    });

    console.log('✅ Alerte admin envoyée');
    return true;
  } catch (error) {
    console.error('❌ Erreur alerte admin:', error);
    return false;
  }
};

/**
 * 📩 Email de contact (SITE → ADMIN) - VERSION COURTE
 */
export const sendContactEmail = async (contactData) => {
  try {
    await transporter.sendMail({
      from: `"Contact Site Web" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      replyTo: contactData.email,
      subject: `Message de ${contactData.nom} : ${contactData.sujet}`,
      html: `
        <p><strong>Nom :</strong> ${contactData.nom}</p>
        <p><strong>Email :</strong> ${contactData.email}</p>
        <p><strong>Sujet :</strong> ${contactData.sujet}</p>
        <p><strong>Message :</strong> ${contactData.message}</p>
      `,
    });

    console.log('✅ Email contact envoyé (court)');
    return true;
  } catch (error) {
    console.error('❌ Erreur email contact:', error);
    return false;
  }
};

/**
 * 🔐 Email réinitialisation mot de passe
 */
export const sendResetPasswordEmail = async (email, resetUrl) => {
  try {
    await transporter.sendMail({
      from: `"AERKM Sécurité" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Réinitialisation de votre mot de passe',
      html: `
        <p>Cliquez sur le lien ci-dessous pour réinitialiser votre mot de passe :</p>
        <a href="${resetUrl}">Réinitialiser mon mot de passe</a>
      `,
    });

    console.log('✅ Email reset envoyé');
    return true;
  } catch (error) {
    console.error('❌ Erreur email reset:', error);
    return false;
  }
};