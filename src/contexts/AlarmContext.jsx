import React, { createContext, useContext, useState } from 'react';
import { initialAlarms } from '../data/alarmData'; // Move initial data to separate file

const AlarmContext = createContext();

export function AlarmProvider({ children }) {
  const [alarms, setAlarms] = useState(initialAlarms);
  const [selectedAlarms, setSelectedAlarms] = useState(new Set());

  const handleAcknowledge = (alarmId) => {
    setAlarms(prev => prev.filter(alarm => {
      if (alarm.id === alarmId || (alarmId === 'selected' && selectedAlarms.has(alarm.id))) {
        return false;
      }
      return true;
    }));
    setSelectedAlarms(new Set());
  };

  const handleSilence = (alarmId, duration = 3600000) => {
    setAlarms(prev => prev.map(alarm => {
      if (alarm.id === alarmId || (alarmId === 'selected' && selectedAlarms.has(alarm.id))) {
        return {
          ...alarm,
          status: 'silenced',
          silencedUntil: new Date(Date.now() + duration).toISOString()
        };
      }
      return alarm;
    }));
    setSelectedAlarms(new Set());
  };

  return (
    <AlarmContext.Provider value={{
      alarms,
      setAlarms,
      selectedAlarms,
      setSelectedAlarms,
      handleAcknowledge,
      handleSilence
    }}>
      {children}
    </AlarmContext.Provider>
  );
}

export function useAlarms() {
  const context = useContext(AlarmContext);
  if (!context) {
    throw new Error('useAlarms must be used within an AlarmProvider');
  }
  return context;
} 