import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Stations from "../pages/Stations";
import StationDetail from "../pages/StationDetail";
import MyBookings from "../pages/MyBookings";
import Dashboard from "../pages/Dashboard";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Halaman Beranda */}
        <Route path="/" element={<Home />} />

        {/* Katalog Stasiun */}
        <Route path="/stations" element={<Stations />} />

        {/* Detail Stasiun */}
        <Route path="/stations/:id" element={<StationDetail />} />

        {/* Booking Saya */}
        <Route path="/bookings" element={<MyBookings />} />

        {/* Dashboard Analytics */}
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}