import { openDB } from 'idb';
import type { Patient, ClinicalNote, PatientDocument, Appointment } from '../types';
import {
  initialSeedPatients,
  initialSeedNotes,
  initialSeedDocuments,
  initialSeedAppointments,
} from './seedData';

const DB_NAME = 'ApexDentalDB';
const DB_VERSION = 1;

export async function initDB() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('patients')) {
        const patientStore = db.createObjectStore('patients', { keyPath: 'id' });
        patientStore.createIndex('by-name', ['lastName', 'firstName']);
        patientStore.createIndex('by-risk', 'riskStatus');
      }

      if (!db.objectStoreNames.contains('clinical_notes')) {
        const noteStore = db.createObjectStore('clinical_notes', { keyPath: 'id' });
        noteStore.createIndex('by-patient', 'patientId');
      }

      if (!db.objectStoreNames.contains('documents')) {
        const docStore = db.createObjectStore('documents', { keyPath: 'id' });
        docStore.createIndex('by-patient', 'patientId');
      }

      if (!db.objectStoreNames.contains('appointments')) {
        const aptStore = db.createObjectStore('appointments', { keyPath: 'id' });
        aptStore.createIndex('by-patient', 'patientId');
        aptStore.createIndex('by-date', 'date');
      }
    },
  });
}

export async function seedInitialDataIfEmpty() {
  const db = await initDB();

  const patientCount = await db.count('patients');
  if (patientCount === 0) {
    const tx = db.transaction(['patients', 'clinical_notes', 'documents', 'appointments'], 'readwrite');

    for (const patient of initialSeedPatients) {
      await tx.objectStore('patients').put(patient);
    }
    for (const note of initialSeedNotes) {
      await tx.objectStore('clinical_notes').put(note);
    }
    for (const doc of initialSeedDocuments) {
      await tx.objectStore('documents').put(doc);
    }
    for (const apt of initialSeedAppointments) {
      await tx.objectStore('appointments').put(apt);
    }

    await tx.done;
  }
}

export async function getAllPatients(): Promise<Patient[]> {
  const db = await initDB();
  return db.getAll('patients');
}

export async function savePatient(patient: Patient): Promise<void> {
  const db = await initDB();
  await db.put('patients', patient);
}

export async function deletePatient(patientId: string): Promise<void> {
  const db = await initDB();
  const tx = db.transaction(['patients', 'clinical_notes', 'documents', 'appointments'], 'readwrite');
  await tx.objectStore('patients').delete(patientId);

  // Clean up associated records
  const notes = await tx.objectStore('clinical_notes').index('by-patient').getAllKeys(patientId);
  for (const key of notes) await tx.objectStore('clinical_notes').delete(key);

  const docs = await tx.objectStore('documents').index('by-patient').getAllKeys(patientId);
  for (const key of docs) await tx.objectStore('documents').delete(key);

  const apts = await tx.objectStore('appointments').index('by-patient').getAllKeys(patientId);
  for (const key of apts) await tx.objectStore('appointments').delete(key);

  await tx.done;
}

export async function getClinicalNotesByPatient(patientId: string): Promise<ClinicalNote[]> {
  const db = await initDB();
  return db.getAllFromIndex('clinical_notes', 'by-patient', patientId);
}

export async function saveClinicalNote(note: ClinicalNote): Promise<void> {
  const db = await initDB();
  await db.put('clinical_notes', note);
}

export async function getDocumentsByPatient(patientId: string): Promise<PatientDocument[]> {
  const db = await initDB();
  return db.getAllFromIndex('documents', 'by-patient', patientId);
}

export async function saveDocument(doc: PatientDocument): Promise<void> {
  const db = await initDB();
  await db.put('documents', doc);
}

export async function deleteDocument(docId: string): Promise<void> {
  const db = await initDB();
  await db.delete('documents', docId);
}

export async function getAllAppointments(): Promise<Appointment[]> {
  const db = await initDB();
  return db.getAll('appointments');
}

export async function saveAppointment(apt: Appointment): Promise<void> {
  const db = await initDB();
  await db.put('appointments', apt);
}
