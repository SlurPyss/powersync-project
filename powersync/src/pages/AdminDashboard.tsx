import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
  Package, Clock, CheckCircle,
  XCircle, Search, Zap, Inbox
} from 'lucide-react';

interface Booking {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: string;
  date: string;
  start_time: string;
  duration: number;
  station: { name: string };
  user: { name: string; email: string };
}

interface Toast {
  message: string;
  type: 'success' | 'error';
}

const STATUS_LABELS: Record<string, string> = {
  all: 'Semua',
  pending: 'Pending',
  accepted: 'Accepted',
  ready: 'Ready',
  occupied: 'Occupied',
  completed: 'Completed',
  rejected: 'Rejected',
};

const statusBadge = (status: string) => {
  const map: Record<string, string> = {
    pending: 'bg-amber-100 text-amber-700',
    accepted: 'bg-blue-100 text-blue-700',
    ready: 'bg-emerald-100 text-emerald-700',
    occupied: 'bg-emerald-600 text-white',
    completed: 'bg-slate-200 text-slate-700',
    rejected: 'bg-rose-100 text-rose-700',
  };
  return map[status] ?? 'bg-slate-100 text-slate-600';
};

/* ─── Skeleton row for loading state ─── */
const SkeletonRow = () => (
  <tr>
    {Array.from({ length: 5 }).map((_, i) => (
      <td key={i} className="px-8 py-6">
        <div className="space-y-2">
          <div className="h-4 w-3/4 rounded-lg bg-slate-100 animate-pulse" />
          <div className="h-3 w-1/2 rounded-lg bg-slate-50 animate-pulse" />
        </div>
      </td>
    ))}
  </tr>
);

/* ─── Skeleton card for mobile loading ─── */
const SkeletonCard = () => (
  <div className="bg-white rounded-2xl border border-slate-100 p-5 space-y-4 animate-pulse">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-slate-100" />
      <div className="flex-1 space-y-2">
        <div className="h-4 w-2/3 rounded bg-slate-100" />
        <div className="h-3 w-1/2 rounded bg-slate-50" />
      </div>
    </div>
    <div className="h-3 w-full rounded bg-slate-50" />
    <div className="h-3 w-3/4 rounded bg-slate-50" />
  </div>
);

/* ─── Empty state illustration ─── */
const EmptyState = ({ label }: { label: string }) => (
  <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
    <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mb-5">
      <Inbox size={36} className="text-slate-300" />
    </div>
    <p className="text-slate-500 font-bold text-lg mb-1">Tidak ada data ditemukan</p>
    <p className="text-slate-400 text-sm max-w-xs">
      {label === 'all'
        ? 'Belum ada reservasi yang masuk saat ini.'
        : `Tidak ada reservasi dengan status "${STATUS_LABELS[label] ?? label}".`}
    </p>
  </div>
);

