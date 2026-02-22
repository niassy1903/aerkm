
import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, useLocation, Link } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { StudentProvider } from './context/StudentContext';

// Components
import Navbar from './components/Navbar';
import AdminNavbar from './components/AdminNavbar';
import SidebarAdmin from './components/SidebarAdmin';
import ProtectedRoute from './components/ProtectedRoute';
import ScrollToTop from './components/ScrollToTop';

// Pages
import Accueil from './pages/public/Accueil';
import AERKM from './pages/public/AERKM';
import Bureau from './pages/public/Bureau';
import Evenements from './pages/public/Evenements';
import Contact from './pages/public/Contact';
import Login from './pages/auth/Login';
import Inscription from './pages/auth/Inscription';
import DashboardEtudiant from './pages/etudiant/DashboardEtudiant';
import Profil from './pages/etudiant/Profil';
import DashboardAdmin from './pages/admin/DashboardAdmin';
import GestionEvenements from './pages/admin/GestionEvenements';
import GestionEtudiants from './pages/admin/GestionEtudiants';
import GestionAdmins from './pages/admin/GestionAdmins';
import Statistiques from './pages/admin/Statistiques';
import Exports from './pages/admin/Exports';
import Logs from './pages/admin/Logs';
import AdminProfil from './pages/admin/AdminProfil';
import Parametres from './pages/admin/Parametres';


// Icons for Footer
import { 
  GraduationCap, 
  MapPin, 
  Mail, 
  Phone, 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube,
  ShieldCheck,
  Heart,
  ArrowUpRight,
  Sparkles
} from 'lucide-react';

const Footer = () => (
  <footer className="relative bg-[#0a192f] text-white overflow-hidden pt-24 pb-12 border-t border-white/5">
    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-aerkm-gold/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

    <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16 mb-20">

        {/* LOGO */}
        <div className="space-y-8">
          <div className="flex items-center space-x-4 group">
            <div className="w-16 h-16 rounded-full bg-white p-1 shadow-2xl ring-2 ring-aerkm-gold/40 transition-transform duration-300 group-hover:scale-105">
              <img
                src="/assets/logo.jpg"
                alt="Logo AERKM"
                className="w-full h-full rounded-full object-contain"
              />
            </div>

            <div className="flex flex-col">
              <span className="font-black text-3xl tracking-tighter leading-none">
                AERKM
              </span>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-aerkm-gold mt-1">
                Bambey • Keur Massar
              </span>
            </div>
          </div>

          <p className="text-blue-100/50 text-sm leading-relaxed font-medium">
            L'excellence pédagogique et la solidarité sociale au cœur de notre
            engagement pour les étudiants de Keur Massar.
          </p>

          <div className="flex items-center space-x-4">
            {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="w-11 h-11 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center transition-all duration-300 transform hover:-translate-y-2 hover:bg-white hover:text-aerkm-blue"
              >
                <Icon size={20} />
              </a>
            ))}
          </div>
        </div>

        {/* NAVIGATION */}
        <div>
          <h4 className="text-white font-black text-sm uppercase tracking-[0.2em] mb-10 flex items-center">
            <Sparkles size={16} className="mr-2 text-aerkm-gold" />
            Navigation
          </h4>
          <ul className="space-y-4">
            {[
              { label: "Accueil", path: "/" },
              { label: "L'Amicale", path: "/aerkm" },
              { label: "Le Bureau", path: "/bureau" },
              { label: "Agenda & Events", path: "/evenements" },
              { label: "Contact", path: "/contact" },
              { label: "Recensement", path: "/inscription" },
            ].map((link, i) => (
              <li key={i}>
                <Link
                  to={link.path}
                  className="text-blue-100/60 hover:text-aerkm-gold transition-all flex items-center group font-bold text-sm"
                >
                  <span className="w-1.5 h-1.5 bg-aerkm-gold rounded-full mr-3 opacity-0 group-hover:opacity-100 scale-0 group-hover:scale-100 transition-all"></span>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* MISSIONS */}
        <div>
          <h4 className="text-white font-black text-sm uppercase tracking-[0.2em] mb-10">
            Nos Missions
          </h4>
          <div className="space-y-6">
            <div className="flex items-start space-x-4 p-4 rounded-2xl bg-white/5 border border-white/5">
              <ShieldCheck size={20} className="text-aerkm-gold mt-1" />
              <div>
                <p className="text-sm font-black">Volet Pédagogique</p>
                <p className="text-[11px] text-blue-100/40 font-bold mt-1">
                  Tutorat, révisions & réussite.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-4 rounded-2xl bg-white/5 border border-white/5">
              <Heart size={20} className="text-aerkm-brown mt-1" />
              <div>
                <p className="text-sm font-black">Volet Social</p>
                <p className="text-[11px] text-blue-100/40 font-bold mt-1">
                  Entraide, bourses & logement.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CONTACT */}
        <div>
          <h4 className="text-white font-black text-sm uppercase tracking-[0.2em] mb-10">
            Contact direct
          </h4>
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-11 h-11 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-aerkm-gold">
                <MapPin size={20} />
              </div>
              <p className="text-sm font-bold text-blue-100/80">
                Campus Bambey, Sénégal
              </p>
            </div>

            <div className="flex items-center space-x-4">
              <div className="w-11 h-11 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-aerkm-gold">
                <Phone size={20} />
              </div>
              <p className="text-sm font-bold text-blue-100/80">
                +221 33 000 00 00
              </p>
            </div>
          </div>
        </div>

      </div>

      <div className="pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-[10px] text-blue-100/30 font-black tracking-widest uppercase">
          © {new Date().getFullYear()} AERKM BAMBEY • TOUS DROITS RÉSERVÉS
        </div>
        <div className="hidden md:block px-4 py-1.5 bg-aerkm-gold/10 border border-aerkm-gold/20 rounded-full text-aerkm-gold text-[9px] font-black uppercase tracking-widest">
          OFFICIEL AERKM
        </div>
      </div>
    </div>
  </footer>
);




