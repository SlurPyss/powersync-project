import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, MapPin, Zap, Star, Clock, Shield, Wifi, Coffee, 
  ParkingCircle, BadgeCheck, User, CheckCircle2 
} from 'lucide-react';
import { useBooking } from '../context/BookingContext';
import { useAuth } from '../context/AuthContext';

const Detail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { stations, addBooking, isGpsActive } = useBooking();
  const { user } = useAuth();
  
  const station = useMemo(() => stations.find((s) => s.id === id), [stations, id]);

  const [formData, setFormData] = useState({
    customerName: '',
    email: '',
    phone: '',
    vehicleType: '',
    plateNumber: '',
    connectorType: '',
    startDate: new Date().toISOString().split('T')[0],
    startTime: '10:00',
    duration: 30,
    notes: '',
  });

  const [showSuccess, setShowSuccess] = useState(false);

  // Auto-fill from user profile
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        customerName: user.name || prev.customerName,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
        vehicleType: user.vehicle_type || prev.vehicleType,
        plateNumber: user.plate_number || prev.plateNumber,
      }));
    }
  }, [user]);

  useEffect(() => {
    if (station) {
      if (station.connectors.length > 0 && !formData.connectorType) {
        setFormData(prev => ({ ...prev, connectorType: station.connectors[0] }));
      }
    }
  }, [station]);

  if (!station) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">Stasiun Tidak Ditemukan</h2>
          <button onClick={() => navigate('/catalog')} className="btn-primary">Kembali ke Katalog</button>
        </div>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'duration' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await addBooking({
        stationId: station.id,
        ...formData,
      });
      setShowSuccess(true);
      setTimeout(() => {
        navigate('/my-bookings');
      }, 3000);
    } catch (e: any) {
      alert(e.response?.data?.message || 'Gagal melakukan reservasi.');
    }
  };

  const facilityIcons: Record<string, any> = {
    'Parking': ParkingCircle,
    'Cafe': Coffee,
    'WiFi': Wifi,
    'Restroom': BadgeCheck,
    'Security': Shield,
    'Mall Access': BadgeCheck,
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* Navigation Header */}
      <div className="bg-white border-b border-emerald-100 py-6 sticky top-[73px] z-30">
        <div className="container mx-auto px-6">
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center gap-2 text-slate-600 hover:text-emerald-600 font-bold transition-colors"
          >
            <ArrowLeft size={20} />
            Kembali ke Hasil Pencarian
          </button>
        </div>
      </div>

      <div className="container mx-auto px-6 mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Station Info */}
          <div className="lg:col-span-12 xl:col-span-7 space-y-8">
            <div className="bg-white rounded-[3rem] overflow-hidden shadow-sm border border-slate-100">
               <img 
                src={station.image} 
                alt={station.name} 
                className="w-full h-[450px] object-cover"
              />
               <div className="p-10 space-y-6">
                <div className="flex flex-wrap justify-between items-start gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className={`px-4 py-1 rounded-full text-sm font-extrabold text-white ${
                        station.type === 'Ultra Fast' ? 'bg-orange-500' : 'bg-emerald-600'
                      }`}>
                        {station.type}
                      </span>
                      <span className="px-4 py-1 bg-slate-100 rounded-full text-sm font-extrabold text-slate-600">
                        {station.power}
                      </span>
                    </div>
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">{station.name}</h1>
                    <div className="flex items-center gap-2 text-slate-500 font-medium pt-2">
                      <MapPin size={20} className="text-emerald-500" />
                      {station.location}
                    </div>
                    {station.distance !== null && station.distance !== undefined ? (
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold rounded-lg shadow-sm">
                          <MapPin size={12} className="text-emerald-600" />
                          Jarak dari lokasimu: {station.distance.toFixed(1)} km
                        </span>
                        <span className={`px-2.5 py-1 text-[11px] font-bold rounded-lg border shadow-sm ${
                          isGpsActive 
                            ? 'bg-emerald-500/15 text-emerald-800 border-emerald-200' 
                            : 'bg-amber-500/15 text-amber-800 border-amber-200'
                        }`}>
                          {isGpsActive ? '🟢 Lokasi GPS Aktif' : '🟡 Menggunakan Lokasi Default'}
                        </span>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 italic pt-1">
                        Aktifkan lokasi di halaman beranda atau katalog untuk menghitung jarak.
                      </p>
                    )}
                  </div>
                  <div className="bg-emerald-50 px-6 py-4 rounded-3xl border border-emerald-100 text-center">
                    <div className="flex items-center justify-center gap-2 text-emerald-600 font-extrabold mb-1">
                      <Star size={20} fill="currentColor" />
                      <span className="text-xl">{station.rating}</span>
                    </div>
                    <div className="text-xs text-emerald-600/70 font-bold uppercase tracking-wider">Rating Stasiun</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t border-slate-50">
                   <div className="space-y-1">
                    <div className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">Power Output</div>
                    <div className="flex items-center gap-2 font-extrabold text-slate-900">
                      <Zap size={18} className="text-emerald-500" />
                      {station.power}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">Jam Operasional</div>
                    <div className="flex items-center gap-2 font-extrabold text-slate-900">
                      <Clock size={18} className="text-emerald-500" />
                      {station.operatingHours}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">Status Slot</div>
                    <div className="flex items-center gap-2 font-extrabold text-emerald-600">
                      <BadgeCheck size={18} />
                      {station.slots?.available ?? 0} / {station.slots?.total ?? 0} Available
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">Tarif/Lokasi Info</div>
                    <div className="flex items-center gap-2 font-extrabold text-slate-900">
                      Lihat Aplikasi Pembayaran Mitra
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Facilities */}
            <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100">
              <h3 className="text-2xl font-bold text-slate-900 mb-8">Fasilitas Stasiun</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {station.facilities.map((fac) => {
                  const Icon = facilityIcons[fac] || BadgeCheck;
                  return (
                    <div key={fac} className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-emerald-200 transition-colors">
                      <div className="bg-white p-2 rounded-xl shadow-sm text-emerald-600">
                        <Icon size={24} />
                      </div>
                      <span className="font-bold text-slate-700">{fac}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Booking Form */}
          <div className="lg:col-span-12 xl:col-span-5">
            <div className="bg-white rounded-[2.5rem] p-10 shadow-xl border border-emerald-100 sticky top-[160px]">
              <div className="flex items-center gap-4 mb-8">
                <div className="bg-emerald-600 p-3 rounded-2xl">
                  <Clock className="text-white" size={28} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">Reservasi Slot</h3>
                  <p className="text-sm text-slate-500 font-medium">Pilih periode waktu & slot charging Anda.</p>
                </div>
              </div>

              {/* Station summary with distance inside Booking form card */}
              <div className="bg-slate-50 border border-slate-250/60 p-4 rounded-2xl mb-6 flex justify-between items-center text-xs font-bold">
                <div>
                  <span className="text-slate-400 block text-[9px] uppercase font-bold tracking-wide">Stasiun Tujuan</span>
                  <span className="text-slate-900">{station.name}</span>
                </div>
                {station.distance !== null && station.distance !== undefined && (
                  <div className="text-right">
                    <span className="text-slate-400 block text-[9px] uppercase font-bold tracking-wide">Estimasi Jarak</span>
                    <span className="text-emerald-700">{station.distance.toFixed(1)} km</span>
                  </div>
                )}
              </div>

              {!user ? (
                <div className="bg-slate-50 border border-slate-100 rounded-3xl p-8 text-center space-y-4 shadow-inner">
                  <div className="bg-white w-20 h-20 rounded-[2rem] flex items-center justify-center mx-auto shadow-md border border-slate-100 group-hover:scale-110 transition-transform">
                    <User size={36} className="text-emerald-600" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-xl font-black text-slate-900">Login Diperlukan</h4>
                    <p className="text-sm text-slate-500 font-medium leading-relaxed">
                      Anda harus masuk atau membuat akun terlebih dahulu untuk dapat memesan slot pengisian daya.
                    </p>
                  </div>
                  <div className="flex flex-col gap-3 pt-6">
                    <Link to="/login" className="btn-primary w-full text-center">Masuk ke Akun</Link>
                    <Link to="/register" className="btn-secondary w-full text-center">Daftar Akun Baru</Link>
                  </div>
                </div>
              ) : user?.role === 'admin' ? (
                <div className="bg-slate-50 border border-slate-100 rounded-3xl p-8 text-center space-y-4">
                  <Shield size={48} className="text-slate-400 mx-auto" />
                  <h4 className="text-xl font-bold text-slate-800">Administrator Terdeteksi</h4>
                  <p className="text-sm text-slate-500 font-medium">
                    Akun administrator hanya memiliki akses ke Dashboard. Anda tidak dapat melakukan reservasi slot menggunakan akun ini.
                  </p>
                </div>
              ) : showSuccess ? (
                <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-10 text-center space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 shadow-sm">
                  <div className="bg-emerald-600 w-24 h-24 rounded-full flex items-center justify-center mx-auto shadow-xl shadow-emerald-200 animate-bounce">
                    <CheckCircle2 size={48} className="text-white" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-2xl font-black text-emerald-900 tracking-tight">Reservasi Berhasil!</h4>
                    <p className="text-emerald-700 font-medium leading-relaxed">
                      Slot Anda telah diamankan. Mengarahkan Anda ke halaman Manajemen Terjadwal dalam beberapa detik...
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <label className="text-sm font-bold text-slate-700 ml-1">Nama Lengkap</label>
                       <input
                        required
                        name="customerName"
                        className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-emerald-500 font-medium"
                        placeholder="John Doe"
                        value={formData.customerName}
                        onChange={handleInputChange}
                        disabled
                      />
                    </div>
                    <div className="space-y-2">
                       <label className="text-sm font-bold text-slate-700 ml-1">Tipe Kendaraan</label>
                       <input
                        required
                        name="vehicleType"
                        className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-emerald-500 font-medium"
                        placeholder="Hyundai Ioniq 5"
                        value={formData.vehicleType}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <label className="text-sm font-bold text-slate-700 ml-1">Email</label>
                       <input
                        required
                        type="email"
                        name="email"
                        className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-emerald-500 font-medium"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        disabled
                      />
                    </div>
                    <div className="space-y-2">
                       <label className="text-sm font-bold text-slate-700 ml-1">Nomor Telepon</label>
                       <input
                        required
                        type="tel"
                        name="phone"
                        className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-emerald-500 font-medium"
                        placeholder="0812xxxx"
                        value={formData.phone}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <label className="text-sm font-bold text-slate-700 ml-1">Nomor Plat</label>
                       <input
                        required
                        name="plateNumber"
                        className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-emerald-500 font-medium"
                        placeholder="BP 1234 XX"
                        value={formData.plateNumber}
                        onChange={handleInputChange}
                      />
                    </div>
                     <div className="space-y-2">
                       <label className="text-sm font-bold text-slate-700 ml-1">Tipe Connector</label>
                       <select
                        name="connectorType"
                        className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-emerald-500 font-medium"
                        value={formData.connectorType}
                        onChange={handleInputChange}
                      >
                        {station.connectors.map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-100 mt-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 ml-1">Tanggal</label>
                      <input
                        type="date"
                        name="startDate"
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-emerald-500 font-medium shadow-inner"
                        value={formData.startDate}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 ml-1">Waktu Mulai</label>
                      <input
                        type="time"
                        name="startTime"
                        className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-emerald-500 font-medium shadow-inner"
                        value={formData.startTime}
                        onChange={handleInputChange}
                      />
                    </div>
                     <div className="space-y-2">
                       <label className="text-sm font-bold text-slate-700 ml-1">Durasi</label>
                       <select
                        name="duration"
                        className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-emerald-500 font-medium shadow-inner"
                        value={formData.duration}
                        onChange={handleInputChange}
                      >
                        {[15, 30, 45, 60, 90, 120].map(d => (
                          <option key={d} value={d}>{d} Menit</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-emerald-50 rounded-3xl space-y-4 border border-emerald-100">
                  <div className="flex items-start gap-4">
                    <Shield size={24} className="text-emerald-600 shrink-0 mt-1" />
                    <div>
                      <h4 className="font-bold text-emerald-900 mb-1">Informasi Antrean</h4>
                      <p className="text-sm text-emerald-800/80 leading-relaxed">
                        Jika slot penuh pada waktu yang Anda pilih, permintaan ini akan secara otomatis dimasukkan ke sistem antrean (Queue). Sistem akan memberitahu jika ada pembatalan. Check-in hanya dapat dilakukan dari 15 menit sebelum hingga 10 menit sesudah jadwal.
                      </p>
                    </div>
                  </div>
                </div>

                <button type="submit" className="w-full btn-primary py-4 text-lg">Konfirmasi Booking</button>
                <p className="text-xs text-slate-400 text-center font-medium px-8 italic">
                  *Dengan mengonfirmasi, Anda menyetujui syarat dan ketentuan penggunaan fasilitas PowerSync di area {station.name}.
                </p>
              </form>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Detail;
