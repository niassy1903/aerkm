
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
  service: 'gmail',
  auth: EMAIL_ENABLED
    ? {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      }
    : undefined,
  tls: {
    rejectUnauthorized: false,
  },
  connectionTimeout: 30000,
  greetingTimeout: 30000,
  socketTimeout: 30000,
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
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin:auto; padding: 30px; border:1px solid #ccc; border-radius:12px; background-color:#f9f9f9; text-align:center;">
          <h2 style="color:#1e3a8a;">Réinitialisation du mot de passe</h2>
          <p style="font-size:16px; color:#333;">Vous avez demandé la réinitialisation de votre mot de passe.</p>
          <a href="${resetUrl}" style="display:inline-block; padding:12px 24px; background-color:#1e3a8a; color:white; text-decoration:none; border-radius:8px; font-weight:bold;">Réinitialiser mon mot de passe</a>
          <p style="font-size:12px; color:#777; margin-top:20px;">Si vous n'avez pas demandé ce changement, ignorez ce message.</p>
        </div>
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
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin:auto; border:1px solid #e2e8f0; border-radius:20px; overflow:hidden; background-color:#ffffff;">
          <div style="background-color:#1e3a8a; padding:30px; text-align:center;">
            <h1 style="color:#ffffff; margin:0; font-size:24px;">Bienvenue dans l'AERKM</h1>
          </div>
          <div style="padding:30px; color:#334155; line-height:1.6;">
            <h2 style="color:#1e3a8a; margin-top:0;">Félicitations, ${student.prenom} !</h2>
            <p>Votre recensement a été enregistré avec succès.</p>
            <div style="background-color:#f8fafc; border-radius:12px; padding:20px; margin:25px 0; border:1px dashed #cbd5e1; text-align:center;">
              <p style="margin:0; font-size:14px; color:#64748b; font-weight:bold;">Votre Matricule Unique</p>
              <p style="margin:5px 0 0 0; font-size:28px; color:#1e3a8a; font-weight:800;">${student.numeroRecensement}</p>
            </div>
            <p>Vous pouvez désormais vous connecter à votre espace personnel.</p>
            <div style="text-align:center; margin-top:30px;">
              <a href="https://aerkm.netlify.app/#/login" style="background-color:#fbbf24; color:#1e3a8a; padding:14px 28px; text-decoration:none; border-radius:10px; font-weight:bold; display:inline-block;">Accéder à mon espace</a>
            </div>
          </div>
          <div style="background-color:#f1f5f9; padding:20px; text-align:center; font-size:12px; color:#94a3b8;">
            <p style="margin:0;">© ${new Date().getFullYear()} AERKM Bambey • Excellence & Solidarité</p>
          </div>
        </div>
      `,
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
      html: `
        <div style="font-family: Arial, sans-serif; padding:20px; border:1px solid #eee; border-radius:12px; max-width:500px;">
          <h2 style="color:#78350f; border-bottom:2px solid #fbbf24; padding-bottom:10px;">Alerte Bureau : Nouveau Membre</h2>
          <p>Un nouvel étudiant vient de finaliser son recensement.</p>
          <ul style="list-style:none; padding:0;">
            <li style="margin-bottom:8px;"><strong>Nom complet :</strong> ${student.prenom} ${student.nom}</li>
            <li style="margin-bottom:8px;"><strong>Matricule :</strong> ${student.numeroRecensement}</li>
          </ul>
        </div>
      `,
    });
    return true;
  } catch (err) {
    console.error('❌ Admin alert error:', err.message);
    return false;
  }
};

/* =======================
   📩 CONTACT
======================= */
export const sendContactEmail = async ({ nom, email, sujet, message }) => {
  if (!EMAIL_ENABLED) return true;

  try {
    await transporter.sendMail({
      from: `"Contact AERKM" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      replyTo: email,
      subject: sujet || 'Message de contact',
      html: `
        <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto; border:1px solid #e2e8f0; border-radius:16px; overflow:hidden; background-color:#ffffff;">
          <div style="background-color:#1e3a8a; padding:20px; text-align:center;">
            <h2 style="color:#ffffff; margin:0; font-size:22px;">Nouveau message de contact</h2>
          </div>
          <div style="padding:30px; color:#334155; line-height:1.6;">
            <p style="font-size:16px; margin:5px 0;"><strong>Nom :</strong> ${nom}</p>
            <p style="font-size:16px; margin:5px 0;"><strong>Email :</strong> ${email}</p>
            <p style="font-size:16px; margin:15px 0 5px 0;"><strong>Sujet :</strong> ${sujet}</p>
            <div style="background-color:#f8fafc; border-radius:12px; padding:20px; margin-top:10px; border:1px solid #cbd5e1;">
              <p style="margin:0; white-space:pre-line;">${message}</p>
            </div>
          </div>
          <div style="background-color:#f1f5f9; padding:15px; text-align:center; font-size:12px; color:#94a3b8;">
            <p style="margin:0;">© ${new Date().getFullYear()} AERKM Bambey • Excellence & Solidarité</p>
          </div>
        </div>
      `,
    });
    return true;
  } catch (err) {
    console.error('❌ Contact email error:', err.message);
    return false;
  }
};
