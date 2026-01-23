import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Menu,
  X,
  LogOut,
  User as UserIcon,
  Calendar,
  Home,
  Info,
  Phone,
  Sparkles,
  Users
} from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate('/');
  };

  const navLinks = [
    { name: 'Accueil', path: '/', icon: <Home size={18} /> },
    { name: "L'Amicale", path: '/aerkm', icon: <Info size={18} /> },
    { name: 'Le Bureau', path: '/bureau', icon: <Users size={18} /> },
    { name: 'Agenda', path: '/evenements', icon: <Calendar size={18} /> },
    { name: 'Contact', path: '/contact', icon: <Phone size={18} /> }
  ];

  const isActive = (path: string) => location.pathname === path;
  const isHomePage = location.pathname === '/';
  const shouldHaveBg = scrolled || !isHomePage;

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-[1000] transition-all duration-500 ${
        shouldHaveBg
          ? 'bg-white/95 backdrop-blur-2xl shadow-[0_10px_40px_rgba(0,0,0,0.05)] py-3 border-b border-slate-100'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12">
        <div className="flex items-center justify-between h-16">

          {/* LOGO */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div
              className={`w-12 h-12 rounded-full overflow-hidden transition-all duration-500 group-hover:rotate-[10deg] shadow-2xl ${
                shouldHaveBg ? 'bg-white shadow-aerkm-blue/20' : 'bg-white shadow-xl'
              }`}
            >
              <img
                src="/assets/logo.jpg"
                alt="Logo AERKM"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex flex-col">
              <span
                className={`font-black text-xl lg:text-2xl tracking-tighter leading-none ${
                  shouldHaveBg ? 'text-aerkm-blue' : 'text-white'
                }`}
              >
                AERKM
              </span>
              <span
                className={`text-[8px] lg:text-[10px] font-black uppercase tracking-[0.2em] mt-1 ${
                  shouldHaveBg ? 'text-aerkm-brown' : 'text-aerkm-gold'
                }`}
              >
                Bambey • Keur Massar
              </span>
            </div>
          </Link>

          {/* DESKTOP NAV */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map(link => (
              <Link
                key={link.name}
                to={link.path}
                className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                  isActive(link.path)
                    ? shouldHaveBg
                      ? 'bg-aerkm-blue/5 text-aerkm-blue'
                      : 'bg-white/10 text-white'
                    : shouldHaveBg
                    ? 'text-slate-600 hover:bg-slate-50 hover:text-aerkm-blue'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* ACTIONS DESKTOP */}
          <div className="hidden lg:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link
                  to={user?.role === 'ADMIN' ? '/admin' : '/etudiant'}
                  className={`px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    shouldHaveBg
                      ? 'bg-aerkm-blue text-white'
                      : 'bg-white text-aerkm-blue'
                  }`}
                >
                  <UserIcon size={14} /> ESPACE {user?.role}
                </Link>

                <button
                  onClick={handleLogout}
                  className={`p-2.5 rounded-xl ${
                    shouldHaveBg ? 'text-red-500 hover:bg-red-50' : 'text-white'
                  }`}
                >
                  <LogOut size={18} />
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`text-[10px] font-black uppercase tracking-widest ${
                    shouldHaveBg ? 'text-slate-500 hover:text-aerkm-blue' : 'text-white'
                  }`}
                >
                  Connexion
                </Link>

                <Link
                  to="/inscription"
                  className="px-6 py-3.5 bg-aerkm-brown text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl flex items-center space-x-2"
                >
                  <Sparkles size={14} />
                  <span>S'inscrire</span>
                </Link>
              </>
            )}
          </div>

          {/* MOBILE BUTTON */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2.5 rounded-xl ${
                shouldHaveBg ? 'bg-aerkm-blue text-white' : 'bg-white text-aerkm-blue'
              }`}
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

     {/* MOBILE MENU */}
{isOpen && (
  <div className="lg:hidden fixed inset-x-0 top-[5.5rem] p-4 z-[999]">
    <div className="bg-white rounded-2xl shadow-xl p-6 space-y-4">

      {/* Liens de navigation */}
      {navLinks.map(link => (
        <Link
          key={link.name}
          to={link.path}
          onClick={() => setIsOpen(false)}
          className="flex items-center px-5 py-4 rounded-xl font-black uppercase text-sm hover:bg-slate-50"
        >
          {link.name}
        </Link>
      ))}

      {/* Séparateur */}
      <div className="border-t border-slate-200 my-3"></div>

      {/* ACTIONS MOBILE */}
      {!isAuthenticated ? (
        <div className="space-y-3">
          <Link
            to="/login"
            onClick={() => setIsOpen(false)}
            className="block w-full text-center py-4 rounded-xl bg-slate-100 text-slate-700 font-black uppercase tracking-widest text-xs"
          >
            Connexion
          </Link>

          <Link
            to="/inscription"
            onClick={() => setIsOpen(false)}
            className="flex items-center justify-center space-x-2 w-full py-4 rounded-xl bg-aerkm-brown text-white font-black uppercase tracking-widest text-xs shadow-xl"
          >
            <Sparkles size={14} className="text-aerkm-gold" />
            <span>S'inscrire</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          <Link
            to={user?.role === 'ADMIN' ? '/admin' : '/etudiant'}
            onClick={() => setIsOpen(false)}
            className="flex items-center justify-center space-x-2 w-full py-4 rounded-xl bg-aerkm-blue text-white font-black uppercase tracking-widest text-xs shadow-xl"
          >
            <UserIcon size={16} />
            <span>Mon espace</span>
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center justify-center space-x-3 w-full py-4 rounded-xl bg-red-50 text-red-600 font-black uppercase tracking-widest text-xs"
          >
            <LogOut size={18} />
            <span>Déconnexion</span>
          </button>
        </div>
      )}
    </div>
  </div>
)}

    </nav>
  );
};

export default Navbar;
