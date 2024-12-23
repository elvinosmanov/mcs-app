import React, { createContext, useContext, useState, useEffect } from 'react';

const SettingsContext = createContext(null);

const defaultSettings = {
  alarmPanel: {
    defaultExpanded: false,
    autoCollapse: true,
    collapseAfter: 5,
    showTimeAgo: true,
    maxVisibleAlarms: 50,
  },
  notifications: {
    soundEnabled: true,
    soundVolume: 80,
    criticalAlarmSound: true,
    browserNotifications: true,
  },
  display: {
    density: 'compact',
    theme: 'light',
    dateFormat: '24h',
  },
  data: {
    refreshInterval: 30,
    autoRefresh: true,
  },
  colors: {
    primary: '#4F46E5',    // Default indigo
    secondary: '#A855F7',  // Default purple
  }
};

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(() => {
    try {
      const savedSettings = localStorage.getItem('appSettings');
      return savedSettings ? JSON.parse(savedSettings) : defaultSettings;
    } catch (error) {
      console.error('Error loading settings:', error);
      return defaultSettings;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('appSettings', JSON.stringify(settings));
      
      // Apply colors as CSS variables
      document.documentElement.style.setProperty('--primary', settings.colors?.primary || '#4F46E5');
      document.documentElement.style.setProperty('--secondary', settings.colors?.secondary || '#A855F7');
      
      // Apply theme
      if (settings.display.theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      
      // Apply density
      if (settings.display.density === 'comfortable') {
        document.documentElement.classList.add('comfortable');
      } else {
        document.documentElement.classList.remove('comfortable');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  }, [settings]);

  useEffect(() => {
    if (settings.notifications.browserNotifications) {
      Notification.requestPermission().catch(error => {
        console.error('Error requesting notification permission:', error);
      });
    }
  }, [settings.notifications.browserNotifications]);

  const updateSettings = (category, key, value) => {
    console.log('Updating settings:', category, key, value); // Debug log
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };

  const value = {
    settings,
    updateSettings
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
} 