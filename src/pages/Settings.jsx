import React, { useState } from "react";
import {
    BellIcon,
    SpeakerWaveIcon,
    SwatchIcon,
    TableCellsIcon,
    CheckIcon,
    EyeDropperIcon,
} from "@heroicons/react/24/outline";
import { Switch } from "@headlessui/react";
import { useSettings } from "../contexts/SettingsContext";

const colorPalettes = {
    primary: [
        { name: "Indigo", value: "#4F46E5" },
        { name: "Blue", value: "#2563EB" },
        { name: "Sky", value: "#0EA5E9" },
        { name: "Cyan", value: "#06B6D4" },
        { name: "Teal", value: "#14B8A6" },
    ],
    secondary: [
        { name: "Purple", value: "#A855F7" },
        { name: "Pink", value: "#EC4899" },
        { name: "Rose", value: "#F43F5E" },
        { name: "Orange", value: "#F97316" },
        { name: "Amber", value: "#F59E0B" },
    ],
};

function SettingRow({ label, children, description = null }) {
    return (
        <div className="flex items-center justify-between py-3">
            <div className="flex-1 pr-4">
                <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {label}
                </label>
                {description && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {description}
                    </p>
                )}
            </div>
            <div className="flex items-center">{children}</div>
        </div>
    );
}

function ToggleSwitch({ enabled, onChange }) {
    const { settings } = useSettings();
    return (
        <Switch
            checked={enabled}
            onChange={onChange}
            className={`${
                enabled ? "bg-secondary" : "bg-gray-200"
            } relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none`}
        >
            <span className="sr-only">Enable setting</span>
            <span
                className={`${
                    enabled ? "translate-x-5" : "translate-x-1"
                } inline-block h-3 w-3 transform rounded-full bg-white transition-transform`}
            />
        </Switch>
    );
}

function ColorPicker({
    label,
    value,
    onChange,
    description = null,
    type = "primary",
}) {
    return (
        <SettingRow label={label} description={description}>
            <div className="space-y-3">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <input
                            type="color"
                            value={value}
                            onChange={(e) => onChange(e.target.value)}
                            className="w-10 h-10 rounded-full border-2 border-gray-200 cursor-pointer opacity-0 absolute inset-0"
                        />
                        <div
                            className="w-10 h-10 rounded-full border-2 border-gray-200"
                            style={{ backgroundColor: value }}
                        />
                    </div>
                    <input
                        type="text"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        className="w-24 text-sm rounded-md border-gray-300"
                    />
                </div>
                <div className="flex gap-2">
                    {colorPalettes[type].map((color) => (
                        <button
                            key={color.name}
                            onClick={() => onChange(color.value)}
                            className="group relative"
                            title={color.name}
                        >
                            <div
                                className={`w-6 h-6 rounded-full border-2 transition-all ${
                                    value === color.value
                                        ? "border-gray-400 scale-110"
                                        : "border-gray-200 hover:scale-110"
                                }`}
                                style={{ backgroundColor: color.value }}
                            />
                            <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 opacity-0 group-hover:opacity-100 whitespace-nowrap">
                                {color.name}
                            </span>
                        </button>
                    ))}
                </div>
            </div>
        </SettingRow>
    );
}

