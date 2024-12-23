import React, { useState, useEffect, Fragment } from 'react';
import { 
  ExclamationCircleIcon, 
  BellIcon, 
  BellSlashIcon,
  CheckCircleIcon,
  ClockIcon,
  XMarkIcon,
  ArrowPathIcon,
  FunnelIcon,
  SpeakerWaveIcon
} from '@heroicons/react/24/outline';
import { Menu, Transition } from '@headlessui/react';
import { useAlarms } from '../contexts/AlarmContext';

// Add severity color mapping
const severityColors = {
  critical: 'bg-red-50 border-l-4 border-red-500',
  warning: 'bg-yellow-50 border-l-4 border-yellow-500',
  info: 'bg-blue-50 border-l-4 border-blue-500'
};

export default function Alarms() {
  const { 
    alarms, 
    selectedAlarms, 
    setSelectedAlarms, 
    handleAcknowledge, 
    handleSilence 
  } = useAlarms();
  const [filters, setFilters] = useState({
    severity: 'all',
    status: 'all',
    search: ''
  });
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Auto refresh alarms every 30 seconds
  useEffect(() => {
    if (!autoRefresh) return;
    
    const interval = setInterval(() => {
      // Simulate getting new alarms
      // In real app, fetch from API
    }, 30000);

    return () => clearInterval(interval);
  }, [autoRefresh]);

  const filteredAlarms = alarms.filter(alarm => {
    const matchesSeverity = filters.severity === 'all' || alarm.severity === filters.severity;
    const matchesStatus = filters.status === 'all' ? 
      alarm.status !== 'acknowledged' :
      alarm.status === filters.status;
    const matchesSearch = alarm.deviceName.toLowerCase().includes(filters.search.toLowerCase()) ||
                         alarm.message.toLowerCase().includes(filters.search.toLowerCase());
    return matchesSeverity && matchesStatus && matchesSearch;
  });

  // Add this section for filter options
  const filterOptions = {
    severity: [
      { value: 'all', label: 'All Severities' },
      { value: 'critical', label: 'Critical', color: 'bg-red-100 text-red-800' },
      { value: 'warning', label: 'Warning', color: 'bg-yellow-100 text-yellow-800' },
      { value: 'info', label: 'Info', color: 'bg-blue-100 text-blue-800' }
    ],
    status: [
      { value: 'all', label: 'All Status' },
      { value: 'active', label: 'Active Only', color: 'bg-red-100 text-red-800' },
      { value: 'silenced', label: 'Silenced', color: 'bg-yellow-100 text-yellow-800' },
      { value: 'acknowledged', label: 'Acknowledged', color: 'bg-blue-100 text-blue-800' }
    ]
  };

  // Add bulk actions section
  const handleBulkAction = (action) => {
    if (selectedAlarms.size === 0) return;
    
    if (action === 'acknowledge') {
      handleAcknowledge('selected');
    } else if (action === 'silence') {
      handleSilence('selected');
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header with Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-semibold text-gray-900">Alarms</h1>
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                {filteredAlarms.filter(a => a.status === 'active').length} Active
              </span>
            </div>

            {/* Add Bulk Actions */}
            {selectedAlarms.size > 0 && (
              <div className="flex items-center space-x-2 bg-gray-50 px-3 py-2 rounded-lg">
                <span className="text-sm text-gray-600">
                  {selectedAlarms.size} selected
                </span>
                <button
                  onClick={() => handleBulkAction('acknowledge')}
                  className="flex items-center space-x-1 px-3 py-1 rounded-md bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
                >
                  <CheckCircleIcon className="w-4 h-4" />
                  <span>Acknowledge</span>
                </button>
                <button
                  onClick={() => handleBulkAction('silence')}
                  className="flex items-center space-x-1 px-3 py-1 rounded-md bg-yellow-50 text-yellow-600 hover:bg-yellow-100"
                >
                  <BellSlashIcon className="w-4 h-4" />
                  <span>Silence</span>
                </button>
                <button
                  onClick={() => setSelectedAlarms(new Set())}
                  className="p-1 hover:bg-gray-200 rounded-md"
                  title="Clear Selection"
                >
                  <XMarkIcon className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            )}

            <div className="flex items-center space-x-3">
              {/* Filter Dropdown */}
              <Menu as="div" className="relative">
                <Menu.Button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                  <FunnelIcon className="h-5 w-5 mr-2 text-gray-500" />
                  Filters
                  {(filters.severity !== 'all' || filters.status !== 'all') && (
                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {Object.values(filters).filter(v => v !== 'all').length}
                    </span>
                  )}
                </Menu.Button>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 mt-2 w-72 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 focus:outline-none">
                    {/* Search */}
                    <div className="p-4">
                      <input
                        type="text"
                        placeholder="Search alarms..."
                        value={filters.search}
                        onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    {/* Severity Filter */}
                    <div className="p-4">
                      <h3 className="text-sm font-medium text-gray-900 mb-3">Severity</h3>
                      <div className="space-y-2">
                        {filterOptions.severity.map(option => (
                          <label key={option.value} className="flex items-center">
                            <input
                              type="radio"
                              checked={filters.severity === option.value}
                              onChange={() => setFilters(prev => ({ ...prev, severity: option.value }))}
                              className="rounded-full border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className={`ml-2 text-sm ${option.color || 'text-gray-700'}`}>
                              {option.label}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Status Filter */}
                    <div className="p-4">
                      <h3 className="text-sm font-medium text-gray-900 mb-3">Status</h3>
                      <div className="space-y-2">
                        {filterOptions.status.map(option => (
                          <label key={option.value} className="flex items-center">
                            <input
                              type="radio"
                              checked={filters.status === option.value}
                              onChange={() => setFilters(prev => ({ ...prev, status: option.value }))}
                              className="rounded-full border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className={`ml-2 text-sm ${option.color || 'text-gray-700'}`}>
                              {option.label}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Reset Filters */}
                    <div className="p-4">
                      <button
                        onClick={() => setFilters({
                          severity: 'all',
                          status: 'all',
                          search: ''
                        })}
                        className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md"
                      >
                        Reset Filters
                      </button>
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>

              {/* Keep existing auto-refresh button */}
              <button
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={`p-2 rounded-lg border ${
                  autoRefresh ? 'bg-blue-50 border-blue-200' : 'border-gray-300'
                }`}
                title="Auto Refresh"
              >
                <ArrowPathIcon className={`w-5 h-5 ${
                  autoRefresh ? 'text-blue-600' : 'text-gray-500'
                }`} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Alarms List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 table-fixed">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    checked={selectedAlarms.size === filteredAlarms.length}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedAlarms(new Set(filteredAlarms.map(a => a.id)));
                      } else {
                        setSelectedAlarms(new Set());
                      }
                    }}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Device
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Message
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Value
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAlarms.map((alarm) => (
                <tr 
                  key={alarm.id} 
                  className={`${
                    alarm.status === 'active'
                      ? alarm.severity === 'critical' 
                        ? 'bg-red-100' 
                        : 'bg-yellow-100'
                      : alarm.status === 'silenced'
                      ? 'bg-blue-50'
                      : 'bg-gray-50'
                  } hover:brightness-95 transition-colors`}
                >
                  <td className="px-6 py-4 whitespace-nowrap w-10">
                    <input
                      type="checkbox"
                      checked={selectedAlarms.has(alarm.id)}
                      onChange={(e) => {
                        const newSelected = new Set(selectedAlarms);
                        if (e.target.checked) {
                          newSelected.add(alarm.id);
                        } else {
                          newSelected.delete(alarm.id);
                        }
                        setSelectedAlarms(newSelected);
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap w-32">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      alarm.status === 'active' ? 'bg-red-100 text-red-800' :
                      alarm.status === 'acknowledged' ? 'bg-indigo-100 text-indigo-800' :
                      alarm.status === 'silenced' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {alarm.status.charAt(0).toUpperCase() + alarm.status.slice(1)}
                    </span>
                    <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      alarm.severity === 'critical' ? 'bg-red-100 text-red-800' :
                      alarm.severity === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {alarm.severity.charAt(0).toUpperCase() + alarm.severity.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 w-64">
                    <div className="text-sm font-medium text-gray-900">{alarm.deviceName}</div>
                    <div className="text-sm text-gray-500">{alarm.deviceId}</div>
                  </td>
                  <td className="px-6 py-4 min-w-[300px]">
                    <div className="text-sm text-gray-900 break-words">{alarm.message}</div>
                    <div className="text-xs text-gray-500 mt-1">Threshold: {alarm.threshold}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap w-32 text-sm text-gray-900 font-medium">
                    {alarm.value}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap w-48 text-sm text-gray-500">
                    {new Date(alarm.timestamp).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap w-24">
                    <div className="flex items-center space-x-2">
                      {alarm.status !== 'acknowledged' && (
                        <>
                          <button
                            onClick={() => handleAcknowledge(alarm.id)}
                            className="p-1.5 rounded-lg hover:bg-white text-indigo-600"
                            title="Acknowledge"
                          >
                            <CheckCircleIcon className="w-6 h-6" />
                          </button>
                          <button
                            onClick={() => handleSilence(alarm.id)}
                            className="p-1.5 rounded-lg hover:bg-white text-yellow-600"
                            title={alarm.status === 'active' ? 'Silence' : 'Unsilence'}
                          >
                            {alarm.status === 'active' ? (
                              <BellSlashIcon className="w-6 h-6" />
                            ) : (
                              <SpeakerWaveIcon className="w-6 h-6" />
                            )}
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 