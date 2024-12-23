import React from 'react';

export default function Logo() {
  return (
    <div className="flex items-center space-x-2">
      <div className="relative">
        <div className="w-10 h-10 flex items-center justify-center">
          {/* Outer Ring with Pulse */}
          <div className="absolute inset-0 bg-indigo-500 rounded-full animate-pulse-ring opacity-20"></div>
          
          {/* Main Square with Rotation */}
          <div className="absolute inset-0.5 bg-gradient-to-br from-indigo-600 to-purple-400 rounded-lg transform rotate-45 animate-slow-spin shadow-lg"></div>
          
          {/* Inner Square */}
          <div className="absolute inset-2 bg-gradient-to-tr from-indigo-500 to-purple-300 rounded-md transform -rotate-45 flex items-center justify-center backdrop-blur-sm">
            {/* Center Dot with Pulse */}
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            
            {/* Neural network-like connections */}
            <div className="absolute inset-0 animate-orbit">
              <div className="absolute top-0 left-1/2 w-1 h-1 bg-white rounded-full transform -translate-x-1/2"></div>
            </div>
            <div className="absolute inset-0 animate-orbit-reverse">
              <div className="absolute bottom-0 left-1/2 w-1 h-1 bg-white rounded-full transform -translate-x-1/2"></div>
            </div>
          </div>

          {/* Corner Accents */}
          <div className="absolute top-0 left-0 w-2 h-2 bg-purple-300 rounded-full transform -translate-x-1/2 -translate-y-1/2 animate-blink"></div>
          <div className="absolute bottom-0 right-0 w-2 h-2 bg-purple-300 rounded-full transform translate-x-1/2 translate-y-1/2 animate-blink delay-300"></div>
        </div>
      </div>
      
      {/* Text with Gradient */}
      <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-400 bg-clip-text text-transparent">
        SYNAPSE
      </span>
    </div>
  );
} 