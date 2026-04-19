import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import type { Station, Booking, ChargerType, BookingStatus } from '../types';
import { mockStations } from '../data/mockData';
import { useAuth } from './AuthContext';

interface BookingContextType {
  stations: Station[];
  bookings: Booking[];
  addBooking: (booking: any) => Promise<void>;
  updateBookingStatus: (bookingId: string, status: Booking['status']) => Promise<void>;
  deleteBooking: (bookingId: string) => Promise<void>;
  isLoading: boolean;
  checkIn: (bookingId: string) => Promise<any>;
  refreshBookings: () => Promise<void>;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, token } = useAuth();
  const [stations, setStations] = useState<Station[]>(mockStations);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  // Fetch stations
  useEffect(() => {
    const fetchStations = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/stations`);
        if (response.data && response.data.length > 0) {
          const mappedStations: Station[] = response.data.map((s: any) => ({
            id: s.id.toString(),
            name: s.name,
            location: s.location,
            type: s.type as ChargerType,
            power: s.power,
            connectors: s.connectors ? s.connectors.split(', ') : [],
            slots: {
              available: s.available_slots,
              total: s.capacity,
            },
            pricePerKwh: s.price_per_kwh,
            facilities: s.facilities ? s.facilities.split(', ') : [],
            operatingHours: s.operating_hours,
            rating: s.rating,
            image: s.image,
          }));
          setStations(mappedStations);
        }
      } catch (error) {
        console.warn('Backend API not ready, using mock data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStations();
  }, []);

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

  const deleteBooking = async (bookingId: string) => {
    try {
      await axios.delete(`${API_BASE_URL}/bookings/${bookingId}`);
      setBookings((prev) => prev.filter((b) => b.id !== bookingId));
    } catch (error) {
      console.error('Failed to delete booking:', error);
    }
  };

  return (
    <BookingContext.Provider
      value={{ stations, bookings, addBooking, updateBookingStatus, deleteBooking, isLoading, checkIn, refreshBookings }}
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
