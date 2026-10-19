import React, { useState, useEffect } from 'react';
import { useDental } from '../../context/DentalContext';
import { api } from '../../services/api';
import {
  Pill,
  Plus,
  Printer,
  Trash2,
  Search,
  FileText,
  Calendar,
  CheckCircle,
  Copy
} from 'lucide-react';

export const PrescriptionTab = () => {
  const { currentPatient, openPrescriptionPrint, showToast } = useDental();
  const [prescriptions, setPrescriptions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Dental drugs catalog for instant search & autofill (Moroccan dental market)
  const dentalDrugs = [
    { name: 'ACIGAM 250 MG', dosage: '250 mg', freq: '2 fois par jour', duration: '3 jours', instr: '1 comprimé matin et soir après les repas' },
    { name: 'AMOXICILLINE 500 MG', dosage: '500 mg', freq: '3 fois par jour', duration: '6 jours', instr: '1 gélule toutes les 8 heures' },
    { name: 'AUGMENTIN 1G (Amox/Acide Clavulanique)', dosage: '1000 mg / 125 mg', freq: '2 fois par jour', duration: '7 jours', instr: '1 sachet au début des repas' },
    { name: 'BI-RODOGYL (Spiramycine / Métronidazole)', dosage: '1.5 M.UI / 250 mg', freq: '2 fois par jour', duration: '6 jours', instr: '1 comprimé matin et soir pour infection parodontale' },
    { name: 'PARACÉTAMOL 1G (Doliprane / Dafalgan)', dosage: '1000 mg', freq: '3 fois par jour en cas de douleur', duration: '4 jours', instr: 'Espacer les prises de 6 heures minimum' },
    { name: 'IBUPROFÈNE 400 MG', dosage: '400 mg', freq: '3 fois par jour', duration: '3 jours', instr: '1 comprimé après manger (anti-inflammatoire)' },
    { name: 'ELUDRIL BAIN DE BOUCHE', dosage: '15 ml', freq: '3 fois par jour', duration: '7 jours', instr: 'Bain de bouche pur ou dilué après chaque brossage' },
    { name: 'CHLORHEXIDINE 0.12%', dosage: '10 ml', freq: '2 fois par jour', duration: '10 jours', instr: 'Rinçage buccal pendant 1 minute' },
    { name: 'PANADOL EXTRA (Paracétamol + Caféine)', dosage: '500 mg / 65 mg', freq: '2 comprimés si douleur', duration: '3 jours', instr: 'Maximum 6 comprimés par jour' }
  ];

  // Form state
  const [searchDrug, setSearchDrug] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [notes, setNotes] = useState('');

  const fetchPrescriptions = async () => {
    if (!currentPatient?._id) return;
    try {
      setLoading(true);
      const data = await api.getPrescriptionsByPatient(currentPatient._id);
      setPrescriptions(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrescriptions();
  }, [currentPatient?._id]);

  const addDrugToPrescription = (drug) => {
    setSelectedItems((prev) => [
      ...prev,
      {
        medicine: drug.name,
        dosage: drug.dosage,
        frequency: drug.freq,
        duration: drug.duration,
        instructions: drug.instr
      }
    ]);
    setSearchDrug('');
  };

  const removeItem = (idx) => {
    setSelectedItems((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSavePrescription = async (e) => {
    e.preventDefault();
    if (selectedItems.length === 0) {
      showToast('Veuillez ajouter au moins un médicament à l’ordonnance', 'error');
      return;
    }

    try {
      const created = await api.createPrescription({
        patient: currentPatient._id,
        items: selectedItems,
        notes,
        date: new Date()
      });

      showToast('Ordonnance enregistrée avec succès');
      setIsModalOpen(false);
      setSelectedItems([]);
      setNotes('');
      await fetchPrescriptions();
      openPrescriptionPrint(created);
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Voulez-vous supprimer cette ordonnance ?')) return;
    try {
      await api.deletePrescription(id);
      showToast('Ordonnance supprimée');
      await fetchPrescriptions();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const filteredDrugs = dentalDrugs.filter((d) =>
    d.name.toLowerCase().includes(searchDrug.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center border border-teal-100">
              <Pill className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-800">
                Ordonnances Médicales Dentaires
              </h2>
              <p className="text-xs text-slate-400">
                Prescription rapide avec posologies dentaires pré-configurées et export PDF
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-teal-600 hover:bg-teal-700 text-white shadow-xs transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Nouvelle Ordonnance</span>
          </button>
        </div>
      </div>

      {/* Ordonnances Table (Matching Video 00:27) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Historique des Ordonnances ({prescriptions.length})
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/50 text-slate-500 font-bold uppercase tracking-wider text-[11px] border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Contenu & Médicaments</th>
                <th className="py-3.5 px-4">Praticien</th>
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {prescriptions.length === 0 ? (
                <tr>
                  <td colSpan="4" className="py-8 text-center text-slate-400">
                    Aucune ordonnance délivrée pour le moment.
                  </td>
                </tr>
              ) : (
                prescriptions.map((ord) => (
                  <tr key={ord._id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 text-slate-600 font-medium whitespace-nowrap">
                      {new Date(ord.date).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="space-y-1">
                        {ord.items?.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <span className="font-bold text-teal-800 text-xs">
                              • {item.medicine}
                            </span>
                            <span className="text-slate-500 text-[11px]">
                              ({item.instructions || `${item.frequency} - ${item.duration}`})
                            </span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-semibold">
                      {ord.doctorName || 'Dr. Dentolio'}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => openPrescriptionPrint(ord)}
                          className="flex items-center gap-1 px-3 py-1 text-xs font-bold rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-700 transition-colors"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>PDF</span>
                        </button>
                        <button
                          onClick={() => handleDelete(ord._id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
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

      {/* Modal: Nouvelle Ordonnance Médicale (Matching Video 00:29-00:32) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-2.5">
                <Pill className="w-5 h-5 text-teal-600" />
                <div>
                  <h3 className="text-base font-extrabold text-slate-800">
                    Nouvelle Ordonnance Médicale
                  </h3>
                  <p className="text-xs text-slate-400">
                    Patient: {currentPatient.firstName} {currentPatient.lastName}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-200/60 hover:bg-slate-200 text-slate-600 flex items-center justify-center text-xs font-bold"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Left / Main: Search drugs & selected list */}
              <div className="md:col-span-8 space-y-4">
                {/* Search Bar matching video */}
                <div>
                  <label className="block text-xs font-bold text-teal-800 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <Search className="w-3.5 h-3.5" />
                    <span>Recherche rapide de médicament</span>
                  </label>
                  <input
                    type="text"
                    value={searchDrug}
                    onChange={(e) => setSearchDrug(e.target.value)}
                    placeholder="Tapez le nom du médicament pour l'insérer... (ex: acigam, amox...)"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-teal-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none bg-teal-50/20"
                  />

                  {/* Filtered suggestions list */}
                  {searchDrug.trim() && (
                    <div className="mt-2 bg-white rounded-xl shadow-lg border border-slate-200 divide-y divide-slate-100 max-h-48 overflow-y-auto">
                      {filteredDrugs.length === 0 ? (
                        <div className="p-3 text-xs text-slate-400">Aucun résultat</div>
                      ) : (
                        filteredDrugs.map((d, i) => (
                          <div
                            key={i}
                            onClick={() => addDrugToPrescription(d)}
                            className="p-2.5 hover:bg-teal-50 cursor-pointer flex items-center justify-between text-xs transition-colors"
                          >
                            <span className="font-bold text-slate-800">{d.name}</span>
                            <span className="text-slate-400 text-[11px]">{d.instr}</span>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>

                {/* Selected Drugs in Prescription */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Lignes de Prescription ({selectedItems.length})
                  </label>

                  {selectedItems.length === 0 ? (
                    <div className="p-6 rounded-2xl border-2 border-dashed border-slate-200 text-center text-xs text-slate-400">
                      Recherchez un médicament ci-dessus ou cliquez sur une suggestion pour l'ajouter.
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {selectedItems.map((item, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-2xl border border-slate-200 bg-slate-50/60 flex items-start justify-between gap-3"
                        >
                          <div className="flex-1 space-y-1">
                            <span className="font-extrabold text-slate-800 text-xs block">
                              {idx + 1}. {item.medicine}
                            </span>
                            <input
                              type="text"
                              value={item.instructions}
                              onChange={(e) => {
                                const updated = [...selectedItems];
                                updated[idx].instructions = e.target.value;
                                setSelectedItems(updated);
                              }}
                              placeholder="Posologie (ex: 1 comprimé 2 fois par jour pendant 3 jours)"
                              className="w-full px-2.5 py-1 text-xs rounded-lg border border-slate-200 bg-white outline-none focus:border-teal-500"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => removeItem(idx)}
                            className="text-slate-400 hover:text-rose-600 p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Conseils complémentaires pour le patient
                  </label>
                  <textarea
                    rows="2"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Ex: Éviter les aliments trop chauds, repos 24h, brossage doux avec brosse chirurgicale..."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 outline-none"
                  />
                </div>
              </div>

              {/* Right Panel matching Video 00:30 */}
              <div className="md:col-span-4 bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-4 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">
                    Patient
                  </span>
                  <strong className="text-slate-800 text-sm">
                    {currentPatient.firstName} {currentPatient.lastName}
                  </strong>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">
                    Praticien
                  </span>
                  <span className="font-bold text-teal-700">Dr. Dentolio</span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">
                    Date de prescription
                  </span>
                  <span className="font-semibold text-slate-700">
                    {new Date().toLocaleDateString('fr-FR')}
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-200 space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="rounded text-teal-600 focus:ring-teal-500"
                    />
                    <span className="text-[11px] text-slate-600 font-medium">
                      Papier en-tête Dr. Dentolio
                    </span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="rounded text-teal-600 focus:ring-teal-500"
                    />
                    <span className="text-[11px] text-slate-600 font-medium">
                      Envoyer ordonnance par WhatsApp/SMS
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-100 rounded-xl"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleSavePrescription}
                className="flex items-center gap-2 px-6 py-2.5 text-xs font-extrabold bg-teal-600 hover:bg-teal-700 text-white rounded-xl shadow-md shadow-teal-600/20"
              >
                <Printer className="w-4 h-4" />
                <span>Enregistrer & Imprimer</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
