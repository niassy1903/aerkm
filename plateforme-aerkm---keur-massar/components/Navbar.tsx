
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Menu, X, LogOut, User as UserIcon, Calendar, Home, Info, Phone, GraduationCap, Sparkles, Users, Sun, Moon } from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
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
    { name: 'L\'Amicale', path: '/aerkm', icon: <Info size={18} /> },
    { name: 'Le Bureau', path: '/bureau', icon: <Users size={18} /> },
    { name: 'Agenda', path: '/evenements', icon: <Calendar size={18} /> },
    { name: 'Contact', path: '/contact', icon: <Phone size={18} /> },
  ];

  const isActive = (path: string) => location.pathname === path;
  const isHomePage = location.pathname === '/';
  const shouldHaveBg = scrolled || !isHomePage;

  return (
    <nav className={`fixed top-0 left-0 w-full z-[1000] transition-all duration-500 ease-in-out ${
      shouldHaveBg 
      ? 'bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl shadow-[0_10px_40px_rgba(0,0,0,0.05)] py-3 border-b border-slate-100 dark:border-slate-800' 
      : 'bg-transparent py-6'
    }`}>
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className={`p-2 rounded-2xl transition-all duration-500 group-hover:rotate-[10deg] shadow-2xl ${
                shouldHaveBg ? 'bg-aerkm-blue text-white shadow-aerkm-blue/20' : 'bg-white text-aerkm-blue'
              }`}>
                <GraduationCap size={24} strokeWidth={2.5} />
              </div>
              <div className="flex flex-col">
                <span className={`font-black text-xl lg:text-2xl tracking-tighter leading-none transition-colors duration-300 ${
                  shouldHaveBg ? 'text-aerkm-blue dark:text-white' : 'text-white'
                }`}>AERKM</span>
                <span className={`text-[8px] lg:text-[10px] font-black uppercase tracking-[0.2em] mt-1 transition-colors duration-300 ${
                  shouldHaveBg ? 'text-aerkm-brown dark:text-aerkm-gold' : 'text-aerkm-gold'
                }`}>Bambey • Keur Massar</span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`relative px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 group ${
                  isActive(link.path)
                  ? (shouldHaveBg ? 'bg-aerkm-blue/5 dark:bg-white/5 text-aerkm-blue dark:text-white' : 'bg-white/10 text-white backdrop-blur-md')
                  : (shouldHaveBg ? 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-aerkm-blue dark:hover:text-white' : 'text-white/80 hover:text-white hover:bg-white/10')
                }`}
              >
                <span className="relative z-10">{link.name}</span>
                {isActive(link.path) && (
                  <span className={`absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full ${
                    shouldHaveBg ? 'bg-aerkm-blue dark:bg-aerkm-gold' : 'bg-aerkm-gold'
                  }`}></span>
                )}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className={`p-2.5 rounded-xl transition-all duration-300 group ${
                shouldHaveBg ? 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800' : 'text-white/80 hover:bg-white/10'
              }`}
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>

            {isAuthenticated ? (
              <div className="flex items-center space-x-2 bg-slate-100/10 p-1 rounded-[2rem] backdrop-blur-sm border border-white/10">
                <Link 
                  to={user?.role === 'ADMIN' ? '/admin' : '/etudiant'} 
                  className={`flex items-center space-x-2 px-5 py-2.5 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all transform active:scale-95 ${
                    shouldHaveBg ? 'bg-aerkm-blue text-white shadow-xl shadow-aerkm-blue/20' : 'bg-white text-aerkm-blue shadow-2xl'
                  }`}
                >
                  <UserIcon size={14} />
                  <span>ESPACE {user?.role}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className={`p-2.5 rounded-xl transition-all duration-300 ${
                    shouldHaveBg ? 'text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30' : 'text-white hover:bg-white/20'
                  }`}
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/login" 
                  className={`px-4 py-2.5 text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                    shouldHaveBg ? 'text-slate-500 dark:text-slate-400 hover:text-aerkm-blue dark:hover:text-white' : 'text-white/80 hover:text-white'
                  }`}
                >
                  Connexion
                </Link>
                <Link 
                  to="/inscription" 
                  className="group relative px-6 py-3.5 text-[10px] font-black uppercase tracking-[0.1em] bg-aerkm-brown text-white rounded-[1.2rem] hover:bg-aerkm-brownLight transition-all shadow-2xl shadow-aerkm-brown/30 transform hover:-translate-y-1 active:scale-95 flex items-center space-x-2"
                >
                  <Sparkles size={14} className="text-aerkm-gold" />
                  <span>S'INSCRIRE</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className={`p-2.5 rounded-xl ${shouldHaveBg ? 'text-slate-500 dark:text-slate-400' : 'text-white'}`}
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2.5 rounded-xl transition-all duration-300 ${
                shouldHaveBg ? 'bg-aerkm-blue text-white' : 'bg-white text-aerkm-blue shadow-xl'
              }`}
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <div className={`lg:hidden fixed inset-x-0 top-[5.5rem] p-4 transition-all duration-500 ease-in-out z-[999] ${
        isOpen ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-10 scale-95 pointer-events-none'
      }`}>
        <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-3xl rounded-[2rem] shadow-[0_30px_60px_rgba(0,0,0,0.15)] border border-slate-100 dark:border-slate-800 overflow-hidden p-6">
          <div className="space-y-2 mb-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`flex items-center space-x-4 px-5 py-4 rounded-xl text-sm font-black uppercase tracking-widest transition-all ${
                  isActive(link.path)
                  ? 'bg-aerkm-blue text-white shadow-xl shadow-aerkm-blue/20'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
                onClick={() => setIsOpen(false)}
              >
                <div className={`${isActive(link.path) ? 'text-aerkm-gold' : 'text-aerkm-brown'}`}>
                  {link.icon}
                </div>
                <span>{link.name}</span>
              </Link>
            ))}
          </div>

          {/* Action Buttons in Mobile Menu */}
          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-3">
            {!isAuthenticated ? (
              <div className="grid grid-cols-1 gap-3">
                <Link
                  to="/login"
                  className="flex items-center justify-center w-full py-4 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-white rounded-xl font-black uppercase tracking-widest text-xs"
                  onClick={() => setIsOpen(false)}
                >
                  Connexion
                </Link>
                <Link
                  to="/inscription"
                  className="flex items-center justify-center w-full py-4 bg-aerkm-brown text-white rounded-xl font-black uppercase tracking-widest text-xs shadow-xl shadow-aerkm-brown/30"
                  onClick={() => setIsOpen(false)}
                >
                  <Sparkles size={14} className="mr-2 text-aerkm-gold" />
                  S'inscrire
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                <Link
                  to={user?.role === 'ADMIN' ? '/admin' : '/etudiant'}
                  className="flex items-center justify-center w-full py-4 bg-aerkm-blue text-white rounded-xl font-black uppercase tracking-widest text-xs shadow-xl shadow-aerkm-blue/20"
                  onClick={() => setIsOpen(false)}
                >
                  <UserIcon size={16} className="mr-2" />
                  Mon Espace
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center space-x-3 w-full py-4 bg-red-50 dark:bg-red-950/20 text-red-600 rounded-xl font-black uppercase tracking-widest text-xs"
                >
                  <LogOut size={18} />
                  <span>Déconnexion</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
