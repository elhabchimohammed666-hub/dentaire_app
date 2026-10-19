import React, { useState, useEffect } from 'react';
import { useDental } from '../../context/DentalContext';
import { api } from '../../services/api';
import {
  Users,
  UserPlus,
  Trash2,
  Play,
  MessageSquare,
  FileText,
  AlertTriangle,
  Clock,
  Phone,
  CheckCircle,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const WaitingRoomPage = () => {
  const {
    waitingList,
    fetchWaitingQueue,
    patients,
    selectPatientAndGo,
    showToast
  } = useDental();

  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [motif, setMotif] = useState('Urgence / Douleur');
  const [priority, setPriority] = useState('Normale');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchWaitingQueue();
    const interval = setInterval(() => {
      fetchWaitingQueue();
    }, 15000); // Poll every 15s for live waiting room
    return () => clearInterval(interval);
  }, [fetchWaitingQueue]);

  const handleAddPatient = async (e) => {
    e.preventDefault();
    if (!selectedPatientId) {
      showToast('Veuillez sélectionner un patient', 'error');
      return;
    }

    try {
      setLoading(true);
      await api.addToWaitingQueue({
        patient: selectedPatientId,
        motif,
        priority,
        status: 'En Salle',
        arrivalTime: new Date()
      });
      showToast('Patient ajouté à la salle d’attente');
      setSelectedPatientId('');
      await fetchWaitingQueue();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleStartConsultation = async (item) => {
    try {
      await api.updateWaitingStatus(item._id, { status: 'En consultation' });
      showToast(`Consultation démarrée pour ${item.patient?.firstName} ${item.patient?.lastName}`);
      await fetchWaitingQueue();
      // Directly open patient dossier
      if (item.patient) {
        selectPatientAndGo(item.patient, 'schema');
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleRemove = async (id) => {
    try {
      await api.removeFromWaitingQueue(id);
      showToast('Patient retiré de la salle d’attente');
      await fetchWaitingQueue();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm('Voulez-vous vraiment vider toute la salle d’attente ?')) return;
    try {
      await api.clearWaitingQueue();
      showToast('Salle d’attente vidée');
      await fetchWaitingQueue();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const activePatients = waitingList.filter((w) => w.status !== 'Terminé');

  // Format arrival time (e.g. 16:27)
  const formatTime = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-black text-slate-800">
                Salle d'Attente Digitale en Temps Réel
              </h1>
              <p className="text-xs text-slate-400">
                Suivi du flux des patients au cabinet, priorisation des urgences et passage au fauteuil
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-3.5 py-1.5 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-200">
              {activePatients.length} en attente
            </span>
            {activePatients.length > 0 && (
              <button
                onClick={handleClearAll}
                className="px-3 py-1.5 text-xs font-bold rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-colors"
              >
                Vider la salle
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Ajouter un Patient à la salle (Matching Video 00:44) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 h-fit">
          <h2 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
            <UserPlus className="w-4 h-4 text-emerald-600" />
            <span>Ajouter un Patient</span>
          </h2>

          <form onSubmit={handleAddPatient} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Sélectionner le Patient *
              </label>
              <select
                required
                value={selectedPatientId}
                onChange={(e) => setSelectedPatientId(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs font-semibold rounded-xl border border-slate-200 focus:border-emerald-500 outline-none bg-white"
              >
                <option value="">-- Choisir un patient existant --</option>
                {patients.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.firstName} {p.lastName} ({p.phone}) - {p.cin || 'Sans CIN'}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Motif de consultation
              </label>
              <select
                value={motif}
                onChange={(e) => setMotif(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:border-emerald-500 outline-none bg-white"
              >
                <option value="Urgence / Douleur">Urgence / Douleur aiguë</option>
                <option value="Contrôle périodique">Contrôle périodique</option>
                <option value="Soin carie / Obturation">Soin carie / Obturation</option>
                <option value="Détartrage & Polissage">Détartrage & Polissage</option>
                <option value="Orthodontie">Orthodontie (Resserrage / Bagues)</option>
                <option value="Essayage Prothèse">Essayage Prothèse / Couronne</option>
                <option value="Extraction dentaire">Extraction dentaire</option>
                <option value="Blanchiment dentaire">Blanchiment dentaire</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Niveau de Priorité
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['Normale', 'Urgente', 'VIP'].map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`py-2 px-2 text-xs font-bold rounded-xl border text-center transition-all ${
                      priority === p
                        ? p === 'Urgente'
                          ? 'bg-rose-600 text-white border-rose-600'
                          : 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 text-xs font-extrabold bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
            >
              <span>+ Ajouter à la file d'attente</span>
            </button>
          </form>
        </div>

        {/* Right Column: Mobile-Styled Card Queue (Matching Video 00:45-00:47) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <h2 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <span>Liste des Patients en Attente</span>
              <span className="px-2 py-0.5 text-xs font-black rounded-full bg-slate-200 text-slate-700">
                {activePatients.length}
              </span>
            </h2>
            <span className="text-xs text-slate-400">Ordre d'arrivée</span>
          </div>

          {activePatients.length === 0 ? (
            <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center text-slate-400">
              <Users className="w-12 h-12 mx-auto text-slate-300 mb-3" />
              <p className="text-sm font-semibold">La salle d'attente est actuellement vide.</p>
              <p className="text-xs text-slate-400 mt-1">
                Ajoutez un patient à gauche lorsqu'il arrive au cabinet.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {activePatients.map((item) => {
                const pat = item.patient;
                const hasAllergies = pat?.medicalHistory?.allergies?.length > 0;
                const isUrgent = item.priority === 'Urgente';

                return (
                  <div
                    key={item._id}
                    className={`bg-white rounded-2xl border p-4 sm:p-5 shadow-xs transition-all hover:shadow-md ${
                      isUrgent
                        ? 'border-rose-300 ring-1 ring-rose-200'
                        : 'border-slate-200/90'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        {/* Medical Alert Badge (Matching Video) */}
                        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                          <h3 className="text-base font-black text-slate-900 tracking-tight">
                            {pat?.firstName} {pat?.lastName}
                          </h3>

                          {hasAllergies && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-rose-600 text-white flex items-center gap-1 shadow-2xs">
                              <AlertTriangle className="w-3 h-3" />
                              <span>ALERTE MÉDICALE</span>
                            </span>
                          )}

                          {isUrgent && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-black bg-rose-100 text-rose-800 border border-rose-200">
                              URGENCE
                            </span>
                          )}
                        </div>

                        {/* Patient info details */}
                        <div className="flex items-center gap-3 text-xs text-slate-500 font-medium flex-wrap">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            <span>Arrivé : <strong className="text-slate-800">{formatTime(item.arrivalTime)}</strong></span>
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Phone className="w-3.5 h-3.5 text-teal-600" />
                            <span>{pat?.phone}</span>
                          </span>
                        </div>

                        {/* Motif & Status */}
                        <div className="mt-2 flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
                            Motif : {item.motif}
                          </span>
                          <span
                            className={`px-2.5 py-1 rounded-lg text-xs font-extrabold ${
                              item.status === 'En consultation'
                                ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            }`}
                          >
                            {item.status}
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons (Matching Video 00:46) */}
                      <div className="flex flex-wrap sm:flex-col gap-1.5 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                        {/* Démarrer consultation button */}
                        <button
                          onClick={() => handleStartConsultation(item)}
                          className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-black bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs transition-all"
                        >
                          <Play className="w-3.5 h-3.5 fill-white" />
                          <span>Démarrer</span>
                        </button>

                        {/* Open Dossier */}
                        <button
                          onClick={() => pat && selectPatientAndGo(pat, 'schema')}
                          className="flex items-center justify-center gap-1 px-3 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors"
                        >
                          <FileText className="w-3.5 h-3.5 text-slate-500" />
                          <span>Dossier</span>
                        </button>

                        {/* Retirer */}
                        <button
                          onClick={() => handleRemove(item._id)}
                          className="flex items-center justify-center gap-1 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Retirer</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
