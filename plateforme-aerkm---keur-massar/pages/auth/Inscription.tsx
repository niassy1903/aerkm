
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/StudentContext';
import { ACADEMIC_STRUCTURE, UFR_LIST, NIVEAUX, SECURITY_QUESTIONS } from '../../constants';
import {
  ClipboardCheck,
  User,
  School,
  Phone,
  CheckCircle2,
  ArrowLeft,
  Fingerprint,
  Users,
  Mail,
  Calendar,
  Activity,
  Lock,
  Loader2,
  AlertCircle,
  ShieldQuestion,
  Heart,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  UserPlus
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
  const [serverError, setServerError] = useState('');

  const today = new Date();
  const maxDate = new Date(today.getFullYear() - 15, today.getMonth(), today.getDate());
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
    password: '',
    confirmPassword: '',
    tuteur: {
      nom: '',
      email: '',
      telephone: '',
    },
    securityQuestions: [] as { question: string, answer: string }[],
    maladieHandicap: false,
    typeMaladieHandicap: '',
    logementAmicale: false,
  });

  useEffect(() => {
    const shuffled = [...SECURITY_QUESTIONS].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 3).map(q => ({ question: q, answer: '' }));
    setFormData(prev => ({ ...prev, securityQuestions: selected }));
  }, []);

  const generateCaptcha = useCallback(() => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    setCaptcha({ question: `${num1} + ${num2}`, answer: num1 + num2 });
    setUserCaptcha('');
  }, []);

  useEffect(() => {
    generateCaptcha();
  }, [generateCaptcha]);

  useEffect(() => {
    const filieres = ACADEMIC_STRUCTURE[formData.ufr as keyof typeof ACADEMIC_STRUCTURE] || [];
    setFormData(prev => ({ ...prev, filiere: filieres[0] || '' }));
  }, [formData.ufr]);

  const validateField = (name: string, value: any) => {
    let error = '';
    const emailRegex = /\S+@\S+\.\S+/;
    const telRegex = /^(77|78|70|76|33)\d{7}$/;

    if (name === 'nom' && !value.trim()) error = 'Le nom est obligatoire.';
    if (name === 'prenom' && !value.trim()) error = 'Le prénom est obligatoire.';
    if (name === 'dateNaissance' && !value) error = 'La date de naissance est obligatoire.';
    if (name === 'password' && (!value || value.length < 6)) error = 'Minimum 6 caractères.';
    if (name === 'confirmPassword' && value !== formData.password) error = 'Les mots de passe diffèrent.';
    
    if (name === 'email') {
      if (!value) error = 'L\'email est obligatoire.';
      else if (!emailRegex.test(value)) error = 'Format d\'email invalide.';
    }
    if (name === 'telephone') {
      if (!value) error = 'Le téléphone est obligatoire.';
      else if (!telRegex.test(value)) error = 'Format invalide (Ex: 771234567).';
    }
    if (name === 'nin') {
      if (!value) error = 'Le NIN est obligatoire.';
      else if (!/^^\d{13,15}$/.test(value)) error = 'Le NIN doit comporter 13 à 15 chiffres.';
    }
    
    if (name === 'tuteur.nom' && !value.trim()) error = 'Le nom du tuteur est requis.';
    if (name === 'tuteur.telephone') {
      if (!value) error = 'Le téléphone du tuteur est obligatoire.';
      else if (!telRegex.test(value)) error = 'Format invalide.';
    }

    if (name.startsWith('securityQuestions')) {
      if (!value || value.trim().length < 2) error = "La réponse est trop courte.";
    }

    setErrors(prev => ({ ...prev, [name]: error }));
    return error;
  };

  // @fix: Updated handleChange signature to include HTMLTextAreaElement for TypeScript compatibility
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    // Check if the target is an input with a 'type' property to handle checkboxes
    const target = e.target as any;
    const type = target.type;
    const finalValue = type === 'checkbox' ? target.checked : value;

    if (name.startsWith('tuteur.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({ ...prev, tuteur: { ...prev.tuteur, [field]: value } }));
      setErrors(prev => ({ ...prev, [name]: '' }));
    } else {
      setFormData(prev => ({ ...prev, [name]: finalValue }));
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSecurityAnswerChange = (index: number, value: string) => {
    const newQuestions = [...formData.securityQuestions];
    newQuestions[index].answer = value;
    setFormData(prev => ({ ...prev, securityQuestions: newQuestions }));
    validateField(`securityQuestions.${index}`, value);
  };

  const scrollToFirstError = () => {
    setTimeout(() => {
      const errorElement = document.querySelector('.border-red-500');
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError('');
    setCaptchaError('');
    
    const localErrors: Record<string, string> = {};
    const fieldsToValidate = ['nom', 'prenom', 'email', 'telephone', 'nin', 'dateNaissance', 'password', 'confirmPassword', 'tuteur.nom', 'tuteur.telephone'];
    
    fieldsToValidate.forEach(key => {
      const val = key.includes('.') ? (formData as any).tuteur[key.split('.')[1]] : (formData as any)[key];
      const err = validateField(key, val);
      if (err) localErrors[key] = err;
    });

    formData.securityQuestions.forEach((sq, idx) => {
      const err = validateField(`securityQuestions.${idx}`, sq.answer);
      if (err) localErrors[`securityQuestions.${idx}`] = err;
    });

    if (Object.values(localErrors).some(v => v !== '')) {
      setErrors(prev => ({ ...prev, ...localErrors }));
      scrollToFirstError();
      return;
    }

    if (parseInt(userCaptcha) !== captcha.answer) {
      setCaptchaError('Réponse incorrecte au calcul de sécurité.');
      generateCaptcha();
      return;
    }

    setLoading(true);
    try {
      const response = await registerStudent(formData);
      if (response.success) {
        setSuccess(true);
        setTimeout(() => navigate('/etudiant'), 3000);
      } else if (response.errors) {
        setErrors(prev => ({ ...prev, ...response.errors }));
        setServerError("Certaines informations sont déjà utilisées ou invalides.");
        scrollToFirstError();
        generateCaptcha();
      } else {
        setServerError("Une erreur inconnue est survenue.");
      }
    } catch (err) {
      setServerError("Impossible de contacter le serveur.");
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = (hasError: boolean) => `
    w-full px-5 py-4 bg-white dark:bg-slate-800/40
    border-2 ${hasError ? 'border-red-500 bg-red-50/10' : 'border-slate-100 dark:border-slate-700/50'}
    rounded-2xl outline-none transition-all duration-300
    placeholder:text-slate-300 dark:placeholder:text-slate-600 font-bold text-slate-700 dark:text-slate-200
    focus:border-aerkm-blue dark:focus:border-aerkm-gold focus:bg-white dark:focus:bg-slate-800 focus:shadow-xl focus:shadow-aerkm-blue/5
  `;

  const ErrorLabel = ({ name }: { name: string }) => errors[name] ? (
    <p className="text-red-500 text-[9px] font-black mt-1.5 ml-2 uppercase tracking-wide flex items-center animate-in fade-in slide-in-from-top-1">
      <AlertCircle size={10} className="mr-1 shrink-0" /> {errors[name]}
    </p>
  ) : null;

  const SectionHeader = ({ icon: Icon, title, subtitle, colorClass }: { icon: any, title: string, subtitle: string, colorClass: string }) => (
    <div className="flex items-start space-x-5 mb-10">
      <div className={`w-14 h-14 rounded-2xl ${colorClass} flex items-center justify-center shrink-0 shadow-lg`}>
        <Icon size={28} className="text-white" />
      </div>
      <div>
        <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter uppercase leading-none">{title}</h3>
        <p className="text-xs text-slate-400 dark:text-slate-500 font-medium italic mt-2 leading-relaxed">"{subtitle}"</p>
      </div>
    </div>
  );

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-6">
        <div className="max-w-md w-full bg-white dark:bg-slate-900 p-12 rounded-[3.5rem] shadow-3xl text-center border border-slate-100 dark:border-slate-800 animate-in zoom-in duration-500">
          <div className="w-24 h-24 bg-green-50 dark:bg-green-950/30 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
            <CheckCircle2 size={60} />
          </div>
          <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-4 tracking-tighter">Recensement Validé !</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed font-bold">Votre dossier a été enregistré. Redirection vers votre espace membre...</p>
          <div className="flex justify-center">
            <Loader2 className="animate-spin text-aerkm-gold" size={32} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500 relative overflow-hidden">
      {/* Dynamic Background Decorations */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-aerkm-blue/5 rounded-full blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-aerkm-gold/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        
        {/* Navigation Top */}
        <div className="mb-12 flex items-center justify-between">
          <Link to="/" className="group flex items-center space-x-3 px-6 py-3 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 hover:border-aerkm-blue dark:hover:border-aerkm-gold transition-all overflow-hidden relative">
            <div className="absolute inset-0 bg-aerkm-blue opacity-0 group-hover:opacity-[0.03] transition-opacity"></div>
            <ArrowLeft size={18} className="text-aerkm-blue dark:text-aerkm-gold group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400">Retour à l'accueil</span>
          </Link>
          <div className="flex flex-col items-end">
            <div className="bg-aerkm-blue text-white px-5 py-2.5 rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] shadow-xl shadow-aerkm-blue/20 flex items-center">
              <Activity size={14} className="mr-2 text-aerkm-gold" />
              <span>Session {settings?.academicYear || '2024-2025'}</span>
            </div>
          </div>
        </div>

        {/* Hero Title */}
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="inline-flex items-center space-x-2 py-1.5 px-4 rounded-full bg-aerkm-gold/10 border border-aerkm-gold/30 text-aerkm-brown dark:text-aerkm-gold text-[10px] font-black uppercase tracking-[0.3em] mb-6">
            <UserPlus size={14} />
            <span>Nouveau Membre</span>
          </div>
          <h1 className="text-5xl lg:text-7xl font-black text-slate-900 dark:text-white tracking-tighter uppercase leading-[0.9]">
            Formulaire de <br/> <span className="text-aerkm-blue dark:text-aerkm-gold italic">Recensement</span>
          </h1>
          <div className="w-24 h-2 bg-aerkm-brown dark:bg-aerkm-gold mx-auto mt-8 rounded-full"></div>
        </div>

        {/* Main Card Form */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-3xl shadow-3xl rounded-[4rem] border border-white dark:border-slate-800 overflow-hidden animate-in fade-in slide-in-from-bottom-12 duration-1000">
          
          {/* Form Banner */}
          <div className="bg-aerkm-blue p-12 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <ClipboardCheck size={200} />
            </div>
            <div className="relative z-10">
              <h2 className="text-3xl font-black uppercase tracking-tight">Dossier Officiel AERKM</h2>
              <p className="text-blue-100/60 text-[10px] font-black uppercase tracking-[0.4em] mt-2">Enregistrement sécurisé en base de données</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-8 lg:p-16 space-y-24">
            
            {serverError && (
              <div className="p-6 bg-red-50 border border-red-100 text-red-600 rounded-3xl flex items-center space-x-4 animate-shake">
                <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center shrink-0">
                  <AlertCircle size={24} />
                </div>
                <div>
                  <p className="text-sm font-black uppercase tracking-tight">Erreur d'inscription</p>
                  <p className="text-xs font-bold opacity-80">{serverError}</p>
                </div>
              </div>
            )}

            {/* SECTION 1: IDENTITÉ */}
            <section className="animate-in fade-in duration-700">
              <SectionHeader 
                icon={User} 
                title="1. Identité & Accès" 
                subtitle="Définissez vos informations de base et vos identifiants pour créer votre espace membre sécurisé."
                colorClass="bg-aerkm-brown"
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                <div className="space-y-2 group">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-2 group-focus-within:text-aerkm-blue dark:group-focus-within:text-aerkm-gold transition-colors">Prénom *</label>
                  <input name="prenom" value={formData.prenom} onChange={handleChange} className={inputClasses(!!errors.prenom)} placeholder="Moussa" />
                  <ErrorLabel name="prenom" />
                </div>
                <div className="space-y-2 group">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-2">Nom *</label>
                  <input name="nom" value={formData.nom} onChange={handleChange} className={inputClasses(!!errors.nom)} placeholder="DIOP" />
                  <ErrorLabel name="nom" />
                </div>
                <div className="space-y-2 group">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-2">Numéro NIN *</label>
                  <div className="relative">
                    <Fingerprint className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input name="nin" value={formData.nin} onChange={handleChange} className={`${inputClasses(!!errors.nin)} pl-14`} placeholder="13 à 15 chiffres" />
                  </div>
                  <ErrorLabel name="nin" />
                </div>
                <div className="space-y-2 group">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-2">Date de Naissance *</label>
                  <div className="relative">
                    <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input type="date" name="dateNaissance" max={maxDateString} value={formData.dateNaissance} onChange={handleChange} className={`${inputClasses(!!errors.dateNaissance)} pl-14`} />
                  </div>
                  <ErrorLabel name="dateNaissance" />
                </div>
                <div className="space-y-2 group">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-2">Email Institutionnel *</label>
                  <div className="relative">
                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input type="email" name="email" value={formData.email} onChange={handleChange} className={`${inputClasses(!!errors.email)} pl-14`} placeholder="moussa.diop@bambey.sn" />
                  </div>
                  <ErrorLabel name="email" />
                </div>
                <div className="space-y-2 group">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-2">Téléphone WhatsApp *</label>
                  <div className="relative">
                    <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input name="telephone" value={formData.telephone} onChange={handleChange} className={`${inputClasses(!!errors.telephone)} pl-14`} placeholder="770000000" />
                  </div>
                  <ErrorLabel name="telephone" />
                </div>
                <div className="space-y-2 group">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-2">Mot de passe *</label>
                  <div className="relative">
                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input type="password" name="password" value={formData.password} onChange={handleChange} className={`${inputClasses(!!errors.password)} pl-14`} placeholder="Min. 6 caractères" />
                  </div>
                  <ErrorLabel name="password" />
                </div>
                <div className="space-y-2 group">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-2">Confirmer le mot de passe *</label>
                  <div className="relative">
                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className={`${inputClasses(!!errors.confirmPassword)} pl-14`} placeholder="Répétez le mot de passe" />
                  </div>
                  <ErrorLabel name="confirmPassword" />
                </div>
              </div>
            </section>

            {/* SECTION 2: CURSUS */}
            <section>
              <SectionHeader 
                icon={School} 
                title="2. Parcours Académique" 
                subtitle="Renseignez votre cursus actuel pour bénéficier d'un accompagnement pédagogique adapté à votre niveau."
                colorClass="bg-aerkm-gold shadow-aerkm-gold/20"
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">UFR / Institut *</label>
                  <select name="ufr" value={formData.ufr} onChange={handleChange} className={inputClasses(false)}>
                    {UFR_LIST.map(u => <option key={u} value={u}>{u.split('(')[0]}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Filière *</label>
                  <select name="filiere" value={formData.filiere} onChange={handleChange} className={inputClasses(false)}>
                    {(ACADEMIC_STRUCTURE[formData.ufr as keyof typeof ACADEMIC_STRUCTURE] || []).map(f => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Niveau *</label>
                  <select name="niveau" value={formData.niveau} onChange={handleChange} className={inputClasses(false)}>
                    {NIVEAUX.map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
              </div>
            </section>

            {/* SECTION 3: SÉCURITÉ */}
            <section className="bg-slate-50 dark:bg-slate-800/30 p-10 lg:p-14 rounded-[3.5rem] border border-slate-100 dark:border-slate-800/50 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5 text-aerkm-blue">
                <ShieldCheck size={150} />
              </div>
              <SectionHeader 
                icon={ShieldQuestion} 
                title="3. Sécurité & Récupération" 
                subtitle="Sécurisez votre compte en répondant à 3 questions secrètes qui serviront exclusivement à la réinitialisation de votre accès."
                colorClass="bg-aerkm-blue shadow-aerkm-blue/20"
              />
              
              <div className="space-y-12 relative z-10">
                {formData.securityQuestions.map((sq, idx) => (
                  <div key={idx} className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-end animate-in fade-in slide-in-from-left-4 duration-500" style={{ animationDelay: `${idx * 150}ms` }}>
                    <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                      <p className="text-[8px] font-black text-aerkm-gold uppercase tracking-[0.3em] mb-2">Question #{idx + 1}</p>
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{sq.question}</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-2">Votre Réponse Secrète *</label>
                      <input 
                        type="text"
                        value={sq.answer}
                        onChange={(e) => handleSecurityAnswerChange(idx, e.target.value)}
                        className={inputClasses(!!errors[`securityQuestions.${idx}`])}
                        placeholder="Réponse confidentielle"
                      />
                      <ErrorLabel name={`securityQuestions.${idx}`} />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* SECTION 4: TUTEUR */}
            <section>
              <SectionHeader 
                icon={Users} 
                title="4. Coordonnées & Tuteur" 
                subtitle="Fournissez les contacts de votre tuteur pour assurer une communication fluide avec le bureau en cas d'urgence."
                colorClass="bg-aerkm-brownLight"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                <div className="md:col-span-2 space-y-2 group">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-2">Nom Complet du Tuteur *</label>
                  <input name="tuteur.nom" value={formData.tuteur.nom} onChange={handleChange} className={inputClasses(!!errors['tuteur.nom'])} placeholder="Adama FALL" />
                  <ErrorLabel name="tuteur.nom" />
                </div>
                <div className="space-y-2 group">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-2">Téléphone Tuteur *</label>
                  <input name="tuteur.telephone" value={formData.tuteur.telephone} onChange={handleChange} className={inputClasses(!!errors['tuteur.telephone'])} placeholder="771234567" />
                  <ErrorLabel name="tuteur.telephone" />
                </div>
                <div className="space-y-2 group">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-2">Email Tuteur (Facultatif)</label>
                  <input type="email" name="tuteur.email" value={formData.tuteur.email} onChange={handleChange} className={inputClasses(!!errors['tuteur.email'])} placeholder="tuteur@email.com" />
                  <ErrorLabel name="tuteur.email" />
                </div>
              </div>
            </section>

            {/* SECTION 5: SOCIAL & SANTÉ */}
            <section className="bg-slate-900 dark:bg-slate-950 p-10 lg:p-14 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <Heart size={150} />
              </div>
              <SectionHeader 
                icon={Heart} 
                title="5. Situation Sociale & Santé" 
                subtitle="Indiquez vos besoins spécifiques afin que l'amicale puisse vous proposer une aide sociale ou médicale sur mesure."
                colorClass="bg-red-500 shadow-red-500/20"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
                <div className="bg-white/5 backdrop-blur-md p-8 rounded-[2.5rem] border border-white/10 group cursor-pointer hover:border-aerkm-gold transition-all">
                  <label className="flex items-center justify-between cursor-pointer">
                    <div className="flex flex-col">
                      <span className="font-black text-sm text-white uppercase tracking-tight">Logement Amicale</span>
                      <span className="text-[9px] text-blue-200 uppercase font-bold mt-1">Je suis logé par l'amicale</span>
                    </div>
                    <div className="relative">
                      <input type="checkbox" checked={formData.logementAmicale} onChange={e => setFormData({...formData, logementAmicale: e.target.checked})} className="peer sr-only" />
                      <div className="w-14 h-8 bg-white/10 rounded-full peer-checked:bg-aerkm-gold transition-colors"></div>
                      <div className="absolute top-1 left-1 w-6 h-6 bg-white rounded-full peer-checked:translate-x-6 transition-transform shadow-xl"></div>
                    </div>
                  </label>
                </div>

                <div className="bg-white/5 backdrop-blur-md p-8 rounded-[2.5rem] border border-white/10 group cursor-pointer hover:border-red-400 transition-all">
                  <label className="flex items-center justify-between cursor-pointer">
                    <div className="flex flex-col">
                      <span className="font-black text-sm text-white uppercase tracking-tight">Besoin Spécifique</span>
                      <span className="text-[9px] text-blue-200 uppercase font-bold mt-1">Santé ou Handicap</span>
                    </div>
                    <div className="relative">
                      <input type="checkbox" checked={formData.maladieHandicap} onChange={e => setFormData({...formData, maladieHandicap: e.target.checked})} className="peer sr-only" />
                      <div className="w-14 h-8 bg-white/10 rounded-full peer-checked:bg-red-500 transition-colors"></div>
                      <div className="absolute top-1 left-1 w-6 h-6 bg-white rounded-full peer-checked:translate-x-6 transition-transform shadow-xl"></div>
                    </div>
                  </label>
                </div>

                {formData.maladieHandicap && (
                  <div className="md:col-span-2 space-y-2 animate-in slide-in-from-top-4 duration-500">
                    <label className="text-[10px] font-black text-blue-200 uppercase tracking-widest ml-2">Précisez votre situation médicale *</label>
                    <textarea 
                      name="typeMaladieHandicap" 
                      value={formData.typeMaladieHandicap} 
                      onChange={handleChange} 
                      className="w-full px-6 py-4 bg-white/10 border-2 border-white/10 rounded-3xl outline-none focus:border-red-400 transition-all font-bold text-white placeholder:text-white/20"
                      placeholder="Détaillez pour une meilleure prise en charge..."
                      rows={3}
                    />
                  </div>
                )}
              </div>
            </section>

            {/* FINAL STEP: CAPTCHA */}
            <section className="bg-slate-50 dark:bg-slate-800/20 p-10 lg:p-14 rounded-[3.5rem] border border-slate-100 dark:border-slate-800 border-dashed">
              <div className="flex flex-col md:flex-row items-center justify-between gap-10">
                <div className="flex items-center space-x-6">
                  <div className="w-16 h-16 bg-aerkm-gold text-aerkm-blue rounded-[1.8rem] flex items-center justify-center shadow-xl shadow-aerkm-gold/20 shrink-0">
                    <Sparkles size={32} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Dernière vérification</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Sécurité anti-robot</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-6 flex-1 max-w-lg">
                  <div className="px-8 py-5 bg-white dark:bg-slate-900 rounded-[1.8rem] shadow-sm border border-slate-100 dark:border-slate-800 flex items-center justify-center shrink-0">
                    <span className="text-2xl font-black text-aerkm-blue dark:text-aerkm-gold tracking-tighter">{captcha.question} = ?</span>
                  </div>
                  <div className="flex-1 w-full relative">
                     <input 
                        type="number" 
                        value={userCaptcha} 
                        onChange={e => setUserCaptcha(e.target.value)} 
                        className={inputClasses(!!captchaError)} 
                        placeholder="Résultat" 
                      />
                      {captchaError && <p className="absolute -bottom-6 left-2 text-red-500 text-[9px] font-black uppercase tracking-wide">{captchaError}</p>}
                  </div>
                </div>
              </div>
            </section>

            {/* SUBMIT BUTTON */}
            <div className="pt-8">
              <button 
                type="submit" 
                disabled={loading} 
                className="group w-full bg-aerkm-brown hover:bg-aerkm-brownLight text-white font-black py-8 rounded-[2.5rem] shadow-3xl shadow-aerkm-brown/30 transition-all transform hover:scale-[1.01] active:scale-95 flex items-center justify-center space-x-6 uppercase tracking-[0.3em] text-sm disabled:opacity-50 disabled:pointer-events-none overflow-hidden relative"
              >
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                {loading ? (
                  <Loader2 className="animate-spin" size={32} />
                ) : (
                  <>
                    <ClipboardCheck size={32} />
                    <span>SOUMETTRE MON RECENSEMENT</span>
                    <ChevronRight size={24} className="group-hover:translate-x-2 transition-transform" />
                  </>
                )}
              </button>
              <p className="text-center mt-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                En validant, vous acceptez les statuts de l'AERKM et la charte de confidentialité.
              </p>
            </div>
          </form>
        </div>
      </div>
      
      {/* Decorative footer element */}
      <div className="h-24"></div>
    </div>
  );
};

export default Inscription;