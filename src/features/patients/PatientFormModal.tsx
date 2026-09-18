import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Patient, RiskStatus } from '../../types';
import { X, Save } from 'lucide-react';

const patientSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  gender: z.enum(['Male', 'Female', 'Other']),
  phone: z.string().min(5, 'Valid phone number required'),
  email: z.string().email('Valid email address required'),
  address: z.string().min(3, 'Address required'),
  emergencyName: z.string().min(1, 'Emergency contact name required'),
  emergencyRelation: z.string().min(1, 'Relationship required'),
  emergencyPhone: z.string().min(5, 'Emergency contact phone required'),
  insuranceProvider: z.string().min(1, 'Insurance provider required'),
  insurancePolicy: z.string().min(1, 'Policy number required'),
  insuranceGroup: z.string().optional(),
  riskStatus: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  // Medical alerts
  bleedingDisorder: z.boolean(),
  diabetes: z.boolean(),
  hypertension: z.boolean(),
  penicillinAllergy: z.boolean(),
  latexAllergy: z.boolean(),
  pregnant: z.boolean(),
  infectiousDisease: z.boolean(),
  heartCondition: z.boolean(),
  otherAlerts: z.string().optional(),
});

type PatientFormData = z.infer<typeof patientSchema>;

interface PatientFormModalProps {
  patient?: Patient | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (patient: Patient) => void;
}

