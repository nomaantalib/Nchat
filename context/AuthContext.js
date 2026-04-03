import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
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
    // Simulated backend validation
    if (email && password) {
      const user = { name: email.split('@')[0] || 'User', email };
      await AsyncStorage.setItem('user', JSON.stringify(user));
      setCurrentUser(user);
      return { success: true };
    }
    return { success: false, error: 'Invalid email or password' };
  };

  const register = async (name, email, password) => {
    // Simulated registration
    if (name && email && password) {
      const user = { name, email };
      await AsyncStorage.setItem('user', JSON.stringify(user));
      setCurrentUser(user);
      return { success: true };
    }
    return { success: false, error: 'Please fill in all fields' };
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
