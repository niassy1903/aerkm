
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
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
  Calendar
} from 'lucide-react';

const Inscription: React.FC = () => {
  const { registerStudent } = useAuth();
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Calcul de la date maximum autorisée (Aujourd'hui - 18 ans)
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
    anneeUniversitaire: '2024-2025',
    telephone: '',
    email: '',
    nin: '',
    tuteur: '',
    maladieHandicap: false,
    typeMaladieHandicap: '',
    logementAmicale: false
  });

  useEffect(() => {
    const defaultFiliere = ACADEMIC_STRUCTURE[formData.ufr as keyof typeof ACADEMIC_STRUCTURE][0];
    setFormData(prev => ({ ...prev, filiere: defaultFiliere }));
  }, [formData.ufr]);

  const validateField = (name: string, value: any) => {
    let error = '';
    if (name === 'nin') {
      if (!/^\d{13,15}$/.test(value)) error = 'Le NIN doit comporter 13 à 15 chiffres.';
    }
    if (name === 'telephone') {
      if (!/^(77|78|70|76|33)\d{7}$/.test(value)) error = 'Numéro de téléphone invalide.';
    }
    if (name === 'email') {
      if (!/\S+@\S+\.\S+/.test(value)) error = 'Format email invalide.';
    }
    if (name === 'dateNaissance' && value) {
      const birthDate = new Date(value);
      const ageLimitDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
      if (birthDate > ageLimitDate) {
        error = 'Âge minimum requis : 18 ans pour être recensé.';
      }
    }
    if (name === 'typeMaladieHandicap' && formData.maladieHandicap && value.trim() === '') {
      error = 'Veuillez préciser la nature de votre situation.';
    }
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const finalValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData(prev => ({ ...prev, [name]: finalValue }));
    validateField(name, finalValue);
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
    const newErrors: Record<string, string> = {};
    
    ['nom', 'prenom', 'email', 'telephone', 'nin', 'tuteur', 'dateNaissance'].forEach(key => {
      if (!(formData as any)[key].toString().trim()) newErrors[key] = 'Obligatoire';
    });

    // Re-valider l'âge au submit
    if (formData.dateNaissance) {
      const birthDate = new Date(formData.dateNaissance);
      if (birthDate > new Date(today.getFullYear() - 18, today.getMonth(), today.getDate())) {
        newErrors.dateNaissance = 'Âge insuffisant (min. 18 ans)';
      }
    }

    if (formData.maladieHandicap && !formData.typeMaladieHandicap.trim()) {
      newErrors.typeMaladieHandicap = 'Obligatoire si déclaré';
    }

    if (Object.values(errors).some(e => e !== '') || Object.keys(newErrors).length > 0) {
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
    }
    setLoading(false);
  };

  const inputClasses = (hasError: boolean) => `
    w-full px-6 py-4 bg-white dark:bg-slate-800/50 
    border border-slate-200 dark:border-slate-700 
    rounded-2xl outline-none transition-all duration-300
    placeholder:text-slate-300 dark:placeholder:text-slate-600
    font-bold text-slate-700 dark:text-slate-200
    shadow-[0_2px_10px_rgba(0,0,0,0.02)]
    focus:shadow-[0_10px_25px_rgba(30,58,138,0.08)]
    focus:border-aerkm-blue dark:focus:border-aerkm-gold
    focus:ring-4 focus:ring-aerkm-blue/5 dark:focus:ring-aerkm-gold/5
    ${hasError ? 'border-red-400 ring-4 ring-red-50' : ''}
  `;

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-6 transition-colors duration-500">
        <div className="max-w-md w-full bg-white dark:bg-slate-900 p-10 rounded-[3rem] shadow-3xl text-center border border-slate-100 dark:border-slate-800">
          <div className="w-20 h-20 bg-green-50 dark:bg-green-950/30 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={48} />
          </div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4 tracking-tighter">Recensement Validé !</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed font-medium">Vos informations ont été transmises avec succès. Bienvenue dans la communauté.</p>
          <div className="flex space-x-2 justify-center">
            <div className="w-2 h-2 bg-aerkm-blue dark:bg-aerkm-gold rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-aerkm-blue dark:bg-aerkm-gold rounded-full animate-bounce delay-100"></div>
            <div className="w-2 h-2 bg-aerkm-blue dark:bg-aerkm-gold rounded-full animate-bounce delay-200"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden transition-colors duration-500">
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-40">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-aerkm-blue/5 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-aerkm-brown/5 rounded-full blur-[80px]"></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="mb-10 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 text-aerkm-blue dark:text-white font-black text-[10px] uppercase tracking-[0.2em] group">
            <div className="w-10 h-10 bg-white dark:bg-slate-900 shadow-xl rounded-2xl flex items-center justify-center border border-slate-100 dark:border-slate-800 group-hover:-translate-x-1 transition-transform">
              <ArrowLeft size={16} />
            </div>
            <span>Retour</span>
          </Link>
          <div className="hidden sm:flex items-center space-x-2 bg-aerkm-gold/10 px-4 py-2 rounded-xl text-aerkm-brown dark:text-aerkm-gold text-[9px] font-black uppercase tracking-widest border border-aerkm-gold/20">
            <Activity size={14} />
            <span>Session 2024-2025</span>
          </div>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">Formulaire de Recensement</h1>
          <p className="mt-4 text-slate-400 font-bold uppercase text-[9px] tracking-[0.4em]">Amicale des Étudiants de Keur Massar à Bambey</p>
        </div>

        <div className="bg-white dark:bg-slate-900 shadow-[0_40px_100px_rgba(0,0,0,0.04)] dark:shadow-none rounded-[3.5rem] overflow-hidden border border-slate-100 dark:border-slate-800 transition-colors">
          <div className="bg-aerkm-blue p-10 text-white flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="p-4 bg-white/10 rounded-2xl border border-white/20 shadow-2xl">
                <ClipboardCheck size={36} className="text-aerkm-gold" />
              </div>
              <div className="flex items-center gap-3">
              <img
                src="/assets/logo.jpg"
                alt="Logo"
                className="w-12 h-12 object-contain"
              />

              <div>
                <h2 className="text-2xl font-black uppercase tracking-tight">
                  Dossier de Membre
                </h2>
                <p className="text-blue-100/50 text-[10px] font-black uppercase tracking-[0.2em] mt-1">
                  Données sécurisées & cryptées
                </p>
              </div>
            </div>

            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-8 lg:p-14 space-y-16">
            
            {/* 1. Identité */}
            <section className="space-y-10">
              <div className="flex items-center space-x-4 border-b border-slate-50 dark:border-slate-800 pb-4">
                <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-aerkm-brown">
                  <User size={18} />
                </div>
                <h3 className="font-black text-[11px] uppercase tracking-[0.2em] text-slate-400">Identité & NIN</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-2">Prénom</label>
                  <input 
                    name="prenom" 
                    required 
                    placeholder="Ex: Moussa"
                    value={formData.prenom} 
                    onChange={handleChange} 
                    className={inputClasses(!!errors.prenom)} 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-2">Nom</label>
                  <input 
                    name="nom" 
                    required 
                    placeholder="Ex: DIOP"
                    value={formData.nom} 
                    onChange={handleChange} 
                    className={inputClasses(!!errors.nom)} 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-2">Numéro NIN</label>
                  <div className="relative group">
                    <Fingerprint className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-600 transition-colors group-focus-within:text-aerkm-blue dark:group-focus-within:text-aerkm-gold" size={18} />
                    <input 
                      name="nin" 
                      required 
                      value={formData.nin} 
                      onChange={handleChange} 
                      placeholder="13 à 15 chiffres" 
                      className={`${inputClasses(!!errors.nin)} pl-14`} 
                    />
                  </div>
                  {errors.nin && <p className="text-[9px] text-red-500 font-bold uppercase ml-2 mt-1">{errors.nin}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-2">Date de Naissance (Min. 18 ans)</label>
                  <div className="relative group">
                    <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-600 transition-colors group-focus-within:text-aerkm-blue dark:group-focus-within:text-aerkm-gold" size={18} />
                    <input 
                      type="date" 
                      name="dateNaissance" 
                      required 
                      max={maxDateString}
                      value={formData.dateNaissance} 
                      onChange={handleChange} 
                      className={`${inputClasses(!!errors.dateNaissance)} pl-14`} 
                    />
                  </div>
                  {errors.dateNaissance && <p className="text-[9px] text-red-500 font-bold uppercase ml-2 mt-1">{errors.dateNaissance}</p>}
                </div>
              </div>
            </section>

            {/* 2. Cursus */}
            <section className="space-y-10">
              <div className="flex items-center space-x-4 border-b border-slate-50 dark:border-slate-800 pb-4">
                <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-aerkm-gold">
                  <School size={18} />
                </div>
                <h3 className="font-black text-[11px] uppercase tracking-[0.2em] text-slate-400">Cursus Universitaire</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-2">UFR</label>
                  <select 
                    name="ufr" 
                    value={formData.ufr} 
                    onChange={handleChange} 
                    className={`${inputClasses(false)} appearance-none cursor-pointer`}
                  >
                    {UFR_LIST.map(u => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-2">Filière</label>
                  <select 
                    name="filiere" 
                    value={formData.filiere} 
                    onChange={handleChange} 
                    className={`${inputClasses(false)} appearance-none cursor-pointer`}
                  >
                    {ACADEMIC_STRUCTURE[formData.ufr as keyof typeof ACADEMIC_STRUCTURE].map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-2">Niveau d'étude</label>
                  <select 
                    name="niveau" 
                    value={formData.niveau} 
                    onChange={handleChange} 
                    className={`${inputClasses(false)} appearance-none cursor-pointer`}
                  >
                    {NIVEAUX.map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-2">Sexe</label>
                  <div className="flex p-1 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
                    <button type="button" onClick={() => setFormData({...formData, sexe: 'M'})} className={`flex-1 py-3 rounded-xl text-[10px] font-black transition-all ${formData.sexe === 'M' ? 'bg-white dark:bg-slate-700 text-aerkm-blue dark:text-white shadow-sm' : 'text-slate-400'}`}>MASCULIN</button>
                    <button type="button" onClick={() => setFormData({...formData, sexe: 'F'})} className={`flex-1 py-3 rounded-xl text-[10px] font-black transition-all ${formData.sexe === 'F' ? 'bg-white dark:bg-slate-700 text-pink-500 shadow-sm' : 'text-slate-400'}`}>FÉMININ</button>
                  </div>
                </div>
              </div>
            </section>

            {/* 3. Santé & Logement */}
            <section className="space-y-10 bg-slate-50 dark:bg-slate-800/30 p-8 lg:p-12 rounded-[3rem] border border-slate-100 dark:border-slate-800/50 transition-colors">
              <div className="flex items-center space-x-4 border-b border-white dark:border-slate-800 pb-4">
                <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 flex items-center justify-center text-red-500">
                  <Activity size={18} />
                </div>
                <h3 className="font-black text-[11px] uppercase tracking-[0.2em] text-slate-400">Social & Santé</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-2">Pathologie ou Handicap ?</label>
                  <div className="flex p-1 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 w-fit">
                    <button type="button" onClick={() => handleToggle('maladieHandicap', true)} className={`px-8 py-3 rounded-xl text-[10px] font-black transition-all ${formData.maladieHandicap ? 'bg-red-500 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}>OUI</button>
                    <button type="button" onClick={() => handleToggle('maladieHandicap', false)} className={`px-8 py-3 rounded-xl text-[10px] font-black transition-all ${!formData.maladieHandicap ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-400' : 'text-slate-400 hover:text-slate-600'}`}>NON</button>
                  </div>
                  
                  {formData.maladieHandicap && (
                    <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
                      <div className="relative group">
                        <Stethoscope className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-600" size={18} />
                        <input 
                          name="typeMaladieHandicap" 
                          required 
                          value={formData.typeMaladieHandicap} 
                          onChange={handleChange} 
                          placeholder="Précisez la nature..." 
                          className={`${inputClasses(!!errors.typeMaladieHandicap)} pl-14 bg-white dark:bg-slate-900`} 
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-2">Logement de l'Amicale ?</label>
                  <div className="flex p-1 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 w-fit">
                    <button type="button" onClick={() => handleToggle('logementAmicale', true)} className={`px-8 py-3 rounded-xl text-[10px] font-black transition-all ${formData.logementAmicale ? 'bg-aerkm-blue dark:bg-aerkm-gold text-white dark:text-slate-900 shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}>OUI</button>
                    <button type="button" onClick={() => handleToggle('logementAmicale', false)} className={`px-8 py-3 rounded-xl text-[10px] font-black transition-all ${!formData.logementAmicale ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-400' : 'text-slate-400 hover:text-slate-600'}`}>NON</button>
                  </div>
                  <p className="text-[9px] text-slate-400 font-bold italic flex items-center ml-2">
                    <Home size={10} className="mr-1.5" />
                    Appartements loués officiellement par l'AERKM.
                  </p>
                </div>
              </div>
            </section>

            {/* 4. Contact & Tuteur */}
            <section className="space-y-10">
              <div className="flex items-center space-x-4 border-b border-slate-50 dark:border-slate-800 pb-4">
                <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-aerkm-blue dark:text-white">
                  <Users size={18} />
                </div>
                <h3 className="font-black text-[11px] uppercase tracking-[0.2em] text-slate-400">Contacts & Tuteur</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-2">Responsable / Tuteur (Nom Complet)</label>
                  <input 
                    name="tuteur" 
                    required 
                    value={formData.tuteur} 
                    onChange={handleChange} 
                    placeholder="Personne à contacter en cas d'urgence" 
                    className={inputClasses(false)} 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-2">Téléphone (WhatsApp)</label>
                  <div className="relative group">
                    <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-600 transition-colors group-focus-within:text-aerkm-blue dark:group-focus-within:text-aerkm-gold" size={18} />
                    <input 
                      name="telephone" 
                      required 
                      value={formData.telephone} 
                      onChange={handleChange} 
                      placeholder="Ex: 77 123 45 67" 
                      className={`${inputClasses(!!errors.telephone)} pl-14`} 
                    />
                  </div>
                  {errors.telephone && <p className="text-[9px] text-red-500 font-bold uppercase ml-2 mt-1">{errors.telephone}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-2">Email Personnel</label>
                  <div className="relative group">
                    <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-600 transition-colors group-focus-within:text-aerkm-blue dark:group-focus-within:text-aerkm-gold" size={18} />
                    <input 
                      type="email" 
                      name="email" 
                      required 
                      value={formData.email} 
                      onChange={handleChange} 
                      placeholder="exemple@email.com" 
                      className={`${inputClasses(!!errors.email)} pl-14`} 
                    />
                  </div>
                  {errors.email && <p className="text-[9px] text-red-500 font-bold uppercase ml-2 mt-1">{errors.email}</p>}
                </div>
              </div>
            </section>

            <div className="pt-10">
              <button 
                type="submit" 
                disabled={loading} 
                className="w-full bg-aerkm-brown hover:bg-aerkm-brownLight text-white font-black py-7 px-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(120,53,15,0.25)] transition-all transform hover:scale-[1.01] active:scale-95 flex items-center justify-center space-x-4 uppercase tracking-[0.2em] text-xs disabled:opacity-50 disabled:pointer-events-none"
              >
                {loading ? (
                  <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <ClipboardCheck size={24} />
                    <span>SOUMETTRE MON RECENSEMENT</span>
                  </>
                )}
              </button>
              <p className="text-center mt-6 text-[9px] text-slate-400 font-bold uppercase tracking-widest">
                En cliquant sur soumettre, vous certifiez l'exactitude des informations fournies.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Inscription;