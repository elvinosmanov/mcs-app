import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { CpuChipIcon } from '@heroicons/react/24/outline';

function DeviceNode({ data }) {
  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 min-w-[200px]">
      <Handle type="target" position={Position.Top} className="w-3 h-3" />
      
      <div className="flex items-center gap-2 mb-2">
        <CpuChipIcon className="w-5 h-5 text-blue-600" />
        <h3 className="font-medium text-gray-900">{data.name}</h3>
      </div>
      
      <div className="flex justify-between items-center">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          data.status === 'active' ? 'bg-green-100 text-green-800' :
          data.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {data.status}
        </span>
      </div>

      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
    </div>
  );
}

export default memo(DeviceNode); 