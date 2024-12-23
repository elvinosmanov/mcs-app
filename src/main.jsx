import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { AlarmProvider } from './contexts/AlarmContext';
import { BrowserRouter } from 'react-router-dom';

const root = document.getElementById('root');

if (!root) {
  console.error('Root element not found');
} else {
  try {
    ReactDOM.createRoot(root).render(
      <React.StrictMode>
        <BrowserRouter>
          <AlarmProvider>
            <App />
          </AlarmProvider>
        </BrowserRouter>
      </React.StrictMode>
    );
  } catch (error) {
    console.error('Error rendering app:', error);
  }
} 