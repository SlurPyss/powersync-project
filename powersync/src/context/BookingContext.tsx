import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import type { Station, Booking, ChargerType, BookingStatus } from '../types';
import { mockStations } from '../data/mockData';
import { useAuth } from './AuthContext';
import { calculateDistance } from '../utils/distance';

export const DEFAULT_USER_LOCATION = {
  latitude: 1.1265,
  longitude: 104.0539,
  label: "Batam Centre Default Location"
};

interface BookingContextType {
  stations: Station[];
  bookings: Booking[];
  addBooking: (booking: any) => Promise<void>;
  updateBookingStatus: (bookingId: string, status: Booking['status']) => Promise<void>;
  deleteBooking: (bookingId: string) => Promise<void>;
  isLoading: boolean;
  checkIn: (bookingId: string) => Promise<any>;
  finishCharging: (bookingId: string) => Promise<any>;
  refreshBookings: () => Promise<void>;
  userCoords: { latitude: number; longitude: number } | null;
  isGpsActive: boolean;
  gpsError: string | null;
  requestUserLocation: () => Promise<boolean>;
  resetLocation: () => void;
  refreshStations: () => Promise<void>;
  lastUpdated: Date | null;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

const DEFAULT_STATION_IMAGE = 'https://images.unsplash.com/photo-1593941707874-ef25b8b4a92b?auto=format&fit=crop&q=80&w=1000';

const parseList = (val: any): string[] => {
  if (!val) return [];
  if (Array.isArray(val)) return val.map(String).map(s => s.trim()).filter(Boolean);
  if (typeof val === 'string') {
    const trimmed = val.trim();
    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) {
          return parsed.map(String).map(s => s.trim()).filter(Boolean);
        }
      } catch {
        // continue
      }
    }
    return trimmed
      .replace(/[\[\]"']/g, '')
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);
  }
  return [];
};

