import React from 'react';
import { DentalProvider, useDental } from './context/DentalContext';
import { Navbar } from './components/layout/Navbar';
import { PatientDetailPage } from './pages/PatientDetailPage';
import { DashboardPage } from './pages/DashboardPage';
import { AgendaPage } from './pages/AgendaPage';
import { WaitingRoomPage } from './components/waiting/WaitingRoomPage';
import { FinancialDashboard } from './components/finance/FinancialDashboard';
import { PaymentModal } from './components/payments/PaymentModal';
import { FeuilleDeSoinsModal } from './components/mutualite/FeuilleDeSoinsModal';
import { InvoicePrintModal } from './components/payments/InvoicePrintModal';
import { AppointmentModal } from './components/appointments/AppointmentModal';
import { PatientModal } from './components/patients/PatientModal';
import { PrescriptionPrintModal } from './components/prescriptions/PrescriptionPrintModal';
import { Toast } from './components/common/Toast';

const AppContent = () => {
  const { currentView, loading } = useDental();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm font-bold text-slate-700">Chargement de Dentolio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100/60 pb-12 flex flex-col">
      {/* Top Navigation */}
      <Navbar />

      {/* Main View */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 flex-1 w-full">
        {currentView === 'dashboard' && <DashboardPage />}
        {currentView === 'patient-profile' && <PatientDetailPage />}
        {currentView === 'agenda' && <AgendaPage />}
        {currentView === 'waiting-room' && <WaitingRoomPage />}
        {currentView === 'finance' && <FinancialDashboard />}
      </main>

      {/* Modals & Overlays */}
      <PaymentModal />
      <FeuilleDeSoinsModal />
      <InvoicePrintModal />
      <AppointmentModal />
      <PatientModal />
      <PrescriptionPrintModal />
      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <DentalProvider>
      <AppContent />
    </DentalProvider>
  );
}
