import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD // ⚠️ ici c'est EMAIL_PASSWORD
  }
});

export const sendRecensementEmail = async (student) => {
  const mailOptions = {
    from: `"AERKM Officiel" <${process.env.EMAIL_USER}>`,
    to: student.email,
    subject: 'Confirmation de votre recensement - AERKM',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
        <h2 style="color: #1e3a8a;">Félicitations ${student.prenom} !</h2>
        <p>Votre recensement au sein de l'AERKM a été validé avec succès.</p>
        <div style="background: #f8fafc; padding: 15px; border-radius: 8px;">
          <p><strong>N° Recensement :</strong> ${student.numeroRecensement}</p>
          <p><strong>UFR :</strong> ${student.ufr}</p>
          <p><strong>Filière :</strong> ${student.filiere}</p>
        </div>
        <p>Ce numéro est précieux, conservez-le pour vos démarches administratives et sociales.</p>
        <hr/>
        <p style="font-size: 12px; color: #666;">Ceci est un message automatique, merci de ne pas y répondre.</p>
      </div>
    `
  };

  const adminMailOptions = {
    from: `"Système AERKM" <${process.env.EMAIL_USER}>`,
    to: process.env.ADMIN_EMAIL,
    subject: 'Nouveau Recensement Effectué',
    text: `Un nouvel étudiant s'est fait recenser : ${student.prenom} ${student.nom} (${student.ufr})`
  };

  try {
    await transporter.sendMail(mailOptions);
    await transporter.sendMail(adminMailOptions);
  } catch (err) {
    console.error('Email error:', err);
  }
};
