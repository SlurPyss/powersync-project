import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Zap, Mail, Lock, ArrowRight, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [loginMode, setLoginMode] = useState<'password' | 'otp'>('password');
  const [otpSent, setOtpSent] = useState(false);
  const [demoOtp, setDemoOtp] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await axios.post('http://127.0.0.1:8001/api/login', {
        email,
        password,
      });

      const { access_token, data } = response.data;
      login(access_token, data); 
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Email atau password salah. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await axios.post('http://127.0.0.1:8001/api/otp/send', { email });
      setOtpSent(true);
      if (response.data.demo_otp) {
        setDemoOtp(response.data.demo_otp);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal mengirim OTP. Pastikan email terdaftar.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await axios.post('http://127.0.0.1:8001/api/otp/verify', { email, otp });
      const { access_token, data } = response.data;
      login(access_token, data);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'OTP tidak valid atau sudah kedaluwarsa.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-12 flex flex-col justify-center bg-slate-50 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-100 rounded-full blur-[120px] opacity-60 animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-100 rounded-full blur-[120px] opacity-60 animate-pulse" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-md mx-auto">
          {/* Logo & Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-600 shadow-xl shadow-emerald-200 mb-6 group hover:scale-110 transition-transform duration-300">
              <Zap className="text-white group-hover:animate-bounce" size={32} fill="currentColor" />
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-3">Selamat Datang</h1>
            <p className="text-slate-500 font-medium italic">Pilih metode masuk yang Anda inginkan</p>
          </div>

          {/* Form Card */}
          <div className="bg-white/70 backdrop-blur-2xl border border-white p-8 md:p-10 rounded-[2.5rem] shadow-2xl shadow-slate-200/50">
            {/* Mode Selector */}
            <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-8">
              <button 
                onClick={() => { setLoginMode('password'); setError(null); setOtpSent(false); }}
                className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${loginMode === 'password' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Password
              </button>
              <button 
                onClick={() => { setLoginMode('otp'); setError(null); }}
                className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${loginMode === 'otp' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                OTP (Email)
              </button>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-sm font-medium animate-in fade-in slide-in-from-top-2">
                <AlertCircle size={18} />
                {error}
              </div>
            )}

            {loginMode === 'password' ? (
              <form onSubmit={handlePasswordSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Email Anda</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                      <Mail size={18} />
                    </div>
                    <input
                      type="email"
                      required
                      className="w-full pl-11 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-emerald-500 focus:bg-white outline-none transition-all font-medium text-slate-900 placeholder:text-slate-400 shadow-inner"
                      placeholder="nama@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center ml-1">
                    <label className="text-sm font-bold text-slate-700">Password</label>
                    <a href="#" className="text-xs font-bold text-emerald-600 hover:text-emerald-700">Lupa Password?</a>
                  </div>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                      <Lock size={18} />
                    </div>
                    <input
                      type="password"
                      required
                      className="w-full pl-11 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-emerald-500 focus:bg-white outline-none transition-all font-medium text-slate-900 placeholder:text-slate-400 shadow-inner"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-lg shadow-lg shadow-emerald-200 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed group"
                >
                  {loading ? <Loader2 className="animate-spin" size={20} /> : <>Masuk dengan Password <ArrowRight size={20} /></>}
                </button>
              </form>
            ) : (
              <div className="space-y-6">
                {!otpSent ? (
                  <form onSubmit={handleSendOtp} className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 ml-1">Email Terdaftar</label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                          <Mail size={18} />
                        </div>
                        <input
                          type="email"
                          required
                          className="w-full pl-11 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-emerald-500 focus:bg-white outline-none transition-all font-medium text-slate-900 shadow-inner"
                          placeholder="nama@email.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-lg shadow-lg shadow-emerald-200 flex items-center justify-center gap-2 transition-all"
                    >
                      {loading ? <Loader2 className="animate-spin" size={20} /> : <>Kirim Kode OTP <ArrowRight size={20} /></>}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyOtp} className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center ml-1">
                        <label className="text-sm font-bold text-slate-700">Kode OTP</label>
                        <button type="button" onClick={() => setOtpSent(false)} className="text-xs font-bold text-emerald-600">Ubah Email?</button>
                      </div>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                          <CheckCircle2 size={18} />
                        </div>
                        <input
                          type="text"
                          maxLength={4}
                          required
                          className="w-full pl-11 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-emerald-500 focus:bg-white outline-none transition-all font-bold text-2xl tracking-[1em] text-center shadow-inner"
                          placeholder="0000"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                        />
                      </div>
                      {demoOtp && (
                        <div className="mt-2 p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-700 text-xs font-bold text-center">
                          Demo OTP: {demoOtp} (Gunakan kode ini untuk masuk)
                        </div>
                      )}
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-4 bg-slate-900 hover:bg-black text-white rounded-2xl font-bold text-lg shadow-xl flex items-center justify-center gap-2 transition-all"
                    >
                      {loading ? <Loader2 className="animate-spin" size={20} /> : <>Verifikasi & Masuk <ArrowRight size={20} /></>}
                    </button>
                  </form>
                )}
              </div>
            )}

            <div className="mt-8 pt-8 border-t border-slate-100 text-center">
              <p className="text-slate-500 text-sm font-medium">
                Belum punya akun?{' '}
                <Link to="/register" className="text-emerald-600 font-bold hover:underline">
                  Daftar PowerSync Gratis
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
