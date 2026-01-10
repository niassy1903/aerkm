
import React from 'react';
import { 
  Heart, 
  BookOpen, 
  ShieldCheck, 
  Users, 
  Target, 
  Award, 
  Sparkles, 
  ArrowRight, 
  Globe, 
  Flame,
  Zap,
  CheckCircle2
} from 'lucide-react';
import { Link } from 'react-router-dom';

const AERKM: React.FC = () => {
  return (
    <div className="bg-white overflow-hidden">
      {/* Hero Section - The Soul of the Amicale */}
      <section className="relative pt-32 pb-24 lg:pt-48 lg:pb-40 bg-[#0a192f] overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-aerkm-blue/20 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/2 animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-aerkm-gold/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2"></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center space-x-2 py-2 px-6 rounded-full bg-white/5 border border-white/10 text-aerkm-gold text-[10px] font-black uppercase tracking-[0.4em] mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <Sparkles size={16} />
              <span>Depuis Keur Massar vers l'Excellence</span>
            </div>
            <h1 className="text-5xl lg:text-8xl font-black text-white tracking-tighter leading-[0.9] mb-10 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
              Bien plus qu'une amicale, <br/>
              <span className="text-aerkm-gold italic">une identité</span>.
            </h1>
            <p className="text-xl lg:text-2xl text-blue-100/60 font-medium leading-relaxed mb-12 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
              L'AERKM est le pont fraternel qui unit les étudiants de Keur Massar à l'Université de Bambey, cultivant le savoir, la solidarité et l'ambition citoyenne.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300">
              <Link to="/inscription" className="w-full sm:w-auto px-10 py-5 bg-aerkm-brown text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl shadow-aerkm-brown/40 hover:bg-aerkm-brownLight transition-all transform hover:scale-105 active:scale-95">
                Rejoindre le mouvement
              </Link>
              <a href="#vision" className="w-full sm:w-auto px-10 py-5 bg-white/10 text-white rounded-2xl font-black text-sm uppercase tracking-widest backdrop-blur-md border border-white/10 hover:bg-white/20 transition-all">
                Découvrir nos piliers
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Numbers - Fast Presentation */}
      <section className="relative z-20 -mt-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {[
              { label: "Membres", value: "850+", icon: <Users size={20} /> },
              { label: "Réussite", value: "94%", icon: <Award size={20} /> },
              { label: "Logements", value: "12", icon: <CheckCircle2 size={20} /> },
              { label: "Projets", value: "25/an", icon: <Zap size={20} /> },
            ].map((stat, i) => (
              <div key={i} className="bg-white p-6 md:p-8 rounded-[2rem] shadow-2xl shadow-slate-200/50 border border-slate-50 text-center flex flex-col items-center">
                <div className="w-10 h-10 bg-aerkm-blue/5 text-aerkm-blue rounded-xl flex items-center justify-center mb-4">
                  {stat.icon}
                </div>
                <p className="text-3xl font-black text-aerkm-blue tracking-tighter">{stat.value}</p>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Genèse & Vision Section */}
      <section id="vision" className="py-32 lg:py-48 container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="relative group">
            <div className="absolute -top-10 -left-10 w-full h-full bg-aerkm-blue/5 rounded-[4rem] -rotate-3 group-hover:rotate-0 transition-transform duration-700"></div>
            <img 
              src="/assets/uadb.jpeg" 
              alt="Coopération étudiante" 
              className="relative z-10 rounded-[3.5rem] shadow-3xl grayscale-[30%] hover:grayscale-0 transition-all duration-700"
            />
            <div className="absolute -bottom-8 -right-8 z-20 bg-aerkm-gold p-8 rounded-[2.5rem] shadow-2xl max-w-[240px] hidden md:block animate-bounce-slow">
              <p className="text-aerkm-blue font-black text-lg leading-tight">
                "Unis pour l'excellence pédagogique."
              </p>
            </div>
          </div>
          
          <div className="space-y-10">
            <div>
              <h2 className="text-sm font-black text-aerkm-brown uppercase tracking-[0.3em] mb-4">Genèse & Vision</h2>
              <h3 className="text-4xl lg:text-6xl font-black text-aerkm-blue tracking-tighter leading-none mb-8">
                Un héritage de <span className="text-aerkm-brown">solidarité</span> active.
              </h3>
              <p className="text-lg text-slate-500 font-medium leading-relaxed">
                Née d'une volonté farouche de ne laisser aucun étudiant de Keur Massar livré à lui-même dans les défis du campus de Bambey, l'AERKM a su transformer la solidarité géographique en une force académique et sociale incontournable.
              </p>
            </div>
            
            <div className="space-y-6">
              {[
                { title: "Rayonnement", text: "Promouvoir les talents de Keur Massar au sein de l'université.", icon: <Globe className="text-aerkm-gold" /> },
                { title: "Entraide", text: "Créer un filet de sécurité pour les plus vulnérables.", icon: <Heart className="text-red-500" /> },
                { title: "Succès", text: "Accompagner chaque membre vers l'obtention de son diplôme.", icon: <Target className="text-aerkm-blue" /> },
              ].map((item, i) => (
                <div key={i} className="flex items-start space-x-5 p-6 rounded-3xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-xl transition-all cursor-default">
                  <div className="shrink-0 mt-1">{item.icon}</div>
                  <div>
                    <h4 className="text-lg font-black text-slate-900 leading-none mb-2">{item.title}</h4>
                    <p className="text-sm text-slate-500 font-medium leading-snug">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* The 4 Pillars Section */}
      <section className="py-32 bg-[#0a192f] text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-aerkm-blue/10 rounded-full blur-[120px]"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-24 max-w-3xl mx-auto">
            <h2 className="text-xs font-black text-aerkm-gold uppercase tracking-[0.4em] mb-6">Domaines d'Action</h2>
            <p className="text-4xl lg:text-6xl font-black tracking-tighter leading-none">
              Nos piliers pour bâtir <br/> <span className="text-aerkm-gold">votre avenir</span>.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { 
                title: "Pédagogie", 
                icon: <BookOpen size={32} />, 
                desc: "Tutorat de masse, séances de révisions collectives et accès à une banque de documents.",
                color: "bg-blue-500/10 text-blue-400"
              },
              { 
                title: "Social", 
                icon: <Heart size={32} />, 
                desc: "Aide au logement, bourses internes et assistance médicale pour tous les membres.",
                color: "bg-red-500/10 text-red-400"
              },
              { 
                title: "Culture", 
                icon: <Flame size={32} />, 
                desc: "Organisation de journées culturelles, excursions et activités de cohésion sociale.",
                color: "bg-orange-500/10 text-orange-400"
              },
              { 
                title: "Citoyenneté", 
                icon: <ShieldCheck size={32} />, 
                desc: "Représentation officielle et plaidoyer auprès des autorités de Keur Massar et Bambey.",
                color: "bg-green-500/10 text-green-400"
              }
            ].map((pillar, i) => (
              <div key={i} className="group p-10 rounded-[3rem] bg-white/5 border border-white/10 hover:bg-white/10 hover:border-aerkm-gold transition-all duration-500 flex flex-col items-center text-center">
                <div className={`w-20 h-20 ${pillar.color} rounded-[2rem] flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                  {pillar.icon}
                </div>
                <h3 className="text-2xl font-black mb-4 tracking-tight">{pillar.title}</h3>
                <p className="text-blue-100/40 text-sm font-medium leading-relaxed mb-10">{pillar.desc}</p>
                <div className="mt-auto opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-8 h-1 bg-aerkm-gold rounded-full"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Manifeste Section */}
      <section className="py-32 lg:py-48 bg-white overflow-hidden relative">
        <div className="absolute top-0 right-0 p-24 text-slate-50 opacity-10 pointer-events-none select-none">
          <Award size={400} />
        </div>
        <div className="container mx-auto px-6 relative z-10 text-center">
          <div className="max-w-4xl mx-auto space-y-12">
            <h2 className="text-sm font-black text-aerkm-brown uppercase tracking-[0.4em]">Le Manifeste AERKM</h2>
            <div className="relative">
              <span className="text-[10rem] font-black text-slate-100 absolute -top-24 left-1/2 -translate-x-1/2 select-none z-0">"</span>
              <p className="text-3xl lg:text-5xl font-black text-aerkm-blue tracking-tight leading-[1.1] relative z-10 italic">
                Nous ne sommes pas seulement des étudiants, nous sommes les ambassadeurs d'une cité en mouvement. Chaque succès individuel est une victoire pour Keur Massar.
              </p>
            </div>
            <div className="flex flex-col items-center">
               <div className="w-20 h-1 bg-aerkm-gold rounded-full mb-6"></div>
               <p className="font-black text-aerkm-brown uppercase tracking-widest text-xs">Le Bureau Exécutif</p>
            </div>
            <div className="pt-10 flex flex-wrap justify-center gap-4">
              <Link to="/contact" className="px-10 py-5 bg-aerkm-blue text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl shadow-aerkm-blue/20 hover:bg-blue-800 transition-all flex items-center group">
                Contacter le bureau
                <ArrowRight size={20} className="ml-3 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/bureau" className="px-10 py-5 bg-slate-100 text-slate-600 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-200 transition-all">
                Voir l'organigramme
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Final */}
      <section className="bg-aerkm-gold py-16 text-center">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <h2 className="text-2xl lg:text-4xl font-black text-aerkm-blue tracking-tighter">
              Convaincu ? Rejoignez la famille dès aujourd'hui.
            </h2>
            <Link to="/inscription" className="px-12 py-5 bg-aerkm-blue text-white rounded-[1.5rem] font-black text-sm uppercase tracking-widest shadow-2xl shadow-blue-900/20 hover:bg-blue-800 transition-all transform hover:scale-105 active:scale-95 flex items-center">
              DÉMARRER LE RECENSEMENT
              <ArrowRight size={20} className="ml-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AERKM;
