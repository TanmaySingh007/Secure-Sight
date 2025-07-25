import React from 'react';
import { CalendarDays, Disc, EllipsisVertical } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export const IncidentPlayer = () => {
  const cameraThumbnails = [
    { id: 1, name: 'Camera - 02', image: 'https://images.pexels.com/photos/2882552/pexels-photo-2882552.jpeg?auto=compress&cs=tinysrgb&w=120&h=67&fit=crop' },
    { id: 2, name: 'Camera - 03', image: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=120&h=67&fit=crop' },
  ];

  return (
    <div className="relative h-[450px] rounded-md overflow-hidden bg-gradient-to-br from-gray-900 to-black flex-1">
      {/* Main camera feed background */}
      <div 
        className="relative h-full bg-cover bg-center"
        style={{
          backgroundImage: 'url(https://images.pexels.com/photos/2882552/pexels-photo-2882552.jpeg?auto=compress&cs=tinysrgb&w=800&h=450&fit=crop)'
        }}
      >
        {/* Gradient overlay at bottom */}
        <div className="absolute w-full h-[116px] bottom-0 left-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        {/* Overall overlay */}
        <div className="absolute w-full h-full top-0 left-0 bg-black/20" />

        {/* Camera label */}
        <div className="absolute bottom-4 left-2">
          <Badge className="pl-2.5 pr-2 py-0.5 bg-neutral-950/80 border-neutral-700 flex items-center gap-1">
            <Disc className="w-3 h-3 text-red-500" />
            <span className="text-neutral-300 text-sm font-medium">
              Camera - 01
            </span>
          </Badge>
        </div>

        {/* Camera thumbnails */}
        <div className="absolute bottom-[76px] right-[20px] flex items-center gap-3">
          {cameraThumbnails.map((camera) => (
            <div
              key={camera.id}
              className="flex flex-col w-[120px] items-start rounded overflow-hidden border border-white/20"
            >
              <div className="flex w-full items-center justify-between px-2 py-1 bg-neutral-950/80">
                <div className="text-neutral-300 text-xs font-medium">
                  {camera.name}
                </div>
                <EllipsisVertical className="w-3 h-3 text-neutral-400" />
              </div>
              <div className="relative w-full h-[67px]">
                <img
                  className="w-full h-full object-cover"
                  alt="Camera feed thumbnail"
                  src={camera.image}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Timestamp */}
        <div className="absolute top-2 left-2">
          <Badge className="pl-1.5 pr-2 py-0.5 bg-stone-900/80 flex items-center gap-1">
            <CalendarDays className="w-3 h-3 text-stone-300" />
            <span className="text-stone-300 text-xs font-medium">
              {new Date().toLocaleDateString('en-GB')} - {new Date().toLocaleTimeString('en-GB', { hour12: false })}
            </span>
          </Badge>
        </div>
      </div>
    </div>
  );
};