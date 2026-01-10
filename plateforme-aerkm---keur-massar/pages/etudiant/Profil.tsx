
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Etudiant } from '../../types';
import { User, Phone, Mail, Save, Shield, BadgeCheck, Stethoscope, Home, Activity } from 'lucide-react';

const Profil: React.FC = () => {
  const { user } = useAuth();
  const student = user as Etudiant;
  
  const [formData, setFormData] = useState({
    telephone: student.telephone,
    email: student.email,
  });

  return (
    <div className="bg-slate-50 min-h-screen py-12 px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-aerkm-blue text-white rounded-2xl flex items-center justify-center text-2xl font-bold shadow-lg">
            {student.prenom[0]}{student.nom[0]}
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">{student.prenom} {student.nom}</h1>
            <p className="text-slate-500 flex items-center">
              <BadgeCheck size={16} className="text-green-500 mr-1.5" /> 
              Profil Étudiant Certifié
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Contact Form */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
              <h2 className="text-lg font-bold text-slate-900 mb-8 border-b border-slate-50 pb-4">Mettre à jour mes coordonnées</h2>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Téléphone WhatsApp</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input type="tel" className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" value={formData.telephone} onChange={e => setFormData({...formData, telephone: e.target.value})} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input type="email" className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                    </div>
                  </div>
                </div>
                <button className="bg-aerkm-blue hover:bg-aerkm-blue/90 text-white font-black py-4 px-8 rounded-2xl shadow-lg transition-all flex items-center space-x-2 text-sm uppercase tracking-widest">
                  <Save size={18} />
                  <span>Enregistrer</span>
                </button>
              </form>
            </div>

            {/* Social & Health Data */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
              <h2 className="text-lg font-bold text-slate-900 mb-8 border-b border-slate-50 pb-4">Situation Sociale & Santé</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-xl ${student.maladieHandicap ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                    <Activity size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Situation Sanitaire</p>
                    <p className="font-bold text-slate-800">{student.maladieHandicap ? 'Pathologie déclarée' : 'Aucune pathologie déclarée'}</p>
                    {student.maladieHandicap && (
                      <p className="text-xs text-red-500 font-bold mt-1 flex items-center">
                        <Stethoscope size={12} className="mr-1" /> {student.typeMaladieHandicap}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-xl ${student.logementAmicale ? 'bg-blue-50 text-aerkm-blue' : 'bg-slate-50 text-slate-400'}`}>
                    <Home size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Logement Amicale</p>
                    <p className="font-bold text-slate-800">{student.logementAmicale ? 'Logé par l\'Amicale' : 'Logement personnel'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recensement Details */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
              <h2 className="text-lg font-bold text-slate-900 mb-8 border-b border-slate-50 pb-4 flex items-center">
                <Shield size={20} className="mr-2 text-aerkm-gold" /> Dossier Administratif
              </h2>
              <div className="grid grid-cols-2 gap-8">
                <div>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ID Recensement</p>
                   <p className="text-slate-800 font-black">{student.numeroRecensement}</p>
                </div>
                <div>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tuteur</p>
                   <p className="text-slate-800 font-bold">{student.tuteur}</p>
                </div>
                <div>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">UFR</p>
                   <p className="text-slate-800 font-bold">{student.ufr}</p>
                </div>
                <div>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Niveau</p>
                   <p className="text-slate-800 font-bold">{student.niveau}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white">
              <Shield className="text-aerkm-gold mb-6" size={32} />
              <h3 className="text-xl font-bold mb-4">Confidentialité</h3>
              <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                Vos informations sociales et sanitaires sont traitées avec la plus grande discrétion par le bureau de l'AERKM.
              </p>
              <button className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl font-black text-xs uppercase tracking-widest transition-all">
                Changer de mot de passe
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profil;
