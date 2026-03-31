import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area 
} from 'recharts';
import { 
  Zap, DollarSign, 
  Users, Activity, Calendar, Download 
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const API_BASE_URL = 'http://127.0.0.1:8001/api';

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/bookings/stats`);
        setStats(response.data);
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
      }
    };
    fetchStats();
  }, []);

  const revenueData = stats?.dailyBookings?.map((d: any) => ({
    name: new Date(d.date).toLocaleDateString('id-ID', { weekday: 'short' }),
    value: d.count * 250000 // Mock multiplier if actual revenue not in dailyBookings
  })) || [
    { name: 'Sen', value: 0 },
    { name: 'Sel', value: 0 },
    { name: 'Rab', value: 0 },
    { name: 'Kam', value: 0 },
    { name: 'Jum', value: 0 },
    { name: 'Sab', value: 0 },
    { name: 'Min', value: 0 },
  ];

  const kpiStats = [
    { 
      label: 'Total Revenue', 
      value: stats ? `Rp ${(stats.totalRevenue / 1000000).toFixed(1)}jt` : 'Rp 0', 
      change: '+12.5%', 
      icon: DollarSign, 
      color: 'text-emerald-600', 
      bg: 'bg-emerald-50' 
    },
    { 
      label: 'Total Energy', 
      value: stats ? `${stats.totalEnergy.toLocaleString()} kWh` : '0 kWh', 
      change: '+8.2%', 
      icon: Zap, 
      color: 'text-blue-600', 
      bg: 'bg-blue-50' 
    },
    { 
      label: 'Total Bookings', 
      value: stats ? stats.totalBookings.toLocaleString() : '0', 
      change: '+15.1%', 
      icon: Users, 
      color: 'text-purple-600', 
      bg: 'bg-purple-50' 
    },
    { 
      label: 'Avg. Rating', 
      value: '4.85/5', 
      change: '+0.5%', 
      icon: Activity, 
      color: 'text-amber-600', 
      bg: 'bg-amber-50' 
    },
  ];

  // Rest of mock data logic if not in API...
  const energyData = stats?.energyData || [];

  const statusColors: any = {
    'pending': '#f59e0b',
    'confirmed': '#0ea5e9',
    'charging': '#10b981',
    'completed': '#64748b',
    'cancelled': '#f43f5e'
  };

  const statusDistribution = stats?.statusDistribution?.map((s: any) => ({
    ...s,
    color: statusColors[s.name] || '#64748b'
  })) || [];

  const monthlyTrends = [
    { month: 'Apr', revenue: stats?.totalRevenue || 0, energy: stats?.totalEnergy || 0 },
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="container mx-auto px-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
          <div className="space-y-4">
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Analytics <span className="text-emerald-600">Dashboard</span></h1>
            <p className="text-slate-600 font-medium">Laporan performa dan statistik stasiun PowerSync di Batam.</p>
          </div>
          <button className="btn-secondary flex items-center gap-2">
            <Download size={18} />
            Unduh Laporan CSV
          </button>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {kpiStats.map((kpi, i) => {
            const Icon = kpi.icon;
            return (
              <div key={i} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-4 hover:shadow-xl transition-shadow duration-300">
                <div className="flex justify-between items-start">
                  <div className={`p-4 ${kpi.bg} ${kpi.color} rounded-2xl`}>
                    <Icon size={24} />
                  </div>
                  <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-xs font-bold">{kpi.change}</span>
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">{kpi.label}</div>
                  <div className="text-3xl font-extrabold text-slate-900 mt-1">{kpi.value}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Revenue Chart (Bar) */}
          <div className="lg:col-span-8 bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-2xl font-extrabold text-slate-800">Pendapatan Harian <span className="text-slate-400 font-medium text-lg">(Minggu Ini)</span></h3>
              <div className="flex items-center gap-2 text-slate-400 font-bold text-sm">
                <Calendar size={16} />
                25 Mar - 31 Mar
              </div>
            </div>
            <div className="h-[400px] w-full font-bold">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <Tooltip 
                    cursor={{fill: '#f8fafc'}}
                    contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                    formatter={(value: any) => [`Rp ${Number(value).toLocaleString()}`, 'Revenue']}
                  />
                  <Bar dataKey="value" fill="#10b981" radius={[8, 8, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Status Distribution (Pie) */}
          <div className="lg:col-span-4 bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100">
            <h3 className="text-2xl font-extrabold text-slate-800 mb-10">Distribusi Status</h3>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusDistribution}
                    innerRadius={80}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {statusDistribution.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                  />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Monthly Trend (Area) */}
          <div className="lg:col-span-12 xl:col-span-7 bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100">
             <h3 className="text-2xl font-extrabold text-slate-800 mb-10">Tren Pertumbuhan Bulanan</h3>
             <div className="h-[400px] w-full font-bold">
               <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={monthlyTrends}>
                   <defs>
                     <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                       <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                     </linearGradient>
                   </defs>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                   <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                   <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                   <Tooltip 
                     contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                   />
                   <Area type="monotone" dataKey="revenue" stroke="#10b981" fillOpacity={1} fill="url(#colorRev)" strokeWidth={4} />
                 </AreaChart>
               </ResponsiveContainer>
             </div>
          </div>

          {/* Station Usage (Bar) */}
          <div className="lg:col-span-12 xl:col-span-5 bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100">
             <h3 className="text-2xl font-extrabold text-slate-800 mb-10">Konsumsi Energi per Stasiun</h3>
             <div className="h-[400px] w-full font-bold">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart layout="vertical" data={energyData}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                    <XAxis type="number" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} width={80} />
                    <Tooltip 
                       contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                       formatter={(value: any) => [`${value} kWh`, 'Energi']}
                    />
                    <Bar dataKey="kwh" fill="#3b82f6" radius={[0, 8, 8, 0]} barSize={24} />
                  </BarChart>
                </ResponsiveContainer>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
