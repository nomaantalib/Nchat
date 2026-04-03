import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const userJSON = await AsyncStorage.getItem('user');
        if (userJSON) {
          setCurrentUser(JSON.parse(userJSON));
        }
      } catch (error) {
        console.error('Error reading user session:', error);
      } finally {
        setIsLoading(false);
      }
    };
    checkLogin();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      await AsyncStorage.setItem('user', JSON.stringify(response.data));
      setCurrentUser(response.data);
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Invalid credentials';
      return { success: false, error: message };
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await api.post('/auth/register', { name, email, password });
      await AsyncStorage.setItem('user', JSON.stringify(response.data));
      setCurrentUser(response.data);
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      return { success: false, error: message };
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('user');
      setCurrentUser(null);
    } catch (error) {
      console.error('Error clearing user session:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
