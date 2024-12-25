import React, { useState, useEffect } from "react";
import {
    ChevronDownIcon,
    PlusIcon,
    XMarkIcon,
    AdjustmentsHorizontalIcon,
    ArrowPathIcon,
} from "@heroicons/react/24/outline";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    AreaChart,
    Area,
    BarChart,
    Bar,
} from "recharts";
import html2canvas from "html2canvas";
import { HexColorPicker } from "react-colorful";

// Sample data generator with multiple parameters
const generateData = (hours, parameters) => {
    const data = [];
    const now = new Date();
    for (let i = hours * 12; i >= 0; i--) {
        const point = {
            time: new Date(now - i * 5 * 60000).toLocaleTimeString(),
        };
        parameters.forEach((param) => {
            point[param.id] = Math.random() * param.range.max + param.range.min;
        });
        data.push(point);
    }
    return data;
};

// Color palette for lines
const colors = [
    "#2563eb",
    "#7c3aed",
    "#db2777",
    "#ea580c",
    "#16a34a",
    "#2dd4bf",
    "#6366f1",
    "#ec4899",
    "#f59e0b",
    "#84cc16",
];

// First, update the mock data structure to include projects and stations
const mockProjects = [
    {
        id: "proj1",
        name: "Production Line 2024",
        stations: [
            {
                id: "station1",
                name: "Assembly Station A",
                devices: [
                    {
                        id: "dev1",
                        name: "Environmental Sensor",
                        type: "sensor",
                        telemetries: [
                            {
                                id: "temp",
                                name: "Temperature",
                                unit: "°C",
                                range: { min: 20, max: 30 },
                            },
                            {
                                id: "humidity",
                                name: "Humidity",
                                unit: "%",
                                range: { min: 30, max: 70 },
                            },
                            {
                                id: "co2",
                                name: "CO2",
                                unit: "ppm",
                                range: { min: 400, max: 2000 },
                            },
                        ],
                    },
                    {
                        id: "dev2",
                        name: "Process Controller",
                        type: "controller",
                        telemetries: [
                            {
                                id: "pressure",
                                name: "Pressure",
                                unit: "kPa",
                                range: { min: 90, max: 110 },
                            },
                            {
                                id: "flow",
                                name: "Flow Rate",
                                unit: "L/min",
                                range: { min: 0, max: 100 },
                            },
                        ],
                    },
                    {
                        id: "dev3",
                        name: "Power Monitor",
                        type: "monitor",
                        telemetries: [
                            {
                                id: "voltage",
                                name: "Voltage",
                                unit: "V",
                                range: { min: 220, max: 240 },
                            },
                            {
                                id: "current",
                                name: "Current",
                                unit: "A",
                                range: { min: 0, max: 50 },
                            },
                            {
                                id: "power",
                                name: "Power",
                                unit: "kW",
                                range: { min: 0, max: 12 },
                            },
                        ],
                    },
                ],
            },
            {
                id: "station2",
                name: "Quality Control",
                devices: [
                    {
                        id: "dev4",
                        name: "Vision System",
                        type: "analyzer",
                        telemetries: [
                            {
                                id: "defects",
                                name: "Defects",
                                unit: "count",
                                range: { min: 0, max: 100 },
                            },
                            {
                                id: "processing_time",
                                name: "Processing Time",
                                unit: "ms",
                                range: { min: 0, max: 1000 },
                            },
                        ],
                    },
                    {
                        id: "dev5",
                        name: "Vibration Analyzer",
                        type: "sensor",
                        telemetries: [
                            {
                                id: "vibration",
                                name: "Vibration",
                                unit: "Hz",
                                range: { min: 0, max: 1000 },
                            },
                            {
                                id: "amplitude",
                                name: "Amplitude",
                                unit: "mm",
                                range: { min: 0, max: 10 },
                            },
                        ],
                    },
                ],
            },
        ],
    },
    {
        id: "proj2",
        name: "Smart Factory Beta",
        stations: [
            {
                id: "station3",
                name: "Robotic Cell",
                devices: [
                    {
                        id: "dev6",
                        name: "Robot Controller",
                        type: "controller",
                        telemetries: [
                            {
                                id: "position_x",
                                name: "Position X",
                                unit: "mm",
                                range: { min: -1000, max: 1000 },
                            },
                            {
                                id: "position_y",
                                name: "Position Y",
                                unit: "mm",
                                range: { min: -1000, max: 1000 },
                            },
                            {
                                id: "speed",
                                name: "Speed",
                                unit: "mm/s",
                                range: { min: 0, max: 2000 },
                            },
                        ],
                    },
                    {
                        id: "dev7",
                        name: "Force Sensor",
                        type: "sensor",
                        telemetries: [
                            {
                                id: "force",
                                name: "Force",
                                unit: "N",
                                range: { min: 0, max: 500 },
                            },
                            {
                                id: "torque",
                                name: "Torque",
                                unit: "Nm",
                                range: { min: 0, max: 100 },
                            },
                        ],
                    },
                ],
            },
            {
                id: "station4",
                name: "Material Handling",
                devices: [
                    {
                        id: "dev8",
                        name: "Conveyor System",
                        type: "actuator",
                        telemetries: [
                            {
                                id: "belt_speed",
                                name: "Belt Speed",
                                unit: "m/min",
                                range: { min: 0, max: 60 },
                            },
                            {
                                id: "motor_temp",
                                name: "Motor Temperature",
                                unit: "°C",
                                range: { min: 20, max: 80 },
                            },
                            {
                                id: "load",
                                name: "Load",
                                unit: "kg",
                                range: { min: 0, max: 1000 },
                            },
                        ],
                    },
                ],
            },
        ],
    },
];

