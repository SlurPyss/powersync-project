import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Star, CheckCircle2, XCircle } from 'lucide-react';
import { useBooking } from '../context/BookingContext';
import type { ChargerType } from '../types';

const Catalog: React.FC = () => {
  const { 
    stations, 
    userCoords, 
    isGpsActive, 
    gpsError, 
    requestUserLocation, 
    resetLocation 
  } = useBooking();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<ChargerType | 'All'>('All');
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [loadingGps, setLoadingGps] = useState(false);
  const [sortBy, setSortBy] = useState<'default' | 'nearest'>('default');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Sync sorting setting with GPS activity
  useEffect(() => {
    if (isGpsActive || userCoords) {
      setSortBy('nearest');
    } else {
      setSortBy('default');
    }
  }, [isGpsActive, userCoords]);

  const filterTypes: (ChargerType | 'All')[] = ['All', 'Ultra Fast', 'Super Fast', 'Fast', 'Regular'];

  const filteredStations = useMemo(() => {
    return stations.filter((station) => {
      const matchesSearch = station.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            station.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            (station.area && station.area.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesType = selectedType === 'All' || station.type === selectedType;
      const matchesAvailability = !onlyAvailable || station.slots.available > 0;
      
      return matchesSearch && matchesType && matchesAvailability;
    });
  }, [stations, searchTerm, selectedType, onlyAvailable]);

  // Sort by nearest distance if set
  const sortedStations = useMemo(() => {
    const list = [...filteredStations];
    if (sortBy === 'nearest') {
      return list.sort((a, b) => (a.distance || 999) - (b.distance || 999));
    }
    return list;
  }, [filteredStations, sortBy]);

  return (
    <div className="bg-slate-50 min-h-screen py-12 text-slate-900 font-sans">
      <div className="container mx-auto px-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12 border-b border-slate-200/60 pb-6">
          <div className="space-y-3">
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Katalog Stasiun <span className="text-emerald-600">Charging</span></h1>
            <p className="text-slate-600 font-medium">Temukan stasiun pengisian daya terdekat di seluruh area Batam.</p>
          </div>
          
          {/* GPS control button widget */}
          <div className="flex flex-col items-start md:items-end gap-1.5 w-full md:w-auto bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="flex gap-2 items-center w-full justify-between md:justify-end">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Pencarian Jarak</span>
              <div className="flex gap-2">
                {isGpsActive ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-bold rounded-xl shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                    GPS Aktif
                  </span>
                ) : userCoords ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-800 border border-amber-200 text-[11px] font-bold rounded-xl shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    Lokasi Default
                  </span>
                ) : null}

                {isGpsActive || userCoords ? (
                  <button 
                    onClick={resetLocation}
                    className="px-3 py-1.5 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors cursor-pointer"
                  >
                    Reset
                  </button>
                ) : (
                  <button 
                    onClick={async () => {
                      setLoadingGps(true);
                      await requestUserLocation();
                      setLoadingGps(false);
                    }}
                    disabled={loadingGps}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 shadow-md shadow-emerald-100 hover:scale-[1.02] cursor-pointer disabled:opacity-50"
                  >
                    <MapPin size={14} className={loadingGps ? 'animate-bounce' : ''} />
                    {loadingGps ? 'Mencari GPS...' : 'Gunakan Lokasi Saya'}
                  </button>
                )}
              </div>
            </div>
            
            {gpsError && (
              <p className="text-[10px] text-amber-600 font-bold text-left md:text-right leading-none mt-1 max-w-[280px]">
                {gpsError}
              </p>
            )}
          </div>
        </div>

        {/* Filters & Search */}
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 mb-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Search bar */}
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

            {/* Type selector */}
            <div className="lg:col-span-5 flex flex-wrap gap-2">
              {filterTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                    selectedType === type
                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200'
                      : 'bg-slate-50 text-slate-600 hover:bg-emerald-50'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            {/* Availability filter */}
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
        {sortedStations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedStations.map((station) => (
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
                      <h3 className="text-2xl font-black text-slate-900 group-hover:text-emerald-600 transition-colors">{station.name}</h3>
                      <div className="flex flex-col gap-1.5 mt-2">
                        <div className="flex items-center gap-2 text-slate-500 font-medium">
                          <MapPin size={16} />
                          <span className="text-sm truncate">{station.location}</span>
                        </div>
                        
                        {/* Haversine distance indicator */}
                        {station.distance !== null && station.distance !== undefined ? (
                          <div className="inline-flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100 font-extrabold w-fit">
                            <MapPin size={12} className="text-emerald-600" />
                            Jarak dari lokasimu: {station.distance.toFixed(1)} km
                          </div>
                        ) : (
                          <p className="text-xs text-slate-400 italic">
                            Aktifkan lokasi untuk melihat jarak
                          </p>
                        )}
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
                            {station.slots.available} / {station.slots.total} Slot
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
                    className="mt-8 btn-primary text-center block shadow-lg shadow-emerald-100"
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
