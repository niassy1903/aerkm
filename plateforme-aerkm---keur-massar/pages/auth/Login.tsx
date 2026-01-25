
import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LogIn, Mail, Lock, AlertCircle, ArrowRight,
  ShieldCheck, Sparkles, ArrowLeft, CheckCircle2
} from 'lucide-react';

const Login: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  
  // URL de l'API en production sur Render
  const API_URL = 'https://aerkm.onrender.com/api';

  // Fonction pour extraire le token même avec HashRouter
  const getUrlToken = () => {
    const tokenFromParams = searchParams.get('token');
    if (tokenFromParams) return tokenFromParams;
    
    // Fallback manuel pour HashRouter
    const hash = window.location.hash;
    if (hash.includes('?')) {
      const query = hash.split('?')[1];
      const params = new URLSearchParams(query);
      return params.get('token');
    }
    return null;
  };

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Initialisation dynamique de la vue
  const [view, setView] = useState<'LOGIN' | 'FORGOT' | 'RESET'>(
    getUrlToken() ? 'RESET' : 'LOGIN'
  );
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Surveillance du token dans l'URL
  useEffect(() => {
    const token = getUrlToken();
    if (token) {
      setView('RESET');
    }
  }, [searchParams]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const successLogin = await login(email, password);
      if (successLogin) {
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
        setSuccess("Un lien de réinitialisation a été envoyé. Vérifiez vos emails.");
      } else {
        const data = await res.json();
        setError(data.message || "Email non reconnu.");
      }
    } catch (err) {
      setError("Erreur de connexion au serveur.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = getUrlToken();

    if (!token) {
      setError("Token de réinitialisation manquant.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword })
      });
      
      if (res.ok) {
        setSuccess("Mot de passe réinitialisé ! Redirection...");
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
      setError("Erreur serveur.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-aerkm-blue relative overflow-hidden px-4">
      {/* Bouton Retour */}
      <Link
        to="/"
        className="absolute top-8 left-8 z-50 flex items-center space-x-2 px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white hover:text-aerkm-blue transition-all group"
      >
        <ArrowLeft size={16} />
        <span>Accueil</span>
      </Link>

      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 bg-white/5 backdrop-blur-2xl rounded-[3rem] shadow-3xl border border-white/10 overflow-hidden relative z-10">
        <div className="hidden lg:flex flex-col justify-center p-16 bg-gradient-to-br from-aerkm-blue to-aerkm-blue/80 text-white">
          <div className="bg-white/10 w-20 h-20 rounded-3xl flex items-center justify-center mb-10 backdrop-blur-md border border-white/20">
            <ShieldCheck size={40} className="text-aerkm-gold" />
          </div>
          <h1 className="text-5xl font-black tracking-tighter leading-none mb-6">
            Portail <br/> <span className="text-aerkm-gold">Officiel</span> AERKM
          </h1>
          <p className="text-xl text-blue-100/70 font-medium leading-relaxed max-w-sm">
            Accédez à votre espace sécurisé pour gérer votre dossier étudiant.
          </p>
        </div>

        <div className="p-8 lg:p-16 bg-white flex flex-col justify-center min-h-[550px]">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-black text-aerkm-blue">
              {view === 'LOGIN' ? 'Connexion' : view === 'FORGOT' ? 'Récupération' : 'Nouveau mot de passe'}
            </h2>
          </div>

          {(error || success) && (
            <div className={`mb-6 p-4 rounded-2xl flex items-center space-x-3 border animate-in fade-in ${error ? 'bg-red-50 text-red-700 border-red-100' : 'bg-green-50 text-green-700 border-green-100'}`}>
              {error ? <AlertCircle size={20} /> : <CheckCircle2 size={20} />}
              <p className="text-xs font-bold">{error || success}</p>
            </div>
          )}

          {view === 'LOGIN' && (
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Institutionnel</label>
                <div className="relative group">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                  <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none font-bold text-slate-800 focus:border-aerkm-blue transition-all" placeholder="nom.prenom@bambey.sn" />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mot de passe</label>
                   <button type="button" onClick={() => setView('FORGOT')} className="text-[10px] font-black text-aerkm-brown uppercase hover:underline">Oublié ?</button>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                  <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none font-bold text-slate-800 focus:border-aerkm-blue transition-all" placeholder="••••••••" />
                </div>
              </div>

              <button type="submit" disabled={loading} className="w-full bg-aerkm-blue text-white font-black py-5 rounded-2xl shadow-xl flex items-center justify-center space-x-3 uppercase text-xs tracking-widest disabled:opacity-50">
                {loading ? <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div> : <><span>Accéder à l'espace</span><ArrowRight size={20} /></>}
              </button>
              
              <p className="text-center text-[10px] font-black uppercase text-slate-400">Pas de compte ? <Link to="/inscription" className="text-aerkm-brown underline">S'inscrire</Link></p>
            </form>
          )}

          {view === 'FORGOT' && (
            <form onSubmit={handleForgot} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email pour le lien</label>
                <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full px-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none font-bold text-slate-800" placeholder="votre@email.com" />
              </div>
              <button type="submit" disabled={loading} className="w-full bg-aerkm-brown text-white font-black py-5 rounded-2xl shadow-xl flex items-center justify-center space-x-3 uppercase text-xs tracking-widest">
                {loading ? <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div> : <span>Envoyer le lien</span>}
              </button>
              <button type="button" onClick={() => setView('LOGIN')} className="w-full text-center text-[10px] font-black uppercase text-slate-400">Retour</button>
            </form>
          )}

          {view === 'RESET' && (
            <form onSubmit={handleReset} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nouveau mot de passe</label>
                <input type="password" required value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full px-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none font-bold text-slate-800" placeholder="••••••••" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Confirmer</label>
                <input type="password" required value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full px-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none font-bold text-slate-800" placeholder="••••••••" />
              </div>
              <button type="submit" disabled={loading} className="w-full bg-green-600 text-white font-black py-5 rounded-2xl shadow-xl flex items-center justify-center space-x-3 uppercase text-xs tracking-widest">
                {loading ? <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div> : <span>Sauvegarder</span>}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;