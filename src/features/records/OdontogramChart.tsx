import React, { useState } from 'react';
import type { ToothCondition, ToothConditionType } from '../../types';
import { ToothDetailModal } from './ToothDetailModal';
import { Activity } from 'lucide-react';

interface OdontogramChartProps {
  patientId: string;
  teethConditions: ToothCondition[];
  onUpdateTooth: (toothNumber: number, condition: ToothCondition) => void;
}

// Convert Universal Tooth Number (1-32) to FDI Notation (11-48)
function universalToFDI(uNum: number): number {
  if (uNum >= 1 && uNum <= 8) return 10 + (9 - uNum);
  if (uNum >= 9 && uNum <= 16) return 20 + (uNum - 8);
  if (uNum >= 17 && uNum <= 24) return 30 + (25 - uNum);
  if (uNum >= 25 && uNum <= 32) return 40 + (uNum - 24);
  return uNum;
}

export const OdontogramChart: React.FC<OdontogramChartProps> = ({
  teethConditions,
  onUpdateTooth,
}) => {
  const [selectedTooth, setSelectedTooth] = useState<number | null>(null);
  const [notationSystem, setNotationSystem] = useState<'UNIVERSAL' | 'FDI'>('UNIVERSAL');

  // Universal Adult Teeth Mapping
  const maxillaryArch = Array.from({ length: 16 }, (_, i) => i + 1); // 1 to 16
  const mandibularArch = Array.from({ length: 16 }, (_, i) => 32 - i); // 32 down to 17

  const conditionMap = new Map<number, ToothCondition>();
  teethConditions.forEach((tc) => conditionMap.set(tc.toothNumber, tc));

  const conditionStyles: Record<ToothConditionType, { bg: string; text: string; border: string; label: string }> = {
    HEALTHY: { bg: 'bg-emerald-50 hover:bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-300', label: 'OK' },
    CARIES: { bg: 'bg-red-500 text-white', text: 'text-white', border: 'border-red-600', label: 'CARIES' },
    ROOT_CANAL: { bg: 'bg-purple-600 text-white', text: 'text-white', border: 'border-purple-700', label: 'ROOT CANAL' },
    CROWN: { bg: 'bg-amber-400 text-slate-900', text: 'text-slate-900', border: 'border-amber-500', label: 'CROWN' },
    FILLING: { bg: 'bg-blue-500 text-white', text: 'text-white', border: 'border-blue-600', label: 'FILLING' },
    EXTRACTION_NEEDED: { bg: 'bg-rose-700 text-white', text: 'text-white', border: 'border-rose-800', label: 'EXTRACT' },
    MISSING: { bg: 'bg-slate-200 text-slate-500', text: 'text-slate-500', border: 'border-slate-300', label: 'MISSING' },
    IMPLANT: { bg: 'bg-sky-500 text-white', text: 'text-white', border: 'border-sky-600', label: 'IMPLANT' },
    BRIDGE: { bg: 'bg-orange-500 text-white', text: 'text-white', border: 'border-orange-600', label: 'BRIDGE' },
  };

  const activeToothCondition = selectedTooth ? conditionMap.get(selectedTooth) : undefined;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
      {/* Chart Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4 border-slate-100">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
            <Activity className="w-5 h-5 text-blue-600" />
            <span>Interactive Dental Odontogram Chart</span>
          </h3>
          <p className="text-xs text-slate-500">
            Visual adult dental arch condition tracking and pathology logging
          </p>
        </div>

        {/* Notation System Switch */}
        <div className="flex items-center space-x-2 bg-slate-100 p-1 rounded-xl text-xs font-bold border border-slate-200">
          <span className="text-slate-500 px-2 text-[10px] uppercase tracking-wider">Notation:</span>
          <button
            onClick={() => setNotationSystem('UNIVERSAL')}
            className={`px-3 py-1 rounded-lg transition-colors ${
              notationSystem === 'UNIVERSAL' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Universal (1-32)
          </button>
          <button
            onClick={() => setNotationSystem('FDI')}
            className={`px-3 py-1 rounded-lg transition-colors ${
              notationSystem === 'FDI' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            FDI World Dental
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 flex flex-wrap gap-2 text-[10px] font-bold">
        <span className="text-slate-400 self-center uppercase mr-1">Condition Legend:</span>
        <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">HEALTHY</span>
        <span className="px-2 py-0.5 rounded bg-red-500 text-white">CARIES</span>
        <span className="px-2 py-0.5 rounded bg-purple-600 text-white">ROOT CANAL</span>
        <span className="px-2 py-0.5 rounded bg-amber-400 text-slate-900">CROWN</span>
        <span className="px-2 py-0.5 rounded bg-blue-500 text-white">FILLING</span>
        <span className="px-2 py-0.5 rounded bg-rose-700 text-white">EXTRACTION NEEDED</span>
        <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-700">MISSING</span>
        <span className="px-2 py-0.5 rounded bg-sky-500 text-white">IMPLANT</span>
        <span className="px-2 py-0.5 rounded bg-orange-500 text-white">BRIDGE</span>
      </div>

      {/* Dental Arch Charts */}
      <div className="space-y-8 overflow-x-auto pb-2">
        {/* Maxillary Arch (Upper Arch #1 - #16) */}
        <div className="space-y-2 min-w-[700px]">
          <div className="flex justify-between items-center text-xs font-bold text-slate-500 uppercase tracking-wider">
            <span>Maxillary Arch (Upper Teeth #1 - #16)</span>
            <span className="text-[10px] text-slate-400">Right → Left</span>
          </div>

          <div className="grid grid-cols-[repeat(16,minmax(0,1fr))] gap-1.5">
            {maxillaryArch.map((uNum) => {
              const condObj = conditionMap.get(uNum);
              const condType = condObj ? condObj.condition : 'HEALTHY';
              const style = conditionStyles[condType];
              const displayNumber = notationSystem === 'UNIVERSAL' ? uNum : universalToFDI(uNum);

              return (
                <button
                  key={uNum}
                  onClick={() => setSelectedTooth(uNum)}
                  className={`flex flex-col items-center justify-between p-2 rounded-xl border-2 ${style.border} ${style.bg} transition-all transform hover:-translate-y-1 shadow-xs group cursor-pointer h-24`}
                >
                  <span className="text-[10px] font-mono font-extrabold text-slate-400">
                    U#{displayNumber}
                  </span>

                  {/* Tooth SVG Icon Representation */}
                  <div className="w-8 h-10 flex items-center justify-center font-extrabold text-sm border border-slate-900/10 rounded-lg bg-white/40">
                    {displayNumber}
                  </div>

                  <span className="text-[9px] font-extrabold uppercase tracking-tighter truncate w-full text-center">
                    {style.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Mandibular Arch (Lower Arch #17 - #32) */}
        <div className="space-y-2 min-w-[700px]">
          <div className="flex justify-between items-center text-xs font-bold text-slate-500 uppercase tracking-wider">
            <span>Mandibular Arch (Lower Teeth #17 - #32)</span>
            <span className="text-[10px] text-slate-400">Left → Right</span>
          </div>

          <div className="grid grid-cols-[repeat(16,minmax(0,1fr))] gap-1.5">
            {mandibularArch.map((uNum) => {
              const condObj = conditionMap.get(uNum);
              const condType = condObj ? condObj.condition : 'HEALTHY';
              const style = conditionStyles[condType];
              const displayNumber = notationSystem === 'UNIVERSAL' ? uNum : universalToFDI(uNum);

              return (
                <button
                  key={uNum}
                  onClick={() => setSelectedTooth(uNum)}
                  className={`flex flex-col items-center justify-between p-2 rounded-xl border-2 ${style.border} ${style.bg} transition-all transform hover:translate-y-1 shadow-xs group cursor-pointer h-24`}
                >
                  <span className="text-[10px] font-mono font-extrabold text-slate-400">
                    L#{displayNumber}
                  </span>

                  <div className="w-8 h-10 flex items-center justify-center font-extrabold text-sm border border-slate-900/10 rounded-lg bg-white/40">
                    {displayNumber}
                  </div>

                  <span className="text-[9px] font-extrabold uppercase tracking-tighter truncate w-full text-center">
                    {style.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tooth Detail Modal */}
      {selectedTooth && (
        <ToothDetailModal
          toothNumber={selectedTooth}
          fdiNotation={universalToFDI(selectedTooth)}
          toothCondition={activeToothCondition}
          isOpen={selectedTooth !== null}
          onClose={() => setSelectedTooth(null)}
          onSaveCondition={(cond) => onUpdateTooth(selectedTooth, cond)}
        />
      )}
    </div>
  );
};