// First, update the timeRanges array at the top level
const timeRanges = [
    { value: "5m", label: "Last 5 minutes" },
    { value: "15m", label: "Last 15 minutes" },
    { value: "30m", label: "Last 30 minutes" },
    { value: "1h", label: "Last hour" },
    { value: "3h", label: "Last 3 hours" },
    { value: "6h", label: "Last 6 hours" },
    { value: "12h", label: "Last 12 hours" },
    { value: "24h", label: "Last 24 hours" },
];

// Update the TelemetryChart component
const TelemetryChart = ({ telemetry, chartData, onUpdateData }) => {
    const [timeMode, setTimeMode] = useState("last");
    const [timeRange, setTimeRange] = useState({
        start: new Date(Date.now() - 60 * 60 * 1000),
        end: new Date(),
    });

    // Add this function to handle duration changes
    const handleDurationChange = (value) => {
        const duration = parseInt(value.replace(/[mh]/g, ""));
        const isMinutes = value.includes("m");
        const hours = isMinutes ? duration / 60 : duration;
        onUpdateData(telemetry.id, hours);
    };

    // Add exportToCSV function
    const exportToCSV = () => {
        if (!chartData || chartData.length === 0) return;

        const csvContent = [
            // Header
            [
                "Time",
                ...telemetry.parameters.map((p) => `${p.name} (${p.unit})`),
            ].join(","),
            // Data rows
            ...chartData.map((point) =>
                [
                    point.time,
                    ...telemetry.parameters.map((param) => point[param.id]),
                ].join(",")
            ),
        ].join("\n");

        const blob = new Blob([csvContent], {
            type: "text/csv;charset=utf-8;",
        });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `telemetry_${
            telemetry.deviceName
        }_${new Date().toISOString()}.csv`;
        link.click();
    };

    // Add screenshot function
    const handleScreenshot = () => {
        const chartElement = document.querySelector(`#chart-${telemetry.id}`);
        if (chartElement) {
            html2canvas(chartElement).then((canvas) => {
                const link = document.createElement("a");
                link.download = `telemetry_${
                    telemetry.deviceName
                }_${new Date().toISOString()}.png`;
                link.href = canvas.toDataURL("image/png");
                link.click();
            });
        }
    };

    return (
        <div className="p-4">
            <div className="flex items-center gap-4 mb-4">
                {/* Time Selection Controls */}
                <div className="flex items-center gap-4 flex-1">
                    {/* Mode Selector */}
                    <select
                        value={timeMode}
                        onChange={(e) => setTimeMode(e.target.value)}
                        className="w-48 px-4 py-2 text-sm border rounded-lg shadow-sm hover:border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                        <option value="last">Last Duration</option>
                        <option value="interval">Time Interval</option>
                    </select>

                    {timeMode === "last" ? (
                        <select
                            value={telemetry.timeRange}
                            onChange={(e) => {
                                handleDurationChange(e.target.value);
                            }}
                            className="w-48 px-4 py-2 text-sm border rounded-lg shadow-sm hover:border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                            {timeRanges.map((range) => (
                                <option key={range.value} value={range.value}>
                                    {range.label}
                                </option>
                            ))}
                        </select>
                    ) : (
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-500">
                                    Start
                                </span>
                                <input
                                    type="datetime-local"
                                    value={timeRange.start
                                        .toISOString()
                                        .slice(0, 16)}
                                    onChange={(e) => {
                                        setTimeRange((prev) => ({
                                            ...prev,
                                            start: new Date(e.target.value),
                                        }));
                                    }}
                                    className="w-48 px-4 py-2 text-sm border rounded-lg shadow-sm hover:border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-500">
                                    End
                                </span>
                                <input
                                    type="datetime-local"
                                    value={timeRange.end
                                        .toISOString()
                                        .slice(0, 16)}
                                    onChange={(e) => {
                                        const newEnd = new Date(e.target.value);
                                        setTimeRange((prev) => ({
                                            ...prev,
                                            end: newEnd,
                                        }));
                                        const hours =
                                            (newEnd - timeRange.start) /
                                            (1000 * 60 * 60);
                                        onUpdateData(telemetry.id, hours);
                                    }}
                                    max={new Date().toISOString().slice(0, 16)}
                                    className="w-48 px-4 py-2 text-sm border rounded-lg shadow-sm hover:border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Export Buttons */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={exportToCSV}
                        className="w-32 px-4 py-2 text-sm border rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                        Export CSV
                    </button>
                    <button
                        onClick={handleScreenshot}
                        className="w-32 px-4 py-2 text-sm border rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                        Screenshot
                    </button>
                </div>
            </div>

            {/* Chart */}
            <div id={`chart-${telemetry.id}`} className="h-[400px]">
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
                                backgroundColor: "white",
                                border: "1px solid #ccc",
                                borderRadius: "4px",
                                padding: "10px",
                            }}
                        />
                        <Legend />
                        {telemetry.parameters.map((param) => (
                            <Line
                                key={param.id}
                                type="monotone"
                                dataKey={param.id}
                                stroke={param.color}
                                name={`${param.name} (${param.unit})`}
                            />
                        ))}
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

