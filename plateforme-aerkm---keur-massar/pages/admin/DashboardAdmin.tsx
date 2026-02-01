
import React, { useState, useMemo } from 'react';
import { useData } from '../../context/StudentContext';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { 
  Users, Calendar, TrendingUp, Sparkles, GraduationCap, Clock, ArrowUpRight, History, RefreshCw 
} from 'lucide-react';
import { UFR_LIST } from '../../constants';
import { Link } from 'react-router-dom';

const DashboardAdmin: React.FC = () => {
  const { students, events, logs, fetchData } = useData();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await fetchData();
    } catch (error) {
      console.error("Erreur lors de l'actualisation :", error);
    } finally {
      // Feedback visuel court pour confirmer l'action
      setTimeout(() => setIsRefreshing(false), 800);
    }
  };

  // Calcul des statistiques globales
  const stats = useMemo(() => [
    { label: 'Recensés', value: students.length, icon: <Users size={24} />, color: 'bg-aerkm-blue', textColor: 'text-white' },
    { label: 'Agenda', value: events.length, icon: <Calendar size={24} />, color: 'bg-aerkm-brown', textColor: 'text-white' },
    { label: 'UFR Actives', value: UFR_LIST.length, icon: <GraduationCap size={24} />, color: 'bg-white', textColor: 'text-aerkm-blue' },
    { label: 'Croissance', value: '+18%', icon: <TrendingUp size={24} />, color: 'bg-aerkm-gold', textColor: 'text-aerkm-blue' },
  ], [students.length, events.length]);

  // Logic pour le graphique UFR - Matching robuste pour éviter les "0"
  const ufrData = useMemo(() => {
    return UFR_LIST.map(ufrFullString => {
      // Extraction du nom court (ex: "SATIC" de "UFR SATIC (...)")
      const parts = ufrFullString.split('(');
      const shortNameRaw = parts[0].replace('UFR ', '').trim();
      
      // Filtrage flexible pour faire correspondre le nom stocké en DB (souvent abrégé ou avec préfixe)
      const count = students.filter(s => {
        if (!s.ufr) return false;
        
        const studentUfr = s.ufr.toLowerCase().trim();
        const targetUfrFull = ufrFullString.toLowerCase().trim();
        const targetShort = shortNameRaw.toLowerCase().trim();
        const targetWithUfrPrefix = `ufr ${targetShort}`;

        // Match sur différentes variantes possibles pour garantir l'affichage
        return studentUfr === targetShort || 
               studentUfr === targetWithUfrPrefix ||
               studentUfr === targetUfrFull || 
               studentUfr.includes(targetShort) || 
               targetUfrFull.includes(studentUfr);
      }).length;

      return {
        name: shortNameRaw,
        count: count
      };
    });
  }, [students]);

  return (
    <div className="space-y-10 p-8 lg:p-12 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center space-x-2 text-aerkm-brown font-bold mb-1">
             <Sparkles size={16} />
             <span className="text-xs uppercase tracking-widest">Vue d'ensemble du Bureau</span>
          </div>
          <h1 className="text-4xl font-black text-aerkm-blue tracking-tighter">Console de Pilotage</h1>
        </div>
        <div className="flex space-x-3">
          <Link to="/admin/statistiques" className="flex items-center space-x-2 bg-white border border-slate-100 px-6 py-3.5 rounded-2xl text-slate-700 font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 shadow-sm transition-all active:scale-95">
             Voir l'Analyse
          </Link>
          <button 
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center space-x-3 bg-aerkm-blue text-white px-6 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-800 shadow-xl shadow-aerkm-blue/20 transition-all active:scale-95 disabled:opacity-70"
          >
            <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
            <span>{isRefreshing ? 'Actualisation...' : 'Actualiser les données'}</span>
          </button>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, i) => (
          <div key={i} className={`${stat.color} p-8 rounded-[2.5rem] shadow-xl border border-slate-100 flex flex-col justify-between min-h-[180px] group hover:-translate-y-2 transition-all duration-500`}>
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 ${stat.color === 'bg-white' ? 'bg-slate-100 text-aerkm-blue' : 'bg-white/10 text-white'}`}>
              {stat.icon}
            </div>
            <div>
              <p className={`text-3xl font-black ${stat.textColor}`}>{stat.value}</p>
              <p className={`text-[10px] font-bold uppercase tracking-[0.2em] ${stat.textColor} opacity-60`}>{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        {/* Main Chart */}
        <div className="xl:col-span-2 bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden relative">
          <div className="absolute top-0 right-0 p-8 opacity-5">
             <TrendingUp size={200} />
          </div>
          <div className="flex justify-between items-center mb-10 relative z-10">
             <div>
               <h2 className="text-xl font-black text-aerkm-blue uppercase tracking-tight">Répartition par UFR</h2>
               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Données temps réel</p>
             </div>
             <div className="flex space-x-2">
               <div className="w-2.5 h-2.5 rounded-full bg-aerkm-blue"></div>
               <div className="w-2.5 h-2.5 rounded-full bg-slate-200"></div>
             </div>
          </div>
          <div className="h-80 w-full relative z-10">
            {students.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ufrData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#64748b', fontSize: 10, fontWeight: 700}} 
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#64748b', fontSize: 10, fontWeight: 700}} 
                  />
                  <Tooltip 
                    cursor={{fill: '#f8fafc', radius: 10}}
                    contentStyle={{borderRadius: '24px', border: 'none', boxShadow: '0 30px 60px rgba(0,0,0,0.1)', padding: '20px'}}
                  />
                  <Bar dataKey="count" fill="#1e3a8a" radius={[12, 12, 0, 0]} barSize={50} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full w-full flex items-center justify-center text-slate-300 font-bold italic border-2 border-dashed border-slate-100 rounded-3xl">
                Chargement des données analytiques...
              </div>
            )}
          </div>
        </div>

        {/* Activity Logs Feed */}
        <div className="bg-[#0a192f] p-10 rounded-[3rem] shadow-2xl text-white relative overflow-hidden">
           <div className="absolute bottom-0 right-0 p-10 opacity-5">
              <History size={150} />
           </div>
           <div className="flex items-center justify-between mb-8 relative z-10">
             <h2 className="text-xl font-black uppercase tracking-tight flex items-center">
                <Clock className="mr-3 text-aerkm-gold" size={20} />
                Historique
             </h2>
             <span className="text-[9px] font-black text-aerkm-gold bg-aerkm-gold/10 px-3 py-1 rounded-full uppercase tracking-widest">Direct</span>
           </div>
           <div className="space-y-6 max-h-[400px] overflow-y-auto scrollbar-hide pr-2 relative z-10">
              {logs.length > 0 ? logs.map((log, i) => (
                <div key={log.id || i} className="flex items-start space-x-4 group animate-in slide-in-from-right-4 duration-500" style={{ animationDelay: `${i * 50}ms` }}>
                   <div className="w-10 h-10 bg-white/5 rounded-2xl flex items-center justify-center text-aerkm-gold group-hover:bg-aerkm-gold group-hover:text-[#0a192f] transition-all shrink-0">
                      <ArrowUpRight size={18} />
                   </div>
                   <div className="flex-1 overflow-hidden">
                      <p className="text-xs font-black text-white group-hover:text-aerkm-gold transition-colors">{log.action}</p>
                      <p className="text-[10px] text-white/40 font-medium truncate mt-0.5">{log.details}</p>
                      <p className="text-[9px] text-white/20 font-black uppercase mt-1 tracking-tighter">
                         {new Date(log.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                   </div>
                </div>
              )) : (
                <p className="text-white/30 text-center py-10 font-bold text-xs italic">Aucune activité enregistrée.</p>
              )}
           </div>
           <Link to="/admin/logs" className="w-full mt-10 py-4 bg-white/5 border border-white/10 rounded-2xl text-white/60 font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all text-center block relative z-10">
              Voir tous les journaux
           </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardAdmin;