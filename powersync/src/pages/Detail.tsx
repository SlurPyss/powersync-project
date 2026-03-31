import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, MapPin, Zap, Star, Clock, Shield, Wifi, Coffee, 
  ParkingCircle, Calculator, BadgeCheck 
} from 'lucide-react';
import { useBooking } from '../context/BookingContext';
import type { Booking } from '../types';

const Detail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { stations, addBooking } = useBooking();
  
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
    estimatedEnergy: 20,
    notes: '',
  });

  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    if (station) {
      setTotalPrice(formData.estimatedEnergy * station.pricePerKwh);
      if (station.connectors.length > 0 && !formData.connectorType) {
        setFormData(prev => ({ ...prev, connectorType: station.connectors[0] }));
      }
    }
  }, [formData.estimatedEnergy, station]);

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
      [name]: name === 'duration' || name === 'estimatedEnergy' ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newBooking: Booking = {
      id: `bk-${Math.random().toString(36).substr(2, 9)}`,
      stationId: station.id,
      stationName: station.name,
      ...formData,
      totalPrice,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    addBooking(newBooking);
    alert('Booking berhasil dibuat! Menuju ke halaman Booking Saya...');
    navigate('/my-bookings');
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
                      {station.slots.available} / {station.slots.total} Available
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">Tarif per kWh</div>
                    <div className="flex items-center gap-2 font-extrabold text-slate-900">
                      Rp {station.pricePerKwh.toLocaleString()}
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
                  <Calculator className="text-white" size={28} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">Formulir Booking</h3>
                  <p className="text-sm text-slate-500 font-medium">Lengkapi data untuk reservasi slot.</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <label className="text-sm font-bold text-slate-700 ml-1">Nama Lengkap</label>
                       <input
                        required
                        name="customerName"
                        className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-emerald-500 font-medium"
                        placeholder="John Doe"
                        value={formData.customerName}
                        onChange={handleInputChange}
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

                  <div className="grid grid-cols-2 gap-4">
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

                  <div className="grid grid-cols-2 gap-4">
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
                  </div>

                  <div className="grid grid-cols-2 gap-4">
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
                    <div className="space-y-2">
                       <label className="text-sm font-bold text-slate-700 ml-1">Durasi (Menit)</label>
                       <select
                        name="duration"
                        className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-emerald-500 font-medium"
                        value={formData.duration}
                        onChange={handleInputChange}
                      >
                        {[15, 30, 45, 60, 90, 120].map(d => (
                          <option key={d} value={d}>{d} Menit</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 ml-1">Tanggal</label>
                      <input
                        type="date"
                        name="startDate"
                        className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-emerald-500 font-medium"
                        value={formData.startDate}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 ml-1">Waktu Mulai</label>
                      <input
                        type="time"
                        name="startTime"
                        className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-emerald-500 font-medium"
                        value={formData.startTime}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center ml-1">
                       <label className="text-sm font-bold text-slate-700">Estimasi Energi (kWh)</label>
                       <span className="text-emerald-600 font-extrabold">{formData.estimatedEnergy} kWh</span>
                    </div>
                    <input
                      type="range"
                      name="estimatedEnergy"
                      min="5"
                      max="100"
                      step="5"
                      className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                      value={formData.estimatedEnergy}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="p-6 bg-slate-900 rounded-3xl space-y-4">
                  <div className="flex justify-between items-center text-slate-400">
                    <span className="text-sm font-medium">Estimasi Konsumsi</span>
                    <span className="text-sm font-bold text-slate-200">{formData.estimatedEnergy} kWh</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-400">
                    <span className="text-sm font-medium">Harga per kWh</span>
                    <span className="text-sm font-bold text-slate-200">Rp {station.pricePerKwh.toLocaleString()}</span>
                  </div>
                  <div className="pt-4 border-t border-slate-800 flex justify-between items-center">
                    <span className="text-lg font-bold text-white">Total Bayar</span>
                    <span className="text-2xl font-extrabold text-emerald-500">Rp {totalPrice.toLocaleString()}</span>
                  </div>
                </div>

                <button type="submit" className="w-full btn-primary py-4 text-lg">Konfirmasi Booking</button>
                <p className="text-xs text-slate-400 text-center font-medium px-8 italic">
                  *Dengan mengonfirmasi, Anda menyetujui syarat dan ketentuan penggunaan fasilitas PowerSync di area {station.name}.
                </p>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Detail;
