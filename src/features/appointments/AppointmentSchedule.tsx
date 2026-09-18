import React, { useState } from 'react';
import { useDentalStore } from '../../store/useDentalStore';
import type { AppointmentStatus } from '../../types';
import { AppointmentModal } from './AppointmentModal';
import { Calendar, Plus, Clock, ShieldAlert } from 'lucide-react';

export const AppointmentSchedule: React.FC = () => {
  const { appointments, setSelectedPatient, setActiveTab, addOrUpdateAppointment } = useDentalStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<AppointmentStatus | 'ALL'>('ALL');

  const filteredAppointments = appointments.filter(
    (a) => statusFilter === 'ALL' || a.status === statusFilter
  );

  const statusBadgeStyles: Record<AppointmentStatus, string> = {
    Scheduled: 'bg-blue-100 text-blue-800 border-blue-300',
    Completed: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    Cancelled: 'bg-red-100 text-red-800 border-red-300',
    'No-Show': 'bg-amber-100 text-amber-800 border-amber-300',
  };

  const handlePatientClick = (patientId: string) => {
    setSelectedPatient(patientId);
    setActiveTab('profile');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            <span>Clinic Appointment Calendar & Agenda</span>
          </h1>
          <p className="text-xs text-slate-500">
            Real-time daily schedule manager for dental operatory slots
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as AppointmentStatus | 'ALL')}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-700"
          >
            <option value="ALL">All Statuses</option>
            <option value="Scheduled">Scheduled Only</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
            <option value="No-Show">No-Show</option>
          </select>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center space-x-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule Appointment</span>
          </button>
        </div>
      </div>

      {/* Appointment Cards List */}
      {filteredAppointments.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <Calendar className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No Appointments Scheduled</h3>
          <p className="text-xs text-slate-500">Book new clinical slots for clients directly.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredAppointments.map((apt) => (
            <div
              key={apt.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:border-blue-300 transition-colors"
            >
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl border border-blue-100 flex flex-col items-center justify-center min-w-[70px]">
                  <Clock className="w-4 h-4 mb-1" />
                  <span className="text-xs font-extrabold">{apt.time}</span>
                  <span className="text-[10px] text-blue-500">{apt.durationMinutes}m</span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handlePatientClick(apt.patientId)}
                      className="text-sm font-bold text-slate-900 hover:text-blue-600 transition-colors text-left"
                    >
                      {apt.patientName}
                    </button>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border uppercase ${statusBadgeStyles[apt.status]}`}
                    >
                      {apt.status}
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-blue-600">{apt.treatmentType}</p>
                  <p className="text-[11px] text-slate-500">
                    Provider: <span className="font-medium text-slate-700">{apt.dentistName}</span> • Date: {apt.date}
                  </p>

                  {apt.notes && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-1.5 mt-1 text-[11px] text-amber-800 font-medium flex items-center space-x-1.5">
                      <ShieldAlert className="w-3 h-3 text-amber-600 shrink-0" />
                      <span>{apt.notes}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Status Update Quick Select */}
              <div className="flex items-center space-x-2 w-full md:w-auto justify-end border-t md:border-t-0 pt-3 md:pt-0">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Update Status:</span>
                <select
                  value={apt.status}
                  onChange={(e) =>
                    addOrUpdateAppointment({
                      ...apt,
                      status: e.target.value as AppointmentStatus,
                    })
                  }
                  className="text-xs font-bold border rounded-xl px-2.5 py-1.5 bg-slate-50 text-slate-800"
                >
                  <option value="Scheduled">Scheduled</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                  <option value="No-Show">No-Show</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}

      <AppointmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={addOrUpdateAppointment}
      />
    </div>
  );
};