const getStationCoordinates = (stationName: string = '', locationStr: string = '') => {
  const text = `${stationName} ${locationStr}`.toLowerCase();
  
  if (text.includes('nagoya')) {
    return { latitude: 1.1437, longitude: 104.0152, address: 'Jl. Teuku Umar, Lubuk Baja, Batam', area: 'Nagoya Hill / Lubuk Baja' };
  }
  if (text.includes('batam centre') || text.includes('mega mall') || text.includes('engku putri')) {
    return { latitude: 1.1278, longitude: 104.0531, address: 'Mega Mall Batam Centre, Engku Putri', area: 'Batam Centre' };
  }
  if (text.includes('harbour') || text.includes('batu ampar')) {
    return { latitude: 1.1512, longitude: 104.0125, address: 'Batu Ampar, Ferry Terminal Area, Batam', area: 'Harbour Bay / Batu Ampar' };
  }
  if (text.includes('grand batam') || text.includes('penuin')) {
    return { latitude: 1.1309, longitude: 104.0108, address: 'Grand Batam Mall, Penuin', area: 'Grand Batam Mall / Penuin' };
  }
  if (text.includes('bcs') || text.includes('baloi')) {
    return { latitude: 1.1306, longitude: 104.0028, address: 'Jl. Bunga Raya, Baloi, Batam', area: 'BCS Mall / Baloi' };
  }
  if (text.includes('kepri') || text.includes('kabil')) {
    return { latitude: 1.1098, longitude: 104.0384, address: 'Kepri Mall, Simpang Kabil', area: 'Kepri Mall / Simpang Kabil' };
  }

  return { latitude: 1.1301, longitude: 104.0529, address: locationStr || 'Batam Centre', area: 'Batam' };
};

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, token } = useAuth();
  const [stations, setStations] = useState<Station[]>(mockStations);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Geolocation States
  const [userCoords, setUserCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [isGpsActive, setIsGpsActive] = useState<boolean>(false);
  const [gpsError, setGpsError] = useState<string | null>(null);

  const API_BASE_URL = 'http://127.0.0.1:8001/api';

  const refreshBookings = async () => {
    if (!isAuthenticated || !token) {
      setBookings([]);
      return;
    }

    try {
      const response = await axios.get(`${API_BASE_URL}/bookings`);
      if (response.data) {
        const mappedBookings: Booking[] = response.data.map((b: any) => ({
          id: b.id.toString(),
          stationId: b.station_id.toString(),
          stationName: b.station?.name || 'Unknown Station',
          slotId: b.slot_id?.toString(),
          slotNumber: b.slot?.slot_number,
          customerName: b.name,
          email: b.email,
          phone: b.phone,
          vehicleType: b.vehicle_type || 'EV Controller',
          plateNumber: b.plate_number || 'B 1234 PS',
          connectorType: b.connector,
          startDate: b.date,
          startTime: b.start_time,
          endTime: b.end_time,
          checkInTime: b.check_in_time,
          duration: b.duration,
          status: b.status as BookingStatus,
          notes: b.notes,
          createdAt: b.created_at,
        }));
        setBookings(mappedBookings);
      }
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
    }
  };

  const [lastUpdated, setLastUpdated] = useState<Date | null>(new Date());

  const fetchStations = async (silent: boolean = false) => {
    if (!silent) setIsLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/stations`);
      if (response.data && response.data.length > 0) {
        const mappedStations: Station[] = response.data.map((s: any) => {
          const coords = getStationCoordinates(s.name, s.location);
          const lat = s.latitude ? Number(s.latitude) : coords.latitude;
          const lon = s.longitude ? Number(s.longitude) : coords.longitude;
          const dist = userCoords
            ? parseFloat(calculateDistance(userCoords.latitude, userCoords.longitude, lat, lon).toFixed(2))
            : null;

          return {
            id: s.id.toString(),
            name: s.name,
            location: s.location || coords.address,
            type: s.type as ChargerType,
            power: s.power || '150kW',
            connectors: parseList(s.connectors),
            slots: {
              available: s.available_slots ?? 0,
              total: s.capacity ?? 2,
            },
            pricePerKwh: s.price_per_kwh ?? 2500,
            facilities: parseList(s.facilities),
            operatingHours: s.operating_hours || '24/7',
            rating: s.rating ?? 4.8,
            image: s.image && s.image.trim() !== '' ? s.image : DEFAULT_STATION_IMAGE,
            address: s.address || coords.address,
            area: s.area || coords.area,
            latitude: lat,
            longitude: lon,
            distance: dist,
          };
        });
        setStations(mappedStations);
        setLastUpdated(new Date());
      }
    } catch (error) {
      console.warn('Backend API not ready, using mock data:', error);
    } finally {
      if (!silent) setIsLoading(false);
    }
  };

  const refreshStations = async () => {
    await fetchStations(false);
  };

  // Real-time polling: initial fetch & poll every 10 seconds
  useEffect(() => {
    fetchStations();

    const interval = setInterval(() => {
      fetchStations(true);
    }, 10000);

    return () => clearInterval(interval);
  }, [userCoords]);

  // Fetch bookings when auth changes
  useEffect(() => {
    refreshBookings();
  }, [isAuthenticated, token]);

  const addBooking = async (bookingData: any) => {
    if (!isAuthenticated) return;
    
    try {
      const backendPayload = {
        name: bookingData.customerName,
        email: bookingData.email,
        phone: bookingData.phone,
        vehicle_type: bookingData.vehicleType,
        plate_number: bookingData.plateNumber,
        connector: bookingData.connectorType,
        date: bookingData.startDate,
        start_time: bookingData.startTime,
        duration: bookingData.duration,
        notes: bookingData.notes,
      };

      await axios.post(`${API_BASE_URL}/stations/${bookingData.stationId}/book`, backendPayload);
      await refreshBookings(); // Reload list to get fresh data from DB
    } catch (error) {
      console.error('Booking failed:', error);
      throw error;
    }
  };

  const updateBookingStatus = async (bookingId: string, status: Booking['status']) => {
    try {
      await axios.put(`${API_BASE_URL}/bookings/${bookingId}/status`, { status });
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status } : b))
      );
    } catch (error) {
      console.error('Failed to update booking status:', error);
    }
  };

  const checkIn = async (bookingId: string) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/bookings/${bookingId}/check-in`);
      await refreshBookings();
      return response.data;
    } catch (error) {
      console.error('Failed to check in:', error);
      throw error;
    }
  };

  const finishCharging = async (bookingId: string) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/bookings/${bookingId}/finish`);
      await refreshBookings();
      return response.data;
    } catch (error) {
      console.error('Failed to finish charging:', error);
      throw error;
    }
  };

  const deleteBooking = async (bookingId: string) => {
    try {
      await axios.delete(`${API_BASE_URL}/bookings/${bookingId}`);
      setBookings((prev) => prev.filter((b) => b.id !== bookingId));
    } catch (error) {
      console.error('Failed to delete booking:', error);
    }
  };

  // Geolocation Handler
  const requestUserLocation = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        setGpsError('Browser Anda tidak mendukung fitur lokasi.');
        setUserCoords(DEFAULT_USER_LOCATION);
        setIsGpsActive(false);
        resolve(false);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          };
          setUserCoords(coords);
          setIsGpsActive(true);
          setGpsError(null);
          resolve(true);
        },
        (error) => {
          console.warn('GPS access denied or failed:', error);
          setGpsError('Akses lokasi ditolak. Sistem menggunakan lokasi default Batam Centre.');
          setUserCoords(DEFAULT_USER_LOCATION);
          setIsGpsActive(false);
          resolve(false);
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    });
  };

  const resetLocation = () => {
    setUserCoords(null);
    setIsGpsActive(false);
    setGpsError(null);
    // Restore default mock stations distances to null
    setStations((prev) => prev.map(s => ({ ...s, distance: null })));
  };

  // Recalculate distances on userCoords changes
  useEffect(() => {
    if (userCoords) {
      setStations((prevStations) =>
        prevStations.map((station) => {
          const lat = station.latitude || 0;
          const lon = station.longitude || 0;
          const dist = calculateDistance(userCoords.latitude, userCoords.longitude, lat, lon);
          return { ...station, distance: parseFloat(dist.toFixed(2)) };
        })
      );
    }
  }, [userCoords]);

  return (
    <BookingContext.Provider
      value={{ 
        stations, bookings, addBooking, updateBookingStatus, deleteBooking, isLoading, checkIn, finishCharging, refreshBookings,
        userCoords, isGpsActive, gpsError, requestUserLocation, resetLocation, refreshStations, lastUpdated
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};
