
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/StudentContext';
import { Bell, Search, Settings, User, LogOut, X, Check, Info, Menu, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AdminNavbarProps {
  onToggleSidebar: () => void;
}

const AdminNavbar: React.FC<AdminNavbarProps> = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const { notifications, markNotifAsRead, clearNotifications } = useData();
  const [showNotifs, setShowNotifs] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-8 sticky top-0 z-[60]">
      <div className="flex items-center space-x-4">
        <button 
          onClick={onToggleSidebar}
          className="p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-500 rounded-xl transition-all"
        >
          <Menu size={20} />
        </button>

        {/* Search Bar */}
        <div className="hidden md:flex items-center w-80 relative group">
          <Search size={16} className="absolute left-4 text-slate-400 group-focus-within:text-aerkm-blue transition-colors" />
          <input 
            type="text" 
            placeholder="Rechercher..." 
            className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-4 focus:ring-aerkm-blue/5 focus:border-aerkm-blue transition-all text-xs font-bold"
          />
        </div>
      </div>

      <div className="flex items-center space-x-5">
        {/* Notifications */}
        <div className="relative">
          <button 
            onClick={() => { setShowNotifs(!showNotifs); setShowProfileMenu(false); }}
            className={`p-3 rounded-xl transition-all relative ${showNotifs ? 'bg-aerkm-blue text-white shadow-xl shadow-aerkm-blue/20' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-5 h-5 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white animate-bounce">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifs && (
            <div className="absolute top-16 right-0 w-80 bg-white rounded-[2rem] shadow-3xl border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
              <div className="p-5 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                <h3 className="font-black text-xs uppercase tracking-widest text-aerkm-blue">Notifications</h3>
                <button onClick={clearNotifications} className="text-[10px] font-black text-slate-400 hover:text-red-500 uppercase tracking-widest">Effacer</button>
              </div>
              <div className="max-h-[400px] overflow-y-auto scrollbar-hide">
                {notifications.length > 0 ? notifications.map(n => (
                  <div key={n.id} onClick={() => markNotifAsRead(n.id)} className={`p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer flex items-start space-x-3 ${!n.read ? 'bg-blue-50/30' : ''}`}>
                    <div className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${n.type === 'SUCCESS' ? 'bg-green-500' : 'bg-aerkm-blue'}`}></div>
                    <div>
                      <p className="text-xs font-black text-slate-800 tracking-tight">{n.titre}</p>
                      <p className="text-[11px] text-slate-500 font-medium mt-0.5 leading-snug">{n.message}</p>
                      <p className="text-[9px] text-slate-400 font-bold uppercase mt-2 tracking-tighter">
                        Il y a {Math.floor((Date.now() - new Date(n.date).getTime()) / 60000)} min
                      </p>
                    </div>
                  </div>
                )) : (
                  <div className="p-10 text-center">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Aucune alerte</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="relative">
          <button 
            onClick={() => { setShowProfileMenu(!showProfileMenu); setShowNotifs(false); }}
            className="flex items-center space-x-3 p-1.5 pr-4 bg-slate-50 hover:bg-slate-100 border border-slate-100 rounded-2xl transition-all"
          >
            <div className="w-9 h-9 bg-aerkm-blue text-white rounded-xl flex items-center justify-center font-black text-sm shadow-xl">
              {user?.prenom?.[0]}
            </div>
            <div className="hidden lg:block text-left">
               <p className="text-[11px] font-black text-slate-900 leading-none">{user?.prenom} {user?.nom}</p>
            </div>
          </button>

          {showProfileMenu && (
            <div className="absolute top-16 right-0 w-60 bg-white rounded-[2rem] shadow-3xl border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
               <div className="p-5 bg-aerkm-blue text-white">
                  <p className="text-[10px] font-black uppercase tracking-widest text-blue-200 mb-1">Session Admin</p>
                  <p className="font-bold text-xs truncate">{user?.email}</p>
               </div>
               <div className="p-2">
                  <Link to="/admin/profil" className="flex items-center space-x-3 p-3.5 text-slate-600 hover:bg-slate-50 rounded-xl transition-all font-bold text-xs" onClick={() => setShowProfileMenu(false)}>
                    <User size={16} />
                    <span>Mon Profil</span>
                  </Link>
                  <Link to="/admin/parametres" className="flex items-center space-x-3 p-3.5 text-slate-600 hover:bg-slate-50 rounded-xl transition-all font-bold text-xs" onClick={() => setShowProfileMenu(false)}>
                    <Settings size={16} />
                    <span>Paramètres Plateforme</span>
                  </Link>
                  <hr className="my-2 border-slate-100" />
                  <button onClick={logout} className="flex items-center space-x-3 w-full p-3.5 text-red-500 hover:bg-red-50 rounded-xl transition-all font-black text-[10px] uppercase tracking-widest">
                    <LogOut size={16} />
                    <span>Se Déconnecter</span>
                  </button>
               </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;
