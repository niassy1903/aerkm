import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  ShieldCheck,
  Users,
  Mail,
  Calendar,
  Activity,
  Lock,
  AlertCircle,
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
  const [serverErrors, setServerErrors] = useState<Record<string, string>>({});
  const formRef = useRef<HTMLFormElement>(null);

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

  // Génération CAPTCHA
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

  useEffect(() => { generateCaptcha(); }, [generateCaptcha]);

  useEffect(() => {
    const defaultFiliere = ACADEMIC_STRUCTURE[formData.ufr as keyof typeof ACADEMIC_STRUCTURE][0];
    setFormData(prev => ({ ...prev, filiere: defaultFiliere }));
  }, [formData.ufr]);

  useEffect(() => {
    if (settings) {
      setFormData(prev => ({ ...prev, anneeUniversitaire: settings.academicYear }));
    }
  }, [settings]);

  // Validation champs
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
      setFormData(prev => ({ ...prev, tuteur: { ...prev.tuteur, [tuteurField]: value } }));
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

  const scrollToError = () => {
    const firstErrorField = formRef.current?.querySelector('.border-red-500');
    if (firstErrorField) {
      firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Soumission formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (settings && !settings.registrationOpen) return;

    const newErrors: Record<string, string> = {};
    ['nom', 'prenom', 'email', 'telephone', 'nin', 'tuteur.nom', 'tuteur.telephone', 'dateNaissance'].forEach(key => {
      const parts = key.split('.');
      const value = parts.length > 1 ? (formData as any)[parts[0]]?.[parts[1]] : (formData as any)[key];
      if (!value) newErrors[key] = 'Ce champ est obligatoire.';
    });

    if (parseInt(userCaptcha) !== captcha.answer) {
      setCaptchaError('Réponse incorrecte. Veuillez réessayer.');
      generateCaptcha();
      return;
    }

    if (Object.values(errors).some(e => e) || Object.keys(newErrors).length > 0) {
      setErrors(prev => ({ ...prev, ...newErrors }));
      scrollToError();
      return;
    }

    setLoading(true);
    try {
      const response = await registerStudent(formData);
      if (response) {
        setSuccess(true);
        setTimeout(() => navigate('/etudiant'), 3000);
      } else {
        setServerErrors({ submit: "Une erreur est survenue lors de l'enregistrement." });
        scrollToError();
        generateCaptcha();
      }
    } catch (error: any) {
      const message = error?.response?.data?.message;
      if (message === 'Cet email est déjà utilisé.') {
        setServerErrors({ email: message });
      } else {
        setServerErrors({
          submit: message || "Une erreur est survenue. Veuillez réessayer plus tard.",
        });
      }
      scrollToError();
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
    text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-2
    ${isRequired ? 'after:content-["*"] after:ml-0.5 after:text-red-500' : ''}
  `;

  const errorMessageClasses = `
    text-xs text-red-500 mt-1 ml-2
  `;

  // === Rendu ===
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
      <div className="absolute inset-0 bg-[url('/assets/pattern-light.svg')] dark:bg-[url('/assets/pattern-dark.svg')] bg-center bg-cover opacity-10"></div>
      <div className="max-w-4xl mx-auto relative z-10">
        {/* Formulaire complet */}
        <form ref={formRef} onSubmit={handleSubmit} className="p-8 lg:p-14 space-y-10 bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-xl">
          {serverErrors.submit && (
            <div className="flex items-start space-x-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 p-5 rounded-2xl">
              <AlertCircle size={20} className="mt-0.5" />
              <p className="text-sm font-bold">{serverErrors.submit}</p>
            </div>
          )}

          {/* === Section Identité === */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className={labelClasses(true)}>Nom</label>
              <input
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                className={inputClasses(Boolean(errors.nom))}
                placeholder="Ex: Ndiaye"
              />
              {errors.nom && <p className={errorMessageClasses}>{errors.nom}</p>}
            </div>
            <div>
              <label className={labelClasses(true)}>Prénom</label>
              <input
                name="prenom"
                value={formData.prenom}
                onChange={handleChange}
                className={inputClasses(Boolean(errors.prenom))}
                placeholder="Ex: Aliou"
              />
              {errors.prenom && <p className={errorMessageClasses}>{errors.prenom}</p>}
            </div>
            <div>
              <label className={labelClasses(false)}>Sexe</label>
              <select name="sexe" value={formData.sexe} onChange={handleChange} className={inputClasses(false)}>
                <option value="M">Masculin</option>
                <option value="F">Féminin</option>
              </select>
            </div>
            <div>
              <label className={labelClasses(true)}>Date de Naissance</label>
              <input
                type="date"
                name="dateNaissance"
                max={maxDateString}
                value={formData.dateNaissance}
                onChange={handleChange}
                className={inputClasses(Boolean(errors.dateNaissance))}
              />
              {errors.dateNaissance && <p className={errorMessageClasses}>{errors.dateNaissance}</p>}
            </div>
          </div>

          {/* === Section Cursus === */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className={labelClasses(true)}>UFR</label>
              <select name="ufr" value={formData.ufr} onChange={handleChange} className={inputClasses(false)}>
                {UFR_LIST.map((u) => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClasses(true)}>Filière</label>
              <select name="filiere" value={formData.filiere} onChange={handleChange} className={inputClasses(false)}>
                {ACADEMIC_STRUCTURE[formData.ufr as keyof typeof ACADEMIC_STRUCTURE].map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClasses(true)}>Niveau</label>
              <select name="niveau" value={formData.niveau} onChange={handleChange} className={inputClasses(false)}>
                {NIVEAUX.map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClasses(false)}>Année Universitaire</label>
              <input value={formData.anneeUniversitaire} disabled className={inputClasses(false)} />
            </div>
          </div>

          {/* === Section Contact & NIN === */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className={labelClasses(true)}>NIN</label>
              <input
                name="nin"
                value={formData.nin}
                onChange={handleChange}
                className={inputClasses(Boolean(errors.nin))}
                placeholder="Ex: 1234567890123"
              />
              {errors.nin && <p className={errorMessageClasses}>{errors.nin}</p>}
            </div>
            <div>
              <label className={labelClasses(true)}>Téléphone</label>
              <input
                name="telephone"
                value={formData.telephone}
                onChange={handleChange}
                className={inputClasses(Boolean(errors.telephone))}
                placeholder="Ex: 770000000"
              />
              {errors.telephone && <p className={errorMessageClasses}>{errors.telephone}</p>}
            </div>
            <div>
              <label className={labelClasses(true)}>Email</label>
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={inputClasses(Boolean(errors.email))}
                placeholder="Ex: aliou@example.com"
              />
              {errors.email && <p className={errorMessageClasses}>{errors.email}</p>}
            </div>
          </div>

          {/* === Section Tuteur === */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className={labelClasses(true)}>Nom du Tuteur</label>
              <input
                name="tuteur.nom"
                value={formData.tuteur.nom}
                onChange={handleChange}
                className={inputClasses(Boolean(errors['tuteur.nom']))}
                placeholder="Ex: Ndiaye"
              />
              {errors['tuteur.nom'] && <p className={errorMessageClasses}>{errors['tuteur.nom']}</p>}
            </div>
            <div>
              <label className={labelClasses(true)}>Téléphone du Tuteur</label>
              <input
                name="tuteur.telephone"
                value={formData.tuteur.telephone}
                onChange={handleChange}
                className={inputClasses(Boolean(errors['tuteur.telephone']))}
                placeholder="Ex: 770000000"
              />
              {errors['tuteur.telephone'] && <p className={errorMessageClasses}>{errors['tuteur.telephone']}</p>}
            </div>
            <div>
              <label className={labelClasses(false)}>Email du Tuteur</label>
              <input
                name="tuteur.email"
                value={formData.tuteur.email}
                onChange={handleChange}
                className={inputClasses(Boolean(errors['tuteur.email']))}
                placeholder="Ex: tuteur@example.com"
              />
              {errors['tuteur.email'] && <p className={errorMessageClasses}>{errors['tuteur.email']}</p>}
            </div>
          </div>

          {/* === Section CAPTCHA === */}
          <div className="flex items-center space-x-4">
            <input
              type="text"
              name="captcha"
              value={userCaptcha}
              onChange={(e) => setUserCaptcha(e.target.value)}
              placeholder={`Résolvez: ${captcha.question}`}
              className={inputClasses(Boolean(captchaError))}
            />
            <button type="button" onClick={generateCaptcha} className="px-6 py-3 bg-aerkm-blue text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-800">
              🔄
            </button>
          </div>
          {captchaError && <p className={errorMessageClasses}>{captchaError}</p>}

          {/* === Submit Button === */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-aerkm-blue text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? <Loader2 className="animate-spin mx-auto" size={20} /> : 'Valider le recensement'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Inscription;
