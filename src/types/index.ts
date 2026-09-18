export type RiskStatus = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface MedicalHistory {
  bleedingDisorder: boolean;
  diabetes: boolean;
  hypertension: boolean;
  penicillinAllergy: boolean;
  latexAllergy: boolean;
  pregnant: boolean;
  infectiousDisease: boolean;
  heartCondition: boolean;
  otherAlerts?: string;
}

export type ToothConditionType =
  | 'HEALTHY'
  | 'CARIES'
  | 'ROOT_CANAL'
  | 'CROWN'
  | 'FILLING'
  | 'EXTRACTION_NEEDED'
  | 'MISSING'
  | 'IMPLANT'
  | 'BRIDGE';

export interface ToothCondition {
  toothNumber: number; // Universal 1-32
  condition: ToothConditionType;
  notes?: string;
  surfaces?: ('M' | 'O' | 'D' | 'B' | 'L')[]; // Mesial, Occlusal, Distal, Buccal, Lingual
  updatedAt: string;
}

export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female' | 'Other';
  phone: string;
  email: string;
  address: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  insurance: {
    provider: string;
    policyNumber: string;
    groupNumber?: string;
  };
  riskStatus: RiskStatus;
  medicalHistory: MedicalHistory;
  teethConditions: ToothCondition[];
  lastVisitDate: string;
  createdDate: string;
}

export interface ClinicalNote {
  id: string;
  patientId: string;
  date: string;
  dentistName: string;
  chiefComplaint: string;
  clinicalFindings: string;
  diagnosis: string;
  treatmentRendered: string;
  toothNumbers?: number[];
  procedureCode?: string;
}

export type DocumentTag =
  | 'X-Ray'
  | 'Lab Result'
  | 'Prescription'
  | 'Consent Form'
  | 'Insurance'
  | 'Intraoral Photo';

export interface PatientDocument {
  id: string;
  patientId: string;
  title: string;
  tag: DocumentTag;
  fileName: string;
  fileType: string;
  uploadDate: string;
  fileSize: number;
  dataUrl: string; // Base64 or Blob Object URL stored in IndexedDB
}

export type AppointmentStatus = 'Scheduled' | 'Completed' | 'Cancelled' | 'No-Show';

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  durationMinutes: number;
  dentistName: string;
  treatmentType: string;
  status: AppointmentStatus;
  notes?: string;
}
