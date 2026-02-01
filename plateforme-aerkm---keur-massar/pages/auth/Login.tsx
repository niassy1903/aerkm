import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LogIn, Mail, Lock, AlertCircle, ArrowRight,
  ShieldCheck, Sparkles, ArrowLeft, CheckCircle2, ShieldQuestion, KeyRound, Loader2, ChevronRight
} from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [view, setView] = useState<'LOGIN' | 'FORGOT_EMAIL' | 'SECURITY_QUESTIONS' | 'NEW_PASSWORD'>('LOGIN');
  
  const [questions, setQuestions] = useState<string[]>([]);
  const [answers, setAnswers] = useState<string[]>(['', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const API_URL = 'https://aerkm.onrender.com/api';

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

  const handleFetchQuestions = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/auth/forgot-password-questions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (res.ok) {
        setQuestions(data.questions);
        setView('SECURITY_QUESTIONS');
      } else {
        setError(data.message || "Email non reconnu.");
      }
    } catch (err) {
      setError("Erreur de connexion.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAnswers = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/auth/verify-security-answers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, answers })
      });
      const data = await res.json();
      if (res.ok && data.verified) {
        setView('NEW_PASSWORD');
      } else {
        setError(data.message || "Une ou plusieurs réponses sont incorrectes.");
      }
    } catch (err) {
      setError("Erreur serveur.");
    } finally {
      setLoading(false);
    }
  };

  const handleFinalReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    if (newPassword.length < 6) {
      setError("Le mot de passe doit comporter au moins 6 caractères.");
      return;
    }

    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/auth/reset-password-security`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, answers, newPassword })
      });
      if (res.ok) {
        setSuccess("Mot de passe mis à jour avec succès !");
        setTimeout(() => {
          setView('LOGIN');
          setSuccess('');
          setPassword('');
        }, 3000);
      } else {
        const data = await res.json();
        setError(data.message || "Erreur de réinitialisation.");
      }
    } catch (err) {
      setError("Erreur de serveur.");
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = (hasError: boolean) => `
    block w-full pl-14 pr-6 py-5 bg-slate-50 dark:bg-slate-800/50 border-2 
    ${hasError ? 'border-red-500' : 'border-slate-100 dark:border-slate-700'} 
    rounded-2xl focus:ring-4 focus:ring-aerkm-blue/5 focus:border-aerkm-blue dark:focus:border-aerkm-gold transition-all outline-none font-bold text-slate-800 dark:text-white
    placeholder:text-slate-300 dark:placeholder:text-slate-600
  `;

  return (
    <div className="min-h-screen flex items-center justify-center bg-aerkm-blue relative overflow-hidden px-4 font-sans">
      {/* Background blobs */}
      <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-aerkm-brown/20 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[700px] h-[700px] bg-blue-500/10 rounded-full blur-[150px]"></div>

      {/* Back to Home Button */}
      <Link to="/" className="absolute top-8 left-8 z-50 flex items-center space-x-3 px-6 py-3 bg-white/10 backdrop-blur-xl border border-white/20 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-white hover:text-aerkm-blue transition-all group shadow-2xl">
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        <span>Retour Accueil</span>
      </Link>

      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 bg-white/5 backdrop-blur-2xl rounded-[3.5rem] shadow-3xl border border-white/10 overflow-hidden relative z-10 animate-in fade-in zoom-in duration-700">
        
        {/* Left Side: Branding */}
        <div className="hidden lg:flex flex-col justify-center p-16 bg-gradient-to-br from-aerkm-blue via-aerkm-blue/90 to-blue-900 text-white relative">
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
          <div className="relative z-10">
            <div className="bg-white/10 w-24 h-24 rounded-[2rem] flex items-center justify-center mb-10 backdrop-blur-md border border-white/20 shadow-2xl">
              {view === 'LOGIN' ? <ShieldCheck size={48} className="text-aerkm-gold" /> : <ShieldQuestion size={48} className="text-aerkm-gold" />}
            </div>
            <h1 className="text-5xl font-black tracking-tighter leading-none mb-6">
              Portail <br/> <span className="text-aerkm-gold">Officiel</span> AERKM
            </h1>
            <p className="text-xl text-blue-100/70 font-medium leading-relaxed max-w-sm mb-12">
              {view === 'LOGIN' ? "Votre excellence académique commence par une connexion sécurisée à votre espace personnel." : "Récupérez l'accès à votre dossier étudiant en quelques étapes de sécurité."}
            </p>
            <div className="flex items-center space-x-4 text-[10px] font-black uppercase tracking-[0.3em] text-aerkm-gold">
              <Sparkles size={18} />
              <span>Savoir • Solidarité • Succès</span>
            </div>
          </div>
        </div>

        {/* Right Side: Dynamic Form Container */}
        <div className="p-8 lg:p-14 bg-white dark:bg-slate-900 flex flex-col justify-center min-h-[650px] relative transition-colors duration-500">
          
          <div className="mb-12 text-center animate-in fade-in slide-in-from-top-4 duration-500">
            <h2 className="text-4xl font-black text-aerkm-blue dark:text-white tracking-tighter">
              {view === 'LOGIN' ? 'Bienvenue' : view === 'FORGOT_EMAIL' ? 'Récupération' : view === 'SECURITY_QUESTIONS' ? 'Vérification' : 'Nouveau Password'}
            </h2>
            <p className="text-slate-400 font-bold uppercase text-[9px] tracking-[0.3em] mt-3">
               {view === 'LOGIN' ? 'Connectez-vous à votre espace' : 'Réinitialisation sécurisée'}
            </p>
          </div>

          {error && (
            <div className="mb-8 p-5 bg-red-50 border border-red-100 text-red-600 rounded-3xl flex items-center space-x-4 animate-shake">
              <div className="w-10 h-10 bg-red-100 rounded-2xl flex items-center justify-center shrink-0">
                <AlertCircle size={20} />
              </div>
              <p className="text-[11px] font-black uppercase tracking-tight">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-8 p-6 bg-green-50 border border-green-100 text-green-700 rounded-3xl flex items-center space-x-5 animate-in fade-in zoom-in duration-500">
              <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center shrink-0">
                <CheckCircle2 size={24} className="text-green-600" />
              </div>
              <p className="text-xs font-black uppercase tracking-widest leading-relaxed">{success}</p>
            </div>
          )}

          {/* VIEW: LOGIN FORM */}
          {view === 'LOGIN' && (
            <form onSubmit={handleLogin} className="space-y-8 animate-in fade-in duration-500">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Institutionnel</label>
                <div className="relative group">
                  <span className="absolute inset-y-0 left-0 pl-5 flex items-center text-slate-300 group-focus-within:text-aerkm-blue transition-colors">
                    <Mail size={22} />
                  </span>
                  <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={inputClasses(false)} placeholder="nom.prenom@bambey.sn" />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mot de passe</label>
                  <button type="button" onClick={() => { setView('FORGOT_EMAIL'); setError(''); }} className="text-[9px] font-black text-aerkm-brown hover:text-aerkm-blue transition-colors uppercase tracking-widest">Oublié ?</button>
                </div>
                <div className="relative group">
                  <span className="absolute inset-y-0 left-0 pl-5 flex items-center text-slate-300 group-focus-within:text-aerkm-blue transition-colors">
                    <Lock size={22} />
                  </span>
                  <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className={inputClasses(false)} placeholder="••••••••••••" />
                </div>
              </div>

              <button type="submit" disabled={loading} className="group w-full bg-aerkm-blue hover:bg-blue-800 text-white font-black py-6 rounded-3xl shadow-3xl shadow-aerkm-blue/30 transition-all transform hover:scale-[1.02] active:scale-95 flex items-center justify-center space-x-4 disabled:opacity-70 overflow-hidden relative">
                <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                {loading ? <Loader2 className="animate-spin" size={28} /> : (
                  <>
                    <span className="text-xs uppercase tracking-[0.3em]">Connexion au portail</span>
                    <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              <div className="mt-12 pt-8 border-t border-slate-50 dark:border-slate-800 text-center">
                 <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em]">
                  Nouvel étudiant ? <Link to="/inscription" className="text-aerkm-brown hover:text-aerkm-brownLight underline decoration-2 underline-offset-4 font-black">Inscrivez-vous ici</Link>
                </p>
              </div>
            </form>
          )}

          {/* VIEW: FORGOT_EMAIL */}
          {view === 'FORGOT_EMAIL' && (
            <form onSubmit={handleFetchQuestions} className="space-y-10 animate-in slide-in-from-right-8 duration-500">
              <div className="bg-blue-50/50 dark:bg-blue-900/10 p-8 rounded-[2.5rem] border border-blue-100 dark:border-blue-900/30">
                 <p className="text-xs text-slate-600 dark:text-blue-100 font-bold leading-relaxed italic">
                   "Veuillez saisir l'email institutionnel utilisé lors de votre recensement pour accéder à vos questions de récupération."
                 </p>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Vérification du compte</label>
                <div className="relative group">
                  <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={22} />
                  <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={inputClasses(false)} placeholder="votre.email@bambey.sn" />
                </div>
              </div>
              <div className="flex flex-col space-y-4">
                <button type="submit" disabled={loading} className="w-full bg-aerkm-brown hover:bg-aerkm-brownLight text-white font-black py-6 rounded-3xl shadow-2xl flex items-center justify-center space-x-3 uppercase text-xs tracking-widest disabled:opacity-50 transition-all transform hover:scale-[1.01]">
                  {loading ? <Loader2 className="animate-spin" size={24} /> : <><span>Identifier mon compte</span><ChevronRight size={20}/></>}
                </button>
                <button type="button" onClick={() => setView('LOGIN')} className="w-full text-center text-[10px] font-black uppercase text-slate-400 hover:text-aerkm-blue tracking-widest py-2 transition-colors">Retour à la connexion</button>
              </div>
            </form>
          )}

          {/* VIEW: SECURITY_QUESTIONS - STEP 2 */}
          {view === 'SECURITY_QUESTIONS' && (
            <form onSubmit={handleVerifyAnswers} className="space-y-8 max-h-[75vh] overflow-y-auto no-scrollbar pr-1 animate-in slide-in-from-right-8 duration-500">
              <div className="bg-aerkm-gold/10 p-8 rounded-[2.5rem] border border-aerkm-gold/20 flex items-start space-x-5">
                 <ShieldQuestion className="text-aerkm-gold shrink-0" size={32} />
                 <div>
                   <p className="text-xs text-aerkm-brown font-black uppercase tracking-tight">Vérification de sécurité</p>
                   <p className="text-[11px] text-slate-600 dark:text-slate-300 font-bold leading-relaxed mt-1 italic">Répondez aux questions pour prouver votre identité.</p>
                 </div>
              </div>

              <div className="space-y-8">
                {questions.map((q, idx) => (
                  <div key={idx} className="space-y-3 group">
                    <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800 group-focus-within:border-aerkm-blue transition-all">
                      <p className="text-[9px] font-black text-aerkm-blue dark:text-aerkm-gold uppercase tracking-[0.2em] mb-1">Question {idx + 1}</p>
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{q}</p>
                    </div>
                    <input 
                      type="text" 
                      required 
                      value={answers[idx]} 
                      onChange={(e) => {
                        const newAns = [...answers];
                        newAns[idx] = e.target.value;
                        setAnswers(newAns);
                      }} 
                      className={inputClasses(false)} 
                      placeholder="Saisissez votre réponse secrète..." 
                    />
                  </div>
                ))}
              </div>

              <div className="pt-6 space-y-4">
                <button type="submit" disabled={loading} className="w-full bg-aerkm-blue text-white font-black py-6 rounded-3xl shadow-xl flex items-center justify-center space-x-4 uppercase text-xs tracking-widest hover:bg-blue-800 transition-all transform hover:scale-[1.01]">
                  {loading ? <Loader2 className="animate-spin" size={24} /> : <><span>Vérifier mes réponses</span><CheckCircle2 size={20}/></>}
                </button>
                <button type="button" onClick={() => setView('FORGOT_EMAIL')} className="w-full text-center text-[10px] font-black uppercase text-slate-400 hover:text-aerkm-blue tracking-widest py-2 transition-colors">Modifier l'email</button>
              </div>
            </form>
          )}

          {/* VIEW: NEW_PASSWORD - FINAL STEP */}
          {view === 'NEW_PASSWORD' && (
            <form onSubmit={handleFinalReset} className="space-y-8 animate-in zoom-in duration-500">
              <div className="bg-green-50/80 dark:bg-green-950/20 p-8 rounded-[2.5rem] border border-green-200 dark:border-green-900/40 flex items-center space-x-5">
                 <div className="w-12 h-12 bg-green-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/20"><CheckCircle2 size={28}/></div>
                 <div>
                   <p className="text-xs font-black text-green-700 dark:text-green-400 uppercase tracking-widest">Identité Validée !</p>
                   <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mt-0.5">Choisissez maintenant votre nouveau mot de passe.</p>
                 </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-aerkm-blue dark:text-aerkm-gold uppercase tracking-widest ml-1">Nouveau mot de passe</label>
                  <div className="relative">
                    <KeyRound className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={22} />
                    <input type="password" required value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className={inputClasses(false)} placeholder="Minimum 6 caractères" />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-aerkm-blue dark:text-aerkm-gold uppercase tracking-widest ml-1">Confirmation</label>
                  <div className="relative">
                    <KeyRound className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={22} />
                    <input type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={inputClasses(false)} placeholder="Répétez le mot de passe" />
                  </div>
                </div>
              </div>

              <button type="submit" disabled={loading} className="w-full bg-green-600 hover:bg-green-700 text-white font-black py-6 rounded-3xl shadow-2xl shadow-green-600/30 flex items-center justify-center space-x-4 uppercase text-xs tracking-[0.2em] transition-all transform hover:scale-[1.02]">
                {loading ? <Loader2 className="animate-spin" size={24} /> : <><span>Enregistrer et se connecter</span><ArrowRight size={22}/></>}
              </button>
            </form>
          )}

        </div>
      </div>
      
      {/* Footer Text */}
      <p className="absolute bottom-8 text-[10px] font-black text-white/30 uppercase tracking-[0.5em] pointer-events-none">
        AERKM Secure Access Protocol v2.5
      </p>
    </div>
  );
};

export default Login;