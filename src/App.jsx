import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { SettingsProvider } from './contexts/SettingsContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Telemetry from './pages/Telemetry';
import Alarms from './pages/Alarms';
import Events from './pages/Events';
import Settings from './pages/Settings';
import ControlSystem from './pages/ControlSystem';
import About from './pages/About';
import StationEditor from './pages/StationEditor';

function App() {
  return (
    <SettingsProvider>
      <Routes>
        <Route path="/station-editor/:stationId" element={<StationEditor />} />
        <Route path="/project/:projectId/station/:stationId/editor" element={<StationEditor />} />
        
        <Route path="/" element={<Layout />}>
          <Route index element={<ControlSystem />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="telemetry" element={<Telemetry />} />
          <Route path="alarms" element={<Alarms />} />
          <Route path="events" element={<Events />} />
          <Route path="settings" element={<Settings />} />
          <Route path="about" element={<About />} />
        </Route>
      </Routes>
    </SettingsProvider>
  );
}

export default App; 