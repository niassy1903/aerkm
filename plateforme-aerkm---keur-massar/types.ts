
export type UserRole = 'ADMIN' | 'ETUDIANT';

export interface User {
  id: string;
  _id?: string;
  email: string;
  role: UserRole;
  nom: string;
  prenom: string;
  password?: string;
  imageUrl?: string;
  telephone?: string;
  isBureau?: boolean;
  bureauPosition?: string;
  bureauMandat?: string;
  bureauOrder?: number;
  bureauBio?: string;
}

export interface Etudiant extends User {
  sexe: 'M' | 'F';
  dateNaissance: string;
  lieuOrigine: string;
  ufr: string;
  filiere: string;
  niveau: string;
  anneeUniversitaire: string;
  telephone: string;
  nin: string;
  // Le tuteur est un objet en base de données, pas une simple string
  tuteur: {
    nom: string;
    email?: string;
    telephone: string;
  };
  maladieHandicap: boolean;
  typeMaladieHandicap?: string;
  logementAmicale: boolean;
  numeroRecensement: string;
  dateInscription: string;
}

export interface Evenement {
  id: string;
  _id?: string;
  titre: string;
  type: string;
  description: string;
  date: string;
  heure: string;
  lieu: string;
  imageUrl?: string;
  published: boolean;
  dateCreation: string;
}

export interface Notification {
  id: string;
  titre: string;
  message: string;
  date: string;
  read: boolean;
  type: 'INFO' | 'SUCCESS' | 'WARNING';
}

export interface ActivityLog {
  id: string;
  action: string;
  details: string;
  date: string;
  adminId: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
}
