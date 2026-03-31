import { Link } from 'react-router-dom';
import { Zap, Shield, Battery, CreditCard, ChevronRight, Star } from 'lucide-react';

const Home: React.FC = () => {
  const stats = [
    { label: 'Stasiun Active', value: '1,200+' },
    { label: 'Sesi Charging', value: '450k+' },
    { label: 'Energi Tersalurkan', value: '8.2 GWh' },
    { label: 'Rating Pengguna', value: '4.9/5' },
  ];

  const features = [
    {
      title: 'Pengisian Super Cepat',
      description: 'Teknologi Ultra Fast Charging hingga 350kW untuk efisiensi waktu Anda.',
      icon: Zap,
      color: 'bg-emerald-100 text-emerald-600',
    },
    {
      title: 'Keamanan Terjamin',
      description: 'Sistem monitoring real-time dan proteksi kelistrikan standar internasional.',
      icon: Shield,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      title: 'Pembayaran Mudah',
      description: 'Integrasi dengan berbagai metode pembayaran digital dan kartu kredit.',
      icon: CreditCard,
      color: 'bg-purple-100 text-purple-600',
    },
    {
      title: 'Manajemen Baterai',
      description: 'Optimasi pengisian daya untuk menjaga kesehatan baterai kendaraan Anda.',
      icon: Battery,
      color: 'bg-amber-100 text-amber-600',
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center pt-20 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full -z-10">
          <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-100/50 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-50/50 rounded-full blur-3xl invisible md:visible"></div>
        </div>
        
        <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-in fade-in slide-in-from-left duration-700">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full font-medium text-sm border border-emerald-100">
              <Zap size={16} fill="currentColor" />
              <span>Infrastruktur Pengisian EV Terdepan di Indonesia</span>
            </div>
            
            <h1 className="text-6xl md:text-7xl font-bold leading-[1.1] tracking-tight text-slate-900">
              Isi Daya Masa Depanmu <span className="text-emerald-600">Lebih Cepat.</span>
            </h1>
            
            <p className="text-xl text-slate-600 leading-relaxed max-w-lg">
              FleetCharge menyediakan jaringan pengisian kendaraan listrik super cepat di Batam. Temukan stasiun terdekat, booking slot, dan pantau pengisian Anda secara real-time.
            </p>
            
            <div className="flex flex-wrap gap-4 pt-4">
              <Link to="/catalog" className="btn-primary flex items-center gap-2 text-lg">
                Mulai Charging Sekarang
                <ChevronRight size={20} />
              </Link>
              <Link to="/dashboard" className="btn-secondary flex items-center gap-2 text-lg">
                Lihat Dashboard
              </Link>
            </div>
          </div>
          
          <div className="relative animate-in fade-in zoom-in duration-1000 delay-200">
            <img 
              src="https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&q=80&w=1000" 
              alt="EV Charging Station" 
              className="rounded-3xl shadow-2xl border-4 border-white transform md:rotate-2 hover:rotate-0 transition-transform duration-500"
            />
            <div className="absolute -bottom-6 -left-6 glass-card p-6 rounded-2xl max-w-[240px]">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-emerald-600 p-2 rounded-lg">
                  <Star className="text-white fill-current" size={20} />
                </div>
                <div className="font-bold text-slate-900">Stasiun Terfavorit</div>
              </div>
              <p className="text-sm text-slate-600 font-medium">Grand Batam Mall - Ultra Fast</p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-emerald-600 font-bold">Tersedia</span>
                <span className="text-xs text-slate-400">4 Slots Total</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-emerald-600">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center space-y-2 border-r last:border-0 border-emerald-500/50">
                <div className="text-4xl md:text-5xl font-bold text-white">{stat.value}</div>
                <div className="text-emerald-100 font-medium uppercase tracking-wider text-xs md:text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
            <h2 className="text-emerald-600 font-bold tracking-widest uppercase text-sm">Keunggulan Layanan</h2>
            <h3 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">Mengapa Memilih FleetCharge?</h3>
            <p className="text-lg text-slate-600">Kami berkomitmen memberikan pengalaman terbaik dalam ekosistem kendaraan listrik dengan infrastruktur yang mumpuni.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={i} 
                  className="bg-white p-8 rounded-3xl border border-slate-100 hover:border-emerald-200 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                >
                  <div className={`w-14 h-14 ${feature.color} rounded-2xl flex items-center justify-center mb-6`}>
                    <Icon size={28} />
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h4>
                  <p className="text-slate-600 leading-relaxed font-medium">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="bg-slate-900 rounded-[3rem] p-12 md:p-20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-1/2 h-full opacity-20 pointer-events-none">
               <img 
                src="https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&q=80&w=1000" 
                alt="Pattern" 
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="relative z-10 max-w-2xl">
              <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 leading-[1.2]">Siap Beralih ke <span className="text-emerald-500">Energi Bersih?</span></h2>
              <p className="text-xl text-slate-300 mb-10 leading-relaxed">
                Bergabunglah dengan ribuan pengguna kendaraan listrik lainnya di Batam dan nikmati kemudahan pengisian daya di mana saja.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/catalog" className="btn-primary">Ayo Cari Stasiun</Link>
                <button className="px-6 py-3 rounded-xl border border-slate-700 text-white hover:bg-slate-800 transition-colors font-semibold">Hubungi Sales</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
