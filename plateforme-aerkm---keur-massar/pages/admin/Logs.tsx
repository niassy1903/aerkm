
import React, { useState } from 'react';
import { useData } from '../../context/StudentContext';
import { History, Search, Filter, Calendar, ArrowRight, Shield } from 'lucide-react';

const Logs: React.FC = () => {
  const { logs } = useData();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLogs = logs.filter(l => 
    l.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.details.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 lg:p-12 space-y-10 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-aerkm-blue tracking-tighter uppercase">Journaux d'Activité</h1>
          <p className="text-slate-500 font-medium mt-1">Traçabilité complète des opérations administratives.</p>
        </div>
        <div className="flex p-1 bg-slate-100 rounded-2xl">
           <button className="px-6 py-2 bg-white text-aerkm-blue font-black text-[10px] uppercase tracking-widest rounded-xl shadow-sm">Tout</button>
           <button className="px-6 py-2 text-slate-500 font-black text-[10px] uppercase tracking-widest rounded-xl">Critique</button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Filtrer l'historique..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-14 pr-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-aerkm-blue transition-all font-bold text-sm"
          />
        </div>
      </div>

      <div className="bg-white rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden">
         <div className="overflow-x-auto">
           <table className="w-full text-left">
             <thead>
               <tr className="bg-slate-50/50 text-slate-400 uppercase text-[10px] font-black tracking-[0.2em] border-b border-slate-100">
                 <th className="px-10 py-6">Date & Heure</th>
                 <th className="px-10 py-6">Opération</th>
                 <th className="px-10 py-6">Description</th>
                 <th className="px-10 py-6">Auteur ID</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-slate-100">
               {filteredLogs.length > 0 ? filteredLogs.map((log) => (
                 <tr key={log.id} className="hover:bg-slate-50/50 transition-colors group">
                   <td className="px-10 py-6">
                      <div className="flex items-center space-x-3">
                         <Calendar size={14} className="text-slate-300" />
                         <span className="text-xs font-bold text-slate-600">
                           {new Date(log.date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                         </span>
                      </div>
                   </td>
                   <td className="px-10 py-6">
                      <span className="inline-flex items-center px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-aerkm-blue/5 text-aerkm-blue border border-aerkm-blue/10">
                        {log.action}
                      </span>
                   </td>
                   <td className="px-10 py-6">
                      <p className="text-sm font-bold text-slate-800 tracking-tight">{log.details}</p>
                   </td>
                   <td className="px-10 py-6">
                      <div className="flex items-center space-x-2 text-slate-400">
                         <Shield size={12} />
                         <span className="text-[10px] font-black font-mono">{log.adminId}</span>
                      </div>
                   </td>
                 </tr>
               )) : (
                 <tr>
                   <td colSpan={4} className="px-10 py-20 text-center">
                     <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest italic">Aucune trace trouvée.</p>
                   </td>
                 </tr>
               )}
             </tbody>
           </table>
         </div>
      </div>
    </div>
  );
};

export default Logs;
