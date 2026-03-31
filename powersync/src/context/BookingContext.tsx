import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Station, Booking } from '../types';
import { mockStations } from '../data/mockData';

interface BookingContextType {
  stations: Station[];
  bookings: Booking[];
  addBooking: (booking: Booking) => void;
  updateBookingStatus: (bookingId: string, status: Booking['status']) => void;
  deleteBooking: (bookingId: string) => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stations] = useState<Station[]>(mockStations);
  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('fleet-charge-bookings');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('fleet-charge-bookings', JSON.stringify(bookings));
  }, [bookings]);

  const addBooking = (booking: Booking) => {
    setBookings((prev) => [booking, ...prev]);
  };

  const updateBookingStatus = (bookingId: string, status: Booking['status']) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status } : b))
    );
  };

  const deleteBooking = (bookingId: string) => {
    setBookings((prev) => prev.filter((b) => b.id !== bookingId));
  };

  return (
    <BookingContext.Provider
      value={{ stations, bookings, addBooking, updateBookingStatus, deleteBooking }}
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
