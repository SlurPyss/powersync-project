import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { BookingProvider } from './context/BookingContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import Detail from './pages/Detail';
import MyBookings from './pages/MyBookings';
import Dashboard from './pages/Dashboard';

const App: React.FC = () => {
  return (
    <BookingProvider>
      <Router>
        <div className="flex flex-col min-h-screen font-sans antialiased text-slate-900 bg-white">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/catalog" element={<Catalog />} />
              <Route path="/station/:id" element={<Detail />} />
              <Route path="/my-bookings" element={<MyBookings />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </BookingProvider>
  );
};

export default App;
