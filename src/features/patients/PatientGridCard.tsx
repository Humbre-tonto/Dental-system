import React from 'react';
import { useDentalStore } from '../../store/useDentalStore';
import type { Patient, RiskStatus } from '../../types';
import { ChevronRight, Phone, Mail, Calendar, ShieldAlert } from 'lucide-react';

interface PatientGridCardProps {
  patient: Patient;
  onSelect: (patientId: string) => void;
}

export const PatientGridCard: React.FC<PatientGridCardProps> = ({ patient, onSelect }) => {
  const { setSelectedPatient, setActiveTab } = useDentalStore();

  const handleCardClick = () => {
    setSelectedPatient(patient.id);
    setActiveTab('profile');
    onSelect(patient.id);
  };

  const riskBadgeStyles: Record<RiskStatus, string> = {
    LOW: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    MEDIUM: 'bg-amber-50 text-amber-700 border-amber-200',
    HIGH: 'bg-orange-50 text-orange-700 border-orange-200',
    CRITICAL: 'bg-red-50 text-red-700 border-red-200 animate-pulse',
  };

  const criticalAlertsCount = [
    patient.medicalHistory.bleedingDisorder,
    patient.medicalHistory.penicillinAllergy,
    patient.medicalHistory.latexAllergy,
    patient.medicalHistory.heartCondition,
    patient.medicalHistory.pregnant,
    patient.medicalHistory.infectiousDisease,
  ].filter(Boolean).length;

  return (
    <div
      onClick={handleCardClick}
      className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all cursor-pointer hover:border-blue-300 group flex flex-col justify-between space-y-4"
    >
      <div className="space-y-3">
        {/* Header: Name & Risk Badge */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 font-extrabold text-sm flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              {patient.firstName[0]}
              {patient.lastName[0]}
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 group-hover:text-blue-600 transition-colors">
                {patient.firstName} {patient.lastName}
              </h3>
              <p className="text-[11px] text-slate-400 font-mono">
                DOB: {patient.dateOfBirth} ({patient.gender})
              </p>
            </div>
          </div>

          <span
            className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border uppercase ${riskBadgeStyles[patient.riskStatus]}`}
          >
            {patient.riskStatus}
          </span>
        </div>

        {/* Critical Alerts Banner Summary */}
        {criticalAlertsCount > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-2 flex items-center space-x-2 text-[11px] text-red-800 font-semibold">
            <ShieldAlert className="w-3.5 h-3.5 text-red-600 shrink-0" />
            <span className="truncate">{criticalAlertsCount} Critical Medical Alerts</span>
          </div>
        )}

        {/* Contact Info */}
        <div className="space-y-1.5 text-xs text-slate-600 pt-1">
          <div className="flex items-center space-x-2">
            <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="font-medium">{patient.phone}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="font-medium truncate">{patient.email}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="text-slate-500">Last Visit: {patient.lastVisitDate}</span>
          </div>
        </div>
      </div>

      {/* Footer Button */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-600">
        <span>View Dental Chart</span>
        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  );
};
