import React, { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

interface MapProps {
  center: [number, number]; // [lng, lat]
  zoom: number;
  stations: Array<{
    id: string;
    name: string;
    latitude: number;
    longitude: number;
    type: string;
  }>;
  selectedStationId?: string;
  onSelectStation?: (id: string) => void;
  userCoords?: { latitude: number; longitude: number } | null;
}

export const Map: React.FC<MapProps> = ({
  center,
  zoom,
  stations,
  selectedStationId,
  onSelectStation,
  userCoords
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<{ [key: string]: maplibregl.Marker }>({});
  const userMarkerRef = useRef<maplibregl.Marker | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Use CARTO Positron Light GL style mapbasemap
    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
      center: center,
      zoom: zoom,
      attributionControl: false
    });

    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update Station Markers
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Clear existing markers
    Object.values(markersRef.current).forEach(marker => marker.remove());
    markersRef.current = {};

    // Create markers for stations
    stations.forEach(station => {
      if (!station.latitude || !station.longitude) return;

      const el = document.createElement('div');
      const isSelected = station.id === selectedStationId;
      
      el.className = `w-8 h-8 rounded-full border-2 flex items-center justify-center cursor-pointer transition-all shadow-md ${
        isSelected
          ? 'bg-emerald-600 border-white scale-125 z-30 shadow-emerald-500/50'
          : 'bg-slate-800 border-slate-600 hover:border-emerald-500 hover:scale-105 z-10'
      }`;
      el.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="text-white fill-white"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
      `;

      el.addEventListener('click', () => {
        if (onSelectStation) {
          onSelectStation(station.id);
        }
      });

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([station.longitude, station.latitude])
        .setPopup(
          new maplibregl.Popup({ offset: 15, closeButton: false })
            .setHTML(`
              <div style="font-family: sans-serif; font-size: 11px; padding: 4px 8px; color: #1e293b; font-weight: bold;">
                ${station.name}
              </div>
            `)
        )
        .addTo(map);

      markersRef.current[station.id] = marker;
    });
  }, [stations, selectedStationId, onSelectStation]);

  // Update User Geolocation Marker
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (userMarkerRef.current) {
      userMarkerRef.current.remove();
      userMarkerRef.current = null;
    }

    if (userCoords && userCoords.latitude && userCoords.longitude) {
      const el = document.createElement('div');
      el.className = 'w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center shadow-lg relative z-25';
      el.innerHTML = `
        <span class="absolute inline-flex h-full w-full rounded-full bg-emerald-400/40 animate-ping"></span>
        <div class="w-3.5 h-3.5 rounded-full bg-emerald-600 border-2 border-white shadow-sm"></div>
      `;

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([userCoords.longitude, userCoords.latitude])
        .setPopup(
          new maplibregl.Popup({ offset: 12, closeButton: false })
            .setHTML('<div style="font-family: sans-serif; font-size: 11px; padding: 4px; font-weight: bold; color: #065f46;">Lokasi Anda</div>')
        )
        .addTo(map);

      userMarkerRef.current = marker;
    }
  }, [userCoords]);

  // Fly to Selected Station or User Coords smoothly
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (selectedStationId) {
      const selected = stations.find(s => s.id === selectedStationId);
      if (selected && selected.latitude && selected.longitude) {
        map.flyTo({
          center: [selected.longitude, selected.latitude],
          zoom: 14,
          speed: 1.0,
          curve: 1
        });
        // Open popup
        setTimeout(() => {
          markersRef.current[selectedStationId]?.togglePopup();
        }, 300);
      }
    }
  }, [selectedStationId, stations]);

  return (
    <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-xl border border-slate-200">
      <div ref={mapContainerRef} className="w-full h-full min-h-[350px] bg-slate-50" />
    </div>
  );
};
