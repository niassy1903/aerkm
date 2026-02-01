
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/StudentContext';
import { Etudiant } from '../../types';
import { 
  User, 
  Phone, 
  Mail, 
  Save, 
  Shield, 
  BadgeCheck, 
  Stethoscope, 
  Home, 
  Activity, 
  CheckCircle2, 
  Loader2,
  AlertCircle,
  Briefcase,
  GraduationCap,
  Fingerprint,
  Smartphone,
  Lock
} from 'lucide-react';

const Profil: React.FC = () => {
  const { user, updateSessionUser } = useAuth();
  const { updateStudent } = useData();
  const student = user as Etudiant;
  
  const [formData, setFormData] = useState({
    telephone: student?.telephone || '',
    email: student?.email || '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (student) {
      setFormData({
        telephone: student.telephone || '',
        email: student.email || '',
      });
    }
  }, [student]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const updatedStudentData = { ...student, ...formData };
      await updateStudent(updatedStudentData);
      updateSessionUser(updatedStudentData);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch (err) {
      setError("Une erreur est survenue lors de la mise à jour.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!student) return null;

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-500">
      <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in duration-700">
        
        {/* Header Profile - Impactful & Professional */}
        <div className="bg-white dark:bg-slate-900 rounded-[3rem] shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden relative">
          <div className="h-32 bg-gradient-to-r from-aerkm-blue to-blue-600 opacity-90"></div>
          <div className="px-10 pb-10 flex flex-col md:flex-row items-end gap-6 -mt-12">
            <div className="relative">
              <div className="w-32 h-32 bg-white dark:bg-slate-800 p-1.5 rounded-[2.5rem] shadow-2xl">
                <div className="w-full h-full bg-aerkm-blue text-white rounded-[2rem] flex items-center justify-center text-4xl font-black">
                  {student.prenom[0]}{student.nom[0]}
                </div>
              </div>
              <div className="absolute bottom-1 right-1 bg-green-500 text-white p-2 rounded-2xl border-4 border-white dark:border-slate-900 shadow-lg">
                <BadgeCheck size={20} />
              </div>
            </div>
            <div className="flex-1 mb-2">
              <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
                {student.prenom} {student.nom}
              </h1>
              <div className="flex items-center space-x-3 mt-1 text-slate-400 dark:text-slate-500 font-bold text-xs uppercase tracking-widest">
                <span className="flex items-center"><GraduationCap size={14} className="mr-1.5" /> {student.niveau}</span>
                <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                <span>Matricule: {student.numeroRecensement}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Feedback Area */}
        {success && (
          <div className="bg-green-500 text-white p-5 rounded-3xl flex items-center space-x-4 shadow-xl shadow-green-500/20 animate-in slide-in-from-top-4">
            <CheckCircle2 size={24} />
            <p className="font-black text-xs uppercase tracking-widest">Vos informations ont été mises à jour avec succès.</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          <div className="lg:col-span-2 space-y-10">
            {/* Form Card */}
            <div className="bg-white dark:bg-slate-900 rounded-[3.5rem] p-10 lg:p-12 shadow-sm border border-slate-100 dark:border-slate-800">
              <div className="flex items-center space-x-4 mb-10 pb-6 border-b border-slate-50 dark:border-slate-800">
                <div className="w-12 h-12 rounded-2xl bg-aerkm-blue/5 text-aerkm-blue dark:text-aerkm-gold flex items-center justify-center">
                  <Smartphone size={24} />
                </div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Mettre à jour mes coordonnées</h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3 group">
                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-2 group-focus-within:text-aerkm-blue transition-colors">Téléphone WhatsApp</label>
                    <div className="relative">
                      <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                      <input 
                        type="tel" required
                        className="w-full pl-14 pr-6 py-5 bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-100 dark:border-slate-700 rounded-[2rem] outline-none focus:border-aerkm-blue focus:bg-white dark:focus:bg-slate-800 transition-all font-bold text-slate-800 dark:text-white" 
                        value={formData.telephone} 
                        onChange={e => setFormData({...formData, telephone: e.target.value})} 
                      />
                    </div>
                  </div>
                  <div className="space-y-3 group">
                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-2 group-focus-within:text-aerkm-blue transition-colors">Email Personnel</label>
                    <div className="relative">
                      <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                      <input 
                        type="email" required
                        className="w-full pl-14 pr-6 py-5 bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-100 dark:border-slate-700 rounded-[2rem] outline-none focus:border-aerkm-blue focus:bg-white dark:focus:bg-slate-800 transition-all font-bold text-slate-800 dark:text-white" 
                        value={formData.email} 
                        onChange={e => setFormData({...formData, email: e.target.value})} 
                      />
                    </div>
                  </div>
                </div>
                <button 
                  type="submit" disabled={loading}
                  className="w-full bg-aerkm-blue hover:bg-blue-800 text-white font-black py-6 rounded-[2rem] shadow-2xl shadow-aerkm-blue/20 transition-all transform hover:scale-[1.01] active:scale-95 flex items-center justify-center space-x-4 uppercase tracking-[0.3em] text-xs disabled:opacity-50"
                >
                  {loading ? <Loader2 className="animate-spin" size={24} /> : <Save size={24} />}
                  <span>{loading ? 'Enregistrement...' : 'Sauvegarder les modifications'}</span>
                </button>
              </form>
            </div>

            {/* Situation Sociale Card */}
            <div className="bg-white dark:bg-slate-900 rounded-[3.5rem] p-10 lg:p-12 shadow-sm border border-slate-100 dark:border-slate-800">
              <div className="flex items-center space-x-4 mb-10 pb-6 border-b border-slate-50 dark:border-slate-800">
                <div className="w-12 h-12 rounded-2xl bg-aerkm-brown/5 text-aerkm-brown dark:text-aerkm-gold flex items-center justify-center">
                  <Activity size={24} />
                </div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Situation Sociale & Santé</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className={`p-8 rounded-[2.5rem] border ${student.maladieHandicap ? 'bg-red-50/50 border-red-100 text-red-700' : 'bg-green-50/50 border-green-100 text-green-700'}`}>
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 shadow-sm ${student.maladieHandicap ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}>
                    <Activity size={24} />
                  </div>
                  <p className="text-[10px] font-black opacity-60 uppercase tracking-widest mb-1">Dossier Médical</p>
                  <h4 className="text-lg font-black">{student.maladieHandicap ? 'Besoin de suivi spécifique' : 'Aucune pathologie déclarée'}</h4>
                  {student.maladieHandicap && (
                    <p className="mt-3 text-xs font-bold flex items-center">
                      <Stethoscope size={14} className="mr-2" /> {student.typeMaladieHandicap}
                    </p>
                  )}
                </div>

                <div className={`p-8 rounded-[2.5rem] border ${student.logementAmicale ? 'bg-blue-50/50 border-blue-100 text-aerkm-blue' : 'bg-slate-50 border-slate-100 text-slate-500'}`}>
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 shadow-sm ${student.logementAmicale ? 'bg-aerkm-blue text-white' : 'bg-slate-200 text-slate-400'}`}>
                    <Home size={24} />
                  </div>
                  <p className="text-[10px] font-black opacity-60 uppercase tracking-widest mb-1">Hébergement</p>
                  <h4 className="text-lg font-black">{student.logementAmicale ? 'Logé par l\'Amicale' : 'Logement Personnel'}</h4>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-10">
            {/* Admin Folder */}
            <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-10 shadow-sm border border-slate-100 dark:border-slate-800">
               <h3 className="text-sm font-black text-aerkm-blue dark:text-aerkm-gold uppercase tracking-widest mb-8 flex items-center">
                 <Shield size={18} className="mr-3" /> Dossier Admin
               </h3>
               <div className="space-y-8">
                 {[
                   { label: "UFR", value: student.ufr, icon: <GraduationCap size={16} /> },
                   { label: "Filière", value: student.filiere, icon: <Briefcase size={16} /> },
                   { label: "Niveau", value: student.niveau, icon: <Fingerprint size={16} /> },
                   { label: "Tuteur", value: student.tuteur?.nom || 'N/A', icon: <User size={16} /> },
                 ].map((item, i) => (
                   <div key={i} className="flex items-start space-x-4">
                     <div className="mt-1 text-slate-300">{item.icon}</div>
                     <div>
                       <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{item.label}</p>
                       <p className="text-xs font-black text-slate-700 dark:text-slate-200 uppercase leading-snug mt-0.5">{item.value}</p>
                     </div>
                   </div>
                 ))}
               </div>
            </div>

            {/* Security Card */}
            <div className="bg-[#0a192f] rounded-[3rem] p-10 text-white relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:scale-110 transition-transform duration-700">
                 <Shield size={150} />
               </div>
               <h3 className="text-2xl font-black tracking-tighter mb-4 relative z-10">Sécurité</h3>
               <p className="text-blue-100/50 text-sm leading-relaxed mb-10 relative z-10">
                 Toutes vos informations sociales et médicales sont cryptées et traitées avec la plus stricte confidentialité.
               </p>
               <button className="w-full py-4 bg-white/5 border border-white/10 hover:bg-white/10 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all relative z-10">
                 Changer de mot de passe
               </button>
            </div>
          </div>
        </div>
      </div>
      <div className="h-20"></div>
    </div>
  );
};

export default Profil;