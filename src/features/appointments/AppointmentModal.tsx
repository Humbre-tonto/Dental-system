import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDentalStore } from '../../store/useDentalStore';
import type { Appointment, AppointmentStatus } from '../../types';
import { X, Save } from 'lucide-react';

const appointmentSchema = z.object({
  patientId: z.string().min(1, 'Please select a patient'),
  date: z.string().min(1, 'Date required'),
  time: z.string().min(1, 'Time required'),
  durationMinutes: z.number().min(15, 'Minimum 15 mins'),
  dentistName: z.string().min(1, 'Dentist name required'),
  treatmentType: z.string().min(1, 'Treatment type required'),
  status: z.enum(['Scheduled', 'Completed', 'Cancelled', 'No-Show']),
  notes: z.string().optional(),
});

type AppointmentFormData = z.infer<typeof appointmentSchema>;

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (apt: Appointment) => void;
}

export const AppointmentModal: React.FC<AppointmentModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const { patients } = useDentalStore();

  const {
    register,
    handleSubmit,
  } = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      patientId: patients[0]?.id || '',
      date: new Date().toISOString().split('T')[0],
      time: '09:00',
      durationMinutes: 45,
      dentistName: 'Dr. Sarah Jenkins, DDS',
      treatmentType: 'Comprehensive Oral Exam & Scaling',
      status: 'Scheduled',
      notes: '',
    },
  });

  if (!isOpen) return null;

  const onSubmit = (data: AppointmentFormData) => {
    const selectedPatient = patients.find((p) => p.id === data.patientId);
    const patientName = selectedPatient
      ? `${selectedPatient.firstName} ${selectedPatient.lastName}`
      : 'Dental Client';

    const newApt: Appointment = {
      id: `apt-${window.crypto.randomUUID ? window.crypto.randomUUID().slice(0, 8) : 'new'}`,
      patientId: data.patientId,
      patientName,
      date: data.date,
      time: data.time,
      durationMinutes: data.durationMinutes,
      dentistName: data.dentistName,
      treatmentType: data.treatmentType,
      status: data.status as AppointmentStatus,
      notes: data.notes || undefined,
    };

    onSave(newApt);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
          <h3 className="text-base font-bold">Schedule Dental Appointment</h3>
          <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Select Patient Account</label>
            <select {...register('patientId')} className="w-full text-xs border rounded-xl px-3 py-2 bg-white">
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.firstName} {p.lastName} (ID: {p.id})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Appointment Date</label>
              <input type="date" {...register('date')} className="w-full text-xs border rounded-xl px-3 py-2" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Time</label>
              <input type="time" {...register('time')} className="w-full text-xs border rounded-xl px-3 py-2" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Duration (Minutes)</label>
              <input type="number" {...register('durationMinutes', { valueAsNumber: true })} className="w-full text-xs border rounded-xl px-3 py-2" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Initial Status</label>
              <select {...register('status')} className="w-full text-xs border rounded-xl px-3 py-2 bg-white">
                <option value="Scheduled">Scheduled</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
                <option value="No-Show">No-Show</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Attending Provider</label>
            <input {...register('dentistName')} className="w-full text-xs border rounded-xl px-3 py-2" />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Treatment / Procedure Planned</label>
            <input {...register('treatmentType')} placeholder="E.g. Crown Prep, Root Canal #14" className="w-full text-xs border rounded-xl px-3 py-2" />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Special Precautions / Notes</label>
            <textarea {...register('notes')} rows={2} className="w-full text-xs border rounded-xl p-3" />
          </div>

          <div className="flex items-center justify-end space-x-3 pt-3 border-t">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50">
              Cancel
            </button>
            <button type="submit" className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-sm">
              <Save className="w-4 h-4" />
              <span>Book Appointment</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
