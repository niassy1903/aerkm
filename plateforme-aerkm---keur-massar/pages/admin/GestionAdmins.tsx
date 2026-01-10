
import React, { useState } from 'react';
import { useData } from '../../context/StudentContext';
import { Plus, Search, Trash2, Edit2, X, Check, ShieldCheck, Mail, Lock, User as UserIcon } from 'lucide-react';
import { User } from '../../types';

const GestionAdmins: React.FC = () => {
  const { admins, addAdmin, updateAdmin, deleteAdmin } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<User | null>(null);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    email: '',
    password: '',
    role: 'ADMIN' as const
  });

  const resetForm = () => {
    setFormData({ prenom: '', nom: '', email: '', password: '', role: 'ADMIN' });
    setEditingAdmin(null);
    setError('');
  };

  const handleOpenModal = (admin?: User) => {
    if (admin) {
      setEditingAdmin(admin);
      setFormData({ prenom: admin.prenom, nom: admin.nom, email: admin.email, password: '', role: 'ADMIN' });
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (editingAdmin) {
      await updateAdmin({ ...editingAdmin, ...formData });
      setIsModalOpen(false);
    } else {
      const success = await addAdmin(formData);
      if (success) setIsModalOpen(false);
      else setError('Erreur : cet email est déjà utilisé par un autre administrateur.');
    }
  };

  const filteredAdmins = admins.filter(a => 
    `${a.prenom} ${a.nom}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 lg:p-12 space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-aerkm-blue tracking-tighter uppercase">Gestion Administrateurs</h1>
          <p className="text-slate-500 font-medium mt-1">Gérez les accès au bureau restreint de l'AERKM.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-aerkm-brown hover:bg-aerkm-brownLight text-white font-black py-4 px-8 rounded-2xl flex items-center justify-center space-x-3 shadow-2xl shadow-aerkm-brown/30 transition-all transform hover:scale-105 active:scale-95"
        >
          <Plus size={22} />
          <span className="text-[11px] uppercase tracking-widest">AJOUTER UN ADMIN</span>
        </button>
      </div>

      <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100">
        <div className="relative group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-aerkm-blue transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Rechercher par nom ou email..." 
            className="w-full pl-14 pr-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-aerkm-blue transition-all font-bold text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-slate-400 uppercase text-[10px] font-black tracking-[0.2em] border-b border-slate-100">
                <th className="px-10 py-6">Profil</th>
                <th className="px-10 py-6">Identifiants</th>
                <th className="px-10 py-6">Rôle</th>
                <th className="px-10 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAdmins.map((admin) => (
                <tr key={admin._id || admin.id} className="hover:bg-slate-50/30 transition-colors group">
                  <td className="px-10 py-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-2xl bg-aerkm-blue/10 text-aerkm-blue flex items-center justify-center font-black text-sm">{admin.prenom[0]}{admin.nom[0]}</div>
                      <div>
                        <p className="font-black text-slate-800 tracking-tight">{admin.prenom} {admin.nom}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Bureau AERKM</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    <div className="flex flex-col space-y-1">
                       <span className="text-sm font-bold text-slate-600">{admin.email}</span>
                       <span className="text-[10px] text-slate-300 font-mono tracking-widest">••••••••</span>
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    <span className="inline-flex items-center px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-aerkm-brown/5 text-aerkm-brown border border-aerkm-brown/10">
                      <ShieldCheck size={12} className="mr-2" />
                      FULL ACCESS
                    </span>
                  </td>
                  <td className="px-10 py-6 text-right">
                    <div className="flex items-center justify-end space-x-3">
                      <button onClick={() => handleOpenModal(admin)} className="p-3 text-slate-400 hover:text-aerkm-blue hover:bg-aerkm-blue/5 rounded-xl transition-all"><Edit2 size={18} /></button>
                      <button onClick={() => deleteAdmin(admin._id || admin.id)} className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-aerkm-blue/40 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-lg rounded-[3rem] shadow-3xl overflow-hidden animate-in zoom-in duration-300">
            <div className="bg-aerkm-blue p-8 text-white flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-black tracking-tight uppercase">{editingAdmin ? 'Éditer Admin' : 'Nouvel Administrateur'}</h2>
                <p className="text-blue-100/60 text-[10px] font-black uppercase tracking-widest mt-1">Sécurité système</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"><X size={24} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-10 space-y-6">
              {error && <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-red-100">{error}</div>}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Prénom</label><input type="text" required value={formData.prenom} onChange={e => setFormData({...formData, prenom: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-aerkm-blue transition-all font-bold text-sm" /></div>
                <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nom</label><input type="text" required value={formData.nom} onChange={e => setFormData({...formData, nom: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-aerkm-blue transition-all font-bold text-sm" /></div>
              </div>
              <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email</label><input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-aerkm-blue transition-all font-bold text-sm" /></div>
              <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Mot de passe {editingAdmin && '(Laisser vide pour garder l\'ancien)'}</label><input type="password" required={!editingAdmin} value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-aerkm-blue transition-all font-bold text-sm" /></div>
              <div className="pt-6 flex gap-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 border-2 border-slate-100 text-slate-500 font-black rounded-2xl hover:bg-slate-50 transition-all uppercase tracking-widest text-[10px]">Annuler</button>
                <button type="submit" className="flex-1 py-4 bg-aerkm-brown text-white font-black rounded-2xl hover:bg-aerkm-brownLight shadow-2xl shadow-aerkm-brown/30 transition-all flex items-center justify-center space-x-3 uppercase tracking-widest text-[10px]"><Check size={18} /><span>{editingAdmin ? 'Enregistrer' : 'Créer Admin'}</span></button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionAdmins;
