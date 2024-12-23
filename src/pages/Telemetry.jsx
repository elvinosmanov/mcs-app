import React, { useState, useEffect } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

// Sample data generator
const generateData = (hours) => {
  const data = [];
  const now = new Date();
  for (let i = hours * 12; i >= 0; i--) {
    data.push({
      time: new Date(now - i * 5 * 60000).toLocaleTimeString(),
      temperature: Math.random() * 30 + 20,
      pressure: Math.random() * 100 + 900,
      humidity: Math.random() * 40 + 30,
    });
  }
  return data;
};

export default function Telemetry() {
  const [filters, setFilters] = useState({
    project: 'All Projects',
    device: 'All Devices',
    parameter: 'All Parameters',
    severity: 'All Severities',
    startDate: '',
    endDate: '',
    timeRange: '1h'
  });

  const [chartData, setChartData] = useState([]);

  // Time range options
  const timeRanges = [
    { value: '5m', label: 'Last 5 minutes' },
    { value: '30m', label: 'Last 30 minutes' },
    { value: '1h', label: 'Last 1 hour' },
    { value: '6h', label: 'Last 6 hours' },
    { value: '12h', label: 'Last 12 hours' },
    { value: '24h', label: 'Last 24 hours' },
    { value: '48h', label: 'Last 48 hours' }
  ];

  // Update chart data when time range changes
  useEffect(() => {
    const hours = parseInt(filters.timeRange.replace(/[mh]/g, '')) / (filters.timeRange.includes('m') ? 60 : 1);
    setChartData(generateData(hours));
  }, [filters.timeRange]);

  return (
    <div className="p-4">
      <div className="bg-white rounded-lg shadow">
        <div className="p-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
            {/* Project Filter */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Project</label>
              <div className="relative">
                <select
                  value={filters.project}
                  onChange={(e) => setFilters(prev => ({ ...prev, project: e.target.value }))}
                  className="block w-full pl-2 pr-8 py-1.5 text-sm border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
                >
                  <option>All Projects</option>
                  <option>Project A</option>
                  <option>Project B</option>
                </select>
                <ChevronDownIcon className="pointer-events-none absolute right-2 top-2 h-4 w-4 text-gray-400" />
              </div>
            </div>

            {/* Device Filter */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Device</label>
              <div className="relative">
                <select
                  value={filters.device}
                  onChange={(e) => setFilters(prev => ({ ...prev, device: e.target.value }))}
                  className="block w-full pl-2 pr-8 py-1.5 text-sm border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
                >
                  <option>All Devices</option>
                  <option>Temperature Sensor</option>
                  <option>Pressure Sensor</option>
                </select>
                <ChevronDownIcon className="pointer-events-none absolute right-2 top-2 h-4 w-4 text-gray-400" />
              </div>
            </div>

            {/* Parameter Type Filter */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Parameter</label>
              <div className="relative">
                <select
                  value={filters.parameter}
                  onChange={(e) => setFilters(prev => ({ ...prev, parameter: e.target.value }))}
                  className="block w-full pl-2 pr-8 py-1.5 text-sm border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
                >
                  <option>All Types</option>
                  <option>Temperature</option>
                  <option>Pressure</option>
                  <option>Humidity</option>
                </select>
                <ChevronDownIcon className="pointer-events-none absolute right-2 top-2 h-4 w-4 text-gray-400" />
              </div>
            </div>

            {/* Severity Filter */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Severity</label>
              <div className="relative">
                <select
                  value={filters.severity}
                  onChange={(e) => setFilters(prev => ({ ...prev, severity: e.target.value }))}
                  className="block w-full pl-2 pr-8 py-1.5 text-sm border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
                >
                  <option>All Severities</option>
                  <option>Critical</option>
                  <option>Warning</option>
                  <option>Normal</option>
                </select>
                <ChevronDownIcon className="pointer-events-none absolute right-2 top-2 h-4 w-4 text-gray-400" />
              </div>
            </div>

            {/* Time Range Filter */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Time Range</label>
              <div className="relative">
                <select
                  value={filters.timeRange}
                  onChange={(e) => setFilters(prev => ({ ...prev, timeRange: e.target.value }))}
                  className="block w-full pl-2 pr-8 py-1.5 text-sm border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
                >
                  {timeRanges.map(range => (
                    <option key={range.value} value={range.value}>
                      {range.label}
                    </option>
                  ))}
                </select>
                <ChevronDownIcon className="pointer-events-none absolute right-2 top-2 h-4 w-4 text-gray-400" />
              </div>
            </div>

            {/* Start Date */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Start Date</label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
                className="block w-full pl-2 pr-2 py-1.5 text-sm border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
              />
            </div>

            {/* End Date */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">End Date</label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
                className="block w-full pl-2 pr-2 py-1.5 text-sm border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="mt-6 bg-white rounded-lg shadow">
        <div className="p-6">
          <h2 className="text-lg font-medium mb-6">Telemetry Data</h2>
          
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="time"
                  tick={{ fontSize: 12 }}
                  interval="preserveStartEnd"
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    padding: '10px'
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="temperature"
                  stroke="#ff7300"
                  name="Temperature (°C)"
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="pressure"
                  stroke="#00bcd4"
                  name="Pressure (kPa)"
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="humidity"
                  stroke="#4caf50"
                  name="Humidity (%)"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Chart Legend/Stats */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            {['temperature', 'pressure', 'humidity'].map(param => {
              const values = chartData.map(d => d[param]);
              const avg = values.reduce((a, b) => a + b, 0) / values.length;
              const min = Math.min(...values);
              const max = Math.max(...values);

              return (
                <div key={param} className="p-4 border rounded-lg">
                  <h3 className="text-sm font-medium text-gray-700 capitalize">{param}</h3>
                  <div className="mt-2 grid grid-cols-3 gap-2 text-sm">
                    <div>
                      <div className="text-gray-500">Avg</div>
                      <div className="font-medium">{avg.toFixed(1)}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Min</div>
                      <div className="font-medium">{min.toFixed(1)}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Max</div>
                      <div className="font-medium">{max.toFixed(1)}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
} 