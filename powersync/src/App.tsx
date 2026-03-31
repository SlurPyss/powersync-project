import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { BookingProvider } from './context/BookingContext';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import Detail from './pages/Detail';
import MyBookings from './pages/MyBookings';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <BookingProvider>
        <Router>
          <div className="flex flex-col min-h-screen font-sans antialiased text-slate-900 bg-white">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/catalog" element={<Catalog />} />
                <Route path="/station/:id" element={<Detail />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/my-bookings" element={<ProtectedRoute><MyBookings /></ProtectedRoute>} />
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </BookingProvider>
    </AuthProvider>
  );
};

export default App;
