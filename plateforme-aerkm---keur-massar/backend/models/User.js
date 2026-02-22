import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  /* =====================
     AUTH
  ===================== */
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },

  password: { type: String, required: true },

  role: {
    type: String,
    enum: ['ADMIN', 'ETUDIANT'],
    default: 'ETUDIANT',
  },

  nom: { type: String, required: true },
  prenom: { type: String, required: true },

  imageUrl: { type: String, default: '' },

  isBureau: { type: Boolean, default: false },
  bureauPosition: { type: String, default: '' },
  bureauMandat: { type: String, default: '' },
  bureauOrder: { type: Number, default: 0 },
  bureauBio: { type: String, default: '' },

  /* =====================
     SECURITY & RECOVERY
  ===================== */
  // Stockage des questions de sécurité
  securityQuestions: [
    {
      question: { type: String, required: true },
      answer: { type: String, required: true } // Stocké en minuscule et sans espaces (trim)
    }
  ],

  resetPasswordToken: String,
  resetPasswordExpires: Date,

  /* =====================
     ETUDIANT
  ===================== */
  sexe: { type: String, enum: ['M', 'F'] },
  dateNaissance: Date,
  lieuOrigine: { type: String, default: 'Keur Massar' },
  ufr: String,
  filiere: String,
  niveau: String,
  anneeUniversitaire: String,

  /** 📞 Téléphone étudiant */
  telephone: {
    type: String,
    unique: true,
    sparse: true,
    trim: true,
  },

  nin: {
    type: String,
    unique: true,
    sparse: true,
  },

  /* =====================
     TUTEUR
  ===================== */
  tuteur: {
    nom: { type: String, trim: true },

    email: {
      type: String,
      lowercase: true,
      trim: true,
      unique: true,
      sparse: true,
    },

    telephone: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
  },

  /* =====================
     DIVERS
  ===================== */
  maladieHandicap: { type: Boolean, default: false },
  typeMaladieHandicap: String,

  logementAmicale: { type: Boolean, default: false },

  numeroRecensement: {
    type: String,
    unique: true,
  },

  dateInscription: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model('User', userSchema);
export default User;
