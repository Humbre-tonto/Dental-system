import { create } from 'zustand';
import type {
  Patient,
  RiskStatus,
  ToothCondition,
  ClinicalNote,
  PatientDocument,
  Appointment,
} from '../types';
import {
  seedInitialDataIfEmpty,
  getAllPatients,
  savePatient,
  deletePatient,
  getClinicalNotesByPatient,
  saveClinicalNote,
  getDocumentsByPatient,
  saveDocument,
  deleteDocument,
  getAllAppointments,
  saveAppointment,
} from '../db/indexedDB';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  text: string;
}

interface DentalState {
  patients: Patient[];
  selectedPatientId: string | null;
  activeTab: 'directory' | 'profile' | 'schedule';
  profileSubTab: 'odontogram' | 'notes' | 'documents';
  clinicalNotes: ClinicalNote[];
  documents: PatientDocument[];
  appointments: Appointment[];

  // Filters & Search
  searchQuery: string;
  riskFilter: RiskStatus | 'ALL';
  isLoading: boolean;
  toasts: ToastMessage[];

  // Actions
  initializeStore: () => Promise<void>;
  setActiveTab: (tab: 'directory' | 'profile' | 'schedule') => void;
  setProfileSubTab: (subTab: 'odontogram' | 'notes' | 'documents') => void;
  setSelectedPatient: (patientId: string | null) => void;
  setSearchQuery: (query: string) => void;
  setRiskFilter: (risk: RiskStatus | 'ALL') => void;

  // CRUD
  addOrUpdatePatient: (patient: Patient) => Promise<void>;
  removePatient: (patientId: string) => Promise<void>;
  updateToothCondition: (toothNumber: number, condition: ToothCondition) => Promise<void>;

  addClinicalNote: (note: ClinicalNote) => Promise<void>;
  addDocument: (doc: PatientDocument) => Promise<void>;
  removeDocument: (docId: string) => Promise<void>;

  addOrUpdateAppointment: (appointment: Appointment) => Promise<void>;

  showToast: (text: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
}

export const useDentalStore = create<DentalState>((set, get) => ({
  patients: [],
  selectedPatientId: null,
  activeTab: 'directory',
  profileSubTab: 'odontogram',
  clinicalNotes: [],
  documents: [],
  appointments: [],
  searchQuery: '',
  riskFilter: 'ALL',
  isLoading: true,
  toasts: [],

  showToast: (text, type = 'success') => {
    const id = `toast-${window.crypto.randomUUID ? window.crypto.randomUUID().slice(0, 6) : Math.random()}`;
    set((state) => ({ toasts: [...state.toasts, { id, text, type }] }));
    setTimeout(() => {
      get().removeToast(id);
    }, 4000);
  },

  removeToast: (id) => {
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
  },

  initializeStore: async () => {
    set({ isLoading: true });
    try {
      await seedInitialDataIfEmpty();
      const patients = await getAllPatients();
      const appointments = await getAllAppointments();
      set({ patients, appointments, isLoading: false });
    } catch (error) {
      console.error('Failed to initialize IndexedDB dental store:', error);
      set({ isLoading: false });
    }
  },

  setActiveTab: (tab) => set({ activeTab: tab }),
  setProfileSubTab: (subTab) => set({ profileSubTab: subTab }),

  setSelectedPatient: async (patientId) => {
    set({ selectedPatientId: patientId });
    if (patientId) {
      const notes = await getClinicalNotesByPatient(patientId);
      const docs = await getDocumentsByPatient(patientId);
      set({ clinicalNotes: notes, documents: docs });
    } else {
      set({ clinicalNotes: [], documents: [] });
    }
  },

  setSearchQuery: (query) => set({ searchQuery: query }),
  setRiskFilter: (risk) => set({ riskFilter: risk }),

  addOrUpdatePatient: async (patient) => {
    await savePatient(patient);
    const updatedPatients = await getAllPatients();
    set({ patients: updatedPatients });
    get().showToast(`Patient record for ${patient.firstName} ${patient.lastName} saved successfully.`);
  },

  removePatient: async (patientId) => {
    await deletePatient(patientId);
    const updatedPatients = await getAllPatients();
    set((state) => ({
      patients: updatedPatients,
      selectedPatientId: state.selectedPatientId === patientId ? null : state.selectedPatientId,
    }));
    get().showToast('Patient record safely archived.');
  },

  updateToothCondition: async (toothNumber, condition) => {
    const { selectedPatientId, patients } = get();
    if (!selectedPatientId) return;

    const patient = patients.find((p) => p.id === selectedPatientId);
    if (!patient) return;

    const updatedTeeth = patient.teethConditions.filter((t) => t.toothNumber !== toothNumber);
    updatedTeeth.push(condition);

    const updatedPatient: Patient = {
      ...patient,
      teethConditions: updatedTeeth,
    };

    await savePatient(updatedPatient);
    const freshPatients = await getAllPatients();
    set({ patients: freshPatients });
    get().showToast(`Tooth #${toothNumber} condition updated to ${condition.condition}.`);
  },

  addClinicalNote: async (note) => {
    await saveClinicalNote(note);
    if (get().selectedPatientId === note.patientId) {
      const notes = await getClinicalNotesByPatient(note.patientId);
      set({ clinicalNotes: notes });
    }
    get().showToast('Clinical encounter note recorded.');
  },

  addDocument: async (doc) => {
    await saveDocument(doc);
    if (get().selectedPatientId === doc.patientId) {
      const docs = await getDocumentsByPatient(doc.patientId);
      set({ documents: docs });
    }
    get().showToast(`Document "${doc.title}" attached successfully.`);
  },

  removeDocument: async (docId) => {
    await deleteDocument(docId);
    if (get().selectedPatientId) {
      const docs = await getDocumentsByPatient(get().selectedPatientId!);
      set({ documents: docs });
    }
    get().showToast('Attachment removed.');
  },

  addOrUpdateAppointment: async (appointment) => {
    await saveAppointment(appointment);
    const appointments = await getAllAppointments();
    set({ appointments });
    get().showToast('Appointment updated successfully.');
  },
}));
