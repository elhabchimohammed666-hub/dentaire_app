import React from 'react';
import { useDental } from '../context/DentalContext';
import { PatientHeader } from '../components/patients/PatientHeader';
import { Odontogram } from '../components/odontogram/Odontogram';
import { PaymentHistory } from '../components/payments/PaymentHistory';
import { AppointmentTab } from '../components/appointments/AppointmentTab';
import { ImagingTab } from '../components/imaging/ImagingTab';
import { AestheticReportTab } from '../components/imaging/AestheticReportTab';
import { PrescriptionTab } from '../components/prescriptions/PrescriptionTab';
import { ProtheseTab } from '../components/protheses/ProtheseTab';
import {
  Layers,
  CreditCard,
  Calendar,
  Camera,
  Sparkles,
  Pill,
  Shield,
  FileText,
  User,
  HeartPulse
} from 'lucide-react';

export const PatientDetailPage = () => {
  const { currentPatient, activeTab, setActiveTab, setIsFeuilleDeSoinsOpen } = useDental();

  // Navigation tabs matching the exact tabs in the video demo (00:09, 00:19, 00:26, 00:36)
  const tabs = [
    { id: 'schema', label: 'Schéma Dentaire', icon: Layers },
    { id: 'paiements', label: 'Paiements', icon: CreditCard },
    { id: 'rdv', label: 'Rendez-vous', icon: Calendar },
    { id: 'imagerie', label: 'Imagerie', icon: Camera },
    { id: 'rapport-esthetique', label: 'Rapport Esthétique', icon: Sparkles },
    { id: 'ordonnances', label: 'Ordonnances', icon: Pill },
    { id: 'feuilles-soins', label: 'Feuilles de Soins', icon: Shield },
    { id: 'protheses', label: 'Prothèses Labo', icon: FileText },
    { id: 'info', label: 'Info Patient', icon: User }
  ];

  const handleTabClick = (tabId) => {
    if (tabId === 'feuilles-soins') {
      setIsFeuilleDeSoinsOpen(true);
    } else {
      setActiveTab(tabId);
    }
  };

  return (
    <div className="space-y-6">
      {/* Patient Profile Header (Identity, Medical Alerts, Financial Summary, Action buttons) */}
      <PatientHeader />

      {/* Tabs Navigation Bar (Matching Video Sub-Navigation Exactly) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-1.5 overflow-x-auto">
        <nav className="flex items-center gap-1 min-w-max">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-teal-600 text-white shadow-sm shadow-teal-600/20'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content Rendering */}
      <div>
        {activeTab === 'schema' && <Odontogram />}
        {activeTab === 'paiements' && <PaymentHistory />}
        {activeTab === 'rdv' && <AppointmentTab />}
        {activeTab === 'imagerie' && <ImagingTab />}
        {activeTab === 'rapport-esthetique' && <AestheticReportTab />}
        {activeTab === 'ordonnances' && <PrescriptionTab />}
        {activeTab === 'protheses' && <ProtheseTab />}
        {activeTab === 'info' && (
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-4">
            <h3 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
              <User className="w-5 h-5 text-teal-600" />
              <span>Dossier Administratif et Médical Complet</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                <span className="font-bold text-slate-700 block">Identité & Contact</span>
                <p>Nom complet : <strong>{currentPatient?.firstName} {currentPatient?.lastName}</strong></p>
                <p>CIN : <strong>{currentPatient?.cin || 'Non renseigné'}</strong></p>
                <p>Téléphone : <strong>{currentPatient?.phone}</strong></p>
                <p>Email : <strong>{currentPatient?.email || 'Non renseigné'}</strong></p>
                <p>Adresse : <strong>{currentPatient?.address || 'Casablanca'}</strong></p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                <span className="font-bold text-slate-700 block">Assurance Médicale</span>
                <p>Organisme : <strong>{currentPatient?.mutuelle?.provider}</strong></p>
                <p>N° Affiliation : <strong>{currentPatient?.mutuelle?.affiliationNumber || '—'}</strong></p>
                <p>N° Immatriculation : <strong>{currentPatient?.mutuelle?.immatriculation || '—'}</strong></p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
