import React from 'react';
import { Link } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import { 
  Zap, Shield, Battery, CreditCard, ChevronRight, 
  MapPin, CheckCircle, Search, Smartphone 
} from 'lucide-react';

const Home: React.FC = () => {
  const { stations } = useBooking();
  const featuredStations = stations.slice(0, 3);

  const steps = [
    {
      title: 'Cari Lokasi',
      desc: 'Temukan titik pengisian terdekat dari lokasi Anda.',
      icon: Search,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      title: 'Pilih Jadwal',
      desc: 'Pesan slot waktu tertentu agar tidak perlu mengantre lama.',
      icon: Smartphone,
      color: 'bg-emerald-100 text-emerald-600'
    },
    {
      title: 'Check-In',
      desc: 'Lakukan konfirmasi kehadiran 15 menit sebelum hingga 10 menit setelah jadwal.',
      icon: CheckCircle,
      color: 'bg-purple-100 text-purple-600'
    },
    {
      title: 'Isi Daya EV',
      desc: 'Hubungkan konektor dan sistem kami menyala otomatis.',
      icon: Zap,
      color: 'bg-amber-100 text-amber-600'
    }
  ];

  const features = [
    {
      title: 'Pengisian Ultra Fast',
      description: 'Teknologi pengisian daya hingga 350kW, memungkinkan Anda mengisi dari 10% ke 80% hanya dalam 20 menit.',
      icon: Zap,
    },
    {
      title: 'Keamanan Berlapis',
      description: 'Sistem kami dilengkapi dengan proteksi lonjakan arus dan suhu untuk menjaga baterai kendaraan Anda.',
      icon: Shield,
    },
    {
      title: 'Sistem Antrean Cerdas',
      description: 'Jika slot yang Anda inginkan penuh, otomatis masuk ke sistem antrean kami yang mempromosikan secara otomatis sesuai giliran.',
      icon: Battery,
    }
  ];

  return (
    <div className="flex flex-col bg-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl">
          <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-emerald-100/40 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[10%] left-[-10%] w-[500px] h-[500px] bg-blue-100/40 rounded-full blur-[120px]"></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-sm font-bold border border-emerald-100 animate-in fade-in slide-in-from-bottom duration-1000">
               <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Platform Pengisian Kendaraan Listrik #1 di Indonesia
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-slate-900 leading-[1.05] tracking-tight">
              Booking Slot, <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-blue-600">Tanpa Antre Lama.</span>
            </h1>
            
            <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Platform reservasi SPKLU berbasis waktu pertama di Batam. Pesan slot favoritmu dan biarkan sistem antrean cerdas kami yang mengurus sisanya.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
              <Link to="/catalog" className="w-full sm:w-auto px-8 py-4 bg-emerald-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-emerald-200 hover:bg-emerald-700 hover:scale-105 transition-all flex items-center justify-center gap-2">
                Mulai Charging Sekarang
                <ChevronRight size={20} />
              </Link>
              <Link to="/register" className="w-full sm:w-auto px-8 py-4 bg-white text-slate-900 border border-slate-200 rounded-2xl font-bold text-lg hover:bg-slate-50 transition-all flex items-center justify-center">
                Daftar Akun Gratis
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20 space-y-4">
            <h2 className="text-emerald-600 font-bold uppercase tracking-widest text-sm">Mudah & Cepat</h2>
            <h3 className="text-4xl md:text-5xl font-black text-slate-900">Bagaimana Cara Kerjanya?</h3>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={i} className="relative group">
                  {i < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-12 left-full w-full border-t-2 border-dashed border-slate-200 -z-0"></div>
                  )}
                  <div className="relative z-10 bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm group-hover:border-emerald-200 transition-all text-center">
                    <div className={`w-16 h-16 ${step.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform`}>
                      <Icon size={32} />
                    </div>
                    <h4 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h4>
                    <p className="text-slate-500 font-medium text-sm leading-relaxed">{step.desc}</p>
                    <div className="mt-4 text-emerald-600 font-black text-lg">0{i+1}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Locations */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16">
            <div className="space-y-4">
              <h2 className="text-emerald-600 font-bold uppercase tracking-widest text-sm">Lokasi Terdekat</h2>
              <h3 className="text-4xl md:text-5xl font-black text-slate-900">Stasiun Unggulan Kami</h3>
            </div>
            <Link to="/catalog" className="text-emerald-600 font-bold flex items-center gap-2 hover:gap-3 transition-all">
              Lihat Semua Lokasi <ChevronRight size={20} />
            </Link>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {featuredStations.map((station) => (
              <div key={station.id} className="group cursor-pointer">
                <div className="relative overflow-hidden rounded-[2.5rem] aspect-[4/3] mb-6">
                  <img 
                    src={station.image} 
                    alt={station.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4">
                    <div className="bg-white/80 backdrop-blur-md px-4 py-2 rounded-2xl flex items-center gap-2">
                       {station.slots?.available > 0 ? (
                        <>
                          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                          <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">Tersedia</span>
                        </>
                      ) : (
                         <>
                          <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
                          <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">Antre</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-widest">
                    <MapPin size={14} />
                    {station.location}
                  </div>
                  <h4 className="text-2xl font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">{station.name}</h4>
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((_, i) => (
                        <div key={i} className="w-1.5 h-1.5 rounded-full bg-emerald-600"></div>
                      ))}
                      <span className="text-slate-400 text-xs font-bold ml-2">5.0 (42 Review)</span>
                    </div>
                    <div className="text-emerald-600 font-black">Rp {station.pricePerKwh}/kWh</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-slate-900">
        <div className="container mx-auto px-6 relative overflow-hidden rounded-[3rem]">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/20 rounded-full blur-[100px]"></div>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px]"></div>
          
          <div className="relative z-10 py-16 px-8 md:px-20 text-center max-w-4xl mx-auto space-y-10">
            <h2 className="text-4xl md:text-6xl font-black text-white leading-tight">Siap Untuk Pengisian <br/> <span className="text-emerald-500">Masa Depan?</span></h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Daftar sekarang dan nikmati kemudahan reservasi slot tanpa ribet. Akun Anda akan tersimpan aman dengan sistem OTP terbaru.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register" className="px-10 py-4 bg-emerald-500 text-slate-900 rounded-2xl font-black text-lg hover:bg-emerald-400 transition-all flex items-center gap-2">
                Daftar Sekarang <CheckCircle size={20} />
              </Link>
              <button className="px-10 py-4 bg-slate-800 text-white rounded-2xl font-bold text-lg hover:bg-slate-700 transition-all">Hubungi Sales</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
