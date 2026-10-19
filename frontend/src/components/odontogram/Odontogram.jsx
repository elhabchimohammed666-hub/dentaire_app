import React, { useState, useEffect } from 'react';
import { useDental } from '../../context/DentalContext';
import { Tooth } from './Tooth';
import { api } from '../../services/api';
import {
  Plus,
  Trash2,
  FileText,
  CheckCircle2,
  Clock,
  Calendar,
  Layers,
  Sparkles,
  ChevronRight,
  AlertCircle
} from 'lucide-react';

export const Odontogram = () => {
  const { currentPatient, refreshCurrentPatient, openInvoice, showToast } = useDental();
  const [treatments, setTreatments] = useState([]);
  const [selectedTeeth, setSelectedTeeth] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // New treatment form state
  const [actName, setActName] = useState('');
  const [category, setCategory] = useState('Soins conservateurs');
  const [cost, setCost] = useState('');
  const [status, setStatus] = useState('Terminé');
  const [color, setColor] = useState('#9333ea'); // Default purple as in video
  const [notes, setNotes] = useState('');

  // Common dental acts presets for quick click
  const commonPresets = [
    { name: "Extraction d'une canine incluse", cat: "Chirurgie & Extraction", cost: 600, color: "#9333ea" },
    { name: "Appareil sur plaque base plastique (1 à 3 dents)", cat: "Prothèse amovible", cost: 1000, color: "#0d9488" },
    { name: "Approfondissement vestibulaire (greffe cutanée)", cat: "Parodontologie", cost: 1000, color: "#0d9488" },
    { name: "Détartrage complet sus et sous-gingival", cat: "Soins conservateurs", cost: 400, color: "#10b981" },
    { name: "Obturation composite 3 faces (Soin carie)", cat: "Soins conservateurs", cost: 450, color: "#ef4444" },
    { name: "Couronne Zircone E-Max", cat: "Prothèse fixe", cost: 2500, color: "#3b82f6" },
    { name: "Traitement endodontique canalaire (Dévitalisation)", cat: "Endodontie", cost: 900, color: "#f59e0b" },
    { name: "Pose d'implant titane ostéo-intégré", cat: "Implantologie", cost: 6000, color: "#6366f1" }
  ];

  // Teeth quadrants (FDI international standard)
  const q1 = [18, 17, 16, 15, 14, 13, 12, 11];
  const q2 = [21, 22, 23, 24, 25, 26, 27, 28];
  const q4 = [48, 47, 46, 45, 44, 43, 42, 41];
  const q3 = [31, 32, 33, 34, 35, 36, 37, 38];

  const fetchTreatments = async () => {
    if (!currentPatient?._id) return;
    try {
      setLoading(true);
      const data = await api.getTreatmentsByPatient(currentPatient._id);
      setTreatments(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTreatments();
  }, [currentPatient?._id]);

  const toggleTooth = (num) => {
    setSelectedTeeth((prev) =>
      prev.includes(num) ? prev.filter((t) => t !== num) : [...prev, num].sort((a, b) => a - b)
    );
  };

  const handleSelectAll = () => {
    if (selectedTeeth.length === 32) {
      setSelectedTeeth([]);
    } else {
      setSelectedTeeth([...q1, ...q2, ...q4, ...q3]);
    }
  };

  const handlePresetSelect = (preset) => {
    setActName(preset.name);
    setCategory(preset.cat);
    setCost(preset.cost);
    setColor(preset.color);
  };

  const handleCreateTreatment = async (e) => {
    e.preventDefault();
    if (!actName || !cost) {
      showToast('Veuillez remplir le nom de l’acte et le tarif', 'error');
      return;
    }

    try {
      await api.createTreatment({
        patient: currentPatient._id,
        teeth: selectedTeeth,
        actName,
        category,
        cost: Number(cost),
        status,
        color,
        notes,
        date: new Date()
      });

      showToast('Acte dentaire enregistré avec succès');
      setIsModalOpen(false);
      setSelectedTeeth([]);
      setActName('');
      setCost('');
      setNotes('');
      await fetchTreatments();
      await refreshCurrentPatient();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleDeleteTreatment = async (id) => {
    if (!window.confirm('Voulez-vous vraiment supprimer cet acte dentaire ?')) return;
    try {
      await api.deleteTreatment(id);
      showToast('Acte supprimé');
      await fetchTreatments();
      await refreshCurrentPatient();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Visual Dental Chart Box (Odontogramme) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
              <Layers className="w-5 h-5 text-teal-600" />
              <span>Schéma Dentaire Interactif (Odontogramme FDI)</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Cliquez sur une ou plusieurs dents pour enregistrer un diagnostic, une obturation ou une prothèse
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSelectAll}
              className="px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
            >
              {selectedTeeth.length === 32 ? 'Désélectionner tout' : 'Sélectionner tout'}
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold rounded-xl bg-teal-600 hover:bg-teal-700 text-white shadow-xs transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>
                {selectedTeeth.length > 0
                  ? `Ajouter Acte (Dent ${selectedTeeth.join(', ')})`
                  : 'Ajouter Acte'}
              </span>
            </button>
          </div>
        </div>

        {/* Selected teeth pill indicator */}
        {selectedTeeth.length > 0 && (
          <div className="mb-4 p-2.5 rounded-xl bg-teal-50 border border-teal-200/70 flex items-center justify-between text-xs">
            <span className="font-semibold text-teal-900">
              Dents sélectionnées: <strong className="text-teal-700">{selectedTeeth.join(', ')}</strong>
            </span>
            <button
              onClick={() => setSelectedTeeth([])}
              className="text-teal-600 hover:text-teal-800 font-medium underline"
            >
              Annuler sélection
            </button>
          </div>
        )}

        {/* The 2D Arch Container (Upper Jaw & Lower Jaw) */}
        <div className="bg-slate-50/70 rounded-2xl p-4 sm:p-6 border border-slate-200/60 flex flex-col items-center">
          {/* Upper Jaw (Maxillaire) */}
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">
            Mâchoire Supérieure (Maxillaire)
          </div>

          <div className="flex items-center justify-center gap-1 sm:gap-2 mb-6 overflow-x-auto w-full pb-2">
            {/* Quadrant 1 (Right: 18 - 11) */}
            <div className="flex items-center gap-1 sm:gap-2 pr-3 border-r-2 border-dashed border-teal-300">
              {q1.map((num) => (
                <Tooth
                  key={num}
                  number={num}
                  isUpper={true}
                  isSelected={selectedTeeth.includes(num)}
                  treatments={treatments}
                  onClick={toggleTooth}
                />
              ))}
            </div>

            {/* Quadrant 2 (Left: 21 - 28) */}
            <div className="flex items-center gap-1 sm:gap-2 pl-3">
              {q2.map((num) => (
                <Tooth
                  key={num}
                  number={num}
                  isUpper={true}
                  isSelected={selectedTeeth.includes(num)}
                  treatments={treatments}
                  onClick={toggleTooth}
                />
              ))}
            </div>
          </div>

          {/* Central Median Line */}
          <div className="w-full flex items-center justify-center my-1">
            <div className="h-px bg-slate-200 w-3/4 flex items-center justify-center">
              <span className="bg-slate-100 text-[10px] text-slate-400 px-3 py-0.5 rounded-full font-medium">
                Arcade Dentaire
              </span>
            </div>
          </div>

          {/* Lower Jaw (Mandibulaire) */}
          <div className="flex items-center justify-center gap-1 sm:gap-2 mt-6 overflow-x-auto w-full pb-2">
            {/* Quadrant 4 (Right: 48 - 41) */}
            <div className="flex items-center gap-1 sm:gap-2 pr-3 border-r-2 border-dashed border-teal-300">
              {q4.map((num) => (
                <Tooth
                  key={num}
                  number={num}
                  isUpper={false}
                  isSelected={selectedTeeth.includes(num)}
                  treatments={treatments}
                  onClick={toggleTooth}
                />
              ))}
            </div>

            {/* Quadrant 3 (Left: 31 - 38) */}
            <div className="flex items-center gap-1 sm:gap-2 pl-3">
              {q3.map((num) => (
                <Tooth
                  key={num}
                  number={num}
                  isUpper={false}
                  isSelected={selectedTeeth.includes(num)}
                  treatments={treatments}
                  onClick={toggleTooth}
                />
              ))}
            </div>
          </div>

          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-3">
            Mâchoire Inférieure (Mandibule)
          </div>

          {/* Legend */}
          <div className="mt-6 pt-4 border-t border-slate-200/80 w-full flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-medium">
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-full bg-purple-600"></span>
              <span>Prothèse / Extraction (Démo)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-full bg-teal-600"></span>
              <span>Parodontie / Soin réalisé</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-full bg-rose-500"></span>
              <span>Carie / Urgence</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-full bg-blue-500"></span>
              <span>Couronne Zircone</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-full bg-emerald-500"></span>
              <span>Détartrage & Hygiène</span>
            </div>
          </div>
        </div>
      </div>

      {/* Traitements Enregistrés Table (Matching Demo Video Exactly) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="p-5 flex flex-wrap items-center justify-between gap-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
              <span>Traitements Enregistrés</span>
              <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-teal-50 text-teal-700">
                {treatments.length}
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Historique complet des actes dentaires et facturation liée
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => openInvoice(null, null, currentPatient)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200"
            >
              <FileText className="w-3.5 h-3.5 text-slate-500" />
              <span>Facture</span>
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-teal-600 hover:bg-teal-700 text-white shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Nouveau Traitement</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[11px] border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Dent(s)</th>
                <th className="py-3.5 px-4">Actes</th>
                <th className="py-3.5 px-4">Catégorie</th>
                <th className="py-3.5 px-4">Statut</th>
                <th className="py-3.5 px-4 text-right">Prix / Coût</th>
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {treatments.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-slate-400">
                    Aucun traitement enregistré pour ce patient. Cliquez sur "Nouveau Traitement".
                  </td>
                </tr>
              ) : (
                treatments.map((t) => (
                  <tr key={t._id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 text-slate-600 font-medium whitespace-nowrap">
                      {new Date(t.date).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="py-3.5 px-4">
                      {t.teeth && t.teeth.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {t.teeth.map((tooth) => (
                            <span
                              key={tooth}
                              className="px-2 py-0.5 text-[11px] font-extrabold rounded-md text-white shadow-2xs"
                              style={{ backgroundColor: t.color || '#9333ea' }}
                            >
                              {tooth}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Arcade complète</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-800">{t.actName}</div>
                      {t.notes && <div className="text-[11px] text-slate-400">{t.notes}</div>}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 font-medium">{t.category}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          t.status === 'Terminé'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : t.status === 'En cours'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-blue-50 text-blue-700 border border-blue-200'
                        }`}
                      >
                        {t.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-black text-slate-800 text-sm whitespace-nowrap">
                      {t.cost.toFixed(2)} DH
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => openInvoice(null, t, currentPatient)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-teal-600 hover:bg-teal-50"
                          title="Facturer cet acte"
                        >
                          <FileText className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteTreatment(t._id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Ajouter un Nouveau Traitement */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 max-w-xl w-full p-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div>
                <h3 className="text-base font-extrabold text-slate-800">
                  Enregistrer un Acte Dentaire
                </h3>
                <p className="text-xs text-slate-400">
                  Patient: {currentPatient.firstName} {currentPatient.lastName}
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-slate-200"
              >
                ✕
              </button>
            </div>

            {/* Quick Presets */}
            <div className="mb-4">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Actes Fréquents (Cliquez pour remplir)
              </label>
              <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto p-1 bg-slate-50 rounded-xl border border-slate-100">
                {commonPresets.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handlePresetSelect(p)}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-teal-500 hover:text-teal-700 font-medium transition-colors text-left"
                  >
                    {p.name} ({p.cost} DH)
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleCreateTreatment} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nom de l'acte / Désignation *
                </label>
                <input
                  type="text"
                  required
                  value={actName}
                  onChange={(e) => setActName(e.target.value)}
                  placeholder="Ex: Extraction d'une canine incluse"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Dent(s) concernée(s) (FDI)
                  </label>
                  <input
                    type="text"
                    value={selectedTeeth.join(', ')}
                    onChange={(e) =>
                      setSelectedTeeth(
                        e.target.value
                          .split(',')
                          .map((v) => parseInt(v.trim()))
                          .filter((v) => !isNaN(v))
                      )
                    }
                    placeholder="Ex: 38, 35 (ou laissez vide)"
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tarif / Coût (DH) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="50"
                    value={cost}
                    onChange={(e) => setCost(e.target.value)}
                    placeholder="600"
                    className="w-full px-3.5 py-2 text-sm font-bold text-slate-800 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Catégorie
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:border-teal-500 outline-none bg-white"
                  >
                    <option value="Soins conservateurs">Soins conservateurs</option>
                    <option value="Chirurgie & Extraction">Chirurgie & Extraction</option>
                    <option value="Prothèse amovible">Prothèse amovible</option>
                    <option value="Prothèse fixe">Prothèse fixe</option>
                    <option value="Endodontie">Endodontie</option>
                    <option value="Parodontologie">Parodontologie</option>
                    <option value="Orthodontie">Orthodontie</option>
                    <option value="Implantologie">Implantologie</option>
                    <option value="Esthétique & Blanchiment">Esthétique & Blanchiment</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Statut de l'acte
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:border-teal-500 outline-none bg-white font-semibold"
                  >
                    <option value="Terminé">Terminé</option>
                    <option value="En cours">En cours</option>
                    <option value="Planifié">Planifié</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Couleur d'affichage sur l'odontogramme
                </label>
                <div className="flex items-center gap-3">
                  {['#9333ea', '#0d9488', '#10b981', '#ef4444', '#3b82f6', '#f59e0b'].map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      className={`w-7 h-7 rounded-full transition-transform ${
                        color === c ? 'ring-2 ring-offset-2 ring-slate-800 scale-110' : 'opacity-80'
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-8 h-8 rounded-lg cursor-pointer border-0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Notes / Observations cliniques
                </label>
                <textarea
                  rows="2"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Détails techniques, anesthésie, matériaux utilisés..."
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:border-teal-500 outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white rounded-xl shadow-xs"
                >
                  Enregistrer l'acte
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
