import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

import User from './models/User.js';
import Event from './models/Event.js';

dotenv.config();

const MONGODB_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/aerkm_db';

const seedDatabase = async () => {
  try {
    console.log('⏳ Connexion à MongoDB pour le seeding...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connecté à MongoDB');

    /* ==============================
       🧨 RESET DES INDEX
    ============================== */
    console.log('🧨 Suppression de tous les index (User & Event)...');
    try {
      await User.collection.dropIndexes();
      await Event.collection.dropIndexes();
      await User.syncIndexes();
      await Event.syncIndexes();
      console.log('✔️ Index réinitialisés');
    } catch (indexErr) {
      console.log('⚠️ Note: Certains index n\'existaient pas encore.');
    }

    /* ==============================
       🧹 NETTOYAGE DES DONNÉES
    ============================== */
    console.log('🧹 Nettoyage des anciennes données...');
    await User.deleteMany({});
    await Event.deleteMany({});

    /* ==============================
       👤 ADMIN UNIQUE
    ============================== */
    console.log('👤 Création du compte administrateur unique...');
    const adminPassword = await bcrypt.hash('admin', 10);

    await User.create({
      email: 'admin@aerkm.sn'.trim().toLowerCase(),
      password: adminPassword,
      role: 'ADMIN',
      nom: 'BUREAU',
      prenom: 'ADMIN',
      telephone: '+221330000000',
      securityQuestions: [
        { question: "Quelle est votre ville de naissance ?", answer: "bambey" },
        { question: "Quel est votre plat préféré ?", answer: "thieb" },
        { question: "Quel est le nom de votre école primaire ?", answer: "excellence" }
      ]
    });

    console.log('✔️ Admin créé : admin@aerkm.sn / admin');

    /* ==============================
       🎓 10 ÉTUDIANTS DIVERS
    ============================== */
    console.log('🎓 Création de 10 étudiants de test...');
    const studentPassword = await bcrypt.hash('pass123', 10);

    const students = [
      { prenom: 'Moussa', nom: 'DIOP', email: 'moussa.diop@example.com', sexe: 'M', ufr: 'UFR SATIC', filiere: 'Mathématiques', niveau: 'Licence 3', nin: '1000000000001', telephone: '771000001', numeroRecensement: 'KM-1001-2024' },
      { prenom: 'Fatou', nom: 'SARR', email: 'fatou.sarr@example.com', sexe: 'F', ufr: 'UFR ECOMIJ', filiere: 'Économie et Management', niveau: 'Licence 2', nin: '1000000000002', telephone: '781000002', numeroRecensement: 'KM-1002-2024', maladieHandicap: true, typeMaladieHandicap: 'Asthme' },
      { prenom: 'Amadou', nom: 'BA', email: 'amadou.ba@example.com', sexe: 'M', ufr: 'UFR SATIC', filiere: 'Informatique', niveau: 'Licence 1', nin: '1000000000003', telephone: '701000003', numeroRecensement: 'KM-1003-2024' },
      { prenom: 'Mariama', nom: 'FALL', email: 'mariama.fall@example.com', sexe: 'F', ufr: 'UFR SDD', filiere: 'Médecine', niveau: 'Master 1', nin: '1000000000004', telephone: '761000004', numeroRecensement: 'KM-1004-2024' },
      { prenom: 'Ousmane', nom: 'GUEYE', email: 'ousmane.gueye@example.com', sexe: 'M', ufr: 'ISFAR', filiere: 'Agriculture', niveau: 'Licence 2', nin: '1000000000005', telephone: '751000005', numeroRecensement: 'KM-1005-2024' },
      { prenom: 'Awa', nom: 'NDIAYE', email: 'awa.ndiaye@example.com', sexe: 'F', ufr: 'UFR ECOMIJ', filiere: 'Finance', niveau: 'Licence 3', nin: '1000000000006', telephone: '771000006', numeroRecensement: 'KM-1006-2024' },
      { prenom: 'Ibrahima', nom: 'SY', email: 'ibrahima.sy@example.com', sexe: 'M', ufr: 'UFR SATIC', filiere: 'Réseaux', niveau: 'Master 2', nin: '1000000000007', telephone: '781000007', numeroRecensement: 'KM-1007-2024' },
      { prenom: 'Khady', nom: 'WANE', email: 'khady.wane@example.com', sexe: 'F', ufr: 'UFR SDD', filiere: 'Santé Communautaire', niveau: 'Licence 1', nin: '1000000000008', telephone: '701000008', numeroRecensement: 'KM-1008-2024' },
      { prenom: 'Modou', nom: 'LO', email: 'modou.lo@example.com', sexe: 'M', ufr: 'ISFAR', filiere: 'Élevage', niveau: 'Licence 3', nin: '1000000000009', telephone: '761000009', numeroRecensement: 'KM-1009-2024' },
      { prenom: 'Aminata', nom: 'TALL', email: 'aminata.tall@example.com', sexe: 'F', ufr: 'UFR ECOMIJ', filiere: 'Management', niveau: 'Licence 2', nin: '1000000000010', telephone: '771000010', numeroRecensement: 'KM-1010-2024' },
    ];

    const finalStudents = students.map(s => ({
      ...s,
      password: studentPassword,
      role: 'ETUDIANT',
      dateNaissance: new Date('2002-01-01'),
      lieuOrigine: 'Keur Massar',
      tuteur: 'Tuteur Test',
      securityQuestions: [
        { question: "Quel est votre plat préféré ?", answer: "thieb" },
        { question: "Quelle est votre ville de naissance ?", answer: "keur massar" },
        { question: "Quel est le nom de votre premier animal de compagnie ?", answer: "rex" }
      ]
    }));

    await User.insertMany(finalStudents);
    console.log('✔️ 10 Étudiants créés');

    /* ==============================
       📅 ÉVÉNEMENTS
    ============================== */
    console.log('📅 Création des événements de test...');

    await Event.insertMany([
      {
        titre: "Journée d'Intégration 2024",
        type: 'Intégration',
        description: 'Grande journée de bienvenue pour tous les nouveaux bacheliers ressortissants de Keur Massar à Bambey.',
        date: new Date('2024-12-15'),
        heure: '09:00',
        lieu: 'Grand Amphi, Université de Bambey',
        published: true,
      },
      {
        titre: "Conférence sur l'Entreprenariat Numérique",
        type: 'Conférence',
        description: "Session de partage avec des anciens de l'AERKM travaillant dans la Tech.",
        date: new Date('2025-01-20'),
        heure: '15:30',
        lieu: 'Salle de conférence UFR SATIC',
        published: true,
      }
    ]);

    console.log('✔️ Événements créés');
    console.log('🚀 Seeding terminé avec succès !');
    console.log('👉 Admin: admin@aerkm.sn / admin');
    console.log('👉 Étudiants: (emails liste) / pass123');
    process.exit(0);
  } catch (err) {
    console.error('❌ Erreur lors du seeding :', err);
    process.exit(1);
  }
};

seedDatabase();