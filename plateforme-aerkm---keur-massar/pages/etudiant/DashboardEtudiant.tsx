import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/StudentContext';
import { Etudiant } from '../../types';
import { 
  Calendar, 
  User, 
  School, 
  MapPin, 
  ClipboardCheck, 
  ArrowRight, 
  Bell, 
  ChevronLeft, 
  ChevronRight,
  Info,
  Clock,
  Sparkles,
  FileText,
  Download
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { jsPDF } from 'jspdf';

const DashboardEtudiant: React.FC = () => {
  const { user } = useAuth();
  const { events } = useData();
  const student = user as Etudiant;
  const [isExporting, setIsExporting] = useState(false);

  // Pagination pour les événements
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const publishedEvents = events.filter(e => e.published);
  const totalPages = Math.ceil(publishedEvents.length / itemsPerPage);
  
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEvents = publishedEvents.slice(indexOfFirstItem, indexOfLastItem);

  const goToNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const goToPrevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

  const generateFichePDF = () => {
    setIsExporting(true);
    const doc = new jsPDF();
    
    // Design de la fiche PDF
    const primaryColor = [30, 58, 138]; // aerkm-blue
    const accentColor = [251, 191, 36]; // aerkm-gold

    // En-tête
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(0, 0, 210, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('AERKM - BAMBEY', 20, 25);
    
    doc.setFontSize(10);
    doc.text('FICHE OFFICIELLE DE RECENSEMENT', 20, 32);

    // Corps du document
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(16);
    doc.text(`Matricule : ${student.numeroRecensement || 'N/A'}`, 20, 60);
    
    // Ligne de séparation
    doc.setDrawColor(230, 230, 230);
    doc.line(20, 65, 190, 65);

    // Informations Personnelles
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Informations Personnelles', 20, 80);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Prénom : ${student.prenom || 'N/A'}`, 20, 90);
    doc.text(`Nom : ${student.nom || 'N/A'}`, 20, 98);
    
    // Correction de la logique du Sexe
    let sexeLabel = 'Non renseigné';
    if (student.sexe === 'M') sexeLabel = 'Masculin';
    else if (student.sexe === 'F') sexeLabel = 'Féminin';
    doc.text(`Sexe : ${sexeLabel}`, 20, 106);
    
    doc.text(`Lieu d'origine : ${student.lieuOrigine || 'Keur Massar'}`, 20, 114);
    doc.text(`NIN : ${student.nin || 'Non renseigné'}`, 20, 122);

    // Informations Académiques
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('Cursus Universitaire', 20, 140);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`UFR : ${student.ufr || 'Non renseignée'}`, 20, 150);
    doc.text(`Filière : ${student.filiere || 'Non renseignée'}`, 20, 158);
    doc.text(`Niveau : ${student.niveau || 'N/A'}`, 20, 166);
    doc.text(`Année : ${student.anneeUniversitaire || '2024-2025'}`, 20, 174);

    // Contact
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('Contact & Social', 20, 192);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Téléphone : ${student.telephone || 'Non renseigné'}`, 20, 202);
    doc.text(`Email : ${student.email || 'N/A'}`, 20, 210);
    doc.text(`Tuteur : ${student.tuteur || 'Non renseigné'}`, 20, 218);
    doc.text(`Logé Amicale : ${student.logementAmicale ? 'OUI' : 'NON'}`, 20, 226);

    // Footer du PDF
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    const date = new Date().toLocaleDateString('fr-FR');
    doc.text(`Document généré le ${date} par la plateforme officielle AERKM.`, 105, 280, { align: 'center' });

    doc.save(`fiche_recensement_${student.prenom}_${student.nom}.pdf`);
    setIsExporting(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 lg:px-8 space-y-10 animate-in fade-in duration-700 transition-colors duration-300">
      
      {/* Header Profile - Modern & Impactful */}
      <section className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] dark:shadow-none overflow-hidden border border-slate-100 dark:border-slate-800 transition-colors duration-300">
        <div className="bg-gradient-to-r from-aerkm-blue via-blue-700 to-blue-600 h-40 relative">
          <div className="absolute inset-0 opacity-20 mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
          <div className="absolute -bottom-14 left-10 p-1.5 bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl transition-colors duration-300">
            <div className="w-28 h-28 bg-slate-50 dark:bg-slate-800 text-aerkm-blue dark:text-white rounded-[1.8rem] flex items-center justify-center font-black text-4xl uppercase border-4 border-aerkm-blue/5">
              {student.prenom ? student.prenom[0] : '?'}{student.nom ? student.nom[0] : '?'}
            </div>
          </div>
          <div className="absolute top-6 right-10 flex space-x-3">
             <div className="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-xl text-white text-[10px] font-black uppercase tracking-widest flex items-center">
                <Sparkles size={14} className="mr-2 text-aerkm-gold" />
                Session Étudiant
             </div>
          </div>
        </div>
        <div className="pt-20 pb-10 px-10 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">
              Bienvenue, {student.prenom} !
            </h1>
            <div className="flex items-center mt-2 space-x-3">
              <span className="bg-green-500 text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg shadow-green-500/20">
                Statut : Recensé
              </span>
              <span className="text-slate-400 dark:text-slate-500 font-bold text-xs uppercase tracking-widest">
                MATRICULE : {student.numeroRecensement || 'EN ATTENTE'}
              </span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={generateFichePDF}
              disabled={isExporting}
              className="px-8 py-4 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-black rounded-2xl transition-all shadow-sm hover:border-aerkm-blue dark:hover:border-aerkm-gold hover:text-aerkm-blue dark:hover:text-white transform hover:-translate-y-1 active:scale-95 flex items-center text-xs uppercase tracking-widest disabled:opacity-50"
            >
              <FileText size={18} className="mr-3" />
              {isExporting ? 'Génération...' : 'Ma Fiche (PDF)'}
            </button>
            <Link to="/etudiant/profil" className="px-8 py-4 bg-aerkm-blue text-white font-black rounded-2xl transition-all shadow-xl shadow-aerkm-blue/20 hover:bg-blue-800 transform hover:-translate-y-1 active:scale-95 flex items-center text-xs uppercase tracking-widest">
              <User size={18} className="mr-3" />
              Gérer mon dossier
            </Link>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Left Column: Academic & Help */}
        <div className="lg:col-span-2 space-y-10">
          
          {/* Tableau Moderne des Événements */}
          <div className="bg-white dark:bg-slate-900 rounded-[3rem] shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col h-full transition-colors duration-300">
            <div className="p-8 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-aerkm-blue dark:text-white uppercase tracking-tight flex items-center">
                  <Calendar className="mr-3 text-aerkm-gold" size={22} />
                  Agenda de l'AERKM
                </h2>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest mt-1">Événements publiés officiellement</p>
              </div>
              
              {/* Pagination Controls - Très Modernes */}
              <div className="flex items-center space-x-2">
                <button 
                  onClick={goToPrevPage}
                  disabled={currentPage === 1}
                  className={`p-2.5 rounded-xl transition-all ${currentPage === 1 ? 'text-slate-200 dark:text-slate-700' : 'bg-slate-50 dark:bg-slate-800 text-aerkm-blue dark:text-white hover:bg-aerkm-blue dark:hover:bg-aerkm-gold hover:text-white shadow-sm'}`}
                >
                  <ChevronLeft size={20} />
                </button>
                <div className="flex space-x-1 px-2">
                  {[...Array(totalPages)].map((_, i) => (
                    <div 
                      key={i} 
                      className={`h-1.5 rounded-full transition-all duration-300 ${currentPage === i + 1 ? 'w-6 bg-aerkm-gold' : 'w-1.5 bg-slate-200 dark:bg-slate-800'}`}
                    />
                  ))}
                </div>
                <button 
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className={`p-2.5 rounded-xl transition-all ${currentPage === totalPages || totalPages === 0 ? 'text-slate-200 dark:text-slate-700' : 'bg-slate-50 dark:bg-slate-800 text-aerkm-blue dark:text-white hover:bg-aerkm-blue dark:hover:bg-aerkm-gold hover:text-white shadow-sm'}`}
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>

            <div className="flex-1">
              {currentEvents.length > 0 ? (
                <div className="divide-y divide-slate-50 dark:divide-slate-800">
                  {currentEvents.map((evt, idx) => (
                    <div key={evt._id || evt.id || idx} className="p-8 flex items-center hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors group">
                       <div className="hidden sm:flex flex-col items-center justify-center w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-2xl mr-8 group-hover:bg-aerkm-blue dark:group-hover:bg-aerkm-gold group-hover:text-white transition-all shrink-0">
                          <span className="text-[10px] font-black uppercase tracking-widest opacity-60 dark:text-slate-400">
                            {new Date(evt.date).toLocaleDateString('fr-FR', { month: 'short' })}
                          </span>
                          <span className="text-2xl font-black leading-none dark:text-white">
                            {new Date(evt.date).getDate()}
                          </span>
                       </div>
                       <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-3 mb-1">
                            <span className="text-[9px] font-black uppercase tracking-widest text-aerkm-brown dark:text-aerkm-gold bg-aerkm-brown/5 dark:bg-aerkm-gold/10 px-2 py-0.5 rounded">
                              {evt.type}
                            </span>
                            <div className="flex items-center text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase">
                              <Clock size={10} className="mr-1" />
                              {evt.heure}
                            </div>
                          </div>
                          <h3 className="text-lg font-black text-slate-800 dark:text-slate-200 truncate group-hover:text-aerkm-blue dark:group-hover:text-white transition-colors">
                            {evt.titre}
                          </h3>
                          <p className="text-xs text-slate-400 dark:text-slate-500 font-medium truncate flex items-center mt-1">
                            <MapPin size={12} className="mr-1.5 text-red-400" />
                            {evt.lieu}
                          </p>
                       </div>
                       <button className="ml-6 w-12 h-12 bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 rounded-2xl flex items-center justify-center group-hover:bg-aerkm-gold dark:group-hover:bg-white group-hover:text-white dark:group-hover:text-slate-900 transition-all transform group-hover:translate-x-1">
                          <ArrowRight size={20} />
                       </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-20 text-center">
                  <Info size={48} className="mx-auto text-slate-200 dark:text-slate-800 mb-4" />
                  <p className="text-slate-400 dark:text-slate-600 font-black uppercase tracking-widest text-[10px]">Aucun événement publié.</p>
                </div>
              )}
            </div>
            
            <div className="p-6 bg-slate-50/50 dark:bg-slate-800/50 text-center border-t border-slate-50 dark:border-slate-800 transition-colors">
              <Link to="/evenements" className="text-[10px] font-black text-aerkm-blue dark:text-aerkm-gold uppercase tracking-[0.2em] hover:text-aerkm-brown dark:hover:text-white transition-colors">
                Voir l'agenda complet en plein écran
              </Link>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
            <h2 className="text-xl font-black text-aerkm-blue dark:text-white mb-10 flex items-center uppercase tracking-tight">
              <School className="mr-3 text-aerkm-blue dark:text-aerkm-gold" size={22} /> Mon Cursus
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { label: 'UFR', value: student.ufr || 'Non renseignée', icon: <div className="w-1.5 h-6 bg-aerkm-blue dark:bg-aerkm-gold rounded-full"></div> },
                { label: 'Filière', value: student.filiere || 'Non renseignée', icon: <div className="w-1.5 h-6 bg-aerkm-gold dark:bg-blue-400 rounded-full"></div> },
                { label: 'Niveau', value: student.niveau || 'N/A', icon: <div className="w-1.5 h-6 bg-aerkm-brown dark:bg-amber-500 rounded-full"></div> },
                { label: 'Session', value: student.anneeUniversitaire || '2024-2025', icon: <div className="w-1.5 h-6 bg-slate-200 dark:bg-slate-700 rounded-full"></div> },
              ].map((item, i) => (
                <div key={i} className="p-6 bg-slate-50 dark:bg-slate-800 rounded-[2rem] border border-slate-100 dark:border-slate-700 flex items-center space-x-6 hover:bg-white dark:hover:bg-slate-700 hover:shadow-xl transition-all cursor-default">
                  {item.icon}
                  <div className="min-w-0">
                    <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{item.label}</p>
                    <p className="text-sm font-black text-slate-800 dark:text-white truncate">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Alerts & Quick Info */}
        <div className="space-y-10">
          
          <div className="bg-[#0a192f] dark:bg-slate-950 rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl flex flex-col h-full transition-colors duration-300">
            <div className="absolute top-0 right-0 p-8 opacity-10">
               <ClipboardCheck size={180} />
            </div>
            <div className="relative z-10 flex-1">
              <div className="w-14 h-14 bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10 rounded-2xl flex items-center justify-center text-aerkm-gold mb-8">
                 <Bell size={28} />
              </div>
              <h2 className="text-3xl font-black tracking-tighter leading-none mb-6">Assistance & Écoute</h2>
              <p className="text-blue-100/60 dark:text-slate-400 font-medium leading-relaxed mb-10 text-sm">
                Une difficulté à Bambey ? Le bureau social de l'AERKM est là pour vous accompagner au quotidien.
              </p>
              
              <div className="space-y-4">
                 <div className="flex items-center space-x-4 p-4 bg-white/5 border border-white/10 rounded-2xl">
                    <div className="w-2 h-2 bg-aerkm-gold rounded-full animate-ping"></div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-blue-100">Bureau Pédagogique : Actif</span>
                 </div>
                 <div className="flex items-center space-x-4 p-4 bg-white/5 border border-white/10 rounded-2xl">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-blue-100">Bureau Social : Ouvert</span>
                 </div>
              </div>
            </div>
            
            <Link to="/contact" className="mt-12 relative z-10 w-full py-5 bg-aerkm-gold text-[#0a192f] rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white transition-all text-center shadow-xl shadow-aerkm-gold/20">
              Contacter le Bureau
            </Link>
          </div>

          <div className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
             <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-6">Résumé de Recensement</h3>
             <div className="space-y-6">
                <div className="flex items-center justify-between">
                   <span className="text-xs font-bold text-slate-500">Inscrit le</span>
                   <span className="text-xs font-black text-slate-800 dark:text-slate-200">
                     {new Date(student.dateInscription || Date.now()).toLocaleDateString('fr-FR')}
                   </span>
                </div>
                <div className="flex items-center justify-between">
                   <span className="text-xs font-bold text-slate-500">Sexe</span>
                   <span className="text-xs font-black text-slate-800 dark:text-slate-200">{student.sexe === 'M' ? 'Masculin' : (student.sexe === 'F' ? 'Féminin' : 'N/A')}</span>
                </div>
                <div className="flex items-center justify-between">
                   <span className="text-xs font-bold text-slate-500">Ville</span>
                   <span className="text-xs font-black text-slate-800 dark:text-slate-200">{student.lieuOrigine || 'N/A'}</span>
                </div>
                <hr className="border-slate-50 dark:border-slate-800" />
                <div className="pt-2">
                   <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">Besoin d'aide ?</p>
                   <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 flex items-center space-x-3 transition-colors">
                      <div className="w-8 h-8 bg-aerkm-blue dark:bg-aerkm-gold text-white dark:text-slate-900 rounded-lg flex items-center justify-center shrink-0">
                         <Info size={16} />
                      </div>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold leading-tight">
                        Votre carte de membre sera disponible prochainement sur votre espace personnel.
                      </p>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardEtudiant;