
import React, { useState, useMemo } from 'react';
import { useData } from '../../context/StudentContext';
import { 
  Search, 
  Trash2, 
  Edit2, 
  UserCheck, 
  X, 
  Save, 
  FileSpreadsheet, 
  ChevronLeft, 
  ChevronRight, 
  Filter,
  Users,
  Home,
  Activity,
  Download
} from 'lucide-react';
import { UFR_LIST } from '../../constants';
import { Etudiant } from '../../types';
import * as XLSX from 'xlsx';

const GestionEtudiants: React.FC = () => {
  const { students, deleteStudent, updateStudent } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [ufrFilter, setUfrFilter] = useState('Tous');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Etudiant | null>(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Statistics for the header
  const stats = useMemo(() => ({
    total: students.length,
    loges: students.filter(s => s.logementAmicale).length,
    besoins: students.filter(s => s.maladieHandicap).length,
    femmes: students.filter(s => s.sexe === 'F').length
  }), [students]);

  // Filtering logic
  const filteredStudents = useMemo(() => {
    return students.filter(s => {
      const matchesSearch = `${s.nom} ${s.prenom} ${s.numeroRecensement}`.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesUfr = ufrFilter === 'Tous' || s.ufr === ufrFilter;
      return matchesSearch && matchesUfr;
    });
  }, [students, searchTerm, ufrFilter]);

  // Pagination logic
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const paginatedStudents = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredStudents.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredStudents, currentPage]);

  const handleEdit = (student: Etudiant) => {
    setEditingStudent({ ...student });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingStudent) {
      await updateStudent(editingStudent);
      setIsModalOpen(false);
    }
  };

  const exportExcel = () => {
    const headers = ["Matricule", "Nom", "Prénom", "UFR", "Filière", "Niveau", "Tel", "Email", "Logé Amicale", "Santé"];
    const rows = filteredStudents.map(s => [
      s.numeroRecensement, 
      s.nom, 
      s.prenom, 
      s.ufr, 
      s.filiere, 
      s.niveau, 
      s.telephone, 
      s.email,
      s.logementAmicale ? 'OUI' : 'NON',
      s.maladieHandicap ? 'OUI' : 'NON'
    ]);
    const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Etudiants_AERKM");
    XLSX.writeFile(wb, "base_etudiants_aerkm.xlsx");
  };

  return (
    <div className="p-6 lg:p-8 space-y-8 animate-in fade-in duration-700 max-w-[1600px] mx-auto">
      
      {/* Header with quick stats */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-aerkm-brown font-bold uppercase tracking-[0.2em] text-[10px]">
            <Users size={12} />
            <span>Gestion de la communauté</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-black text-aerkm-blue tracking-tighter uppercase leading-none">Annuaire Étudiant</h1>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Total', value: stats.total, color: 'bg-aerkm-blue', icon: <Users size={14} /> },
            { label: 'Logés', value: stats.loges, color: 'bg-aerkm-brown', icon: <Home size={14} /> },
            { label: 'Santé', value: stats.besoins, color: 'bg-red-500', icon: <Activity size={14} /> },
            { label: 'Filles', value: stats.femmes, color: 'bg-aerkm-gold', icon: <UserCheck size={14} /> }
          ].map((s, i) => (
            <div key={i} className="bg-white p-3 rounded-xl shadow-sm border border-slate-100 flex flex-col justify-between min-w-[110px]">
              <div className={`w-7 h-7 rounded-lg ${s.color} text-white flex items-center justify-center mb-2 shadow-md`}>
                {s.icon}
              </div>
              <div>
                <p className="text-lg font-black text-slate-800 leading-none">{s.value}</p>
                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">{s.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modern Control Bar */}
      <div className="bg-white p-4 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col lg:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-aerkm-blue transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Rechercher par nom, prénom ou matricule..." 
            className="w-full pl-12 pr-6 py-3.5 bg-slate-50 border-2 border-slate-50 rounded-xl focus:border-aerkm-blue outline-none transition-all font-bold text-xs"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          />
        </div>
        
        <div className="flex items-center w-full lg:w-auto gap-3">
          <div className="relative flex-1 lg:w-56">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <select 
              className="w-full pl-10 pr-6 py-3.5 bg-slate-50 border-2 border-slate-50 rounded-xl text-slate-600 focus:border-aerkm-blue outline-none font-bold text-[10px] appearance-none"
              value={ufrFilter}
              onChange={(e) => { setUfrFilter(e.target.value); setCurrentPage(1); }}
            >
              <option value="Tous">Toutes les UFR</option>
              {UFR_LIST.map(u => <option key={u} value={u}>{u.split('(')[0]}</option>)}
            </select>
          </div>
          
          <button 
            onClick={exportExcel} 
            className="bg-slate-900 text-white px-5 py-3.5 rounded-xl hover:bg-black shadow-lg transition-all flex items-center space-x-2 font-black text-[9px] uppercase tracking-[0.1em] active:scale-95"
          >
            <Download size={16} className="text-aerkm-gold" />
            <span>EXPORTER</span>
          </button>
        </div>
      </div>

      {/* Main Data Table - Compacted */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left table-auto">
            <thead>
              <tr className="bg-slate-50/50 text-slate-400 uppercase text-[8px] font-black tracking-[0.2em] border-b border-slate-100">
                <th className="px-6 py-4">Profil Membre</th>
                <th className="px-6 py-4">Parcours Académique</th>
                <th className="px-6 py-4">Contacts</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {paginatedStudents.length > 0 ? paginatedStudents.map((s, idx) => (
                <tr key={s._id || s.id} className="hover:bg-slate-50/50 transition-all group animate-in slide-in-from-bottom-1 duration-300" style={{ animationDelay: `${idx * 40}ms` }}>
                  <td className="px-6 py-3">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-xl ${s.sexe === 'F' ? 'bg-aerkm-gold/10 text-aerkm-brown' : 'bg-aerkm-blue/10 text-aerkm-blue'} flex items-center justify-center font-black text-xs shrink-0`}>
                        {s.prenom[0]}{s.nom[0]}
                      </div>
                      <div className="min-w-0">
                        <p className="font-black text-slate-900 tracking-tight text-xs uppercase truncate">{s.prenom} {s.nom}</p>
                        <p className="text-[8px] text-aerkm-blue font-black tracking-widest bg-blue-50 px-2 py-0.5 rounded-full inline-block mt-0.5">{s.numeroRecensement}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-black text-slate-800 leading-none uppercase truncate max-w-[200px]">{s.ufr.split('(')[0]}</span>
                      <div className="flex items-center mt-1.5 space-x-1.5">
                        <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider truncate max-w-[120px]">{s.filiere}</span>
                        <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                        <span className="text-[8px] font-black text-aerkm-brown">{s.niveau}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    <div className="space-y-0.5">
                      <p className="text-[10px] font-black text-slate-700 flex items-center leading-none">
                        <span className="w-1 h-1 bg-green-500 rounded-full mr-1.5"></span>
                        {s.telephone}
                      </p>
                      <p className="text-[8px] text-slate-400 font-bold lowercase truncate max-w-[150px]">{s.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-3 text-right">
                    <div className="flex items-center justify-end space-x-1.5 opacity-0 group-hover:opacity-100 transition-all transform translate-x-1 group-hover:translate-x-0">
                      <button 
                        onClick={() => handleEdit(s)} 
                        className="p-2 bg-white text-blue-600 border border-slate-100 rounded-lg shadow-sm hover:bg-blue-600 hover:text-white transition-all active:scale-90"
                        title="Éditer"
                      >
                        <Edit2 size={12} />
                      </button>
                      <button 
                        onClick={() => { if(window.confirm("Supprimer ce membre définitivement ?")) deleteStudent(s._id || s.id); }} 
                        className="p-2 bg-white text-red-500 border border-slate-100 rounded-lg shadow-sm hover:bg-red-500 hover:text-white transition-all active:scale-90"
                        title="Supprimer"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={4} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center">
                      <div className="w-14 h-14 bg-slate-50 rounded-full flex items-center justify-center mb-3 border-2 border-dashed border-slate-200">
                        <Users className="text-slate-300" size={24} />
                      </div>
                      <h3 className="text-base font-black text-slate-300 uppercase tracking-widest">Aucun résultat</h3>
                      <p className="text-slate-400 font-bold text-[10px] mt-1 italic uppercase">Ajustez vos filtres</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Impactful Pagination Bar - Compact */}
        <div className="bg-slate-50/30 p-5 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[10px] font-bold text-slate-500">
            Membres <span className="text-aerkm-blue font-black">{(currentPage - 1) * itemsPerPage + 1}</span> - <span className="text-aerkm-blue font-black">{Math.min(currentPage * itemsPerPage, filteredStudents.length)}</span> sur <span className="text-aerkm-blue font-black">{filteredStudents.length}</span>
          </p>

          <div className="flex items-center space-x-1.5">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg bg-white border border-slate-100 text-slate-400 hover:text-aerkm-blue hover:shadow-sm disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-90"
            >
              <ChevronLeft size={16} />
            </button>
            
            <div className="flex items-center space-x-1 px-2">
              {[...Array(totalPages)].map((_, i) => {
                const page = i + 1;
                if (totalPages > 5 && (page > 1 && page < totalPages && (page < currentPage - 1 || page > currentPage + 1))) {
                  if (page === currentPage - 2 || page === currentPage + 2) return <span key={page} className="text-slate-300 text-[10px]">..</span>;
                  return null;
                }
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-7 h-7 rounded-lg text-[10px] font-black transition-all transform ${
                      currentPage === page 
                      ? 'bg-aerkm-blue text-white shadow-md scale-110' 
                      : 'bg-white border border-slate-100 text-slate-500 hover:bg-slate-100'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
            </div>

            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="p-2 rounded-lg bg-white border border-slate-100 text-slate-400 hover:text-aerkm-blue hover:shadow-sm disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-90"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Editing Modal - Enhanced */}
      {isModalOpen && editingStudent && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-aerkm-blue/40 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-3xl overflow-hidden animate-in zoom-in duration-300 border border-white/20">
            <div className="bg-aerkm-blue p-6 text-white flex justify-between items-center relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-10">
                 <Edit2 size={100} />
              </div>
              <div className="relative z-10">
                <h2 className="text-xl font-black tracking-tight uppercase">Éditer le dossier</h2>
                <p className="text-blue-100/60 text-[9px] font-black uppercase tracking-[0.2em] mt-0.5">{editingStudent.numeroRecensement}</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="relative z-10 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-8 space-y-6 max-h-[75vh] overflow-y-auto no-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2">Prénom</label>
                  <input 
                    className="w-full px-5 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-xl outline-none focus:border-aerkm-blue transition-all font-bold text-xs" 
                    value={editingStudent.prenom} 
                    onChange={e => setEditingStudent({...editingStudent, prenom: e.target.value})} 
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2">Nom</label>
                  <input 
                    className="w-full px-5 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-xl outline-none focus:border-aerkm-blue transition-all font-bold text-xs" 
                    value={editingStudent.nom} 
                    onChange={e => setEditingStudent({...editingStudent, nom: e.target.value})} 
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2">Téléphone</label>
                  <input 
                    className="w-full px-5 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-xl outline-none focus:border-aerkm-blue transition-all font-bold text-xs" 
                    value={editingStudent.telephone} 
                    onChange={e => setEditingStudent({...editingStudent, telephone: e.target.value})} 
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2">UFR / Institut</label>
                  <select 
                    className="w-full px-5 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-xl outline-none font-bold text-xs" 
                    value={editingStudent.ufr} 
                    onChange={e => setEditingStudent({...editingStudent, ufr: e.target.value})}
                  >
                    {UFR_LIST.map(u => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>
              </div>

              <div className="bg-slate-50 p-5 rounded-[1.5rem] space-y-3 border border-slate-100">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2">Statut Social</p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <label className="flex-1 flex items-center justify-between p-3.5 bg-white rounded-xl border border-slate-100 cursor-pointer">
                    <span className="text-[10px] font-bold text-slate-700">Logement Amicale</span>
                    <input 
                      type="checkbox" 
                      checked={editingStudent.logementAmicale} 
                      onChange={e => setEditingStudent({...editingStudent, logementAmicale: e.target.checked})}
                      className="w-4 h-4 accent-aerkm-blue"
                    />
                  </label>
                  <label className="flex-1 flex items-center justify-between p-3.5 bg-white rounded-xl border border-slate-100 cursor-pointer">
                    <span className="text-[10px] font-bold text-slate-700">Besoin Sanitaire</span>
                    <input 
                      type="checkbox" 
                      checked={editingStudent.maladieHandicap} 
                      onChange={e => setEditingStudent({...editingStudent, maladieHandicap: e.target.checked})}
                      className="w-4 h-4 accent-red-500"
                    />
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)} 
                  className="flex-1 py-4 border-2 border-slate-100 text-slate-500 font-black rounded-xl hover:bg-slate-50 transition-all uppercase tracking-widest text-[9px]"
                >
                  Annuler
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-4 bg-aerkm-brown text-white font-black rounded-xl hover:bg-aerkm-brownLight shadow-xl transition-all flex items-center justify-center space-x-2 uppercase tracking-widest text-[9px] active:scale-95"
                >
                  <Save size={14} />
                  <span>Enregistrer</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionEtudiants;