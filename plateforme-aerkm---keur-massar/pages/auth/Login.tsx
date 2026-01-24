
import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LogIn, Mail, Lock, AlertCircle, ArrowRight,
  ShieldCheck, Sparkles, ArrowLeft, CheckCircle2
} from 'lucide-react';

const Login: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [view, setView] = useState<'LOGIN' | 'FORGOT' | 'RESET'>('LOGIN');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  // URL de l'API en production
  const API_URL = 'http://localhost:5000/api';

  // Détection du token dans l'URL
  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      setView('RESET');
    }
  }, [searchParams]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const success = await login(email, password);
      if (success) {
        const user = JSON.parse(localStorage.getItem('aerkm_user') || '{}');
        navigate(user.role === 'ADMIN' ? '/admin' : '/etudiant');
      } else {
        setError('Email ou mot de passe incorrect.');
      }
    } catch (err) {
      setError('Une erreur est survenue.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await fetch(`${API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      if (res.ok) {
        setSuccess("Un lien de réinitialisation a été envoyé à votre adresse email. Veuillez vérifier votre boîte de réception.");
      } else {
        const data = await res.json();
        setError(data.message || "Cet email n'est pas reconnu.");
      }
    } catch (err) {
      setError("Erreur de connexion au serveur.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    if (newPassword.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }

    setLoading(true);
    setError('');
    const token = searchParams.get('token');

    try {
      const res = await fetch(`${API_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword })
      });
      
      if (res.ok) {
        setSuccess("Votre mot de passe a été réinitialisé avec succès !");
        setTimeout(() => {
          setView('LOGIN');
          setSuccess('');
          navigate('/login');
        }, 3000);
      } else {
        const data = await res.json();
        setError(data.message || "Lien invalide ou expiré.");
      }
    } catch (err) {
      setError("Erreur de connexion au serveur.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-aerkm-blue relative overflow-hidden px-4">
      {/* Floating Back Button */}
      <Link
        to="/"
        className="absolute top-8 left-8 z-50 flex items-center space-x-2 px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white hover:text-aerkm-blue transition-all group shadow-2xl"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        <span>Retour à l'accueil</span>
      </Link>

      {/* Animated backgrounds */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-aerkm-brown/20 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[150px]"></div>

      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 bg-white/5 backdrop-blur-2xl rounded-[3rem] shadow-3xl border border-white/10 overflow-hidden relative z-10">
        {/* Left Side: Branding (hidden on mobile) */}
        <div className="hidden lg:flex flex-col justify-center p-16 bg-gradient-to-br from-aerkm-blue to-aerkm-blue/80 text-white relative">
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
          <div className="relative z-10">
            <div className="bg-white/10 w-20 h-20 rounded-3xl flex items-center justify-center mb-10 backdrop-blur-md border border-white/20">
              <ShieldCheck size={40} className="text-aerkm-gold" />
            </div>
            <h1 className="text-5xl font-black tracking-tighter leading-none mb-6">
              Portail <br/> <span className="text-aerkm-gold">Officiel</span> AERKM
            </h1>
            <p className="text-xl text-blue-100/70 font-medium leading-relaxed max-w-sm mb-12">
              L'excellence à Bambey commence par une connexion sécurisée à votre espace de réussite.
            </p>
            <div className="flex items-center space-x-4 text-sm font-black uppercase tracking-widest text-aerkm-gold">
              <Sparkles size={18} />
              <span>Savoir • Solidarité • Succès</span>
            </div>
          </div>
        </div>

        {/* Right Side: Dynamic Form */}
        <div className="p-8 lg:p-16 bg-white flex flex-col justify-center min-h-[500px]">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-black text-aerkm-blue">
              {view === 'LOGIN' ? 'Connexion' : view === 'FORGOT' ? 'Récupération de compte' : 'Sécurité de compte'}
            </h2>
            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em] mt-2">
               {view === 'LOGIN' ? 'Espace personnel étudiant' : view === 'FORGOT' ? 'Demande de réinitialisation' : 'Mise à jour du mot de passe'}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-2xl flex items-center space-x-3 border border-red-100 animate-in fade-in slide-in-from-top-2">
              <AlertCircle size={20} className="shrink-0" />
              <p className="text-xs font-bold">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 p-5 bg-green-50 text-green-700 rounded-2xl flex items-center space-x-4 border border-green-100 animate-in fade-in slide-in-from-top-2">
              <CheckCircle2 size={24} className="shrink-0 text-green-600" />
              <p className="text-xs font-bold leading-relaxed">{success}</p>
            </div>
          )}

          {/* Login Form */}
          {view === 'LOGIN' && (
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-black text-slate-700 uppercase tracking-widest ml-1">Email Institutionnel</label>
                <div className="relative group">
                  <span className="absolute inset-y-0 left-0 pl-5 flex items-center text-slate-400 group-focus-within:text-aerkm-blue transition-colors">
                    <Mail size={20} />
                  </span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:ring-4 focus:ring-aerkm-blue/5 focus:border-aerkm-blue transition-all outline-none font-bold text-slate-800"
                    placeholder="nom.prenom@bambey.sn"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <label className="text-sm font-black text-slate-700 uppercase tracking-widest">Mot de passe</label>
                  <button
                    type="button"
                    onClick={() => { setView('FORGOT'); setError(''); setSuccess(''); }}
                    className="text-xs font-bold text-aerkm-brown hover:underline"
                  >
                    Oublié ?
                  </button>
                </div>
                <div className="relative group">
                  <span className="absolute inset-y-0 left-0 pl-5 flex items-center text-slate-400 group-focus-within:text-aerkm-blue transition-colors">
                    <Lock size={20} />
                  </span>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:ring-4 focus:ring-aerkm-blue/5 focus:border-aerkm-blue transition-all outline-none font-bold text-slate-800"
                    placeholder="••••••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-aerkm-blue hover:bg-aerkm-blue/90 text-white font-black py-5 px-6 rounded-2xl shadow-2xl shadow-aerkm-blue/30 transition-all transform active:scale-95 flex items-center justify-center space-x-3 disabled:opacity-70"
              >
                {loading ? (
                  <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span className="text-xs uppercase tracking-widest">Accéder à mon espace</span>
                    <ArrowRight size={20} />
                  </>
                )}
              </button>

              <div className="mt-8 pt-8 border-t border-slate-50 text-center">
                 <p className="text-slate-500 font-bold text-xs uppercase tracking-wider">
                  Pas encore membre ?{' '}
                  <Link to="/inscription" className="text-aerkm-brown hover:text-aerkm-brownLight underline decoration-2 underline-offset-4 font-black">
                    Inscrivez-vous ici
                  </Link>
                </p>
              </div>
            </form>
          )}

          {/* Forgot Password Form */}
          {view === 'FORGOT' && (
            <form onSubmit={handleForgot} className="space-y-6">
              <div className="bg-blue-50/50 p-5 rounded-2xl border border-blue-100 mb-6">
                 <p className="text-xs text-slate-600 font-bold leading-relaxed">
                   Entrez l'adresse email utilisée lors de votre recensement. Si votre compte existe, un lien de réinitialisation vous sera envoyé.
                 </p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-black text-slate-700 uppercase tracking-widest ml-1">Email Institutionnel</label>
                <div className="relative group">
                  <span className="absolute inset-y-0 left-0 pl-5 flex items-center text-slate-400 group-focus-within:text-aerkm-blue transition-colors">
                    <Mail size={20} />
                  </span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:ring-4 focus:ring-aerkm-blue/5 focus:border-aerkm-blue transition-all outline-none font-bold text-slate-800"
                    placeholder="nom.prenom@bambey.sn"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-aerkm-brown hover:bg-aerkm-brown/90 text-white font-black py-5 px-6 rounded-2xl shadow-2xl shadow-aerkm-brown/30 transition-all transform active:scale-95 flex items-center justify-center space-x-3 disabled:opacity-70"
              >
                {loading ? (
                  <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span className="text-xs uppercase tracking-widest">Envoyer le lien de récupération</span>
                    <ArrowRight size={20} />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => { setView('LOGIN'); setError(''); setSuccess(''); }}
                className="w-full text-slate-400 text-[10px] font-black uppercase tracking-widest mt-4 hover:text-aerkm-blue flex items-center justify-center space-x-2"
              >
                <ArrowLeft size={14} />
                <span>Retour à la connexion</span>
              </button>
            </form>
          )}

          {/* Reset Password Form */}
          {view === 'RESET' && (
            <form onSubmit={handleReset} className="space-y-6">
              <div className="bg-aerkm-gold/10 p-5 rounded-2xl border border-aerkm-gold/20 mb-6">
                 <p className="text-xs text-aerkm-brown font-bold leading-relaxed">
                   Sécurité vérifiée. Veuillez définir un nouveau mot de passe fort pour protéger l'accès à votre dossier étudiant.
                 </p>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-black text-slate-700 uppercase tracking-widest ml-1">Nouveau mot de passe</label>
                <div className="relative group">
                  <span className="absolute inset-y-0 left-0 pl-5 flex items-center text-slate-400 group-focus-within:text-aerkm-blue transition-colors">
                    <Lock size={20} />
                  </span>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="block w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:ring-4 focus:ring-aerkm-blue/5 focus:border-aerkm-blue transition-all outline-none font-bold text-slate-800"
                    placeholder="••••••••••••"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-black text-slate-700 uppercase tracking-widest ml-1">Confirmer le mot de passe</label>
                <div className="relative group">
                  <span className="absolute inset-y-0 left-0 pl-5 flex items-center text-slate-400 group-focus-within:text-aerkm-blue transition-colors">
                    <CheckCircle2 size={20} />
                  </span>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="block w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:ring-4 focus:ring-aerkm-blue/5 focus:border-aerkm-blue transition-all outline-none font-bold text-slate-800"
                    placeholder="Réécrire le mot de passe"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-black py-5 px-6 rounded-2xl shadow-2xl shadow-green-600/30 transition-all transform active:scale-95 flex items-center justify-center space-x-3 disabled:opacity-70"
              >
                {loading ? (
                  <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span className="text-xs uppercase tracking-widest">Sauvegarder et se connecter</span>
                    <ArrowRight size={20} />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => { setView('LOGIN'); setError(''); setSuccess(''); navigate('/login'); }}
                className="w-full text-slate-400 text-[10px] font-black uppercase tracking-widest mt-4 hover:underline"
              >
                Annuler la réinitialisation
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;