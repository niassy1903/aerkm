import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  CalendarRange, 
  BarChart3, 
  FileOutput, 
  LogOut,
  UserCog,
  History,
  Settings
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface SidebarAdminProps {
  collapsed: boolean;
}

const SidebarAdmin: React.FC<SidebarAdminProps> = ({ collapsed }) => {
  const { logout, user } = useAuth();

  const links = [
    { to: '/admin', icon: <LayoutDashboard size={24} />, label: 'Tableau de bord' },
    { to: '/admin/etudiants', icon: <Users size={24} />, label: 'Étudiants' },
    { to: '/admin/evenements', icon: <CalendarRange size={24} />, label: 'Événements' },
    { to: '/admin/utilisateurs', icon: <UserCog size={24} />, label: 'Admins' },
    { to: '/admin/statistiques', icon: <BarChart3 size={24} />, label: 'Statistiques' },
    { to: '/admin/logs', icon: <History size={24} />, label: 'Historique' },
    { to: '/admin/exports', icon: <FileOutput size={24} />, label: 'Rapports' },
    { to: '/admin/parametres', icon: <Settings size={24} />, label: 'Paramètres' },
  ];

  return (
    <aside
      className={`bg-[#0a192f] text-white h-screen sticky top-0 flex flex-col z-[70] border-r border-white/5 transition-all duration-500 ${
        collapsed ? 'w-24' : 'w-72'
      }`}
    >

      {/* ===== BRAND HEADER ===== */}
      <div
        className={`pt-10 pb-8 transition-all duration-500 ${
          collapsed ? 'px-0 flex justify-center' : 'px-8'
        }`}
      >
        <div className="flex items-center space-x-4">
          
          {/* LOGO AERKM */}
          <div className="w-14 h-14 rounded-full overflow-hidden shadow-xl border border-white/10 shrink-0 bg-white">
            <img
              src="/assets/logo.jpg"
              alt="Logo AERKM"
              className="w-full h-full object-cover"
            />
          </div>

          {!collapsed && (
            <div className="flex flex-col animate-in fade-in slide-in-from-left-4 duration-500">
              <span className="font-black text-2xl tracking-tighter leading-none text-white">
                AERKM
              </span>
              <span className="text-[10px] text-aerkm-gold font-bold uppercase tracking-[0.2em] mt-1 whitespace-nowrap">
                Back office
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ===== NAVIGATION ===== */}
      <nav className="flex-1 px-4 space-y-2 overflow-y-auto overflow-x-hidden no-scrollbar">
        {links.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/admin'}
            className={({ isActive }) =>
              `flex items-center rounded-2xl transition-all duration-300 group relative ${
                collapsed ? 'justify-center py-4' : 'px-6 py-4 space-x-4'
              } ${
                isActive
                  ? 'bg-white/10 text-white'
                  : 'text-white/30 hover:text-white/70 hover:bg-white/5'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {/* ACTIVE GOLD BAR */}
                {isActive && (
                  <div className="absolute left-0 top-3 bottom-3 w-1.5 bg-aerkm-gold rounded-r-full shadow-[0_0_15px_rgba(251,191,36,0.6)]" />
                )}

                <span
                  className={`transition-all duration-300 ${
                    isActive
                      ? 'scale-110 text-aerkm-gold'
                      : 'group-hover:scale-110 group-hover:text-white'
                  }`}
                >
                  {link.icon}
                </span>

                {!collapsed && (
                  <span className="font-bold text-sm tracking-wide whitespace-nowrap animate-in fade-in duration-500">
                    {link.label}
                  </span>
                )}

                {/* TOOLTIP MODE COLLAPSÉ */}
                {collapsed && (
                  <div className="absolute left-full ml-6 px-4 py-2 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all z-50 whitespace-nowrap border border-white/10 shadow-2xl">
                    {link.label}
                  </div>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* ===== PROFILE & LOGOUT ===== */}
      <div className="p-4 bg-black/20 mt-4">
        <NavLink
          to="/admin/profil"
          className={({ isActive }) =>
            `flex items-center p-3 rounded-2xl transition-all mb-3 ${
              collapsed
                ? 'justify-center'
                : 'bg-white/5 border border-white/5 px-4 space-x-4'
            } ${
              isActive
                ? 'ring-2 ring-aerkm-gold/50 bg-white/10'
                : 'hover:bg-white/10'
            }`
          }
        >
          <div className="w-10 h-10 bg-aerkm-brown text-white rounded-xl flex items-center justify-center font-black text-sm uppercase shrink-0 shadow-lg">
            {user?.prenom?.[0]}
          </div>

          {!collapsed && (
            <div className="flex flex-col min-w-0 animate-in fade-in duration-300">
              <span className="text-xs font-bold text-white truncate">
                {user?.prenom} {user?.nom}
              </span>
              <span className="text-[9px] text-white/30 font-bold uppercase tracking-widest">
                Voir Profil
              </span>
            </div>
          )}
        </NavLink>

        <button
          onClick={logout}
          className={`w-full flex items-center text-white/30 hover:text-red-400 hover:bg-red-500/10 rounded-2xl transition-all duration-300 font-bold text-sm group ${
            collapsed ? 'justify-center py-4' : 'px-6 py-4 space-x-4'
          }`}
        >
          <LogOut size={24} className="group-hover:-translate-x-1 transition-transform" />
          {!collapsed && <span>Déconnexion</span>}
        </button>
      </div>
    </aside>
  );
};

export default SidebarAdmin;
