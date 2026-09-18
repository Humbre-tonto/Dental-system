import React from 'react';
import { useDentalStore } from '../../store/useDentalStore';
import { Users, Calendar, Database } from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab } = useDentalStore();

  const navItems = [
    { id: 'directory', label: 'Patient Directory', icon: Users },
    { id: 'schedule', label: 'Appointment Schedule', icon: Calendar },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 text-slate-300 min-h-[calc(100vh-4rem)] p-4 flex flex-col justify-between shrink-0">
      <div className="space-y-6">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3">
            Navigation
          </span>
          <nav className="mt-2 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id || (activeTab === 'profile' && item.id === 'directory');
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as 'directory' | 'schedule')}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* IndexedDB Status Footer Indicator */}
      <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-3 text-xs space-y-1">
        <div className="flex items-center space-x-2 text-emerald-400 font-bold text-[11px]">
          <Database className="w-3.5 h-3.5" />
          <span>Client Persistence Active</span>
        </div>
        <p className="text-[10px] text-slate-400">
          ApexDental SPA v1.0
        </p>
      </div>
    </aside>
  );
};
