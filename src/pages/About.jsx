import React from 'react';
import { 
  InformationCircleIcon, 
  CodeBracketIcon,
  CpuChipIcon,
  UserGroupIcon 
} from '@heroicons/react/24/outline';

export default function About() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <InformationCircleIcon className="w-6 h-6 text-blue-600" />
            <h1 className="text-xl font-semibold text-gray-900">About Control System</h1>
          </div>
          <p className="mt-2 text-gray-600">
            A modern control system for industrial automation and monitoring
          </p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
          {/* Features Section */}
          <section>
            <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4">
              <CpuChipIcon className="w-5 h-5 text-green-600" />
              Key Features
            </h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <li className="flex items-start gap-2">
                <div className="mt-1 w-1 h-1 rounded-full bg-gray-400"></div>
                <span>Real-time monitoring and control</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="mt-1 w-1 h-1 rounded-full bg-gray-400"></div>
                <span>Advanced alarm management</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="mt-1 w-1 h-1 rounded-full bg-gray-400"></div>
                <span>Customizable dashboards</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="mt-1 w-1 h-1 rounded-full bg-gray-400"></div>
                <span>Data visualization and analytics</span>
              </li>
            </ul>
          </section>

          {/* Technical Info */}
          <section>
            <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4">
              <CodeBracketIcon className="w-5 h-5 text-yellow-600" />
              Technical Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Frontend Stack</h3>
                <ul className="space-y-1 text-gray-600">
                  <li>React</li>
                  <li>TailwindCSS</li>
                  <li>React Flow</li>
                  <li>Recharts</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Key Technologies</h3>
                <ul className="space-y-1 text-gray-600">
                  <li>Real-time WebSocket Communication</li>
                  <li>Modern State Management</li>
                  <li>Responsive Design</li>
                  <li>Dark Mode Support</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Team Section */}
          <section>
            <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4">
              <UserGroupIcon className="w-5 h-5 text-purple-600" />
              Development Team
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-gray-50">
                <h3 className="font-medium text-gray-900">Frontend Development</h3>
                <p className="text-sm text-gray-600 mt-1">UI/UX Design and Implementation</p>
              </div>
              <div className="p-4 rounded-lg bg-gray-50">
                <h3 className="font-medium text-gray-900">Backend Development</h3>
                <p className="text-sm text-gray-600 mt-1">System Architecture and API Design</p>
              </div>
              <div className="p-4 rounded-lg bg-gray-50">
                <h3 className="font-medium text-gray-900">Quality Assurance</h3>
                <p className="text-sm text-gray-600 mt-1">Testing and Quality Control</p>
              </div>
            </div>
          </section>

          {/* Version Info */}
          <div className="pt-6 border-t border-gray-200">
            <div className="text-sm text-gray-500">
              <p>Version: 1.0.0</p>
              <p>Last Updated: {new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 