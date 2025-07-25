'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

interface Camera {
  id: string;
  name: string;
  location: string;
}

interface Incident {
  id: string;
  cameraId: string;
  camera: Camera;
  type: string;
  tsStart: string;
  tsEnd: string;
  thumbnailUrl: string;
  resolved: boolean;
}

export const IncidentTimeline = () => {
  const [scrubberPosition, setScrubberPosition] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const timelineRef = useRef<HTMLDivElement>(null);

  const { data: incidents = [] } = useQuery<Incident[]>({
    queryKey: ['incidents', 'all'],
    queryFn: async () => {
      const response = await fetch('/api/incidents');
      if (!response.ok) {
        throw new Error('Failed to fetch incidents');
      }
      return response.json();
    },
  });

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    updateScrubberPosition(e);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      updateScrubberPosition(e);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const updateScrubberPosition = (e: MouseEvent | React.MouseEvent) => {
    if (timelineRef.current) {
      const rect = timelineRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
      setScrubberPosition(percentage);
    }
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging]);

  const getIncidentPosition = (incident: Incident) => {
    const startTime = new Date(incident.tsStart);
    const hours = startTime.getHours();
    const minutes = startTime.getMinutes();
    const totalMinutes = hours * 60 + minutes;
    return (totalMinutes / (24 * 60)) * 100;
  };

  const getIncidentColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'unauthorized access':
        return '#f97316';
      case 'gun threat':
        return '#ef4444';
      case 'face recognized':
        return '#3b82f6';
      default:
        return '#eab308';
    }
  };

  const getCurrentTime = () => {
    const percentage = scrubberPosition;
    const totalMinutes = (percentage / 100) * 24 * 60;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = Math.floor(totalMinutes % 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full bg-[#131313] rounded-md p-4">
      <h3 className="text-white text-lg font-semibold mb-4">24-Hour Incident Timeline</h3>
      
      <div className="relative">
        {/* Timeline ruler */}
        <div className="flex justify-between mb-2">
          {Array.from({ length: 25 }, (_, i) => (
            <div key={i} className="text-xs text-stone-200 font-mono">
              {i.toString().padStart(2, '0')}:00
            </div>
          ))}
        </div>

        {/* Timeline track */}
        <div
          ref={timelineRef}
          className="relative h-16 bg-neutral-800 rounded cursor-pointer"
          onMouseDown={handleMouseDown}
        >
          {/* Hour markers */}
          <div className="absolute inset-0 flex">
            {Array.from({ length: 24 }, (_, i) => (
              <div
                key={i}
                className="flex-1 border-r border-neutral-600 last:border-r-0"
              />
            ))}
          </div>

          {/* Incident markers */}
          {incidents.map((incident) => (
            <div
              key={incident.id}
              className="absolute top-2 w-3 h-3 rounded-full border-2 border-white cursor-pointer hover:scale-125 transition-transform"
              style={{
                left: `${getIncidentPosition(incident)}%`,
                backgroundColor: getIncidentColor(incident.type),
              }}
              title={`${incident.type} - ${incident.camera.name} at ${new Date(incident.tsStart).toLocaleTimeString()}`}
            />
          ))}

          {/* Scrubber */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-yellow-400 cursor-grab active:cursor-grabbing"
            style={{ left: `${scrubberPosition}%` }}
          >
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-black px-2 py-1 rounded text-xs font-mono">
              {getCurrentTime()}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex gap-4 mt-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-orange-500" />
            <span className="text-white">Unauthorized Access</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span className="text-white">Gun Threat</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span className="text-white">Face Recognized</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <span className="text-white">Other</span>
          </div>
        </div>
      </div>
    </div>
  );
};