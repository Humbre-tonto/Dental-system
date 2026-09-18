import { useEffect, useState } from 'react';
import { useDentalStore } from './store/useDentalStore';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { PatientList } from './features/patients/PatientList';
import { PatientProfileView } from './features/patients/PatientProfileView';
import { AppointmentSchedule } from './features/appointments/AppointmentSchedule';
import { PatientFormModal } from './features/patients/PatientFormModal';
import { AppointmentModal } from './features/appointments/AppointmentModal';
import { ToastContainer } from './components/shared/Toast';

export function App() {
  const { initializeStore, isLoading, activeTab, addOrUpdatePatient, addOrUpdateAppointment } =
    useDentalStore();

  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);

  useEffect(() => {
    initializeStore();
  }, [initializeStore]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white space-y-4">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-bold tracking-wider text-slate-400 uppercase">
          Initializing ApexDental IndexedDB Store...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-900 antialiased">
      <Navbar
        onNewPatientClick={() => setIsPatientModalOpen(true)}
        onNewAppointmentClick={() => setIsAppointmentModalOpen(true)}
      />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar />

        <main className="flex-1 p-6 overflow-y-auto">
          {activeTab === 'directory' && (
            <PatientList onNewPatientClick={() => setIsPatientModalOpen(true)} />
          )}

          {activeTab === 'profile' && <PatientProfileView />}

          {activeTab === 'schedule' && <AppointmentSchedule />}
        </main>
      </div>

      <PatientFormModal
        isOpen={isPatientModalOpen}
        onClose={() => setIsPatientModalOpen(false)}
        onSave={addOrUpdatePatient}
      />

      <AppointmentModal
        isOpen={isAppointmentModalOpen}
        onClose={() => setIsAppointmentModalOpen(false)}
        onSave={addOrUpdateAppointment}
      />

      <ToastContainer />
    </div>
  );
}

export default App;
