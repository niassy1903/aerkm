
import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageCircle, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    sujet: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'IDLE' | 'SUCCESS' | 'ERROR'>('IDLE');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus('IDLE');
    setErrorMessage('');

    try {
      const response = await fetch('https://aerkm.onrender.com/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus('SUCCESS');
        setFormData({ nom: '', email: '', sujet: '', message: '' });
      } else {
        const data = await response.json();
        setErrorMessage(data.message || "Une erreur est survenue lors de l'envoi.");
        setStatus('ERROR');
      }
    } catch (err) {
      setErrorMessage("Impossible de contacter le serveur. Veuillez réessayer plus tard.");
      setStatus('ERROR');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen py-16 px-6 transition-colors duration-500">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-black text-slate-900 dark:text-white mb-4 tracking-tighter">Contactez l'AERKM</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 font-medium">Le bureau reste à votre écoute pour toute suggestion ou difficulté.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Info Card */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-aerkm-blue dark:bg-slate-900 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden transition-colors">
               <div className="absolute top-0 right-0 p-8 opacity-5">
                <Mail size={150} />
              </div>
              <h2 className="text-2xl font-bold mb-8 relative z-10">Informations</h2>
              <div className="space-y-8 relative z-10">
                <div className="flex items-center space-x-4 group">
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center group-hover:bg-aerkm-gold transition-colors">
                    <Phone size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-blue-200">Téléphone</p>
                    <p className="font-bold">+221 33 000 00 00</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 group">
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center group-hover:bg-aerkm-gold transition-colors">
                    <Mail size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-blue-200">Email</p>
                    <p className="font-bold">contact@aerkm.sn</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 group">
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center group-hover:bg-aerkm-gold transition-colors">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-blue-200">Localisation</p>
                    <p className="font-bold">Université de Bambey, Sénégal</p>
                  </div>
                </div>
              </div>

              <div className="mt-12 pt-12 border-t border-white/10 flex space-x-4 relative z-10">
                <a 
                  href="https://wa.me/221330000000" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex-1 bg-green-500 hover:bg-green-600 py-3 rounded-xl flex items-center justify-center space-x-2 transition-all shadow-lg"
                >
                  <MessageCircle size={18} />
                  <span className="font-bold">WhatsApp</span>
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl p-8 lg:p-12 border border-slate-100 dark:border-slate-800 transition-colors">
              
              {status === 'SUCCESS' && (
                <div className="mb-8 p-6 bg-green-50 dark:bg-green-950/20 border border-green-100 dark:border-green-900/30 rounded-2xl flex items-center space-x-4 animate-in slide-in-from-top-4">
                  <CheckCircle2 className="text-green-500 shrink-0" size={24} />
                  <div>
                    <p className="text-green-800 dark:text-green-400 font-bold">Message envoyé avec succès !</p>
                    <p className="text-green-600 dark:text-green-500 text-xs">Nous vous répondrons dans les plus brefs délais.</p>
                  </div>
                </div>
              )}

              {status === 'ERROR' && (
                <div className="mb-8 p-6 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 rounded-2xl flex items-center space-x-4 animate-in slide-in-from-top-4">
                  <AlertCircle className="text-red-500 shrink-0" size={24} />
                  <div>
                    <p className="text-red-800 dark:text-red-400 font-bold">Erreur lors de l'envoi</p>
                    <p className="text-red-600 dark:text-red-500 text-xs">{errorMessage}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Prénom & Nom</label>
                    <input 
                      name="nom"
                      required
                      value={formData.nom}
                      onChange={handleChange}
                      type="text" 
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-aerkm-blue dark:focus:ring-aerkm-gold outline-none transition-all font-medium text-slate-700 dark:text-white"
                      placeholder="Moussa Diop"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Email</label>
                    <input 
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      type="email" 
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-aerkm-blue dark:focus:ring-aerkm-gold outline-none transition-all font-medium text-slate-700 dark:text-white"
                      placeholder="moussa@email.com"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Sujet</label>
                  <input 
                    name="sujet"
                    required
                    value={formData.sujet}
                    onChange={handleChange}
                    type="text" 
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-aerkm-blue dark:focus:ring-aerkm-gold outline-none transition-all font-medium text-slate-700 dark:text-white"
                    placeholder="Objet de votre message"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Message</label>
                  <textarea 
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    rows={6} 
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-aerkm-blue dark:focus:ring-aerkm-gold outline-none transition-all font-medium text-slate-700 dark:text-white"
                    placeholder="Comment pouvons-nous vous aider ?"
                  ></textarea>
                </div>
                <button 
                  disabled={loading}
                  type="submit"
                  className="bg-aerkm-blue hover:bg-blue-800 text-white font-bold py-4 px-10 rounded-2xl shadow-lg shadow-blue-600/20 transition-all flex items-center space-x-3 disabled:opacity-50 disabled:pointer-events-none transform active:scale-95"
                >
                  {loading ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Send size={18} />
                  )}
                  <span>{loading ? 'Envoi en cours...' : 'Envoyer le message'}</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;