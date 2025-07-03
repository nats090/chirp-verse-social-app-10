
import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'light' | 'dark' | 'blue' | 'green' | 'purple';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  themes: { value: Theme; label: string; primary: string; secondary: string }[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('app-theme') as Theme;
    return savedTheme || 'light';
  });

  const themes = [
    { value: 'light' as Theme, label: 'Light', primary: 'bg-blue-600', secondary: 'bg-gray-100' },
    { value: 'dark' as Theme, label: 'Dark', primary: 'bg-gray-800', secondary: 'bg-gray-700' },
    { value: 'blue' as Theme, label: 'Ocean Blue', primary: 'bg-blue-700', secondary: 'bg-blue-50' },
    { value: 'green' as Theme, label: 'Forest Green', primary: 'bg-green-600', secondary: 'bg-green-50' },
    { value: 'purple' as Theme, label: 'Royal Purple', primary: 'bg-purple-600', secondary: 'bg-purple-50' },
  ];

  useEffect(() => {
    localStorage.setItem('app-theme', theme);
    
    // Apply theme classes to document
    document.documentElement.className = '';
    document.documentElement.classList.add(`theme-${theme}`);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
