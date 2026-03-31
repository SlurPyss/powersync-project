// src/pages/MyBookings.tsx
import { useEffect, useState } from "react";
import axios from "axios";

interface Booking {
  id: number;
  name: string;
  email: string;
  phone: string;
  station_id: number;
  connector: string;
  date: string;
  duration: string;
  energy: number;
  price: number;
  notes?: string;
  status: string;
}

export default function MyBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/bookings");
        setBookings(response.data);
      } catch (error) {
        console.error("Gagal mengambil data booking:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) return <p className="p-10">Loading...</p>;

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold text-emerald-600 mb-6">Booking Saya</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {bookings.map((b) => (
          <div key={b.id} className="bg-white shadow rounded p-6">
            <h2 className="text-xl font-semibold">Stasiun #{b.station_id}</h2>
            <p className="text-gray-600">{b.date}</p>
            <p>Durasi: {b.duration}</p>
            <p>Energi: {b.energy} kWh</p>
            <p>Harga: Rp {b.price.toLocaleString("id-ID")}</p>
            <span
              className={`inline-block mt-2 px-3 py-1 rounded text-white ${
                b.status === "Aktif"
                  ? "bg-emerald-600"
                  : b.status === "Selesai"
                  ? "bg-gray-500"
                  : "bg-red-500"
              }`}
            >
              {b.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}