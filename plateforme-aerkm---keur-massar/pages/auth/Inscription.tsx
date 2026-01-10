
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
  Activity
} from 'lucide-react';

const Inscription: React.FC = () => {
  const { registerStudent } = useAuth();
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

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
    
    // Check required basic strings
    ['nom', 'prenom', 'email', 'telephone', 'nin', 'tuteur'].forEach(key => {
      if (!(formData as any)[key].trim()) newErrors[key] = 'Obligatoire';
    });

    if (formData.maladieHandicap && !formData.typeMaladieHandicap.trim()) {
      newErrors.typeMaladieHandicap = 'Obligatoire si vous avez déclaré une pathologie/handicap';
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

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
        <div className="max-w-md w-full bg-white p-10 rounded-3xl shadow-2xl text-center">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={48} />
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tighter">Recensement Validé !</h2>
          <p className="text-slate-600 mb-8 leading-relaxed font-medium">Vos informations ont été transmises avec succès. Redirection...</p>
          <div className="flex space-x-2 justify-center">
            <div className="w-2 h-2 bg-aerkm-blue rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-aerkm-blue rounded-full animate-bounce delay-100"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="mb-10">
          <Link to="/" className="flex items-center space-x-2 text-aerkm-blue font-black text-[10px] uppercase tracking-[0.2em] group">
            <div className="w-10 h-10 bg-white shadow-xl rounded-2xl flex items-center justify-center border border-slate-100 group-hover:-translate-x-1 transition-transform">
              <ArrowLeft size={16} />
            </div>
            <span>Accueil</span>
          </Link>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter">Fiche de Recensement</h1>
          <p className="mt-4 text-slate-500 font-bold uppercase text-[10px] tracking-[0.3em]">Communauté des Étudiants de Keur Massar</p>
        </div>

        <div className="bg-white shadow-3xl rounded-[3rem] overflow-hidden border border-slate-100">
          <div className="bg-aerkm-blue px-10 py-10 text-white flex items-center space-x-6">
            <div className="p-4 bg-white/10 rounded-2xl border border-white/20 shadow-2xl">
              <ClipboardCheck size={36} className="text-aerkm-gold" />
            </div>
            <div>
              <h2 className="text-2xl font-black uppercase tracking-tight">Inscription Officielle</h2>
              <p className="text-blue-100/60 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Données protégées</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-8 lg:p-14 space-y-16">
            
            {/* 1. Identité */}
            <section className="space-y-10">
              <div className="flex items-center space-x-4 border-b border-slate-100 pb-4">
                <User size={20} className="text-aerkm-brown" />
                <h3 className="font-black text-xs uppercase tracking-[0.2em] text-slate-400">Identité & NIN</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Prénom</label>
                  <input name="prenom" required value={formData.prenom} onChange={handleChange} className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-aerkm-blue outline-none font-bold" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Nom</label>
                  <input name="nom" required value={formData.nom} onChange={handleChange} className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-aerkm-blue outline-none font-bold" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">NIN</label>
                  <div className="relative group">
                    <Fingerprint className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input name="nin" required value={formData.nin} onChange={handleChange} placeholder="N° Identification National" className={`w-full pl-14 pr-6 py-4 bg-slate-50 border-2 rounded-2xl focus:border-aerkm-blue outline-none font-bold ${errors.nin ? 'border-red-400' : 'border-slate-100'}`} />
                  </div>
                  {errors.nin && <p className="text-[9px] text-red-500 font-bold uppercase ml-1">{errors.nin}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Date de Naissance</label>
                  <input type="date" name="dateNaissance" required value={formData.dateNaissance} onChange={handleChange} className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-aerkm-blue outline-none font-bold" />
                </div>
              </div>
            </section>

            {/* 2. Cursus */}
            <section className="space-y-10">
              <div className="flex items-center space-x-4 border-b border-slate-100 pb-4">
                <School size={20} className="text-aerkm-gold" />
                <h3 className="font-black text-xs uppercase tracking-[0.2em] text-slate-400">Cursus Universitaire</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">UFR</label>
                  <select name="ufr" value={formData.ufr} onChange={handleChange} className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none font-bold">
                    {UFR_LIST.map(u => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Filière</label>
                  <select name="filiere" value={formData.filiere} onChange={handleChange} className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none font-bold">
                    {ACADEMIC_STRUCTURE[formData.ufr as keyof typeof ACADEMIC_STRUCTURE].map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>
              </div>
            </section>

            {/* 3. Situation Santé & Logement (NOUVEAU) */}
            <section className="space-y-10 bg-slate-50/50 p-8 rounded-[2.5rem] border border-slate-100">
              <div className="flex items-center space-x-4 border-b border-white pb-4">
                <Activity size={20} className="text-red-500" />
                <h3 className="font-black text-xs uppercase tracking-[0.2em] text-slate-400">Santé & Logement</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Maladie / Handicap */}
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Avez-vous une maladie ou un handicap ?</label>
                  <div className="flex p-1 bg-white border border-slate-100 rounded-2xl w-fit">
                    <button type="button" onClick={() => handleToggle('maladieHandicap', true)} className={`px-8 py-3 rounded-xl text-xs font-black transition-all ${formData.maladieHandicap ? 'bg-red-500 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}>OUI</button>
                    <button type="button" onClick={() => handleToggle('maladieHandicap', false)} className={`px-8 py-3 rounded-xl text-xs font-black transition-all ${!formData.maladieHandicap ? 'bg-slate-200 text-slate-700' : 'text-slate-400 hover:text-slate-600'}`}>NON</button>
                  </div>
                  
                  {formData.maladieHandicap && (
                    <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
                      <label className="text-[10px] font-black text-red-500 uppercase tracking-widest ml-1">Précisez le type (Pathologie, Handicap...)</label>
                      <div className="relative group">
                        <Stethoscope className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                        <input name="typeMaladieHandicap" required value={formData.typeMaladieHandicap} onChange={handleChange} placeholder="Ex: Diabète, Handicap moteur..." className={`w-full pl-14 pr-6 py-4 bg-white border-2 rounded-2xl outline-none font-bold ${errors.typeMaladieHandicap ? 'border-red-400' : 'border-slate-100 focus:border-red-400'}`} />
                      </div>
                      {errors.typeMaladieHandicap && <p className="text-[9px] text-red-500 font-bold uppercase ml-1">{errors.typeMaladieHandicap}</p>}
                    </div>
                  )}
                </div>

                {/* Logement */}
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Logez-vous dans un logement de l'Amicale ?</label>
                  <div className="flex p-1 bg-white border border-slate-100 rounded-2xl w-fit">
                    <button type="button" onClick={() => handleToggle('logementAmicale', true)} className={`px-8 py-3 rounded-xl text-xs font-black transition-all ${formData.logementAmicale ? 'bg-aerkm-blue text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}>OUI</button>
                    <button type="button" onClick={() => handleToggle('logementAmicale', false)} className={`px-8 py-3 rounded-xl text-xs font-black transition-all ${!formData.logementAmicale ? 'bg-slate-200 text-slate-700' : 'text-slate-400 hover:text-slate-600'}`}>NON</button>
                  </div>
                  <div className="flex items-center space-x-2 text-[10px] text-slate-400 italic">
                    <Home size={12} />
                    <span>Concerne uniquement les appartements loués par l'AERKM.</span>
                  </div>
                </div>
              </div>
            </section>

            {/* 4. Social & Tuteur */}
            <section className="space-y-10">
              <div className="flex items-center space-x-4 border-b border-slate-100 pb-4">
                <Users size={20} className="text-aerkm-blue" />
                <h3 className="font-black text-xs uppercase tracking-[0.2em] text-slate-400">Social & Tuteur</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Nom et Prénom du Tuteur</label>
                  <input name="tuteur" required value={formData.tuteur} onChange={handleChange} placeholder="Responsable légal" className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-aerkm-blue outline-none font-bold" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Téléphone (WhatsApp)</label>
                  <input name="telephone" required value={formData.telephone} onChange={handleChange} className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-aerkm-blue outline-none font-bold" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Email Personnel</label>
                  <input type="email" name="email" required value={formData.email} onChange={handleChange} className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-aerkm-blue outline-none font-bold" />
                </div>
              </div>
            </section>

            <div className="pt-10">
              <button type="submit" disabled={loading} className="w-full bg-aerkm-brown hover:bg-aerkm-brownLight text-white font-black py-7 px-10 rounded-[2.5rem] shadow-3xl shadow-aerkm-brown/30 transition-all transform hover:scale-[1.02] active:scale-95 flex items-center justify-center space-x-4 uppercase tracking-[0.2em] text-xs">
                {loading ? <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin"></div> : <> <ClipboardCheck size={24} /> <span>SOUMETTRE MON RECENSEMENT</span> </>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Inscription;
