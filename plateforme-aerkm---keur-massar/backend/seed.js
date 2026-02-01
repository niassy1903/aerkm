import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

import User from './models/User.js';
import Event from './models/Event.js';

dotenv.config();

const MONGODB_URI =
  process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/aerkm_db';

const seedDatabase = async () => {
  try {
    console.log('⏳ Connexion à MongoDB pour le seeding...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connecté à MongoDB');

    /* ==============================
       🧨 RESET DES INDEX
    ============================== */
    console.log('🧨 Suppression de tous les index (User & Event)...');

    // Supprime TOUS les index existants
    await User.collection.dropIndexes();
    await Event.collection.dropIndexes();

    // Recrée uniquement les index définis dans les schemas
    await User.syncIndexes();
    await Event.syncIndexes();

    console.log('✔️ Index réinitialisés');

    /* ==============================
       🧹 NETTOYAGE DES DONNÉES
    ============================== */
    console.log('🧹 Nettoyage des anciennes données...');
    await User.deleteMany({});
    await Event.deleteMany({});

    /* ==============================
       👤 ADMIN
    ============================== */
    console.log('👤 Création du compte administrateur...');
    const adminPassword = await bcrypt.hash('admin', 10);

    await User.create({
      email: 'admin@aerkm.sn'.trim().toLowerCase(),
      password: adminPassword,
      role: 'ADMIN',
      nom: 'BUREAU',
      prenom: 'ADMIN',
      telephone: '+221330000000',
    });

    console.log('✔️ Admin créé : admin@aerkm.sn / admin');

    /* ==============================
       🎓 ÉTUDIANTS DE TEST
    ============================== */
    console.log('🎓 Création des étudiants de test...');
    const studentPassword = await bcrypt.hash('pass123', 10);

    await User.insertMany([
      {
        email: 'moussa.diop@example.com'.toLowerCase(),
        password: studentPassword,
        role: 'ETUDIANT',
        nom: 'DIOP',
        prenom: 'Moussa',
        sexe: 'M',
        dateNaissance: new Date('2002-05-15'),
        ufr: 'UFR SATIC',
        filiere: 'Mathématiques',
        niveau: 'Licence 3',
        telephone: '771234567',
        nin: '1234567890123',
        tuteur: 'Oumar Diop',
        numeroRecensement: 'KM-8821-2024',
      },
      {
        email: 'fatou.sarr@example.com'.toLowerCase(),
        password: studentPassword,
        role: 'ETUDIANT',
        nom: 'SARR',
        prenom: 'Fatou',
        sexe: 'F',
        dateNaissance: new Date('2003-10-20'),
        ufr: 'UFR ECOMIJ',
        filiere: 'Économie et Management',
        niveau: 'Licence 2',
        telephone: '789876543',
        nin: '9876543210987',
        tuteur: 'Mariama Sarr',
        numeroRecensement: 'KM-4452-2024',
        maladieHandicap: true,
        typeMaladieHandicap: 'Asthme',
      },
    ]);

    console.log('✔️ Étudiants créés');

    /* ==============================
       📅 ÉVÉNEMENTS DE TEST
    ============================== */
    console.log('📅 Création des événements de test...');

    await Event.insertMany([
      {
        titre: "Journée d'Intégration 2024",
        type: 'Intégration',
        description:
          'Grande journée de bienvenue pour tous les nouveaux bacheliers ressortissants de Keur Massar à Bambey.',
        date: new Date('2024-12-15'),
        heure: '09:00',
        lieu: 'Grand Amphi, Université de Bambey',
        published: true,
      },
      {
        titre: "Conférence sur l'Entreprenariat Numérique",
        type: 'Conférence',
        description:
          "Session de partage avec des anciens de l'AERKM travaillant dans la Tech.",
        date: new Date('2025-01-20'),
        heure: '15:30',
        lieu: 'Salle de conférence UFR SATIC',
        published: true,
      },
    ]);

    console.log('✔️ Événements créés');

    console.log('🚀 Seeding terminé avec succès !');
    process.exit(0);
  } catch (err) {
    console.error('❌ Erreur lors du seeding :', err);
    process.exit(1);
  }
};

seedDatabase();
