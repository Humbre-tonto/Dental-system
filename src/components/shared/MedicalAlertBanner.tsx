import React from 'react';
import type { MedicalHistory, RiskStatus } from '../../types';
import { AlertTriangle, ShieldAlert, Heart, Activity } from 'lucide-react';

interface MedicalAlertBannerProps {
  medicalHistory: MedicalHistory;
  riskStatus: RiskStatus;
}

export const MedicalAlertBanner: React.FC<MedicalAlertBannerProps> = ({
  medicalHistory,
  riskStatus,
}) => {
  const alerts: { label: string; critical: boolean }[] = [];

  if (medicalHistory.bleedingDisorder)
    alerts.push({ label: 'Bleeding Disorder / Anticoagulant Therapy', critical: true });
  if (medicalHistory.penicillinAllergy)
    alerts.push({ label: 'ALLERGY: Penicillin / Beta-lactams', critical: true });
  if (medicalHistory.latexAllergy)
    alerts.push({ label: 'ALLERGY: Latex (Require Latex-Free Operatory)', critical: true });
  if (medicalHistory.heartCondition)
    alerts.push({ label: 'Heart Condition / Pre-Medication Required', critical: true });
  if (medicalHistory.diabetes)
    alerts.push({ label: 'Diabetes Mellitus', critical: false });
  if (medicalHistory.hypertension)
    alerts.push({ label: 'Hypertension (Check BP prior to Epi)', critical: false });
  if (medicalHistory.pregnant)
    alerts.push({ label: 'Pregnancy Protocol Active', critical: true });
  if (medicalHistory.infectiousDisease)
    alerts.push({ label: 'Infectious Disease Precautions', critical: true });

  if (alerts.length === 0 && !medicalHistory.otherAlerts) {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center space-x-3 text-emerald-800 text-xs font-semibold">
        <Activity className="w-5 h-5 text-emerald-600 shrink-0" />
        <span>No critical medical alerts or drug allergies flagged for this client. Standard operatory protocols apply.</span>
      </div>
    );
  }

  const riskBadgeStyles = {
    LOW: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    MEDIUM: 'bg-amber-100 text-amber-800 border-amber-300',
    HIGH: 'bg-orange-100 text-orange-800 border-orange-300',
    CRITICAL: 'bg-red-100 text-red-800 border-red-300 animate-pulse',
  };

  return (
    <div className="bg-red-50/90 border-2 border-red-200 rounded-2xl p-4 shadow-xs space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <ShieldAlert className="w-5 h-5 text-red-600 shrink-0" />
          <h3 className="text-sm font-extrabold text-red-900 tracking-tight">
            Medical & Clinical Alert Banner
          </h3>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-[11px] font-extrabold border uppercase ${riskBadgeStyles[riskStatus]}`}
        >
          {riskStatus} RISK
        </span>
      </div>

      <p className="text-xs text-red-700 font-medium leading-relaxed">
        Strict compliance required before dental anesthesia or surgical intervention.
      </p>

      <div className="flex flex-wrap gap-2 pt-1">
        {alerts.map((alert, idx) => (
          <span
            key={idx}
            className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-xl text-xs font-bold border ${
              alert.critical
                ? 'bg-red-100 text-red-900 border-red-300'
                : 'bg-amber-50 text-amber-900 border-amber-200'
            }`}
          >
            {alert.critical ? (
              <AlertTriangle className="w-3.5 h-3.5 text-red-600 shrink-0" />
            ) : (
              <Heart className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            )}
            <span>{alert.label}</span>
          </span>
        ))}

        {medicalHistory.otherAlerts && (
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-red-100 text-red-900 border border-red-300 rounded-xl text-xs font-bold">
            <AlertTriangle className="w-3.5 h-3.5 text-red-600 shrink-0" />
            <span>{medicalHistory.otherAlerts}</span>
          </span>
        )}
      </div>
    </div>
  );
};
