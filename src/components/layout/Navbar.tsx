import React from 'react';
import { useDentalStore } from '../../store/useDentalStore';
import { Search, Plus, Calendar, Activity } from 'lucide-react';

interface NavbarProps {
  onNewPatientClick: () => void;
  onNewAppointmentClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onNewPatientClick,
  onNewAppointmentClick,
}) => {
  const { searchQuery, setSearchQuery } = useDentalStore();

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Header */}
        <div className="flex items-center space-x-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-md">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-base tracking-tight text-white">ApexDental</span>
              <span className="text-[10px] bg-blue-600/30 text-blue-400 font-bold px-1.5 py-0.5 rounded border border-blue-500/30">
                PRO
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium">Clinical Patient Management & Odontogram System</p>
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="flex-1 max-w-md hidden md:block">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Quick search patients by name, ID, phone..."
              className="w-full bg-slate-800 text-slate-100 text-xs rounded-xl pl-9 pr-4 py-2 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-slate-400 transition-all"
            />
          </div>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center space-x-2.5">
          <button
            onClick={onNewPatientClick}
            className="flex items-center space-x-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Patient</span>
          </button>

          <button
            onClick={onNewAppointmentClick}
            className="flex items-center space-x-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition-all border border-slate-700"
          >
            <Calendar className="w-4 h-4 text-blue-400" />
            <span className="hidden sm:inline">Schedule</span>
          </button>
        </div>
      </div>
    </header>
  );
};
