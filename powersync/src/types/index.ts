export type ChargerType = 'Ultra Fast' | 'Super Fast' | 'Fast' | 'Regular';

export interface Station {
  id: string;
  name: string;
  location: string;
  type: ChargerType;
  power: string;
  connectors: string[];
  slots: {
    available: number;
    total: number;
  };
  pricePerKwh: number;
  facilities: string[];
  operatingHours: string;
  rating: number;
  image: string;
}

export type BookingStatus = 'pending' | 'accepted' | 'ready' | 'occupied' | 'completed' | 'cancelled';

export interface Booking {
  id: string;
  stationId: string;
  stationName: string;
  slotId?: string;
  slotNumber?: string;
  customerName: string;
  email: string;
  phone: string;
  vehicleType?: string;
  plateNumber?: string;
  connectorType: string;
  startDate: string;
  startTime: string;
  endTime: string;
  checkInTime?: string;
  duration: number; // in minutes
  status: BookingStatus;
  notes?: string;
  createdAt: string;
}
