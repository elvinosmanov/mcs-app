import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
    BellAlertIcon,
    ChevronUpIcon,
    CheckCircleIcon,
    BellSlashIcon,
    BellIcon,
    ClockIcon,
    SpeakerWaveIcon,
    XMarkIcon,
} from "@heroicons/react/24/outline";
import { useAlarms } from "../contexts/AlarmContext";
import { useSettings } from "../contexts/SettingsContext";

const AlarmPanel = ({ className }) => {
    const { settings } = useSettings();
    const [isExpanded, setIsExpanded] = useState(
        settings.alarmPanel.defaultExpanded
    );
    const { alarms, handleAcknowledge, handleSilence } = useAlarms();

    // Auto collapse functionality
    useEffect(() => {
        if (!settings.alarmPanel.autoCollapse || !isExpanded) return;

        const timer = setTimeout(() => {
            setIsExpanded(false);
        }, settings.alarmPanel.collapseAfter * 60 * 1000);

        return () => clearTimeout(timer);
    }, [
        isExpanded,
        settings.alarmPanel.autoCollapse,
        settings.alarmPanel.collapseAfter,
    ]);

    // Filter alarms based on maxVisibleAlarms
    const visibleAlarms = alarms
        .filter((alarm) => alarm.status !== "acknowledged")
        .slice(0, settings.alarmPanel.maxVisibleAlarms);

    // Create audio instance
    const alarmSound = new Audio("/sounds/alarm.mp3");

    // Play sound for new alarms
    useEffect(() => {
        if (!settings.notifications.soundEnabled) return;

        const newAlarms = alarms.filter(
            (alarm) =>
                alarm.status === "active" &&
                (settings.notifications.criticalAlarmSound
                    ? alarm.severity === "critical"
                    : true)
        );

        if (newAlarms.length > 0) {
            // Set volume based on settings
            alarmSound.volume = settings.notifications.soundVolume / 100;

            // Play sound
            alarmSound.play().catch((error) => {
                console.error("Error playing alarm sound:", error);
            });

            // Show browser notification if enabled
            if (
                settings.notifications.browserNotifications &&
                Notification.permission === "granted"
            ) {
                new Notification("New Alarm", {
                    body: `${newAlarms.length} new alarm${
                        newAlarms.length > 1 ? "s" : ""
                    }`,
                    icon: "/icon.png", // Optional: add an icon
                });
            }
        }
    }, [alarms, settings.notifications]);

    // Get row background color based on status and severity
    const getRowColor = (status, severity) => {
        if (status === "active") {
            return severity === "critical"
                ? "bg-red-100/70"
                : "bg-yellow-100/70";
        }
        return "bg-blue-50/70";
    };

    // Format time difference
    const getTimeAgo = (timestamp) => {
        const diff = new Date() - new Date(timestamp);
        const minutes = Math.floor(diff / 60000);
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
        return `${Math.floor(hours / 24)}d ago`;
    };

    // Format date and time
    const formatDateTime = (timestamp) => {
        const date = new Date(timestamp);
        return {
            date: date.toLocaleDateString(),
            time: date.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                hour12: settings.display.dateFormat === "12h",
            }),
        };
    };

    return (
        <div
            className={`fixed bottom-0 right-0 bg-white/90 backdrop-blur-sm border-t border-gray-200 shadow-lg transition-all duration-300 ease-in-out transform z-50 ${
                isExpanded ? "h-80" : "h-9"
            } ${className}`}
        >
            {/* Header Bar */}
            <div className="absolute top-0 left-0 right-0 h-9 bg-white/90 backdrop-blur-sm border-b border-gray-200/50 flex items-center justify-between px-3">
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
                >
                    <BellAlertIcon
                        className={`w-4 h-4 ${
                            visibleAlarms.some((a) => a.status === "active")
                                ? "text-red-600 animate-pulse"
                                : "text-gray-400"
                        }`}
                    />
                    <span className="text-xs font-medium">
                        Alarms ({visibleAlarms.length})
                    </span>
                    <ChevronUpIcon
                        className={`w-4 h-4 transition-transform duration-300 ${
                            isExpanded ? "" : "rotate-180"
                        }`}
                    />
                </button>
                <div className="flex items-center gap-1.5">
                    <Link
                        to="/alarms"
                        className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
                    >
                        View All
                    </Link>
                    {/* <button
                        onClick={() => setIsExpanded(false)}
                        className="p-1 hover:bg-gray-100 rounded"
                    >
                        <XMarkIcon className="w-4 h-4 text-gray-500" />
                    </button> */}
                </div>
            </div>

            {/* Expanded Content */}
            <div
                className={`overflow-hidden transition-all duration-300 ${
                    isExpanded
                        ? "h-[calc(100%-2.25rem)] opacity-100"
                        : "h-0 opacity-0"
                }`}
            >
                <div className="p-1 h-full overflow-auto">
                    {visibleAlarms.length > 0 ? (
                        <div className="grid gap-1">
                            {/* Header Row */}
                            <div className="px-3 py-1 text-[10px] uppercase tracking-wider text-gray-500 grid grid-cols-[100px_200px_1fr_100px_120px_80px] gap-4 items-center">
                                <div>Severity</div>
                                <div>Device</div>
                                <div>Message</div>
                                <div>Time Ago</div>
                                <div>Date/Time</div>
                                <div className="text-right">Actions</div>
                            </div>

                            {/* Alarm Rows */}
                            {visibleAlarms.map((alarm) => {
                                const { date, time } = formatDateTime(
                                    alarm.timestamp
                                );
                                return (
                                    <div
                                        key={alarm.id}
                                        className={`${getRowColor(
                                            alarm.status,
                                            alarm.severity
                                        )} px-3 py-1.5 grid grid-cols-[100px_200px_1fr_100px_120px_80px] gap-4 items-center`}
                                    >
                                        <span
                                            className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                                alarm.severity === "critical"
                                                    ? "bg-red-200/80 text-red-800"
                                                    : alarm.severity ===
                                                      "warning"
                                                    ? "bg-yellow-200/80 text-yellow-800"
                                                    : "bg-blue-200/80 text-blue-800"
                                            }`}
                                        >
                                            {alarm.severity}
                                        </span>

                                        <div className="flex items-center gap-2 text-xs min-w-0">
                                            <span className="font-medium text-gray-900 truncate">
                                                {alarm.deviceName}
                                            </span>
                                            <span className="text-gray-500 truncate">
                                                {alarm.deviceId}
                                            </span>
                                        </div>

                                        <p className="text-xs text-gray-900 truncate">
                                            {alarm.message}
                                        </p>

                                        <div className="flex items-center text-xs text-gray-500">
                                            <ClockIcon className="w-3.5 h-3.5 mr-1" />
                                            {getTimeAgo(alarm.timestamp)}
                                        </div>

                                        <div className="text-xs text-gray-500">
                                            <div>{date}</div>
                                            <div>{time}</div>
                                        </div>

                                        <div className="flex items-center gap-1 justify-end">
                                            <button
                                                onClick={() =>
                                                    handleAcknowledge(alarm.id)
                                                }
                                                className="p-1 rounded hover:bg-white/80 text-secondary"
                                                title="Acknowledge"
                                            >
                                                <CheckCircleIcon className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleSilence(alarm.id)
                                                }
                                                className={`p-1 rounded hover:bg-white/80 ${
                                                    alarm.status === "active"
                                                        ? "text-yellow-600"
                                                        : "text-secondary"
                                                }`}
                                                title={
                                                    alarm.status === "active"
                                                        ? "Silence"
                                                        : "Unsilence"
                                                }
                                            >
                                                {alarm.status === "active" ? (
                                                    <BellSlashIcon className="w-4 h-4" />
                                                ) : (
                                                    <SpeakerWaveIcon className="w-4 h-4" />
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-500">
                            <BellIcon className="w-12 h-12 mb-2" />
                            <p className="text-xs">No active alarms</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AlarmPanel;
