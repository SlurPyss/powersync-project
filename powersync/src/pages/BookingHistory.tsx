import { useState, useEffect } from "react";
import axios from "axios";

export default function BookingHistory() {
  const [bookings, setBookings] = useState<any[]>([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8001/api/bookings");
        setBookings(response.data);
      } catch (error) {
        console.error("Gagal ambil data booking:", error);
      }
    };
    fetchBookings();
  }, []);

  if (!bookings.length) return <p className="p-10">Belum ada booking...</p>;

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-6">Riwayat Booking</h1>
      <table className="min-w-full border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2">Nama</th>
            <th className="border px-4 py-2">Email</th>
            <th className="border px-4 py-2">Telepon</th>
            <th className="border px-4 py-2">Energi (kWh)</th>
            <th className="border px-4 py-2">Durasi (menit)</th>
            <th className="border px-4 py-2">Harga</th>
            <th className="border px-4 py-2">Status</th>
            <th className="border px-4 py-2">Waktu</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b, i) => (
            <tr key={i} className="text-center">
              <td className="border px-4 py-2">{b.name}</td>
              <td className="border px-4 py-2">{b.email}</td>
              <td className="border px-4 py-2">{b.phone}</td>
              <td className="border px-4 py-2">{b.energy}</td>
              <td className="border px-4 py-2">{b.duration}</td>
              <td className="border px-4 py-2">Rp {b.price.toLocaleString()}</td>
              <td className="border px-4 py-2">{b.status}</td>
              <td className="border px-4 py-2">
                {new Date(b.time).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}