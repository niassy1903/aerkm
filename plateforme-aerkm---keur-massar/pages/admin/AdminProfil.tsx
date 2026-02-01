
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/StudentContext';
import { User, Shield, Key, Mail, Camera, BadgeCheck, CheckCircle2, Loader2, AlertCircle, Save } from 'lucide-react';

const AdminProfil: React.FC = () => {
  const { user, updateSessionUser } = useAuth();
  const { updateAdmin } = useData();
  
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    prenom: user?.prenom || '',
    nom: user?.nom || '',
    email: user?.email || '',
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setShowSuccess(false);

    // Validations de base
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      setError("Les nouveaux mots de passe ne correspondent pas.");
      return;
    }

    setLoading(true);

    try {
      const updatePayload: any = {
        _id: user?._id || user?.id,
        prenom: formData.prenom,
        nom: formData.nom,
        email: formData.email,
      };

      // Si un nouveau mot de passe est saisi, on l'ajoute au payload
      if (formData.newPassword.trim() !== '') {
        updatePayload.password = formData.newPassword;
      }

      // 1. Mise à jour en base de données via le StudentContext
      await updateAdmin(updatePayload);

      // 2. Mise à jour de la session utilisateur locale (AuthContext)
      // pour que l'interface (Navbar, Sidebar) reflète les changements immédiatement
      updateSessionUser({
        ...user!,
        prenom: formData.prenom,
        nom: formData.nom,
        email: formData.email
      });

      setShowSuccess(true);
      
      // Réinitialiser les champs de mot de passe uniquement
      setFormData(prev => ({
        ...prev,
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));

      setTimeout(() => setShowSuccess(false), 4000);
    } catch (err) {
      console.error("Erreur profil:", err);
      setError("Une erreur est survenue lors de la mise à jour de vos informations.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 lg:p-12 max-w-5xl mx-auto space-y-12 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-aerkm-blue tracking-tighter uppercase leading-none">Mon Profil Admin</h1>
          <p className="text-slate-500 font-medium mt-2 italic">Gérez vos informations personnelles et votre sécurité d'accès.</p>
        </div>
        <div className="bg-aerkm-blue/5 border border-aerkm-blue/10 px-4 py-2 rounded-xl">
           <p className="text-[9px] font-black text-aerkm-blue uppercase tracking-widest">ID Système : {user?._id || user?.id}</p>
        </div>
      </div>

      {showSuccess && (
        <div className="bg-green-500 text-white p-5 rounded-2xl flex items-center space-x-4 shadow-xl shadow-green-500/20 animate-in slide-in-from-top-4">
           <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
             <CheckCircle2 size={20} />
           </div>
           <div>
             <p className="text-xs font-black uppercase tracking-widest leading-none">Profil mis à jour !</p>
             <p className="text-[10px] opacity-80 mt-1">Vos informations ont été enregistrées avec succès.</p>
           </div>
        </div>
      )}

      {error && (
        <div className="bg-red-500 text-white p-5 rounded-2xl flex items-center space-x-4 shadow-xl shadow-red-500/20 animate-in shake">
           <AlertCircle size={24} />
           <p className="text-xs font-black uppercase tracking-widest">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Column: Avatar & Role */}
        <div className="lg:col-span-1 space-y-8">
           <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-aerkm-blue to-aerkm-gold"></div>
              <div className="relative inline-block group mb-6">
                <div className="w-32 h-32 bg-aerkm-blue text-white rounded-[2.5rem] flex items-center justify-center text-4xl font-black shadow-2xl group-hover:scale-105 transition-all duration-500">
                  {formData.prenom?.[0]}{formData.nom?.[0]}
                </div>
                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-white shadow-xl rounded-2xl flex items-center justify-center border border-slate-100 text-slate-400 group-hover:text-aerkm-blue transition-colors cursor-not-allowed" title="Photo bientôt disponible">
                  <Camera size={18} />
                </div>
              </div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">{formData.prenom} {formData.nom}</h3>
              <div className="mt-4 inline-flex items-center px-5 py-2 bg-aerkm-gold/10 text-aerkm-brown border border-aerkm-gold/20 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
                 <Shield size={14} className="mr-2" />
                 Bureau Exécutif
              </div>
              <hr className="my-8 border-slate-50" />
              <div className="space-y-4 text-left">
                 <div className="flex items-center text-[11px] text-slate-500 font-bold bg-slate-50 p-3 rounded-xl border border-slate-100">
                   <BadgeCheck size={16} className="mr-3 text-green-500" />
                   <span>Accès Système Complet</span>
                 </div>
                 <div className="flex items-center text-[11px] text-slate-500 font-bold bg-slate-50 p-3 rounded-xl border border-slate-100">
                   <BadgeCheck size={16} className="mr-3 text-green-500" />
                   <span>Gestionnaire des Rapports</span>
                 </div>
              </div>
           </div>

           <div className="bg-[#0a192f] p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
             <div className="absolute -top-10 -right-10 p-6 opacity-5 group-hover:scale-110 transition-transform duration-700">
               <Shield size={200} />
             </div>
             <div className="relative z-10">
                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-aerkm-gold mb-6 border border-white/10">
                   <Shield size={24} />
                </div>
                <h4 className="font-black uppercase tracking-[0.2em] text-xs mb-4 text-blue-200">Sécurité Maximale</h4>
                <p className="text-sm font-medium leading-relaxed opacity-60">
                  Votre compte est protégé par des protocoles AES-256. Toute modification importante est enregistrée dans les journaux d'activité (Logs).
                </p>
             </div>
           </div>
        </div>

        {/* Right Column: Form */}
        <div className="lg:col-span-2">
           <form onSubmit={handleUpdate} className="bg-white p-8 lg:p-12 rounded-[3.5rem] shadow-sm border border-slate-100 space-y-12">
              <section className="space-y-8">
                <div className="flex items-center space-x-4 border-b border-slate-50 pb-5">
                   <div className="w-10 h-10 rounded-xl bg-blue-50 text-aerkm-blue flex items-center justify-center">
                      <User size={20} />
                   </div>
                   <h4 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">Informations Générales</h4>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2 group">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 group-focus-within:text-aerkm-blue transition-colors">Prénom</label>
                    <input 
                      type="text" required value={formData.prenom} 
                      onChange={e => setFormData({...formData, prenom: e.target.value})}
                      className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-aerkm-blue focus:bg-white transition-all font-bold text-slate-800 text-sm"
                    />
                  </div>
                  <div className="space-y-2 group">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 group-focus-within:text-aerkm-blue transition-colors">Nom</label>
                    <input 
                      type="text" required value={formData.nom} 
                      onChange={e => setFormData({...formData, nom: e.target.value})}
                      className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-aerkm-blue focus:bg-white transition-all font-bold text-slate-800 text-sm"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2 group">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 group-focus-within:text-aerkm-blue transition-colors">Email Professionnel</label>
                    <div className="relative">
                       <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                       <input 
                        type="email" required value={formData.email} 
                        onChange={e => setFormData({...formData, email: e.target.value})}
                        className="w-full pl-16 pr-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-aerkm-blue focus:bg-white transition-all font-bold text-slate-800 text-sm"
                       />
                    </div>
                  </div>
                </div>
              </section>

              <section className="space-y-8">
                <div className="flex items-center space-x-4 border-b border-slate-50 pb-5">
                   <div className="w-10 h-10 rounded-xl bg-aerkm-gold/10 text-aerkm-brown flex items-center justify-center">
                      <Key size={20} />
                   </div>
                   <h4 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">Modification du Mot de Passe</h4>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="md:col-span-2 space-y-2 group">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Nouveau mot de passe</label>
                    <div className="relative">
                       <Key className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                       <input 
                        type="password" value={formData.newPassword} 
                        onChange={e => setFormData({...formData, newPassword: e.target.value})}
                        className="w-full pl-16 pr-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-aerkm-blue focus:bg-white transition-all font-bold text-slate-800 text-sm"
                        placeholder="Laissez vide pour conserver l'actuel"
                       />
                    </div>
                  </div>
                  {formData.newPassword && (
                    <div className="md:col-span-2 space-y-2 group animate-in slide-in-from-top-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Confirmer le nouveau mot de passe</label>
                      <div className="relative">
                        <Key className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                        <input 
                          type="password" required={!!formData.newPassword} value={formData.confirmPassword} 
                          onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
                          className={`w-full pl-16 pr-6 py-4 bg-slate-50 border-2 ${formData.newPassword === formData.confirmPassword ? 'border-green-100 focus:border-green-500' : 'border-slate-100 focus:border-aerkm-blue'} rounded-2xl outline-none focus:bg-white transition-all font-bold text-slate-800 text-sm`}
                          placeholder="Répétez le nouveau mot de passe"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </section>

              <div className="pt-6">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="group w-full bg-aerkm-blue hover:bg-blue-800 text-white font-black py-6 rounded-[2rem] shadow-2xl shadow-aerkm-blue/30 transition-all transform hover:scale-[1.01] active:scale-95 flex items-center justify-center space-x-4 uppercase tracking-[0.3em] text-xs disabled:opacity-50 disabled:pointer-events-none"
                >
                   {loading ? (
                     <Loader2 className="animate-spin" size={20} />
                   ) : (
                     <>
                       <Save size={18} />
                       <span>Enregistrer les changements</span>
                     </>
                   )}
                </button>
                <p className="text-center mt-6 text-[9px] font-black text-slate-400 uppercase tracking-widest opacity-60">
                   Dernière synchronisation effectuée en temps réel avec le serveur.
                </p>
              </div>
           </form>
        </div>
      </div>
    </div>
  );
};

export default AdminProfil;