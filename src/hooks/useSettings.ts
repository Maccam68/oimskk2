import { useState, useEffect } from 'react';
import { AppSettings, defaultSettings } from '../types/settings';

function useSettings(): [AppSettings, (settings: AppSettings) => void] {
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const stored = localStorage.getItem('appSettings');
      return stored ? { ...defaultSettings, ...JSON.parse(stored) } : defaultSettings;
    } catch (error) {
      console.warn('Error reading settings:', error);
      return defaultSettings;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('appSettings', JSON.stringify(settings));
    } catch (error) {
      console.warn('Error saving settings:', error);
    }
  }, [settings]);

  return [settings, setSettings];
}

export default useSettings;