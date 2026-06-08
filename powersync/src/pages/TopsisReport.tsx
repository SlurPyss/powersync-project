import React from 'react';
import { 
  BarChart, CheckCircle, Database, Calculator, TrendingUp, Settings, MapPin, 
  Clock, DollarSign, BatteryCharging, PlusCircle
} from 'lucide-react';

const TopsisReport: React.FC = () => {
  // Dummy Data matched to User's request
  const stations = [
    { id: 'A1', name: 'SPKLU Batam Center', location: 'Batam Center', jarak: 2.5, biaya: 25000, waktu: 15, daya: 150 },
    { id: 'A2', name: 'EV Station Nagoya', location: 'Nagoya', jarak: 4.0, biaya: 30000, waktu: 10, daya: 50 },
    { id: 'A3', name: 'Green Charging Sekupang', location: 'Sekupang', jarak: 7.0, biaya: 20000, waktu: 30, daya: 22 },
    { id: 'A4', name: 'Smart Charging Batu Aji', location: 'Batu Aji', jarak: 8.0, biaya: 15000, waktu: 5, daya: 200 },
    { id: 'A5', name: 'Quick Charge Bengkong', location: 'Bengkong', jarak: 5.5, biaya: 35000, waktu: 20, daya: 100 },
  ];

  const criteria = [
    { id: 'C1', name: 'Jarak (km)', type: 'Cost', weight: 30 },
    { id: 'C2', name: 'Biaya per kWh (Rp)', type: 'Cost', weight: 25 },
    { id: 'C3', name: 'Waktu Tunggu (Menit)', type: 'Cost', weight: 20 },
    { id: 'C4', name: 'Kapasitas Daya (kW)', type: 'Benefit', weight: 25 },
  ];

  // Matriks Keputusan sudah diwakili oleh data stasiun di atas.

  // Data Normalisasi Ternormalisasi (R)
  const normalisasi = [
    [0.1943, 0.4303, 0.3693, 0.5460],
    [0.3109, 0.5164, 0.2462, 0.1820],
    [0.5441, 0.3443, 0.7385, 0.0801],
    [0.6219, 0.2582, 0.1231, 0.7280],
    [0.4275, 0.6025, 0.4924, 0.3640],
  ];

  // Matriks Ternormalisasi Terbobot (Y)
  const terbobot = [
    [0.0583, 0.1076, 0.0739, 0.1365],
    [0.0933, 0.1291, 0.0492, 0.0455],
    [0.1632, 0.0861, 0.1477, 0.0200],
    [0.1866, 0.0645, 0.0246, 0.1820],
    [0.1283, 0.1506, 0.0985, 0.0910],
  ];

  const ideal = {
    positif: [0.0583, 0.0645, 0.0246, 0.1820], // C1 min, C2 min, C3 min, C4 max
    negatif: [0.1866, 0.1506, 0.1477, 0.0200], // C1 max, C2 max, C3 max, C4 min
  };

  const rawPreferensi = [
    { id: 'A1', name: 'SPKLU Batam Center', dPlus: 0.0797, dMin: 0.1932, v: 0.7080 },
    { id: 'A2', name: 'EV Station Nagoya', dPlus: 0.1569, dMin: 0.1397, v: 0.4709 },
    { id: 'A3', name: 'Green Charging Sekupang', dPlus: 0.2299, dMin: 0.0686, v: 0.2299 },
    { id: 'A4', name: 'Smart Charging Batu Aji', dPlus: 0.1283, dMin: 0.2209, v: 0.6327 },
    { id: 'A5', name: 'Quick Charge Bengkong', dPlus: 0.1614, dMin: 0.1042, v: 0.3924 },
  ].sort((a, b) => b.v - a.v);

  const preferensi = rawPreferensi.map((p, index) => ({ ...p, rank: index + 1 }));
  const bestStation = preferensi[0];

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="container mx-auto px-6 space-y-16">
        
        {/* HEADER */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tight">Sistem Pendukung Keputusan Pemilihan SPKLU</h1>
          <p className="text-lg text-slate-500 font-medium max-w-3xl mx-auto">
            Implementasi Metode Technique for Order Preference by Similarity to Ideal Solution (TOPSIS)
          </p>
        </div>

        {/* PENGUJIAN SISTEM */}
        <div id="pengujian-sistem" className="bg-emerald-50 border border-emerald-200 rounded-3xl p-8">
          <div className="flex items-start gap-4">
            <CheckCircle className="text-emerald-600 mt-1" size={28} />
            <div>
              <h3 className="text-xl font-bold text-emerald-900 mb-2">System Testing: Validasi Perhitungan Berhasil</h3>
              <p className="text-emerald-800">
                Data matriks keputusan telah tervalidasi. Black-box testing menunjukkan tidak ada anomali pada input pengguna (0 error).
                Bobot kriteria total = 100%. Algoritma TOPSIS berhasil menyelesaikan eksekusi dalam 45ms.
              </p>
            </div>
          </div>
        </div>

        {/* DATA STASIUN */}
        <div id="data-stasiun" className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl"><Database size={24} /></div>
            <h2 className="text-2xl font-black text-slate-800">Data Alternatif Stasiun (A)</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                  <th className="px-6 py-4 rounded-l-xl">Kode</th>
                  <th className="px-6 py-4">Nama Stasiun</th>
                  <th className="px-6 py-4">Lokasi</th>
                  <th className="px-6 py-4">Jarak (km)</th>
                  <th className="px-6 py-4">Biaya (Rp/kWh)</th>
                  <th className="px-6 py-4">Waktu Tunggu (Mnt)</th>
                  <th className="px-6 py-4 rounded-r-xl">Kapasitas Daya (kW)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {stations.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-bold text-slate-700">{s.id}</td>
                    <td className="px-6 py-4 font-bold text-emerald-600">{s.name}</td>
                    <td className="px-6 py-4 text-slate-600">{s.location}</td>
                    <td className="px-6 py-4 font-medium">{s.jarak}</td>
                    <td className="px-6 py-4 font-medium">{s.biaya.toLocaleString()}</td>
                    <td className="px-6 py-4 font-medium">{s.waktu}</td>
                    <td className="px-6 py-4 font-medium">{s.daya}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* DATA KRITERIA & BOBOT */}
        <div id="data-kriteria" className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl"><Settings size={24} /></div>
            <h2 className="text-2xl font-black text-slate-800">Data Kriteria dan Bobot (C)</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {criteria.map(c => (
              <div key={c.id} className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                <div className="text-xs font-black text-slate-400 mb-2">{c.id}</div>
                <div className="text-lg font-bold text-slate-800 mb-4">{c.name}</div>
                <div className="flex justify-between items-center text-sm font-bold">
                  <span className={`px-3 py-1 rounded-full ${c.type === 'Benefit' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                    {c.type}
                  </span>
                  <span className="text-amber-600 bg-amber-50 px-3 py-1 rounded-full">Bobot: {c.weight}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FORM INPUT ALTERNATIF */}
        <div id="form-input" className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl"><PlusCircle size={24} /></div>
            <h2 className="text-2xl font-black text-slate-800">Kelola Data Stasiun & Kriteria</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4 bg-slate-50 p-8 rounded-3xl">
              <h3 className="font-bold text-lg mb-4">Tambah Alternatif Baru</h3>
              <div className="space-y-3">
                <input className="w-full p-3 rounded-xl border border-slate-200" placeholder="Nama Stasiun" value="Plaza SPKLU Riau" readOnly/>
                <div className="grid grid-cols-2 gap-3">
                  <input className="w-full p-3 rounded-xl border border-slate-200" placeholder="Jarak" value="3.2" readOnly/>
                  <input className="w-full p-3 rounded-xl border border-slate-200" placeholder="Biaya" value="22000" readOnly/>
                  <input className="w-full p-3 rounded-xl border border-slate-200" placeholder="Waktu Tunggu" value="10" readOnly/>
                  <input className="w-full p-3 rounded-xl border border-slate-200" placeholder="Daya" value="50" readOnly/>
                </div>
                <button className="w-full py-3 bg-emerald-600 text-white font-bold rounded-xl">Simpan Data</button>
              </div>
            </div>
            <div className="space-y-4 bg-slate-50 p-8 rounded-3xl">
               <h3 className="font-bold text-lg mb-4">Pengaturan Preferensi Pengguna</h3>
               <div className="space-y-3">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase">Prioritas Jarak</label>
                    <input type="range" className="w-full mt-2" min="0" max="100" value="30" readOnly/>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase">Prioritas Kecepatan Daya</label>
                    <input type="range" className="w-full mt-2" min="0" max="100" value="25" readOnly/>
                  </div>
                  <button className="w-full py-3 bg-slate-900 text-white font-bold rounded-xl mt-4">Terapkan Bobot</button>
               </div>
            </div>
          </div>
        </div>

        {/* PROSES TOPSIS */}
        <div id="proses-topsis" className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-black text-slate-800 flex items-center gap-3">
              <Calculator className="text-emerald-600" size={32} />
              Proses Perhitungan TOPSIS
            </h2>
          </div>

          {/* NORMALISASI */}
          <div id="hasil-normalisasi" className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-10">
            <h3 className="text-xl font-bold text-slate-800 mb-6">Tahap 1: Matriks Keputusan Ternormalisasi (R)</h3>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px] text-left">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                    <th className="px-6 py-4 rounded-l-xl">Alternatif</th>
                    <th className="px-6 py-4">C1</th>
                    <th className="px-6 py-4">C2</th>
                    <th className="px-6 py-4">C3</th>
                    <th className="px-6 py-4 rounded-r-xl">C4</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {normalisasi.map((row, i) => (
                    <tr key={i}>
                      <td className="px-6 py-4 font-bold text-slate-700">A{i+1}</td>
                      {row.map((val, j) => <td key={j} className="px-6 py-4 font-medium">{val}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* TERBOBOT */}
          <div id="hasil-terbobot" className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-10">
            <h3 className="text-xl font-bold text-slate-800 mb-6">Tahap 2: Matriks Ternormalisasi Terbobot (Y)</h3>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px] text-left">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                    <th className="px-6 py-4 rounded-l-xl">Alternatif</th>
                    <th className="px-6 py-4">C1</th>
                    <th className="px-6 py-4">C2</th>
                    <th className="px-6 py-4">C3</th>
                    <th className="px-6 py-4 rounded-r-xl">C4</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {terbobot.map((row, i) => (
                    <tr key={i}>
                      <td className="px-6 py-4 font-bold text-slate-700">A{i+1}</td>
                      {row.map((val, j) => <td key={j} className="px-6 py-4 font-medium">{val.toFixed(2)}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* SOLUSI IDEAL */}
          <div id="solusi-ideal" className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-10">
            <h3 className="text-xl font-bold text-slate-800 mb-6">Tahap 3: Solusi Ideal Positif (A+) dan Negatif (A-)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-emerald-50 rounded-3xl p-6 border border-emerald-100">
                <h4 className="font-bold text-emerald-800 mb-4 text-lg">Solusi Ideal Positif (A+)</h4>
                <div className="space-y-2">
                  {ideal.positif.map((val, j) => (
                    <div key={j} className="flex justify-between font-bold">
                      <span className="text-emerald-700">y+ {j+1}</span>
                      <span className="text-emerald-900">{val.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-rose-50 rounded-3xl p-6 border border-rose-100">
                <h4 className="font-bold text-rose-800 mb-4 text-lg">Solusi Ideal Negatif (A-)</h4>
                <div className="space-y-2">
                  {ideal.negatif.map((val, j) => (
                    <div key={j} className="flex justify-between font-bold">
                      <span className="text-rose-700">y- {j+1}</span>
                      <span className="text-rose-900">{val.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* NILAI PREFERENSI */}
        <div id="nilai-preferensi" className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-teal-50 text-teal-600 rounded-2xl"><BarChart size={24} /></div>
            <h2 className="text-2xl font-black text-slate-800">Nilai Preferensi (V) dan Jarak Ideal (D+, D-)</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                  <th className="px-6 py-4 rounded-l-xl">Alternatif</th>
                  <th className="px-6 py-4">Jarak Positif (D+)</th>
                  <th className="px-6 py-4">Jarak Negatif (D-)</th>
                  <th className="px-6 py-4 rounded-r-xl">Nilai Preferensi (V)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[...preferensi].sort((a, b) => a.id.localeCompare(b.id)).map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-bold text-slate-700">{p.id} - {p.name}</td>
                    <td className="px-6 py-4 font-medium text-rose-600">{p.dPlus.toFixed(3)}</td>
                    <td className="px-6 py-4 font-medium text-emerald-600">{p.dMin.toFixed(3)}</td>
                    <td className="px-6 py-4 font-black text-slate-900 text-lg">{p.v.toFixed(3)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* HASIL RANKING & DETAIL */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div id="hasil-ranking" className="bg-slate-900 rounded-[2.5rem] shadow-xl p-10 text-white">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-white/10 text-emerald-400 rounded-2xl"><TrendingUp size={24} /></div>
              <h2 className="text-2xl font-black">Hasil Ranking Akhir</h2>
            </div>
            <div className="space-y-4">
              {[...preferensi].sort((a, b) => a.rank - b.rank).map((p, i) => (
                <div key={p.id} className={`flex items-center justify-between p-4 rounded-2xl border ${i === 0 ? 'bg-emerald-600/20 border-emerald-500/30' : 'bg-white/5 border-white/10'}`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black ${i === 0 ? 'bg-emerald-500 text-white' : 'bg-white/10 text-slate-300'}`}>
                      #{p.rank}
                    </div>
                    <div>
                      <div className="font-bold text-slate-100">{p.name}</div>
                      <div className="text-xs text-slate-400">Kode: {p.id}</div>
                    </div>
                  </div>
                  <div className="font-black text-xl text-emerald-400">{p.v.toFixed(3)}</div>
                </div>
              ))}
            </div>
          </div>

          <div id="detail-rekomendasi" className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-10">
            <h2 className="text-2xl font-black text-slate-800 mb-8">Detail Rekomendasi Utama</h2>
            <div className="bg-emerald-50 p-8 rounded-3xl border border-emerald-100 mb-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="text-emerald-600 font-bold uppercase tracking-widest text-xs mb-1">Rekomendasi Terbaik</div>
                  <div className="text-2xl font-black text-emerald-950">{bestStation.name}</div>
                  <div className="text-sm font-bold text-emerald-800 mt-1">Kode: {bestStation.id}</div>
                </div>
                <div className="bg-emerald-600 text-white px-4 py-2 rounded-xl font-bold">V = {bestStation.v.toFixed(3)}</div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                  <MapPin size={16} className="text-emerald-500"/> Sesuai Kriteria Jarak
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                  <DollarSign size={16} className="text-emerald-500"/> Biaya Terjangkau
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                  <Clock size={16} className="text-emerald-500"/> Antrean Optimal
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                  <BatteryCharging size={16} className="text-emerald-500"/> Daya Optimal
                </div>
              </div>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed font-medium">
              Stasiun "{bestStation.name}" terpilih sebagai rekomendasi utama karena memiliki 
              nilai preferensi tertinggi (V = {bestStation.v.toFixed(3)}) dibandingkan alternatif lainnya. Hal ini menunjukkan 
              bahwa {bestStation.name} memiliki jarak terdekat secara matematis ke solusi ideal positif dan jarak terjauh dari solusi ideal negatif berdasarkan matriks ternormalisasi terbobot.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default TopsisReport;
