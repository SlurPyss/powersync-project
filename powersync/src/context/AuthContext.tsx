import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  vehicle_type?: string;
  plate_number?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, userData: User) => void;
  logout: () => Promise<void>;
  updateUser: (userData: User) => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('powersync_auth_token'));
  const [isLoading, setIsLoading] = useState(true);

  const API_BASE_URL = 'http://127.0.0.1:8001/api';

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          const response = await axios.get(`${API_BASE_URL}/user`);
          setUser(response.data);
        } catch (error) {
          console.error('Session expired or invalid token');
          localStorage.removeItem('powersync_auth_token');
          setToken(null);
          setUser(null);
          delete axios.defaults.headers.common['Authorization'];
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, [token]);

  const login = (newToken: string, userData: User) => {
    localStorage.setItem('powersync_auth_token', newToken);
    setToken(newToken);
    setUser(userData);
    axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
  };

  const updateUser = (userData: User) => {
    setUser(userData);
  };

  const logout = async () => {
    try {
      if (token) {
        await axios.post(`${API_BASE_URL}/logout`);
      }
    } catch (error) {
      console.error('Logout failed on server');
    } finally {
      localStorage.removeItem('powersync_auth_token');
      setToken(null);
      setUser(null);
      delete axios.defaults.headers.common['Authorization'];
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, updateUser, isAuthenticated: !!token && !!user, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
