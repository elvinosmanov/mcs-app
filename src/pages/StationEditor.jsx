import React, { useState, useCallback, useMemo, useEffect } from 'react';
import ReactFlow, {
  Controls,
  Background,
  applyEdgeChanges,
  applyNodeChanges,
  addEdge,
  Handle,
} from 'reactflow';
import { useParams } from 'react-router-dom';
import 'reactflow/dist/style.css';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

const getNodeStyle = (figureType, width, height) => {
  const baseStyle = {
    width: `${width}px`,
    height: `${height}px`,
    background: 'white',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    padding: '10px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
    transition: 'all 0.2s ease',
  };

  switch (figureType) {
    case 'circle':
      return {
        ...baseStyle,
        borderRadius: '50%',
        background: 'linear-gradient(145deg, #ffffff, #f5f5f5)',
      };
    case 'diamond':
      return {
        ...baseStyle,
        transform: 'rotate(45deg)',
        background: 'linear-gradient(145deg, #ffffff, #f5f5f5)',
      };
    case 'hexagon':
      return {
        ...baseStyle,
        clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
        background: 'linear-gradient(145deg, #ffffff, #f5f5f5)',
      };
    case 'triangle':
      return {
        ...baseStyle,
        clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)',
        background: 'linear-gradient(145deg, #ffffff, #f5f5f5)',
      };
    default: // rectangle
      return {
        ...baseStyle,
        borderRadius: '8px',
        background: 'linear-gradient(145deg, #ffffff, #f5f5f5)',
      };
  }
};

const getStationDevices = () => {
  // Mock devices - these will show up regardless of URL
  return [
    { id: 1, name: 'Baku: GPS1' },
    { id: 2, name: 'Baku: RTU1' },
    { id: 3, name: 'Baku: PLC1' },
    { id: 4, name: 'Baku: Sensor1' },
    { id: 5, name: 'Baku: Controller1' },
    { id: 6, name: 'Ganja: GPS1' },
    { id: 7, name: 'Ganja: RTU1' },
    { id: 8, name: 'Ganja: PLC1' },
    { id: 9, name: 'Sumgait: GPS1' },
    { id: 10, name: 'Sumgait: RTU1' },
    { id: 11, name: 'Sumgait: PLC1' }
  ];
};

