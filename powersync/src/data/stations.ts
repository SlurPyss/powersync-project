// src/data/stations.ts
export interface Station {
    id: number;
    name: string;
    location: string;
    type: string;
    connectors: string[];
    slots: { available: number; total: number };
    pricePerKWh: number;
    facilities: string[];
    hours: string;
    rating: number;
    image: string;
  }
  
  export const stations: Station[] = [
    {
      id: 1,
      name: "PowerSync Senayan",
      location: "Jakarta Pusat",
      type: "Ultra Fast (350kW)",
      connectors: ["CCS", "CHAdeMO"],
      slots: { available: 3, total: 6 },
      pricePerKWh: 4000,
      facilities: ["Parking", "Cafe", "WiFi", "Restroom", "Security"],
      hours: "24 Jam",
      rating: 4.7,
      image: "https://source.unsplash.com/600x400/?charging,station",
    },
    {
      id: 2,
      name: "PowerSync Kelapa Gading",
      location: "Jakarta Utara",
      type: "Super Fast (150kW)",
      connectors: ["CCS", "Type 2"],
      slots: { available: 2, total: 4 },
      pricePerKWh: 3000,
      facilities: ["Parking", "WiFi", "Restroom"],
      hours: "06:00 - 23:00",
      rating: 4.5,
      image: "https://source.unsplash.com/600x400/?ev,charging",
    },
    // tambahkan 4 stasiun lain...
  ];