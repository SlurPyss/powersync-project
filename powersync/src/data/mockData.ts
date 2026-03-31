import type { Station } from '../types';

export const mockStations: Station[] = [
  {
    id: 'st-01',
    name: 'PowerSync Nagoya Hill',
    location: 'Jl. Teuku Umar, Lubuk Baja, Batam',
    type: 'Ultra Fast',
    power: '350kW',
    connectors: ['CCS2', 'CHAdeMO'],
    slots: { available: 2, total: 4 },
    pricePerKwh: 3850,
    facilities: ['Parking', 'Cafe', 'WiFi', 'Restroom', 'Mall Access'],
    operatingHours: '08:00 - 22:00',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1593941707874-ef25b8b4a92b?auto=format&fit=crop&q=80&w=1000'
  },
  {
    id: 'st-02',
    name: 'PowerSync Batam Centre',
    location: 'Mega Mall Batam Centre, Engku Putri',
    type: 'Super Fast',
    power: '150kW',
    connectors: ['CCS2', 'Type 2'],
    slots: { available: 1, total: 3 },
    pricePerKwh: 2450,
    facilities: ['Parking', 'Security', 'WiFi', 'Cinema'],
    operatingHours: '10:00 - 21:00',
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1593941707874-ef25b8b4a92b?auto=format&fit=crop&q=80&w=1000'
  },
  {
    id: 'st-03',
    name: 'PowerSync Harbour Bay',
    location: 'Batu Ampar, Ferry Terminal Area',
    type: 'Fast',
    power: '50kW',
    connectors: ['CCS2', 'CHAdeMO', 'Type 2'],
    slots: { available: 4, total: 6 },
    pricePerKwh: 1800,
    facilities: ['Parking', 'Seafood Restaurant', 'Ferry Access', 'Security'],
    operatingHours: '24 Hours',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1593941707874-ef25b8b4a92b?auto=format&fit=crop&q=80&w=1000'
  },
  {
    id: 'st-04',
    name: 'PowerSync Grand Batam',
    location: 'Penuin, Lubuk Baja, Batam',
    type: 'Ultra Fast',
    power: '350kW',
    connectors: ['CCS2', 'GB/T'],
    slots: { available: 0, total: 4 },
    pricePerKwh: 4000,
    facilities: ['Premium Parking', 'Cafe', 'WiFi', 'Restroom', 'Supermarket'],
    operatingHours: '10:00 - 22:00',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1593941707874-ef25b8b4a92b?auto=format&fit=crop&q=80&w=1000'
  },
  {
    id: 'st-05',
    name: 'PowerSync BCS Mall',
    location: 'Jl. Bunga Raya, Baloi, Batam',
    type: 'Regular',
    power: '22kW',
    connectors: ['Type 2'],
    slots: { available: 3, total: 8 },
    pricePerKwh: 1650,
    facilities: ['Parking', 'Restroom', 'Food Court'],
    operatingHours: '10:00 - 21:00',
    rating: 4.3,
    image: 'https://images.unsplash.com/photo-1593941707874-ef25b8b4a92b?auto=format&fit=crop&q=80&w=1000'
  },
  {
    id: 'st-06',
    name: 'PowerSync Kepri Mall',
    location: 'Simpang Kabil, Batam Centre',
    type: 'Super Fast',
    power: '150kW',
    connectors: ['CCS2', 'CHAdeMO'],
    slots: { available: 2, total: 4 },
    pricePerKwh: 2500,
    facilities: ['Parking', 'WiFi', 'Cafe', 'Restroom'],
    operatingHours: '10:00 - 22:00',
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1593941707874-ef25b8b4a92b?auto=format&fit=crop&q=80&w=1000'
  }
];
