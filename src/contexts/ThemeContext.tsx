
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
    
    // Remove all theme classes first
    document.documentElement.className = document.documentElement.className
      .split(' ')
      .filter(cls => !cls.startsWith('theme-'))
      .join(' ');
    
    // Add the current theme class
    document.documentElement.classList.add(`theme-${theme}`);
    
    // Apply theme-specific CSS variables
    const root = document.documentElement;
    
    switch (theme) {
      case 'dark':
        root.style.setProperty('--background', '222.2 84% 4.9%');
        root.style.setProperty('--foreground', '210 40% 98%');
        root.style.setProperty('--primary', '210 40% 98%');
        root.style.setProperty('--primary-foreground', '222.2 47.4% 11.2%');
        break;
      case 'blue':
        root.style.setProperty('--background', '0 0% 100%');
        root.style.setProperty('--foreground', '222.2 84% 4.9%');
        root.style.setProperty('--primary', '217.2 91.2% 59.8%');
        root.style.setProperty('--primary-foreground', '222.2 84% 4.9%');
        root.style.setProperty('--accent', '217.2 91.2% 95%');
        root.style.setProperty('--accent-foreground', '217.2 91.2% 59.8%');
        break;
      case 'green':
        root.style.setProperty('--background', '0 0% 100%');
        root.style.setProperty('--foreground', '222.2 84% 4.9%');
        root.style.setProperty('--primary', '142.1 76.2% 36.3%');
        root.style.setProperty('--primary-foreground', '355.7 100% 97.3%');
        root.style.setProperty('--accent', '142.1 76.2% 95%');
        root.style.setProperty('--accent-foreground', '142.1 76.2% 36.3%');
        break;
      case 'purple':
        root.style.setProperty('--background', '0 0% 100%');
        root.style.setProperty('--foreground', '222.2 84% 4.9%');
        root.style.setProperty('--primary', '262.1 83.3% 57.8%');
        root.style.setProperty('--primary-foreground', '210 40% 98%');
        root.style.setProperty('--accent', '262.1 83.3% 95%');
        root.style.setProperty('--accent-foreground', '262.1 83.3% 57.8%');
        break;
      default: // light
        root.style.setProperty('--background', '0 0% 100%');
        root.style.setProperty('--foreground', '222.2 84% 4.9%');
        root.style.setProperty('--primary', '222.2 47.4% 11.2%');
        root.style.setProperty('--primary-foreground', '210 40% 98%');
        break;
    }
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
