import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['ADMIN', 'ETUDIANT'], default: 'ETUDIANT' },
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
  
  // Champs pour la réinitialisation
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },

  // Champs spécifiques aux étudiants (optionnels pour l'admin)
  sexe: { type: String, enum: ['M', 'F'] },
  dateNaissance: { type: Date },
  lieuOrigine: { type: String, default: 'Keur Massar' },
  ufr: { type: String },
  filiere: { type: String },
  niveau: { type: String },
  anneeUniversitaire: { type: String },
  telephone: { type: String },
  nin: { type: String },
  tuteur: { type: String },
  maladieHandicap: { type: Boolean, default: false },
  typeMaladieHandicap: { type: String },
  logementAmicale: { type: Boolean, default: false },
  numeroRecensement: { type: String, unique: true, sparse: true },
  dateInscription: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
export default User;
