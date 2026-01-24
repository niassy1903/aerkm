import dotenv from 'dotenv';
dotenv.config();

import nodemailer from 'nodemailer';

/**
 * 🔧 Création du transporter à la demande
 */
const getTransporter = () => {
  const { EMAIL_USER, EMAIL_PASSWORD } = process.env;

  if (!EMAIL_USER || !EMAIL_PASSWORD) {
    console.error('❌ Configuration email manquante');
    console.error({
      EMAIL_USER,
      EMAIL_PASSWORD: EMAIL_PASSWORD ? 'OK' : 'MANQUANT',
    });
    throw new Error('EMAIL_USER ou EMAIL_PASSWORD manquant');
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASSWORD, // mot de passe d’application Gmail
    },
  });
};

/**
 * 📧 Email de confirmation de recensement
 */
export const sendRecensementEmail = async (student) => {
  try {
    const transporter = getTransporter();

    const mailOptions = {
      from: `"AERKM Plateforme" <${process.env.EMAIL_USER}>`,
      to: student.email,
      subject: 'Confirmation de recensement - AERKM Bambey',
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #1e3a8a;">Bienvenue dans l'AERKM, ${student.prenom} !</h2>
          <p>Votre recensement a été validé avec succès.</p>
          <p><strong>Votre matricule :</strong> ${student.numeroRecensement}</p>
          <p>Vous pouvez désormais vous connecter à votre espace étudiant.</p>
          <div style="margin-top: 20px; padding: 15px; background: #f8fafc; border-radius: 8px;">
            <p style="margin: 0; font-size: 12px; color: #64748b;">
              Utilisez votre email institutionnel pour vous connecter.
            </p>
          </div>
          <p style="font-size: 12px; color: #777; text-align: center; margin-top: 20px;">
            Ceci est un message automatique de l'AERKM Bambey.
          </p>
        </div>
      `,
    };

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
  try {
    const transporter = getTransporter();

    const mailOptions = {
      from: `"Contact Site Web" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      replyTo: contactData.email,
      subject: `Nouveau message de ${contactData.nom} : ${contactData.sujet}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px; color: #333;">
          <h2 style="color: #1e3a8a;">Nouveau message de contact</h2>
          <p><strong>Nom :</strong> ${contactData.nom}</p>
          <p><strong>Email :</strong> ${contactData.email}</p>
          <p><strong>Sujet :</strong> ${contactData.sujet}</p>
          <hr style="border-top: 1px solid #eee; margin: 20px 0;">
          <p><strong>Message :</strong></p>
          <p style="white-space: pre-line; background: #f9fafb; padding: 15px; border-radius: 8px;">
            ${contactData.message}
          </p>
        </div>
      `,
    };

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
export const sendResetPasswordEmail = async (email, resetUrl) => {
  try {
    const transporter = getTransporter();

    const mailOptions = {
      from: `"AERKM Sécurité" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Réinitialisation de votre mot de passe - AERKM',
      html: `
        <div style="font-family: sans-serif; padding: 30px; color: #333; max-width: 500px; margin: auto; border: 1px solid #e2e8f0; border-radius: 20px;">
          <h2 style="color: #1e3a8a; text-align: center;">Réinitialisation du mot de passe</h2>
          <p>Vous avez demandé la réinitialisation de votre mot de passe.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #1e3a8a; color: white; padding: 15px 25px; text-decoration: none; border-radius: 12px; font-weight: bold;">
              Réinitialiser mon mot de passe
            </a>
          </div>
          <p style="font-size: 12px; color: #64748b;">Lien direct :</p>
          <p style="font-size: 11px; word-break: break-all; color: #1e3a8a;">${resetUrl}</p>
          <p style="font-size: 11px; color: #94a3b8; text-align: center;">
            Si vous n'êtes pas à l'origine de cette demande, ignorez cet email.
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Email reset envoyé à ${email}`);
    return true;
  } catch (error) {
    console.error('❌ Erreur envoi email reset:', error);
    return false;
  }
};
