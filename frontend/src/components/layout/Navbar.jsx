import React, { useState, useRef, useEffect } from 'react';
import { useDental } from '../../context/DentalContext';
import {
  Search,
  LayoutDashboard,
  Calendar,
  Users,
  UserPlus,
  Bell,
  MessageSquare,
  Activity,
  ChevronDown,
  Stethoscope,
  X
} from 'lucide-react';

export const Navbar = () => {
  const {
    currentView,
    setCurrentView,
    patients,
    waitingList,
    searchTerm,
    setSearchTerm,
    selectPatientAndGo,
    setIsPatientModalOpen,
    setEditingPatient,
    settings
  } = useDental();

  const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState(false);
  const searchRef = useRef(null);

  // Close search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsSearchDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectPatient = (patient) => {
    selectPatientAndGo(patient, 'schema');
    setIsSearchDropdownOpen(false);
    setSearchTerm('');
  };

  const handleCreatePatient = () => {
    setEditingPatient(null);
    setIsPatientModalOpen(true);
  };

  const activeWaitingCount = waitingList.filter((w) => w.status !== 'Terminé').length;

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200/80 shadow-xs backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentView('dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-teal-500/20">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2C7.5 2 4 4.5 4 8c0 3 2 5.5 3 9.5.7 2.8 2.5 4.5 5 4.5s4.3-1.7 5-4.5c1-4 3-6.5 3-9.5 0-3.5-3.5-6-8-6z"/>
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-slate-800">DENTOLIO</span>
                <span className="px-1.5 py-0.5 text-[10px] font-bold bg-teal-50 text-teal-700 rounded-md border border-teal-200 uppercase">PRO</span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">Cabinet Dentaire Moderne</p>
            </div>
          </div>

          {/* Global Search Bar (Matching Demo) */}
          <div className="flex-1 max-w-lg relative" ref={searchRef}>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setIsSearchDropdownOpen(true);
                }}
                onFocus={() => setIsSearchDropdownOpen(true)}
                placeholder="Rechercher patient, rendez-vous, acte..."
                className="w-full pl-10 pr-9 py-2 bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-sm rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Live Search Results Dropdown */}
            {isSearchDropdownOpen && searchTerm.trim() && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50 divide-y divide-slate-100 max-h-80 overflow-y-auto">
                <div className="p-2 text-xs font-semibold text-slate-400 uppercase tracking-wider bg-slate-50">
                  Résultats Patients ({patients.length})
                </div>
                {patients.length === 0 ? (
                  <div className="p-4 text-center text-sm text-slate-500">
                    Aucun patient trouvé pour "{searchTerm}"
                  </div>
                ) : (
                  patients.map((patient) => (
                    <div
                      key={patient._id}
                      onClick={() => handleSelectPatient(patient)}
                      className="p-3 hover:bg-teal-50/60 cursor-pointer flex items-center justify-between transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-xs">
                          {patient.firstName[0]}
                          {patient.lastName[0]}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-slate-800">
                            {patient.firstName} {patient.lastName}
                          </div>
                          <div className="text-xs text-slate-400 flex items-center gap-2">
                            <span>CIN: {patient.cin || 'N/A'}</span>
                            <span>•</span>
                            <span>Tél: {patient.phone}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                          {patient.mutuelle?.provider || 'Sans mutuelle'}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Quick Action Navigation Pills (Matching Demo Video Exactly) */}
          <div className="flex items-center gap-2">
            {/* Dashboard Button */}
            <button
              onClick={() => setCurrentView('dashboard')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                currentView === 'dashboard'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-blue-50 text-blue-700 hover:bg-blue-100/80 border border-blue-200/60'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </button>

            {/* Calendrier Button */}
            <button
              onClick={() => setCurrentView('agenda')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                currentView === 'agenda'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100/80 border border-indigo-200/60'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Calendrier</span>
            </button>

            {/* Salle d'attente (with active counter badge) */}
            <button
              onClick={() => setCurrentView('waiting-room')}
              className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                currentView === 'waiting-room'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100/80 border border-emerald-200/60'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Salle d'attente</span>
              {activeWaitingCount > 0 && (
                <span className="ml-1 w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold">
                  {activeWaitingCount}
                </span>
              )}
            </button>

            {/* Livre Comptabilité / Finance */}
            <button
              onClick={() => setCurrentView('finance')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                currentView === 'finance'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-purple-50 text-purple-700 hover:bg-purple-100/80 border border-purple-200/60'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Recettes / Dépenses</span>
            </button>

            {/* Quick Add Patient Button */}
            <button
              onClick={handleCreatePatient}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-sm transition-all"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>+ Patient</span>
            </button>

            {/* Doctor Avatar / Clinic Profile */}
            <div className="pl-2 border-l border-slate-200 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 font-bold text-xs">
                DR
              </div>
              <div className="hidden xl:block text-left">
                <p className="text-xs font-bold text-slate-800 leading-none">{settings?.doctorName || 'Dr. Dentolio'}</p>
                <p className="text-[10px] text-teal-600 font-medium">Chirurgien-Dentiste</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
