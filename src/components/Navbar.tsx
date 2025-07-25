import React from 'react';
import { 
  LayoutDashboard, 
  Camera, 
  Image, 
  AlertTriangle, 
  Users, 
  ChevronDown 
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export const Navbar = () => {
  const navigationItems = [
    { name: 'Dashboard', icon: LayoutDashboard, active: true },
    { name: 'Cameras', icon: Camera },
    { name: 'Scenes', icon: Image },
    { name: 'Incidents', icon: AlertTriangle },
    { name: 'Users', icon: Users },
  ];

  return (
    <header className="flex w-full items-center justify-between pt-4 pb-3 px-6 border-b border-white/15 bg-gradient-to-b from-[#151515] to-black">
      {/* Logo section */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2.5">
          <div className="relative w-5 h-6">
            <div className="w-2.5 h-4 bg-yellow-400 rounded-sm absolute top-2.5 left-1.5" />
            <div className="w-5 h-5 border-2 border-yellow-400 rounded absolute top-0 left-0" />
          </div>
          <div className="font-['Plus_Jakarta_Sans'] text-white text-base">
            <span className="font-normal">MANDLAC</span>
            <span className="font-extrabold">X</span>
          </div>
        </div>
      </div>

      {/* Navigation section */}
      <nav className="flex items-center gap-4">
        {navigationItems.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <Button
              key={index}
              variant="ghost"
              className={`flex items-center gap-1.5 px-3 py-2.5 rounded-md text-white hover:bg-white/10 ${
                item.active ? 'bg-white/10' : ''
              }`}
            >
              <IconComponent className="w-4 h-4" />
              <span className="font-['Plus_Jakarta_Sans'] font-bold text-xs">
                {item.name}
              </span>
            </Button>
          );
        })}
      </nav>

      {/* User profile section */}
      <div className="flex items-center gap-2 p-2 w-[200px] rounded-md">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center">
          <span className="text-white text-sm font-semibold">TS</span>
        </div>
        <div className="flex flex-col items-start gap-0.5 flex-1">
          <div className="text-neutral-100 text-sm font-semibold">
            Tanmay Singh
          </div>
          <div className="text-neutral-100 text-xs">
            tanmaysingh08580@gmail.com
          </div>
        </div>
        <ChevronDown className="w-4 h-4 text-white" />
      </div>
    </header>
  );
};