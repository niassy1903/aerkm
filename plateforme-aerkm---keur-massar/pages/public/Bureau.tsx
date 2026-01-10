import React from 'react';
import { BUREAU_MEMBERS } from '../../constants';
import { Phone, Mail, MessageCircle, ShieldCheck, Star, Users, ArrowUpRight, Sparkles } from 'lucide-react';

const Bureau: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 overflow-hidden bg-aerkm-blue">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent"></div>
        </div>
        <div className="container mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center space-x-2 py-2 px-6 rounded-full bg-white/10 border border-white/20 text-aerkm-gold text-xs font-black uppercase tracking-[0.3em] mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <ShieldCheck size={16} />
            <span>Gouvernance Officielle</span>
          </div>
          <h1 className="text-5xl lg:text-7xl font-black text-white tracking-tighter leading-none mb-8 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
            Le Bureau <br /> <span className="text-aerkm-gold">Exécutif</span> AERKM
          </h1>
          <p className="text-xl text-blue-100/60 max-w-2xl mx-auto font-medium leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
            Une équipe dévouée, élue pour porter la voix et les projets des étudiants de Keur Massar à l'Université de Bambey.
          </p>
        </div>
      </section>

      {/* Stats / Highlights */}
      <section className="relative -mt-12 z-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { label: "Membres Actifs", value: "6", icon: <Users />, color: "bg-aerkm-brown" },
              { label: "Mandat en cours", value: "2024-2025", icon: <Star />, color: "bg-aerkm-blue" },
              { label: "Commissions", value: "2 Spécialisées", icon: <Sparkles />, color: "bg-aerkm-gold" }
            ].map((stat, i) => (
              <div key={i} className="bg-white p-8 rounded-[2.5rem] shadow-2xl shadow-slate-200 flex items-center justify-between border border-slate-50">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                  <p className="text-3xl font-black text-slate-900">{stat.value}</p>
                </div>
                <div className={`w-14 h-14 ${stat.color} text-white rounded-2xl flex items-center justify-center shadow-xl`}>
                  {stat.icon}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Board Members Grid */}
      <section className="py-32 container mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-3xl font-black text-aerkm-blue tracking-tighter uppercase mb-4">Membres du Bureau</h2>
          <div className="w-20 h-1.5 bg-aerkm-gold mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {BUREAU_MEMBERS.map((member, index) => (
            <div 
              key={index} 
              className="group relative bg-white rounded-[3rem] overflow-hidden shadow-xl hover:shadow-3xl transition-all duration-500 border border-slate-100 flex flex-col animate-in fade-in slide-in-from-bottom-8 duration-700"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Image Section with Gradient Overlay */}
              <div className="relative h-80 overflow-hidden flex items-center justify-center bg-slate-200 rounded-[3rem]">
                {member.image ? (
                  <img
                    src={member.image}
                    alt={`${member.prenom} ${member.nom}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full bg-slate-200 text-slate-700 font-black text-4xl rounded-[3rem]">
                    {member.prenom?.[0]}{member.nom?.[0]}
                  </div>
                )}

                <div className={`absolute inset-0 bg-gradient-to-t ${member.color} opacity-40 group-hover:opacity-20 transition-opacity`}></div>

                {/* Role Badge */}
                <div className="absolute bottom-6 left-6">
                  <span className="bg-white/90 backdrop-blur-md text-aerkm-blue text-[10px] font-black px-5 py-2.5 rounded-2xl uppercase tracking-[0.2em] shadow-2xl">
                    {member.role}
                  </span>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-10 flex-grow">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 leading-tight">
                      {member.prenom} <br /> <span className="text-aerkm-blue">{member.nom}</span>
                    </h3>
                  </div>
                  <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-aerkm-gold group-hover:text-white transition-all transform group-hover:rotate-12">
                    <ArrowUpRight size={24} />
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center text-slate-500 font-bold text-sm">
                    <Phone size={16} className="mr-3 text-aerkm-brown" />
                    <span>{member.telephone}</span>
                  </div>
                  <div className="flex items-center text-slate-500 font-bold text-sm">
                    <Mail size={16} className="mr-3 text-aerkm-gold" />
                    <span className="truncate">{member.email}</span>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex gap-3">
                  <a 
                    href={`tel:${member.telephone.replace(/\s/g, '')}`}
                    className="flex-1 bg-aerkm-blue text-white py-4 rounded-2xl flex items-center justify-center font-black text-[10px] uppercase tracking-widest hover:bg-blue-800 transition-all shadow-lg shadow-blue-900/10"
                  >
                    Appeler
                  </a>
                  <a 
                    href={`https://wa.me/${member.telephone.replace(/[^\d]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-14 h-14 bg-green-500 text-white rounded-2xl flex items-center justify-center hover:bg-green-600 transition-all shadow-lg shadow-green-500/10"
                  >
                    <MessageCircle size={20} />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Vision Statement */}
      <section className="py-32 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto bg-white p-12 lg:p-20 rounded-[4rem] shadow-3xl border border-slate-100 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 p-10 text-slate-50 opacity-10">
               <ShieldCheck size={200} />
            </div>
            <Sparkles className="mx-auto text-aerkm-gold mb-8" size={48} />
            <h2 className="text-4xl font-black text-aerkm-blue tracking-tighter mb-8 leading-tight">
              Notre Mission d'Excellence
            </h2>
            <p className="text-xl text-slate-500 font-medium leading-relaxed mb-12">
              "En tant que représentants élus, notre devoir est de veiller à ce que chaque ressortissant de Keur Massar trouve en l'AERKM un refuge social solide et un levier pédagogique puissant pour sa réussite à l'Université de Bambey."
            </p>
            <div className="flex items-center justify-center space-x-4">
               <div className="w-12 h-1 bg-aerkm-brown rounded-full"></div>
               <span className="font-black text-aerkm-blue uppercase tracking-[0.3em] text-xs">Le Bureau Exécutif</span>
               <div className="w-12 h-1 bg-aerkm-brown rounded-full"></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Bureau;
