import React, { useState, useEffect } from 'react';
import { useDental } from '../context/DentalContext';
import { api } from '../services/api';
import {
  Users,
  Calendar,
  CreditCard,
  Layers,
  ArrowRight,
  UserPlus,
  Clock,
  Sparkles,
  TrendingUp,
  Activity,
  AlertTriangle,
  Play
} from 'lucide-react';

export const DashboardPage = () => {
  const {
    patients,
    waitingList,
    selectPatientAndGo,
    setIsPatientModalOpen,
    setIsNewRdvModalOpen,
    setCurrentView
  } = useDental();

  const [financeSummary, setFinanceSummary] = useState(null);
  const [todayAppointments, setTodayAppointments] = useState([]);

  useEffect(() => {
    api.getFinanceSummary().then((data) => setFinanceSummary(data));
    api.getAppointments({ date: new Date().toISOString() }).then((data) => {
      setTodayAppointments(data);
    });
  }, []);

  const activeWaiting = waitingList.filter((w) => w.status !== 'Terminé');

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-teal-700 via-teal-600 to-emerald-600 rounded-3xl p-6 sm:p-8 text-white shadow-lg shadow-teal-700/15 relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <span className="px-3 py-1 rounded-full text-[11px] font-extrabold bg-white/20 backdrop-blur-xs uppercase tracking-wider">
            Cabinet Dentaire Moderne • Casablanca
          </span>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight mt-3">
            Bienvenue sur Dentolio
          </h1>
          <p className="text-teal-100 text-xs sm:text-sm mt-1.5 font-medium leading-relaxed">
            Moins de paperasse, plus de temps pour vos patients. Gérez vos consultations, odontogrammes, dossiers mutuelles et facturation en quelques clics.
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-5">
            <button
              onClick={() => setIsPatientModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-white text-teal-800 hover:bg-teal-50 rounded-xl text-xs font-bold shadow-sm transition-all"
            >
              <UserPlus className="w-4 h-4 text-teal-600" />
              <span>Nouveau Patient</span>
            </button>
            <button
              onClick={() => setCurrentView('waiting-room')}
              className="flex items-center gap-1.5 px-4 py-2 bg-teal-800/60 hover:bg-teal-800 text-white rounded-xl text-xs font-bold border border-white/20 transition-all"
            >
              <Users className="w-4 h-4 text-emerald-300" />
              <span>Salle d'attente ({activeWaiting.length})</span>
            </button>
          </div>
        </div>

        {/* Ambient decorative circle */}
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-80 h-80 rounded-full bg-emerald-500/20 blur-3xl" />
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Patients */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Patients Suivis
            </span>
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-800">{patients.length}</div>
          <span className="text-[11px] text-teal-600 font-semibold mt-1 block">
            Dossiers médicaux informatisés
          </span>
        </div>

        {/* Waiting Room */}
        <div
          onClick={() => setCurrentView('waiting-room')}
          className="bg-white rounded-2xl border border-emerald-200 p-5 shadow-xs cursor-pointer hover:border-emerald-400 transition-colors"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
              Salle d'Attente
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-600">{activeWaiting.length}</div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            Patients actuellement en attente
          </span>
        </div>

        {/* Today's RDV */}
        <div
          onClick={() => setCurrentView('agenda')}
          className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs cursor-pointer hover:border-indigo-400 transition-colors"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">
              RDV Aujourd'hui
            </span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-800">
            {todayAppointments.length || 3}
          </div>
          <span className="text-[11px] text-indigo-600 font-semibold mt-1 block">
            Planning de consultation
          </span>
        </div>

        {/* Total Recettes */}
        <div
          onClick={() => setCurrentView('finance')}
          className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs cursor-pointer hover:border-teal-400 transition-colors"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Recettes Encaissées
            </span>
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-teal-700">
            {financeSummary?.totalRecettes?.toLocaleString('fr-FR', {
              minimumFractionDigits: 2
            }) || '0.00'}{' '}
            DH
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">
            Trésorerie nette : {financeSummary?.beneficeNet || 0} DH
          </span>
        </div>
      </div>

      {/* Main Grid: Patients list & Live Salle d'attente */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Quick Patients List */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">
                Dossiers Patients Récents
              </h2>
              <p className="text-xs text-slate-400">
                Sélectionnez un patient pour ouvrir son odontogramme et ses mutuelles
              </p>
            </div>
            <button
              onClick={() => setIsPatientModalOpen(true)}
              className="px-3 py-1.5 text-xs font-bold rounded-xl bg-teal-50 text-teal-700 hover:bg-teal-100 transition-colors"
            >
              + Nouveau
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {patients.map((pat) => (
              <div
                key={pat._id}
                onClick={() => selectPatientAndGo(pat, 'schema')}
                className="p-4 hover:bg-teal-50/50 cursor-pointer flex items-center justify-between transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-black text-sm">
                    {pat.firstName[0]}
                    {pat.lastName[0]}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <strong className="text-sm text-slate-800 group-hover:text-teal-700 transition-colors">
                        {pat.firstName} {pat.lastName}
                      </strong>
                      {pat.medicalHistory?.allergies?.length > 0 && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-rose-100 text-rose-700">
                          Alerte
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                      <span>CIN: {pat.cin || 'N/A'}</span>
                      <span>•</span>
                      <span>Tél: {pat.phone}</span>
                      <span>•</span>
                      <span className="font-semibold text-slate-600">
                        {pat.mutuelle?.provider}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">
                      Solde
                    </span>
                    <strong
                      className={`text-xs font-black ${
                        pat.financials?.remainingAmount > 0 ? 'text-rose-600' : 'text-emerald-600'
                      }`}
                    >
                      {pat.financials?.remainingAmount || 0} DH
                    </strong>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-teal-600 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Live Waiting Room mini widget */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
              <h2 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">
                Salle d'Attente Active ({activeWaiting.length})
              </h2>
            </div>
            <button
              onClick={() => setCurrentView('waiting-room')}
              className="text-xs font-semibold text-teal-600 hover:text-teal-800"
            >
              Gérer la file →
            </button>
          </div>

          {activeWaiting.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              Aucun patient dans la salle d'attente.
            </div>
          ) : (
            <div className="space-y-3">
              {activeWaiting.map((item) => (
                <div
                  key={item._id}
                  className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 flex items-center justify-between"
                >
                  <div>
                    <strong className="text-xs text-slate-800 block">
                      {item.patient?.firstName} {item.patient?.lastName}
                    </strong>
                    <span className="text-[11px] text-slate-500">{item.motif}</span>
                  </div>
                  <button
                    onClick={() => {
                      if (item.patient) selectPatientAndGo(item.patient, 'schema');
                    }}
                    className="flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
                  >
                    <Play className="w-3 h-3 fill-white" />
                    <span>Appeler</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
