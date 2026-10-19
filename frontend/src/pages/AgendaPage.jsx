import React, { useState, useEffect } from 'react';
import { useDental } from '../context/DentalContext';
import { api } from '../services/api';
import {
  Calendar,
  Clock,
  Plus,
  ChevronLeft,
  ChevronRight,
  User,
  Phone,
  CheckCircle2,
  FileText
} from 'lucide-react';

export const AgendaPage = () => {
  const { selectPatientAndGo, setIsNewRdvModalOpen } = useDental();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchDayAppointments = async () => {
    try {
      setLoading(true);
      const data = await api.getAppointments({ date: selectedDate });
      setAppointments(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDayAppointments();
  }, [selectedDate]);

  const changeDateBy = (days) => {
    const current = new Date(selectedDate);
    current.setDate(current.getDate() + days);
    setSelectedDate(current.toISOString().split('T')[0]);
  };

  const formattedDate = new Date(selectedDate).toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-black text-slate-800">
                Agenda & Calendrier des Consultations
              </h1>
              <p className="text-xs text-slate-400">
                Planning journalier du cabinet dentaire et créneaux des soins
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center bg-slate-100 rounded-xl p-1">
              <button
                onClick={() => changeDateBy(-1)}
                className="p-1.5 hover:bg-white rounded-lg transition-colors text-slate-600"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-3 text-xs font-bold text-slate-800 capitalize">
                {formattedDate}
              </span>
              <button
                onClick={() => changeDateBy(1)}
                className="p-1.5 hover:bg-white rounded-lg transition-colors text-slate-600"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={() => setIsNewRdvModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>+ Planifier RDV</span>
            </button>
          </div>
        </div>
      </div>

      {/* Daily Timeline */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Consultations du jour ({appointments.length})
          </span>
          <span className="text-xs text-slate-400">Créneaux de 30 minutes</span>
        </div>

        {appointments.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs">
            Aucun rendez-vous prévu pour cette journée. Cliquez sur "+ Planifier RDV".
          </div>
        ) : (
          <div className="space-y-3">
            {appointments.map((apt) => (
              <div
                key={apt._id}
                className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/60 hover:bg-white hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-14 rounded-2xl bg-indigo-100/70 text-indigo-900 font-mono font-black text-sm flex items-center justify-center border border-indigo-200 shrink-0">
                    {apt.startTime}
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                      <span>
                        {apt.patient?.firstName} {apt.patient?.lastName}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          apt.status === 'Terminé'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {apt.status}
                      </span>
                    </h3>
                    <div className="text-xs text-slate-500 font-medium flex items-center gap-2 mt-0.5">
                      <span className="text-indigo-700 font-bold">{apt.service}</span>
                      <span>•</span>
                      <span>Durée: {apt.durationMinutes || 30} min</span>
                      {apt.patient?.phone && (
                        <>
                          <span>•</span>
                          <span>Tél: {apt.patient.phone}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => apt.patient && selectPatientAndGo(apt.patient, 'schema')}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-teal-50 text-teal-700 hover:bg-teal-100 border border-teal-200"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Ouvrir Dossier</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
