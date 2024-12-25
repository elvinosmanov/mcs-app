import React, { useState, useCallback } from "react";
import { format, formatInTimeZone } from "date-fns";
import { CSVLink } from "react-csv";
import {
    ChevronLeftIcon,
    ChevronRightIcon,
    ChevronUpIcon,
    ChevronDownIcon,
    DocumentIcon,
    XMarkIcon,
} from "@heroicons/react/24/solid";

export default function Events() {
    const [filters, setFilters] = useState({
        project: "",
        device: "",
        eventType: "",
        severity: "",
        dateRange: {
            start: "",
            end: "",
        },
        search: "",
    });

    // Sample data
    const [events] = useState([
        {
            id: 1,
            timestamp: new Date(2024, 1, 15, 14, 30),
            project: "Production Line A",
            device: "Temperature Sensor 1",
            eventType: "Alarm",
            description: "High Temperature Alert",
            severity: "Critical",
            value: "95°C",
            status: "Resolved",
        },
        {
            id: 2,
            timestamp: new Date(2024, 1, 15, 13, 45),
            project: "Production Line B",
            device: "Pressure Sensor 2",
            eventType: "Warning",
            description: "Low Pressure Warning",
            severity: "Warning",
            value: "0.5 bar",
            status: "Acknowledged",
        },
        {
            id: 13,
            timestamp: new Date(2024, 1, 14, 16, 45),
            project: "Production Line A",
            device: "Temperature Sensor 1",
            eventType: "Alarm",
            description: "Temperature Sensor Malfunction",
            severity: "Critical",
            value: "Error",
            status: "Acknowledged",
        },
        {
            id: 14,
            timestamp: new Date(2024, 1, 14, 15, 30),
            project: "Production Line B",
            device: "Pressure Sensor 2",
            eventType: "Warning",
            description: "Pressure Sensor Battery Low",
            severity: "Warning",
            value: "15% Battery",
            status: "Acknowledged",
        },
        {
            id: 15,
            timestamp: new Date(2024, 1, 14, 14, 20),
            project: "Assembly Line C",
            device: "Flow Meter 1",
            eventType: "System Event",
            description: "Scheduled Maintenance Started",
            severity: "Info",
            value: "N/A",
            status: "Resolved",
        },
        {
            id: 16,
            timestamp: new Date(2024, 1, 14, 13, 15),
            project: "Production Line A",
            device: "Temperature Sensor 1",
            eventType: "Information",
            description: "Daily Calibration Check",
            severity: "Info",
            value: "Pass",
            status: "Resolved",
        },
        {
            id: 17,
            timestamp: new Date(2024, 1, 14, 12, 45),
            project: "Production Line B",
            device: "Pressure Sensor 2",
            eventType: "Alarm",
            description: "Rapid Pressure Drop",
            severity: "Critical",
            value: "0.1 bar",
            status: "Resolved",
        },
        {
            id: 18,
            timestamp: new Date(2024, 1, 14, 11, 30),
            project: "Assembly Line C",
            device: "Flow Meter 1",
            eventType: "Warning",
            description: "Flow Rate Unstable",
            severity: "Warning",
            value: "3.7 L/min",
            status: "Acknowledged",
        },
        {
            id: 19,
            timestamp: new Date(2024, 1, 14, 10, 15),
            project: "Production Line A",
            device: "Temperature Sensor 1",
            eventType: "System Event",
            description: "Network Connection Lost",
            severity: "Critical",
            value: "Offline",
            status: "Resolved",
        },
        {
            id: 20,
            timestamp: new Date(2024, 1, 14, 9, 45),
            project: "Production Line B",
            device: "Pressure Sensor 2",
            eventType: "Information",
            description: "Sensor Self-Test Complete",
            severity: "Info",
            value: "OK",
            status: "Resolved",
        },
        {
            id: 21,
            timestamp: new Date(2024, 1, 14, 8, 30),
            project: "Assembly Line C",
            device: "Flow Meter 1",
            eventType: "Alarm",
            description: "Flow Direction Reversed",
            severity: "Critical",
            value: "-1.2 L/min",
            status: "Acknowledged",
        },
        {
            id: 22,
            timestamp: new Date(2024, 1, 14, 7, 15),
            project: "Production Line A",
            device: "Temperature Sensor 1",
            eventType: "Warning",
            description: "Temperature Fluctuation",
            severity: "Warning",
            value: "82°C ±5°C",
            status: "Resolved",
        },
        {
            id: 23,
            timestamp: new Date(2024, 1, 14, 6, 45),
            project: "Production Line B",
            device: "Pressure Sensor 2",
            eventType: "System Event",
            description: "Automatic Backup Complete",
            severity: "Info",
            value: "2.5 MB",
            status: "Resolved",
        },
        {
            id: 24,
            timestamp: new Date(2024, 1, 14, 5, 30),
            project: "Assembly Line C",
            device: "Flow Meter 1",
            eventType: "Information",
            description: "Flow Rate Optimization",
            severity: "Info",
            value: "2.8 L/min",
            status: "Resolved",
        },
        {
            id: 25,
            timestamp: new Date(2024, 1, 14, 4, 15),
            project: "Production Line A",
            device: "Temperature Sensor 1",
            eventType: "Alarm",
            description: "Emergency Shutdown Initiated",
            severity: "Critical",
            value: "105°C",
            status: "Acknowledged",
        },
        {
            id: 26,
            timestamp: new Date(2024, 1, 14, 3, 45),
            project: "Production Line B",
            device: "Pressure Sensor 2",
            eventType: "Warning",
            description: "Pressure Trending High",
            severity: "Warning",
            value: "8.7 bar",
            status: "Acknowledged",
        },
        {
            id: 27,
            timestamp: new Date(2024, 1, 14, 2, 30),
            project: "Assembly Line C",
            device: "Flow Meter 1",
            eventType: "System Event",
            description: "System Restart Required",
            severity: "Warning",
            value: "Pending",
            status: "Acknowledged",
        },
    ]);

    const projects = [
        "Production Line A",
        "Production Line B",
        "Assembly Line C",
    ];
    const devices = [
        "Temperature Sensor 1",
        "Pressure Sensor 2",
        "Flow Meter 1",
    ];
    const eventTypes = ["Alarm", "Warning", "Information", "System Event"];
    const severityLevels = ["Critical", "Warning", "Info"];

    // New state for pagination and sorting
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [sortConfig, setSortConfig] = useState({
        key: "timestamp",
        direction: "desc",
    });
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [activeTab, setActiveTab] = useState('details');

    const getSeverityColor = (severity) => {
        switch (severity.toLowerCase()) {
            case "critical":
                return "bg-red-100 text-red-800";
            case "warning":
                return "bg-yellow-100 text-yellow-800";
            case "info":
                return "bg-blue-100 text-blue-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case "resolved":
                return "bg-green-100 text-green-800";
            case "acknowledged":
                return "bg-blue-100 text-blue-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const filteredEvents = events.filter((event) => {
        const matchesProject = filters.project
            ? event.project === filters.project
            : true;
        const matchesDevice = filters.device
            ? event.device === filters.device
            : true;
        const matchesEventType = filters.eventType
            ? event.eventType === filters.eventType
            : true;
        const matchesSeverity = filters.severity
            ? event.severity === filters.severity
            : true;
        const matchesSearch = filters.search
            ? event.description
                  .toLowerCase()
                  .includes(filters.search.toLowerCase()) ||
              event.device.toLowerCase().includes(filters.search.toLowerCase())
            : true;

        const inDateRange =
            filters.dateRange.start && filters.dateRange.end
                ? new Date(event.timestamp) >=
                      new Date(filters.dateRange.start) &&
                  new Date(event.timestamp) <= new Date(filters.dateRange.end)
                : true;

        return (
            matchesProject &&
            matchesDevice &&
            matchesEventType &&
            matchesSeverity &&
            matchesSearch &&
            inDateRange
        );
    });

    // Sorting function
    const sortedEvents = [...filteredEvents].sort((a, b) => {
        if (!a[sortConfig.key] || !b[sortConfig.key]) return 0;

        const aValue =
            a[sortConfig.key] instanceof Date
                ? a[sortConfig.key].getTime()
                : a[sortConfig.key];
        const bValue =
            b[sortConfig.key] instanceof Date
                ? b[sortConfig.key].getTime()
                : b[sortConfig.key];

        if (sortConfig.direction === "asc") {
            return aValue > bValue ? 1 : -1;
        }
        return aValue < bValue ? 1 : -1;
    });

    // Pagination calculation
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = sortedEvents.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(sortedEvents.length / itemsPerPage);

    // Sorting handler
    const requestSort = (key) => {
        let direction = "asc";
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key, direction });
    };

    // Export data preparation
    const exportData = sortedEvents.map((event) => ({
        Timestamp: format(event.timestamp, "yyyy-MM-dd HH:mm:ss"),
        Project: event.project,
        Device: event.device,
        "Event Type": event.eventType,
        Description: event.description,
        Severity: event.severity,
        Value: event.value,
        Status: event.status,
    }));

    // Event Detail Modal
    const EventDetailModal = () => {
        if (!selectedEvent) return null;

        return (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium">Event Details</h3>
                        <button
                            onClick={() => setShowDetailModal(false)}
                            className="text-gray-400 hover:text-gray-500"
                        >
                            <XMarkIcon className="h-5 w-5" />
                        </button>
                    </div>
                    <div className="space-y-4">
                        <div className="border-b border-gray-200 mb-4">
                            <nav className="-mb-px flex">
                                <button
                                    onClick={() => setActiveTab('details')}
                                    className={`${
                                        activeTab === 'details'
                                            ? 'border-blue-500 text-blue-600'
                                            : 'border-transparent text-gray-500'
                                    } py-2 px-4 border-b-2`}
                                >
                                    Details
                                </button>
                                <button
                                    onClick={() => setActiveTab('history')}
                                    className={`${
                                        activeTab === 'history'
                                            ? 'border-blue-500 text-blue-600'
                                            : 'border-transparent text-gray-500'
                                    } py-2 px-4 border-b-2`}
                                >
                                    History
                                </button>
                            </nav>
                        </div>
                        {activeTab === 'details' && (
                            <>
                                {Object.entries(selectedEvent).map(
                                    ([key, value]) =>
                                        key !== "id" && (
                                            <div key={key}>
                                                <label className="block text-sm font-medium text-gray-700 capitalize">
                                                    {key}
                                                </label>
                                                <p className="mt-1 text-sm text-gray-900">
                                                    {value instanceof Date
                                                        ? format(
                                                              value,
                                                              "MMM d, yyyy HH:mm:ss"
                                                          )
                                                        : value}
                                                </p>
                                            </div>
                                        )
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    // Add this before the table
    const TableActions = () => (
        <div className="p-4 flex justify-between items-center">
            <CSVLink
                data={exportData}
                filename={`events-${format(new Date(), "yyyy-MM-dd")}.csv`}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
                <DocumentIcon className="h-5 w-5 mr-2" />
                Export to CSV
            </CSVLink>
        </div>
    );

    // Add this after the table
    const Pagination = () => (
        <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200">
            <div className="flex-1 flex justify-between items-center">
                <div>
                    <p className="text-sm text-gray-700">
                        Showing{" "}
                        <span className="font-medium">
                            {indexOfFirstItem + 1}
                        </span>{" "}
                        to{" "}
                        <span className="font-medium">
                            {Math.min(indexOfLastItem, sortedEvents.length)}
                        </span>{" "}
                        of{" "}
                        <span className="font-medium">
                            {sortedEvents.length}
                        </span>{" "}
                        results
                    </p>
                </div>
                <div className="flex space-x-2">
                    <button
                        onClick={() =>
                            setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
                    >
                        <ChevronLeftIcon className="h-5 w-5" />
                    </button>
                    <button
                        onClick={() =>
                            setCurrentPage((prev) =>
                                Math.min(prev + 1, totalPages)
                            )
                        }
                        disabled={currentPage === totalPages}
                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
                    >
                        <ChevronRightIcon className="h-5 w-5" />
                    </button>
                </div>
            </div>
        </div>
    );

    // Update your table headers to include sort indicators
    const SortHeader = ({ column, label }) => (
        <th
            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
            onClick={() => requestSort(column)}
        >
            <div className="flex items-center space-x-1">
                <span>{label}</span>
                <div className="flex flex-col">
                    <ChevronUpIcon
                        className={`h-3 w-3 ${
                            sortConfig.key === column &&
                            sortConfig.direction === "asc"
                                ? "text-blue-500"
                                : "text-gray-400"
                        }`}
                    />
                    <ChevronDownIcon
                        className={`h-3 w-3 ${
                            sortConfig.key === column &&
                            sortConfig.direction === "desc"
                                ? "text-blue-500"
                                : "text-gray-400"
                        }`}
                    />
                </div>
            </div>
        </th>
    );

    return (
        <div className="p-6 space-y-6 pb-20">
            {/* Filters Panel */}
            <div className="bg-white rounded-lg shadow">
                <div className="p-6">
                    <h2 className="text-lg font-medium mb-4">Filter Events</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Project Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Project
                            </label>
                            <select
                                value={filters.project}
                                onChange={(e) =>
                                    setFilters({
                                        ...filters,
                                        project: e.target.value,
                                    })
                                }
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            >
                                <option value="">All Projects</option>
                                {projects.map((project) => (
                                    <option key={project} value={project}>
                                        {project}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Device Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Device
                            </label>
                            <select
                                value={filters.device}
                                onChange={(e) =>
                                    setFilters({
                                        ...filters,
                                        device: e.target.value,
                                    })
                                }
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            >
                                <option value="">All Devices</option>
                                {devices.map((device) => (
                                    <option key={device} value={device}>
                                        {device}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Event Type Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Event Type
                            </label>
                            <select
                                value={filters.eventType}
                                onChange={(e) =>
                                    setFilters({
                                        ...filters,
                                        eventType: e.target.value,
                                    })
                                }
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            >
                                <option value="">All Types</option>
                                {eventTypes.map((type) => (
                                    <option key={type} value={type}>
                                        {type}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Severity Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Severity
                            </label>
                            <select
                                value={filters.severity}
                                onChange={(e) =>
                                    setFilters({
                                        ...filters,
                                        severity: e.target.value,
                                    })
                                }
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            >
                                <option value="">All Severities</option>
                                {severityLevels.map((level) => (
                                    <option key={level} value={level}>
                                        {level}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Date Range */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Start Date
                            </label>
                            <input
                                type="date"
                                value={filters.dateRange.start}
                                onChange={(e) =>
                                    setFilters({
                                        ...filters,
                                        dateRange: {
                                            ...filters.dateRange,
                                            start: e.target.value,
                                        },
                                    })
                                }
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                End Date
                            </label>
                            <input
                                type="date"
                                value={filters.dateRange.end}
                                onChange={(e) =>
                                    setFilters({
                                        ...filters,
                                        dateRange: {
                                            ...filters.dateRange,
                                            end: e.target.value,
                                        },
                                    })
                                }
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="mt-4">
                        <input
                            type="text"
                            placeholder="Search events..."
                            value={filters.search}
                            onChange={(e) =>
                                setFilters({
                                    ...filters,
                                    search: e.target.value,
                                })
                            }
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>
                </div>
            </div>

            {/* Events Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <TableActions />
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <SortHeader
                                    column="timestamp"
                                    label="Timestamp"
                                />
                                <SortHeader column="project" label="Project" />
                                <SortHeader column="device" label="Device" />
                                <SortHeader
                                    column="eventType"
                                    label="Event Type"
                                />
                                <SortHeader
                                    column="description"
                                    label="Description"
                                />
                                <SortHeader
                                    column="severity"
                                    label="Severity"
                                />
                                <SortHeader column="value" label="Value" />
                                <SortHeader column="status" label="Status" />
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {currentItems.map((event) => (
                                <tr
                                    key={event.id}
                                    className="hover:bg-gray-50 cursor-pointer"
                                    onClick={() => {
                                        setSelectedEvent(event);
                                        setShowDetailModal(true);
                                    }}
                                >
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {format(
                                            event.timestamp,
                                            "MMM d, yyyy HH:mm:ss"
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {event.project}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {event.device}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {event.eventType}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900">
                                        {event.description}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span
                                            className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getSeverityColor(
                                                event.severity
                                            )}`}
                                        >
                                            {event.severity}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {event.value}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span
                                            className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                                                event.status
                                            )}`}
                                        >
                                            {event.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <Pagination />
            </div>

            {showDetailModal && <EventDetailModal />}
        </div>
    );
}