const StationEditor = () => {
  const { projectId, stationId } = useParams();
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [isAddingElement, setIsAddingElement] = useState(false);
  const [elementTemplates, setElementTemplates] = useState([]);
  const stationDevices = getStationDevices();
  
  const [newElement, setNewElement] = useState({
    name: '',
    device: '',
    figureType: 'rectangle',
    connections: [], // Simplified connections array
    dimensions: {
      width: 102,
      height: 102
    }
  });

  const [isEditing, setIsEditing] = useState(null);

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  const handleAddElement = (e) => {
    e.preventDefault();
    if (isEditing) {
      // Update existing template
      setElementTemplates(prev => prev.map(template => 
        template.id === isEditing ? { ...newElement, id: template.id } : template
      ));
      
      // Update existing nodes using this template
      setNodes(prev => prev.map(node => 
        node.data.templateId === isEditing 
          ? {
              ...node,
              data: {
                ...node.data,
                ...newElement,
                label: newElement.name
              }
            }
          : node
      ));
    } else {
      // Add new template
      const newTemplate = {
        ...newElement,
        id: `template-${elementTemplates.length + 1}`,
      };
      setElementTemplates(prev => [...prev, newTemplate]);
    }

    setIsAddingElement(false);
    setIsEditing(null);
    setNewElement({
      name: '',
      device: '',
      figureType: 'rectangle',
      connections: [],
      dimensions: {
        width: 102,
        height: 102
      }
    });
  };

  const addConnection = () => {
    const position = 'right'; // default position
    const existingConnectionsAtPosition = newElement.connections.filter(
      conn => conn.position === position
    ).length;

    if (existingConnectionsAtPosition >= MAX_CONNECTIONS_PER_SIDE) {
      alert(`Maximum ${MAX_CONNECTIONS_PER_SIDE} connections allowed per side`);
      return;
    }

    setNewElement({
      ...newElement,
      connections: [
        ...newElement.connections,
        { 
          id: newElement.connections.length + 1,
          position,
          type: 'source'
        }
      ]
    });
  };

  const removeConnection = (index) => {
    const newConnections = [...newElement.connections];
    newConnections.splice(index, 1);
    setNewElement({
      ...newElement,
      connections: newConnections
    });
  };

  const onDrop = useCallback((event) => {
    event.preventDefault();
    
    try {
      const reactFlowBounds = event.target.getBoundingClientRect();
      const template = JSON.parse(event.dataTransfer.getData('application/reactflow'));
      
      const position = {
        x: event.clientX - reactFlowBounds.left - 50, // Center the node
        y: event.clientY - reactFlowBounds.top - 50,  // Center the node
      };

      const newNode = {
        id: `node-${nodes.length + 1}`,
        type: 'custom',
        data: { 
          ...template,
          templateId: template.id,
          label: template.name,
          device: template.device,
          connections: template.connections,
          figureType: template.figureType,
          dimensions: template.dimensions
        },
        position,
      };

      setNodes((nds) => [...nds, newNode]);
    } catch (error) {
      console.error('Error dropping element:', error);
    }
  }, [nodes]);

  const onDragStart = (event, template) => {
    event.dataTransfer.setData('application/reactflow', JSON.stringify(template));
    event.dataTransfer.effectAllowed = 'move';
  };

  const MAX_CONNECTIONS_PER_SIDE = 3; // Maximum connections allowed per side

  const getHandleStyle = (type, position, isValid = true) => ({
    width: '12px',
    height: '12px',
    background: type === 'source' ? '#22C55E' : '#F97316',
    border: '2px solid white',
    borderRadius: '50%',
    [position]: '-6px',
    opacity: isValid ? 1 : 0.5,
    cursor: isValid ? 'pointer' : 'not-allowed',
    boxShadow: '0 0 0 2px rgba(0,0,0,0.1)',
  });

  const CustomNode = ({ data, selected }) => {
    const style = getNodeStyle(
      data.figureType, 
      data.dimensions?.width || 102, 
      data.dimensions?.height || 102
    );

    const contentStyle = {
      transform: data.figureType === 'diamond' ? 'rotate(-45deg)' : 'none',
      textAlign: 'center',
      width: '100%',
      pointerEvents: 'none',
      zIndex: 1,
    };

    const getHandlePosition = (position, index, totalInPosition) => {
      const gap = 20;
      const totalWidth = (totalInPosition - 1) * gap;
      const startPoint = -totalWidth / 2;
      
      const basePosition = {
        [position]: '-6px',
        ...(position === 'left' || position === 'right' 
          ? { top: `${startPoint + (index * gap) + 50}%` } 
          : { left: `${startPoint + (index * gap) + 50}%` })
      };

      // Add visual indicator for connection capacity
      if (totalInPosition >= MAX_CONNECTIONS_PER_SIDE) {
        return {
          ...basePosition,
          '::after': {
            content: '""',
            position: 'absolute',
            width: '16px',
            height: '16px',
            background: 'rgba(239, 68, 68, 0.2)',
            borderRadius: '50%',
            transform: 'translate(-2px, -2px)',
          }
        };
      }

      return basePosition;
    };

    // Group and count connections by position
    const connectionsByPosition = data.connections?.reduce((acc, conn) => {
      acc[conn.position] = acc[conn.position] || [];
      acc[conn.position].push(conn);
      return acc;
    }, {});

    return (
      <>
        <div style={{ 
          ...style, 
          border: selected ? '2px solid #3B82F6' : '1px solid #E5E7EB',
          boxShadow: selected ? '0 0 0 2px rgba(59, 130, 246, 0.5)' : style.boxShadow
        }}>
          <div style={contentStyle}>
            <div style={{ fontWeight: '600', fontSize: '14px', color: '#1F2937' }}>{data.label}</div>
            <div style={{ fontSize: '12px', color: '#6B7280' }}>{data.device}</div>
          </div>
        </div>
        {Object.entries(connectionsByPosition).map(([position, connections]) =>
          connections.map((conn, index) => {
            const isValid = connections.length <= MAX_CONNECTIONS_PER_SIDE;
            return (
              <Handle
                key={`${position}-${index}`}
                type={conn.type}
                position={position}
                id={`${conn.type}-${position}-${index}`}
                style={{
                  ...getHandleStyle(conn.type, position, isValid),
                  ...getHandlePosition(position, index, connections.length)
                }}
                isValidConnection={(connection) => {
                  const targetConnections = connectionsByPosition[connection.targetHandle] || [];
                  return targetConnections.length < MAX_CONNECTIONS_PER_SIDE;
                }}
              />
            );
          })
        )}
      </>
    );
  };

  // Register custom node
  const nodeTypes = useMemo(() => ({
    custom: CustomNode
  }), []);

  // Update the figure type options in the form
  const figureTypes = [
    { value: 'rectangle', label: 'Rectangle' },
    { value: 'circle', label: 'Circle' },
    { value: 'diamond', label: 'Diamond' },
    { value: 'hexagon', label: 'Hexagon' },
    { value: 'triangle', label: 'Triangle' },
  ];

  // Add these styles to your component
  const styles = {
    dragging: {
      opacity: 0.5,
      transform: 'scale(0.95)',
      transition: 'all 0.2s ease'
    },
    dragOver: {
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      transition: 'all 0.2s ease'
    }
  };

  // Update the sidebar element template display
  const SidebarElement = ({ template, onDragStart }) => {
    const [isDragging, setIsDragging] = useState(false);

    const getShapeIcon = (figureType) => {
      const iconStyle = {
        width: '16px',
        height: '16px',
        border: '1px solid #CBD5E1',
        display: 'inline-block',
        marginRight: '8px',
        background: 'white',
      };

      switch (figureType) {
        case 'circle':
          return <span style={{ ...iconStyle, borderRadius: '50%' }} />;
        case 'diamond':
          return <span style={{ ...iconStyle, transform: 'rotate(45deg)' }} />;
        case 'hexagon':
          return <span style={{ ...iconStyle, clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)' }} />;
        case 'triangle':
          return <span style={{ ...iconStyle, clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)' }} />;
        default:
          return <span style={{ ...iconStyle, borderRadius: '2px' }} />;
      }
    };

    return (
      <div 
        className="mb-2 p-3 border rounded-lg bg-white hover:bg-gray-50 transition-all duration-200 group"
        draggable
        onDragStart={(e) => {
          setIsDragging(true);
          onDragStart(e, template);
        }}
        onDragEnd={() => setIsDragging(false)}
        style={isDragging ? styles.dragging : {}}
      >
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center cursor-grab active:cursor-grabbing">
            {getShapeIcon(template.figureType)}
            <span className="font-medium">{template.name}</span>
          </div>
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => {
                e.stopPropagation();
                editElement(template);
              }}
              className="p-1 text-blue-600 hover:bg-blue-50 rounded"
              title="Edit element"
            >
              <PencilIcon className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                deleteElement(template.id);
              }}
              className="p-1 text-red-600 hover:bg-red-50 rounded"
              title="Delete element"
            >
              <TrashIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="text-sm text-gray-500 ml-6">{template.device}</div>
        <div className="mt-2 ml-6 flex flex-wrap gap-1">
          {template.connections.map((conn, index) => (
            <span 
              key={index}
              className={`text-xs px-2 py-1 rounded ${
                conn.type === 'source' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
              }`}
            >
              {`${conn.position} ${conn.type}`}
            </span>
          ))}
        </div>
      </div>
    );
  };

  const deleteElement = (templateId) => {
    setElementTemplates(prev => prev.filter(t => t.id !== templateId));
    setNodes(prev => prev.filter(n => n.data.templateId !== templateId));
  };

  const editElement = (template) => {
    setNewElement(template);
    setIsAddingElement(true);
    setIsEditing(template.id);
  };

  const EmptyState = () => (
    <div className="text-center py-8 text-gray-500">
      <div className="text-lg font-medium mb-2">No Elements Added</div>
      <div className="text-sm">Click "Add Element" to create your first element</div>
    </div>
  );

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex' }}>
      {/* Elements Panel - Floating */}
      <div 
        style={{
          position: 'absolute',
          left: '20px',
          top: '20px',
          zIndex: 10,
          background: 'white',
          padding: '20px',
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          width: '300px',
          maxHeight: 'calc(100vh - 40px)',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <button
          className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-lg mb-4 transition-colors duration-200 font-medium"
          onClick={() => setIsAddingElement(true)}
        >
          Add Element
        </button>
        
        <div className="flex-1 overflow-y-auto pr-2 space-y-2">
          {elementTemplates.length === 0 ? (
            <EmptyState />
          ) : (
            elementTemplates.map((template) => (
              <SidebarElement 
                key={template.id} 
                template={template} 
                onDragStart={onDragStart}
              />
            ))
          )}
        </div>
      </div>

      {/* Add Element Modal */}
      {isAddingElement && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-xl w-[480px] max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-semibold mb-6">
              {isEditing ? 'Edit Element' : 'Add New Element'}
            </h2>
            <form onSubmit={handleAddElement}>
              <div className="mb-4">
                <label className="block mb-2">Element Name</label>
                <input
                  type="text"
                  value={newElement.name}
                  onChange={(e) => setNewElement({...newElement, name: e.target.value})}
                  className="border border-gray-300 p-2.5 w-full rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  placeholder="Enter element name"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block mb-2">Device</label>
                <select
                  value={newElement.device}
                  onChange={(e) => setNewElement({...newElement, device: e.target.value})}
                  className="border border-gray-300 p-2.5 w-full rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  required
                >
                  <option value="">Select Device</option>
                  {stationDevices.map((device) => (
                    <option key={device.id} value={device.name}>
                      {device.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block mb-2">Figure Type</label>
                <select
                  value={newElement.figureType}
                  onChange={(e) => setNewElement({...newElement, figureType: e.target.value})}
                  className="border border-gray-300 p-2.5 w-full rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                >
                  {figureTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block mb-2">Connections</label>
                {newElement.connections.map((conn, index) => (
                  <div key={index} className="flex gap-2 mb-2 items-center">
                    <span className="w-8">{index + 1}</span>
                    <select
                      value={conn.position}
                      onChange={(e) => {
                        const newConnections = [...newElement.connections];
                        newConnections[index].position = e.target.value;
                        setNewElement({...newElement, connections: newConnections});
                      }}
                      className="border border-gray-300 p-2.5 w-full rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    >
                      <option value="left">Left</option>
                      <option value="right">Right</option>
                      <option value="top">Top</option>
                      <option value="bottom">Bottom</option>
                    </select>
                    <select
                      value={conn.type}
                      onChange={(e) => {
                        const newConnections = [...newElement.connections];
                        newConnections[index].type = e.target.value;
                        setNewElement({...newElement, connections: newConnections});
                      }}
                      className="border border-gray-300 p-2.5 w-full rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    >
                      <option value="source">Source</option>
                      <option value="target">Target</option>
                    </select>
                    <button
                      type="button"
                      onClick={() => removeConnection(index)}
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      -
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addConnection}
                  className="bg-green-500 text-white px-3 py-1 rounded mt-2"
                >
                  + Add Connection
                </button>
              </div>

              <div className="mb-4">
                <label className="block mb-2">Dimensions</label>
                <div className="flex gap-4">
                  <div>
                    <label className="block text-sm">Width</label>
                    <input
                      type="number"
                      value={newElement.dimensions.width}
                      onChange={(e) => setNewElement({
                        ...newElement,
                        dimensions: {
                          ...newElement.dimensions,
                          width: parseInt(e.target.value)
                        }
                      })}
                      className="border p-2 w-full rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm">Height</label>
                    <input
                      type="number"
                      value={newElement.dimensions.height}
                      onChange={(e) => setNewElement({
                        ...newElement,
                        dimensions: {
                          ...newElement.dimensions,
                          height: parseInt(e.target.value)
                        }
                      })}
                      className="border p-2 w-full rounded"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Canvas */}
      <div 
        style={{ 
          width: '100%', 
          height: '100%',
          transition: 'all 0.2s ease'
        }}
        onDrop={(e) => {
          e.currentTarget.style.backgroundColor = '';
          onDrop(e);
        }}
        onDragOver={(e) => {
          e.preventDefault();
          e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.1)';
        }}
        onDragLeave={(e) => {
          e.currentTarget.style.backgroundColor = '';
        }}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          className="transition-all duration-200"
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
};

export default StationEditor; 