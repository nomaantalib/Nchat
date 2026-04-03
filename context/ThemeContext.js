import React, { createContext, useState, useContext } from 'react';

const themes = {
  telegram: {
    primary: '#0088cc',
    primaryDark: '#006699',
    secondary: '#31b545',
    background: '#f0f2f5',
    headerBg: '#ffffff',
    textDark: '#1a1a1a',
    textLight: '#65676b',
    border: '#e4e6eb',
  },
  whatsapp: {
    primary: '#25D366',
    primaryDark: '#128C7E',
    secondary: '#075e54',
    background: '#e5ded8',
    headerBg: '#075e54',
    textDark: '#ffffff',
    textLight: '#dcf8c5',
    border: '#075e54',
  },
  dark: {
    primary: '#8774e1',
    primaryDark: '#6b5b9c',
    secondary: '#2a2a2a',
    background: '#1a1a1a',
    headerBg: '#2d2d2d',
    textDark: '#ffffff',
    textLight: '#b0b0b0',
    border: '#3d3d3d',
  },
};

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState('telegram');

  const switchTheme = (themeName) => {
    if (themes[themeName]) {
      setCurrentTheme(themeName);
    }
  };

  return (
    <ThemeContext.Provider value={{ themeName: currentTheme, theme: themes[currentTheme], switchTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
