import React, { useState, useRef, useCallback, useEffect } from 'react';
import { blueprintService } from '../blueprintService';
import { useAuth } from '../contexts/AuthContext';
import BlueprintList from './BlueprintList';
import Toast from './Toast';

// SVG Icons as components
const Icons = {
  Camera: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  Sensor: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
    </svg>
  ),
  Access: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  ),
  Safety: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  ),
  Room: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  ),
  Upload: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
    </svg>
  ),
  Eye: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  ),
  EyeOff: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    </svg>
  ),
  Check: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  ),
  X: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  Grid: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
    </svg>
  ),
  Search: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  ),
  Save: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V2" />
    </svg>
  ),
  Logout: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  ),
  User: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  )
};

// Blueprint Details Input Component - Separated to prevent focus loss
const BlueprintDetailsInput = React.memo(({ value, onChange, placeholder, isTextarea = false }) => {
  const [localValue, setLocalValue] = useState(value);
  
  // Update local value when prop value changes (for loading existing blueprints)
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleBlur = () => {
    if (localValue !== value) {
      onChange(localValue);
    }
  };

  const handleKeyPress = (e) => {
    if (!isTextarea && e.key === 'Enter') {
      e.target.blur();
    }
  };

  if (isTextarea) {
    return (
      <textarea
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        onBlur={handleBlur}
        placeholder={placeholder}
        rows={2}
        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
      />
    );
  }

  return (
    <input
      type="text"
      value={localValue}
      onChange={(e) => setLocalValue(e.target.value)}
      onBlur={handleBlur}
      onKeyPress={handleKeyPress}
      placeholder={placeholder}
      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
    />
  );
});

// Room name input component - Memoized to prevent re-renders
const RoomNameInput = React.memo(({ room, onUpdate, onDelete }) => {
  const [localName, setLocalName] = useState(room.name);

  const handleBlur = () => {
    if (localName !== room.name) {
      onUpdate({ ...room, name: localName });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.target.blur();
    }
  };

  return (
    <div className="flex items-center justify-between p-2 bg-gray-50 rounded-md border border-gray-200">
      <input
        type="text"
        value={localName}
        onChange={(e) => setLocalName(e.target.value)}
        onBlur={handleBlur}
        onKeyPress={handleKeyPress}
        className="flex-1 text-sm border border-gray-300 rounded px-2 py-1 mr-2 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-100"
        placeholder="Room name..."
      />
      <button
        onClick={onDelete}
        className="text-red-600 hover:text-red-700 hover:bg-red-50 p-1 rounded transition-colors"
      >
        <Icons.X />
      </button>
    </div>
  );
});

// Equipment types configuration
const EQUIPMENT_TYPES = {
  camera: {
    icon: Icons.Camera,
    label: 'Camera',
    color: '#059669',
    types: ['Dome', 'PTZ', 'Fixed', 'IR']
  },
  sensor: {
    icon: Icons.Sensor,
    label: 'Sensor',
    color: '#0891b2',
    types: ['Motion', 'Door', 'Window', 'Glass']
  },
  access: {
    icon: Icons.Access,
    label: 'Access Control',
    color: '#7c3aed',
    types: ['Card Reader', 'Keypad', 'Biometric', 'Intercom']
  },
  safety: {
    icon: Icons.Safety,
    label: 'Safety',
    color: '#dc2626',
    types: ['Fire Alarm', 'Emergency Button', 'Smoke Detector', 'Sprinkler']
  },
  room: {
    icon: Icons.Room,
    label: 'Room Zone',
    color: '#059669',
    types: ['Area']
  }
};

// Fixed canvas dimensions
const CANVAS_WIDTH = 900;
const CANVAS_HEIGHT = 600;

