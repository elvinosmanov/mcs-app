import React, { useState, useCallback, useEffect } from "react";
import { Dialog, Transition, Menu } from "@headlessui/react";
import { Fragment } from "react";
import {
    PlusIcon,
    ArrowTopRightOnSquareIcon,
    ChevronRightIcon,
    ChevronDownIcon,
    FolderIcon,
    CircleStackIcon,
    CpuChipIcon,
    XMarkIcon,
    TrashIcon,
    PencilIcon,
    EllipsisVerticalIcon,
    ArrowPathIcon,
    Squares2X2Icon,
    ListBulletIcon,
} from "@heroicons/react/24/outline";

// Sample data structure with more test devices
const initialProjects = [
    {
        id: 1,
        name: "Production Line 2024",
        stations: [
            {
                id: 1,
                name: "Assembly Station A",
                devices: [
                    {
                        id: 1,
                        name: "Temperature Sensor 1",
                        type: "sensor",
                        status: "Active",
                    },
                    {
                        id: 2,
                        name: "Pressure Controller",
                        type: "controller",
                        status: "Active",
                    },
                    {
                        id: 3,
                        name: "Flow Meter",
                        type: "sensor",
                        status: "Active",
                    },
                    {
                        id: 4,
                        name: "Conveyor Belt",
                        type: "actuator",
                        status: "Active",
                    },
                    {
                        id: 5,
                        name: "Position Sensor",
                        type: "sensor",
                        status: "Active",
                    },
                    {
                        id: 6,
                        name: "Motor Controller",
                        type: "controller",
                        status: "Maintenance",
                    },
                ],
            },
            {
                id: 2,
                name: "Testing Station B",
                devices: [
                    {
                        id: 7,
                        name: "Quality Scanner",
                        type: "sensor",
                        status: "Active",
                    },
                    {
                        id: 8,
                        name: "Robotic Arm",
                        type: "actuator",
                        status: "Maintenance",
                    },
                    {
                        id: 9,
                        name: "Vision System",
                        type: "sensor",
                        status: "Active",
                    },
                    {
                        id: 10,
                        name: "Pick and Place",
                        type: "actuator",
                        status: "Active",
                    },
                    {
                        id: 11,
                        name: "Barcode Reader",
                        type: "sensor",
                        status: "Active",
                    },
                    {
                        id: 12,
                        name: "Sorting Robot",
                        type: "actuator",
                        status: "Active",
                    },
                ],
            },
        ],
    },
    {
        id: 2,
        name: "Assembly Line Alpha",
        stations: [
            {
                id: 3,
                name: "Welding Station",
                devices: [
                    {
                        id: 13,
                        name: "Welder Controller",
                        type: "controller",
                        status: "Active",
                    },
                    {
                        id: 14,
                        name: "Temperature Monitor",
                        type: "sensor",
                        status: "Active",
                    },
                    {
                        id: 15,
                        name: "Smoke Detector",
                        type: "sensor",
                        status: "Active",
                    },
                    {
                        id: 16,
                        name: "Emergency Stop",
                        type: "safety",
                        status: "Active",
                    },
                    {
                        id: 17,
                        name: "Gas Flow Sensor",
                        type: "sensor",
                        status: "Active",
                    },
                    {
                        id: 18,
                        name: "Robot Arm",
                        type: "actuator",
                        status: "Maintenance",
                    },
                ],
            },
            {
                id: 4,
                name: "Packaging Station",
                devices: [
                    {
                        id: 19,
                        name: "Label Printer",
                        type: "printer",
                        status: "Active",
                    },
                    {
                        id: 20,
                        name: "Box Sealer",
                        type: "actuator",
                        status: "Active",
                    },
                    {
                        id: 21,
                        name: "Weight Scale",
                        type: "sensor",
                        status: "Active",
                    },
                    {
                        id: 22,
                        name: "Barcode Scanner",
                        type: "sensor",
                        status: "Active",
                    },
                    {
                        id: 23,
                        name: "Conveyor System",
                        type: "actuator",
                        status: "Active",
                    },
                    {
                        id: 24,
                        name: "Package Counter",
                        type: "sensor",
                        status: "Active",
                    },
                ],
            },
        ],
    },
];