const AppLayout = () => {
  const location = useLocation();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const isAdminPath = location.pathname.startsWith('/admin');
  const isHomePage = location.pathname === '/';
  const isAuthPage = location.pathname === '/login' || location.pathname === '/inscription';

  if (isAdminPath) {
    return (
      <div className="flex bg-slate-50 min-h-screen">
        <SidebarAdmin collapsed={isSidebarCollapsed} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <AdminNavbar onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />
          <main className="flex-1 overflow-x-hidden overflow-y-auto relative">
            <Routes>
              <Route path="/admin" element={<ProtectedRoute allowedRole="ADMIN"><DashboardAdmin /></ProtectedRoute>} />
              <Route path="/admin/evenements" element={<ProtectedRoute allowedRole="ADMIN"><GestionEvenements /></ProtectedRoute>} />
              <Route path="/admin/etudiants" element={<ProtectedRoute allowedRole="ADMIN"><GestionEtudiants /></ProtectedRoute>} />
              <Route path="/admin/utilisateurs" element={<ProtectedRoute allowedRole="ADMIN"><GestionAdmins /></ProtectedRoute>} />
              <Route path="/admin/statistiques" element={<ProtectedRoute allowedRole="ADMIN"><Statistiques /></ProtectedRoute>} />
              <Route path="/admin/exports" element={<ProtectedRoute allowedRole="ADMIN"><Exports /></ProtectedRoute>} />
              <Route path="/admin/logs" element={<ProtectedRoute allowedRole="ADMIN"><Logs /></ProtectedRoute>} />
              <Route path="/admin/profil" element={<ProtectedRoute allowedRole="ADMIN"><AdminProfil /></ProtectedRoute>} />
              <Route path="/admin/parametres" element={<ProtectedRoute allowedRole="ADMIN"><Parametres /></ProtectedRoute>} />
            </Routes>
          </main>
          <ScrollToTop />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen relative">
      {!isAuthPage && <Navbar />}
      <main className={`flex-grow ${isHomePage || isAuthPage ? '' : 'pt-24 lg:pt-32'}`}>
        <Routes>
          <Route path="/" element={<Accueil />} />
          <Route path="/aerkm" element={<AERKM />} />
          <Route path="/bureau" element={<Bureau />} />
          <Route path="/evenements" element={<Evenements />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/inscription" element={<Inscription />} />
          <Route path="/etudiant" element={<ProtectedRoute allowedRole="ETUDIANT"><DashboardEtudiant /></ProtectedRoute>} />
          <Route path="/etudiant/profil" element={<ProtectedRoute allowedRole="ETUDIANT"><Profil /></ProtectedRoute>} />
        </Routes>
      </main>
      {!isAuthPage && <Footer />}
      <ScrollToTop />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <StudentProvider>
        <Router>
          <AppLayout />
        </Router>
      </StudentProvider>
    </AuthProvider>
  );
};

export default App;