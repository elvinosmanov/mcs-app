import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';

export default memo(({ data, selected }) => {
  const renderHandles = () => {
    return data.connections?.map((conn, index) => (
      <Handle
        key={`${conn.position}-${conn.type}-${index}`}
        type={conn.type}
        position={Position[conn.position.charAt(0).toUpperCase() + conn.position.slice(1)]}
        className="w-2 h-2 bg-blue-500"
      />
    ));
  };

  return (
    <div
      className={`border-2 ${
        selected ? 'border-blue-500' : 'border-gray-200'
      } bg-white rounded-md p-2`}
      style={{
        width: data.width || 150,
        height: data.height || 100,
        borderRadius: data.figureType === 'circle' ? '50%' : 
                     data.figureType === 'ellipse' ? '50%' : '4px'
      }}
    >
      <div className="flex flex-col h-full justify-center items-center">
        <div className="font-medium text-sm">{data.name || data.label}</div>
        {data.device && (
          <div className="text-xs text-gray-500">{data.device.name}</div>
        )}
      </div>
      {renderHandles()}
    </div>
  );
}); 