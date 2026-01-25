
import React, { useState, useEffect } from 'react';
import { useData } from '../../context/StudentContext';
import { Settings as SettingsIcon, Globe, ShieldAlert, Bell, Database, CheckCircle2, Save, Sparkles, Server, Loader2 } from 'lucide-react';

const Parametres: React.FC = () => {
  const { settings, updateSettings } = useData();
  const [localSettings, setLocalSettings] = useState<any>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (settings) {
      setLocalSettings(settings);
    }
  }, [settings]);

  const handleSave = async () => {
    if (!localSettings) return;
    setLoading(true);
    try {
      await updateSettings(localSettings);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!localSettings) {
    return (
      <div className="flex items-center justify-center h-full min-h-[60vh]">
        <Loader2 className="animate-spin text-aerkm-blue" size={40} />
      </div>
    );
  }

  return (
    <div className="p-8 lg:p-12 max-w-6xl mx-auto space-y-12 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-aerkm-blue tracking-tighter">Paramètres Système</h1>
          <p className="text-slate-500 font-medium mt-1">Gérez le comportement global de l'infrastructure AERKM.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={loading}
          className="bg-aerkm-brown hover:bg-aerkm-brownLight text-white font-black py-4 px-8 rounded-2xl shadow-2xl transition-all flex items-center space-x-3 uppercase tracking-widest text-[10px] disabled:opacity-50"
        >
          {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          <span>{loading ? 'Sauvegarde...' : 'Sauvegarder les réglages'}</span>
        </button>
      </div>

      {showSuccess && (
        <div className="bg-green-500 text-white p-4 rounded-2xl flex items-center space-x-3 shadow-xl shadow-green-500/20 animate-in slide-in-from-top-4">
           <CheckCircle2 size={20} />
           <p className="text-xs font-black uppercase tracking-widest">Configuration enregistrée en base de données !</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        {/* Academic Settings */}
        <section className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 space-y-8">
           <div className="flex items-center space-x-4 border-b border-slate-50 pb-4">
              <Globe className="text-aerkm-blue" size={24} />
              <h3 className="text-xl font-black text-aerkm-blue tracking-tight uppercase">Session Académique</h3>
           </div>
           
           <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Année Universitaire active</label>
                <select 
                  value={localSettings.academicYear}
                  onChange={e => setLocalSettings({...localSettings, academicYear: e.target.value})}
                  className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-aerkm-blue transition-all font-bold text-slate-800"
                >
                  <option value="2023-2024">2023 - 2024</option>
                  <option value="2024-2025">2024 - 2025</option>
                  <option value="2025-2026">2025 - 2026</option>
                </select>
              </div>

              <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-black text-slate-800 text-sm">Portail de Recensement</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                      {localSettings.registrationOpen ? 'Inscriptions Ouvertes' : 'Inscriptions Closes'}
                    </p>
                  </div>
                  <button 
                    onClick={() => setLocalSettings({...localSettings, registrationOpen: !localSettings.registrationOpen})}
                    className={`w-14 h-8 rounded-full transition-all relative ${localSettings.registrationOpen ? 'bg-green-500' : 'bg-slate-300'}`}
                  >
                    <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${localSettings.registrationOpen ? 'left-7' : 'left-1'}`}></div>
                  </button>
                </div>
              </div>
           </div>
        </section>

        {/* Security & Maintenance */}
        <section className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 space-y-8">
           <div className="flex items-center space-x-4 border-b border-slate-50 pb-4">
              <ShieldAlert className="text-red-500" size={24} />
              <h3 className="text-xl font-black text-aerkm-blue tracking-tight uppercase">Maintenance & Sécurité</h3>
           </div>

           <div className="space-y-6">
              <div className="p-6 bg-red-50 rounded-[2rem] border border-red-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-black text-red-900 text-sm">Mode Maintenance</p>
                    <p className="text-[10px] text-red-500/70 font-bold uppercase tracking-widest mt-0.5">Restriction totale d'accès</p>
                  </div>
                  <button 
                    onClick={() => setLocalSettings({...localSettings, maintenanceMode: !localSettings.maintenanceMode})}
                    className={`w-14 h-8 rounded-full transition-all relative ${localSettings.maintenanceMode ? 'bg-red-500' : 'bg-slate-300'}`}
                  >
                    <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${localSettings.maintenanceMode ? 'left-7' : 'left-1'}`}></div>
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Rétention des données (Années)</label>
                <input 
                  type="number" value={localSettings.dataRetention}
                  onChange={e => setLocalSettings({...localSettings, dataRetention: e.target.value})}
                  className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-aerkm-blue transition-all font-bold text-slate-800"
                />
              </div>
           </div>
        </section>

        {/* Communications */}
        <section className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 space-y-8">
           <div className="flex items-center space-x-4 border-b border-slate-50 pb-4">
              <Bell className="text-aerkm-gold" size={24} />
              <h3 className="text-xl font-black text-aerkm-blue tracking-tight uppercase">Communications</h3>
           </div>

           <div className="space-y-4">
              {[
                { label: "Alertes Email Admin", desc: "Notification à chaque recensement", key: "emailNotifications" },
                { label: "Canal SMS d'Urgence", desc: "Passerelle SMS transactionnelle", key: "smsAlerts" },
              ].map((notif, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                   <div>
                     <p className="text-xs font-black text-slate-800">{notif.label}</p>
                     <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{notif.desc}</p>
                   </div>
                   <button 
                    onClick={() => setLocalSettings({...localSettings, [notif.key]: !localSettings[notif.key]})}
                    className={`w-12 h-6 rounded-full transition-all relative ${localSettings[notif.key] ? 'bg-aerkm-blue' : 'bg-slate-300'}`}
                  >
                    <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-all ${localSettings[notif.key] ? 'translate-x-6' : 'translate-x-0'}`}></div>
                  </button>
                </div>
              ))}
           </div>
        </section>

        {/* System Status */}
        <section className="bg-[#0a192f] p-10 rounded-[3rem] text-white space-y-8 relative overflow-hidden shadow-2xl">
           <div className="absolute bottom-0 right-0 p-10 opacity-5">
              <Server size={150} />
           </div>
           <div className="flex items-center space-x-4 border-b border-white/5 pb-4 relative z-10">
              <Database className="text-aerkm-gold" size={24} />
              <h3 className="text-xl font-black uppercase tracking-tight">État du Serveur</h3>
           </div>
           
           <div className="grid grid-cols-2 gap-4 relative z-10">
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                 <p className="text-[9px] font-black text-white/40 uppercase tracking-widest">Base de données</p>
                 <p className="text-sm font-black text-green-500 mt-1">Connecté (Render)</p>
              </div>
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                 <p className="text-[9px] font-black text-white/40 uppercase tracking-widest">Temps de réponse</p>
                 <p className="text-sm font-black text-white mt-1">120ms</p>
              </div>
           </div>
           
           <div className="pt-4 relative z-10">
              <button className="w-full py-4 bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center space-x-2">
                 <Sparkles size={14} className="text-aerkm-gold" />
                 <span>Optimiser les ressources</span>
              </button>
           </div>
        </section>
      </div>
    </div>
  );
};

export default Parametres;
