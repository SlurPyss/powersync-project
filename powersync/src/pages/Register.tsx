import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Zap, Mail, Lock, User, ArrowRight, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [error, setError] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await axios.post('http://127.0.0.1:8001/api/register', {
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
      });

      const { access_token, data } = response.data;
      
      if (!access_token || !data) {
        throw new Error('Gagal memproses data dari server. Silakan coba lagi.');
      }

      login(access_token, data);
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Registration error:', err);
      if (err.response?.status === 500) {
        setError({ message: 'Terjadi kesalahan sistem di server (500). Harap hubungi admin.' });
      } else {
        setError(err.response?.data || { message: 'Terjadi kesalahan saat pendaftaran.' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-16 flex flex-col justify-center bg-slate-50 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-5%] right-[-5%] w-[45%] h-[45%] bg-emerald-100 rounded-full blur-[130px] opacity-70 animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100 rounded-full blur-[130px] opacity-70" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
            
            {/* Left Info (Desktop) */}
            <div className="hidden md:block flex-1 space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 rounded-full text-emerald-700 font-bold text-xs uppercase tracking-widest">
                <CheckCircle2 size={16} />
                Sudah Terpercaya di Batam
              </div>
              <h2 className="text-5xl font-black text-slate-900 leading-tight">
                Bergabunglah dengan <span className="text-emerald-600">Revolusi Energi</span> Batam.
              </h2>
              <ul className="space-y-4">
                {[
                  'Akses 24/7 ke seluruh stasiun pengisian',
                  'Booking slot instan tanpa antre',
                  'Pantau status pengisian dari ponsel',
                  'Dapatkan poin dan promo eksklusif'
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-4 text-slate-600 font-medium">
                    <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white shrink-0">
                      <ArrowRight size={14} />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Form Card */}
            <div className="flex-1 w-full">
              <div className="text-center md:hidden mb-8">
                 <h1 className="text-3xl font-black text-slate-900 tracking-tight">Daftar Akun Baru</h1>
              </div>
              
              <div className="bg-white/70 backdrop-blur-2xl border border-white p-8 md:p-10 rounded-[2.5rem] shadow-2xl shadow-slate-200/50">
                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex flex-col gap-2 text-red-600 text-sm font-medium">
                    <div className="flex items-center gap-2">
                       <AlertCircle size={18} />
                       <span>{error.message || 'Harap periksa kembali data Anda.'}</span>
                    </div>
                    {/* Display validation errors if any */}
                    <div className="text-xs list-disc ml-6">
                       {Object.keys(error).filter(k => k !== 'message').map(k => (
                         <div key={k}>{error[k][0]}</div>
                       ))}
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 gap-5">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 ml-1">Nama Lengkap</label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                          <User size={18} />
                        </div>
                        <input
                          type="text"
                          required
                          className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-emerald-500 focus:bg-white outline-none transition-all font-medium text-slate-900 placeholder:text-slate-400"
                          placeholder="Masukkan nama"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 ml-1">Email Aktif</label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                          <Mail size={18} />
                        </div>
                        <input
                          type="email"
                          required
                          className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-emerald-500 focus:bg-white outline-none transition-all font-medium text-slate-900 placeholder:text-slate-400"
                          placeholder="nama@email.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 ml-1">Password</label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                          <Lock size={18} />
                        </div>
                        <input
                          type="password"
                          required
                          className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-emerald-500 focus:bg-white outline-none transition-all font-medium text-slate-900 placeholder:text-slate-400"
                          placeholder="Min. 8 karakter"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 ml-1">Konfirmasi Password</label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                          <Lock size={18} />
                        </div>
                        <input
                          type="password"
                          required
                          className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-emerald-500 focus:bg-white outline-none transition-all font-medium text-slate-900 placeholder:text-slate-400"
                          placeholder="Ketik ulang password"
                          value={passwordConfirmation}
                          onChange={(e) => setPasswordConfirmation(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 mt-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-lg shadow-lg shadow-emerald-200 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed group"
                  >
                    {loading ? (
                      <Loader2 className="animate-spin" size={20} />
                    ) : (
                      <>
                        Simpan & Daftar
                        <Zap size={20} fill="currentColor" className="group-hover:animate-bounce" />
                      </>
                    )}
                  </button>
                </form>

                <div className="mt-8 pt-8 border-t border-slate-100 text-center">
                  <p className="text-slate-500 text-sm font-medium">
                    Sudah punya akun?{' '}
                    <Link to="/login" className="text-emerald-600 font-bold hover:underline">
                      Masuk ke PowerSync
                    </Link>
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
