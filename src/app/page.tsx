import { Navbar } from '@/components/Navbar';
import { IncidentPlayer } from '@/components/IncidentPlayer';
import { IncidentList } from '@/components/IncidentList';
import { IncidentTimeline } from '@/components/IncidentTimeline';

export default function Home() {
  return (
    <div className="flex justify-center w-full min-h-screen">
      <div className="w-full max-w-[1440px] bg-gradient-to-b from-[#151515] to-black">
        <div className="relative w-full">
          {/* Background glow effect */}
          <div className="absolute w-[108px] h-[725px] top-[-308px] left-[665px] bg-[#d0a70459] rounded-[54px/362.5px] -rotate-90 blur-[100px]" />

          {/* Header section */}
          <Navbar />

          {/* Main content container */}
          <div className="w-full p-6 flex flex-col gap-6">
            {/* Camera feed and incidents */}
            <div className="flex items-start gap-6 relative self-stretch w-full">
              <IncidentPlayer />
              <IncidentList />
            </div>

            {/* Timeline section */}
            <IncidentTimeline />
          </div>
        </div>
      </div>
    </div>
  );
}