export default function Settings() {
    const { settings, updateSettings } = useSettings();

    return (
        <div className="max-w-2xl mx-auto p-6 space-y-6">
            {/* Alarm Panel Settings */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2">
                        <BellIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                        <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                            Alarm Panel
                        </h2>
                    </div>
                </div>
                <div className="p-4 space-y-2">
                    <SettingRow
                        label="Default Expanded"
                        description="Show alarm panel expanded by default"
                    >
                        <ToggleSwitch
                            enabled={settings.alarmPanel.defaultExpanded}
                            onChange={(value) =>
                                updateSettings(
                                    "alarmPanel",
                                    "defaultExpanded",
                                    value
                                )
                            }
                        />
                    </SettingRow>
                    <SettingRow
                        label="Auto Collapse"
                        description="Automatically collapse panel after period of inactivity"
                    >
                        <ToggleSwitch
                            enabled={settings.alarmPanel.autoCollapse}
                            onChange={(value) =>
                                updateSettings(
                                    "alarmPanel",
                                    "autoCollapse",
                                    value
                                )
                            }
                        />
                    </SettingRow>
                    <SettingRow label="Max Visible Alarms">
                        <select
                            value={settings.alarmPanel.maxVisibleAlarms}
                            onChange={(e) =>
                                updateSettings(
                                    "alarmPanel",
                                    "maxVisibleAlarms",
                                    Number(e.target.value)
                                )
                            }
                            className="rounded-md border-gray-300 text-sm py-1"
                        >
                            <option value={25}>25 alarms</option>
                            <option value={50}>50 alarms</option>
                            <option value={100}>100 alarms</option>
                        </select>
                    </SettingRow>
                </div>
            </div>

            {/* Notification Settings */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2">
                        <SpeakerWaveIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                        <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                            Notifications
                        </h2>
                    </div>
                </div>
                <div className="p-4 space-y-2">
                    <SettingRow
                        label="Sound Alerts"
                        description="Play sound when new alarms arrive"
                    >
                        <ToggleSwitch
                            enabled={settings.notifications.soundEnabled}
                            onChange={(value) =>
                                updateSettings(
                                    "notifications",
                                    "soundEnabled",
                                    value
                                )
                            }
                        />
                    </SettingRow>
                    {settings.notifications.soundEnabled && (
                        <>
                            <SettingRow label="Sound Volume">
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={settings.notifications.soundVolume}
                                    onChange={(e) =>
                                        updateSettings(
                                            "notifications",
                                            "soundVolume",
                                            Number(e.target.value)
                                        )
                                    }
                                    className="w-32"
                                />
                            </SettingRow>
                            <SettingRow 
                                label="Critical Alarms Only"
                                description="Only play sound for critical alarms"
                            >
                                <ToggleSwitch
                                    enabled={settings.notifications.criticalAlarmSound}
                                    onChange={(value) => updateSettings('notifications', 'criticalAlarmSound', value)}
                                />
                            </SettingRow>
                        </>
                    )}
                    <SettingRow
                        label="Browser Notifications"
                        description="Show desktop notifications"
                    >
                        <ToggleSwitch
                            enabled={
                                settings.notifications.browserNotifications
                            }
                            onChange={(value) =>
                                updateSettings(
                                    "notifications",
                                    "browserNotifications",
                                    value
                                )
                            }
                        />
                    </SettingRow>
                </div>
            </div>

            {/* Display Settings */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2">
                        <SwatchIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                        <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                            Display
                        </h2>
                    </div>
                </div>
                <div className="p-4 space-y-2">
                    <SettingRow label="Theme">
                        <select
                            value={settings.display.theme}
                            onChange={(e) =>
                                updateSettings(
                                    "display",
                                    "theme",
                                    e.target.value
                                )
                            }
                            className="rounded-md border-gray-300 text-sm py-1"
                        >
                            <option value="light">Light</option>
                            <option value="dark">Dark</option>
                            <option value="system">System</option>
                        </select>
                    </SettingRow>
                    <SettingRow label="Density">
                        <select
                            value={settings.display.density}
                            onChange={(e) =>
                                updateSettings(
                                    "display",
                                    "density",
                                    e.target.value
                                )
                            }
                            className="rounded-md border-gray-300 text-sm py-1"
                        >
                            <option value="compact">Compact</option>
                            <option value="comfortable">Comfortable</option>
                        </select>
                    </SettingRow>
                    <SettingRow label="Time Format">
                        <select
                            value={settings.display.dateFormat}
                            onChange={(e) =>
                                updateSettings(
                                    "display",
                                    "dateFormat",
                                    e.target.value
                                )
                            }
                            className="rounded-md border-gray-300 text-sm py-1"
                        >
                            <option value="12h">12-hour</option>
                            <option value="24h">24-hour</option>
                        </select>
                    </SettingRow>
                </div>
            </div>

            {/* Color Settings */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2">
                        <EyeDropperIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                        <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                            Colors
                        </h2>
                    </div>
                </div>
                <div className="p-4 space-y-2">
                    <ColorPicker
                        label="Primary Color"
                        value={settings.colors?.primary || "#4F46E5"}
                        onChange={(value) =>
                            updateSettings("colors", "primary", value)
                        }
                        description="Used for navigation and icons"
                        type="primary"
                    />
                    <ColorPicker
                        label="Secondary Color"
                        value={settings.colors?.secondary || "#A855F7"}
                        onChange={(value) =>
                            updateSettings("colors", "secondary", value)
                        }
                        description="Used for actions and buttons"
                        type="secondary"
                    />
                </div>
            </div>

            {/* Data Settings */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2">
                        <TableCellsIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                        <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                            Data
                        </h2>
                    </div>
                </div>
                <div className="p-4 space-y-2">
                    <SettingRow
                        label="Auto Refresh"
                        description="Automatically refresh data"
                    >
                        <ToggleSwitch
                            enabled={settings.data.autoRefresh}
                            onChange={(value) =>
                                updateSettings("data", "autoRefresh", value)
                            }
                        />
                    </SettingRow>
                    {settings.data.autoRefresh && (
                        <SettingRow label="Refresh Interval">
                            <select
                                value={settings.data.refreshInterval}
                                onChange={(e) =>
                                    updateSettings(
                                        "data",
                                        "refreshInterval",
                                        Number(e.target.value)
                                    )
                                }
                                className="rounded-md border-gray-300 text-sm py-1"
                            >
                                <option value={15}>15 seconds</option>
                                <option value={30}>30 seconds</option>
                                <option value={60}>1 minute</option>
                            </select>
                        </SettingRow>
                    )}
                </div>
            </div>
        </div>
    );
}
