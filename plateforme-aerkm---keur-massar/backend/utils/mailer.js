
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Vérification de la connexion au démarrage (log uniquement)
transporter.verify((error, success) => {
  if (error) {
    console.warn('⚠️ Mailer configuration warning:', error.message);
  } else {
    console.log('📧 Mailer prêt à envoyer des messages');
  }
});

export const sendRecensementEmail = async (student) => {
  const mailOptions = {
    from: `"AERKM Plateforme" <${process.env.EMAIL_USER}>`,
    to: student.email,
    subject: 'Confirmation de recensement - AERKM Bambey',
    html: `
      <div style="font-family: sans-serif; padding: 20px; color: #333; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #1e3a8a;">Bienvenue dans l'AERKM, ${student.prenom} !</h2>
        <p>Votre recensement a été validé avec succès.</p>
        <p><strong>Votre matricule :</strong> ${student.numeroRecensement}</p>
        <p>Vous pouvez désormais vous connecter à votre espace étudiant pour gérer votre dossier.</p>
        <div style="margin-top: 20px; padding: 15px; background: #f8fafc; border-radius: 8px;">
          <p style="margin: 0; font-size: 12px; color: #64748b;">Utilisez votre email institutionnel pour vous connecter. Le mot de passe par défaut est celui configuré lors de l'inscription.</p>
        </div>
        <br>
        <p style="font-size: 12px; color: #777; text-align: center;">Ceci est un message automatique de l'AERKM Bambey.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Email de confirmation envoyé à ${student.email}`);
    return true;
  } catch (error) {
    console.error('❌ Erreur envoi email recensement:', error);
    return false;
  }
};

export const sendContactEmail = async (contactData) => {
  if (!process.env.ADMIN_EMAIL || !process.env.EMAIL_USER) {
    console.error('❌ Configuration email manquante dans .env (ADMIN_EMAIL ou EMAIL_USER)');
    return false;
  }

  const mailOptions = {
    from: `"Contact Site Web" <${process.env.EMAIL_USER}>`,
    to: process.env.ADMIN_EMAIL,
    replyTo: contactData.email,
    subject: `Nouveau Message de ${contactData.nom} : ${contactData.sujet}`,
    html: `
      <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px; color: #333;">
        <h2 style="color: #1e3a8a;">Nouveau message de contact</h2>
        <p><strong>Nom :</strong> ${contactData.nom}</p>
        <p><strong>Email :</strong> ${contactData.email}</p>
        <p><strong>Sujet :</strong> ${contactData.sujet}</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p><strong>Message :</strong></p>
        <p style="white-space: pre-line; background: #f9fafb; padding: 15px; border-radius: 8px;">${contactData.message}</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Email de contact envoyé à l'admin`);
    return true;
  } catch (error) {
    console.error('❌ Erreur envoi email contact:', error);
    return false;
  }
};

export const sendResetPasswordEmail = async (email, resetUrl) => {
  const mailOptions = {
    from: `"AERKM Sécurité" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Réinitialisation de votre mot de passe - AERKM',
    html: `
      <div style="font-family: sans-serif; padding: 30px; color: #333; max-width: 500px; margin: auto; border: 1px solid #e2e8f0; border-radius: 20px;">
        <h2 style="color: #1e3a8a; text-align: center;">Réinitialisation du mot de passe</h2>
        <p>Vous avez demandé la réinitialisation de votre mot de passe pour votre compte AERKM.</p>
        <p>Cliquez sur le bouton ci-dessous pour définir un nouveau mot de passe. Ce lien est valable pendant 1 heure.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #1e3a8a; color: white; padding: 15px 25px; text-decoration: none; border-radius: 12px; font-weight: bold; display: inline-block;">Réinitialiser mon mot de passe</a>
        </div>
        <p style="font-size: 12px; color: #64748b;">Si le bouton ne fonctionne pas, copiez et collez le lien suivant dans votre navigateur :</p>
        <p style="font-size: 11px; word-break: break-all; color: #1e3a8a;">${resetUrl}</p>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;">
        <p style="font-size: 11px; color: #94a3b8; text-align: center;">Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet email en toute sécurité.</p>
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