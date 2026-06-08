import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import { 
  Zap, Battery, ChevronRight, 
  MapPin, CheckCircle, Search,
  Calendar, QrCode, Clock, Navigation,
  DollarSign, History, TrendingUp, Sliders,
  Star, Check, Activity, Info
} from 'lucide-react';

const Home: React.FC = () => {
  const { 
    stations, 
    userCoords, 
    isGpsActive, 
    gpsError, 
    requestUserLocation, 
    resetLocation 
  } = useBooking();
  const location = useLocation();

  // Scroll to section based on hash in URL
  useEffect(() => {
    if (location.hash) {
      const element = document.getElementById(location.hash.substring(1));
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [location]);

  // Section 3: Interactive Map States
  const [selectedStationId, setSelectedStationId] = useState<string>('A1');
  const [stationFilter, setStationFilter] = useState<string>('all');
  const [loadingGps, setLoadingGps] = useState<boolean>(false);

  // Section 5: Experience Tabs State
  const [activeTab, setActiveTab] = useState<'search' | 'booking' | 'monitoring'>('search');

  // Bento Grid: Cost Estimation States
  const [batterySize, setBatterySize] = useState<number>(60); // kWh
  const [estimatedPrice, setEstimatedPrice] = useState<number>(60 * 3850);

  useEffect(() => {
    const selectedStation = stations.find(s => s.id === selectedStationId) || stations[0];
    const pricePerKwh = selectedStation ? selectedStation.pricePerKwh : 3850;
    setEstimatedPrice(batterySize * pricePerKwh);
  }, [batterySize, selectedStationId, stations]);

  // Filter stations for Section 3
  const filteredStations = [...stations].filter(station => {
    if (stationFilter === 'fast') {
      return station.type.toLowerCase().includes('fast') || parseInt(station.power) >= 150;
    }
    if (stationFilter === 'available') {
      return station.slots.available > 0;
    }
    if (stationFilter === 'near') {
      return ['A1', 'A2', 'A4'].includes(station.id);
    }
    return true;
  });

  // Sort by nearest if GPS is active
  const sortedStations = isGpsActive 
    ? [...filteredStations].sort((a, b) => (a.distance || 999) - (b.distance || 999))
    : filteredStations;

  const selectedStation = stations.find(s => s.id === selectedStationId) || stations[0];

  return (
    <div className="flex flex-col bg-[#f8faf7] min-h-screen text-slate-900 font-sans selection:bg-emerald-200 selection:text-emerald-950">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-36 overflow-hidden">
        {/* Soft radial background gradient for wow factor */}
        <div className="absolute top-0 right-0 w-[60%] h-[70%] bg-gradient-to-b from-emerald-500/10 via-teal-500/5 to-transparent rounded-full blur-[120px] pointer-events-none -z-10" />
        <div className="absolute -left-12 top-[40%] w-[350px] h-[350px] bg-lime-400/10 rounded-full blur-[90px] pointer-events-none -z-10" />

        <div className="container mx-auto px-6 relative">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-5 space-y-8 text-left">
              {/* Badge text */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-800 rounded-full text-xs font-bold border border-emerald-100/80 shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                Jaringan Pengisian EV Terintegrasi
              </div>
              
              {/* Main Headline */}
              <h1 className="text-4xl md:text-5xl lg:text-[56px] font-black text-slate-900 leading-[1.08] tracking-tight">
                Cari Charger.<br />
                Booking Slot.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-600">Jalan Lagi.</span>
              </h1>
              
              {/* Subtitle */}
              <p className="text-base md:text-lg text-slate-600 leading-relaxed max-w-xl">
                Temukan stasiun EV terdekat, cek ketersediaan slot secara real-time, dan pesan jadwal pengisian langsung dari satu platform.
              </p>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Link 
                  to="/catalog" 
                  className="px-7 py-4 bg-emerald-600 text-white rounded-xl font-bold text-base hover:bg-emerald-700 hover:scale-[1.02] hover:shadow-emerald-200 shadow-lg transition-all flex items-center justify-center gap-2 group cursor-pointer"
                >
                  Cari Stasiun Terdekat
                  <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <a 
                  href="#cara-kerja"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('cara-kerja')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-7 py-4 bg-white text-slate-700 border border-slate-200/80 rounded-xl font-bold text-base hover:bg-slate-50 hover:border-slate-300 hover:scale-[1.02] shadow-sm transition-all flex items-center justify-center cursor-pointer"
                >
                  Lihat Cara Kerja
                </a>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 border-t border-slate-200/60 grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <p className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">120+</p>
                  <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Charging Points</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">24/7</p>
                  <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Akses Penuh</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">350 kW</p>
                  <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Ultra Fast Max</p>
                </div>
              </div>
            </div>
            
            {/* Right Content - Real App Dashboard Preview Mockup (NO STATIC STOCK IMAGES) */}
            <div className="lg:col-span-7 relative">
              <div className="relative w-full aspect-[4/3] rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-4 overflow-hidden group">
                
                {/* Custom CSS Map Mesh Grid Design */}
                <div className="absolute inset-0 bg-slate-950 opacity-90 overflow-hidden">
                  {/* Grid Lines */}
                  <div className="absolute inset-0 opacity-[0.06] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:30px_30px]" />
                  
                  {/* Custom SVG Map Roads/Routes */}
                  <svg className="absolute inset-0 w-full h-full text-slate-800" xmlns="http://www.w3.org/2000/svg">
                    {/* Road Lines */}
                    <path d="M-50,150 Q100,80 300,120 T700,20" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
                    <path d="M100,-50 Q180,200 120,400 T300,600" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
                    <path d="M300,-50 L350,600" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                    <path d="M-50,380 Q400,280 800,320" fill="none" stroke="currentColor" strokeWidth="10" strokeLinecap="round" />
                    
                    {/* Active Highlighted Route Line (Green neon glow) */}
                    <path 
                      d="M-50,380 Q400,280 800,320" 
                      fill="none" 
                      stroke="#10b981" 
                      strokeWidth="4" 
                      strokeLinecap="round" 
                      className="animate-pulse shadow-neon" 
                      style={{ strokeDasharray: '8 4' }}
                    />
                  </svg>

                  {/* Pulsing Map Markers (CSS + HTML) */}
                  {/* Nagoya Hill Marker */}
                  <div className="absolute top-[32%] left-[45%] -translate-x-1/2 -translate-y-1/2 group/pin cursor-pointer">
                    <span className="absolute inline-flex h-8 w-8 rounded-full bg-emerald-400/35 animate-ping opacity-75"></span>
                    <div className="relative w-6 h-6 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center shadow-lg shadow-emerald-500/50">
                      <Zap size={10} className="text-white fill-white" />
                    </div>
                  </div>

                  {/* Batam Centre Marker */}
                  <div className="absolute top-[52%] left-[62%] -translate-x-1/2 -translate-y-1/2 cursor-pointer">
                    <span className="absolute inline-flex h-8 w-8 rounded-full bg-emerald-400/35 animate-ping" style={{ animationDelay: '1s' }}></span>
                    <div className="relative w-6 h-6 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center shadow-lg">
                      <Zap size={10} className="text-white fill-white" />
                    </div>
                  </div>

                  {/* BCS Mall Marker */}
                  <div className="absolute top-[21%] left-[24%] -translate-x-1/2 -translate-y-1/2 cursor-pointer">
                    <div className="w-5 h-5 rounded-full bg-amber-500 border-2 border-white flex items-center justify-center shadow-lg">
                      <Zap size={8} className="text-white fill-white" />
                    </div>
                  </div>
                </div>

                {/* Floating Mockup Card 1: Stasiun Terdekat (Top Left) */}
                <div className="absolute top-6 left-6 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 p-3.5 rounded-xl flex items-center gap-3 shadow-2xl transition-all hover:translate-y-[-2px]">
                  <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-500/30 rounded-lg flex items-center justify-center text-emerald-400 shadow-inner">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Stasiun Terdekat</p>
                    <p className="text-sm font-extrabold text-white">Nagoya Hill • 1.2 km</p>
                  </div>
                </div>

                {/* Floating Mockup Card 2: Fast Charging (Top Right) */}
                <div className="absolute top-6 right-6 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 p-3.5 rounded-xl flex items-center gap-3 shadow-2xl transition-all hover:translate-y-[-2px]">
                  <div className="w-10 h-10 bg-lime-400/10 border border-lime-400/30 rounded-lg flex items-center justify-center text-lime-400 shadow-inner">
                    <Zap size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Daya Maksimal</p>
                    <p className="text-sm font-extrabold text-white">Ultra Fast — 350 kW</p>
                  </div>
                </div>

                {/* Floating Mockup Card 3: Slot Tersedia (Bottom Left) */}
                <div className="absolute bottom-6 left-6 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 p-3.5 rounded-xl flex items-center gap-3 shadow-2xl transition-all hover:translate-y-[-2px]">
                  <div className="w-10 h-10 bg-blue-500/10 border border-blue-500/30 rounded-lg flex items-center justify-center text-blue-400 shadow-inner">
                    <CheckCircle size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Status Konektor</p>
                    <p className="text-sm font-extrabold text-white">Slot Tersedia — 8/12</p>
                  </div>
                </div>

                {/* Floating Mockup Card 4: Charging Session Telemetry (Bottom Right) */}
                <div className="absolute bottom-6 right-6 bg-slate-950 border border-emerald-500/40 p-4 rounded-xl shadow-2xl w-56 text-left hover:scale-[1.02] transition-transform">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                      Charging Live
                    </span>
                    <span className="text-xs font-bold text-white">72%</span>
                  </div>
                  
                  {/* Micro Progress Bar */}
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mb-3">
                    <div className="h-full bg-gradient-to-r from-emerald-500 to-lime-400 rounded-full animate-[pulse_2s_infinite]" style={{ width: '72%' }} />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-[10px]">
                    <div className="bg-slate-900 p-1.5 rounded border border-slate-800">
                      <span className="text-slate-500 block">Daya Masuk</span>
                      <span className="text-white font-bold">120 kW</span>
                    </div>
                    <div className="bg-slate-900 p-1.5 rounded border border-slate-800">
                      <span className="text-slate-500 block">Estimasi Sisa</span>
                      <span className="text-white font-bold">14 Menit</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* 2. CARA KERJA SECTION (HOW IT WORKS) */}
      <section id="cara-kerja" className="py-24 border-t border-slate-100 bg-[#f4f7f3]">
        <div className="container mx-auto px-6">
          
          <div className="text-center max-w-2xl mx-auto mb-20 space-y-3">
            <h2 className="text-emerald-600 font-extrabold tracking-widest text-xs uppercase">Simpel & Praktis</h2>
            <h3 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">4 Langkah Pengisian Tanpa Hambatan</h3>
            <p className="text-slate-500 text-sm md:text-base">Mulai dari pencarian lokasi hingga pengisian daya baterai kendaraan listrik Anda selesai.</p>
          </div>
          
          {/* Horizontal Timelines / Step cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {/* Step 1 */}
            <div className="flex flex-col bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm transition-all hover:shadow-lg group">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-emerald-50 text-emerald-600 font-extrabold rounded-lg flex items-center justify-center text-lg border border-emerald-100/50">
                  01
                </div>
                <div className="text-slate-400 text-xs font-semibold">Cari Lokasi</div>
              </div>
              <h4 className="text-lg font-black text-slate-900 mb-2">Temukan Titik Terdekat</h4>
              <p className="text-slate-500 text-xs leading-relaxed mb-6">Gunakan peta interaktif kami untuk melihat stasiun SPKLU terdekat dari posisi Anda saat ini.</p>
              
              {/* Mini CSS Map Visual Mockup */}
              <div className="mt-auto h-32 bg-slate-950 rounded-xl overflow-hidden relative border border-slate-800">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:16px_16px] opacity-20" />
                <div className="absolute top-[40%] left-[50%] -translate-x-1/2 -translate-y-1/2">
                  <span className="absolute inline-flex h-6 w-6 rounded-full bg-emerald-500/40 animate-ping"></span>
                  <MapPin size={16} className="text-emerald-500 relative z-10 fill-emerald-500/20" />
                </div>
                <div className="absolute bottom-2 left-2 right-2 bg-slate-900/90 border border-slate-700/60 p-1.5 rounded-lg flex items-center justify-between text-[9px] text-white">
                  <span className="font-bold">Nagoya Hub</span>
                  <span className="text-emerald-400 font-semibold">1.2 km</span>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm transition-all hover:shadow-lg group">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-emerald-50 text-emerald-600 font-extrabold rounded-lg flex items-center justify-center text-lg border border-emerald-100/50">
                  02
                </div>
                <div className="text-slate-400 text-xs font-semibold">Pilih Jadwal</div>
              </div>
              <h4 className="text-lg font-black text-slate-900 mb-2">Booking Waktu Pengisian</h4>
              <p className="text-slate-500 text-xs leading-relaxed mb-6">Pesan slot waktu tertentu sebelumnya agar tidak terjadi antrean lama di stasiun.</p>
              
              {/* Mini Slot Picker UI Mockup */}
              <div className="mt-auto h-32 bg-slate-50 rounded-xl p-3 flex flex-col justify-center border border-slate-200/60">
                <div className="text-[10px] text-slate-400 font-bold mb-1.5">Pilih Slot Hari Ini</div>
                <div className="grid grid-cols-2 gap-1.5 text-[10px] font-bold">
                  <div className="bg-slate-200/80 text-slate-500 p-1 rounded text-center cursor-not-allowed line-through">09:00 (Penuh)</div>
                  <div className="bg-emerald-600 text-white p-1 rounded text-center cursor-pointer shadow-sm hover:bg-emerald-700 transition-colors">11:30 (Pilih)</div>
                  <div className="bg-slate-100 text-slate-600 p-1 rounded text-center border border-slate-200/80 hover:bg-slate-200/40">14:00</div>
                  <div className="bg-slate-100 text-slate-600 p-1 rounded text-center border border-slate-200/80 hover:bg-slate-200/40">16:30</div>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm transition-all hover:shadow-lg group">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-emerald-50 text-emerald-600 font-extrabold rounded-lg flex items-center justify-center text-lg border border-emerald-100/50">
                  03
                </div>
                <div className="text-slate-400 text-xs font-semibold">Check-In</div>
              </div>
              <h4 className="text-lg font-black text-slate-900 mb-2">Scan QR Code Stasiun</h4>
              <p className="text-slate-500 text-xs leading-relaxed mb-6">Setibanya di stasiun pengisian daya, lakukan check-in dengan memindai kode QR pada charger.</p>
              
              {/* Mini QR Check-In UI Mockup */}
              <div className="mt-auto h-32 bg-slate-50 rounded-xl p-2 flex items-center justify-center relative border border-slate-200/60 overflow-hidden">
                <div className="relative border-2 border-emerald-500/40 p-2 rounded-xl bg-white shadow-sm flex flex-col items-center">
                  <QrCode size={40} className="text-slate-800" />
                  <div className="text-[7px] font-bold text-emerald-600 mt-1 uppercase tracking-wider">MEMBER ID</div>
                  <div className="absolute top-0 left-0 w-full h-0.5 bg-emerald-500 animate-[bounce_1.8s_infinite]" />
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex flex-col bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm transition-all hover:shadow-lg group">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-emerald-50 text-emerald-600 font-extrabold rounded-lg flex items-center justify-center text-lg border border-emerald-100/50">
                  04
                </div>
                <div className="text-slate-400 text-xs font-semibold">Mulai Pengisian</div>
              </div>
              <h4 className="text-lg font-black text-slate-900 mb-2">Pantau & Jalan Kembali</h4>
              <p className="text-slate-500 text-xs leading-relaxed mb-6">Konektor terhubung, pengisian berjalan otomatis. Pantau terus status daya dari HP Anda.</p>
              
              {/* Mini Charging progress simulator */}
              <div className="mt-auto h-32 bg-slate-900 rounded-xl p-3 flex flex-col justify-between border border-slate-800">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-slate-400 font-bold">Kapasitas</span>
                  <span className="text-emerald-400 font-extrabold">⚡ 82%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-emerald-500 to-lime-400 rounded-full" style={{ width: '82%' }} />
                </div>
                <div className="text-[9px] text-slate-400 text-center leading-none">Kecepatan Daya: 112 kW (Arus DC)</div>
              </div>
            </div>
          </div>
          
        </div>
      </section>

      {/* 3. REAL-TIME STATION MAP SECTION */}
      <section id="lokasi" className="py-24 bg-white border-b border-slate-100">
        <div className="container mx-auto px-6">
          
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-12">
            <div className="space-y-3">
              <h2 className="text-emerald-600 font-extrabold tracking-widest text-xs uppercase">Dashboard SPKLU</h2>
              <h3 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Pantau Stasiun Secara Real-Time</h3>
              <p className="text-slate-500 text-sm md:text-base max-w-2xl">Lihat slot pengisian yang tersedia, estimasi tarif per kWh, dan jenis konektor yang didukung di setiap titik.</p>
            </div>
            
            {/* Interactive Filters & GPS Controls */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full lg:w-auto">
              {/* Geolocation Button & Badges */}
              <div className="flex flex-col items-start sm:items-end gap-1.5 w-full sm:w-auto">
                <div className="flex gap-2 items-center">
                  {isGpsActive ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold rounded-lg shadow-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                      Lokasi GPS Aktif
                    </span>
                  ) : userCoords ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold rounded-lg shadow-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                      Lokasi Default
                    </span>
                  ) : null}

                  {isGpsActive || userCoords ? (
                    <button 
                      onClick={resetLocation}
                      className="px-3 py-1.5 text-xs font-bold bg-white text-slate-500 hover:text-red-600 border border-slate-200 hover:border-red-200 rounded-lg transition-colors cursor-pointer shadow-sm"
                    >
                      Reset
                    </button>
                  ) : (
                    <button 
                      onClick={async () => {
                        setLoadingGps(true);
                        await requestUserLocation();
                        setLoadingGps(false);
                      }}
                      disabled={loadingGps}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition-all flex items-center gap-1.5 shadow-sm shadow-emerald-100 hover:scale-[1.02] cursor-pointer disabled:opacity-50"
                    >
                      <MapPin size={14} className={loadingGps ? 'animate-bounce' : ''} />
                      {loadingGps ? 'Mengambil GPS...' : 'Gunakan Lokasi Saya'}
                    </button>
                  )}
                </div>
                {gpsError && (
                  <span className="text-[10px] text-amber-600 font-bold max-w-xs sm:text-right leading-none">
                    {gpsError}
                  </span>
                )}
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-1.5">
                <button 
                  onClick={() => setStationFilter('all')}
                  className={`px-4 py-2 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                    stationFilter === 'all' 
                      ? 'bg-slate-900 text-white border-slate-900 shadow-sm' 
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  Semua
                </button>
                <button 
                  onClick={() => setStationFilter('fast')}
                  className={`px-4 py-2 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                    stationFilter === 'fast' 
                      ? 'bg-slate-900 text-white border-slate-900 shadow-sm' 
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  Fast Charging
                </button>
                <button 
                  onClick={() => setStationFilter('available')}
                  className={`px-4 py-2 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                    stationFilter === 'available' 
                      ? 'bg-slate-900 text-white border-slate-900 shadow-sm' 
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  Tersedia
                </button>
                <button 
                  onClick={() => setStationFilter('near')}
                  className={`px-4 py-2 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                    stationFilter === 'near' 
                      ? 'bg-slate-900 text-white border-slate-900 shadow-sm' 
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  Dekat Saya
                </button>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-stretch">
            {/* Left: Map Preview Dashboard */}
            <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-4 flex flex-col min-h-[450px] relative overflow-hidden shadow-xl">
              {/* Map Canvas Visual */}
              <div className="absolute inset-0 bg-slate-950 opacity-95">
                {/* SVG Route Mesh Grid */}
                <div className="absolute inset-0 opacity-[0.05] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:25px_25px]" />
                
                <svg className="absolute inset-0 w-full h-full text-slate-800/60" xmlns="http://www.w3.org/2000/svg">
                  <path d="M-20,100 L800,450" fill="none" stroke="currentColor" strokeWidth="4" />
                  <path d="M150,0 Q180,200 80,450" fill="none" stroke="currentColor" strokeWidth="3" />
                  <path d="M400,0 L350,500" fill="none" stroke="currentColor" strokeWidth="2" />
                  <path d="M0,300 Q350,150 800,200" fill="none" stroke="currentColor" strokeWidth="5" />
                  
                  {/* Glowing Connection lines from Selected Station */}
                  {selectedStationId === 'A1' && <circle cx="340" cy="180" r="40" fill="none" stroke="#10b981" strokeWidth="1" className="animate-ping" />}
                  {selectedStationId === 'A2' && <circle cx="480" cy="280" r="40" fill="none" stroke="#10b981" strokeWidth="1" className="animate-ping" />}
                  {selectedStationId === 'A3' && <circle cx="210" cy="320" r="40" fill="none" stroke="#10b981" strokeWidth="1" className="animate-ping" />}
                  {selectedStationId === 'A4' && <circle cx="580" cy="120" r="40" fill="none" stroke="#10b981" strokeWidth="1" className="animate-ping" />}
                </svg>

                {/* Live Markers plotted dynamically from data */}
                {/* A1 Marker */}
                <div 
                  onClick={() => setSelectedStationId('A1')}
                  className="absolute top-[38%] left-[48%] -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 group"
                >
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                    selectedStationId === 'A1' 
                      ? 'bg-emerald-600 border-white scale-125 shadow-lg shadow-emerald-500/40' 
                      : 'bg-slate-800 border-slate-600 hover:border-emerald-500'
                  }`}>
                    <Zap size={14} className={selectedStationId === 'A1' ? 'text-white' : 'text-slate-400'} />
                  </div>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-[8px] text-white font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                    Nagoya Hill
                  </div>
                </div>

                {/* A2 Marker */}
                <div 
                  onClick={() => setSelectedStationId('A2')}
                  className="absolute top-[58%] left-[68%] -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 group"
                >
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                    selectedStationId === 'A2' 
                      ? 'bg-emerald-600 border-white scale-125 shadow-lg shadow-emerald-500/40' 
                      : 'bg-slate-800 border-slate-600 hover:border-emerald-500'
                  }`}>
                    <Zap size={14} className={selectedStationId === 'A2' ? 'text-white' : 'text-slate-400'} />
                  </div>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-[8px] text-white font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                    Batam Centre
                  </div>
                </div>

                {/* A3 Marker */}
                <div 
                  onClick={() => setSelectedStationId('A3')}
                  className="absolute top-[68%] left-[30%] -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 group"
                >
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                    selectedStationId === 'A3' 
                      ? 'bg-emerald-600 border-white scale-125 shadow-lg shadow-emerald-500/40' 
                      : 'bg-slate-800 border-slate-600 hover:border-emerald-500'
                  }`}>
                    <Zap size={14} className={selectedStationId === 'A3' ? 'text-white' : 'text-slate-400'} />
                  </div>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-[8px] text-white font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                    Harbour Bay
                  </div>
                </div>

                {/* A4 Marker */}
                <div 
                  onClick={() => setSelectedStationId('A4')}
                  className="absolute top-[26%] left-[82%] -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 group"
                >
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                    selectedStationId === 'A4' 
                      ? 'bg-emerald-600 border-white scale-125 shadow-lg shadow-emerald-500/40' 
                      : 'bg-slate-800 border-slate-600 hover:border-emerald-500'
                  }`}>
                    <Zap size={14} className={selectedStationId === 'A4' ? 'text-white' : 'text-slate-400'} />
                  </div>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-[8px] text-white font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                    Grand Batam
                  </div>
                </div>
              </div>

              {/* Map Floating UI Details */}
              <div className="mt-auto relative z-10 w-full bg-slate-900/90 backdrop-blur border border-slate-800 p-4 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded text-[10px] font-bold border border-emerald-500/20 uppercase">
                      {selectedStation.type}
                    </span>
                    <span className="text-[11px] text-slate-400 font-bold flex items-center gap-1">
                      <Star size={11} className="fill-amber-400 text-amber-400" />
                      {selectedStation.rating}
                    </span>
                  </div>
                  <h4 className="text-base font-extrabold text-white">{selectedStation.name}</h4>
                  <p className="text-xs text-slate-400 flex items-center gap-1">
                    <MapPin size={12} className="text-slate-500" />
                    {selectedStation.location}
                  </p>
                </div>
                
                <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end border-t border-slate-800 md:border-t-0 pt-3 md:pt-0">
                  <div className="text-right">
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Estimasi Biaya</p>
                    <p className="text-sm font-black text-white">Rp {selectedStation.pricePerKwh.toLocaleString()}/kWh</p>
                  </div>
                  <Link 
                    to={`/station/${selectedStation.id}`}
                    className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-900/40 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    Booking Slot
                    <ChevronRight size={14} />
                  </Link>
                </div>
              </div>
            </div>

            {/* Right: Station List with Status Pills */}
            <div className="lg:col-span-5 flex flex-col gap-4 max-h-[500px] overflow-y-auto pr-1">
              {sortedStations.map(station => {
                const isSelected = station.id === selectedStationId;
                const isAvailable = station.slots.available > 0;
                
                return (
                  <div 
                    key={station.id}
                    onClick={() => setSelectedStationId(station.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected 
                        ? 'bg-slate-50 border-emerald-500 shadow-md ring-2 ring-emerald-500/20' 
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h4 className="text-sm font-extrabold text-slate-900 mb-1 group-hover:text-emerald-600">{station.name}</h4>
                        <p className="text-xs text-slate-500 line-clamp-1 mb-1">{station.location}</p>
                        {station.distance !== null && station.distance !== undefined ? (
                          <p className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                            <MapPin size={11} className="text-emerald-500" />
                            Jarak dari lokasimu: {station.distance.toFixed(1)} km
                          </p>
                        ) : (
                          <p className="text-[10px] text-slate-400 italic">
                            Aktifkan lokasi untuk melihat jarak
                          </p>
                        )}
                      </div>
                      
                      {/* Status pill */}
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide border whitespace-nowrap ${
                        isAvailable
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                          : 'bg-amber-50 text-amber-700 border-amber-100'
                      }`}>
                        {isAvailable ? `${station.slots.available}/${station.slots.total} Slot` : 'Antre'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-100 pt-3 mt-3 text-xs font-bold text-slate-700">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1 text-[11px] bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                          <Zap size={12} className="text-emerald-500" />
                          {station.power}
                        </span>
                        <span className="text-[11px] text-slate-500">
                          {station.connectors.join(', ')}
                        </span>
                      </div>
                      <span className="text-emerald-700 font-extrabold">
                        Rp {station.pricePerKwh.toLocaleString()}/kWh
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
        </div>
      </section>

      {/* 4. FEATURE BENTO GRID */}
      <section className="py-24 bg-[#f8faf7] border-b border-slate-100">
        <div className="container mx-auto px-6">
          
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-emerald-600 font-extrabold tracking-widest text-xs uppercase font-mono">Fitur PowerSync</h2>
            <h3 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Kelebihan Platform Mobilitas Kami</h3>
            <p className="text-slate-500 text-sm">Dikembangkan khusus untuk pengalaman pengguna EV yang cerdas, efisien, dan transparan.</p>
          </div>

          {/* Bento Grid Layout */}
          <div className="grid md:grid-cols-12 gap-6 auto-rows-[220px]">
            
            {/* Box 1 (Large - Col 6, Row 2) - Real-time slot booking scheduler mockup */}
            <div className="md:col-span-6 md:row-span-2 bg-white rounded-3xl border border-slate-200/80 p-8 shadow-sm flex flex-col justify-between overflow-hidden group hover:shadow-lg transition-shadow">
              <div className="space-y-3">
                <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 border border-emerald-100/50">
                  <Calendar size={24} />
                </div>
                <h4 className="text-xl font-black text-slate-900">Slot Scheduling & Real-time Booking</h4>
                <p className="text-slate-500 text-sm leading-relaxed max-w-md">
                  Pesan stasiun pengisian daya sebelumnya. Pilih tanggal, waktu, dan jenis konektor yang sesuai dengan kendaraan listrik Anda langsung dari peta.
                </p>
              </div>

              {/* Form/Interactive Scheduler Simulator inside Card */}
              <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-4 mt-6 space-y-3">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-slate-500">Konfirmasi Pemesanan</span>
                  <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">Aktif</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-[10px]">
                  <div className="bg-white p-2 rounded-lg border border-slate-200 text-slate-700">
                    <span className="text-slate-400 block text-[8px] uppercase font-bold">Tanggal</span>
                    <span className="font-bold">9 Juni 2026</span>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-slate-200 text-slate-700">
                    <span className="text-slate-400 block text-[8px] uppercase font-bold">Slot Waktu</span>
                    <span className="font-bold">13:00 - 14:00</span>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-emerald-500 bg-emerald-500/5 text-emerald-800">
                    <span className="text-emerald-600 block text-[8px] uppercase font-bold">Charger</span>
                    <span className="font-bold">CCS2 - Ultra</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Box 2 (Medium - Col 6, Row 1) - Smart Route Planner */}
            <div className="md:col-span-6 md:row-span-1 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm flex flex-col md:flex-row justify-between items-stretch gap-6 group hover:shadow-lg transition-shadow">
              <div className="flex flex-col justify-between max-w-sm space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 border border-emerald-100/50">
                    <Navigation size={20} />
                  </div>
                  <h4 className="text-base font-black text-slate-900">Rekomendasi Rute Pintar</h4>
                </div>
                <p className="text-slate-500 text-xs leading-relaxed">
                  Sistem kami akan merekomendasikan stasiun charger di sepanjang jalan sebelum baterai Anda kritis.
                </p>
              </div>

              {/* Path Routing Simulator inside Card */}
              <div className="flex-1 min-w-[150px] bg-slate-950 rounded-2xl relative overflow-hidden border border-slate-800 flex items-center justify-center">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:12px_12px] opacity-15" />
                <svg className="w-[80%] h-[80%] text-slate-700" viewBox="0 0 100 60">
                  <path d="M 10 50 Q 50 10 90 50" fill="none" stroke="currentColor" strokeWidth="2" />
                  <path d="M 10 50 Q 50 10 90 50" fill="none" stroke="#10b981" strokeWidth="2" strokeDasharray="5 3" className="animate-[pulse_1.5s_infinite]" />
                  <circle cx="10" cy="50" r="3" fill="#10b981" />
                  <circle cx="50" cy="30" r="3" fill="#10b981" />
                  <circle cx="90" cy="50" r="3" fill="#3b82f6" />
                </svg>
                <div className="absolute top-2 left-2 bg-slate-900/95 border border-slate-700 px-1.5 py-0.5 rounded text-[8px] text-white">
                  Rute Optimal
                </div>
              </div>
            </div>

            {/* Box 3 (Small - Col 3, Row 1) - QR Check In */}
            <div className="md:col-span-3 md:row-span-1 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm flex flex-col justify-between group hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 border border-emerald-100/50">
                  <QrCode size={20} />
                </div>
                <span className="text-[9px] font-bold bg-lime-400/20 text-lime-800 px-2 py-0.5 rounded-full uppercase">Instant</span>
              </div>
              <div>
                <h4 className="text-sm font-black text-slate-900 mb-1">QR Check-In Cepat</h4>
                <p className="text-slate-500 text-[11px] leading-relaxed">
                  Cukup pindai kode QR di stasiun pengisian daya untuk langsung check-in.
                </p>
              </div>
            </div>

            {/* Box 4 (Small - Col 3, Row 1) - Transaction History */}
            <div className="md:col-span-3 md:row-span-1 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm flex flex-col justify-between group hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 border border-emerald-100/50">
                  <History size={20} />
                </div>
                <span className="text-[9px] text-slate-400 font-bold">Lengkap</span>
              </div>
              <div>
                <h4 className="text-sm font-black text-slate-900 mb-1">Riwayat Pengisian</h4>
                <p className="text-slate-500 text-[11px] leading-relaxed">
                  Laporan pemakaian kWh, biaya, dan durasi pengisian yang tersimpan rapi.
                </p>
              </div>
            </div>

            {/* Box 5 (Medium - Col 6, Row 1) - Cost Estimator Calculator Simulator */}
            <div className="md:col-span-6 md:row-span-1 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm flex flex-col md:flex-row justify-between items-stretch gap-6 group hover:shadow-lg transition-shadow">
              <div className="flex flex-col justify-between max-w-xs space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 border border-emerald-100/50">
                    <DollarSign size={20} />
                  </div>
                  <h4 className="text-base font-black text-slate-900">Estimasi Biaya Transparan</h4>
                </div>
                <p className="text-slate-500 text-xs leading-relaxed">
                  Simulasikan biaya pengisian daya berdasarkan kapasitas baterai mobil EV Anda.
                </p>
              </div>

              {/* Calculator Panel UI inside card */}
              <div className="flex-1 bg-slate-50 border border-slate-200/60 rounded-2xl p-3.5 flex flex-col justify-between text-xs">
                <div>
                  <div className="flex justify-between text-[10px] text-slate-500 font-bold mb-1">
                    <span>Kapasitas Baterai</span>
                    <span className="text-slate-800">{batterySize} kWh</span>
                  </div>
                  {/* Slider */}
                  <input 
                    type="range" 
                    min="20" 
                    max="100" 
                    value={batterySize} 
                    onChange={(e) => setBatterySize(Number(e.target.value))}
                    className="w-full accent-emerald-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                  />
                </div>
                
                <div className="border-t border-slate-200/60 pt-2 flex justify-between items-center mt-2">
                  <span className="text-slate-500 text-[10px] font-bold">Estimasi Total</span>
                  <span className="text-slate-900 font-black text-sm">
                    Rp {estimatedPrice.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Box 6 (Medium - Col 6, Row 1) - TOPSIS Decision Engine Info */}
            <div className="md:col-span-6 md:row-span-1 bg-emerald-950 text-white rounded-3xl p-6 shadow-sm flex items-center gap-6 overflow-hidden relative group">
              <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
              <div className="relative z-10 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-emerald-400 border border-emerald-500/20">
                    <TrendingUp size={20} />
                  </div>
                  <h4 className="text-base font-black text-white">Sistem Rekomendasi TOPSIS</h4>
                </div>
                <p className="text-emerald-200 text-xs leading-relaxed max-w-md">
                  Menggunakan metode Multi-Criteria Decision Making (TOPSIS) untuk merekomendasikan stasiun SPKLU terbaik berdasarkan bobot jarak, harga, daya, dan ketersediaan fasilitas.
                </p>
                <Link 
                  to="/catalog" 
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-lime-400 hover:text-lime-300 transition-colors uppercase tracking-wider"
                >
                  Coba Rekomendasi <ChevronRight size={12} />
                </Link>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 5. WEBSITE EXPERIENCE PREVIEW (Cara Kerja Web) */}
      <section className="py-24 bg-white border-b border-slate-100">
        <div className="container mx-auto px-6">
          
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-emerald-600 font-extrabold tracking-widest text-xs uppercase">Demo Aplikasi</h2>
            <h3 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Eksplorasi Antarmuka Sistem</h3>
            <p className="text-slate-500 text-sm md:text-base">Pratinjau langsung panel monitoring, formulir reservasi, dan daftar pencarian stasiun.</p>
          </div>

          {/* Browser Container Frame Mockup */}
          <div className="bg-slate-950 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden max-w-5xl mx-auto flex flex-col">
            {/* Header Browser (dots + tabs) */}
            <div className="bg-slate-900 px-5 py-3.5 border-b border-slate-850 flex items-center justify-between">
              {/* Browser Dots */}
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-500/80" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <span className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>

              {/* Tabs buttons */}
              <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
                <button 
                  onClick={() => setActiveTab('search')}
                  className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                    activeTab === 'search' ? 'bg-slate-850 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  Pencarian Stasiun
                </button>
                <button 
                  onClick={() => setActiveTab('booking')}
                  className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                    activeTab === 'booking' ? 'bg-slate-850 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  Jadwal Booking
                </button>
                <button 
                  onClick={() => setActiveTab('monitoring')}
                  className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                    activeTab === 'monitoring' ? 'bg-slate-850 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  Live Monitoring
                </button>
              </div>
              
              <div className="hidden sm:block text-slate-500 text-xs font-mono select-none">
                app.powersync.id
              </div>
            </div>

            {/* Dashboard Content depending on Active Tab */}
            <div className="p-6 min-h-[360px] bg-slate-950 text-slate-100 flex flex-col justify-between">
              {activeTab === 'search' && (
                <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
                  {/* Mock search input bar */}
                  <div className="flex gap-3 bg-slate-900 p-3 rounded-2xl border border-slate-800">
                    <div className="flex-1 flex items-center gap-2 px-3 text-slate-400">
                      <Search size={18} />
                      <span className="text-sm">Batam Centre, Kepulauan Riau</span>
                    </div>
                    <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5">
                      <Sliders size={14} />
                      Filter TOPSIS
                    </button>
                  </div>

                  {/* Mock Search Table List */}
                  <div className="overflow-x-auto rounded-xl border border-slate-850 bg-slate-900/40">
                    <table className="w-full text-left text-xs text-slate-400">
                      <thead className="bg-slate-900 text-slate-200 uppercase text-[10px] tracking-wider border-b border-slate-850">
                        <tr>
                          <th className="p-3">Nama Stasiun</th>
                          <th className="p-3">Jarak</th>
                          <th className="p-3">Konektor</th>
                          <th className="p-3">Tarif / kWh</th>
                          <th className="p-3">Skor TOPSIS</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-slate-850 hover:bg-slate-900/30">
                          <td className="p-3 font-bold text-white flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                            PowerSync Nagoya Hill
                          </td>
                          <td className="p-3">1.2 km</td>
                          <td className="p-3">CCS2, CHAdeMO</td>
                          <td className="p-3">Rp 3.850</td>
                          <td className="p-3 text-emerald-400 font-bold">0.874 (Rank 1)</td>
                        </tr>
                        <tr className="border-b border-slate-850 hover:bg-slate-900/30">
                          <td className="p-3 font-bold text-white flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                            PowerSync Batam Centre
                          </td>
                          <td className="p-3">3.4 km</td>
                          <td className="p-3">CCS2, Type 2</td>
                          <td className="p-3">Rp 2.450</td>
                          <td className="p-3 text-emerald-400 font-bold">0.725 (Rank 2)</td>
                        </tr>
                        <tr className="hover:bg-slate-900/30">
                          <td className="p-3 font-bold text-slate-300 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-amber-500" />
                            PowerSync Grand Batam
                          </td>
                          <td className="p-3">2.1 km</td>
                          <td className="p-3">CCS2, GB/T</td>
                          <td className="p-3">Rp 4.000</td>
                          <td className="p-3 text-slate-400">0.640 (Rank 3)</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === 'booking' && (
                <div className="grid md:grid-cols-2 gap-6 animate-[fadeIn_0.3s_ease-out]">
                  {/* Form Mockup Panel */}
                  <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-4 text-xs">
                    <h4 className="font-bold text-white text-sm">Reservasi Slot Waktu</h4>
                    <div className="space-y-3 text-slate-400">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Stasiun Terpilih</label>
                        <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-white font-semibold">
                          PowerSync Nagoya Hill
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Tanggal</label>
                          <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-white flex items-center gap-2">
                            <Calendar size={14} className="text-slate-500" />
                            <span>09 Juni 2026</span>
                          </div>
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Mulai Jam</label>
                          <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-white flex items-center gap-2">
                            <Clock size={14} className="text-slate-500" />
                            <span>13:00 WIB</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Calendar Matrix View Mockup */}
                  <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-850 space-y-4">
                    <h4 className="text-xs font-bold text-slate-300">Peta Ketersediaan Slot Pengisian</h4>
                    <div className="grid grid-cols-4 gap-2 text-[10px] font-bold">
                      <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-3 rounded-xl text-center">
                        <span className="block text-[8px] text-slate-500 font-bold uppercase">Slot 1</span>
                        <span>Tersedia</span>
                      </div>
                      <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-center">
                        <span className="block text-[8px] text-slate-500 font-bold uppercase">Slot 2</span>
                        <span>Dipakai</span>
                      </div>
                      <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-3 rounded-xl text-center">
                        <span className="block text-[8px] text-slate-500 font-bold uppercase">Slot 3</span>
                        <span>Tersedia</span>
                      </div>
                      <div className="bg-slate-800/60 border border-slate-700 text-slate-400 p-3 rounded-xl text-center cursor-not-allowed">
                        <span className="block text-[8px] text-slate-500 font-bold uppercase">Slot 4</span>
                        <span>Rencana</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'monitoring' && (
                <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
                  {/* Live Stats Telemetry Mockup */}
                  <div className="grid sm:grid-cols-3 gap-4">
                    <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex items-center gap-3">
                      <Activity size={20} className="text-emerald-500 animate-pulse" />
                      <div>
                        <span className="text-[10px] text-slate-500 block uppercase font-bold">Daya Pengisian</span>
                        <span className="text-sm font-extrabold text-white">124.8 kW</span>
                      </div>
                    </div>
                    <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex items-center gap-3">
                      <Battery size={20} className="text-lime-400" />
                      <div>
                        <span className="text-[10px] text-slate-500 block uppercase font-bold">Daya Tersalurkan</span>
                        <span className="text-sm font-extrabold text-white">43.2 kWh</span>
                      </div>
                    </div>
                    <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex items-center gap-3">
                      <Clock size={20} className="text-blue-400" />
                      <div>
                        <span className="text-[10px] text-slate-500 block uppercase font-bold">Durasi Sesi</span>
                        <span className="text-sm font-extrabold text-white">28m 15s</span>
                      </div>
                    </div>
                  </div>

                  {/* Charging Percentage Bar Large */}
                  <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="relative w-16 h-16 rounded-full border-4 border-slate-800 border-t-emerald-500 flex items-center justify-center text-sm font-extrabold text-white">
                        85%
                      </div>
                      <div className="text-left">
                        <h4 className="text-xs font-bold text-slate-300">Estimasi Selesai Pengisian (90%)</h4>
                        <p className="text-[10px] text-slate-500 mt-0.5">Sisa Waktu: 4 Menit 12 Detik</p>
                      </div>
                    </div>
                    
                    <button className="px-5 py-2.5 bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-red-400 font-bold rounded-xl text-xs cursor-pointer transition-colors">
                      Hentikan Pengisian
                    </button>
                  </div>
                </div>
              )}
              
              {/* Bottom footer note */}
              <div className="border-t border-slate-850 pt-4 mt-6 flex justify-between items-center text-[10px] text-slate-500">
                <span className="flex items-center gap-1">
                  <Info size={12} />
                  Semua data pengisian disinkronkan secara real-time.
                </span>
                <span>v1.2.0-Production</span>
              </div>
            </div>
          </div>
          
        </div>
      </section>

      {/* 6. FINAL CTA SECTION */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="bg-slate-950 rounded-[2rem] border border-slate-850 relative overflow-hidden shadow-2xl p-12 md:p-20 text-center max-w-5xl mx-auto">
            {/* Glowing background highlights */}
            <div className="absolute top-[-20%] right-[-10%] w-[350px] h-[350px] bg-emerald-500/15 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-[-20%] left-[-10%] w-[350px] h-[350px] bg-teal-500/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="relative z-10 max-w-2xl mx-auto space-y-6">
              <h2 className="text-3xl md:text-[44px] font-black text-white leading-tight tracking-tight">
                Siap Isi Daya Tanpa <br className="hidden md:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-lime-400">Antre Panjang?</span>
              </h2>
              
              <p className="text-slate-400 text-sm md:text-base leading-relaxed max-w-xl mx-auto">
                Gabung dengan pengguna EV lain dan temukan stasiun pengisian terbaik di sekitarmu melalui platform terintegrasi PowerSync.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Link 
                  to="/register" 
                  className="w-full sm:w-auto px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-base shadow-lg shadow-emerald-900/25 transition-all hover:scale-[1.02] flex items-center justify-center gap-2 cursor-pointer"
                >
                  Buat Akun Sekarang
                  <Check size={18} />
                </Link>
                <Link 
                  to="/catalog" 
                  className="w-full sm:w-auto px-8 py-4 bg-slate-900 border border-slate-800 text-white hover:bg-slate-850 hover:border-slate-700 rounded-xl font-bold text-base transition-all hover:scale-[1.02] flex items-center justify-center cursor-pointer"
                >
                  Lihat Semua Lokasi
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
