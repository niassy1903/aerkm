
import React, { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';

const ScrollToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Gérer la visibilité du bouton en fonction du défilement
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-8 right-8 z-[1000] p-4 bg-aerkm-blue text-white rounded-2xl shadow-[0_20px_50px_rgba(30,58,138,0.3)] transition-all duration-500 transform hover:scale-110 active:scale-95 border-2 border-white/20 flex items-center justify-center group ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'
      }`}
      aria-label="Retour en haut"
    >
      <ChevronUp size={24} className="group-hover:-translate-y-1 transition-transform duration-300" />
      
      {/* Tooltip */}
      <div className="absolute -top-12 right-0 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-2xl border border-white/10">
        Haut de page
      </div>
    </button>
  );
};

export default ScrollToTop;