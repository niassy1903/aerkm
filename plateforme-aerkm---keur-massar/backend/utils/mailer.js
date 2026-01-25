import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

/* =======================
   🔒 Vérification ENV
======================= */
const EMAIL_ENABLED =
  process.env.EMAIL_USER &&
  process.env.EMAIL_PASSWORD;

if (!EMAIL_ENABLED) {
  console.warn('⚠️ Emails désactivés (variables EMAIL manquantes)');
}

/* =======================
   📧 Transporter Gmail
   (Render compatible)
======================= */
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: EMAIL_ENABLED
    ? {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      }
    : undefined,

  pool: true,
  maxConnections: 2,
  maxMessages: 50,

  connectionTimeout: 15000,
  greetingTimeout: 15000,
  socketTimeout: 15000,

  tls: {
    rejectUnauthorized: false,
  },
});

/* =======================
   🔐 RESET PASSWORD
======================= */
export const sendResetPasswordEmail = async (email, resetUrl) => {
  if (!EMAIL_ENABLED) return true;

  try {
    await transporter.sendMail({
      from: `"AERKM Sécurité" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Réinitialisation du mot de passe',
      html: `
        <p>Cliquez sur le lien ci-dessous :</p>
        <a href="${resetUrl}">Réinitialiser mon mot de passe</a>
      `,
    });
    return true;
  } catch (err) {
    console.error('❌ Reset email error:', err.message);
    return false;
  }
};

/* =======================
   📧 RECENSEMENT
======================= */
export const sendRecensementEmail = async (student) => {
  if (!EMAIL_ENABLED) return true;

  try {
    await transporter.sendMail({
      from: `"AERKM" <${process.env.EMAIL_USER}>`,
      to: student.email,
      subject: 'Confirmation de recensement',
      html: `<p>Bienvenue ${student.prenom} !</p>`,
    });
    return true;
  } catch (err) {
    console.error('❌ Recensement email error:', err.message);
    return false;
  }
};

/* =======================
   🔔 ALERTE ADMIN
======================= */
export const sendAdminRegistrationAlert = async (student) => {
  if (!EMAIL_ENABLED) return true;

  try {
    await transporter.sendMail({
      from: `"AERKM Système" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: 'Nouveau recensement',
      html: `<p>${student.prenom} ${student.nom}</p>`,
    });
    return true;
  } catch (err) {
    console.error('❌ Admin alert error:', err.message);
    return false;
  }
};

/* =======================
   📩 CONTACT (COURT)
   comme reset password
======================= */
export const sendContactEmail = async ({ email, sujet, message }) => {
  if (!EMAIL_ENABLED) return true;

  try {
    await transporter.sendMail({
      from: `"Contact AERKM" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      replyTo: email,
      subject: sujet || 'Message de contact',
      html: `<p>${message}</p>`,
    });
    return true;
  } catch (err) {
    console.error('❌ Contact email error:', err.message);
    return false;
  }
};
