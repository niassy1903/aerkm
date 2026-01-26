export const ACADEMIC_STRUCTURE = {
  "UFR ECOMIJ (Économie, Management et Ingénierie Juridique)": [
    "Économie et Management",
    "Économie appliquée",
    "Commerce électronique et cybersécurité",
    "Juriste d’affaires",
    "Juriste spécialiste de l’administration publique",
    "Ingénierie juridique",
    "Finance Comptabilité",
    "Management – Responsable des Organisations",
    "Administration Publique",
    "Management Juridique Environnemental et Foncier"
  ],
  "UFR SATIC (Sciences Appliquées et Technologies de l’Information et de la Communication)": [
    "Mathématiques",
    "Statistique et Informatique Décisionnelle",
    "Chimie Appliquée",
    "Physique‑Chimie & Physique Numérique",
    "Administration et Maintenance des Réseaux Téléinformatiques",
    "Développement et Administration des Applications Web",
    "Licence Professionnelle Création Multimédia",
    "Statistique & Informatique Décisionnelle",
    "Systèmes, Réseaux & Télécoms"
  ],
  "UFR SDD (Santé et Développement Durable)": [
    "Licence Santé Communautaire",
    "Licence Ingénierie Technique du Développement Durable (ITDDME)",
    "Développement Durable",
    "Médecine"
  ],
  "ISFAR (Institut Supérieur de Formation Agricole et Rural)": [
    "Conseil agricole et rural",
    "Sciences agronomiques – spécialité Élevage",
    "Sciences agronomiques – spécialité Eaux & Forêts",
    "Sciences agronomiques – spécialité Agriculture"
  ]
};

export const UFR_LIST = Object.keys(ACADEMIC_STRUCTURE);

export const NIVEAUX = [
  "Licence 1",
  "Licence 2",
  "Licence 3",
  "Master 1",
  "Master 2",
  "Doctorat"
];

export const EVENT_TYPES = [
  "Réunion",
  "Activité Culturelle",
  "Activité Sportive",
  "Conférence",
  "Intégration",
  "Campagne de Sensibilisation",
  "Annonce",
  "Autre"
];

export const BUREAU_MEMBERS = [
  {
    role: "Président",
    prenom: "Moussa",
    nom: "DIOP",
    telephone: "+221 77 123 45 67",
    email: "president@aerkm.sn",
    image: "",
    color: "from-aerkm-blue to-blue-600"
  },
  {
    role: "Vice-Présidente",
    prenom: "Fatou",
    nom: "SARR",
    telephone: "+221 78 987 65 43",
    email: "vice-president@aerkm.sn",
    image: "",
    color: "from-aerkm-brown to-amber-700"
  },
  {
    role: "Secrétaire Général",
    prenom: "Amadou",
    nom: "BA",
    telephone: "+221 70 111 22 33",
    email: "secretariat@aerkm.sn",
    image: "",
    color: "from-slate-700 to-slate-900"
  },
  {
    role: "Trésorière",
    prenom: "Aminata",
    nom: "FALL",
    telephone: "+221 76 444 55 66",
    email: "tresorerie@aerkm.sn",
    image: "",
    color: "from-aerkm-gold to-amber-500"
  },
  {
    role: "Pdt. Commission Sociale",
    prenom: "Ousmane",
    nom: "GUEYE",
    telephone: "+221 75 888 99 00",
    email: "social@aerkm.sn",
    image: "",
    color: "from-red-600 to-red-800"
  },
  {
    role: "Pdt. Commission Pédagogique",
    prenom: "Khady",
    nom: "NDIAYE",
    telephone: "+221 77 222 33 44",
    email: "pedagogie@aerkm.sn",
    image: "",
    color: "from-green-600 to-green-800"
  }
];

export const ADMIN_CREDENTIALS = {
  email: "admin@aerkm.sn",
  password: "admin"
};
