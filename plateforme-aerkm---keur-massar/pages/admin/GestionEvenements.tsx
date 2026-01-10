
import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../../context/StudentContext';
import { EVENT_TYPES } from '../../constants';
import { Plus, Search, Calendar, MapPin, Trash2, Edit2, X, Check, Eye, Image as ImageIcon, UploadCloud } from 'lucide-react';
import { Evenement } from '../../types';

const GestionEvenements: React.FC = () => {
  const { events, addEvent, updateEvent, deleteEvent } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Evenement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    titre: '',
    type: EVENT_TYPES[0],
    description: '',
    date: '',
    heure: '',
    lieu: '',
    imageUrl: '',
    published: true
  });

  const resetForm = () => {
    setFormData({
      titre: '',
      type: EVENT_TYPES[0],
      description: '',
      date: '',
      heure: '',
      lieu: '',
      imageUrl: '',
      published: true
    });
    setEditingEvent(null);
  };

  const handleOpenModal = (event?: Evenement) => {
    if (event) {
      setEditingEvent(event);
      setFormData({
        titre: event.titre,
        type: event.type,
        description: event.description,
        date: event.date,
        heure: event.heure,
        lieu: event.lieu,
        imageUrl: event.imageUrl || '',
        published: event.published
      });
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, imageUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingEvent) {
      updateEvent({ ...editingEvent, ...formData });
    } else {
      addEvent(formData);
    }
    setIsModalOpen(false);
    resetForm();
  };

  const filteredEvents = events.filter(e => 
    e.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 lg:p-12 space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-aerkm-blue tracking-tighter">Gestion Événements</h1>
          <p className="text-slate-500 font-medium mt-1 italic">Planifiez et publiez l'agenda de l'excellence.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-aerkm-brown hover:bg-aerkm-brownLight text-white font-black py-4 px-8 rounded-2xl flex items-center justify-center space-x-3 shadow-2xl shadow-aerkm-brown/30 transition-all transform hover:scale-105 active:scale-95"
        >
          <Plus size={22} />
          <span>CRÉER UN ÉVÉNEMENT</span>
        </button>
      </div>

      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
        <div className="relative">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Rechercher par titre, type..." 
            className="w-full pl-14 pr-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-aerkm-blue transition-all font-bold"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {filteredEvents.map((evt) => (
          <div key={evt.id} className="group bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden hover:shadow-2xl transition-all duration-500 flex flex-col">
            <div className="relative h-56 overflow-hidden">
              <img 
                src={evt.imageUrl || `https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80&random=${evt.id}`} 
                alt={evt.titre} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
              />
              <div className="absolute top-5 right-5 flex space-x-2 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                <button 
                  onClick={() => handleOpenModal(evt)}
                  className="p-3 bg-white text-blue-600 rounded-xl shadow-xl hover:bg-blue-600 hover:text-white transition-all"
                >
                  <Edit2 size={18} />
                </button>
                <button 
                  onClick={() => deleteEvent(evt.id)}
                  className="p-3 bg-white text-red-600 rounded-xl shadow-xl hover:bg-red-600 hover:text-white transition-all"
                >
                  <Trash2 size={18} />
                </button>
              </div>
              <div className="absolute bottom-5 left-5">
                 <span className="bg-aerkm-blue text-white text-[10px] font-black px-4 py-2 rounded-xl uppercase tracking-widest shadow-lg">
                    {evt.type}
                 </span>
              </div>
            </div>
            <div className="p-8 flex-1 flex flex-col">
              <h3 className="text-2xl font-black text-aerkm-blue mb-3 group-hover:text-aerkm-brown transition-colors">{evt.titre}</h3>
              <p className="text-slate-500 text-sm line-clamp-2 mb-6 font-medium leading-relaxed">{evt.description}</p>
              
              <div className="mt-auto space-y-3 pt-6 border-t border-slate-50">
                <div className="flex items-center text-slate-400 font-bold text-xs uppercase tracking-wider">
                  <Calendar size={16} className="mr-3 text-aerkm-gold" />
                  {new Date(evt.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })} à {evt.heure}
                </div>
                <div className="flex items-center text-slate-400 font-bold text-xs uppercase tracking-wider">
                  <MapPin size={16} className="mr-3 text-red-400" />
                  {evt.lieu}
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <span className={`text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full ${evt.published ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                  {evt.published ? 'Visible' : 'Brouillon'}
                </span>
                <Link to="/evenements" className="text-aerkm-blue font-black text-xs uppercase tracking-widest hover:text-aerkm-brown flex items-center group/btn">
                  <Eye size={16} className="mr-2" />
                  Voir l'aperçu
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-aerkm-blue/40 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-3xl overflow-hidden animate-in zoom-in duration-300">
            <div className="bg-aerkm-blue p-8 text-white flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-black tracking-tight">{editingEvent ? 'Modifier l\'événement' : 'Nouvel Événement'}</h2>
                <p className="text-blue-100/60 text-xs font-bold uppercase tracking-widest mt-1">Édition administrative</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-10 space-y-8 overflow-y-auto max-h-[75vh] custom-scrollbar">
              <div className="space-y-6">
                
                {/* Image Upload Zone */}
                <div className="space-y-2">
                   <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Illustration de l'événement</label>
                   <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="relative h-48 bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center cursor-pointer hover:border-aerkm-blue hover:bg-aerkm-blue/5 transition-all overflow-hidden"
                   >
                     {formData.imageUrl ? (
                       <img src={formData.imageUrl} className="w-full h-full object-cover" alt="Preview" />
                     ) : (
                       <>
                         <UploadCloud size={40} className="text-slate-300 mb-2" />
                         <span className="text-sm font-bold text-slate-400">Cliquez pour uploader une photo</span>
                         <span className="text-[10px] text-slate-300 mt-1 uppercase font-black">PNG, JPG ou JPEG</span>
                       </>
                     )}
                     <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="hidden" 
                      accept="image/*" 
                      onChange={handleImageChange} 
                     />
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Titre</label>
                    <input 
                      type="text" required value={formData.titre} 
                      onChange={e => setFormData({...formData, titre: e.target.value})}
                      className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-aerkm-blue transition-all font-bold text-slate-800"
                      placeholder="Ex: Journée Culturelle 2024"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Type d'activité</label>
                    <select 
                      value={formData.type} 
                      onChange={e => setFormData({...formData, type: e.target.value})}
                      className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-aerkm-blue transition-all font-bold text-slate-800"
                    >
                      {EVENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Lieu</label>
                    <input 
                      type="text" required value={formData.lieu} 
                      onChange={e => setFormData({...formData, lieu: e.target.value})}
                      className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-aerkm-blue transition-all font-bold text-slate-800"
                      placeholder="Ex: Amphi de Bambey"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Date</label>
                    <input 
                      type="date" required value={formData.date} 
                      onChange={e => setFormData({...formData, date: e.target.value})}
                      className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-aerkm-blue transition-all font-bold text-slate-800"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Heure</label>
                    <input 
                      type="time" required value={formData.heure} 
                      onChange={e => setFormData({...formData, heure: e.target.value})}
                      className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-aerkm-blue transition-all font-bold text-slate-800"
                    />
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Description détaillée</label>
                    <textarea 
                      required rows={4} value={formData.description} 
                      onChange={e => setFormData({...formData, description: e.target.value})}
                      className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-aerkm-blue transition-all font-bold text-slate-800"
                      placeholder="Décrivez les objectifs, le programme..."
                    ></textarea>
                  </div>

                  <div className="md:col-span-2 bg-slate-50 p-6 rounded-3xl border border-slate-100">
                    <label className="flex items-center space-x-4 cursor-pointer group">
                      <div className="relative">
                        <input 
                          type="checkbox" 
                          checked={formData.published} 
                          onChange={e => setFormData({...formData, published: e.target.checked})}
                          className="peer sr-only"
                        />
                        <div className="w-14 h-8 bg-slate-300 rounded-full peer-checked:bg-green-500 transition-colors"></div>
                        <div className="absolute top-1 left-1 w-6 h-6 bg-white rounded-full peer-checked:translate-x-6 transition-transform"></div>
                      </div>
                      <span className="font-bold text-slate-700">Publier officiellement sur l'agenda public</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-5 border-2 border-slate-100 text-slate-500 font-black rounded-2xl hover:bg-slate-50 transition-all uppercase tracking-widest text-xs"
                >
                  Annuler
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-5 bg-aerkm-blue text-white font-black rounded-2xl hover:bg-aerkm-blue/90 shadow-2xl shadow-aerkm-blue/30 transition-all transform active:scale-95 flex items-center justify-center space-x-3 uppercase tracking-widest text-xs"
                >
                  <Check size={20} />
                  <span>{editingEvent ? 'ENREGISTRER' : 'CRÉER L\'ÉVÉNEMENT'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionEvenements;
