
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Shield, Key, Mail, Camera, BadgeCheck, CheckCircle2 } from 'lucide-react';

const AdminProfil: React.FC = () => {
  const { user } = useAuth();
  const [showSuccess, setShowSuccess] = useState(false);

  const [formData, setFormData] = useState({
    prenom: user?.prenom || '',
    nom: user?.nom || '',
    email: user?.email || '',
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="p-8 lg:p-12 max-w-5xl mx-auto space-y-12 animate-in fade-in duration-700">
      <div>
        <h1 className="text-4xl font-black text-aerkm-blue tracking-tighter">Mon Profil Admin</h1>
        <p className="text-slate-500 font-medium mt-1">Gérez vos informations personnelles et votre sécurité.</p>
      </div>

      {showSuccess && (
        <div className="bg-green-500 text-white p-4 rounded-2xl flex items-center space-x-3 shadow-xl shadow-green-500/20 animate-in slide-in-from-top-4">
           <CheckCircle2 size={20} />
           <p className="text-xs font-black uppercase tracking-widest">Modifications enregistrées avec succès !</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Column: Avatar & Role */}
        <div className="lg:col-span-1 space-y-8">
           <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 text-center">
              <div className="relative inline-block group mb-6">
                <div className="w-32 h-32 bg-aerkm-blue text-white rounded-[2.5rem] flex items-center justify-center text-4xl font-black shadow-2xl group-hover:scale-105 transition-transform">
                  {user?.prenom?.[0]}
                </div>
                <button className="absolute -bottom-2 -right-2 w-10 h-10 bg-white shadow-xl rounded-2xl flex items-center justify-center border border-slate-100 hover:text-aerkm-blue transition-colors">
                  <Camera size={18} />
                </button>
              </div>
              <h3 className="text-xl font-black text-slate-900">{user?.prenom} {user?.nom}</h3>
              <div className="mt-4 inline-flex items-center px-4 py-1.5 bg-aerkm-gold/10 text-aerkm-brown border border-aerkm-gold/20 rounded-full text-[10px] font-black uppercase tracking-widest">
                 <Shield size={14} className="mr-2" />
                 Bureau Exécutif
              </div>
              <hr className="my-8 border-slate-50" />
              <div className="space-y-4 text-left">
                 <div className="flex items-center text-xs text-slate-500">
                   <BadgeCheck size={14} className="mr-3 text-green-500" />
                   <span className="font-bold">Accès Système Complet</span>
                 </div>
                 <div className="flex items-center text-xs text-slate-500">
                   <BadgeCheck size={14} className="mr-3 text-green-500" />
                   <span className="font-bold">Signataire des Rapports</span>
                 </div>
              </div>
           </div>

           <div className="bg-aerkm-blue p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 p-6 opacity-10">
               <Shield size={100} />
             </div>
             <h4 className="font-black uppercase tracking-widest text-xs mb-4 text-blue-200">Sécurité Maximale</h4>
             <p className="text-sm font-medium leading-relaxed opacity-70">
               Votre compte est protégé par des protocoles de sécurité avancés. Ne partagez jamais vos identifiants.
             </p>
           </div>
        </div>

        {/* Right Column: Form */}
        <div className="lg:col-span-2 space-y-8">
           <form onSubmit={handleUpdate} className="bg-white p-10 rounded-[3.5rem] shadow-sm border border-slate-100 space-y-10">
              <section className="space-y-6">
                <h4 className="flex items-center text-xs font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-50 pb-4">
                  <User size={16} className="mr-3" /> Informations Générales
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Prénom</label>
                    <input 
                      type="text" value={formData.prenom} 
                      onChange={e => setFormData({...formData, prenom: e.target.value})}
                      className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-aerkm-blue transition-all font-bold text-slate-800"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nom</label>
                    <input 
                      type="text" value={formData.nom} 
                      onChange={e => setFormData({...formData, nom: e.target.value})}
                      className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-aerkm-blue transition-all font-bold text-slate-800"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Professionnel</label>
                    <div className="relative group">
                       <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                       <input 
                        type="email" value={formData.email} 
                        onChange={e => setFormData({...formData, email: e.target.value})}
                        className="w-full pl-14 pr-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-aerkm-blue transition-all font-bold text-slate-800"
                       />
                    </div>
                  </div>
                </div>
              </section>

              <section className="space-y-6">
                <h4 className="flex items-center text-xs font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-50 pb-4">
                  <Key size={16} className="mr-3" /> Modification Mot de Passe
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Ancien mot de passe</label>
                    <input 
                      type="password" value={formData.oldPassword} 
                      onChange={e => setFormData({...formData, oldPassword: e.target.value})}
                      className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-aerkm-blue transition-all font-bold text-slate-800"
                      placeholder="••••••••••••"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nouveau mot de passe</label>
                    <input 
                      type="password" value={formData.newPassword} 
                      onChange={e => setFormData({...formData, newPassword: e.target.value})}
                      className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-aerkm-blue transition-all font-bold text-slate-800"
                      placeholder="••••••••••••"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Confirmer</label>
                    <input 
                      type="password" value={formData.confirmPassword} 
                      onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
                      className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-aerkm-blue transition-all font-bold text-slate-800"
                      placeholder="••••••••••••"
                    />
                  </div>
                </div>
              </section>

              <div className="pt-6">
                <button type="submit" className="w-full bg-aerkm-blue hover:bg-blue-800 text-white font-black py-5 px-8 rounded-2xl shadow-2xl shadow-aerkm-blue/20 transition-all transform active:scale-95 flex items-center justify-center space-x-3 uppercase tracking-widest text-[10px]">
                   <span>Mettre à jour mon compte</span>
                </button>
              </div>
           </form>
        </div>
      </div>
    </div>
  );
};

export default AdminProfil;