export default function ControlSystem() {
    const [projects, setProjects] = useState(initialProjects);
    const [expandedProjects, setExpandedProjects] = useState(new Set());
    const [expandedStations, setExpandedStations] = useState(new Set());

    // Modal states
    const [projectModal, setProjectModal] = useState(false);
    const [stationModal, setStationModal] = useState(false);
    const [deviceModal, setDeviceModal] = useState(false);
    const [selectedProjectId, setSelectedProjectId] = useState(null);
    const [selectedStationId, setSelectedStationId] = useState(null);

    // Form states
    const [newProjectName, setNewProjectName] = useState("");
    const [newStationName, setNewStationName] = useState("");
    const [newDevice, setNewDevice] = useState({
        name: "",
        config: "",
    });

    const [isEditing, setIsEditing] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // Add state for editor loading
    const [loadingEditor, setLoadingEditor] = useState(null);

    const toggleProject = (projectId) => {
        const newExpanded = new Set(expandedProjects);
        if (newExpanded.has(projectId)) {
            newExpanded.delete(projectId);
        } else {
            newExpanded.add(projectId);
        }
        setExpandedProjects(newExpanded);
    };

    const toggleStation = (stationId) => {
        const newExpanded = new Set(expandedStations);
        if (newExpanded.has(stationId)) {
            newExpanded.delete(stationId);
        } else {
            newExpanded.add(stationId);
        }
        setExpandedStations(newExpanded);
    };

    const openStationEditor = async (project, station) => {
        setLoadingEditor(station.id);
        try {
            // Store the station data in localStorage
            localStorage.setItem(
                `station-${station.id}`,
                JSON.stringify({
                    project: { id: project.id, name: project.name },
                    station: station,
                    lastEdited: new Date().toISOString()
                })
            );

            // Open in new tab
            window.open(`/station-editor/${station.id}`, '_blank');
            
        } catch (error) {
            console.error('Error opening editor:', error);
            alert('Failed to open station editor');
        } finally {
            setLoadingEditor(null);
        }
    };

    const handleEditorUpdate = useCallback(
        (event) => {
            if (event.data && event.data.type === "STATION_UPDATE") {
                const { projectId, stationId, updates } = event.data;
                setProjects(
                    projects.map((project) =>
                        project.id === projectId
                            ? {
                                  ...project,
                                  stations: project.stations.map((station) =>
                                      station.id === stationId
                                          ? { ...station, ...updates }
                                          : station
                                  ),
                              }
                            : project
                    )
                );
            }
        },
        [projects]
    );

    useEffect(() => {
        window.addEventListener("message", handleEditorUpdate);
        return () => window.removeEventListener("message", handleEditorUpdate);
    }, [handleEditorUpdate]);

    // Add Project
    const addProject = () => {
        setProjectModal(true);
    };

    const handleProjectSubmit = () => {
        if (!newProjectName.trim()) return;

        if (isEditing && editingItem) {
            setProjects(
                projects.map((p) =>
                    p.id === editingItem.item.id
                        ? { ...p, name: newProjectName }
                        : p
                )
            );
        } else {
            const newProject = {
                id: Date.now(),
                name: newProjectName,
                stations: [],
            };
            setProjects([...projects, newProject]);
        }

        setProjectModal(false);
        setNewProjectName("");
        setIsEditing(false);
        setEditingItem(null);
    };

    // Add Station
    const addStation = (projectId) => {
        setSelectedProjectId(projectId);
        setStationModal(true);
    };

    const handleStationSubmit = () => {
        if (!newStationName.trim()) return;

        const newStation = {
            id: Date.now(),
            name: newStationName,
            devices: [],
        };

        setProjects(
            projects.map((project) =>
                project.id === selectedProjectId
                    ? {
                          ...project,
                          stations: [...project.stations, newStation],
                      }
                    : project
            )
        );
        setStationModal(false);
        setNewStationName("");
    };

    // Add Device
    const addDevice = (projectId, stationId) => {
        console.log("Adding device to:", { projectId, stationId }); // Debug log
        setSelectedProjectId(projectId);
        setSelectedStationId(stationId);
        setNewDevice({ name: "", config: "" });
        setDeviceModal(true);
    };

    const handleDeviceSubmit = () => {
        if (!newDevice.name.trim()) return;

        const device = {
            id: Date.now(),
            name: newDevice.name,
            status: 'active',
            commands: [
                { name: "Power", type: "button" },
                { name: "Sensitivity", type: "range", min: 0, max: 100, value: 50 },
                { name: "Mode", type: "select", options: ["Auto", "Manual", "Test"], value: "Auto" }
            ]
        };

        setProjects(prevProjects => {
            return prevProjects.map(project => {
                if (project.id === selectedProjectId) {
                    return {
                        ...project,
                        stations: project.stations.map(station => {
                            if (station.id === selectedStationId) {
                                return {
                                    ...station,
                                    devices: [...station.devices, device]
                                };
                            }
                            return station;
                        })
                    };
                }
                return project;
            });
        });

        setDeviceModal(false);
        setNewDevice({ name: '', config: '' });
    };

    // File handling for device config
    const handleConfigFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const config = JSON.parse(e.target.result);
                    setNewDevice((prev) => ({
                        ...prev,
                        config: JSON.stringify(config, null, 2),
                    }));
                } catch (error) {
                    alert("Invalid JSON file");
                }
            };
            reader.readAsText(file);
        }
    };

    // Delete functions
    const deleteProject = (projectId) => {
        if (window.confirm("Are you sure you want to delete this project?")) {
            setProjects(projects.filter((p) => p.id !== projectId));
        }
    };

    const deleteStation = (projectId, stationId) => {
        if (window.confirm("Are you sure you want to delete this station?")) {
            setProjects(
                projects.map((project) =>
                    project.id === projectId
                        ? {
                              ...project,
                              stations: project.stations.filter(
                                  (s) => s.id !== stationId
                              ),
                          }
                        : project
                )
            );
        }
    };

    const deleteDevice = (projectId, stationId, deviceId) => {
        if (window.confirm("Are you sure you want to delete this device?")) {
            setProjects(
                projects.map((project) =>
                    project.id === projectId
                        ? {
                              ...project,
                              stations: project.stations.map((station) =>
                                  station.id === stationId
                                      ? {
                                            ...station,
                                            devices: station.devices.filter(
                                                (d) => d.id !== deviceId
                                            ),
                                        }
                                      : station
                              ),
                          }
                        : project
                )
            );
        }
    };

    // Edit functions
    const startEditing = (type, item, projectId = null, stationId = null) => {
        setIsEditing(true);
        setEditingItem({ type, item, projectId, stationId });

        switch (type) {
            case "project":
                setNewProjectName(item.name);
                setProjectModal(true);
                break;
            case "station":
                setNewStationName(item.name);
                setSelectedProjectId(projectId);
                setStationModal(true);
                break;
            case "device":
                setNewDevice({
                    name: item.name,
                    config: JSON.stringify(item.config, null, 2),
                });
                setSelectedProjectId(projectId);
                setSelectedStationId(stationId);
                setDeviceModal(true);
                break;
        }
    };

    // Simulate refresh
    const handleRefresh = async () => {
        setIsLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setIsLoading(false);
    };

    // Filter projects based on search
    const filteredProjects = projects.filter((project) =>
        project.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Add Device Command Modal
    const [selectedDevice, setSelectedDevice] = useState(null);
    const [showCommandModal, setShowCommandModal] = useState(false);

    const openDeviceCommands = (device) => {
        setSelectedDevice(device);
        setShowCommandModal(true);
    };

    // Device Command Modal Component
    const DeviceCommandModal = ({ device, isOpen, onClose }) => {
        if (!device) return null;

        return (
            <Dialog open={isOpen} onClose={onClose}>
                <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                        <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                            {device.name} - Controls
                        </Dialog.Title>
                        <div className="mt-4 space-y-4">
                            {device.commands.map((command, index) => (
                                <div key={index} className="flex flex-col gap-2">
                                    <label className="text-sm font-medium text-gray-700">
                                        {command.name}
                                    </label>
                                    {command.type === 'button' && (
                                        <button
                                            className="btn-blue"
                                            onClick={() => handleCommand(device.id, command.name)}
                                        >
                                            Execute
                                        </button>
                                    )}
                                    {command.type === 'range' && (
                                        <input
                                            type="range"
                                            min={command.min}
                                            max={command.max}
                                            defaultValue={command.value}
                                            onChange={(e) => handleCommand(device.id, command.name, e.target.value)}
                                            className="w-full"
                                        />
                                    )}
                                    {command.type === 'select' && (
                                        <select
                                            defaultValue={command.value}
                                            onChange={(e) => handleCommand(device.id, command.name, e.target.value)}
                                            className="rounded-md border-gray-300"
                                        >
                                            {command.options.map((opt) => (
                                                <option key={opt} value={opt}>{opt}</option>
                                            ))}
                                        </select>
                                    )}
                                </div>
                            ))}
                        </div>
                    </Dialog.Panel>
                </div>
            </Dialog>
        );
    };

    return (
        <div className="space-y-6">
            {/* Enhanced Header */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <FolderIcon className="w-5 h-5 text-yellow-600" />
                        <h2 className="text-base font-semibold text-gray-900">
                            Projects
                        </h2>
                    </div>
                    <button
                        onClick={addProject}
                        className="btn-blue inline-flex items-center"
                    >
                        <PlusIcon className="h-5 w-5 mr-2" />
                        New Project
                    </button>
                </div>
            </div>

            {/* Projects List with Enhanced Visual Hierarchy */}
            <div className="bg-white shadow-sm rounded-lg border border-gray-200">
                {projects.map((project) => (
                    <div
                        key={project.id}
                        className="border-b border-gray-200 last:border-b-0"
                    >
                        {/* Project Header */}
                        <div className="bg-gray-50 p-4 flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <button
                                    onClick={() => toggleProject(project.id)}
                                    className="flex items-center space-x-2 hover:text-purple-600"
                                >
                                    {expandedProjects.has(project.id) ? (
                                        <ChevronDownIcon className="h-5 w-5" />
                                    ) : (
                                        <ChevronRightIcon className="h-5 w-5" />
                                    )}
                                    <FolderIcon className="h-6 w-6 text-purple-500" />
                                    <span className="text-lg font-medium">
                                        {project.name}
                                    </span>
                                </button>
                                <span className="bg-purple-100 text-purple-800 text-xs px-2.5 py-0.5 rounded-full">
                                    {project.stations.length} stations
                                </span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => addStation(project.id)}
                                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                                >
                                    <PlusIcon className="h-4 w-4 mr-1" />
                                    Add Station
                                </button>
                                <Menu as="div" className="relative">
                                    <Menu.Button className="p-2 rounded-full hover:bg-gray-100">
                                        <EllipsisVerticalIcon className="h-5 w-5 text-gray-500" />
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
                                        <Menu.Items className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                                            <Menu.Item>
                                                {({ active }) => (
                                                    <button
                                                        onClick={() =>
                                                            startEditing(
                                                                "project",
                                                                project
                                                            )
                                                        }
                                                        className={`${
                                                            active
                                                                ? "bg-gray-100"
                                                                : ""
                                                        } group flex items-center w-full px-4 py-2 text-sm text-gray-700`}
                                                    >
                                                        <PencilIcon className="h-4 w-4 mr-3" />
                                                        Edit Project
                                                    </button>
                                                )}
                                            </Menu.Item>
                                            <Menu.Item>
                                                {({ active }) => (
                                                    <button
                                                        onClick={() =>
                                                            deleteProject(
                                                                project.id
                                                            )
                                                        }
                                                        className={`${
                                                            active
                                                                ? "bg-gray-100"
                                                                : ""
                                                        } group flex items-center w-full px-4 py-2 text-sm text-red-600`}
                                                    >
                                                        <TrashIcon className="h-4 w-4 mr-3" />
                                                        Delete Project
                                                    </button>
                                                )}
                                            </Menu.Item>
                                        </Menu.Items>
                                    </Transition>
                                </Menu>
                            </div>
                        </div>

                        {/* Stations Container */}
                        {expandedProjects.has(project.id) && (
                            <div className="p-4 space-y-4">
                                {project.stations.map((station) => (
                                    <div
                                        key={station.id}
                                        className="bg-white rounded-lg border border-gray-200 hover:border-purple-200 transition-colors"
                                    >
                                        {/* Station Header */}
                                        <div className="p-4 border-b border-gray-100">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <CircleStackIcon className="w-5 h-5 text-blue-600" />
                                                    <span className="text-sm font-medium text-gray-900">
                                                        {station.name}
                                                    </span>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <button
                                                        onClick={() =>
                                                            addDevice(
                                                                project.id,
                                                                station.id
                                                            )
                                                        }
                                                        className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                                                    >
                                                        <PlusIcon className="h-4 w-4 mr-1" />
                                                        Add Device
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            openStationEditor(
                                                                project,
                                                                station
                                                            )
                                                        }
                                                        className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                                                    >
                                                        <ArrowTopRightOnSquareIcon className="h-4 w-4 mr-1" />
                                                        Open Editor
                                                    </button>
                                                    <Menu
                                                        as="div"
                                                        className="relative"
                                                    >
                                                        <Menu.Button className="p-1 rounded-full hover:bg-gray-100">
                                                            <EllipsisVerticalIcon className="h-4 w-4 text-gray-500" />
                                                        </Menu.Button>
                                                        <Menu.Items className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                                                            <Menu.Item>
                                                                {({
                                                                    active,
                                                                }) => (
                                                                    <button
                                                                        onClick={() =>
                                                                            startEditing(
                                                                                "station",
                                                                                station,
                                                                                project.id
                                                                            )
                                                                        }
                                                                        className={`${
                                                                            active
                                                                                ? "bg-gray-100"
                                                                                : ""
                                                                        } group flex items-center w-full px-4 py-2 text-sm text-gray-700`}
                                                                    >
                                                                        <PencilIcon className="h-4 w-4 mr-3" />
                                                                        Edit
                                                                        Station
                                                                    </button>
                                                                )}
                                                            </Menu.Item>
                                                            <Menu.Item>
                                                                {({
                                                                    active,
                                                                }) => (
                                                                    <button
                                                                        onClick={() =>
                                                                            deleteStation(
                                                                                project.id,
                                                                                station.id
                                                                            )
                                                                        }
                                                                        className={`${
                                                                            active
                                                                                ? "bg-gray-100"
                                                                                : ""
                                                                        } group flex items-center w-full px-4 py-2 text-sm text-red-600`}
                                                                    >
                                                                        <TrashIcon className="h-4 w-4 mr-3" />
                                                                        Delete
                                                                        Station
                                                                    </button>
                                                                )}
                                                            </Menu.Item>
                                                        </Menu.Items>
                                                    </Menu>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Devices List */}
                                        <div className="p-4 bg-gray-50">
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                {station.devices.map((device) => (
                                                    <div
                                                        key={device.id}
                                                        className="bg-white p-4 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors"
                                                    >
                                                        <div className="flex items-center justify-between mb-2">
                                                            <div className="flex items-center gap-2">
                                                                <CpuChipIcon className="w-5 h-5 text-blue-600" />
                                                                <h3 className="font-medium text-gray-900">{device.name}</h3>
                                                            </div>
                                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                                device.status === 'active' ? 'bg-green-100 text-green-800' :
                                                                device.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' :
                                                                device.status === 'error' ? 'bg-red-100 text-red-800' :
                                                                'bg-gray-100 text-gray-800'
                                                            }`}>
                                                                {device.status}
                                                            </span>
                                                        </div>
                                                        <div className="flex justify-between items-center mt-2">
                                                            <button
                                                                onClick={() => openDeviceCommands(device)}
                                                                className="text-sm text-blue-600 hover:text-blue-700"
                                                            >
                                                                Commands
                                                            </button>
                                                            <Menu as="div" className="relative">
                                                                <Menu.Button className="p-1 rounded-full hover:bg-gray-100">
                                                                    <EllipsisVerticalIcon className="h-4 w-4 text-gray-500" />
                                                                </Menu.Button>
                                                                <Menu.Items className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                                                                    <Menu.Item>
                                                                        {({ active }) => (
                                                                            <button
                                                                                onClick={() => startEditing("device", device, project.id, station.id)}
                                                                                className={`${active ? 'bg-gray-100' : ''} group flex items-center w-full px-4 py-2 text-sm text-gray-700`}
                                                                            >
                                                                                <PencilIcon className="h-4 w-4 mr-3" />
                                                                                Edit Device
                                                                            </button>
                                                                        )}
                                                                    </Menu.Item>
                                                                    <Menu.Item>
                                                                        {({ active }) => (
                                                                            <button
                                                                                onClick={() => deleteDevice(project.id, station.id, device.id)}
                                                                                className={`${active ? 'bg-gray-100' : ''} group flex items-center w-full px-4 py-2 text-sm text-red-600`}
                                                                            >
                                                                                <TrashIcon className="h-4 w-4 mr-3" />
                                                                                Delete Device
                                                                            </button>
                                                                        )}
                                                                    </Menu.Item>
                                                                </Menu.Items>
                                                            </Menu>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Project Modal */}
            <Transition appear show={projectModal} as={Fragment}>
                <Dialog
                    as="div"
                    className="relative z-10"
                    onClose={() => setProjectModal(false)}
                >
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-25" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4">
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                <Dialog.Title
                                    as="h3"
                                    className="text-lg font-medium leading-6 text-gray-900"
                                >
                                    Add New Project
                                </Dialog.Title>
                                <div className="mt-4">
                                    <input
                                        type="text"
                                        value={newProjectName}
                                        onChange={(e) =>
                                            setNewProjectName(e.target.value)
                                        }
                                        placeholder="Project Name"
                                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                                    />
                                </div>
                                <div className="mt-4 flex justify-end space-x-2">
                                    <button
                                        onClick={() => setProjectModal(false)}
                                        className="inline-flex justify-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleProjectSubmit}
                                        className="btn-blue"
                                    >
                                        Add Project
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </div>
                    </div>
                </Dialog>
            </Transition>

            {/* Station Modal */}
            <Transition appear show={stationModal} as={Fragment}>
                <Dialog
                    as="div"
                    className="relative z-10"
                    onClose={() => setStationModal(false)}
                >
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-25" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4">
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                <Dialog.Title
                                    as="h3"
                                    className="text-lg font-medium leading-6 text-gray-900"
                                >
                                    Add New Station
                                </Dialog.Title>
                                <div className="mt-4">
                                    <input
                                        type="text"
                                        value={newStationName}
                                        onChange={(e) =>
                                            setNewStationName(e.target.value)
                                        }
                                        placeholder="Station Name"
                                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                                    />
                                </div>
                                <div className="mt-4 flex justify-end space-x-2">
                                    <button
                                        onClick={() => setStationModal(false)}
                                        className="inline-flex justify-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleStationSubmit}
                                        className="btn-blue"
                                    >
                                        Add Station
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </div>
                    </div>
                </Dialog>
            </Transition>

            {/* Device Modal */}
            <Transition appear show={deviceModal} as={Fragment}>
                <Dialog
                    as="div"
                    className="relative z-10"
                    onClose={() => setDeviceModal(false)}
                >
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-25" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4">
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                <Dialog.Title
                                    as="h3"
                                    className="text-lg font-medium leading-6 text-gray-900"
                                >
                                    Add New Device
                                </Dialog.Title>
                                <div className="mt-4 space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Device Name
                                        </label>
                                        <input
                                            type="text"
                                            value={newDevice.name}
                                            onChange={(e) =>
                                                setNewDevice({
                                                    ...newDevice,
                                                    name: e.target.value,
                                                })
                                            }
                                            placeholder="Device Name"
                                            className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Device Configuration
                                        </label>
                                        <div className="mt-1 space-y-2">
                                            <input
                                                type="file"
                                                accept=".json"
                                                onChange={
                                                    handleConfigFileUpload
                                                }
                                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                                            />
                                            <textarea
                                                value={newDevice.config}
                                                onChange={(e) =>
                                                    setNewDevice({
                                                        ...newDevice,
                                                        config: e.target.value,
                                                    })
                                                }
                                                placeholder="{}"
                                                rows={5}
                                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 font-mono"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-4 flex justify-end space-x-2">
                                    <button
                                        onClick={() => setDeviceModal(false)}
                                        className="inline-flex justify-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleDeviceSubmit}
                                        className="btn-blue"
                                    >
                                        Add Device
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </div>
                    </div>
                </Dialog>
            </Transition>

            {/* Device Command Modal */}
            <DeviceCommandModal
                device={selectedDevice}
                isOpen={showCommandModal}
                onClose={() => setShowCommandModal(false)}
            />
        </div>
    );
}
