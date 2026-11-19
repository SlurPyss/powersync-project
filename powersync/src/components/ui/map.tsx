import React, { useEffect, useRef, useState, useCallback } from 'react';
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
    power?: string;
    availableSlots?: number;
    totalSlots?: number;
    pricePerKwh?: number;
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
  const [mapInstance, setMapInstance] = useState<maplibregl.Map | null>(null);

  const markersRef = useRef<{ 
    [key: string]: { 
      marker: maplibregl.Marker; 
      inner: HTMLDivElement;
    } 
  }>({});
  const activePopupRef = useRef<maplibregl.Popup | null>(null);
  const userMarkerRef = useRef<maplibregl.Marker | null>(null);
  const prevSelectedIdRef = useRef<string | null>(null);

  // Helper to build popup HTML
  const buildPopupHtml = useCallback((station: MapProps['stations'][0]) => {
    const available = station.availableSlots ?? 1;
    const total = station.totalSlots ?? 2;

    return `
      <div style="font-family: inherit; font-size: 12px; color: #0f172a; min-width: 185px;">
        <div style="font-weight: 800; font-size: 13px; color: #0f172a; margin-bottom: 2px; padding-right: 16px; line-height: 1.3;">
          ${station.name}
        </div>
        <div style="font-size: 10px; color: #64748b; margin-bottom: 8px; font-weight: 600;">
          ${station.power || ''} • ${station.type}
        </div>
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px;">
          <span style="font-size: 10px; font-weight: 800; color: ${available > 0 ? '#059669' : '#e11d48'}; background: ${available > 0 ? '#ecfdf5' : '#fff1f2'}; padding: 3px 8px; border: 1px solid ${available > 0 ? '#a7f3d0' : '#fecdd3'}; border-radius: 6px;">
            ● ${available}/${total} Slot
          </span>
          ${station.pricePerKwh ? `<span style="font-size: 11px; font-weight: 800; color: #047857;">Rp ${station.pricePerKwh.toLocaleString()}/kWh</span>` : ''}
        </div>
        <a href="/station/${station.id}" style="display: block; width: 100%; text-align: center; background: #059669; color: white; padding: 7px 0; border-radius: 10px; font-weight: 700; font-size: 11px; text-decoration: none; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
          Booking Slot →
        </a>
      </div>
    `;
  }, []);

  // Helper to show single popup
  const showPopup = useCallback((stationId: string) => {
    if (!mapInstance) return;

    const station = stations.find(s => s.id === stationId);
    if (!station || !station.latitude || !station.longitude) return;

    // Remove any previously open popup to guarantee no stacking
    if (activePopupRef.current) {
      activePopupRef.current.remove();
      activePopupRef.current = null;
    }

    const popup = new maplibregl.Popup({
      offset: 18,
      closeButton: true,
      closeOnClick: true,
      focusAfterOpen: false
    })
      .setLngLat([station.longitude, station.latitude])
      .setHTML(buildPopupHtml(station))
      .addTo(mapInstance);

    popup.on('close', () => {
      if (activePopupRef.current === popup) {
        activePopupRef.current = null;
      }
    });

    activePopupRef.current = popup;
  }, [mapInstance, stations, buildPopupHtml]);

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
    setMapInstance(map);

    return () => {
      if (activePopupRef.current) {
        activePopupRef.current.remove();
        activePopupRef.current = null;
      }
      Object.values(markersRef.current).forEach(({ marker }) => {
        marker.remove();
      });
      markersRef.current = {};

      if (userMarkerRef.current) {
        userMarkerRef.current.remove();
        userMarkerRef.current = null;
      }
      prevSelectedIdRef.current = null;

      map.remove();
      setMapInstance(null);
    };
  }, []);

  // Helper to build inner marker classes
  const getMarkerClass = (isSelected: boolean, isAvailable: boolean) => {
    return `w-8 h-8 rounded-full border-2 flex items-center justify-center shadow-md transition-transform duration-200 ease-out origin-center pointer-events-auto ${
      isSelected
        ? 'bg-emerald-600 border-white scale-125 shadow-emerald-500/50 ring-2 ring-emerald-400'
        : isAvailable
          ? 'bg-slate-900 border-emerald-400 hover:border-emerald-300 hover:scale-110'
          : 'bg-rose-950 border-rose-400 hover:border-rose-300 hover:scale-110'
    }`;
  };

  // Manage Station Markers
  useEffect(() => {
    if (!mapInstance) return;

    const currentIds = new Set(stations.map(s => s.id));

    // Remove obsolete markers
    Object.keys(markersRef.current).forEach(id => {
      if (!currentIds.has(id)) {
        markersRef.current[id].marker.remove();
        delete markersRef.current[id];
      }
    });

    // If active popup's station was filtered out, remove it
    if (selectedStationId && !currentIds.has(selectedStationId) && activePopupRef.current) {
      activePopupRef.current.remove();
      activePopupRef.current = null;
    }

    // Create or update markers
    stations.forEach(station => {
      if (!station.latitude || !station.longitude) return;

      const isSelected = station.id === selectedStationId;
      const available = station.availableSlots ?? 1;
      const isAvailable = available > 0;

      if (markersRef.current[station.id]) {
        // Update existing marker style
        const { inner, marker } = markersRef.current[station.id];
        inner.className = getMarkerClass(isSelected, isAvailable);
        inner.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="${isAvailable ? 'text-emerald-400 fill-emerald-400' : 'text-rose-400 fill-rose-400'}"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
        `;
        marker.setLngLat([station.longitude, station.latitude]);
      } else {
        // Outer anchor container (free from CSS transform)
        const el = document.createElement('div');
        el.style.width = '36px';
        el.style.height = '36px';
        el.style.display = 'flex';
        el.style.alignItems = 'center';
        el.style.justifyContent = 'center';
        el.style.cursor = 'pointer';

        // Inner visual container
        const inner = document.createElement('div');
        inner.className = getMarkerClass(isSelected, isAvailable);
        inner.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="${isAvailable ? 'text-emerald-400 fill-emerald-400' : 'text-rose-400 fill-rose-400'}"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
        `;
        el.appendChild(inner);

        el.addEventListener('click', (e) => {
          e.stopPropagation();
          if (onSelectStation) {
            onSelectStation(station.id);
          }
          showPopup(station.id);
        });

        const marker = new maplibregl.Marker({ element: el })
          .setLngLat([station.longitude, station.latitude])
          .addTo(mapInstance);

        markersRef.current[station.id] = { marker, inner };
      }
    });
  }, [mapInstance, stations, selectedStationId, onSelectStation, showPopup]);

  // Update User Geolocation Marker
  useEffect(() => {
    if (!mapInstance) return;

    if (userMarkerRef.current) {
      userMarkerRef.current.remove();
      userMarkerRef.current = null;
    }

    if (userCoords && userCoords.latitude && userCoords.longitude) {
      const el = document.createElement('div');
      el.style.width = '24px';
      el.style.height = '24px';
      el.style.display = 'flex';
      el.style.alignItems = 'center';
      el.style.justifyContent = 'center';

      const inner = document.createElement('div');
      inner.className = 'w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center shadow-lg relative';
      inner.innerHTML = `
        <span class="absolute inline-flex h-full w-full rounded-full bg-emerald-400/40 animate-ping"></span>
        <div class="w-3.5 h-3.5 rounded-full bg-emerald-600 border-2 border-white shadow-sm"></div>
      `;
      el.appendChild(inner);

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([userCoords.longitude, userCoords.latitude])
        .setPopup(
          new maplibregl.Popup({ offset: 12, closeButton: false, focusAfterOpen: false })
            .setHTML('<div style="font-family: sans-serif; font-size: 11px; padding: 4px; font-weight: bold; color: #065f46;">Lokasi Anda</div>')
        )
        .addTo(mapInstance);

      userMarkerRef.current = marker;
    }
  }, [mapInstance, userCoords]);

  // Smooth Pan & Single Popup when Selection Changes
  useEffect(() => {
    if (!mapInstance || !selectedStationId) return;

    const selected = stations.find(s => s.id === selectedStationId);
    if (!selected || !selected.latitude || !selected.longitude) return;

    if (prevSelectedIdRef.current === selectedStationId) {
      // Station didn't change, but station data updated (e.g. live polling)
      if (activePopupRef.current && activePopupRef.current.isOpen()) {
        activePopupRef.current.setHTML(buildPopupHtml(selected));
      }
      return;
    }

    prevSelectedIdRef.current = selectedStationId;

    // Smooth pan to newly selected station
    mapInstance.easeTo({
      center: [selected.longitude, selected.latitude],
      duration: 450
    });

    // Display exclusively one popup for the selected station
    showPopup(selectedStationId);
  }, [mapInstance, selectedStationId, stations, showPopup, buildPopupHtml]);

  return (
    <div className="relative w-full h-full min-h-[450px] rounded-3xl overflow-hidden shadow-xl border border-slate-200">
      <div ref={mapContainerRef} className="w-full h-full min-h-[450px] bg-slate-50" />
    </div>
  );
};