const BlueprintCreator = () => {
  const { user, signOut } = useAuth();
  const [mode, setMode] = useState('dashboard');
  const [blueprintImage, setBlueprintImage] = useState(null);
  const [blueprintImageFile, setBlueprintImageFile] = useState(null);
  const [equipment, setEquipment] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [selectedTool, setSelectedTool] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isDrawingRoom, setIsDrawingRoom] = useState(false);
  const [roomDrawStart, setRoomDrawStart] = useState(null);
  const [currentDragRect, setCurrentDragRect] = useState(null);
  const [sidebarWidth, setSidebarWidth] = useState(280);
  const [isResizing, setIsResizing] = useState(false);
  const [showRoomLabels, setShowRoomLabels] = useState(true);
  const [currentBlueprintId, setCurrentBlueprintId] = useState(null);
  const [blueprintName, setBlueprintName] = useState('');
  const [blueprintDescription, setBlueprintDescription] = useState('');
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [showUserEmail, setShowUserEmail] = useState(false);
  
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const sidebarScrollRef = useRef(null);

  // Helper function to preserve scroll position
  const preserveScroll = (callback) => {
    const scrollPosition = sidebarScrollRef.current?.scrollTop || 0;
    callback();
    requestAnimationFrame(() => {
      if (sidebarScrollRef.current) {
        sidebarScrollRef.current.scrollTop = scrollPosition;
      }
    });
  };

  // Handle blueprint selection from list
  const handleSelectBlueprint = async (blueprint) => {
    setCurrentBlueprintId(blueprint.id);
    setBlueprintName(blueprint.name);
    setBlueprintDescription(blueprint.description || '');
    setBlueprintImage(blueprint.image_url);
    setBlueprintImageFile(null);
    setRooms(blueprint.rooms || []);
    setEquipment(blueprint.equipment || []);
    setShowRoomLabels(blueprint.show_room_labels !== undefined ? blueprint.show_room_labels : true);
    setMode('edit');
  };

  // Save blueprint
  const handleSaveBlueprint = async () => {
    if (!blueprintName.trim()) {
      setToast({
        type: 'error',
        message: 'Please enter a blueprint name'
      });
      return;
    }

    if (!blueprintImage) {
      setToast({
        type: 'error',
        message: 'Please upload a blueprint image'
      });
      return;
    }

    setSaving(true);

    try {
      let imageToUpload = blueprintImageFile;
      
      // Convert base64 to file if needed
      if (blueprintImage && blueprintImage.startsWith('data:') && !blueprintImageFile) {
        imageToUpload = await blueprintService.base64ToFile(blueprintImage, 'blueprint.png');
      }

      const blueprintData = {
        name: blueprintName,
        description: blueprintDescription,
        image_url: blueprintImage.startsWith('http') ? blueprintImage : null,
        rooms,
        equipment,
        show_room_labels: showRoomLabels
      };

      if (currentBlueprintId) {
        // Update existing blueprint
        await blueprintService.updateBlueprint(
          currentBlueprintId,
          blueprintData,
          imageToUpload
        );
        setToast({
          type: 'success',
          message: 'Blueprint updated successfully'
        });
      } else {
        // Create new blueprint
        const newBlueprint = await blueprintService.createBlueprint(
          blueprintData,
          imageToUpload
        );
        setCurrentBlueprintId(newBlueprint.id);
        setBlueprintImage(newBlueprint.image_url);
        setBlueprintImageFile(null);
        setToast({
          type: 'success',
          message: 'Blueprint saved successfully'
        });
      }
    } catch (error) {
      console.error('Error saving blueprint:', error);
      setToast({
        type: 'error',
        message: 'Failed to save blueprint'
      });
    } finally {
      setSaving(false);
    }
  };

  // Handle image upload
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setBlueprintImage(e.target.result);
        setBlueprintImageFile(file);
        setEquipment([]);
        setRooms([]);
        setSelectedRoom(null);
        setSelectedTool(null);
        setIsDrawingRoom(false);
        setRoomDrawStart(null);
        setCurrentDragRect(null);
        setCurrentBlueprintId(null);
        setBlueprintName('');
        setBlueprintDescription('');
        setMode('edit');
      };
      reader.readAsDataURL(file);
    }
  };

  // Clear functions
  const clearAllRooms = () => {
    setRooms([]);
    setSelectedRoom(null);
    setIsDrawingRoom(false);
    setRoomDrawStart(null);
    setCurrentDragRect(null);
  };

  const clearAllEquipment = () => {
    setEquipment([]);
  };

  // Get mouse position relative to canvas
  const getCanvasCoordinates = (event) => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    return {
      x: x / rect.width,
      y: y / rect.height
    };
  };

  // Add equipment with scroll preservation
  const addEquipment = useCallback((x, y) => {
    if (!selectedTool || selectedTool === 'room') return;
    
    preserveScroll(() => {
      const newEquipment = {
        id: Date.now(),
        type: selectedTool,
        x: x,
        y: y,
        subType: EQUIPMENT_TYPES[selectedTool].types[0],
        status: 'Active',
        notes: ''
      };
      
      setEquipment(prev => [...prev, newEquipment]);
    });
  }, [selectedTool]);

  // Sidebar resize handlers
  const handleResizeStart = (e) => {
    setIsResizing(true);
    e.preventDefault();
  };

  const handleResizeMove = useCallback((e) => {
    if (isResizing) {
      const newWidth = Math.max(240, Math.min(400, e.clientX));
      setSidebarWidth(newWidth);
    }
  }, [isResizing]);

  const handleResizeEnd = useCallback(() => {
    setIsResizing(false);
  }, []);

  React.useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleResizeMove);
      document.addEventListener('mouseup', handleResizeEnd);
      return () => {
        document.removeEventListener('mousemove', handleResizeMove);
        document.removeEventListener('mouseup', handleResizeEnd);
      };
    }
  }, [isResizing, handleResizeMove, handleResizeEnd]);

  // Room drawing handlers with scroll preservation
  const handleMouseDown = (event) => {
    if (selectedTool !== 'room') return;
    
    event.preventDefault();
    const coords = getCanvasCoordinates(event);
    
    preserveScroll(() => {
      setIsDrawingRoom(true);
      setRoomDrawStart(coords);
      setCurrentDragRect({
        x: coords.x,
        y: coords.y,
        width: 0,
        height: 0
      });
    });
  };

  const handleMouseMove = (event) => {
    if (!isDrawingRoom || !roomDrawStart) return;
    
    event.preventDefault();
    const coords = getCanvasCoordinates(event);
    
    preserveScroll(() => {
      setCurrentDragRect({
        x: Math.min(roomDrawStart.x, coords.x),
        y: Math.min(roomDrawStart.y, coords.y),
        width: Math.abs(coords.x - roomDrawStart.x),
        height: Math.abs(coords.y - roomDrawStart.y)
      });
    });
  };

  const handleMouseUp = (event) => {
    if (!isDrawingRoom || !roomDrawStart) return;
    
    event.preventDefault();
    const coords = getCanvasCoordinates(event);
    
    const width = Math.abs(coords.x - roomDrawStart.x);
    const height = Math.abs(coords.y - roomDrawStart.y);
    
    preserveScroll(() => {
      if (width > 0.02 && height > 0.02) {
        const newRoom = {
          id: Date.now(),
          name: `Room ${rooms.length + 1}`,
          x: Math.min(roomDrawStart.x, coords.x),
          y: Math.min(roomDrawStart.y, coords.y),
          width: width,
          height: height
        };
        setRooms(prev => [...prev, newRoom]);
      }
      
      setIsDrawingRoom(false);
      setRoomDrawStart(null);
      setCurrentDragRect(null);
    });
  };

  const handleCanvasClick = (event) => {
    if (selectedTool && selectedTool !== 'room') {
      const coords = getCanvasCoordinates(event);
      addEquipment(coords.x, coords.y);
    }
  };

  // Remove functions
  const removeEquipment = (id) => {
    setEquipment(prev => prev.filter(item => item.id !== id));
  };

  const removeRoom = (id) => {
    setRooms(prev => prev.filter(room => room.id !== id));
    if (selectedRoom && selectedRoom.id === id) {
      setSelectedRoom(null);
    }
  };

  const handleRoomClick = (room) => {
    setSelectedRoom(room);
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Select tool - preserve scroll position
  const selectTool = useCallback((toolKey) => {
    preserveScroll(() => {
      setSelectedTool(toolKey);
      setIsDrawingRoom(false);
      setRoomDrawStart(null);
      setCurrentDragRect(null);
    });
  }, []);

  // Clear tool selection - preserve scroll position
  const clearToolSelection = useCallback(() => {
    preserveScroll(() => {
      setSelectedTool(null);
      setIsDrawingRoom(false);
      setRoomDrawStart(null);
      setCurrentDragRect(null);
    });
  }, []);

  // Toggle room labels - preserve scroll position
  const toggleRoomLabels = useCallback(() => {
    preserveScroll(() => {
      setShowRoomLabels(prev => !prev);
    });
  }, []);

  // Update room callback
  const updateRoom = useCallback((updatedRoom) => {
    setRooms(prev => prev.map(r => 
      r.id === updatedRoom.id ? updatedRoom : r
    ));
  }, []);

  // Render room
  const renderRoom = (room, isInteractive = false) => {
    const style = {
      position: 'absolute',
      left: `${room.x * 100}%`,
      top: `${room.y * 100}%`,
      width: `${room.width * 100}%`,
      height: `${room.height * 100}%`
    };

    const shouldShowLabel = showRoomLabels && room.name && room.name.trim() !== '';

    if (isInteractive) {
      return (
        <div
          key={room.id}
          onClick={() => handleRoomClick(room)}
          className="border-2 border-emerald-600 bg-emerald-50 bg-opacity-20 hover:bg-opacity-30 cursor-pointer transition-all flex items-center justify-center group"
          style={style}
        >
          {shouldShowLabel && (
            <span className="text-sm font-semibold text-emerald-700 group-hover:scale-105 transition-transform bg-white bg-opacity-95 px-3 py-1 rounded-md shadow-sm">
              {room.name}
            </span>
          )}
        </div>
      );
    } else {
      return (
        <div
          key={room.id}
          className="border-2 border-red-500 bg-red-50 bg-opacity-20 flex items-center justify-center pointer-events-none"
          style={style}
        >
          {shouldShowLabel && (
            <span className="text-sm font-semibold text-red-600 bg-white bg-opacity-90 px-2 py-1 rounded">
              {room.name}
            </span>
          )}
        </div>
      );
    }
  };

  // Render equipment
  const renderEquipment = (item, isView = false) => {
    const size = isView ? 'w-7 h-7' : 'w-8 h-8';
    const IconComponent = EQUIPMENT_TYPES[item.type].icon;
    
    return (
      <div
        key={item.id}
        className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
        style={{ 
          left: `${item.x * 100}%`, 
          top: `${item.y * 100}%`,
          pointerEvents: isView ? 'auto' : 'none'
        }}
        title={`${item.subType} (${item.status})`}
      >
        <div 
          className={`${size} rounded-full flex items-center justify-center shadow-md group-hover:scale-110 transition-transform bg-white border-2`}
          style={{ borderColor: EQUIPMENT_TYPES[item.type].color }}
        >
          <div style={{ color: EQUIPMENT_TYPES[item.type].color }}>
            <IconComponent />
          </div>
        </div>
      </div>
    );
  };

  // Render drag rectangle
  const renderDragRect = () => {
    if (!currentDragRect) return null;
    
    return (
      <div
        className="absolute border-2 border-dashed border-emerald-600 bg-emerald-50 bg-opacity-30 pointer-events-none"
        style={{
          left: `${currentDragRect.x * 100}%`,
          top: `${currentDragRect.y * 100}%`,
          width: `${currentDragRect.width * 100}%`,
          height: `${currentDragRect.height * 100}%`
        }}
      />
    );
  };

  // Dashboard View
  const DashboardView = () => (
    <div className="min-h-screen bg-gray-50">
      {/* User header */}
      <div className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowUserEmail(!showUserEmail)}
              className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center hover:bg-emerald-200 transition-colors"
              title="Click to show/hide email"
            >
              <Icons.User />
            </button>
            {showUserEmail && (
              <span className="text-sm text-gray-600 animate-slide-up">
                {user?.email}
              </span>
            )}
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <Icons.Logout />
            <span className="text-sm font-medium">Sign Out</span>
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Security Blueprint System
          </h1>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className="text-center">
              <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-3">
                <div className="text-emerald-600">
                  <Icons.Upload />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Create New Blueprint</h3>
              <p className="text-gray-600 text-sm mb-4">
                Upload your facility floor plan and map security equipment
              </p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-md font-semibold transition-colors shadow-sm hover:shadow-md"
              >
                Upload Blueprint Image
              </button>
            </div>
          </div>

          <BlueprintList onSelectBlueprint={handleSelectBlueprint} maxDisplay={2} />
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">System Features</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-2">
                <div className="text-emerald-600">
                  <Icons.Grid />
                </div>
              </div>
              <h4 className="font-semibold text-gray-900 text-sm mb-1">Zone Mapping</h4>
              <p className="text-gray-600 text-xs">Define interactive room zones on your blueprint</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-2">
                <div className="text-emerald-600">
                  <Icons.Search />
                </div>
              </div>
              <h4 className="font-semibold text-gray-900 text-sm mb-1">Equipment Tracking</h4>
              <p className="text-gray-600 text-xs">Place and track security equipment locations</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-2">
                <div className="text-emerald-600">
                  <Icons.Check />
                </div>
              </div>
              <h4 className="font-semibold text-gray-900 text-sm mb-1">Cloud Storage</h4>
              <p className="text-gray-600 text-xs">Save and access your blueprints from anywhere</p>
            </div>
          </div>
        </div>
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />
    </div>
  );

  // Edit Mode
  const EditView = () => (
    <div className="h-screen bg-gray-50 flex">
      <div 
        className="bg-white border-r border-gray-200 p-4 flex flex-col shadow-sm" 
        style={{ width: sidebarWidth, maxHeight: '100vh' }}
      >
        <div ref={sidebarScrollRef} className="overflow-y-auto flex-1">
          {/* Blueprint info - Using separated controlled components */}
          <div className="mb-6 pb-4 border-b border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Blueprint Details</h3>
            <div className="space-y-2">
              <BlueprintDetailsInput
                value={blueprintName}
                onChange={setBlueprintName}
                placeholder="Blueprint name..."
              />
              <BlueprintDetailsInput
                value={blueprintDescription}
                onChange={setBlueprintDescription}
                placeholder="Description (optional)..."
                isTextarea={true}
              />
            </div>
          </div>

          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Tools</h3>
              {selectedTool && (
                <button
                  onClick={clearToolSelection}
                  className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-md text-gray-600 transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
            
            {Object.entries(EQUIPMENT_TYPES).map(([key, tool]) => {
              const IconComponent = tool.icon;
              return (
                <button
                  key={key}
                  onClick={() => selectTool(key)}
                  className={`w-full p-3 mb-2 rounded-md border-2 transition-all flex items-start ${
                    selectedTool === key
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-700'
                      : 'border-gray-200 hover:border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className={`mr-3 mt-0.5 ${selectedTool === key ? 'text-emerald-600' : 'text-gray-500'}`}>
                    <IconComponent />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-sm">{tool.label}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {tool.types.join(', ')}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mb-6 space-y-2">
            <button
              onClick={clearAllRooms}
              className="w-full bg-red-50 hover:bg-red-100 text-red-700 py-2 px-4 rounded-md font-medium transition-colors border border-red-200"
            >
              Clear All Rooms
            </button>
            <button
              onClick={clearAllEquipment}
              className="w-full bg-orange-50 hover:bg-orange-100 text-orange-700 py-2 px-4 rounded-md font-medium transition-colors border border-orange-200"
            >
              Clear All Equipment
            </button>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Equipment ({equipment.length})</h3>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {equipment.map((item) => {
                const IconComponent = EQUIPMENT_TYPES[item.type].icon;
                return (
                  <div key={item.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-md border border-gray-200">
                    <span className="text-sm flex items-center text-gray-700">
                      <span className="mr-2 text-gray-500">
                        <IconComponent />
                      </span>
                      {item.subType}
                    </span>
                    <button
                      onClick={() => removeEquipment(item.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 p-1 rounded transition-colors"
                    >
                      <Icons.X />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900">Rooms ({rooms.length})</h3>
              <button
                onClick={toggleRoomLabels}
                className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-md text-gray-600 transition-colors flex items-center gap-1"
              >
                {showRoomLabels ? (
                  <>
                    <Icons.EyeOff />
                    Hide Labels
                  </>
                ) : (
                  <>
                    <Icons.Eye />
                    Show Labels
                  </>
                )}
              </button>
            </div>
            <div className="space-y-2">
              {rooms.map((room) => (
                <RoomNameInput 
                  key={room.id} 
                  room={room} 
                  onUpdate={updateRoom}
                  onDelete={() => removeRoom(room.id)}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-2 pt-4 border-t border-gray-200">
          <button
            onClick={handleSaveBlueprint}
            disabled={!blueprintImage || saving}
            className={`w-full py-2 px-4 rounded-md font-semibold transition-colors flex items-center justify-center gap-2 ${
              blueprintImage && !saving
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm hover:shadow-md' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {saving ? (
              <>
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : (
              <>
                <Icons.Save />
                {currentBlueprintId ? 'Update Blueprint' : 'Save Blueprint'}
              </>
            )}
          </button>
          <button
            onClick={() => setMode('view')}
            disabled={!blueprintImage}
            className={`w-full py-2 px-4 rounded-md font-semibold transition-colors ${
              blueprintImage 
                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            Preview Interactive
          </button>
          <button
            onClick={() => setMode('dashboard')}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-md font-semibold transition-colors border border-gray-300"
          >
            Back to Dashboard
          </button>
        </div>
      </div>

      <div
        className="w-1 bg-gray-200 hover:bg-emerald-600 cursor-col-resize flex-shrink-0 transition-colors"
        onMouseDown={handleResizeStart}
      />

      <div className="flex-1 p-6 overflow-auto flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-900">Blueprint Editor</h2>
            <p className="text-gray-600 text-sm mt-1">
              {selectedTool === 'room'
                ? 'Click and drag to define room zones'
                : selectedTool 
                ? `Click to place ${EQUIPMENT_TYPES[selectedTool]?.label}`
                : 'Select a tool from the sidebar to begin'
              }
            </p>
          </div>
          
          <div 
            ref={canvasRef}
            onClick={handleCanvasClick}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            className="relative cursor-crosshair"
            style={{
              width: CANVAS_WIDTH,
              height: CANVAS_HEIGHT,
              backgroundImage: blueprintImage ? `url(${blueprintImage})` : 'none',
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb'
            }}
          >
            {rooms.map((room) => renderRoom(room, false))}
            {equipment.map((item) => renderEquipment(item, false))}
            {renderDragRect()}
          </div>
        </div>
      </div>
    </div>
  );

  // View Mode
  const ViewMode = () => (
    <div className="h-screen bg-gray-50 flex">
      <div className="flex-1 p-6 flex flex-col">
        <div className="bg-white rounded-lg shadow-md flex flex-col h-full border border-gray-200">
          <div className="p-4 border-b border-gray-200 bg-gray-50 flex-shrink-0">
            <h2 className="text-2xl font-semibold text-gray-900">Interactive Security Layout</h2>
            <p className="text-gray-600 text-sm mt-1">Click on room zones to view equipment details</p>
          </div>
          
          <div className="flex-1 flex items-center justify-center p-6 bg-gray-50">
            <div 
              ref={canvasRef}
              className="relative shadow-sm"
              style={{
                width: CANVAS_WIDTH,
                height: CANVAS_HEIGHT,
                backgroundImage: blueprintImage ? `url(${blueprintImage})` : 'none',
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                backgroundColor: '#ffffff',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem'
              }}
            >
              {rooms.map((room) => renderRoom(room, true))}
              {equipment.map((item) => renderEquipment(item, true))}
            </div>
          </div>
        </div>
      </div>

      {selectedRoom && (
        <div className="w-96 bg-white border-l border-gray-200 flex flex-col shadow-lg">
          <div className="p-4 border-b border-gray-200 bg-gray-50 relative">
            <h3 className="text-xl font-semibold text-gray-900">
              {selectedRoom.name && selectedRoom.name.trim() !== '' ? selectedRoom.name : 'Zone Details'}
            </h3>
            <p className="text-gray-600 text-sm">Room Information</p>
            <button
              onClick={() => setSelectedRoom(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 hover:bg-gray-100 p-1 rounded transition-colors"
            >
              <Icons.X />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-4">
              <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
                <h4 className="font-semibold text-emerald-800 mb-3">Equipment in Zone</h4>
                <div className="space-y-2">
                  {equipment.filter(item => 
                    item.x >= selectedRoom.x && 
                    item.x <= selectedRoom.x + selectedRoom.width &&
                    item.y >= selectedRoom.y && 
                    item.y <= selectedRoom.y + selectedRoom.height
                  ).map((item) => {
                    const IconComponent = EQUIPMENT_TYPES[item.type].icon;
                    return (
                      <div key={item.id} className="flex items-center p-3 bg-white rounded-md border border-gray-200">
                        <span className="mr-3 text-emerald-600">
                          <IconComponent />
                        </span>
                        <div>
                          <div className="font-medium text-gray-900">{item.subType}</div>
                          <div className="text-sm text-gray-600">
                            Status: <span className="text-emerald-600 font-medium">{item.status}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {equipment.filter(item => 
                    item.x >= selectedRoom.x && 
                    item.x <= selectedRoom.x + selectedRoom.width &&
                    item.y >= selectedRoom.y && 
                    item.y <= selectedRoom.y + selectedRoom.height
                  ).length === 0 && (
                    <p className="text-gray-500 text-sm italic">No equipment in this zone</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="absolute top-4 right-4 space-x-2">
        <button
          onClick={() => setMode('edit')}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-md font-semibold shadow-md hover:shadow-lg transition-all"
        >
          Edit Blueprint
        </button>
        <button
          onClick={() => setMode('dashboard')}
          className="bg-white hover:bg-gray-50 text-gray-700 px-5 py-2 rounded-md font-semibold shadow-md hover:shadow-lg transition-all border border-gray-300"
        >
          Dashboard
        </button>
      </div>
    </div>
  );

  return (
    <>
      <div>
        {mode === 'dashboard' && <DashboardView />}
        {mode === 'edit' && <EditView />}
        {mode === 'view' && <ViewMode />}
      </div>
      
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
};

export default BlueprintCreator;