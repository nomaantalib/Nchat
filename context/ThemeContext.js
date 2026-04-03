import React, { createContext, useState, useContext } from 'react';
import { useColorScheme } from 'react-native';

const ThemeContext = createContext();

const themes = {
  light: {
    primary: '#00BCD4',        // Cyan primary
    secondary: '#0097A7',      // Deeper cyan
    background: '#FFF9F0',     // Soft cream pastel background
    headerBg: '#FFF5E6',       // Warm pastel cream header
    textDark: '#2C2C3A',       // Near black
    textLight: '#A89F91',      // Warm muted text
    border: '#F0E8DC',         // Pastel cream border
    sentMsg: '#00BCD4',        // Cyan sent bubble
    receivedMsg: '#FFF5E6',    // Cream pastel received bubble
    isDark: false,
  },
  dark: {
    primary: '#00E5FF',        // Vivid electric cyan
    secondary: '#00B8D9',      // Rich teal cyan
    background: '#0A0E14',     // Deep dark navy
    headerBg: '#111620',       // Slightly lighter header
    textDark: '#F5F0E8',       // Cream off-white text
    textLight: '#6B7280',      // Cool grey
    border: '#1E2430',         // Subtle dark border
    sentMsg: '#00E5FF',        // Cyan sent bubble
    receivedMsg: '#161D2A',    // Dark navy received bubble
    isDark: true,
  }
};

export const ThemeProvider = ({ children }) => {
  const systemScheme = useColorScheme();
  const [themeMode, setThemeMode] = useState('system'); // 'system', 'light', 'dark'

  const getActiveThemeName = () => {
    if (themeMode === 'system') return systemScheme === 'dark' ? 'dark' : 'light';
    return themeMode;
  };

  const activeTheme = themes[getActiveThemeName()];

  return (
    <ThemeContext.Provider value={{ theme: activeTheme, themeMode, setThemeMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
