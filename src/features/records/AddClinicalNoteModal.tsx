import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { ClinicalNote } from '../../types';
import { X, Save } from 'lucide-react';

const noteSchema = z.object({
  dentistName: z.string().min(1, 'Dentist name required'),
  date: z.string().min(1, 'Visit date required'),
  chiefComplaint: z.string().min(3, 'Chief complaint required'),
  clinicalFindings: z.string().min(3, 'Clinical findings required'),
  diagnosis: z.string().min(3, 'Diagnosis required'),
  treatmentRendered: z.string().min(3, 'Treatment rendered required'),
  procedureCode: z.string().optional(),
  toothNumbersStr: z.string().optional(),
});

type NoteFormData = z.infer<typeof noteSchema>;

interface AddClinicalNoteModalProps {
  patientId: string;
  isOpen: boolean;
  onClose: () => void;
  onSave: (note: ClinicalNote) => void;
}

export const AddClinicalNoteModal: React.FC<AddClinicalNoteModalProps> = ({
  patientId,
  isOpen,
  onClose,
  onSave,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NoteFormData>({
    resolver: zodResolver(noteSchema),
    defaultValues: {
      dentistName: 'Dr. Sarah Jenkins, DDS',
      date: new Date().toISOString().split('T')[0],
      chiefComplaint: '',
      clinicalFindings: '',
      diagnosis: '',
      treatmentRendered: '',
      procedureCode: 'D0120',
      toothNumbersStr: '',
    },
  });

  if (!isOpen) return null;

  const onSubmit = (data: NoteFormData) => {
    const teeth = data.toothNumbersStr
      ? data.toothNumbersStr
          .split(',')
          .map((s) => parseInt(s.trim()))
          .filter((n) => !isNaN(n))
      : undefined;

    const newNote: ClinicalNote = {
      id: `note-${window.crypto.randomUUID ? window.crypto.randomUUID().slice(0, 8) : 'new'}`,
      patientId,
      date: data.date,
      dentistName: data.dentistName,
      chiefComplaint: data.chiefComplaint,
      clinicalFindings: data.clinicalFindings,
      diagnosis: data.diagnosis,
      treatmentRendered: data.treatmentRendered,
      procedureCode: data.procedureCode || undefined,
      toothNumbers: teeth,
    };

    onSave(newNote);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
          <h3 className="text-base font-bold">New Clinical Encounter Note (SOAP format)</h3>
          <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Attending Dentist</label>
              <input {...register('dentistName')} className="w-full text-xs border rounded-xl px-3 py-2" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Visit Date</label>
              <input type="date" {...register('date')} className="w-full text-xs border rounded-xl px-3 py-2" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Procedure Code (CDT)</label>
              <input {...register('procedureCode')} placeholder="E.g. D2391, D1110" className="w-full text-xs border rounded-xl px-3 py-2" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Teeth Numbers Involved (comma separated)</label>
            <input {...register('toothNumbersStr')} placeholder="E.g. 19, 20" className="w-full text-xs border rounded-xl px-3 py-2" />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">S - Chief Complaint & Subjective Notes</label>
            <textarea {...register('chiefComplaint')} rows={2} className="w-full text-xs border rounded-xl p-3" />
            {errors.chiefComplaint && <p className="text-xs text-red-500">{errors.chiefComplaint.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">O - Objective Clinical Findings</label>
            <textarea {...register('clinicalFindings')} rows={2} className="w-full text-xs border rounded-xl p-3" />
            {errors.clinicalFindings && <p className="text-xs text-red-500">{errors.clinicalFindings.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">A - Assessment & Diagnosis</label>
            <textarea {...register('diagnosis')} rows={2} className="w-full text-xs border rounded-xl p-3" />
            {errors.diagnosis && <p className="text-xs text-red-500">{errors.diagnosis.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">P - Treatment Rendered & Next Steps</label>
            <textarea {...register('treatmentRendered')} rows={2} className="w-full text-xs border rounded-xl p-3" />
            {errors.treatmentRendered && <p className="text-xs text-red-500">{errors.treatmentRendered.message}</p>}
          </div>

          <div className="flex items-center justify-end space-x-3 pt-3 border-t">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50">
              Cancel
            </button>
            <button type="submit" className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-sm">
              <Save className="w-4 h-4" />
              <span>Record Encounter</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
