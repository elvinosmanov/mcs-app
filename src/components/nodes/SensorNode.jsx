import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';

export default memo(({ data, selected }) => {
  return (
    <div className={`px-4 py-2 shadow-md rounded-md bg-white border-2 ${
      selected ? 'border-blue-500' : 'border-gray-200'
    }`}>
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-blue-500"
      />
      <div className="flex items-center">
        <div className="ml-2">
          <div className="text-sm font-bold">{data.label}</div>
          <div className="text-xs text-gray-500">Sensor</div>
        </div>
      </div>
    </div>
  );
}); 