import React, { useState, useEffect } from 'react';
import { useDental } from '../../context/DentalContext';
import { api } from '../../services/api';
import {
  Sparkles,
  Plus,
  Trash2,
  Calendar,
  Layers,
  CheckCircle2,
  Clock,
  Building2,
  FileText
} from 'lucide-react';

export const ProtheseTab = () => {
  const { currentPatient, showToast } = useDental();
  const [protheses, setProtheses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form
  const [prothesisType, setProthesisType] = useState('Couronne Zircone');
  const [laboratoryName, setLaboratoryName] = useState('Laboratoire Dentaire Al-Amal');
  const [teeth, setTeeth] = useState('');
  const [shade, setShade] = useState('A2');
  const [costLab, setCostLab] = useState('');
  const [pricePatient, setPricePatient] = useState('');
  const [tryInDate, setTryInDate] = useState('');
  const [notes, setNotes] = useState('');

  const fetchProtheses = async () => {
    if (!currentPatient?._id) return;
    try {
      setLoading(true);
      const data = await api.getProthesesByPatient(currentPatient._id);
      setProtheses(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProtheses();
  }, [currentPatient?._id]);

  const handleCreateProthese = async (e) => {
    e.preventDefault();
    try {
      const teethArr = teeth
        .split(',')
        .map((t) => parseInt(t.trim()))
        .filter((t) => !isNaN(t));

      await api.createProthese({
        patient: currentPatient._id,
        prothesisType,
        laboratoryName,
        teeth: teethArr,
        shade,
        costLab: Number(costLab) || 0,
        pricePatient: Number(pricePatient) || 0,
        tryInDate: tryInDate ? new Date(tryInDate) : null,
        notes,
        status: 'Envoyé au labo'
      });

      showToast('Commande de prothèse enregistrée !');
      setIsModalOpen(false);
      setTeeth('');
      setCostLab('');
      setPricePatient('');
      setNotes('');
      await fetchProtheses();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await api.updateProthese(id, { status: newStatus });
      showToast('Statut de la prothèse mis à jour');
      await fetchProtheses();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Voulez-vous supprimer cette commande de prothèse ?')) return;
    try {
      await api.deleteProthese(id);
      showToast('Commande supprimée');
      await fetchProtheses();
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
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-800">
                Gestion des Prothèses Dentaires & Laboratoire
              </h2>
              <p className="text-xs text-slate-400">
                Suivi des commandes auprès des laboratoires, essayages, teintes et dates de pose
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-purple-600 hover:bg-purple-700 text-white shadow-xs transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Nouvelle Commande Labo</span>
          </button>
        </div>
      </div>

      {/* Protheses Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Commandes en cours ({protheses.length})
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/50 text-slate-500 font-bold uppercase tracking-wider text-[11px] border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-4">Date envoi</th>
                <th className="py-3.5 px-4">Type de Prothèse</th>
                <th className="py-3.5 px-4">Dent(s) & Teinte</th>
                <th className="py-3.5 px-4">Laboratoire</th>
                <th className="py-3.5 px-4">Statut</th>
                <th className="py-3.5 px-4 text-right">Coût Labo / Patient</th>
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {protheses.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-slate-400">
                    Aucune prothèse commandée pour ce patient.
                  </td>
                </tr>
              ) : (
                protheses.map((pr) => (
                  <tr key={pr._id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 text-slate-600 font-medium whitespace-nowrap">
                      {new Date(pr.sentDate).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-800">{pr.prothesisType}</td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                          {pr.teeth?.join(', ') || 'N/A'}
                        </span>
                        <span className="text-slate-500 font-semibold">Teinte: {pr.shade}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-medium">
                      {pr.laboratoryName}
                    </td>
                    <td className="py-3.5 px-4">
                      <select
                        value={pr.status}
                        onChange={(e) => handleUpdateStatus(pr._id, e.target.value)}
                        className={`text-[10px] font-bold px-2 py-1 rounded-full border outline-none cursor-pointer ${
                          pr.status === 'Posé / Terminé'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                            : pr.status === 'Reçu au cabinet'
                            ? 'bg-blue-50 text-blue-700 border-blue-300'
                            : 'bg-amber-50 text-amber-700 border-amber-300'
                        }`}
                      >
                        <option value="Envoyé au labo">Envoyé au labo</option>
                        <option value="Reçu au cabinet">Reçu au cabinet</option>
                        <option value="Essayage réussi">Essayage réussi</option>
                        <option value="Posé / Terminé">Posé / Terminé</option>
                        <option value="À retoucher">À retoucher</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <span className="text-slate-400 block text-[10px]">
                        Lab: {pr.costLab} DH
                      </span>
                      <strong className="text-slate-900 font-black">
                        {pr.pricePatient} DH
                      </strong>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => handleDelete(pr._id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
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

      {/* Modal: New Prothese Order */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-lg w-full p-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div>
                <h3 className="text-base font-extrabold text-slate-800">
                  Nouvelle Fiche de Prothèse (Labo)
                </h3>
                <p className="text-xs text-slate-400">
                  Patient: {currentPatient.firstName} {currentPatient.lastName}
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProthese} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Type de Prothèse *
                </label>
                <select
                  value={prothesisType}
                  onChange={(e) => setProthesisType(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 outline-none bg-white font-medium"
                >
                  <option value="Couronne Zircone">Couronne Zircone</option>
                  <option value="Couronne Céramo-Métallique">Couronne Céramo-Métallique</option>
                  <option value="Bridge Zircone / Céramique">Bridge Zircone / Céramique</option>
                  <option value="Facette Dentaire E-Max">Facette Dentaire E-Max</option>
                  <option value="Appareil Amovible Résine">Appareil Amovible Résine</option>
                  <option value="Appareil Squeletté (Stellite)">Appareil Squeletté (Stellite)</option>
                  <option value="Gouttière de libération / Blanchiment">Gouttière de libération / Blanchiment</option>
                  <option value="Pilier & Couronne sur Implant">Pilier & Couronne sur Implant</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Dent(s) concernée(s)
                  </label>
                  <input
                    type="text"
                    value={teeth}
                    onChange={(e) => setTeeth(e.target.value)}
                    placeholder="Ex: 11, 21"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Teinte (Guide VITA)
                  </label>
                  <select
                    value={shade}
                    onChange={(e) => setShade(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 outline-none bg-white font-bold"
                  >
                    {['A1', 'A2', 'A3', 'A3.5', 'B1', 'B2', 'C1', 'C2', 'Bleach 1', 'Bleach 2'].map(
                      (s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      )
                    )}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Laboratoire Prothésiste
                </label>
                <input
                  type="text"
                  value={laboratoryName}
                  onChange={(e) => setLaboratoryName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Coût Facturé par Labo (DH)
                  </label>
                  <input
                    type="number"
                    value={costLab}
                    onChange={(e) => setCostLab(e.target.value)}
                    placeholder="800"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tarif Patient (DH)
                  </label>
                  <input
                    type="number"
                    value={pricePatient}
                    onChange={(e) => setPricePatient(e.target.value)}
                    placeholder="2500"
                    className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-slate-200 outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-100 rounded-xl"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white rounded-xl shadow-xs"
                >
                  Enregistrer Commande Labo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
