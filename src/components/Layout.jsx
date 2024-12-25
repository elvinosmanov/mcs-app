import React from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import {
    HomeIcon,
    ChartBarIcon,
    BellAlertIcon,
    ClockIcon,
    Cog6ToothIcon,
    InformationCircleIcon,
} from "@heroicons/react/24/outline";
import Logo from "./Logo";
import AlarmPanel from "./AlarmPanel";

export default function Layout() {
    console.log("Layout rendering");
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
                <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
                    {/* Logo section stays at top */}
                    <div className="p-4 border-b border-gray-200">
                        <Logo />
                    </div>

                    {/* Main navigation */}
                    <nav className="flex-1 px-2 py-4 space-y-1">
                        {navigation.map((item) => {
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.name}
                                    to={item.path}
                                    className={`flex items-center px-4 py-3 text-sm rounded-md transition-colors ${
                                        location.pathname === item.path
                                            ? "bg-indigo-50 text-indigo-600"
                                            : "text-gray-600 hover:bg-gray-50"
                                    }`}
                                >
                                    <Icon className="h-5 w-5 mr-3" />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Bottom navigation section */}
                    <div className="border-t border-gray-200"></div>
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
