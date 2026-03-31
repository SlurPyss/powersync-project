// src/pages/Dashboard.tsx
import { useState, useEffect } from "react";
import axios from "axios";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/bookings/stats");
        setStats(response.data);
      } catch (error) {
        console.error("Gagal ambil data stats:", error);
      }
    };
    fetchStats();
  }, []);

  if (!stats) return <p className="p-10">Loading dashboard...</p>;

  // Data untuk grafik
  const lineData = stats.dailyBookings.map((d: any) => ({
    day: d.date,
    bookings: d.count,
  }));

  const barData = stats.dailyBookings.map((d: any) => ({
    day: d.date,
    energy: d.count * 10, // contoh: bisa diganti sesuai data real
  }));

  const areaData = stats.dailyBookings.map((d: any) => ({
    day: d.date,
    revenue: d.count * 25000, // contoh: bisa diganti sesuai data real
  }));

  const pieData = stats.dailyBookings.map((d: any) => ({
    day: d.date,
    bookings: d.count,
  }));

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-6">Dashboard Booking</h1>

      {/* Ringkasan */}
      <div className="grid grid-cols-3 gap-6 mb-10">
        <div className="bg-blue-100 p-4 rounded">
          <p className="text-lg font-semibold">Total Booking</p>
          <p className="text-2xl">{stats.totalBookings}</p>
        </div>
        <div className="bg-green-100 p-4 rounded">
          <p className="text-lg font-semibold">Total Energi</p>
          <p className="text-2xl">{stats.totalEnergy} kWh</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded">
          <p className="text-lg font-semibold">Total Revenue</p>
          <p className="text-2xl">Rp {stats.totalRevenue.toLocaleString()}</p>
        </div>
      </div>

      {/* Grafik Line */}
      <div className="bg-white shadow rounded p-6 mb-10">
        <h2 className="text-xl font-semibold mb-4">Booking per Hari</h2>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={lineData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="bookings" stroke="#10b981" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Grafik Bar */}
      <div className="bg-white shadow rounded p-6 mb-10">
        <h2 className="text-xl font-semibold mb-4">Energi (kWh)</h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={barData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="energy" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Grafik Area */}
      <div className="bg-white shadow rounded p-6 mb-10">
        <h2 className="text-xl font-semibold mb-4">Revenue</h2>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={areaData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="revenue" stroke="#f59e0b" fill="#fcd34d" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Grafik Pie */}
      <div className="bg-white shadow rounded p-6">
        <h2 className="text-xl font-semibold mb-4">Distribusi Booking</h2>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie data={pieData} dataKey="bookings" nameKey="day" outerRadius={100} fill="#10b981">
              {pieData.map((_: any, index: number) => (
                <Cell key={index} fill={["#10b981", "#3b82f6", "#f59e0b"][index % 3]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}