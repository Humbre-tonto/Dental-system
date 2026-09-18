import React, { useState } from 'react';
import { useDentalStore } from '../../store/useDentalStore';
import { PatientGridCard } from './PatientGridCard';
import type { RiskStatus } from '../../types';
import {
  Users,
  Grid,
  List,
  Filter,
  Plus,
  ChevronRight,
  AlertTriangle,
} from 'lucide-react';

interface PatientListProps {
  onNewPatientClick: () => void;
}

export const PatientList: React.FC<PatientListProps> = ({ onNewPatientClick }) => {
  const {
    patients,
    searchQuery,
    riskFilter,
    setRiskFilter,
    setSelectedPatient,
    setActiveTab,
  } = useDentalStore();

  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');

  const filteredPatients = patients.filter((patient) => {
    const matchesSearch =
      `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.phone.includes(searchQuery) ||
      patient.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRisk = riskFilter === 'ALL' || patient.riskStatus === riskFilter;

    return matchesSearch && matchesRisk;
  });

  const riskBadgeStyles: Record<RiskStatus, string> = {
    LOW: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    MEDIUM: 'bg-amber-100 text-amber-800 border-amber-300',
    HIGH: 'bg-orange-100 text-orange-800 border-orange-300',
    CRITICAL: 'bg-red-100 text-red-800 border-red-300 animate-pulse',
  };

  return (
    <div className="space-y-6">
      {/* Directory Control Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Patient Directory</h1>
          <p className="text-xs text-slate-500">
            Manage dental clients, medical risk classifications, and records ({filteredPatients.length} active)
          </p>
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
          {/* Risk Level Filter Dropdown */}
          <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value as RiskStatus | 'ALL')}
              className="bg-transparent font-bold text-slate-700 focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Risk Levels</option>
              <option value="CRITICAL">Critical Risk Only</option>
              <option value="HIGH">High Risk</option>
              <option value="MEDIUM">Medium Risk</option>
              <option value="LOW">Low Risk</option>
            </select>
          </div>

          {/* Grid vs Table Toggle */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs font-semibold transition-colors ${
                viewMode === 'table' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs font-semibold transition-colors ${
                viewMode === 'grid' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Grid Cards View"
            >
              <Grid className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={onNewPatientClick}
            className="flex items-center space-x-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Client</span>
          </button>
        </div>
      </div>

      {/* Empty State */}
      {filteredPatients.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <Users className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No Patient Records Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            No clients match your current search query or risk classification filter. Try clearing filters or register a new patient.
          </p>
          <button
            onClick={onNewPatientClick}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold"
          >
            Register Patient
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* Grid View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPatients.map((patient) => (
            <PatientGridCard
              key={patient.id}
              patient={patient}
              onSelect={() => {
                setSelectedPatient(patient.id);
                setActiveTab('profile');
              }}
            />
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3.5 px-4">Patient Name</th>
                  <th className="py-3.5 px-4">Contact Details</th>
                  <th className="py-3.5 px-4">Risk Status</th>
                  <th className="py-3.5 px-4">Critical Medical Alerts</th>
                  <th className="py-3.5 px-4">Last Visit</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPatients.map((patient) => {
                  const criticalAlerts = [
                    patient.medicalHistory.penicillinAllergy && 'Penicillin Allergy',
                    patient.medicalHistory.latexAllergy && 'Latex Allergy',
                    patient.medicalHistory.bleedingDisorder && 'Bleeding Disorder',
                    patient.medicalHistory.heartCondition && 'Heart Condition',
                  ].filter(Boolean) as string[];

                  return (
                    <tr
                      key={patient.id}
                      onClick={() => {
                        setSelectedPatient(patient.id);
                        setActiveTab('profile');
                      }}
                      className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                    >
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0">
                            {patient.firstName[0]}
                            {patient.lastName[0]}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors block">
                              {patient.firstName} {patient.lastName}
                            </span>
                            <span className="text-[10px] text-slate-400">DOB: {patient.dateOfBirth}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5">
                          <p className="font-medium text-slate-800">{patient.phone}</p>
                          <p className="text-[10px] text-slate-400 truncate max-w-[150px]">{patient.email}</p>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border uppercase ${riskBadgeStyles[patient.riskStatus]}`}
                        >
                          {patient.riskStatus}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        {criticalAlerts.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {criticalAlerts.map((alert, i) => (
                              <span
                                key={i}
                                className="inline-flex items-center space-x-1 px-2 py-0.5 bg-red-50 text-red-700 border border-red-200 rounded-md font-semibold text-[10px]"
                              >
                                <AlertTriangle className="w-3 h-3 text-red-500" />
                                <span>{alert}</span>
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-slate-400 font-medium">None</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 font-mono font-medium text-slate-600">
                        {patient.lastVisitDate}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedPatient(patient.id);
                            setActiveTab('profile');
                          }}
                          className="inline-flex items-center space-x-1 text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1.5 rounded-xl hover:bg-blue-100 transition-colors"
                        >
                          <span>View Chart</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
