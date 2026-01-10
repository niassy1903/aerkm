
import React, { useState } from 'react';
import { useData } from '../../context/StudentContext';
import { FileSpreadsheet, FileText, Download, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const Exports: React.FC = () => {
  const { students } = useData();
  const [exportingExcel, setExportingExcel] = useState(false);
  const [exportingPDF, setExportingPDF] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const getHeaders = () => ["ID Recensement", "Prenom", "Nom", "Email", "Telephone", "NIN", "UFR", "Filiere", "Niveau", "Tuteur", "Sante", "Logement"];
  
  const getRows = () => students.map(s => [
    s.numeroRecensement,
    s.prenom,
    s.nom,
    s.email,
    s.telephone,
    s.nin,
    s.ufr,
    s.filiere,
    s.niveau,
    s.tuteur,
    s.maladieHandicap ? 'OUI' : 'NON',
    s.logementAmicale ? 'OUI' : 'NON'
  ]);

  const generateExcel = () => {
    setExportingExcel(true);
    setTimeout(() => {
      const headers = getHeaders();
      const rows = getRows();
      
      const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Etudiants_AERKM");
      
      XLSX.writeFile(wb, `aerkm_recensement_${new Date().toISOString().split('T')[0]}.xlsx`);
      
      setExportingExcel(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1000);
  };

  const generatePDF = () => {
    setExportingPDF(true);
    setTimeout(() => {
      const doc = new jsPDF('l', 'mm', 'a4'); // Paysage pour faire tenir les colonnes
      const headers = [getHeaders()];
      const rows = getRows();

      // Style du PDF
      doc.setFontSize(18);
      doc.setTextColor(30, 58, 138); // aerkm-blue
      doc.text("LISTE OFFICIELLE DES ÉTUDIANTS - AERKM", 14, 20);
      
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Généré le : ${new Date().toLocaleDateString('fr-FR')} | Total étudiants : ${students.length}`, 14, 28);

      autoTable(doc, {
        head: headers,
        body: rows,
        startY: 35,
        theme: 'striped',
        headStyles: { 
          fillColor: [30, 58, 138], 
          textColor: [255, 255, 255], 
          fontSize: 8, 
          fontStyle: 'bold',
          halign: 'center'
        },
        bodyStyles: { fontSize: 7 },
        alternateRowStyles: { fillColor: [245, 247, 250] },
        margin: { top: 35 },
      });

      doc.save(`aerkm_rapport_etudiants_${new Date().toISOString().split('T')[0]}.pdf`);
      
      setExportingPDF(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1200);
  };

  return (
    <div className="p-10 lg:p-14 space-y-12 animate-in fade-in duration-500">
      <div className="max-w-4xl">
        <h1 className="text-4xl font-black text-aerkm-blue tracking-tighter uppercase">Reporting & Archivage</h1>
        <p className="text-slate-500 font-medium mt-1">Extraire des listes ciblées en format Excel (.xlsx) ou PDF (Tableau).</p>
      </div>

      {showSuccess && (
        <div className="max-w-5xl bg-green-500 text-white p-4 rounded-2xl flex items-center space-x-3 shadow-xl shadow-green-500/20 animate-in slide-in-from-top-4">
           <CheckCircle2 size={20} />
           <p className="text-xs font-black uppercase tracking-widest">Fichier généré et téléchargé avec succès !</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl">
        {/* EXCEL Export Card */}
        <div onClick={!exportingExcel ? generateExcel : undefined} className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 group hover:border-aerkm-blue transition-all cursor-pointer relative overflow-hidden">
          <div className="absolute -top-10 -right-10 opacity-5 text-aerkm-blue group-hover:scale-110 transition-transform">
             <FileSpreadsheet size={200} />
          </div>
          <div className="w-16 h-16 bg-blue-50 text-aerkm-blue rounded-[1.5rem] flex items-center justify-center mb-8 shadow-sm">
            <FileSpreadsheet size={32} />
          </div>
          <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">Base Étudiante (Excel)</h3>
          <p className="text-slate-500 mb-10 leading-relaxed font-medium">Fichier .xlsx compatible Excel contenant les données de recensement complètes.</p>
          <div className="flex items-center space-x-2 text-aerkm-blue font-black text-xs uppercase tracking-[0.2em]">
            {exportingExcel ? <Loader2 size={18} className="animate-spin" /> : <span>Télécharger en .xlsx</span>}
            {!exportingExcel && <Download size={18} className="group-hover:translate-y-1 transition-transform" />}
          </div>
        </div>

        {/* PDF Export Card */}
        <div onClick={!exportingPDF ? generatePDF : undefined} className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 group hover:border-red-500 transition-all cursor-pointer relative overflow-hidden">
          <div className="absolute -top-10 -right-10 opacity-5 text-red-500 group-hover:scale-110 transition-transform">
             <FileText size={200} />
          </div>
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-[1.5rem] flex items-center justify-center mb-8 shadow-sm">
            <FileText size={32} />
          </div>
          <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">Rapport en Tableau (PDF)</h3>
          <p className="text-slate-500 mb-10 leading-relaxed font-medium">Génère un tableau structuré et stylisé prêt pour l'impression ou le partage officiel.</p>
          <div className="flex items-center space-x-2 text-red-500 font-black text-xs uppercase tracking-[0.2em]">
            {exportingPDF ? <Loader2 size={18} className="animate-spin" /> : <span>Générer le PDF</span>}
            {!exportingPDF && <Download size={18} className="group-hover:translate-y-1 transition-transform" />}
          </div>
        </div>
      </div>

      <div className="bg-[#0a192f] p-8 rounded-[2.5rem] max-w-6xl flex items-start space-x-6 text-white relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 p-8 opacity-10">
           <AlertCircle size={100} />
        </div>
        <div className="w-12 h-12 bg-aerkm-gold/20 text-aerkm-gold rounded-2xl flex items-center justify-center shrink-0">
           <AlertCircle size={24} />
        </div>
        <div>
          <h4 className="text-lg font-black tracking-tight text-aerkm-gold uppercase">Utilisation des données</h4>
          <p className="text-white/50 text-sm mt-2 leading-relaxed max-w-3xl">
            Les formats CSV ne sont plus utilisés pour garantir l'intégrité des caractères spéciaux (accents). Privilégiez l'Excel pour le traitement de données et le PDF pour les présentations officielles.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Exports;