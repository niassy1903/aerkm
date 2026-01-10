
import React from 'react';
import { useData } from '../../context/StudentContext';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, Cell
} from 'recharts';
import { PieChart, Pie, Legend } from 'recharts';
import { UFR_LIST, NIVEAUX } from '../../constants';
import { GraduationCap, Map, Users, TrendingUp, Stethoscope, Home, Activity } from 'lucide-react';

const Statistiques: React.FC = () => {
  const { students } = useData();

  const ufrData = UFR_LIST.map(ufr => ({
    name: ufr.replace('UFR ', '').substring(0, 15) + '...',
    count: students.filter(s => s.ufr === ufr).length
  }));

  const niveauData = NIVEAUX.map(niv => ({
    name: niv,
    count: students.filter(s => s.niveau === niv).length
  }));

  // New Social Stats
  const healthCount = students.filter(s => s.maladieHandicap).length;
  const housingCount = students.filter(s => s.logementAmicale).length;
  const totalStudents = students.length || 1;

  const socialData = [
    { name: 'En Logement Amicale', value: housingCount, color: '#1e3a8a' },
    { name: 'Hors Amicale', value: totalStudents - housingCount, color: '#f1f5f9' },
  ];

  const healthData = [
    { name: 'Besoin Spécifique', value: healthCount, color: '#ef4444' },
    { name: 'Sains', value: totalStudents - healthCount, color: '#10b981' },
  ];

  const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4'];

  return (
    <div className="p-8 lg:p-12 space-y-12">
      <div>
        <h1 className="text-4xl font-black text-aerkm-blue tracking-tighter">Statistiques Analytiques</h1>
        <p className="text-slate-500 font-medium mt-1">Données consolidées pour l'aide sociale et pédagogique.</p>
      </div>

      {/* Social Dashboard Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex items-center space-x-6">
          <div className="w-14 h-14 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center">
            <Stethoscope size={28} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Santé (Cas)</p>
            <p className="text-2xl font-black text-slate-900">{healthCount}</p>
          </div>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex items-center space-x-6">
          <div className="w-14 h-14 bg-blue-50 text-aerkm-blue rounded-2xl flex items-center justify-center">
            <Home size={28} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Logés Amicale</p>
            <p className="text-2xl font-black text-slate-900">{housingCount}</p>
          </div>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex items-center space-x-6">
          <div className="w-14 h-14 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center">
            <Users size={28} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Recensés</p>
            <p className="text-2xl font-black text-slate-900">{students.length}</p>
          </div>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex items-center space-x-6">
          <div className="w-14 h-14 bg-aerkm-gold/10 text-aerkm-brown rounded-2xl flex items-center justify-center">
            <Activity size={28} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Taux Social</p>
            <p className="text-2xl font-black text-slate-900">{Math.round(((healthCount + housingCount) / totalStudents) * 100)}%</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
        {/* Academic Level */}
        <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100">
          <h2 className="text-xl font-black text-aerkm-blue mb-10 flex items-center uppercase tracking-tight">
            <GraduationCap className="mr-3 text-aerkm-gold" /> Pyramide des Niveaux
          </h2>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={niveauData}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1e3a8a" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#1e3a8a" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10, fontWeight: 'black'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10, fontWeight: 'black'}} />
                <Tooltip contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'}} />
                <Area type="monotone" dataKey="count" stroke="#1e3a8a" strokeWidth={4} fillOpacity={1} fill="url(#colorCount)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* UFR Weight */}
        <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100">
          <h2 className="text-xl font-black text-aerkm-blue mb-10 flex items-center uppercase tracking-tight">
            <Users className="mr-3 text-aerkm-brown" /> Poids Pédagogique (UFR)
          </h2>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={ufrData} cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={8} dataKey="count">
                  {ufrData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{borderRadius: '20px', border: 'none'}} />
                <Legend iconType="circle" wrapperStyle={{paddingTop: '20px', fontSize: '10px', fontWeight: 'black', textTransform: 'uppercase'}} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistiques;
