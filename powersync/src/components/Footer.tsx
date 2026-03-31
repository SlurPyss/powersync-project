import { Zap, Mail, Phone, MapPin, Globe } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-8">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        <div className="col-span-1 md:col-span-1">
          <div className="flex items-center gap-2 mb-6">
            <Zap className="text-emerald-500" fill="currentColor" size={28} />
            <span className="text-2xl font-bold text-white tracking-tight">FleetCharge</span>
          </div>
          <p className="text-slate-400 mb-6 leading-relaxed">
            Solusi pengisian daya kendaraan listrik terpercaya untuk masa depan yang lebih hijau dan berkelanjutan.
          </p>
          <div className="flex gap-4">
            <a href="#" className="p-2 bg-slate-800 rounded-lg hover:bg-emerald-600 transition-colors">
              <Globe size={20} />
            </a>
            <a href="#" className="p-2 bg-slate-800 rounded-lg hover:bg-emerald-600 transition-colors">
              <Globe size={20} />
            </a>
            <a href="#" className="p-2 bg-slate-800 rounded-lg hover:bg-emerald-600 transition-colors">
              <Globe size={20} />
            </a>
          </div>
        </div>

        <div>
          <h3 className="text-white font-semibold text-lg mb-6">Layanan Kami</h3>
          <ul className="space-y-4">
            <li><a href="#" className="hover:text-emerald-400 transition-colors">Pencarian Stasiun</a></li>
            <li><a href="#" className="hover:text-emerald-400 transition-colors">Booking Slot</a></li>
            <li><a href="#" className="hover:text-emerald-400 transition-colors">Kalkulator Energi</a></li>
            <li><a href="#" className="hover:text-emerald-400 transition-colors">Fleet Management</a></li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-semibold text-lg mb-6">Tautan Penting</h3>
          <ul className="space-y-4">
            <li><a href="#" className="hover:text-emerald-400 transition-colors">Tentang Kami</a></li>
            <li><a href="#" className="hover:text-emerald-400 transition-colors">Bantuan & FAQ</a></li>
            <li><a href="#" className="hover:text-emerald-400 transition-colors">Kebijakan Privasi</a></li>
            <li><a href="#" className="hover:text-emerald-400 transition-colors">Syarat & Ketentuan</a></li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-semibold text-lg mb-6">Hubungi Kami</h3>
          <ul className="space-y-4">
            <li className="flex items-center gap-3">
              <MapPin className="text-emerald-500" size={18} />
              <span>Batam Centre, Kepulauan Riau</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="text-emerald-500" size={18} />
              <span>+62 811-1234-5678</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="text-emerald-500" size={18} />
              <span>support@fleetcharge.id</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="container mx-auto px-6 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-sm text-slate-500">
          © 2026 FleetCharge. Seluruh Hak Cipta Dilindungi.
        </p>
        <div className="flex gap-8 text-sm text-slate-500">
          <a href="#" className="hover:text-emerald-400 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-emerald-400 transition-colors">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
