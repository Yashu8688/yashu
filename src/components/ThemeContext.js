import React, { createContext, useContext } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const styles = {
    primary: '#4f46e5',
    background: '#ffffff',
    text: '#111827',
    textSecondary: '#6b7280',
    border: '#d1d5db',
  };

  return (
    <ThemeContext.Provider value={{ styles }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    return {
      styles: {
        primary: '#4f46e5',
        background: '#ffffff',
        text: '#111827',
        textSecondary: '#6b7280',
        border: '#d1d5db',
      }
    };
  }
  return context;
};
