import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';

const DentalContext = createContext();

export const DentalProvider = ({ children }) => {
  // Navigation
  const [currentView, setCurrentView] = useState('patient-profile'); // 'patient-profile', 'dashboard', 'agenda', 'waiting-room', 'finance', 'protheses'
  const [activeTab, setActiveTab] = useState('schema'); // 'schema', 'paiements', 'rdv', 'imagerie', 'rapport-esthetique', 'ordonnances', 'certificats', 'feuilles-soins', 'protheses', 'info'

  // Data
  const [patients, setPatients] = useState([]);
  const [currentPatient, setCurrentPatient] = useState(null);
  const [waitingList, setWaitingList] = useState([]);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Toast notifications
  const [toast, setToast] = useState(null);
  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Modals
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isFeuilleDeSoinsOpen, setIsFeuilleDeSoinsOpen] = useState(false);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [invoiceData, setInvoiceData] = useState(null);
  const [isNewRdvModalOpen, setIsNewRdvModalOpen] = useState(false);
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [isPrescriptionPrintOpen, setIsPrescriptionPrintOpen] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState(null);

  // Fetch initial data
  const fetchPatients = useCallback(async (search = '') => {
    try {
      const data = await api.getPatients(search ? { search } : {});
      setPatients(data);
      // If no current patient selected or active patient updated, maintain selection
      if (data.length > 0) {
        setCurrentPatient((prev) => {
          if (!prev) return data[0];
          const found = data.find((p) => p._id === prev._id);
          return found || data[0];
        });
      }
    } catch (err) {
      console.error('Error fetching patients:', err);
    }
  }, []);

  const fetchWaitingQueue = useCallback(async () => {
    try {
      const data = await api.getWaitingQueue();
      setWaitingList(data);
    } catch (err) {
      console.error('Error fetching waiting queue:', err);
    }
  }, []);

  const fetchSettings = useCallback(async () => {
    try {
      const data = await api.getSettings();
      setSettings(data);
    } catch (err) {
      console.error('Error fetching settings:', err);
    }
  }, []);

  const refreshCurrentPatient = useCallback(async () => {
    if (!currentPatient?._id) return;
    try {
      const fresh = await api.getPatientById(currentPatient._id);
      setCurrentPatient(fresh);
      // Also update in patient list
      setPatients((prev) => prev.map((p) => (p._id === fresh._id ? fresh : p)));
    } catch (err) {
      console.error('Error refreshing patient:', err);
    }
  }, [currentPatient?._id]);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([fetchPatients(), fetchWaitingQueue(), fetchSettings()]);
      setLoading(false);
    };
    init();
  }, [fetchPatients, fetchWaitingQueue, fetchSettings]);

  // Handle global search debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPatients(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, fetchPatients]);

  // Modal helpers
  const openInvoice = (payment, treatment, patient) => {
    setInvoiceData({
      payment,
      treatment,
      patient: patient || currentPatient,
      date: payment?.paymentDate ? new Date(payment.paymentDate).toLocaleDateString('fr-FR') : new Date().toLocaleDateString('fr-FR'),
      invoiceNumber: payment?.invoiceNumber || `FA-${new Date().getFullYear()}-00010`
    });
    setIsInvoiceModalOpen(true);
  };

  const openPrescriptionPrint = (prescription) => {
    setSelectedPrescription(prescription);
    setIsPrescriptionPrintOpen(true);
  };

  const selectPatientAndGo = (patient, targetTab = 'schema') => {
    setCurrentPatient(patient);
    setActiveTab(targetTab);
    setCurrentView('patient-profile');
  };

  return (
    <DentalContext.Provider
      value={{
        currentView,
        setCurrentView,
        activeTab,
        setActiveTab,
        patients,
        currentPatient,
        setCurrentPatient,
        refreshCurrentPatient,
        fetchPatients,
        waitingList,
        fetchWaitingQueue,
        settings,
        fetchSettings,
        loading,
        searchTerm,
        setSearchTerm,
        toast,
        showToast,
        selectPatientAndGo,

        // Modals
        isPaymentModalOpen,
        setIsPaymentModalOpen,
        isFeuilleDeSoinsOpen,
        setIsFeuilleDeSoinsOpen,
        isInvoiceModalOpen,
        setIsInvoiceModalOpen,
        invoiceData,
        openInvoice,
        isNewRdvModalOpen,
        setIsNewRdvModalOpen,
        isPatientModalOpen,
        setIsPatientModalOpen,
        editingPatient,
        setEditingPatient,
        isPrescriptionPrintOpen,
        setIsPrescriptionPrintOpen,
        selectedPrescription,
        openPrescriptionPrint
      }}
    >
      {children}
    </DentalContext.Provider>
  );
};

export const useDental = () => {
  const context = useContext(DentalContext);
  if (!context) {
    throw new Error('useDental must be used within DentalProvider');
  }
  return context;
};
