import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function StationDetail() {
  const { id } = useParams();
  const [station, setStation] = useState<any>(null);
  const [price, setPrice] = useState<number>(0);
  const ratePerKwh = 2500; // tarif per kWh (ubah sesuai kebutuhan)

  useEffect(() => {
    const fetchStation = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8001/api/stations/${id}`
        );
        setStation(response.data);
      } catch (error) {
        console.error("Gagal ambil data stasiun:", error);
      }
    };
    fetchStation();
  }, [id]);

  const handleEnergyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const energy = parseInt(e.target.value) || 0;
    setPrice(energy * ratePerKwh);
  };

  const handleBooking = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const bookingData = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      time: formData.get("time"),
      duration: formData.get("duration"),
      energy: formData.get("energy"),
      connector: formData.get("connector"),
      notes: formData.get("notes"),
      price: price, // harga otomatis
      status: "pending", // default
    };

    try {
      const response = await axios.post(
        `http://127.0.0.1:8001/api/stations/${id}/book`,
        bookingData
      );
      alert("Booking berhasil: " + JSON.stringify(response.data));
      form.reset(); // reset form
      setPrice(0);  // reset harga
    } catch (error: any) {
      if (error.response) {
        alert("Error: " + JSON.stringify(error.response.data));
      } else if (error.request) {
        alert("Tidak ada response dari server");
      } else {
        alert("Terjadi kesalahan di frontend: " + error.message);
      }
    }
  };

  if (!station) return <p className="p-10">Loading...</p>;

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-4">{station.name}</h1>
      <p>Lokasi: {station.location}</p>
      <p>Kapasitas: {station.capacity} kWh</p>
      <p>Connectors: {station.connectors}</p>

      <form onSubmit={handleBooking} className="mt-6 space-y-4">
        <input type="text" name="name" placeholder="Nama" required />
        <input type="email" name="email" placeholder="Email" required />
        <input type="text" name="phone" placeholder="Telepon" required />
        <input type="datetime-local" name="time" required />
        <input type="number" name="duration" placeholder="Durasi (menit)" required />
        <input
          type="number"
          name="energy"
          placeholder="Energi (kWh)"
          required
          onChange={handleEnergyChange}
        />
        <p className="font-semibold">Harga otomatis: Rp {price.toLocaleString()}</p>
        <select name="connector">
          {station.connectors.split(",").map((c: string, i: number) => (
            <option key={i} value={c.trim()}>{c.trim()}</option>
          ))}
        </select>
        <textarea name="notes" placeholder="Catatan opsional"></textarea>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Book
        </button>
      </form>
    </div>
  );
}