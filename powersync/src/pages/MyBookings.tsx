import React, { useState } from 'react';
import { useBooking } from '../context/BookingContext';
import { 
  History, Clock, CheckCircle2, Zap, AlertCircle, 
  Trash2, ExternalLink, Calendar, MapPin, BadgeCheck,
  CreditCard, X, Upload, Check, Info, LogIn
} from 'lucide-react';
import { Link } from 'react-router-dom';

const MyBookings: React.FC = () => {
  const { bookings, deleteBooking, checkIn } = useBooking();
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-slate-100 text-slate-700 border-slate-200';
      case 'accepted': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'ready': return 'bg-emerald-100 text-emerald-700 border-emerald-200 shadow-sm shadow-emerald-100';
      case 'occupied': return 'bg-emerald-600 text-white border-emerald-700';
      case 'completed': return 'bg-slate-100 text-slate-700 border-slate-200 opacity-50';
      case 'cancelled': return 'bg-rose-100 text-rose-700 border-rose-200';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return Clock;
      case 'accepted': return BadgeCheck;
      case 'ready': return CheckCircle2;
      case 'occupied': return Zap;
      case 'completed': return CheckCircle2;
      case 'cancelled': return AlertCircle;
      default: return Clock;
    }
  };

  const handleCheckIn = async (bookingId: string) => {
    setLoadingAction(bookingId);
    try {
      await checkIn(bookingId);
      alert('Check-in Berhasil! Mohon segera hubungkan kendaraan Anda.');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Check-in gagal.');
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
          <div className="space-y-4">
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Manajemen <span className="text-emerald-600">Terjadwal</span></h1>
            <p className="text-slate-600 font-medium">Pantau status slot Anda. Check-in hanya dapat dilakukan 15 menit sebelum hingga 10 menit sesudah jadwal mulai.</p>
          </div>
          <div className="flex items-center gap-4">
             <div className="bg-white px-6 py-3 rounded-2xl border border-slate-200 font-bold text-slate-700 shadow-sm">
               Total: {bookings.length} Reservasi
             </div>
          </div>
        </div>

        {bookings.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {bookings.map((booking) => {
              const StatusIcon = getStatusIcon(booking.status);
              return (
                <div key={booking.id} className={`bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 hover:border-emerald-200 transition-all duration-300 group ${booking.status === 'completed' || booking.status === 'cancelled' ? 'opacity-70' : ''}`}>
                  <div className="flex flex-col lg:flex-row gap-8 items-start lg:items-center">
                    
                    {/* Status & ID */}
                    <div className="lg:w-1/4 space-y-4">
                      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-extrabold capitalize ${getStatusStyle(booking.status)}`}>
                        <StatusIcon size={18} />
                        {booking.status}
                      </div>
                      <div>
                        <div className="text-xs text-slate-400 font-extrabold uppercase tracking-widest mb-1">Booking ID</div>
                        <div className="text-lg font-mono font-bold text-slate-900 truncate">#{booking.id.padStart(6, '0')}</div>
                      </div>
                    </div>

                    {/* Booking Details */}
                    <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-8 border-l border-slate-100 pl-8">
                       <div className="space-y-1">
                        <div className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">Lokasi & Slot</div>
                        <div className="font-extrabold text-slate-900 flex items-center gap-2">
                          <MapPin size={16} className="text-emerald-500" />
                          {booking.stationName} <span className="text-slate-400 text-sm">({booking.slotNumber || '-'})</span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">Jadwal Slot</div>
                        <div className="font-extrabold text-slate-900 flex items-center gap-2">
                          <Calendar size={16} className="text-emerald-500" />
                          {booking.startDate} • {booking.startTime} - {booking.endTime}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">Kendaraan</div>
                        <div className="font-extrabold text-slate-900">
                          {booking.vehicleType || '-'}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">Plat Nomor</div>
                        <div className="font-extrabold text-slate-900">
                          {booking.plateNumber || '-'}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">Konektor</div>
                        <div className="font-extrabold text-slate-900">
                           {booking.connectorType}
                        </div>
                      </div>
                      {booking.checkInTime && (
                           <div className="space-y-1">
                           <div className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">Waktu Check In</div>
                           <div className="font-extrabold text-slate-900">
                              {booking.checkInTime}
                           </div>
                         </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="lg:w-1/5 flex lg:flex-col gap-3 w-full">
                       {booking.status === 'ready' && (
                         <button 
                            onClick={() => handleCheckIn(booking.id)}
                            disabled={loadingAction === booking.id}
                            className="flex-1 bg-emerald-600 text-white rounded-2xl py-3 font-black text-sm flex items-center justify-center gap-2 hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200"
                          >
                            <LogIn size={18} />
                            {loadingAction === booking.id ? 'Memproses...' : 'Check-In'}
                         </button>
                       )}
                       {booking.status === 'pending' || booking.status === 'accepted' ? (
                         <div className="flex-1 bg-slate-100 text-slate-400 rounded-2xl py-3 font-bold text-xs flex items-center justify-center gap-2 text-center px-2">
                           <Clock size={16} />
                           Belum Masuk Waktu
                         </div>
                       ) : null}
                       
                       <button 
                        onClick={() => deleteBooking(booking.id)}
                        className="p-3 rounded-xl bg-slate-50 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-all border border-slate-100 flex items-center justify-center gap-2 font-bold text-sm"
                       >
                         <Trash2 size={18} />
                         {booking.status === 'completed' || booking.status === 'cancelled' || booking.status === 'rejected' ? 'Hapus Riwayat' : 'Batalkan Reservasi'}
                       </button>
                    </div>

                  </div>

                  {/* Progress Line */}
                  <div className="mt-8 pt-8 border-t border-slate-100">
                     <div className="relative h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`absolute top-0 left-0 h-full transition-all duration-1000 bg-emerald-500`}
                          style={{ 
                            width: booking.status === 'pending' ? '10%' : 
                                   booking.status === 'accepted' ? '30%' : 
                                   booking.status === 'ready' ? '60%' : 
                                   booking.status === 'occupied' ? '80%' : 
                                   booking.status === 'completed' ? '100%' : '100%',
                            backgroundColor: booking.status === 'cancelled' ? '#f43f5e' : ''
                          }}
                        ></div>
                     </div>
                     <div className="flex justify-between mt-4">
                        {['Antrean', 'Reserved', 'Siap Check-in', 'Memuat Daya', 'Selesai'].map((s, i) => (
                          <span key={i} className={`text-[10px] font-black uppercase tracking-widest ${
                            (i === 0 && booking.status === 'pending') ||
                            (i === 1 && booking.status === 'accepted') ||
                            (i === 2 && booking.status === 'ready') ||
                            (i === 3 && booking.status === 'occupied') ||
                            (i === 4 && booking.status === 'completed') ? 'text-emerald-600' : 
                            (booking.status === 'cancelled' && i === 4) ? 'text-rose-600' : 'text-slate-300'
                          }`}>{booking.status === 'cancelled' && i === 4 ? 'Dibatalkan' : s}</span>
                        ))}
                     </div>
                  </div>

                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-[3rem] p-24 text-center shadow-sm border border-slate-100 space-y-8">
            <div className="bg-emerald-50 w-32 h-32 rounded-[2.5rem] flex items-center justify-center mx-auto rotate-12">
              <History size={64} className="text-emerald-600 -rotate-12" />
            </div>
            <div className="space-y-4">
              <h3 className="text-3xl font-extrabold text-slate-900">Belum Ada Reservasi</h3>
              <p className="text-slate-500 max-w-sm mx-auto font-medium">Anda belum melakukan pemesanan slot pengisian daya. Mulai sekarang untuk menghindari antrean panjang.</p>
            </div>
            <Link to="/catalog" className="btn-primary inline-flex items-center gap-2 px-10">
              Cari Stasiun Sekarang <Zap size={20} />
            </Link>
          </div>
        )}
      </div>

    </div>
  );
};

export default MyBookings;
