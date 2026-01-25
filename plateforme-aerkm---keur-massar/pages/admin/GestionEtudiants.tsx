
import React, { useState } from 'react';
import { useData } from '../../context/StudentContext';
import { Search, Download, Trash2, Edit2, UserCheck, X, Check, Save, FileSpreadsheet } from 'lucide-react';
import { UFR_LIST } from '../../constants';
import { Etudiant } from '../../types';
import * as XLSX from 'xlsx';

const GestionEtudiants: React.FC = () => {
  const { students, deleteStudent, updateStudent } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [ufrFilter, setUfrFilter] = useState('Tous');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Etudiant | null>(null);

  const filteredStudents = students.filter(s => {
    const matchesSearch = `${s.nom} ${s.prenom}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesUfr = ufrFilter === 'Tous' || s.ufr === ufrFilter;
    return matchesSearch && matchesUfr;
  });

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
    const headers = ["ID Recensement", "Nom", "Prenom", "UFR", "Filiere", "Niveau", "Tel", "Email", "Logé Amicale", "Santé"];
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
    
    XLSX.writeFile(wb, "aerkm_liste_etudiants.xlsx");
  };

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-full overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase leading-none">Base Étudiants</h1>
          <p className="text-[10px] text-slate-500 mt-1 font-bold uppercase tracking-widest">{filteredStudents.length} membres actifs</p>
        </div>
        <button onClick={exportExcel} className="bg-aerkm-blue text-white px-4 py-2 rounded-xl hover:bg-blue-800 shadow-lg shadow-aerkm-blue/20 transition-all flex items-center space-x-2 font-black text-[9px] uppercase tracking-widest">
          <FileSpreadsheet size={14} />
          <span>Exporter</span>
        </button>
      </div>

      <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-2">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-aerkm-blue transition-colors" size={16} />
          <input 
            type="text" 
            placeholder="Rechercher..." 
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-aerkm-blue outline-none transition-all font-bold text-[11px]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select 
          className="px-4 py-2.5 bg-slate-50 border-2 border-slate-100 rounded-xl text-slate-600 focus:border-aerkm-blue outline-none font-bold text-[11px]"
          value={ufrFilter}
          onChange={(e) => setUfrFilter(e.target.value)}
        >
          <option value="Tous">Toutes les UFR</option>
          {UFR_LIST.map(u => <option key={u} value={u}>{u.split('(')[0]}</option>)}
        </select>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left table-auto">
            <thead>
              <tr className="bg-slate-50/50 text-slate-400 uppercase text-[8px] font-black tracking-[0.2em] border-b border-slate-100">
                <th className="px-4 py-3">Membre</th>
                <th className="px-4 py-3">Cursus Académique</th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length > 0 ? filteredStudents.map((s) => (
                <tr key={s._id || s.id} className="hover:bg-slate-50/30 transition-colors group">
                  <td className="px-4 py-2">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-xl bg-aerkm-blue/10 text-aerkm-blue flex items-center justify-center font-black text-[10px] shrink-0">
                        {s.prenom[0]}{s.nom[0]}
                      </div>
                      <div className="min-w-0">
                        <p className="font-black text-slate-800 tracking-tight text-[11px] truncate">{s.prenom} {s.nom}</p>
                        <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest">{s.numeroRecensement}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-2">
                    <p className="text-[10px] font-black text-slate-700 leading-none truncate max-w-[150px]">{s.ufr.split('(')[0]}</p>
                    <p className="text-[8px] text-slate-400 font-bold uppercase mt-1 tracking-widest truncate max-w-[150px]">{s.filiere} • {s.niveau}</p>
                  </td>
                  <td className="px-4 py-2">
                    <p className="text-[10px] font-black text-slate-700">{s.telephone}</p>
                    <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest truncate max-w-[120px]">{s.email}</p>
                  </td>
                  <td className="px-4 py-2 text-center">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-[7px] font-black uppercase tracking-widest bg-green-50 text-green-600 border border-green-100">
                      <UserCheck size={8} className="mr-1" /> Actif
                    </span>
                  </td>
                  <td className="px-4 py-2 text-right">
                    <div className="flex items-center justify-end space-x-1">
                      <button onClick={() => handleEdit(s)} className="p-1.5 text-slate-400 hover:text-aerkm-blue hover:bg-aerkm-blue/5 rounded-lg transition-all"><Edit2 size={14} /></button>
                      <button onClick={() => deleteStudent(s._id || s.id)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center font-bold text-slate-400 uppercase tracking-widest text-[9px]">Aucun étudiant trouvé.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && editingStudent && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-aerkm-blue/40 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-3xl overflow-hidden animate-in zoom-in duration-300">
            <div className="bg-aerkm-blue p-6 text-white flex justify-between items-center">
              <div>
                <h2 className="text-lg font-black tracking-tight uppercase">Éditer Dossier</h2>
                <p className="text-blue-100/60 text-[8px] font-black uppercase tracking-widest mt-0.5">Mise à jour membre</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-8 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1"><label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Prénom</label><input className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl outline-none focus:border-aerkm-blue transition-all font-bold text-[11px]" value={editingStudent.prenom} onChange={e => setEditingStudent({...editingStudent, prenom: e.target.value})} /></div>
                <div className="space-y-1"><label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Nom</label><input className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl outline-none focus:border-aerkm-blue transition-all font-bold text-[11px]" value={editingStudent.nom} onChange={e => setEditingStudent({...editingStudent, nom: e.target.value})} /></div>
                <div className="space-y-1"><label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Téléphone</label><input className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl outline-none focus:border-aerkm-blue transition-all font-bold text-[11px]" value={editingStudent.telephone} onChange={e => setEditingStudent({...editingStudent, telephone: e.target.value})} /></div>
                <div className="space-y-1"><label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">UFR</label><select className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl outline-none font-bold text-[11px]" value={editingStudent.ufr} onChange={e => setEditingStudent({...editingStudent, ufr: e.target.value})}>{UFR_LIST.map(u => <option key={u} value={u}>{u}</option>)}</select></div>
              </div>
              <div className="pt-4 flex gap-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 border-2 border-slate-100 text-slate-500 font-black rounded-xl hover:bg-slate-50 transition-all uppercase tracking-widest text-[9px]">Annuler</button>
                <button type="submit" className="flex-1 py-3 bg-aerkm-blue text-white font-black rounded-xl hover:bg-blue-800 shadow-xl transition-all flex items-center justify-center space-x-2 uppercase tracking-widest text-[9px]"><Save size={14} /><span>Enregistrer</span></button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionEtudiants;