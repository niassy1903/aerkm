
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
  User as UserIcon
} from 'lucide-react';
import { User as UserType } from '../../types';

const BUREAU_POSITIONS: Record<string, Record<string, string>> = {
  "Bureau Exécutif": {
    "Président(e)": "Représente l'amicale, coordonne les activités et préside les réunions du bureau exécutif.",
    "Vice-Président(e)": "Assiste le président dans ses fonctions et le remplace en cas d'empêchement.",
    "Secrétaire Général(e)": "Responsable de l'administration, de la rédaction des procès-verbaux et de la correspondance.",
    "Secrétaire Général(e) Adjoint(e)": "Assiste le secrétaire général dans les tâches administratives.",
    "Trésorier(ère) Général(e)": "Gère les finances de l'amicale, tient la comptabilité et prépare les rapports financiers.",
    "Trésorier(ère) Général(e) Adjoint(e)": "Assiste le trésorier dans la gestion financière."
  },
  "Commission Organisation": {
    "Président(e) de la Commission Organisation": "Planifie et supervise l'organisation logistique de tous les événements de l'amicale.",
    "1er Adjoint(e)": "Assiste le président de commission dans la coordination logistique.",
    "2e Adjoint(e)": "Soutien opérationnel pour l'organisation des activités.",
    "3e Adjoint(e)": "Soutien opérationnel pour l'organisation des activités.",
    "4e Adjoint(e)": "Soutien opérationnel pour l'organisation des activités."
  },
  "Commission Pédagogique": {
    "Président(e) Commission Pédagogique": "Coordonne les activités de soutien académique et les relations avec l'administration universitaire.",
    "Vice-Président(e)": "Assiste à la coordination des projets pédagogiques.",
    "1er Adjoint(e)": "Soutien à l'organisation des tutorats et séances de révision.",
    "2e Adjoint(e)": "Soutien à l'organisation des tutorats et séances de révision.",
    "Chargé(e) des Relations Académiques": "Assure la liaison entre les étudiants et le corps professoral.",
    "Chargé(e) du Suivi des Cours et Examens": "Veille à la disponibilité des supports de cours et au bon déroulement des examens."
  },
  "Commission Sociale": {
    "Président(e) Commission Sociale": "Pilote les actions d'entraide, de solidarité et d'intégration des membres.",
    "Vice-Président(e)": "Assiste dans la mise en œuvre des projets sociaux.",
    "1er Adjoint(e)": "Soutien aux activités sociales et caritatives.",
    "2e Adjoint(e)": "Soutien aux activités sociales et caritatives.",
    "Chargé(e) de l’Assistance Sociale": "Identifie et accompagne les étudiants en difficulté.",
    "Chargé(e) des Activités Communautaires": "Organise des moments de partage et de cohésion sociale."
  },
  "Commission Communication": {
    "Président(e) Commission Communication": "Définit la stratégie de communication et veille à l'image de marque de l'amicale.",
    "Vice-Président(e)": "Assiste dans la gestion des canaux de communication.",
    "Chargé(e) de Communication Digitale": "Gère le site web et les outils numériques de l'amicale.",
    "Chargé(e) des Réseaux Sociaux": "Anime les pages sociales (Facebook, Instagram, WhatsApp, etc.).",
    "Chargé(e) de Presse et Relations Publiques": "Assure les relations avec les médias et les partenaires externes.",
    "Graphiste / Designer": "Crée les supports visuels (affiches, logos, vidéos) pour les activités."
  },
  "Commission Santé": {
    "Président(e) Commission Santé": "Organise les campagnes de santé et gère les urgences médicales des étudiants.",
    "Vice-Président(e)": "Assiste dans la coordination des actions de santé.",
    "Chargé(e) de Prévention": "Sensibilise sur les risques sanitaires et les bonnes pratiques.",
    "Chargé(e) des Campagnes de Sensibilisation": "Planifie les journées de don de sang et de dépistage.",
    "Responsable des Urgences Étudiantes": "Point focal pour l'assistance médicale rapide."
  },
  "Commission Sport": {
    "Président(e) Commission Sport": "Promeut la pratique sportive et organise les tournois inter-étudiants.",
    "Vice-Président(e)": "Assiste dans la gestion des activités sportives.",
    "1er Adjoint(e)": "Soutien à l'organisation des compétitions.",
    "2e Adjoint(e)": "Soutien à l'organisation des compétitions.",
    "Responsable Football": "Gère l'équipe de football de l'amicale.",
    "Responsable Basketball": "Gère l'équipe de basketball de l'amicale.",
    "Responsable Athlétisme": "Coordonne les activités d'athlétisme.",
    "Responsable Événements Sportifs": "Logistique spécifique aux rencontres sportives."
  },
  "Autres Postes": {
    "Commissaire aux Comptes": "Vérifie la régularité des comptes et la gestion financière du trésorier.",
    "Conseiller(e) Spécial(e)": "Apporte son expertise et ses conseils au bureau exécutif.",
    "Porte-Parole": "Porte la parole officielle de l'amicale lors des événements publics.",
    "Responsable Partenariats": "Recherche et gère les relations avec les sponsors et partenaires.",
    "Responsable Culture": "Organise les journées culturelles et les activités artistiques.",
    "Responsable Innovation / Numérique": "Propose des solutions technologiques pour moderniser l'amicale.",
    "Responsable Logistique": "Gère le matériel et les équipements de l'amicale."
  }
};

const GestionBureau: React.FC = () => {
  const { students, bureauMembers, updateBureauStatus } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [positionFilter, setPositionFilter] = useState('Tous');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<UserType | null>(null);
  const [viewingMember, setViewingMember] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Student selection for new member
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [studentSearch, setStudentSearch] = useState('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [formData, setFormData] = useState({
    bureauPosition: '',
    bureauMandat: '2024-2025',
    bureauOrder: 0,
    bureauBio: ''
  });

  const handlePositionChange = (pos: string) => {
    let description = "";
    for (const category in BUREAU_POSITIONS) {
      if (BUREAU_POSITIONS[category][pos]) {
        description = BUREAU_POSITIONS[category][pos];
        break;
      }
    }
    setFormData({
      ...formData,
      bureauPosition: pos,
      bureauBio: description || formData.bureauBio
    });
  };

  const filteredStudents = useMemo(() => {
    if (!studentSearch) return [];
    return students.filter(s => 
      !bureauMembers.some(m => m._id === s._id || m.email === s.email) &&
      (`${s.prenom} ${s.nom}`.toLowerCase().includes(studentSearch.toLowerCase()) ||
       s.email.toLowerCase().includes(studentSearch.toLowerCase()))
    ).slice(0, 5);
  }, [students, studentSearch, bureauMembers]);

  const positions = useMemo(() => {
    const p = new Set(bureauMembers.map(m => m.bureauPosition).filter(Boolean));
    return ['Tous', ...Array.from(p)];
  }, [bureauMembers]);

  const filteredBureau = useMemo(() => {
    return bureauMembers.filter(m => {
      const matchesSearch = `${m.prenom} ${m.nom}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            (m.bureauPosition || '').toLowerCase().includes(searchTerm.toLowerCase());
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
    setSelectedStudentId('');
    setStudentSearch('');
    setFormData({
      bureauPosition: '',
      bureauMandat: '2024-2025',
      bureauOrder: bureauMembers.length,
      bureauBio: ''
    });
    setError('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (member: UserType) => {
    setEditingMember(member);
    setFormData({
      bureauPosition: member.bureauPosition || '',
      bureauMandat: member.bureauMandat || '2024-2025',
      bureauOrder: member.bureauOrder || 0,
      bureauBio: member.bureauBio || ''
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
        await updateBureauStatus(editingMember._id || editingMember.id, true, formData);
      } else {
        if (!selectedStudentId) {
          setError('Veuillez sélectionner un étudiant.');
          setLoading(false);
          return;
        }
        await updateBureauStatus(selectedStudentId, true, formData);
      }
      setIsModalOpen(false);
    } catch (err) {
      setError("Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Supprimer ce membre du bureau ? (L'étudiant restera dans la base de données)")) {
      setLoading(true);
      await updateBureauStatus(id, false, { bureauPosition: '', bureauMandat: '', bureauOrder: 0, bureauBio: '' });
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
                {!editingMember && (
                  <div className="space-y-2 md:col-span-2 relative">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Sélectionner un étudiant *</label>
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                      <input 
                        type="text"
                        value={studentSearch}
                        onChange={e => { setStudentSearch(e.target.value); setSelectedStudentId(''); }}
                        className="w-full pl-12 pr-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none font-bold text-sm focus:border-aerkm-blue transition-all"
                        placeholder="Rechercher par nom ou email..."
                      />
                    </div>
                    {filteredStudents.length > 0 && !selectedStudentId && (
                      <div className="absolute z-50 w-full mt-2 bg-white border border-slate-100 rounded-2xl shadow-2xl overflow-hidden">
                        {filteredStudents.map(s => (
                          <button
                            key={s._id}
                            type="button"
                            onClick={() => {
                              setSelectedStudentId(s._id || '');
                              setStudentSearch(`${s.prenom} ${s.nom} (${s.email})`);
                            }}
                            className="w-full px-6 py-4 text-left hover:bg-slate-50 flex items-center justify-between border-b border-slate-50 last:border-0"
                          >
                            <div>
                              <p className="text-sm font-black text-slate-900 uppercase">{s.prenom} {s.nom}</p>
                              <p className="text-[10px] text-slate-400 font-bold">{s.email}</p>
                            </div>
                            <Check size={16} className="text-aerkm-gold" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <div className="space-y-2 md:col-span-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Poste occupé *</label>
                  <select 
                    required
                    value={formData.bureauPosition}
                    onChange={e => handlePositionChange(e.target.value)}
                    className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none font-bold text-sm focus:border-aerkm-blue transition-all appearance-none cursor-pointer"
                  >
                    <option value="" disabled>Sélectionner un poste...</option>
                    {Object.entries(BUREAU_POSITIONS).map(([category, positions]) => (
                      <optgroup key={category} label={category}>
                        {Object.keys(positions).map(pos => (
                          <option key={pos} value={pos}>{pos}</option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Mandat *</label>
                  <input 
                    type="text" required
                    value={formData.bureauMandat}
                    onChange={e => setFormData({...formData, bureauMandat: e.target.value})}
                    className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none font-bold text-sm focus:border-aerkm-blue transition-all"
                    placeholder="Ex: 2024-2025"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Ordre d'affichage</label>
                  <input 
                    type="number"
                    value={formData.bureauOrder}
                    onChange={e => setFormData({...formData, bureauOrder: parseInt(e.target.value)})}
                    className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none font-bold text-sm focus:border-aerkm-blue transition-all"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Biographie / Description</label>
                  <textarea 
                    value={formData.bureauBio}
                    onChange={e => setFormData({...formData, bureauBio: e.target.value})}
                    className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none font-bold text-sm focus:border-aerkm-blue transition-all h-32 resize-none"
                    placeholder="Brève présentation du membre..."
                  />
                </div>
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
                {viewingMember.bureauBio && (
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-2">Biographie</p>
                    <p className="text-xs font-medium text-slate-600 leading-relaxed italic">"{viewingMember.bureauBio}"</p>
                  </div>
                )}
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
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Mandat</p>
                    <p className="text-xs font-bold text-slate-700">{viewingMember.bureauMandat}</p>
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
