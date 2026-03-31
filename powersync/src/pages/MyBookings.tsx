import React from 'react';
import { useBooking } from '../context/BookingContext';
import { 
  History, Clock, CheckCircle2, Zap, AlertCircle, 
  Trash2, ExternalLink, Calendar, MapPin, BadgeCheck 
} from 'lucide-react';
import { Link } from 'react-router-dom';

const MyBookings: React.FC = () => {
  const { bookings, updateBookingStatus, deleteBooking } = useBooking();

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'confirmed': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'charging': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'completed': return 'bg-slate-100 text-slate-700 border-slate-200';
      case 'cancelled': return 'bg-rose-100 text-rose-700 border-rose-200';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return Clock;
      case 'confirmed': return BadgeCheck;
      case 'charging': return Zap;
      case 'completed': return CheckCircle2;
      case 'cancelled': return AlertCircle;
      default: return Clock;
    }
  };

  const handleNextStatus = async (id: string, current: string) => {
    const statuses: any[] = ['pending', 'confirmed', 'charging', 'completed'];
    const currentIndex = statuses.indexOf(current);
    if (currentIndex !== -1 && currentIndex < statuses.length - 1) {
      try {
        await updateBookingStatus(id, statuses[currentIndex + 1]);
      } catch (error) {
        console.error('Handled state change failure:', error);
      }
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
          <div className="space-y-4">
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Manajemen <span className="text-emerald-600">Booking Saya</span></h1>
            <p className="text-slate-600 font-medium">Pantau status pengisian daya dan riwayat transaksi Anda.</p>
          </div>
          <div className="flex items-center gap-4">
             <div className="bg-white px-6 py-3 rounded-2xl border border-slate-200 font-bold text-slate-700 shadow-sm">
               Total: {bookings.length} Sesi
             </div>
          </div>
        </div>

        {bookings.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {bookings.map((booking) => {
              const StatusIcon = getStatusIcon(booking.status);
              return (
                <div key={booking.id} className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 hover:border-emerald-200 transition-all duration-300 group">
                  <div className="flex flex-col lg:flex-row gap-8 items-start lg:items-center">
                    
                    {/* Status & ID */}
                    <div className="lg:w-1/4 space-y-4">
                      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-extrabold capitalize ${getStatusStyle(booking.status)}`}>
                        <StatusIcon size={18} />
                        {booking.status}
                      </div>
                      <div>
                        <div className="text-xs text-slate-400 font-extrabold uppercase tracking-widest mb-1">Booking ID</div>
                        <div className="text-lg font-mono font-bold text-slate-900 truncate">{booking.id}</div>
                      </div>
                    </div>

                    {/* Booking Details */}
                    <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-8 border-l border-slate-50 pl-8">
                       <div className="space-y-1">
                        <div className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">Stasiun</div>
                        <div className="font-extrabold text-slate-900 flex items-center gap-2">
                          <MapPin size={16} className="text-emerald-500" />
                          {booking.stationName}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">Jadwal</div>
                        <div className="font-extrabold text-slate-900 flex items-center gap-2">
                          <Calendar size={16} className="text-emerald-500" />
                          {booking.startDate} • {booking.startTime}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">Kendaraan</div>
                        <div className="font-extrabold text-slate-900">
                          {booking.vehicleType} ({booking.plateNumber})
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">Energi & Durasi</div>
                        <div className="font-extrabold text-slate-900">
                          {booking.estimatedEnergy} kWh / {booking.duration} Min
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">Total Biaya</div>
                        <div className="font-extrabold text-emerald-600 text-lg">
                          Rp {booking.totalPrice.toLocaleString()}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">Connector</div>
                        <div className="font-extrabold text-slate-900">
                           {booking.connectorType}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="lg:w-1/5 flex lg:flex-col gap-3 w-full">
                       {booking.status !== 'completed' && booking.status !== 'cancelled' && (
                         <button 
                            onClick={() => handleNextStatus(booking.id, booking.status)}
                            className="flex-1 btn-primary py-3 text-sm flex items-center justify-center gap-2"
                          >
                            Update Status
                            <ExternalLink size={16} />
                         </button>
                       )}
                       <button 
                        onClick={() => deleteBooking(booking.id)}
                        className="p-3 rounded-xl bg-slate-50 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-all border border-slate-100 flex items-center justify-center gap-2 font-bold text-sm"
                       >
                         <Trash2 size={18} />
                         {booking.status === 'completed' || booking.status === 'cancelled' ? 'Hapus Riwayat' : 'Batalkan'}
                       </button>
                    </div>

                  </div>

                  {/* Progress Line */}
                  {booking.status !== 'cancelled' && booking.status !== 'completed' && (
                    <div className="mt-8 pt-8 border-t border-slate-50">
                       <div className="relative h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className={`absolute top-0 left-0 h-full transition-all duration-1000 bg-emerald-500`}
                            style={{ 
                              width: booking.status === 'pending' ? '25%' : 
                                     booking.status === 'confirmed' ? '50%' : 
                                     booking.status === 'charging' ? '75%' : '100%' 
                            }}
                          ></div>
                       </div>
                       <div className="flex justify-between mt-4">
                          {['Pending', 'Confirmed', 'Charging', 'Completed'].map((s, i) => (
                            <span key={i} className={`text-xs font-extrabold uppercase tracking-tighter ${
                              (i === 0 && booking.status === 'pending') ||
                              (i === 1 && booking.status === 'confirmed') ||
                              (i === 2 && booking.status === 'charging') ||
                              (i === 3 && booking.status === 'completed') ? 'text-emerald-600' : 'text-slate-300'
                            }`}>{s}</span>
                          ))}
                       </div>
                    </div>
                  )}

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
              <h3 className="text-3xl font-extrabold text-slate-900">Belum Ada Sesi Booking</h3>
              <p className="text-slate-500 max-w-sm mx-auto font-medium">Anda belum melakukan pemesanan slot pengisian daya. Mulai sekarang untuk menikmati kemudahan berkendara listrik.</p>
            </div>
            <Link to="/catalog" className="btn-primary inline-flex items-center gap-2 px-10">
              Cari Stasiun Sekarang
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
