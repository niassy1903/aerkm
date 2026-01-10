
import React, { useState } from 'react';
import { useData } from '../../context/StudentContext';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  ArrowRight, 
  Search, 
  Sparkles, 
  CalendarDays, 
  Filter,
  Zap,
  Bookmark
} from 'lucide-react';
import { EVENT_TYPES } from '../../constants';

const Evenements: React.FC = () => {
  const { events } = useData();
  const [filter, setFilter] = useState('Tous');
  const [searchTerm, setSearchTerm] = useState('');
  
  const categories = ['Tous', ...EVENT_TYPES.slice(0, 5)];
  
  const filteredEvents = events.filter(e => {
    const matchesCategory = filter === 'Tous' || e.type === filter;
    const matchesSearch = e.titre.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          e.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch && e.published;
  });

  return (
    <div className="bg-white min-h-screen pb-24">
      {/* Header Section - Modern & Impactful */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 bg-[#0a192f] overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-aerkm-blue/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-aerkm-gold/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl">
            <div className="inline-flex items-center space-x-2 py-2 px-6 rounded-full bg-white/5 border border-white/10 text-aerkm-gold text-[10px] font-black uppercase tracking-[0.4em] mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <CalendarDays size={16} />
              <span>Agenda de l'Excellence</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-black text-white tracking-tighter leading-none mb-8 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
              Vivez les moments <br/>
              <span className="text-aerkm-gold italic">forts</span> de l'amicale.
            </h1>
            <p className="text-xl text-blue-100/60 max-w-2xl font-medium leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
              Retrouvez toutes les activités pédagogiques, culturelles et sociales organisées par le bureau de l'AERKM pour accompagner votre réussite.
            </p>
          </div>
        </div>
      </section>

      {/* Control Bar - Search & Filters */}
      <section className="relative z-20 -mt-10">
        <div className="container mx-auto px-6">
          <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/60 border border-slate-100 p-4 lg:p-6 flex flex-col lg:flex-row items-stretch lg:items-center gap-6">
            {/* Search Input */}
            <div className="relative flex-1 group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-aerkm-blue transition-colors" size={20} />
              <input 
                type="text" 
                placeholder="Rechercher un événement..." 
                className="w-full pl-16 pr-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-[1.8rem] outline-none focus:border-aerkm-blue focus:bg-white transition-all font-bold text-slate-800"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-2 lg:pb-0 px-2 lg:px-0">
              <div className="flex items-center space-x-2 text-slate-400 mr-2 shrink-0">
                <Filter size={18} />
                <span className="text-[10px] font-black uppercase tracking-widest">Filtrer</span>
              </div>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all whitespace-nowrap ${
                    filter === cat 
                    ? 'bg-aerkm-blue text-white shadow-xl shadow-aerkm-blue/20 transform scale-105' 
                    : 'bg-slate-50 text-slate-500 hover:bg-slate-100 border border-slate-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-24 container mx-auto px-6">
        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {filteredEvents.map((evt, index) => (
              <div 
                key={evt.id} 
                className="group bg-white rounded-[3.5rem] overflow-hidden shadow-sm hover:shadow-3xl transition-all duration-700 border border-slate-100 flex flex-col animate-in fade-in slide-in-from-bottom-8 duration-700"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Image & Type Overlay */}
                <div className="relative h-72 overflow-hidden">
                  <img 
                    src={evt.imageUrl || `https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80&random=${evt.id}`} 
                    alt={evt.titre} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 grayscale-[20%] group-hover:grayscale-0"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  
                  <div className="absolute top-6 left-6">
                    <span className="bg-white/95 backdrop-blur-md text-aerkm-blue text-[9px] font-black px-5 py-2.5 rounded-2xl uppercase tracking-[0.2em] shadow-2xl flex items-center space-x-2">
                      <Zap size={12} className="text-aerkm-gold" />
                      <span>{evt.type}</span>
                    </span>
                  </div>

                  <button className="absolute top-6 right-6 w-12 h-12 bg-white/20 backdrop-blur-md text-white rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-aerkm-gold hover:text-aerkm-blue">
                    <Bookmark size={20} />
                  </button>
                </div>

                {/* Event Content */}
                <div className="p-10 flex-1 flex flex-col">
                  <h3 className="text-2xl font-black text-aerkm-blue mb-4 group-hover:text-aerkm-brown transition-colors tracking-tight leading-tight">
                    {evt.titre}
                  </h3>
                  <p className="text-slate-500 text-sm font-medium leading-relaxed line-clamp-2 mb-8 flex-grow">
                    {evt.description}
                  </p>
                  
                  <div className="space-y-4 pt-6 border-t border-slate-50">
                    <div className="flex items-center text-slate-400 font-bold text-[11px] uppercase tracking-widest">
                      <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center mr-3 text-aerkm-gold group-hover:bg-aerkm-gold group-hover:text-white transition-colors">
                        <Calendar size={14} />
                      </div>
                      {new Date(evt.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                    </div>
                    
                    <div className="flex items-center text-slate-400 font-bold text-[11px] uppercase tracking-widest">
                      <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center mr-3 text-aerkm-blue group-hover:bg-aerkm-blue group-hover:text-white transition-colors">
                        <MapPin size={14} />
                      </div>
                      {evt.lieu}
                    </div>
                  </div>

                  <div className="mt-10">
                    <button className="w-full py-5 bg-slate-50 text-slate-900 font-black rounded-3xl hover:bg-aerkm-blue hover:text-white transition-all transform active:scale-95 flex items-center justify-center space-x-3 uppercase tracking-widest text-[10px] group/btn">
                      <span>Détails de l'événement</span>
                      <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-32 text-center animate-in fade-in zoom-in duration-500">
            <div className="bg-slate-50 inline-block p-16 rounded-[4rem] border border-slate-100 relative">
              <div className="absolute -top-10 -right-10 w-20 h-20 bg-aerkm-gold rounded-full flex items-center justify-center text-aerkm-blue shadow-xl">
                <Sparkles size={32} />
              </div>
              <Calendar size={80} className="mx-auto text-slate-200 mb-8" strokeWidth={1} />
              <h3 className="text-3xl font-black text-aerkm-blue mb-4 tracking-tighter">Aucun résultat trouvé</h3>
              <p className="text-slate-500 font-medium max-w-sm mx-auto">
                Nous n'avons trouvé aucun événement correspondant à votre recherche. Essayez d'autres mots-clés ou filtres.
              </p>
              <button 
                onClick={() => { setFilter('Tous'); setSearchTerm(''); }}
                className="mt-8 text-aerkm-brown font-black uppercase text-[10px] tracking-widest hover:underline"
              >
                Réinitialiser les filtres
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Suggestion CTA */}
      <section className="container mx-auto px-6">
        <div className="bg-[#0a192f] p-12 lg:p-20 rounded-[4rem] text-white relative overflow-hidden shadow-3xl">
          <div className="absolute top-0 right-0 p-12 opacity-10">
            <Sparkles size={150} />
          </div>
          <div className="max-w-3xl relative z-10">
            <h2 className="text-4xl lg:text-5xl font-black tracking-tighter leading-none mb-6">
              Une idée d'activité ? <br/>
              <span className="text-aerkm-gold">Soumettez-la nous !</span>
            </h2>
            <p className="text-blue-100/60 text-lg font-medium leading-relaxed mb-10">
              L'agenda de l'amicale est participatif. Si vous souhaitez proposer une conférence, un tournoi ou une sortie, contactez directement le bureau exécutif.
            </p>
            <button className="px-10 py-5 bg-aerkm-gold text-aerkm-blue rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-white transition-all transform hover:scale-105 active:scale-95 shadow-xl shadow-aerkm-gold/20">
              Proposer une activité
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Evenements;
