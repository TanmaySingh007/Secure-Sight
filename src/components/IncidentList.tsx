'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AlertTriangle, CheckCheck, DoorOpen, Plus, UserSearch } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatTimeRange } from '@/lib/utils';

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

const getIncidentIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case 'unauthorized access':
      return <DoorOpen className="w-3 h-3" />;
    case 'gun threat':
      return <Plus className="w-3 h-3" />;
    case 'face recognized':
      return <UserSearch className="w-3 h-3" />;
    default:
      return <AlertTriangle className="w-3 h-3" />;
  }
};

const getIncidentColor = (type: string) => {
  switch (type.toLowerCase()) {
    case 'unauthorized access':
      return 'bg-orange-950 border-orange-500';
    case 'gun threat':
      return 'bg-red-950 border-red-500';
    case 'face recognized':
      return 'bg-blue-950 border-blue-500';
    default:
      return 'bg-yellow-950 border-yellow-500';
  }
};

const getPlaceholderImage = (index: number) => {
  const images = [
    'https://images.pexels.com/photos/2882552/pexels-photo-2882552.jpeg?auto=compress&cs=tinysrgb&w=120&h=67&fit=crop',
    'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=120&h=67&fit=crop',
    'https://images.pexels.com/photos/416978/pexels-photo-416978.jpeg?auto=compress&cs=tinysrgb&w=120&h=67&fit=crop',
    'https://images.pexels.com/photos/2346091/pexels-photo-2346091.jpeg?auto=compress&cs=tinysrgb&w=120&h=67&fit=crop',
    'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=120&h=67&fit=crop',
  ];
  return images[index % images.length];
};

export const IncidentList = () => {
  const [optimisticResolves, setOptimisticResolves] = useState<Set<string>>(new Set());
  const queryClient = useQueryClient();

  const { data: incidents = [], isLoading } = useQuery<Incident[]>({
    queryKey: ['incidents', 'unresolved'],
    queryFn: async () => {
      const response = await fetch('/api/incidents?resolved=false');
      if (!response.ok) {
        throw new Error('Failed to fetch incidents');
      }
      return response.json();
    },
  });

  const resolveMutation = useMutation({
    mutationFn: async (incidentId: string) => {
      const response = await fetch(`/api/incidents/${incidentId}/resolve`, {
        method: 'PATCH',
      });
      if (!response.ok) {
        throw new Error('Failed to resolve incident');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incidents'] });
    },
    onError: (error, incidentId) => {
      // Revert optimistic update on error
      setOptimisticResolves(prev => {
        const newSet = new Set(prev);
        newSet.delete(incidentId);
        return newSet;
      });
      console.error('Failed to resolve incident:', error);
    },
  });

  const handleResolve = (incidentId: string) => {
    // Optimistic update
    setOptimisticResolves(prev => new Set(prev).add(incidentId));
    resolveMutation.mutate(incidentId);
  };

  const visibleIncidents = incidents.filter(incident => !optimisticResolves.has(incident.id));
  const unresolvedCount = visibleIncidents.length;

  if (isLoading) {
    return (
      <Card className="flex-1 h-[450px] bg-[#131313] rounded-md border-none">
        <CardContent className="p-6 flex items-center justify-center h-full">
          <div className="text-neutral-400">Loading incidents...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="flex-1 h-[450px] bg-[#131313] rounded-md border-none">
      <CardHeader className="p-4 flex flex-row items-center gap-2">
        <div className="w-[26px] h-[26px] bg-red-900 rounded-full border-2 border-red-950 flex items-center justify-center">
          <AlertTriangle className="w-3 h-3 text-red-400" />
        </div>

        <div className="flex flex-col items-start gap-1.5 flex-1">
          <h3 className="text-neutral-50 text-lg font-semibold">
            {unresolvedCount} Unresolved Incidents
          </h3>
        </div>

        <div className="flex items-center gap-1">
          <div className="flex items-center">
            <Badge className="p-1 bg-orange-950 rounded-full">
              <DoorOpen className="w-3 h-3" />
            </Badge>
            <Badge className="p-1 bg-red-950 rounded-full -ml-1">
              <Plus className="w-3 h-3" />
            </Badge>
            <Badge className="p-1 bg-blue-950 rounded-full -ml-1">
              <UserSearch className="w-3 h-3" />
            </Badge>
          </div>

          <Badge className="pl-1.5 pr-2 py-0.5 bg-neutral-950 rounded-full border-neutral-700">
            <CheckCheck className="w-3 h-3 mr-1" />
            <span className="text-neutral-300 text-xs font-medium">
              {incidents.length - unresolvedCount} resolved incidents
            </span>
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="gap-4 pt-0 pb-6 px-3 overflow-auto max-h-[370px]">
        {visibleIncidents.map((incident, index) => (
          <div
            key={incident.id}
            className={`flex items-center gap-4 pl-1 pr-3 py-1 rounded-md overflow-hidden hover:bg-neutral-800/30 transition-all duration-200 ${
              optimisticResolves.has(incident.id) ? 'opacity-50 scale-95' : ''
            }`}
          >
            <div className="relative w-[120px] h-[67px]">
              <div className="relative w-full h-full bg-gray-800 rounded-md border border-white/20 overflow-hidden">
                <img
                  className="w-full h-full object-cover"
                  alt="Incident thumbnail"
                  src={getPlaceholderImage(index)}
                />
              </div>
            </div>

            <div className="flex flex-col h-[67px] items-start justify-between flex-1">
              <div className="flex items-center gap-1 self-stretch w-full">
                <div className={`relative w-4 h-4 rounded-full p-1 ${getIncidentColor(incident.type)}`}>
                  {getIncidentIcon(incident.type)}
                </div>
                <div className="font-bold text-white text-xs">
                  {incident.type}
                </div>
              </div>

              <div className="flex flex-col items-start gap-1 self-stretch w-full">
                <div className="flex items-center gap-1">
                  <div className="w-2.5 h-2.5 bg-gray-400 rounded-full" />
                  <div className="font-normal text-white text-xs">
                    {incident.camera.location}
                  </div>
                </div>

                <div className="flex items-center gap-1 self-stretch w-full">
                  <div className="w-2 h-2.5 bg-gray-400 rounded-sm" />
                  <div className="font-bold text-white text-xs">
                    {formatTimeRange(new Date(incident.tsStart), new Date(incident.tsEnd))}
                  </div>
                </div>
              </div>
            </div>

            <Button
              variant="ghost"
              className="flex items-center gap-1 px-3 py-2.5 hover:bg-transparent"
              onClick={() => handleResolve(incident.id)}
              disabled={optimisticResolves.has(incident.id)}
            >
              <span className="font-bold text-[#ffcc00] text-xs">
                {optimisticResolves.has(incident.id) ? 'Resolving...' : 'Resolve'}
              </span>
              <div className="relative w-4 h-4">
                <div className="w-1.5 h-2 bg-[#ffcc00] transform rotate-45" />
              </div>
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};