// Update the ParameterManager component
const ParameterManager = ({ telemetry, onUpdate, onClose }) => {
    const [selectedParams, setSelectedParams] = useState(() => {
        const device = mockProjects
            .flatMap((p) => p.stations)
            .flatMap((s) => s.devices)
            .find((d) => d.id === telemetry.deviceId);

        return (
            device?.telemetries.map((param) => ({
                ...param,
                selected: telemetry.parameters.some((p) => p.id === param.id),
                color:
                    telemetry.parameters.find((p) => p.id === param.id)
                        ?.color || colors[0],
            })) || []
        );
    });

    const [editingColor, setEditingColor] = useState(null);

    const handleColorChange = (paramId, newColor) => {
        setSelectedParams((prev) =>
            prev.map((p) => (p.id === paramId ? { ...p, color: newColor } : p))
        );
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-[500px]">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">
                        Manage Parameters - {telemetry.deviceName}
                    </h3>
                    <button onClick={onClose}>
                        <XMarkIcon className="w-5 h-5" />
                    </button>
                </div>

                <div className="space-y-4 max-h-[400px] overflow-y-auto">
                    {selectedParams.map((param) => (
                        <div
                            key={param.id}
                            className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50"
                        >
                            <label className="flex items-center gap-3 flex-1">
                                <input
                                    type="checkbox"
                                    checked={param.selected}
                                    onChange={(e) => {
                                        setSelectedParams((prev) =>
                                            prev.map((p) =>
                                                p.id === param.id
                                                    ? {
                                                          ...p,
                                                          selected:
                                                              e.target.checked,
                                                      }
                                                    : p
                                            )
                                        );
                                    }}
                                    className="rounded border-gray-300"
                                />
                                <div className="flex-1">
                                    <div className="font-medium">
                                        {param.name}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        Unit: {param.unit} | Range:{" "}
                                        {param.range.min} - {param.range.max}
                                    </div>
                                </div>
                            </label>

                            {param.selected && (
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setEditingColor(
                                                editingColor === param.id
                                                    ? null
                                                    : param.id
                                            );
                                        }}
                                        className="w-6 h-6 rounded-full border border-gray-200 shadow-sm"
                                        style={{ backgroundColor: param.color }}
                                    />
                                    {editingColor === param.id && (
                                        <div
                                            className="absolute right-24 z-50"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <div className="p-3 bg-white rounded-lg shadow-xl border">
                                                <HexColorPicker
                                                    color={param.color}
                                                    onChange={(color) =>
                                                        handleColorChange(
                                                            param.id,
                                                            color
                                                        )
                                                    }
                                                />
                                                <div className="flex justify-between mt-2">
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleColorChange(
                                                                param.id,
                                                                colors[
                                                                    selectedParams.findIndex(
                                                                        (p) =>
                                                                            p.id ===
                                                                            param.id
                                                                    ) %
                                                                        colors.length
                                                                ]
                                                            );
                                                        }}
                                                        className="text-sm text-gray-600 hover:text-gray-900"
                                                    >
                                                        Reset
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setEditingColor(
                                                                null
                                                            );
                                                        }}
                                                        className="text-sm text-blue-600 hover:text-blue-700"
                                                    >
                                                        Done
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border rounded-md hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => {
                            const updatedParams = selectedParams
                                .filter((p) => p.selected)
                                .map((param) => ({
                                    ...param,
                                    color: param.color,
                                }));
                            onUpdate(updatedParams);
                            onClose();
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default function Telemetry() {
    const [filters, setFilters] = useState({
        project: "all",
        station: "all",
        deviceType: "all",
        search: "",
    });

    const [telemetries, setTelemetries] = useState([]);
    const [chartData, setChartData] = useState({});
    const [showAddPanel, setShowAddPanel] = useState(false);
    const [showParamManager, setShowParamManager] = useState(null);

    // Get all unique device types from all projects
    const deviceTypes = [
        ...new Set(
            mockProjects.flatMap((project) =>
                project.stations.flatMap((station) =>
                    station.devices.map((device) => device.type)
                )
            )
        ),
    ];

    // Get all projects for filter
    const projects = mockProjects.map((project) => ({
        id: project.id,
        name: project.name,
    }));

    // Get stations based on selected project
    const stations =
        filters.project === "all"
            ? mockProjects.flatMap((p) =>
                  p.stations.map((s) => ({ id: s.id, name: s.name }))
              )
            : mockProjects
                  .find((p) => p.id === filters.project)
                  ?.stations.map((s) => ({ id: s.id, name: s.name })) || [];

    // Filter devices based on criteria
    const filteredDevices = mockProjects.filter((project) => {
        const matchesLocation =
            filters.location === "all" || project.name === filters.location;
        const matchesType =
            filters.deviceType === "all" || project.type === filters.deviceType;
        const matchesSearch = project.name
            .toLowerCase()
            .includes(filters.search.toLowerCase());
        return matchesLocation && matchesType && matchesSearch;
    });

    // Update the AddTelemetryModal component
    const AddTelemetryModal = ({ onClose }) => {
        const [selectedProject, setSelectedProject] = useState("");
        const [selectedStation, setSelectedStation] = useState("");
        const [selectedDevice, setSelectedDevice] = useState("");
        const [selectedParams, setSelectedParams] = useState([]);

        // Get all available stations and devices regardless of selection
        const availableStations = selectedProject
            ? mockProjects.find((p) => p.id === selectedProject)?.stations || []
            : mockProjects.flatMap((p) => p.stations);

        const availableDevices = selectedStation
            ? availableStations.find((s) => s.id === selectedStation)
                  ?.devices || []
            : availableStations.flatMap((s) => s.devices);

        // Get current device and its telemetries
        const currentDevice = availableDevices.find(
            (d) => d.id === selectedDevice
        );

        const handleProjectChange = (projectId) => {
            setSelectedProject(projectId);
            // Only reset station if it's not in the new project
            if (projectId) {
                const projectStations =
                    mockProjects.find((p) => p.id === projectId)?.stations ||
                    [];
                if (!projectStations.some((s) => s.id === selectedStation)) {
                    setSelectedStation("");
                }
            }
        };

        const handleStationChange = (stationId) => {
            setSelectedStation(stationId);
            // Only reset device if it's not in the new station
            if (stationId) {
                const stationDevices =
                    availableStations.find((s) => s.id === stationId)
                        ?.devices || [];
                if (!stationDevices.some((d) => d.id === selectedDevice)) {
                    setSelectedDevice("");
                }
            }
        };

        const handleDeviceChange = (deviceId) => {
            setSelectedDevice(deviceId);
            const device = availableDevices.find((d) => d.id === deviceId);
            setSelectedParams(
                device?.telemetries.map((t) => ({ ...t, selected: false })) ||
                    []
            );
        };

        const handleAdd = () => {
            if (currentDevice && selectedParams.some((p) => p.selected)) {
                const selectedTelemetries = selectedParams.filter(
                    (p) => p.selected
                );

                // Get project and station names
                const project = mockProjects.find((p) =>
                    p.stations.some((s) =>
                        s.devices.some((d) => d.id === selectedDevice)
                    )
                );
                const station = project?.stations.find((s) =>
                    s.devices.some((d) => d.id === selectedDevice)
                );

                const newTelemetry = {
                    id: Date.now(),
                    projectName: project?.name || "Unknown Project",
                    stationName: station?.name || "Unknown Station",
                    deviceId: currentDevice.id,
                    deviceName: currentDevice.name,
                    timeRange: "1h",
                    expanded: true,
                    parameters: selectedTelemetries.map((param, index) => ({
                        ...param,
                        id: `${currentDevice.id}_${param.id}`,
                        color: colors[index % colors.length],
                    })),
                };
                setTelemetries((prev) => [...prev, newTelemetry]);
                // Initialize chart data for the new telemetry
                setChartData((prev) => ({
                    ...prev,
                    [newTelemetry.id]: generateData(1, newTelemetry.parameters), // 1 hour of data
                }));
                onClose();
            }
        };

        return (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white rounded-xl p-6 w-[600px]">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-semibold">Add Telemetry</h2>
                        <button onClick={onClose}>
                            <XMarkIcon className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                        {/* Project Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Project
                            </label>
                            <select
                                value={selectedProject}
                                onChange={(e) =>
                                    handleProjectChange(e.target.value)
                                }
                                className="w-full rounded-md border-gray-300"
                            >
                                <option value="">All Projects</option>
                                {mockProjects.map((project) => (
                                    <option key={project.id} value={project.id}>
                                        {project.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Station Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Station
                            </label>
                            <select
                                value={selectedStation}
                                onChange={(e) =>
                                    handleStationChange(e.target.value)
                                }
                                className="w-full rounded-md border-gray-300"
                            >
                                <option value="">All Stations</option>
                                {availableStations.map((station) => (
                                    <option key={station.id} value={station.id}>
                                        {station.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Device Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Device
                            </label>
                            <select
                                value={selectedDevice}
                                onChange={(e) =>
                                    handleDeviceChange(e.target.value)
                                }
                                className="w-full rounded-md border-gray-300"
                            >
                                <option value="">Select Device</option>
                                {availableDevices.map((device) => (
                                    <option key={device.id} value={device.id}>
                                        {device.name} ({device.type})
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Telemetry Parameters - Only show when device is selected */}
                    {selectedDevice && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Available Telemetries
                            </label>
                            <div className="border rounded-md bg-white">
                                <div className="p-2 max-h-[200px] overflow-y-auto divide-y">
                                    {selectedParams.map((param) => (
                                        <label
                                            key={param.id}
                                            className="flex items-center gap-3 py-2 px-2 hover:bg-gray-50"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={param.selected}
                                                onChange={(e) => {
                                                    setSelectedParams((prev) =>
                                                        prev.map((p) =>
                                                            p.id === param.id
                                                                ? {
                                                                      ...p,
                                                                      selected:
                                                                          e
                                                                              .target
                                                                              .checked,
                                                                  }
                                                                : p
                                                        )
                                                    );
                                                }}
                                                className="rounded border-gray-300"
                                            />
                                            <div className="flex-1">
                                                <div className="font-medium">
                                                    {param.name}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    Unit: {param.unit} | Range:{" "}
                                                    {param.range.min} -{" "}
                                                    {param.range.max}
                                                </div>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-2 mt-6">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleAdd}
                            disabled={
                                !selectedDevice ||
                                !selectedParams.some((p) => p.selected)
                            }
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                        >
                            Add
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    // Update chart data when telemetries change
    useEffect(() => {
        const newChartData = {};
        telemetries.forEach((telemetry) => {
            const hours =
                parseInt(telemetry.timeRange.replace(/[mh]/g, "")) /
                (telemetry.timeRange.includes("m") ? 60 : 1);
            newChartData[telemetry.id] = generateData(
                hours,
                telemetry.parameters
            );
        });
        setChartData(newChartData);
    }, [telemetries]);

    return (
        <div className="p-6 space-y-6 pb-20">
            {/* Add Button */}
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold text-gray-900">
                    Telemetry Dashboard
                </h1>
                <button
                    onClick={() => setShowAddPanel(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <PlusIcon className="w-5 h-5" />
                    Add Telemetry
                </button>
            </div>

            {/* Telemetry Cards */}
            <div className="grid gap-6">
                {telemetries.map((telemetry) => (
                    <div
                        key={telemetry.id}
                        className="bg-white rounded-xl shadow-sm border border-gray-200"
                    >
                        <div className="p-4 flex items-center justify-between border-b border-gray-200">
                            <div className="flex items-center gap-3">
                                <h2 className="text-lg font-medium text-gray-900">
                                    {telemetry.deviceName}
                                </h2>
                                <span className="text-sm text-gray-500">
                                    {telemetry.location}
                                </span>
                            </div>

                            {/* Control Buttons */}
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() =>
                                        setShowParamManager(telemetry.id)
                                    }
                                    className="p-2 hover:bg-gray-100 rounded-lg"
                                    title="Manage Parameters"
                                >
                                    <AdjustmentsHorizontalIcon className="w-5 h-5 text-gray-600" />
                                </button>
                                <button
                                    onClick={() => {
                                        /* refresh logic */
                                    }}
                                    className="p-2 hover:bg-gray-100 rounded-lg"
                                    title="Refresh Data"
                                >
                                    <ArrowPathIcon className="w-5 h-5 text-gray-600" />
                                </button>
                                <button
                                    onClick={() =>
                                        setTelemetries((prev) =>
                                            prev.filter(
                                                (t) => t.id !== telemetry.id
                                            )
                                        )
                                    }
                                    className="p-2 hover:bg-red-100 rounded-lg"
                                    title="Remove Telemetry"
                                >
                                    <XMarkIcon className="w-5 h-5 text-red-600" />
                                </button>
                            </div>
                        </div>

                        {/* Chart */}
                        <TelemetryChart
                            telemetry={telemetry}
                            chartData={chartData[telemetry.id]}
                            onUpdateData={(id, hours) => {
                                const newChartData = generateData(
                                    hours,
                                    telemetry.parameters
                                );
                                setChartData((prev) => ({
                                    ...prev,
                                    [id]: newChartData,
                                }));
                                // Update the telemetry timeRange if it's a preset duration
                                if (hours === 0.0833)
                                    setTelemetries((prev) =>
                                        prev.map((t) =>
                                            t.id === id
                                                ? { ...t, timeRange: "5m" }
                                                : t
                                        )
                                    );
                                if (hours === 0.25)
                                    setTelemetries((prev) =>
                                        prev.map((t) =>
                                            t.id === id
                                                ? { ...t, timeRange: "15m" }
                                                : t
                                        )
                                    );
                                if (hours === 0.5)
                                    setTelemetries((prev) =>
                                        prev.map((t) =>
                                            t.id === id
                                                ? { ...t, timeRange: "30m" }
                                                : t
                                        )
                                    );
                                if (hours === 1)
                                    setTelemetries((prev) =>
                                        prev.map((t) =>
                                            t.id === id
                                                ? { ...t, timeRange: "1h" }
                                                : t
                                        )
                                    );
                                if (hours === 3)
                                    setTelemetries((prev) =>
                                        prev.map((t) =>
                                            t.id === id
                                                ? { ...t, timeRange: "3h" }
                                                : t
                                        )
                                    );
                            }}
                        />

                        {/* Stats */}
                        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                            {telemetry.parameters.map((param) => {
                                const values =
                                    chartData[telemetry.id]?.map(
                                        (d) => d[param.id]
                                    ) || [];
                                const avg =
                                    values.reduce((a, b) => a + b, 0) /
                                    values.length;
                                const min = Math.min(...values);
                                const max = Math.max(...values);

                                return (
                                    <div
                                        key={param.id}
                                        className="p-4 border rounded-lg"
                                    >
                                        <h3 className="text-sm font-medium text-gray-700">
                                            {param.name}
                                        </h3>
                                        <div className="mt-2 grid grid-cols-3 gap-2 text-sm">
                                            <div>
                                                <div className="text-gray-500">
                                                    Avg
                                                </div>
                                                <div className="font-medium">
                                                    {avg.toFixed(1)}{" "}
                                                    {param.unit}
                                                </div>
                                            </div>
                                            <div>
                                                <div className="text-gray-500">
                                                    Min
                                                </div>
                                                <div className="font-medium">
                                                    {min.toFixed(1)}{" "}
                                                    {param.unit}
                                                </div>
                                            </div>
                                            <div>
                                                <div className="text-gray-500">
                                                    Max
                                                </div>
                                                <div className="font-medium">
                                                    {max.toFixed(1)}{" "}
                                                    {param.unit}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {/* Add Telemetry Modal */}
            {showAddPanel && (
                <AddTelemetryModal onClose={() => setShowAddPanel(false)} />
            )}

            {showParamManager && (
                <ParameterManager
                    telemetry={telemetries.find(
                        (t) => t.id === showParamManager
                    )}
                    onUpdate={(newParams) => {
                        setTelemetries((prev) =>
                            prev.map((t) =>
                                t.id === showParamManager
                                    ? { ...t, parameters: newParams }
                                    : t
                            )
                        );
                    }}
                    onClose={() => setShowParamManager(null)}
                />
            )}
        </div>
    );
}