/* ─── Toast component ─── */
const ToastBar = ({ toast, onClose }: { toast: Toast; onClose: () => void }) => {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl shadow-xl text-sm font-bold transition-all animate-slide-up ${
        toast.type === 'success'
          ? 'bg-emerald-600 text-white shadow-emerald-200'
          : 'bg-rose-600 text-white shadow-rose-200'
      }`}
    >
      {toast.type === 'success' ? <CheckCircle size={18} /> : <XCircle size={18} />}
      {toast.message}
    </div>
  );
};

/* ─── Mobile booking card ─── */
const BookingCard = ({
  booking,
  onAction,
}: {
  booking: Booking;
  onAction: (id: number, action: 'accept' | 'reject' | 'complete') => void;
}) => (
  <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-shadow">
    {/* Header: user + status */}
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600 shrink-0">
          {booking.user.name.charAt(0)}
        </div>
        <div className="min-w-0">
          <p className="font-bold text-slate-900 truncate">{booking.user.name}</p>
          <p className="text-xs text-slate-400 font-medium truncate">{booking.user.email}</p>
        </div>
      </div>
      <span
        className={`shrink-0 ml-2 inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${statusBadge(
          booking.status
        )}`}
      >
        {STATUS_LABELS[booking.status] ?? booking.status}
      </span>
    </div>

    {/* Details grid */}
    <div className="grid grid-cols-2 gap-3 text-sm mb-4">
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Stasiun</p>
        <p className="font-bold text-slate-700 flex items-center gap-1">
          <Zap size={13} className="text-emerald-500" />
          {booking.station?.name || 'Unknown'}
        </p>
      </div>
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Tanggal</p>
        <p className="font-medium text-slate-700">{booking.date}</p>
      </div>
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Waktu</p>
        <p className="font-black text-slate-900">{booking.start_time}</p>
      </div>
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Durasi</p>
        <p className="font-bold text-slate-700">{booking.duration} Menit</p>
      </div>
    </div>

    {/* Actions */}
    {booking.status === 'pending' && (
      <div className="flex gap-2 pt-3 border-t border-slate-100">
        <button
          onClick={() => onAction(booking.id, 'accept')}
          className="flex-1 px-3 py-2 bg-emerald-100 text-emerald-700 font-bold text-xs rounded-xl hover:bg-emerald-200 transition-colors"
        >
          Terima
        </button>
        <button
          onClick={() => onAction(booking.id, 'reject')}
          className="flex-1 px-3 py-2 bg-rose-100 text-rose-700 font-bold text-xs rounded-xl hover:bg-rose-200 transition-colors"
        >
          Tolak
        </button>
      </div>
    )}
  </div>
);

/* ═══════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════════ */
const AdminDashboard: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState<Toast | null>(null);

  const API_BASE_URL = 'http://127.0.0.1:8001/api';

  const fetchBookings = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/bookings`);
      setBookings(response.data);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleAction = async (id: number, action: 'accept' | 'reject' | 'complete') => {
    try {
      await axios.put(`${API_BASE_URL}/admin/bookings/${id}/${action}`);
      setToast({ message: 'Aksi berhasil diproses!', type: 'success' });
      fetchBookings();
    } catch (error) {
      setToast({ message: 'Gagal memproses aksi.', type: 'error' });
    }
  };

  const dismissToast = useCallback(() => setToast(null), []);

  /* ── Filtered + searched bookings ── */
  const filteredBookings = bookings
    .filter((b) => (filter === 'all' ? true : b.status === filter))
    .filter((b) => {
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        b.user.name.toLowerCase().includes(q) ||
        b.user.email.toLowerCase().includes(q) ||
        (b.station?.name ?? '').toLowerCase().includes(q)
      );
    });

  const stats = [
    {
      label: 'Total Reservasi',
      value: bookings.length,
      icon: Package,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      label: 'Antrean (Pending)',
      value: bookings.filter((b) => b.status === 'pending').length,
      icon: Clock,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
    },
    {
      label: 'Aktif',
      value: bookings.filter((b) => b.status === 'occupied' || b.status === 'ready').length,
      icon: Zap,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
    {
      label: 'Selesai',
      value: bookings.filter((b) => b.status === 'completed').length,
      icon: CheckCircle,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
  ];

  const filterTabs = ['all', 'pending', 'accepted', 'ready', 'occupied', 'completed'] as const;

  return (
    <>
      {/* Slide-up animation */}
      <style>{`
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up { animation: slide-up .3s ease-out; }
      `}</style>

      <div className="min-h-screen bg-slate-50 pt-10 pb-20">
        <div className="container mx-auto px-4 sm:px-6">
          {/* ── Header ── */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
            <div className="space-y-1">
              <h1 className="text-3xl font-black text-slate-900">Admin Control Panel</h1>
              <p className="text-slate-500 font-medium">Monitoring and managing all power sessions.</p>
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:flex-initial">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari user atau stasiun..."
                  className="w-full md:w-64 pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-medium"
                />
              </div>
              <button className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200 shrink-0">
                Export Data
              </button>
            </div>
          </div>

          {/* ── Stats Grid ── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-10">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div
                  key={i}
                  className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className={`p-2.5 sm:p-3 ${stat.bg} ${stat.color} rounded-2xl`}>
                      <Icon size={22} />
                    </div>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-slate-500 text-[11px] sm:text-sm font-bold uppercase tracking-wider leading-tight">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-black text-slate-900">{stat.value}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Main Content Card ── */}
          <div className="bg-white rounded-3xl sm:rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
            {/* Filter header */}
            <div className="p-5 sm:p-8 border-b border-slate-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-xl font-black text-slate-900">Daftar Reservasi</h2>
              <div className="flex gap-2 flex-wrap">
                {filterTabs.map((s) => (
                  <button
                    key={s}
                    onClick={() => setFilter(s)}
                    className={`px-3 sm:px-4 py-1.5 rounded-lg text-[10px] sm:text-xs font-black uppercase tracking-wider transition-all ${
                      filter === s
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                    }`}
                  >
                    {STATUS_LABELS[s] ?? s}
                  </button>
                ))}
              </div>
            </div>

            {/* ── Desktop table (hidden on small screens) ── */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                    <th className="px-8 py-4">User</th>
                    <th className="px-8 py-4">Stasiun &amp; Tanggal</th>
                    <th className="px-8 py-4">Waktu &amp; Durasi</th>
                    <th className="px-8 py-4">Status Reservasi</th>
                    <th className="px-8 py-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {loading ? (
                    <>
                      <SkeletonRow />
                      <SkeletonRow />
                      <SkeletonRow />
                      <SkeletonRow />
                    </>
                  ) : filteredBookings.length === 0 ? (
                    <tr>
                      <td colSpan={5}>
                        <EmptyState label={filter} />
                      </td>
                    </tr>
                  ) : (
                    filteredBookings.map((booking) => (
                      <tr key={booking.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600">
                              {booking.user.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-bold text-slate-900">{booking.user.name}</p>
                              <p className="text-xs text-slate-400 font-medium">{booking.user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="space-y-1">
                            <p className="font-bold text-slate-700 flex items-center gap-1.5 text-sm">
                              <Zap size={14} className="text-emerald-500" />
                              {booking.station?.name || 'Unknown'}
                            </p>
                            <p className="text-xs text-slate-400 font-medium">{booking.date}</p>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <p className="font-black text-slate-900">{booking.start_time}</p>
                          <p className="text-xs text-slate-500 font-bold">{booking.duration} Menit</p>
                        </td>
                        <td className="px-8 py-6">
                          <span
                            className={`inline-flex items-center w-fit px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${statusBadge(
                              booking.status
                            )}`}
                          >
                            {STATUS_LABELS[booking.status] ?? booking.status}
                          </span>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex justify-end gap-2">
                            {booking.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => handleAction(booking.id, 'accept')}
                                  className="px-3 py-1.5 bg-emerald-100 text-emerald-700 font-bold text-xs rounded-lg hover:bg-emerald-200 transition-colors"
                                >
                                  Terima
                                </button>
                                <button
                                  onClick={() => handleAction(booking.id, 'reject')}
                                  className="px-3 py-1.5 bg-rose-100 text-rose-700 font-bold text-xs rounded-lg hover:bg-rose-200 transition-colors"
                                >
                                  Tolak
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* ── Mobile cards (shown only on small screens) ── */}
            <div className="md:hidden p-4 space-y-3">
              {loading ? (
                <>
                  <SkeletonCard />
                  <SkeletonCard />
                  <SkeletonCard />
                </>
              ) : filteredBookings.length === 0 ? (
                <EmptyState label={filter} />
              ) : (
                filteredBookings.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} onAction={handleAction} />
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Toast notification ── */}
      {toast && <ToastBar toast={toast} onClose={dismissToast} />}
    </>
  );
};

export default AdminDashboard;
