
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Calendar, 
  ArrowRight, 
  Heart, 
  GraduationCap, 
  ShieldCheck, 
  Star,
  Sparkles,
  Zap
} from 'lucide-react';
import { useData } from '../../context/StudentContext';

const Accueil: React.FC = () => {
  const { events, students } = useData();
  const latestEvents = events.slice(0, 3);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section Masterpiece */}
      <section className="relative min-h-[90vh] flex items-center bg-aerkm-blue overflow-hidden">
        {/* Animated Background elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-20 right-[-10%] w-[600px] h-[600px] bg-aerkm-brown/20 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px]"></div>
          <img 
            src="https://images.unsplash.com/photo-1523580494863-6f3031224c94?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80" 
            alt="Campus" 
            className="w-full h-full object-cover opacity-20 mix-blend-overlay"
          />
        </div>
        
        <div className="container mx-auto px-6 relative z-10 pt-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-in fade-in slide-in-from-left-8 duration-700">

              <div className="inline-flex items-center space-x-2 py-1.5 px-4 rounded-full bg-aerkm-gold/10 border border-aerkm-gold/30 text-aerkm-gold text-xs font-black uppercase tracking-[0.2em] mt-8 mb-8">
                <Sparkles size={10} />
                <span>Excellence & Solidarité</span>
              </div>

              <h1 className="text-6xl lg:text-8xl font-black text-white mb-8 leading-[0.9] tracking-tighter">
                L'Amicale qui <span className="text-aerkm-gold italic">élève</span> ses <span className="text-aerkm-brownLight">membres</span>.
              </h1>
              <p className="text-xl lg:text-2xl text-blue-100/80 mb-12 font-medium leading-relaxed max-w-xl">
                Rejoignez la communauté dynamique des étudiants de Keur Massar à Bambey. Pédagogie, social et fraternité réunis.
              </p>
              <div className="flex flex-col sm:flex-row gap-5">
                <Link to="/inscription" className="group bg-aerkm-brown hover:bg-aerkm-brownLight text-white px-10 py-5 rounded-2xl font-extrabold text-lg shadow-2xl shadow-aerkm-brown/40 transition-all flex items-center justify-center transform hover:scale-105 active:scale-95">
                  Se faire recenser
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={22} />
                </Link>
                <Link to="/aerkm" className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white px-10 py-5 rounded-2xl font-extrabold text-lg transition-all text-center">
                  Notre Vision
                </Link>
              </div>
            </div>

            <div className="hidden lg:block relative animate-in fade-in zoom-in-95 duration-1000 delay-300">
               <div className="relative z-10 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl rounded-[3rem] p-8 border border-white/10 shadow-3xl">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="bg-white p-8 rounded-[2rem] shadow-xl transform -rotate-3 hover:rotate-0 transition-transform cursor-pointer">
                      <div className="w-12 h-12 bg-aerkm-blue/10 rounded-xl flex items-center justify-center text-aerkm-blue mb-4">
                        <Users size={24} />
                      </div>
                      <p className="text-3xl font-black text-aerkm-blue">{students.length + 245}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Étudiants unis</p>
                    </div>
                    <div className="bg-aerkm-brown p-8 rounded-[2rem] shadow-xl transform rotate-6 hover:rotate-0 transition-transform cursor-pointer text-white">
                      <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-aerkm-gold mb-4">
                        <Star size={24} />
                      </div>
                      <p className="text-3xl font-black">100%</p>
                      <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Engagement</p>
                    </div>
                  </div>
                  <div className="mt-6 bg-aerkm-blue/40 border border-white/10 p-6 rounded-[2rem] flex items-center justify-between">
                    <div className="flex -space-x-3">
                      {[1,2,3,4].map(i => (
                        <img key={i} className="w-10 h-10 rounded-full border-2 border-aerkm-blue" src={`https://i.pravatar.cc/100?img=${i+10}`} alt="user" />
                      ))}
                    </div>
                    <p className="text-white text-xs font-bold">Inscris-toi maintenant !</p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social & Pédagogique - Key Values */}
      <section className="py-24 bg-white relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20 max-w-3xl mx-auto">
            <h2 className="text-sm font-black text-aerkm-brown uppercase tracking-[0.3em] mb-4">Notre Mission</h2>
            <p className="text-4xl lg:text-5xl font-black text-aerkm-blue tracking-tighter leading-none">
              Un bouclier <span className="text-aerkm-brown">social</span>,<br/>un moteur <span className="text-aerkm-gold">pédagogique</span>.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-10 rounded-[2.5rem] bg-slate-50 border border-slate-100 hover:border-aerkm-brown transition-all group">
              <div className="w-16 h-16 bg-white shadow-lg rounded-2xl flex items-center justify-center text-aerkm-brown mb-8 group-hover:scale-110 transition-transform">
                <Heart size={32} />
              </div>
              <h3 className="text-2xl font-bold text-aerkm-blue mb-4">Volet Social</h3>
              <p className="text-slate-500 leading-relaxed font-medium">
                Soutien aux bourses, aide au logement et assistance médicale. Personne n'est laissé pour compte à Keur Massar.
              </p>
            </div>

            <div className="p-10 rounded-[2.5rem] bg-aerkm-blue text-white shadow-2xl transform md:-translate-y-8">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-aerkm-gold mb-8">
                <GraduationCap size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-4">Volet Pédagogique</h3>
              <p className="text-white/70 leading-relaxed font-medium">
                Tutorat intensif, séances de révision collectives et accès à une banque de documents académiques exclusive.
              </p>
            </div>

            <div className="p-10 rounded-[2.5rem] bg-slate-50 border border-slate-100 hover:border-aerkm-gold transition-all group">
              <div className="w-16 h-16 bg-white shadow-lg rounded-2xl flex items-center justify-center text-aerkm-blue mb-8 group-hover:scale-110 transition-transform">
                <ShieldCheck size={32} />
              </div>
              <h3 className="text-2xl font-bold text-aerkm-blue mb-4">Volet Citoyen</h3>
              <p className="text-slate-500 leading-relaxed font-medium">
                Représentation auprès des autorités de Bambey et Keur Massar pour porter les projets de notre commune.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Events Grid (Gold & Brown Styling) */}
      <section className="py-24 bg-slate-50 overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
              <div className="flex items-center space-x-2 text-aerkm-brown font-bold mb-2">
                <Zap size={18} />
                <span className="text-xs uppercase tracking-widest">En Direct</span>
              </div>
              <h2 className="text-4xl font-black text-aerkm-blue tracking-tighter">Prochains Événements</h2>
            </div>
            <Link to="/evenements" className="group px-8 py-4 bg-white border-2 border-aerkm-blue/5 text-aerkm-blue font-black rounded-2xl hover:bg-aerkm-blue hover:text-white transition-all shadow-sm flex items-center">
              Voir tout l'agenda <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {latestEvents.map((evt) => (
              <div key={evt.id} className="group bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all border border-slate-100">
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={`https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80&random=${evt.id}`} 
                    alt={evt.titre} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                  />
                  <div className="absolute top-6 left-6">
                    <span className="bg-aerkm-brown text-white text-[10px] font-black px-4 py-2 rounded-xl uppercase tracking-[0.2em] shadow-xl">
                      {evt.type}
                    </span>
                  </div>
                </div>
                <div className="p-10">
                  <h3 className="text-2xl font-black text-aerkm-blue mb-4 group-hover:text-aerkm-brown transition-colors">{evt.titre}</h3>
                  <div className="flex items-center text-slate-400 text-sm font-bold">
                    <Calendar size={18} className="mr-2 text-aerkm-gold" /> 
                    {new Date(evt.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}
                  </div>
                  <div className="mt-8 pt-6 border-t border-slate-50 flex justify-between items-center">
                    <span className="text-aerkm-blue font-black text-sm">Découvrir</span>
                    <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-aerkm-blue group-hover:bg-aerkm-gold transition-colors">
                      <ArrowRight size={18} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Section / Footer CTA */}
      <section className="py-32 relative bg-aerkm-blue text-white overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none select-none overflow-hidden">
           <span className="text-[20rem] font-black absolute -top-20 -right-20">AERKM</span>
        </div>
        <div className="container mx-auto px-6 text-center relative z-10">
          <h2 className="text-5xl lg:text-7xl font-black mb-10 leading-[0.9] tracking-tighter">
            Prêt à bâtir <br/>le <span className="text-aerkm-gold italic">futur</span> avec nous ?
          </h2>
          <p className="text-xl text-blue-100/60 mb-12 max-w-2xl mx-auto font-medium">
            Le recensement est la première étape de ton intégration. Fais-le aujourd'hui pour bénéficier de tous nos services.
          </p>
          <Link to="/inscription" className="inline-block bg-aerkm-brown hover:bg-aerkm-brownLight text-white px-12 py-6 rounded-[2rem] font-black text-2xl shadow-3xl shadow-aerkm-brown/30 transition-all transform hover:scale-105 active:scale-95">
            REJOINDRE LA FAMILLE
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Accueil;
