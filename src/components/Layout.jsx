import React, { useState } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import {
    HomeIcon,
    ChartBarIcon,
    BellAlertIcon,
    ClockIcon,
    Cog6ToothIcon,
    InformationCircleIcon,
    ChevronDoubleLeftIcon,
    ChevronDoubleRightIcon,
} from "@heroicons/react/24/outline";
import Logo from "./Logo";
import AlarmPanel from "./AlarmPanel";

export default function Layout() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const location = useLocation();
    const isAlarmPage = location.pathname === "/alarms";

    const navigation = [
        { name: "Control Center", path: "/", icon: HomeIcon },
        { name: "Telemetry", path: "/telemetry", icon: ChartBarIcon },
        { name: "Alarms", path: "/alarms", icon: BellAlertIcon },
        { name: "Events", path: "/events", icon: ClockIcon },
        { name: "Settings", path: "/settings", icon: Cog6ToothIcon },
        { name: "About", path: "/about", icon: InformationCircleIcon },
    ];

    const openStationEditor = (stationId) => {
        window.open(`/station-editor/${stationId}`, "_blank");
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="flex h-screen overflow-hidden">
                {/* Sidebar */}
                <div
                    className={`bg-white border-r border-gray-200 flex flex-col transform transition-all ease-in-out duration-300 ${
                        isCollapsed ? "w-16" : "w-64"
                    }`}
                >
                    {/* Logo section */}
                    <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                        <div
                            className={`transform transition-transform ease-in-out duration-300 ${
                                isCollapsed ? "scale-0 w-0" : "scale-100 w-auto"
                            }`}
                        >
                            <Logo />
                        </div>
                        <button
                            onClick={() => setIsCollapsed(!isCollapsed)}
                            className="p-1 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                        >
                            {isCollapsed ? (
                                <ChevronDoubleRightIcon className="w-5 h-5 text-gray-500 transition-transform duration-200 ease-in-out" />
                            ) : (
                                <ChevronDoubleLeftIcon className="w-5 h-5 text-gray-500 transition-transform duration-200 ease-in-out" />
                            )}
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-2 py-4 space-y-1">
                        {navigation.map((item) => {
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.name}
                                    to={item.path}
                                    className={`flex items-center transform transition-all ease-in-out duration-300 ${
                                        isCollapsed
                                            ? "justify-center px-2"
                                            : "px-4"
                                    } py-3 text-sm rounded-md ${
                                        location.pathname === item.path
                                            ? "bg-indigo-50 text-indigo-600"
                                            : "text-gray-600 hover:bg-gray-50"
                                    }`}
                                >
                                    <Icon
                                        className={`transform transition-all ease-in-out duration-300 ${
                                            isCollapsed ? "h-6 w-6" : "h-5 w-5"
                                        }`}
                                    />
                                    <span
                                        className={`transform transition-all ease-in-out duration-300 ${
                                            isCollapsed
                                                ? "opacity-0 w-0 -translate-x-4"
                                                : "opacity-100 w-auto translate-x-0 ml-3"
                                        }`}
                                    >
                                        {item.name}
                                    </span>
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* Main content */}
                <main
                    className={`flex-1 overflow-auto ${
                        !isAlarmPage ? "pb-20" : ""
                    }`}
                >
                    <Outlet />
                </main>
            </div>

            {/* Alarm Panel */}
            {!isAlarmPage && <AlarmPanel />}
        </div>
    );
}
