import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Star, LayoutGrid, List, CheckCircle2, XCircle } from 'lucide-react';
import { useBooking } from '../context/BookingContext';
import type { ChargerType } from '../types';

const Catalog: React.FC = () => {
  const { stations } = useBooking();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<ChargerType | 'All'>('All');
  const [onlyAvailable, setOnlyAvailable] = useState(false);

  const filterTypes: (ChargerType | 'All')[] = ['All', 'Ultra Fast', 'Super Fast', 'Fast', 'Regular'];

  const filteredStations = useMemo(() => {
    return stations.filter((station) => {
      const matchesSearch = station.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            station.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = selectedType === 'All' || station.type === selectedType;
      const matchesAvailability = !onlyAvailable || station.slots.available > 0;
      
      return matchesSearch && matchesType && matchesAvailability;
    });
  }, [stations, searchTerm, selectedType, onlyAvailable]);

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Katalog Stasiun <span className="text-emerald-600">Charging</span></h1>
            <p className="text-slate-600 font-medium">Temukan stasiun pengisian daya terdekat di seluruh area Batam.</p>
          </div>
          <div className="bg-white p-2 rounded-2xl flex items-center gap-1 border border-slate-200">
            <button className="p-2 bg-emerald-50 text-emerald-600 rounded-xl"><LayoutGrid size={20} /></button>
            <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-xl transition-colors"><List size={20} /></button>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 mb-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <Search size={22} />
              </div>
              <input
                type="text"
                placeholder="Cari nama stasiun atau lokasi..."
                className="block w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all font-medium"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="lg:col-span-5 flex flex-wrap gap-2">
              {filterTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                    selectedType === type
                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200'
                      : 'bg-slate-50 text-slate-600 hover:bg-emerald-50'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            <div className="lg:col-span-2 flex items-center justify-end">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={onlyAvailable}
                    onChange={() => setOnlyAvailable(!onlyAvailable)}
                  />
                  <div className={`w-12 h-6 rounded-full transition-colors ${onlyAvailable ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                  <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${onlyAvailable ? 'translate-x-6' : ''}`}></div>
                </div>
                <span className="text-sm font-bold text-slate-700">Hanya Tersedia</span>
              </label>
            </div>
          </div>
        </div>

        {/* Results Grid */}
        {filteredStations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredStations.map((station) => (
              <div 
                key={station.id} 
                className="group bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 hover:border-emerald-200 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col"
              >
                {/* Image Section */}
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={station.image} 
                    alt={station.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-xs font-bold text-slate-900 border border-white/20">
                      {station.power}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border border-white/20 backdrop-blur-md ${
                      station.type === 'Ultra Fast' ? 'bg-orange-500/90 text-white' :
                      station.type === 'Super Fast' ? 'bg-emerald-600/90 text-white' :
                      'bg-emerald-500/90 text-white'
                    }`}>
                      {station.type}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1 text-xs font-bold text-slate-900 border border-white/20">
                    <Star className="text-amber-500 fill-current" size={14} />
                    {station.rating}
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-8 flex-1 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">{station.name}</h3>
                      <div className="flex items-center gap-2 text-slate-500 mt-2 font-medium">
                        <MapPin size={16} />
                        <span className="text-sm truncate">{station.location}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {station.connectors.map((c) => (
                        <span key={c} className="px-3 py-1 bg-slate-50 text-slate-600 rounded-lg text-xs font-bold border border-slate-100">
                          {c}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                      <div className="space-y-1">
                        <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Ketersediaan</div>
                        <div className="flex items-center gap-2">
                          {station.slots.available > 0 ? (
                            <CheckCircle2 size={16} className="text-emerald-500" />
                          ) : (
                            <XCircle size={16} className="text-rose-500" />
                          )}
                          <span className={`text-sm font-bold ${station.slots.available > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                            {station.slots.available} / {station.slots.total} Slot Tersedia
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Estimasi Harga</div>
                        <div className="text-lg font-extrabold text-emerald-600">
                           Rp {station.pricePerKwh.toLocaleString()}<span className="text-xs text-slate-400 font-medium">/kWh</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Link 
                    to={`/station/${station.id}`} 
                    className="mt-8 btn-primary text-center block"
                  >
                    Booking Slot
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-[3rem] p-20 text-center shadow-sm border border-slate-100 space-y-6">
            <div className="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto">
              <Search size={48} className="text-slate-300" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900">Stasiun Tidak Ditemukan</h3>
            <p className="text-slate-500 max-w-sm mx-auto font-medium">Cobalah untuk mengubah filter atau kata kunci pencarian Anda.</p>
            <button 
              onClick={() => {setSearchTerm(''); setSelectedType('All'); setOnlyAvailable(false);}} 
              className="text-emerald-600 font-bold hover:underline"
            >
              Reset Semua Filter
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Catalog;
