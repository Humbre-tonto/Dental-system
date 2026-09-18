import React, { useState } from 'react';
import type { ClinicalNote } from '../../types';
import { AddClinicalNoteModal } from './AddClinicalNoteModal';
import { Plus, FileText, Calendar, UserCheck, Hash } from 'lucide-react';

interface ClinicalNotesListProps {
  patientId: string;
  notes: ClinicalNote[];
  onAddNote: (note: ClinicalNote) => void;
}

export const ClinicalNotesList: React.FC<ClinicalNotesListProps> = ({
  patientId,
  notes,
  onAddNote,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
      <div className="flex items-center justify-between border-b pb-4 border-slate-100">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
            <FileText className="w-5 h-5 text-blue-600" />
            <span>Clinical Encounter Timeline</span>
          </h3>
          <p className="text-xs text-slate-500">
            Chronological SOAP notes, diagnoses, and procedures rendered
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Clinical Note</span>
        </button>
      </div>

      {notes.length === 0 ? (
        <div className="text-center py-12 space-y-2">
          <FileText className="w-8 h-8 text-slate-300 mx-auto" />
          <p className="text-xs text-slate-500">No clinical notes recorded for this patient yet.</p>
        </div>
      ) : (
        <div className="relative border-l-2 border-slate-200 ml-4 space-y-6 pl-6">
          {notes.map((note) => (
            <div key={note.id} className="relative group">
              {/* Timeline Bullet */}
              <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-blue-600 border-4 border-white shadow-xs"></div>

              <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/60 pb-2.5">
                  <div className="flex items-center space-x-3 text-xs font-bold text-slate-800">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-3.5 h-3.5 text-blue-600" />
                      <span>{note.date}</span>
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="flex items-center space-x-1 text-slate-600">
                      <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                      <span>{note.dentistName}</span>
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    {note.procedureCode && (
                      <span className="px-2.5 py-0.5 bg-blue-100 text-blue-800 border border-blue-200 rounded-md font-mono text-[10px] font-extrabold">
                        CDT: {note.procedureCode}
                      </span>
                    )}
                    {note.toothNumbers && note.toothNumbers.length > 0 && (
                      <span className="px-2.5 py-0.5 bg-slate-200 text-slate-800 rounded-md font-mono text-[10px] font-bold flex items-center space-x-1">
                        <Hash className="w-3 h-3 text-slate-500" />
                        <span>Teeth #{note.toothNumbers.join(', #')}</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* SOAP Detail Sections */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="font-extrabold text-blue-700 block uppercase text-[10px] tracking-wider mb-0.5">
                      Subjective / Chief Complaint
                    </span>
                    <p className="text-slate-700 bg-white p-2.5 rounded-xl border border-slate-200/60">
                      {note.chiefComplaint}
                    </p>
                  </div>

                  <div>
                    <span className="font-extrabold text-blue-700 block uppercase text-[10px] tracking-wider mb-0.5">
                      Objective Findings
                    </span>
                    <p className="text-slate-700 bg-white p-2.5 rounded-xl border border-slate-200/60">
                      {note.clinicalFindings}
                    </p>
                  </div>

                  <div>
                    <span className="font-extrabold text-blue-700 block uppercase text-[10px] tracking-wider mb-0.5">
                      Assessment & Diagnosis
                    </span>
                    <p className="text-slate-700 bg-white p-2.5 rounded-xl border border-slate-200/60">
                      {note.diagnosis}
                    </p>
                  </div>

                  <div>
                    <span className="font-extrabold text-blue-700 block uppercase text-[10px] tracking-wider mb-0.5">
                      Treatment Rendered
                    </span>
                    <p className="text-slate-700 bg-white p-2.5 rounded-xl border border-slate-200/60">
                      {note.treatmentRendered}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <AddClinicalNoteModal
        patientId={patientId}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={onAddNote}
      />
    </div>
  );
};
