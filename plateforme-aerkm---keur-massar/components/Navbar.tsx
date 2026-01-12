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
  GraduationCap,
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
    { name: 'Contact', path: '/contact', icon: <Phone size={18} /> },
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

          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div
              className={`p-2 rounded-2xl shadow-xl ${
                shouldHaveBg ? 'bg-aerkm-blue text-white' : 'bg-white text-aerkm-blue'
              }`}
            >
              <GraduationCap size={24} strokeWidth={2.5} />
            </div>
            <div>
              <span className={`font-black text-xl ${
                shouldHaveBg ? 'text-aerkm-blue' : 'text-white'
              }`}>
                AERKM
              </span>
              <div className={`text-[10px] font-black tracking-[0.2em] ${
                shouldHaveBg ? 'text-aerkm-brown' : 'text-aerkm-gold'
              }`}>
                Bambey • Keur Massar
              </div>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex space-x-1">
            {navLinks.map(link => (
              <Link
                key={link.name}
                to={link.path}
                className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition ${
                  isActive(link.path)
                    ? 'bg-aerkm-blue/5 text-aerkm-blue'
                    : shouldHaveBg
                    ? 'text-slate-600 hover:text-aerkm-blue hover:bg-slate-50'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link
                  to={user?.role === 'ADMIN' ? '/admin' : '/etudiant'}
                  className="flex items-center space-x-2 px-5 py-2.5 bg-aerkm-blue text-white rounded-full text-[10px] font-black uppercase"
                >
                  <UserIcon size={14} />
                  <span>ESPACE {user?.role}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2.5 text-red-500 hover:bg-red-50 rounded-xl"
                >
                  <LogOut size={18} />
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`text-[10px] font-black uppercase ${
                    shouldHaveBg ? 'text-slate-600' : 'text-white'
                  }`}
                >
                  Connexion
                </Link>
                <Link
                  to="/inscription"
                  className="flex items-center space-x-2 px-6 py-3 bg-aerkm-brown text-white rounded-xl text-[10px] font-black uppercase shadow-xl"
                >
                  <Sparkles size={14} className="text-aerkm-gold" />
                  <span>S'inscrire</span>
                </Link>
              </>
            )}
          </div>

          {/* Mobile buttons */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`lg:hidden p-2.5 rounded-xl ${
              shouldHaveBg ? 'bg-aerkm-blue text-white' : 'bg-white text-aerkm-blue'
            }`}
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