export const PatientFormModal: React.FC<PatientFormModalProps> = ({
  patient,
  isOpen,
  onClose,
  onSave,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PatientFormData>({
    resolver: zodResolver(patientSchema),
    defaultValues: patient
      ? {
          firstName: patient.firstName,
          lastName: patient.lastName,
          dateOfBirth: patient.dateOfBirth,
          gender: patient.gender,
          phone: patient.phone,
          email: patient.email,
          address: patient.address,
          emergencyName: patient.emergencyContact.name,
          emergencyRelation: patient.emergencyContact.relationship,
          emergencyPhone: patient.emergencyContact.phone,
          insuranceProvider: patient.insurance.provider,
          insurancePolicy: patient.insurance.policyNumber,
          insuranceGroup: patient.insurance.groupNumber || '',
          riskStatus: patient.riskStatus,
          bleedingDisorder: patient.medicalHistory.bleedingDisorder,
          diabetes: patient.medicalHistory.diabetes,
          hypertension: patient.medicalHistory.hypertension,
          penicillinAllergy: patient.medicalHistory.penicillinAllergy,
          latexAllergy: patient.medicalHistory.latexAllergy,
          pregnant: patient.medicalHistory.pregnant,
          infectiousDisease: patient.medicalHistory.infectiousDisease,
          heartCondition: patient.medicalHistory.heartCondition,
          otherAlerts: patient.medicalHistory.otherAlerts || '',
        }
      : {
          firstName: '',
          lastName: '',
          dateOfBirth: '',
          gender: 'Male',
          phone: '',
          email: '',
          address: '',
          emergencyName: '',
          emergencyRelation: '',
          emergencyPhone: '',
          insuranceProvider: '',
          insurancePolicy: '',
          insuranceGroup: '',
          riskStatus: 'LOW',
          bleedingDisorder: false,
          diabetes: false,
          hypertension: false,
          penicillinAllergy: false,
          latexAllergy: false,
          pregnant: false,
          infectiousDisease: false,
          heartCondition: false,
          otherAlerts: '',
        },
  });

  if (!isOpen) return null;

  const onSubmit = (data: PatientFormData) => {
    const newId = `pat-${window.crypto.randomUUID ? window.crypto.randomUUID().slice(0, 8) : 'new'}`;
    const formattedPatient: Patient = {
      id: patient ? patient.id : newId,
      firstName: data.firstName,
      lastName: data.lastName,
      dateOfBirth: data.dateOfBirth,
      gender: data.gender,
      phone: data.phone,
      email: data.email,
      address: data.address,
      emergencyContact: {
        name: data.emergencyName,
        relationship: data.emergencyRelation,
        phone: data.emergencyPhone,
      },
      insurance: {
        provider: data.insuranceProvider,
        policyNumber: data.insurancePolicy,
        groupNumber: data.insuranceGroup || undefined,
      },
      riskStatus: data.riskStatus as RiskStatus,
      medicalHistory: {
        bleedingDisorder: data.bleedingDisorder,
        diabetes: data.diabetes,
        hypertension: data.hypertension,
        penicillinAllergy: data.penicillinAllergy,
        latexAllergy: data.latexAllergy,
        pregnant: data.pregnant,
        infectiousDisease: data.infectiousDisease,
        heartCondition: data.heartCondition,
        otherAlerts: data.otherAlerts || undefined,
      },
      teethConditions: patient ? patient.teethConditions : [],
      lastVisitDate: patient ? patient.lastVisitDate : new Date().toISOString().split('T')[0],
      createdDate: patient ? patient.createdDate : new Date().toISOString().split('T')[0],
    };

    onSave(formattedPatient);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 my-8 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
          <h3 className="text-lg font-bold">
            {patient ? 'Edit Patient Demographics & History' : 'Register New Dental Patient'}
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Section 1: Demographics */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 border-b pb-2 mb-3">1. Patient Demographics</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">First Name</label>
                <input {...register('firstName')} className="w-full text-sm border rounded-lg px-3 py-2" />
                {errors.firstName && <p className="text-xs text-red-500">{errors.firstName.message}</p>}
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Last Name</label>
                <input {...register('lastName')} className="w-full text-sm border rounded-lg px-3 py-2" />
                {errors.lastName && <p className="text-xs text-red-500">{errors.lastName.message}</p>}
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Date of Birth</label>
                <input type="date" {...register('dateOfBirth')} className="w-full text-sm border rounded-lg px-3 py-2" />
                {errors.dateOfBirth && <p className="text-xs text-red-500">{errors.dateOfBirth.message}</p>}
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Gender</label>
                <select {...register('gender')} className="w-full text-sm border rounded-lg px-3 py-2">
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
                <input {...register('phone')} className="w-full text-sm border rounded-lg px-3 py-2" />
                {errors.phone && <p className="text-xs text-red-500">{errors.phone.message}</p>}
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                <input type="email" {...register('email')} className="w-full text-sm border rounded-lg px-3 py-2" />
                {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">Residential Address</label>
                <input {...register('address')} className="w-full text-sm border rounded-lg px-3 py-2" />
                {errors.address && <p className="text-xs text-red-500">{errors.address.message}</p>}
              </div>
            </div>
          </div>

          {/* Section 2: Emergency Contact & Insurance */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 border-b pb-2 mb-3">2. Emergency Contact & Insurance</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Emergency Contact Name</label>
                <input {...register('emergencyName')} className="w-full text-sm border rounded-lg px-3 py-2" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Relationship</label>
                <input {...register('emergencyRelation')} className="w-full text-sm border rounded-lg px-3 py-2" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Emergency Phone</label>
                <input {...register('emergencyPhone')} className="w-full text-sm border rounded-lg px-3 py-2" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Insurance Provider</label>
                <input {...register('insuranceProvider')} className="w-full text-sm border rounded-lg px-3 py-2" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Policy Number</label>
                <input {...register('insurancePolicy')} className="w-full text-sm border rounded-lg px-3 py-2" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Group Number</label>
                <input {...register('insuranceGroup')} className="w-full text-sm border rounded-lg px-3 py-2" />
              </div>
            </div>
          </div>

          {/* Section 3: Medical Alerts Checklist */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between mb-3 border-b pb-2">
              <h4 className="text-sm font-bold text-slate-900">3. Medical History & Alert Checklist</h4>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-semibold text-slate-700">Calculated Risk:</span>
                <select {...register('riskStatus')} className="text-xs font-bold border rounded px-2 py-1 bg-white">
                  <option value="LOW">LOW</option>
                  <option value="MEDIUM">MEDIUM</option>
                  <option value="HIGH">HIGH</option>
                  <option value="CRITICAL">CRITICAL</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" {...register('bleedingDisorder')} className="rounded text-red-600 focus:ring-red-500" />
                <span className="font-medium text-slate-800">Bleeding Disorder</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" {...register('penicillinAllergy')} className="rounded text-red-600 focus:ring-red-500" />
                <span className="font-semibold text-red-700">Penicillin Allergy</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" {...register('latexAllergy')} className="rounded text-red-600 focus:ring-red-500" />
                <span className="font-semibold text-red-700">Latex Allergy</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" {...register('heartCondition')} className="rounded text-red-600 focus:ring-red-500" />
                <span className="font-medium text-slate-800">Heart Condition</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" {...register('diabetes')} className="rounded text-red-600 focus:ring-red-500" />
                <span className="font-medium text-slate-800">Diabetes</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" {...register('hypertension')} className="rounded text-red-600 focus:ring-red-500" />
                <span className="font-medium text-slate-800">Hypertension</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" {...register('pregnant')} className="rounded text-red-600 focus:ring-red-500" />
                <span className="font-medium text-slate-800">Pregnancy</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" {...register('infectiousDisease')} className="rounded text-red-600 focus:ring-red-500" />
                <span className="font-medium text-slate-800">Infectious Disease</span>
              </label>
            </div>

            <div className="mt-3">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Additional Warning Notes</label>
              <input
                {...register('otherAlerts')}
                placeholder="Specific precautions, drug interactions, or severe reactions..."
                className="w-full text-xs border rounded-lg px-3 py-1.5 bg-white"
              />
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3 border-t pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-semibold flex items-center space-x-1.5 shadow-sm"
            >
              <Save className="w-4 h-4" />
              <span>Save Patient Record</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
