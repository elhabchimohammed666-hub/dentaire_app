import React, { useState } from 'react';
import { useDental } from '../../context/DentalContext';
import { api } from '../../services/api';
import { Calendar, Clock, Plus, X } from 'lucide-react';

export const AppointmentModal = () => {
  const { isNewRdvModalOpen, setIsNewRdvModalOpen, currentPatient, showToast } = useDental();

  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('09:00');
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [service, setService] = useState('Contrôle périodique');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isNewRdvModalOpen || !currentPatient) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await api.createAppointment({
        patient: currentPatient._id,
        date: new Date(date),
        startTime,
        durationMinutes: Number(durationMinutes),
        service,
        notes,
        status: 'Confirmé'
      });
      showToast('Rendez-vous planifié avec succès !');
      setIsNewRdvModalOpen(false);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <Calendar className="w-5 h-5 text-indigo-600" />
            <div>
              <h3 className="text-base font-extrabold text-slate-800">Nouveau Rendez-vous</h3>
              <p className="text-xs text-slate-400">
                Patient: {currentPatient.firstName} {currentPatient.lastName}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsNewRdvModalOpen(false)}
            className="w-8 h-8 rounded-full bg-slate-200/60 hover:bg-slate-200 text-slate-600 flex items-center justify-center text-xs font-bold"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Date *</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Heure *</label>
              <input
                type="time"
                required
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono font-bold rounded-xl border border-slate-200 focus:border-indigo-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Type de soin / Service
            </label>
            <select
              value={service}
              onChange={(e) => setService(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:border-indigo-500 outline-none bg-white font-medium"
            >
              <option value="Contrôle périodique">Contrôle périodique</option>
              <option value="Soin / Plombage">Soin / Plombage composite</option>
              <option value="Détartrage">Détartrage complet</option>
              <option value="Extraction">Extraction dentaire</option>
              <option value="Orthodontie">Orthodontie</option>
              <option value="Endodontie / Dévitalisation">Endodontie / Dévitalisation</option>
              <option value="Prothèse / Essayage">Prothèse / Essayage couronne</option>
              <option value="Urgence">Urgence / Douleur</option>
              <option value="Blanchiment">Blanchiment dentaire</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Durée estimée (minutes)
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[15, 30, 45, 60].map((mins) => (
                <button
                  key={mins}
                  type="button"
                  onClick={() => setDurationMinutes(mins)}
                  className={`py-1.5 text-xs font-bold rounded-xl border ${
                    durationMinutes === mins
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-slate-50 text-slate-600 border-slate-200'
                  }`}
                >
                  {mins} min
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Notes internes</label>
            <textarea
              rows="2"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: Patient anxieux, anesthésie sans vasoconstricteur..."
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsNewRdvModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-100 rounded-xl"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 text-xs font-extrabold bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl shadow-md shadow-indigo-600/20"
            >
              {loading ? 'Planification...' : 'Confirmer le Rendez-vous'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
