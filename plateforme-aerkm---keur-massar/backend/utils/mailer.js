import dotenv from 'dotenv';
dotenv.config();

import nodemailer from 'nodemailer';

/**
 * 🔧 Création du transporter AU MOMENT DE L’ENVOI
 */
const getTransporter = () => {
  const { EMAIL_USER, EMAIL_PASSWORD } = process.env;

  if (!EMAIL_USER || !EMAIL_PASSWORD) {
    console.error('❌ Variables email manquantes');
    console.error({
      EMAIL_USER,
      EMAIL_PASSWORD: EMAIL_PASSWORD ? 'OK' : 'MANQUANT',
    });
    throw new Error('Configuration email invalide');
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

    await transporter.sendMail({
      from: `"AERKM Plateforme" <${process.env.EMAIL_USER}>`,
      to: student.email,
      subject: 'Confirmation de recensement - AERKM Bambey',
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2>Bienvenue ${student.prenom} !</h2>
          <p>Votre recensement a été validé.</p>
          <p><strong>Matricule :</strong> ${student.numeroRecensement}</p>
        </div>
      `,
    });

    console.log(`✅ Email de recensement envoyé à ${student.email}`);
    return true;
  } catch (error) {
    console.error('❌ Erreur envoi email recensement:', error);
    return false;
  }
};

/**
 * 📩 Email de contact
 */
export const sendContactEmail = async (contactData) => {
  try {
    const transporter = getTransporter();

    await transporter.sendMail({
      from: `"Contact Site Web" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      replyTo: contactData.email,
      subject: `Message de ${contactData.nom} : ${contactData.sujet}`,
      html: `
        <p><strong>Nom :</strong> ${contactData.nom}</p>
        <p><strong>Email :</strong> ${contactData.email}</p>
        <p><strong>Message :</strong></p>
        <p>${contactData.message}</p>
      `,
    });

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
  try {
    const transporter = getTransporter();

    await transporter.sendMail({
      from: `"AERKM Sécurité" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Réinitialisation de mot de passe',
      html: `
        <p>Code de réinitialisation :</p>
        <h2>${token}</h2>
        <p>Si vous n’êtes pas à l’origine de cette demande, ignorez ce message.</p>
      `,
    });

    console.log(`✅ Email reset envoyé à ${email}`);
    return true;
  } catch (error) {
    console.error('❌ Erreur envoi email reset:', error);
    return false;
  }
};
