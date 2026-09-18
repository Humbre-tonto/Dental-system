import React, { useState } from 'react';
import { useDentalStore } from '../../store/useDentalStore';
import { MedicalAlertBanner } from '../../components/shared/MedicalAlertBanner';
import { OdontogramChart } from '../records/OdontogramChart';
import { ClinicalNotesList } from '../records/ClinicalNotesList';
import { DocumentCenter } from '../documents/DocumentCenter';
import { PatientFormModal } from './PatientFormModal';
import {
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  Shield,
  Edit,
  Trash2,
  Activity,
  FileText,
  FolderOpen,
} from 'lucide-react';

export const PatientProfileView: React.FC = () => {
  const {
    patients,
    selectedPatientId,
    setActiveTab,
    profileSubTab,
    setProfileSubTab,
    addOrUpdatePatient,
    removePatient,
    updateToothCondition,
    clinicalNotes,
    addClinicalNote,
    documents,
    addDocument,
    removeDocument,
  } = useDentalStore();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const patient = patients.find((p) => p.id === selectedPatientId);

  if (!patient) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
        <p className="text-sm text-slate-500">No patient chart selected.</p>
        <button
          onClick={() => setActiveTab('directory')}
          className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold"
        >
          Return to Patient Directory
        </button>
      </div>
    );
  }

  const handleDeletePatient = () => {
    if (window.confirm(`Are you sure you want to archive ${patient.firstName} ${patient.lastName}'s entire clinical record?`)) {
      removePatient(patient.id);
      setActiveTab('directory');
    }
  };

  return (
    <div className="space-y-6">
      {/* Back Button & Top Action Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setActiveTab('directory')}
          className="flex items-center space-x-2 text-xs font-bold text-slate-600 hover:text-blue-600 transition-colors bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Directory</span>
        </button>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors border border-slate-200"
          >
            <Edit className="w-3.5 h-3.5" />
            <span>Edit Profile</span>
          </button>
          <button
            onClick={handleDeletePatient}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl text-xs font-bold transition-colors border border-red-200"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Archive Record</span>
          </button>
        </div>
      </div>

      {/* Medical Alert Warning Banner */}
      <MedicalAlertBanner
        medicalHistory={patient.medicalHistory}
        riskStatus={patient.riskStatus}
      />

      {/* Patient Demographic Summary Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-extrabold text-xl shadow-md">
              {patient.firstName[0]}
              {patient.lastName[0]}
            </div>
            <div>
              <div className="flex items-center space-x-3">
                <h2 className="text-2xl font-bold text-slate-900">
                  {patient.firstName} {patient.lastName}
                </h2>
                <span className="text-xs font-mono font-bold text-slate-400 bg-slate-100 px-2.5 py-0.5 rounded-full">
                  ID: {patient.id}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {patient.gender} • DOB: {patient.dateOfBirth} • Client Since {patient.createdDate}
              </p>
            </div>
          </div>
        </div>

        {/* Demographics Detail Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div className="flex items-start space-x-2.5">
            <Phone className="w-4 h-4 text-blue-600 mt-0.5" />
            <div>
              <span className="text-slate-400 font-bold uppercase tracking-wider block text-[10px]">Phone</span>
              <span className="font-semibold text-slate-800">{patient.phone}</span>
            </div>
          </div>

          <div className="flex items-start space-x-2.5">
            <Mail className="w-4 h-4 text-blue-600 mt-0.5" />
            <div>
              <span className="text-slate-400 font-bold uppercase tracking-wider block text-[10px]">Email</span>
              <span className="font-semibold text-slate-800 truncate block max-w-[160px]">{patient.email}</span>
            </div>
          </div>

          <div className="flex items-start space-x-2.5">
            <MapPin className="w-4 h-4 text-blue-600 mt-0.5" />
            <div>
              <span className="text-slate-400 font-bold uppercase tracking-wider block text-[10px]">Address</span>
              <span className="font-semibold text-slate-800 line-clamp-1">{patient.address}</span>
            </div>
          </div>

          <div className="flex items-start space-x-2.5">
            <Shield className="w-4 h-4 text-blue-600 mt-0.5" />
            <div>
              <span className="text-slate-400 font-bold uppercase tracking-wider block text-[10px]">Insurance</span>
              <span className="font-semibold text-slate-800">{patient.insurance.provider}</span>
              <span className="text-[10px] text-slate-500 block">Policy: {patient.insurance.policyNumber}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-tabs Navigation */}
      <div className="flex items-center space-x-2 border-b border-slate-200">
        <button
          onClick={() => setProfileSubTab('odontogram')}
          className={`flex items-center space-x-2 px-4 py-3 text-xs font-bold border-b-2 transition-colors ${
            profileSubTab === 'odontogram'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Dental Odontogram</span>
        </button>

        <button
          onClick={() => setProfileSubTab('notes')}
          className={`flex items-center space-x-2 px-4 py-3 text-xs font-bold border-b-2 transition-colors ${
            profileSubTab === 'notes'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Clinical Encounters ({clinicalNotes.length})</span>
        </button>

        <button
          onClick={() => setProfileSubTab('documents')}
          className={`flex items-center space-x-2 px-4 py-3 text-xs font-bold border-b-2 transition-colors ${
            profileSubTab === 'documents'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <FolderOpen className="w-4 h-4" />
          <span>Document Vault ({documents.length})</span>
        </button>
      </div>

      {/* Tab Views */}
      {profileSubTab === 'odontogram' && (
        <OdontogramChart
          patientId={patient.id}
          teethConditions={patient.teethConditions}
          onUpdateTooth={updateToothCondition}
        />
      )}

      {profileSubTab === 'notes' && (
        <ClinicalNotesList
          patientId={patient.id}
          notes={clinicalNotes}
          onAddNote={addClinicalNote}
        />
      )}

      {profileSubTab === 'documents' && (
        <DocumentCenter
          patientId={patient.id}
          documents={documents}
          onUploadDocument={addDocument}
          onRemoveDocument={removeDocument}
        />
      )}

      {/* Edit Patient Modal */}
      <PatientFormModal
        patient={patient}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={addOrUpdatePatient}
      />
    </div>
  );
};
