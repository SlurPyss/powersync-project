import React, { useState, useEffect } from 'react';
import { User as UserIcon, Mail, Phone, Car, CreditCard, Shield, Save, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Profile: React.FC = () => {
  const { user, updateUser } = useAuth();
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    vehicle_type: user?.vehicle_type || '',
    plate_number: user?.plate_number || '',
    password: '',
    password_confirmation: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    if (user) {
      setFormData({
        ...formData,
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        vehicle_type: user.vehicle_type || '',
        plate_number: user.plate_number || '',
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const response = await axios.put('http://127.0.0.1:8001/api/user/profile', formData);
      updateUser(response.data.data);
      setMessage({ type: 'success', text: 'Profil berhasil diperbarui!' });
      // Clear password fields
      setFormData(prev => ({ ...prev, password: '', password_confirmation: '' }));
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || 'Gagal memperbarui profil. Silakan coba lagi.';
      setMessage({ type: 'error', text: errorMsg });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="flex items-center gap-4 mb-10">
          <div className="bg-emerald-600 p-3 rounded-2xl shadow-lg shadow-emerald-200">
            <UserIcon className="text-white" size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Manajemen Profil</h1>
            <p className="text-slate-500 font-medium">Kelola data diri dan identitas kendaraan Anda.</p>
          </div>
        </div>

        {message && (
          <div className={`mb-8 p-4 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 border ${
            message.type === 'success' 
              ? 'bg-emerald-50 border-emerald-100 text-emerald-700' 
              : 'bg-red-50 border-red-100 text-red-700'
          }`}>
            {message.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
            <span className="font-bold">{message.text}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Information */}
          <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100">
            <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
              <span className="w-1.5 h-6 bg-emerald-500 rounded-full"></span>
              Informasi Pribadi
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Nama Lengkap</label>
                <div className="relative">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    required
                    name="name"
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-emerald-500 font-medium transition-all"
                    placeholder="Masukkan nama lengkap"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Alamat Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    required
                    type="email"
                    name="email"
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-emerald-500 font-medium transition-all"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Nomor Telepon</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    name="phone"
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-emerald-500 font-medium transition-all"
                    placeholder="0812xxxxxxxx"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Vehicle Information */}
          <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100">
            <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
              <span className="w-1.5 h-6 bg-blue-500 rounded-full"></span>
              Manajemen Kendaraan
            </h3>
            <p className="text-sm text-slate-500 mb-8 -mt-6 font-medium">
              Data ini akan digunakan untuk pengisian otomatis (auto-fill) saat Anda melakukan booking.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Tipe Kendaraan</label>
                <div className="relative">
                  <Car className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    name="vehicle_type"
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-emerald-500 font-medium transition-all"
                    placeholder="Contoh: Hyundai Ioniq 5"
                    value={formData.vehicle_type}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Nomor Plat (Batam)</label>
                <div className="relative">
                  <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    name="plate_number"
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-emerald-500 font-medium transition-all"
                    placeholder="Contoh: BP 1234 YY"
                    value={formData.plate_number}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Security */}
          <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100">
            <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
              <span className="w-1.5 h-6 bg-orange-500 rounded-full"></span>
              Keamanan Akun
            </h3>
            <p className="text-sm text-slate-500 mb-8 -mt-6 font-medium">
              Biarkan kosong jika Anda tidak ingin mengubah kata sandi.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Kata Sandi Baru</label>
                <div className="relative">
                  <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="password"
                    name="password"
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-emerald-500 font-medium transition-all"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Konfirmasi Kata Sandi</label>
                <div className="relative">
                  <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="password"
                    name="password_confirmation"
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-emerald-500 font-medium transition-all"
                    placeholder="••••••••"
                    value={formData.password_confirmation}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 pb-12">
            <button
              type="submit"
              disabled={isLoading}
              className="px-10 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl shadow-xl shadow-emerald-200 transition-all flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed hover:translate-y-[-2px] active:translate-y-[0px]"
            >
              {isLoading ? 'Menyimpan...' : (
                <>
                  <Save size={20} />
                  Simpan Perubahan
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
