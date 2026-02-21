
import React, { useState, useMemo } from 'react';
import { useData } from '../../context/StudentContext';
import { 
  Search, 
  ShieldCheck, 
  UserPlus, 
  X, 
  Check, 
  Trash2, 
  Edit3, 
  Mail, 
  Phone, 
  Loader2, 
  Eye, 
  Filter, 
  ChevronLeft, 
  ChevronRight,
  AlertCircle,
  Save,
  User
} from 'lucide-react';
import { User as UserType } from '../../types';

const GestionBureau: React.FC = () => {
  const { admins, bureauMembers, updateBureauStatus, addAdmin, updateAdmin, deleteAdmin } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [positionFilter, setPositionFilter] = useState('Tous');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<UserType | null>(null);
  const [viewingMember, setViewingMember] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    email: '',
    telephone: '',
    password: '',
    bureauPosition: '',
    role: 'ADMIN' as const,
    isBureau: true
  });

  const positions = useMemo(() => {
    const p = new Set(bureauMembers.map(m => m.bureauPosition).filter(Boolean));
    return ['Tous', ...Array.from(p)];
  }, [bureauMembers]);

  const filteredBureau = useMemo(() => {
    return bureauMembers.filter(m => {
      const matchesSearch = `${m.prenom} ${m.nom}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            m.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = positionFilter === 'Tous' || m.bureauPosition === positionFilter;
      return matchesSearch && matchesFilter;
    });
  }, [bureauMembers, searchTerm, positionFilter]);

  const paginatedMembers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredBureau.slice(start, start + itemsPerPage);
  }, [filteredBureau, currentPage]);

  const totalPages = Math.ceil(filteredBureau.length / itemsPerPage);

  const handleOpenAddModal = () => {
    setEditingMember(null);
    setFormData({
      prenom: '',
      nom: '',
      email: '',
      telephone: '',
      password: '',
      bureauPosition: '',
      role: 'ADMIN',
      isBureau: true
    });
    setError('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (member: UserType) => {
    setEditingMember(member);
    setFormData({
      prenom: member.prenom,
      nom: member.nom,
      email: member.email,
      telephone: member.telephone || '',
      password: '', // On ne change pas le mot de passe par défaut
      bureauPosition: member.bureauPosition || '',
      role: member.role as 'ADMIN',
      isBureau: true
    });
    setError('');
    setIsModalOpen(true);
  };

  const handleOpenViewModal = (member: UserType) => {
    setViewingMember(member);
    setIsViewModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (editingMember) {
        // Update
        const updateData = { ...formData };
        if (!updateData.password) delete (updateData as any).password;
        await updateAdmin({ ...editingMember, ...updateData });
      } else {
        // Add
        if (!formData.password) {
          setError('Le mot de passe est obligatoire pour un nouveau membre.');
          setLoading(false);
          return;
        }
        const success = await addAdmin(formData);
        if (!success) {
          setError("Erreur lors de l'ajout. L'email est peut-être déjà utilisé.");
          setLoading(false);
          return;
        }
      }
      setIsModalOpen(false);
    } catch (err) {
      setError("Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Supprimer définitivement ce membre du bureau ?")) {
      setLoading(true);
      await deleteAdmin(id);
      setLoading(false);
    }
  };

  return (
    <div className="p-8 lg:p-12 space-y-10 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-aerkm-blue tracking-tighter uppercase">Gestion du Bureau</h1>
          <p className="text-slate-500 font-medium mt-1">Administrez les membres du bureau exécutif et leurs responsabilités.</p>
        </div>
        <button 
          onClick={handleOpenAddModal}
          className="bg-aerkm-brown hover:bg-aerkm-brownLight text-white font-black py-4 px-8 rounded-2xl flex items-center justify-center space-x-3 shadow-2xl shadow-aerkm-brown/30 transition-all transform hover:scale-105 active:scale-95"
        >
          <UserPlus size={22} />
          <span className="text-[11px] uppercase tracking-widest">AJOUTER UN MEMBRE</span>
        </button>
      </div>

      {/* Stats & Info Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 bg-aerkm-blue/10 text-aerkm-blue rounded-2xl flex items-center justify-center">
            <ShieldCheck size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Bureau</p>
            <p className="text-2xl font-black text-slate-900">{bureauMembers.length}</p>
          </div>
        </div>
        <div className="md:col-span-2 bg-[#0a192f] p-6 rounded-3xl text-white shadow-xl flex items-center justify-between overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <ShieldCheck size={100} />
          </div>
          <div className="relative z-10 flex items-center space-x-4">
            <div className="w-10 h-10 bg-aerkm-gold/20 text-aerkm-gold rounded-xl flex items-center justify-center">
              <AlertCircle size={20} />
            </div>
            <p className="text-xs font-bold text-blue-100/60">
              Les membres du bureau reçoivent automatiquement les ordres du jour par email.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="bg-white rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden">
        {/* Filters & Search Bar */}
        <div className="p-8 border-b border-slate-50 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input 
                type="text" 
                placeholder="Rechercher un membre..." 
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none text-sm font-bold focus:border-aerkm-blue transition-all"
                value={searchTerm}
                onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              />
            </div>
            <div className="relative w-full sm:w-64">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <select 
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none text-sm font-bold appearance-none cursor-pointer focus:border-aerkm-blue transition-all"
                value={positionFilter}
                onChange={e => { setPositionFilter(e.target.value); setCurrentPage(1); }}
              >
                {positions.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            {filteredBureau.length} membre(s) trouvé(s)
          </p>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-slate-400 uppercase text-[10px] font-black tracking-widest border-b border-slate-100">
                <th className="px-8 py-5">Membre</th>
                <th className="px-8 py-5">Poste / Responsabilité</th>
                <th className="px-8 py-5">Contact</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedMembers.length > 0 ? paginatedMembers.map((m, idx) => (
                <tr key={m._id || m.id} className="hover:bg-slate-50/80 transition-all group animate-in slide-in-from-bottom-2 duration-300" style={{ animationDelay: `${idx * 50}ms` }}>
                  <td className="px-8 py-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-aerkm-blue/10 text-aerkm-blue rounded-2xl flex items-center justify-center font-black text-sm shrink-0 shadow-sm">
                        {m.prenom[0]}{m.nom[0]}
                      </div>
                      <div>
                        <p className="font-black text-slate-900 text-sm uppercase tracking-tight">{m.prenom} {m.nom}</p>
                        <p className="text-[10px] text-aerkm-blue font-black tracking-widest uppercase mt-0.5">ID: {m._id?.slice(-6).toUpperCase() || 'N/A'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="px-4 py-1.5 bg-aerkm-gold/10 text-aerkm-brown rounded-full text-[10px] font-black uppercase tracking-widest border border-aerkm-gold/20">
                      {m.bureauPosition || 'Non défini'}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="space-y-1">
                      <div className="flex items-center text-slate-500 text-[11px] font-bold">
                        <Mail size={12} className="mr-2 text-slate-300" />
                        {m.email}
                      </div>
                      {m.telephone && (
                        <div className="flex items-center text-slate-500 text-[11px] font-bold">
                          <Phone size={12} className="mr-2 text-slate-300" />
                          {m.telephone}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                      <button 
                        onClick={() => handleOpenViewModal(m)}
                        className="p-2.5 bg-white text-slate-400 border border-slate-100 rounded-xl shadow-sm hover:text-aerkm-blue hover:border-aerkm-blue transition-all active:scale-90"
                        title="Voir détails"
                      >
                        <Eye size={16} />
                      </button>
                      <button 
                        onClick={() => handleOpenEditModal(m)}
                        className="p-2.5 bg-white text-slate-400 border border-slate-100 rounded-xl shadow-sm hover:text-aerkm-gold hover:border-aerkm-gold transition-all active:scale-90"
                        title="Modifier"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(m._id || m.id)}
                        className="p-2.5 bg-white text-slate-400 border border-slate-100 rounded-xl shadow-sm hover:text-red-500 hover:border-red-500 transition-all active:scale-90"
                        title="Supprimer"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center">
                      <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4 border-2 border-dashed border-slate-200">
                        <ShieldCheck className="text-slate-200" size={40} />
                      </div>
                      <h3 className="text-lg font-black text-slate-300 uppercase tracking-widest">Aucun membre trouvé</h3>
                      <p className="text-slate-400 font-bold text-xs mt-2 italic">Ajustez vos critères de recherche</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-8 bg-slate-50/30 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
            Affichage de <span className="text-aerkm-blue font-black">{Math.min(filteredBureau.length, (currentPage - 1) * itemsPerPage + 1)}</span> à <span className="text-aerkm-blue font-black">{Math.min(currentPage * itemsPerPage, filteredBureau.length)}</span> sur <span className="text-aerkm-blue font-black">{filteredBureau.length}</span> membres
          </p>
          <div className="flex items-center space-x-2">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
              className="p-3 rounded-xl border border-slate-200 bg-white text-slate-400 hover:text-aerkm-blue disabled:opacity-30 transition-all"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="flex items-center space-x-1">
              {[...Array(totalPages)].map((_, i) => (
                <button 
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-10 h-10 rounded-xl font-black text-xs transition-all ${
                    currentPage === i + 1 
                      ? 'bg-aerkm-blue text-white shadow-lg shadow-aerkm-blue/20' 
                      : 'bg-white border border-slate-200 text-slate-400 hover:border-aerkm-blue'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button 
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage(prev => prev + 1)}
              className="p-3 rounded-xl border border-slate-200 bg-white text-slate-400 hover:text-aerkm-blue disabled:opacity-30 transition-all"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-aerkm-blue/40 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-3xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="bg-aerkm-blue p-8 text-white flex justify-between items-center relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10"><ShieldCheck size={120} /></div>
              <div className="relative z-10">
                <h2 className="text-2xl font-black uppercase tracking-tight">
                  {editingMember ? 'Modifier le membre' : 'Ajouter au bureau'}
                </h2>
                <p className="text-blue-100/60 text-[10px] font-black uppercase tracking-[0.3em] mt-1">
                  {editingMember ? 'Mise à jour des responsabilités' : 'Enregistrement d\'un nouvel exécutif'}
                </p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors relative z-10"
              >
                <X size={28} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-10 lg:p-14 space-y-8">
              {error && (
                <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl flex items-center space-x-3 text-xs font-bold animate-shake">
                  <AlertCircle size={18} />
                  <span>{error}</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Prénom *</label>
                  <input 
                    type="text" required
                    value={formData.prenom}
                    onChange={e => setFormData({...formData, prenom: e.target.value})}
                    className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none font-bold text-sm focus:border-aerkm-blue transition-all"
                    placeholder="Ex: Moussa"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nom *</label>
                  <input 
                    type="text" required
                    value={formData.nom}
                    onChange={e => setFormData({...formData, nom: e.target.value})}
                    className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none font-bold text-sm focus:border-aerkm-blue transition-all"
                    placeholder="Ex: DIOP"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email *</label>
                  <input 
                    type="email" required
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none font-bold text-sm focus:border-aerkm-blue transition-all"
                    placeholder="moussa.diop@bambey.sn"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Téléphone</label>
                  <input 
                    type="tel"
                    value={formData.telephone}
                    onChange={e => setFormData({...formData, telephone: e.target.value})}
                    className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none font-bold text-sm focus:border-aerkm-blue transition-all"
                    placeholder="770000000"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Poste occupé *</label>
                  <input 
                    type="text" required
                    value={formData.bureauPosition}
                    onChange={e => setFormData({...formData, bureauPosition: e.target.value})}
                    className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none font-bold text-sm focus:border-aerkm-blue transition-all"
                    placeholder="Ex: Président, Secrétaire Général, Commission Sociale..."
                  />
                </div>
                {!editingMember && (
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Mot de passe provisoire *</label>
                    <input 
                      type="password" required
                      value={formData.password}
                      onChange={e => setFormData({...formData, password: e.target.value})}
                      className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none font-bold text-sm focus:border-aerkm-blue transition-all"
                      placeholder="Min. 6 caractères"
                    />
                  </div>
                )}
              </div>

              <div className="pt-4 flex items-center gap-4">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-8 py-5 bg-slate-100 text-slate-500 font-black rounded-2xl uppercase tracking-widest text-[10px] hover:bg-slate-200 transition-all"
                >
                  Annuler
                </button>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="flex-[2] bg-aerkm-brown hover:bg-aerkm-brownLight text-white font-black py-5 rounded-2xl shadow-xl shadow-aerkm-brown/20 transition-all flex items-center justify-center space-x-3 uppercase tracking-widest text-[10px]"
                >
                  {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                  <span>{editingMember ? 'Sauvegarder' : 'Enregistrer le membre'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Modal */}
      {isViewModalOpen && viewingMember && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-aerkm-blue/40 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-[3.5rem] shadow-3xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="h-32 bg-gradient-to-r from-aerkm-blue to-blue-600 relative">
              <button 
                onClick={() => setIsViewModalOpen(false)} 
                className="absolute top-6 right-6 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            <div className="px-10 pb-10 -mt-12 text-center">
              <div className="w-24 h-24 bg-white p-1.5 rounded-[2rem] shadow-2xl mx-auto mb-6">
                <div className="w-full h-full bg-aerkm-blue text-white rounded-[1.8rem] flex items-center justify-center text-3xl font-black uppercase">
                  {viewingMember.prenom[0]}{viewingMember.nom[0]}
                </div>
              </div>
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">{viewingMember.prenom} {viewingMember.nom}</h2>
              <span className="inline-block px-4 py-1.5 bg-aerkm-gold/10 text-aerkm-brown rounded-full text-[10px] font-black uppercase tracking-widest border border-aerkm-gold/20 mt-2">
                {viewingMember.bureauPosition}
              </span>

              <div className="mt-10 space-y-6 text-left">
                <div className="flex items-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-aerkm-blue shadow-sm mr-4">
                    <Mail size={18} />
                  </div>
                  <div>
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Email Officiel</p>
                    <p className="text-xs font-bold text-slate-700">{viewingMember.email}</p>
                  </div>
                </div>
                <div className="flex items-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-aerkm-blue shadow-sm mr-4">
                    <Phone size={18} />
                  </div>
                  <div>
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Téléphone</p>
                    <p className="text-xs font-bold text-slate-700">{viewingMember.telephone || 'Non renseigné'}</p>
                  </div>
                </div>
                <div className="flex items-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-aerkm-blue shadow-sm mr-4">
                    <ShieldCheck size={18} />
                  </div>
                  <div>
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Rôle Système</p>
                    <p className="text-xs font-bold text-slate-700">{viewingMember.role}</p>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setIsViewModalOpen(false)}
                className="w-full mt-10 py-5 bg-slate-900 text-white font-black rounded-2xl uppercase tracking-widest text-[10px] hover:bg-black transition-all shadow-xl"
              >
                Fermer l'aperçu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionBureau;
