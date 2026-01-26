import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/StudentContext';
import { ACADEMIC_STRUCTURE, UFR_LIST, NIVEAUX } from '../../constants';
import {
  ClipboardCheck,
  User,
  School,
  Phone,
  CheckCircle2,
  ArrowLeft,
  Fingerprint,
  ShieldAlert,
  Users,
  Stethoscope,
  Home,
  Activity,
  Mail,
  Calendar,
  RefreshCw,
  ShieldCheck,
  AlertCircle,
  Lock,
  Loader2
} from 'lucide-react';

const Inscription: React.FC = () => {
  const { registerStudent } = useAuth();
  const { settings } = useData();
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [captcha, setCaptcha] = useState({ question: '', answer: 0 });
  const [userCaptcha, setUserCaptcha] = useState('');
  const [captchaError, setCaptchaError] = useState('');

  const today = new Date();
  const maxDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
  const maxDateString = maxDate.toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    sexe: 'M',
    dateNaissance: '',
    lieuOrigine: 'Keur Massar',
    ufr: UFR_LIST[0],
    filiere: ACADEMIC_STRUCTURE[UFR_LIST[0] as keyof typeof ACADEMIC_STRUCTURE][0],
    niveau: NIVEAUX[0],
    anneeUniversitaire: settings?.academicYear || '2024-2025',
    telephone: '',
    email: '',
    nin: '',
    tuteur: {
      nom: '',
      email: '',
      telephone: '',
    },
    maladieHandicap: false,
    typeMaladieHandicap: '',
    logementAmicale: false,
  });

  // Génération du CAPTCHA
  const generateCaptcha = useCallback(() => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    const operators = ['+', '-'];
    const op = operators[Math.floor(Math.random() * operators.length)];
    let question = '';
    let answer = 0;

    if (op === '+') {
      question = `${num1} + ${num2}`;
      answer = num1 + num2;
    } else {
      const n1 = Math.max(num1, num2);
      const n2 = Math.min(num1, num2);
      question = `${n1} - ${n2}`;
      answer = n1 - n2;
    }

    setCaptcha({ question, answer });
    setUserCaptcha('');
    setCaptchaError('');
  }, []);

  useEffect(() => {
    generateCaptcha();
  }, [generateCaptcha]);

  useEffect(() => {
    const defaultFiliere = ACADEMIC_STRUCTURE[formData.ufr as keyof typeof ACADEMIC_STRUCTURE][0];
    setFormData(prev => ({ ...prev, filiere: defaultFiliere }));
  }, [formData.ufr]);

  useEffect(() => {
    if (settings) {
      setFormData(prev => ({ ...prev, anneeUniversitaire: settings.academicYear }));
    }
  }, [settings]);

  // Validation des champs
  const validateField = (name: string, value: any) => {
    let error = '';
    if (name === 'nin') {
      if (!value) error = 'Le NIN est obligatoire.';
      else if (!/^\d{13,15}$/.test(value)) error = 'Le NIN doit comporter 13 à 15 chiffres.';
    }
    if (name === 'telephone') {
      if (!value) error = 'Le téléphone est obligatoire.';
      else if (!/^(77|78|70|76|33)\d{7}$/.test(value)) error = 'Numéro de téléphone invalide.';
    }
    if (name === 'email') {
      if (!value) error = 'L\'email est obligatoire.';
      else if (!/\S+@\S+\.\S+/.test(value)) error = 'Format email invalide.';
    }
    if (name === 'tuteur.email') {
      if (value && !/\S+@\S+\.\S+/.test(value)) error = 'Format email invalide.';
    }
    if (name === 'tuteur.telephone') {
      if (!value) error = 'Le téléphone du tuteur est obligatoire.';
      else if (!/^(77|78|70|76|33)\d{7}$/.test(value)) error = 'Numéro de téléphone invalide.';
    }
    if (name === 'nom' && !value) error = 'Le nom est obligatoire.';
    if (name === 'prenom' && !value) error = 'Le prénom est obligatoire.';
    if (name === 'dateNaissance' && !value) error = 'La date de naissance est obligatoire.';
    if (name === 'tuteur.nom' && !value) error = 'Le nom du tuteur est obligatoire.';
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const finalValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;

    if (name.startsWith('tuteur.')) {
      const tuteurField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        tuteur: { ...prev.tuteur, [tuteurField]: value }
      }));
      validateField(name, value);
    } else {
      setFormData(prev => ({ ...prev, [name]: finalValue }));
      validateField(name, finalValue);
    }
  };

  const handleToggle = (name: string, value: boolean) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'maladieHandicap' && !value) {
      setFormData(prev => ({ ...prev, typeMaladieHandicap: '' }));
      setErrors(prev => ({ ...prev, typeMaladieHandicap: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (settings && !settings.registrationOpen) return;

    const newErrors: Record<string, string> = {};
    ['nom', 'prenom', 'email', 'telephone', 'nin', 'tuteur.nom', 'tuteur.telephone', 'dateNaissance'].forEach(key => {
      const parts = key.split('.');
      const value = parts.length > 1 ? (formData as any)[parts[0]]?.[parts[1]] : (formData as any)[key];
      if (!value) newErrors[key] = 'Obligatoire';
    });

    if (parseInt(userCaptcha) !== captcha.answer) {
      setCaptchaError('Réponse incorrecte. Veuillez réessayer.');
      generateCaptcha();
      return;
    }

    if (Object.values(errors).some(e => e) || Object.keys(newErrors).length > 0) {
      setErrors(prev => ({ ...prev, ...newErrors }));
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setLoading(true);
    const done = await registerStudent(formData);
    if (done) {
      setSuccess(true);
      setTimeout(() => navigate('/etudiant'), 3000);
    } else {
      alert("Erreur: L'email est déjà utilisé.");
      generateCaptcha();
    }
    setLoading(false);
  };

  const inputClasses = (hasError: boolean) => `
    w-full px-6 py-4 bg-white dark:bg-slate-800/50
    border-2 ${hasError ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'}
    rounded-2xl outline-none transition-all duration-300
    placeholder:text-slate-300 dark:placeholder:text-slate-600
    font-bold text-slate-700 dark:text-slate-200
    focus:border-aerkm-blue dark:focus:border-aerkm-gold
    focus:ring-2 focus:ring-aerkm-blue/20 dark:focus:ring-aerkm-gold/20
  `;

  const labelClasses = (isRequired: boolean) => `
    text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-2 flex items-center
    ${isRequired ? 'after:content-["*"] after:ml-0.5 after:text-red-500' : ''}
  `;

  const errorMessageClasses = `
    text-xs text-red-500 mt-1 ml-2
  `;

  // Écran de fermeture des inscriptions
  if (settings && !settings.registrationOpen) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 p-6">
        <div className="max-w-lg w-full bg-white dark:bg-slate-900 p-12 rounded-[3.5rem] shadow-3xl text-center border border-slate-100 dark:border-slate-800 animate-in zoom-in duration-500">
          <div className="w-24 h-24 bg-red-50 dark:bg-red-950/30 text-red-500 rounded-full flex items-center justify-center mx-auto mb-8 transform transition-transform hover:scale-110">
            <Lock size={48} />
          </div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4 tracking-tighter uppercase">Inscriptions Closes</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-10 leading-relaxed font-medium">
            Le portail de recensement pour la session {settings.academicYear} est actuellement fermé par le bureau exécutif de l'AERKM.
          </p>
          <Link to="/" className="inline-block px-10 py-5 bg-aerkm-blue text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-800 transition-all shadow-xl shadow-aerkm-blue/20 transform hover:-translate-y-1">
            Retour à l'accueil
          </Link>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 p-6 transition-colors duration-500">
        <div className="max-w-md w-full bg-white dark:bg-slate-900 p-10 rounded-[3rem] shadow-3xl text-center border border-slate-100 dark:border-slate-800 transform transition-transform hover:scale-105">
          <div className="w-20 h-20 bg-green-50 dark:bg-green-950/30 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 transform transition-transform hover:rotate-12">
            <CheckCircle2 size={48} />
          </div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4 tracking-tighter">Recensement Validé !</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed font-medium">Vos informations ont été transmises avec succès. Bienvenue dans la communauté.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden transition-colors duration-500">
      {/* Effet de fond animé */}
      <div className="absolute inset-0 bg-[url('/assets/pattern-light.svg')] dark:bg-[url('/assets/pattern-dark.svg')] bg-center bg-cover opacity-10"></div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* En-tête */}
        <div className="mb-10 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 text-aerkm-blue dark:text-white font-black text-[10px] uppercase tracking-[0.2em] group transform transition-transform hover:-translate-x-2">
            <div className="w-10 h-10 bg-white dark:bg-slate-900 shadow-xl rounded-2xl flex items-center justify-center border border-slate-100 dark:border-slate-800 group-hover:-translate-x-1 transition-transform">
              <ArrowLeft size={16} />
            </div>
            <span>Retour</span>
          </Link>
          <div className="hidden sm:flex items-center space-x-2 bg-aerkm-gold/10 px-4 py-2 rounded-xl text-aerkm-brown dark:text-aerkm-gold text-[9px] font-black uppercase tracking-widest border border-aerkm-gold/20 transform transition-transform hover:scale-105">
            <Activity size={14} />
            <span>Session {settings?.academicYear || '2024-2025'}</span>
          </div>
        </div>

        {/* Titre principal */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter bg-clip-text bg-gradient-to-r from-aerkm-blue to-aerkm-gold">Recensement Étudiant</h1>
          <p className="mt-4 text-slate-400 font-bold uppercase text-[9px] tracking-[0.4em] transform transition-transform hover:scale-105">Amicale des Étudiants de Keur Massar à Bambey</p>
        </div>

        {/* Formulaire */}
        <div className="bg-white dark:bg-slate-900 shadow-[0_40px_100px_rgba(0,0,0,0.04)] dark:shadow-none rounded-[3.5rem] overflow-hidden border border-slate-100 dark:border-slate-800 transition-colors transform transition-transform hover:scale-[1.01]">
          {/* En-tête du formulaire */}
          <div className="bg-gradient-to-r from-aerkm-blue to-aerkm-gold p-10 text-white flex items-center justify-between">
            <div className="flex items-center space-x-6 group">
              <div className="relative w-16 h-16 rounded-full overflow-hidden bg-white border-2 border-aerkm-gold/50 shadow-2xl transition-all transform group-hover:scale-110">
                <img src="/assets/logo.jpg" alt="Logo AERKM" className="w-full h-full object-cover" />
              </div>
              <div>
                <h2 className="text-2xl font-black uppercase tracking-tight">Dossier de Membre</h2>
                <p className="text-blue-100/50 text-[10px] font-black uppercase tracking-[0.25em] mt-1">Données sécurisées & cryptées</p>
              </div>
            </div>
          </div>

          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="p-8 lg:p-14 space-y-16">
            {/* Section Identité */}
            <section className="space-y-10">
              <div className="flex items-center space-x-4 border-b border-slate-50 dark:border-slate-800 pb-4">
                <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-aerkm-brown transform transition-transform hover:rotate-12">
                  <User size={18} />
                </div>
                <h3 className="font-black text-[11px] uppercase tracking-[0.2em] text-slate-400">Identité & NIN</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className={labelClasses(true)}>Prénom</label>
                  <input name="prenom" placeholder="Ex: Moussa" value={formData.prenom} onChange={handleChange} className={inputClasses(!!errors.prenom)} />
                  {errors.prenom && <p className={errorMessageClasses}>{errors.prenom}</p>}
                </div>
                <div className="space-y-2">
                  <label className={labelClasses(true)}>Nom</label>
                  <input name="nom" placeholder="Ex: DIOP" value={formData.nom} onChange={handleChange} className={inputClasses(!!errors.nom)} />
                  {errors.nom && <p className={errorMessageClasses}>{errors.nom}</p>}
                </div>
                <div className="space-y-2">
                  <label className={labelClasses(true)}>Numéro NIN</label>
                  <div className="relative group">
                    <Fingerprint className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-600" size={18} />
                    <input name="nin" value={formData.nin} onChange={handleChange} placeholder="13 à 15 chiffres" className={`${inputClasses(!!errors.nin)} pl-14`} />
                  </div>
                  {errors.nin && <p className={errorMessageClasses}>{errors.nin}</p>}
                </div>
                <div className="space-y-2">
                  <label className={labelClasses(true)}>Date de Naissance</label>
                  <div className="relative group">
                    <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-600" size={18} />
                    <input type="date" name="dateNaissance" max={maxDateString} value={formData.dateNaissance} onChange={handleChange} className={`${inputClasses(!!errors.dateNaissance)} pl-14`} />
                  </div>
                  {errors.dateNaissance && <p className={errorMessageClasses}>{errors.dateNaissance}</p>}
                </div>
                <div className="space-y-2">
                  <label className={labelClasses(true)}>Téléphone</label>
                  <div className="relative group">
                    <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-600" size={18} />
                    <input name="telephone" placeholder="Ex: 771234567" value={formData.telephone} onChange={handleChange} className={`${inputClasses(!!errors.telephone)} pl-14`} />
                  </div>
                  {errors.telephone && <p className={errorMessageClasses}>{errors.telephone}</p>}
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className={labelClasses(true)}>Email</label>
                  <div className="relative group">
                    <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-600" size={18} />
                    <input type="email" name="email" placeholder="exemple@email.com" value={formData.email} onChange={handleChange} className={`${inputClasses(!!errors.email)} pl-14`} />
                  </div>
                  {errors.email && <p className={errorMessageClasses}>{errors.email}</p>}
                </div>
              </div>
            </section>

            {/* Section Cursus */}
            <section className="space-y-10">
              <div className="flex items-center space-x-4 border-b border-slate-50 dark:border-slate-800 pb-4">
                <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-aerkm-gold transform transition-transform hover:scale-110">
                  <School size={18} />
                </div>
                <h3 className="font-black text-[11px] uppercase tracking-[0.2em] text-slate-400">Cursus Universitaire</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className={labelClasses(true)}>UFR</label>
                  <select
                    name="ufr"
                    value={formData.ufr}
                    onChange={handleChange}
                    className={inputClasses(false)}
                  >
                    {UFR_LIST.map((ufr) => (
                      <option key={ufr} value={ufr}>
                        {ufr}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className={labelClasses(true)}>Filière</label>
                  <select
                    name="filiere"
                    value={formData.filiere}
                    onChange={handleChange}
                    className={inputClasses(false)}
                  >
                    {ACADEMIC_STRUCTURE[formData.ufr]?.map((filiere, index) => (
                      <option key={index} value={filiere}>
                        {filiere}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className={labelClasses(true)}>Niveau</label>
                  <select
                    name="niveau"
                    value={formData.niveau}
                    onChange={handleChange}
                    className={inputClasses(false)}
                  >
                    {NIVEAUX.map((niveau) => (
                      <option key={niveau} value={niveau}>
                        {niveau}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className={labelClasses(true)}>Sexe</label>
                  <div className="flex p-1 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, sexe: 'M' })}
                      className={`flex-1 py-3 rounded-xl text-[10px] font-black transition-all ${
                        formData.sexe === 'M' ? 'bg-white dark:bg-slate-700 text-aerkm-blue dark:text-white shadow-sm' : 'text-slate-400'
                      }`}
                    >
                      MASCULIN
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, sexe: 'F' })}
                      className={`flex-1 py-3 rounded-xl text-[10px] font-black transition-all ${
                        formData.sexe === 'F' ? 'bg-white dark:bg-slate-700 text-pink-500 shadow-sm' : 'text-slate-400'
                      }`}
                    >
                      FÉMININ
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Section Sociale */}
            <section className="space-y-10 bg-slate-50 dark:bg-slate-800/30 p-8 lg:p-12 rounded-[3rem] border border-slate-100 dark:border-slate-800/50 transform transition-transform hover:scale-[1.01]">
              <div className="flex items-center space-x-4 border-b border-white dark:border-slate-800 pb-4">
                <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 flex items-center justify-center text-red-500 transform transition-transform hover:rotate-12">
                  <Activity size={18} />
                </div>
                <h3 className="font-black text-[11px] uppercase tracking-[0.2em] text-slate-400">Social & Santé</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <label className={labelClasses(false)}>Pathologie ou Handicap ?</label>
                  <div className="flex p-1 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 w-fit">
                    <button type="button" onClick={() => handleToggle('maladieHandicap', true)} className={`px-8 py-3 rounded-xl text-[10px] font-black transition-all ${formData.maladieHandicap ? 'bg-red-500 text-white' : 'text-slate-400'}`}>OUI</button>
                    <button type="button" onClick={() => handleToggle('maladieHandicap', false)} className={`px-8 py-3 rounded-xl text-[10px] font-black transition-all ${!formData.maladieHandicap ? 'bg-slate-100 dark:bg-slate-800' : 'text-slate-400'}`}>NON</button>
                  </div>
                </div>
                <div className="space-y-4">
                  <label className={labelClasses(false)}>Logement de l'Amicale ?</label>
                  <div className="flex p-1 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 w-fit">
                    <button type="button" onClick={() => handleToggle('logementAmicale', true)} className={`px-8 py-3 rounded-xl text-[10px] font-black transition-all ${formData.logementAmicale ? 'bg-aerkm-blue text-white' : 'text-slate-400'}`}>OUI</button>
                    <button type="button" onClick={() => handleToggle('logementAmicale', false)} className={`px-8 py-3 rounded-xl text-[10px] font-black transition-all ${!formData.logementAmicale ? 'bg-slate-100 dark:bg-slate-800' : 'text-slate-400'}`}>NON</button>
                  </div>
                </div>
              </div>
            </section>

            {/* Section Contact */}
            <section className="space-y-12 bg-gradient-to-br from-aerkm-blue/5 via-white to-aerkm-gold/5 dark:from-slate-900 dark:to-slate-900 p-10 lg:p-14 rounded-[3.5rem] border border-aerkm-blue/10 dark:border-slate-700/50 transform transition-transform hover:scale-[1.01]">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-aerkm-blue to-aerkm-gold text-white flex items-center justify-center shadow-xl transform transition-transform hover:scale-110">
                  <Users size={22} />
                </div>
                <div>
                  <h3 className="font-black text-lg text-slate-800 dark:text-white tracking-tight">Personne à contacter</h3>
                  <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">En cas de besoin ou de situation urgente</p>
                </div>
              </div>
              <div className="bg-white/70 dark:bg-slate-800/60 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 transform transition-transform hover:scale-[1.01]">
                <p className="text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                  Les informations ci-dessous permettent à l’Amicale de contacter rapidement un responsable légal ou un proche en cas de nécessité académique, sociale ou sanitaire.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="md:col-span-2 space-y-2">
                  <label className={labelClasses(true)}>Nom complet du tuteur / responsable</label>
                  <div className="relative">
                    <ShieldCheck size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-aerkm-gold" />
                    <input name="tuteur.nom" placeholder="Ex: Abdoulaye Ndiaye" value={formData.tuteur.nom} onChange={handleChange} className={`${inputClasses(!!errors['tuteur.nom'])} pl-14`} />
                  </div>
                  {errors['tuteur.nom'] && <p className={errorMessageClasses}>{errors['tuteur.nom']}</p>}
                </div>
                <div className="space-y-2">
                  <label className={labelClasses(false)}>Email du tuteur</label>
                  <div className="relative">
                    <Mail size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-aerkm-blue" />
                    <input type="email" name="tuteur.email" placeholder="exemple@email.com" value={formData.tuteur.email} onChange={handleChange} className={`${inputClasses(!!errors['tuteur.email'])} pl-14`} />
                  </div>
                  {errors['tuteur.email'] && <p className={errorMessageClasses}>{errors['tuteur.email']}</p>}
                </div>
                <div className="space-y-2">
                  <label className={labelClasses(true)}>Téléphone WhatsApp du tuteur</label>
                  <div className="relative">
                    <Phone size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-green-500" />
                    <input name="tuteur.telephone" placeholder="77 123 45 67" value={formData.tuteur.telephone} onChange={handleChange} className={`${inputClasses(!!errors['tuteur.telephone'])} pl-14`} />
                  </div>
                  {errors['tuteur.telephone'] && <p className={errorMessageClasses}>{errors['tuteur.telephone']}</p>}
                </div>
              </div>
            </section>

            {/* CAPTCHA */}
            <section className="space-y-10">
              <div className="bg-slate-50 dark:bg-slate-800/50 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 flex flex-col md:flex-row items-center justify-between gap-8 transform transition-transform hover:scale-[1.01]">
                <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col items-center transform transition-transform hover:rotate-6">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Calculer</span>
                  <span className="text-2xl font-black text-aerkm-blue dark:text-aerkm-gold">{captcha.question} = ?</span>
                </div>
                <div className="flex-1 w-full max-w-xs space-y-2">
                  <label className={labelClasses(true)}>Résultat</label>
                  <input type="number" value={userCaptcha} onChange={e => setUserCaptcha(e.target.value)} className={inputClasses(!!captchaError)} />
                  {captchaError && <p className={errorMessageClasses}>{captchaError}</p>}
                </div>
              </div>
            </section>

            {/* Bouton de soumission */}
            <div className="pt-10">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-aerkm-brown to-aerkm-brownLight text-white font-black py-7 px-10 rounded-[2.5rem] shadow-2xl transition-all transform active:scale-95 flex items-center justify-center space-x-4 uppercase tracking-[0.2em] text-xs disabled:opacity-50 hover:shadow-3xl hover:shadow-aerkm-brown/30"
              >
                {loading ? <Loader2 className="animate-spin" size={24} /> : <><ClipboardCheck size={24} /><span>VALIDER MON RECENSEMENT</span></>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Inscription;
