import React, { useState, useEffect } from 'react';
import { useDental } from '../../context/DentalContext';
import { api } from '../../services/api';
import {
  Calendar,
  Clock,
  Plus,
  Trash2,
  CheckCircle,
  AlertCircle,
  CalendarCheck,
  CalendarX
} from 'lucide-react';

export const AppointmentTab = () => {
  const { currentPatient, setIsNewRdvModalOpen, showToast } = useDental();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAppointments = async () => {
    if (!currentPatient?._id) return;
    try {
      setLoading(true);
      const data = await api.getAppointmentsByPatient(currentPatient._id);
      setAppointments(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [currentPatient?._id]);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await api.updateAppointment(id, { status: newStatus });
      showToast('Statut du rendez-vous actualisé');
      await fetchAppointments();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Voulez-vous supprimer ce rendez-vous ?')) return;
    try {
      await api.deleteAppointment(id);
      showToast('Rendez-vous supprimé');
      await fetchAppointments();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-800">
                Historique des Rendez-vous
              </h2>
              <p className="text-xs text-slate-400">
                Suivi complet des consultations, des soins programmés et de la ponctualité
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsNewRdvModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Nouveau RDV</span>
          </button>
        </div>
      </div>

      {/* Table (Matching Video 00:20) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Rendez-vous Enregistrés ({appointments.length})
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/50 text-slate-500 font-bold uppercase tracking-wider text-[11px] border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Heure</th>
                <th className="py-3.5 px-4">Service</th>
                <th className="py-3.5 px-4">Statut</th>
                <th className="py-3.5 px-4">Notes</th>
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {appointments.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-slate-400">
                    Aucun rendez-vous planifié.
                  </td>
                </tr>
              ) : (
                appointments.map((apt) => (
                  <tr key={apt._id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 text-slate-800 font-bold whitespace-nowrap">
                      {new Date(apt.date).toLocaleDateString('fr-FR', {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-extrabold text-teal-800">
                      {apt.startTime}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-700">{apt.service}</td>
                    <td className="py-3.5 px-4">
                      <select
                        value={apt.status}
                        onChange={(e) => handleUpdateStatus(apt._id, e.target.value)}
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full border outline-none cursor-pointer ${
                          apt.status === 'Terminé'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                            : apt.status === 'Confirmé'
                            ? 'bg-blue-50 text-blue-700 border-blue-300'
                            : apt.status === 'En attente'
                            ? 'bg-amber-50 text-amber-700 border-amber-300'
                            : 'bg-rose-50 text-rose-700 border-rose-300'
                        }`}
                      >
                        <option value="En attente">En attente</option>
                        <option value="Confirmé">Confirmé</option>
                        <option value="Terminé">Terminé</option>
                        <option value="Annulé">Annulé</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 italic">{apt.notes || '—'}</td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => handleDelete(apt._id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
