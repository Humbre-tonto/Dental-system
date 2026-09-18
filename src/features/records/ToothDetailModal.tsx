import React from 'react';
import type { ToothCondition, ToothConditionType } from '../../types';
import { X, Save } from 'lucide-react';

interface ToothDetailModalProps {
  toothNumber: number;
  fdiNotation: number;
  toothCondition?: ToothCondition;
  isOpen: boolean;
  onClose: () => void;
  onSaveCondition: (condition: ToothCondition) => void;
}

const CONDITION_OPTIONS: { type: ToothConditionType; label: string; color: string }[] = [
  { type: 'HEALTHY', label: 'Healthy / Intact', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
  { type: 'CARIES', label: 'Dental Caries (Cavity)', color: 'bg-red-100 text-red-800 border-red-300' },
  { type: 'ROOT_CANAL', label: 'Root Canal Treated (RCT)', color: 'bg-purple-100 text-purple-800 border-purple-300' },
  { type: 'CROWN', label: 'Crown / Cap', color: 'bg-amber-100 text-amber-800 border-amber-300' },
  { type: 'FILLING', label: 'Composite / Amalgam Filling', color: 'bg-blue-100 text-blue-800 border-blue-300' },
  { type: 'EXTRACTION_NEEDED', label: 'Indicated for Extraction', color: 'bg-rose-100 text-rose-800 border-rose-300' },
  { type: 'MISSING', label: 'Missing / Previously Extracted', color: 'bg-slate-200 text-slate-800 border-slate-300' },
  { type: 'IMPLANT', label: 'Dental Implant', color: 'bg-sky-100 text-sky-800 border-sky-300' },
  { type: 'BRIDGE', label: 'Pontic / Bridge Abutment', color: 'bg-orange-100 text-orange-800 border-orange-300' },
];

export const ToothDetailModal: React.FC<ToothDetailModalProps> = ({
  toothNumber,
  fdiNotation,
  toothCondition,
  isOpen,
  onClose,
  onSaveCondition,
}) => {
  const [selectedCondition, setSelectedCondition] = React.useState<ToothConditionType>(
    toothCondition?.condition || 'HEALTHY'
  );
  const [notes, setNotes] = React.useState(toothCondition?.notes || '');
  const [surfaces, setSurfaces] = React.useState<('M' | 'O' | 'D' | 'B' | 'L')[]>(
    toothCondition?.surfaces || []
  );

  if (!isOpen) return null;

  const toggleSurface = (surf: 'M' | 'O' | 'D' | 'B' | 'L') => {
    setSurfaces((prev) =>
      prev.includes(surf) ? prev.filter((s) => s !== surf) : [...prev, surf]
    );
  };

  const handleSave = () => {
    onSaveCondition({
      toothNumber,
      condition: selectedCondition,
      notes,
      surfaces,
      updatedAt: new Date().toISOString().split('T')[0],
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
          <div>
            <h3 className="text-base font-bold">Tooth #{toothNumber} Charting Detail</h3>
            <p className="text-xs text-slate-400 font-mono">
              Universal #{toothNumber} • FDI Notation #{fdiNotation}
            </p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Condition Selector Grid */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Select Current Tooth Pathology / Status
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {CONDITION_OPTIONS.map((opt) => (
                <button
                  key={opt.type}
                  type="button"
                  onClick={() => setSelectedCondition(opt.type)}
                  className={`p-2.5 rounded-xl text-xs font-bold border text-left transition-all flex items-center justify-between ${
                    selectedCondition === opt.type
                      ? `${opt.color} ring-2 ring-blue-600 shadow-xs`
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span>{opt.label}</span>
                  {selectedCondition === opt.type && (
                    <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Tooth Surface Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Affected Tooth Surfaces
            </label>
            <div className="flex items-center space-x-2">
              {[
                { key: 'M', name: 'Mesial (M)' },
                { key: 'O', name: 'Occlusal (O)' },
                { key: 'D', name: 'Distal (D)' },
                { key: 'B', name: 'Buccal (B)' },
                { key: 'L', name: 'Lingual (L)' },
              ].map((s) => {
                const active = surfaces.includes(s.key as any);
                return (
                  <button
                    key={s.key}
                    type="button"
                    onClick={() => toggleSurface(s.key as any)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-extrabold border transition-colors ${
                      active
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {s.key}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Clinical Notes */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Odontogram Clinical Note / History
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="E.g. Class II composite restoration placed, recurrent decay observed..."
              className="w-full text-xs border border-slate-200 rounded-xl p-3 h-24 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-2 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-sm"
            >
              <Save className="w-4 h-4" />
              <span>Update Odontogram</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
