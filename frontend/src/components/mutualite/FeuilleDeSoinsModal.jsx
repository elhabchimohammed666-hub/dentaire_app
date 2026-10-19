import React, { useState, useEffect } from 'react';
import { useDental } from '../../context/DentalContext';
import { api } from '../../services/api';
import {
  Shield,
  Printer,
  FileCheck,
  CheckSquare,
  Square,
  Building,
  User,
  Calendar,
  X,
  Download
} from 'lucide-react';

export const FeuilleDeSoinsModal = () => {
  const { isFeuilleDeSoinsOpen, setIsFeuilleDeSoinsOpen, currentPatient, settings } = useDental();
  const [treatments, setTreatments] = useState([]);
  const [selectedTreatmentIds, setSelectedTreatmentIds] = useState([]);
  const [mutuelleType, setMutuelleType] = useState('RMA Watanya');
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (isFeuilleDeSoinsOpen && currentPatient?._id) {
      setShowPreview(false);
      api.getTreatmentsByPatient(currentPatient._id).then((data) => {
        const finished = data.filter((t) => t.status === 'Terminé');
        setTreatments(finished);
        // By default select all finished treatments
        setSelectedTreatmentIds(finished.map((t) => t._id));
      });
      if (currentPatient.mutuelle?.provider) {
        setMutuelleType(currentPatient.mutuelle.provider);
      }
    }
  }, [isFeuilleDeSoinsOpen, currentPatient?._id]);

  if (!isFeuilleDeSoinsOpen || !currentPatient) return null;

  const toggleSelectTreatment = (id) => {
    setSelectedTreatmentIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedTreatmentIds.length === treatments.length) {
      setSelectedTreatmentIds([]);
    } else {
      setSelectedTreatmentIds(treatments.map((t) => t._id));
    }
  };

  const selectedTreatments = treatments.filter((t) => selectedTreatmentIds.includes(t._id));
  const totalHonoraires = selectedTreatments.reduce((sum, t) => sum + (t.cost || 0), 0);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-600/20">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-800">
                Générer une Feuille de Soins (Mutuelle)
              </h3>
              <p className="text-xs text-slate-400">
                Prise en charge officielle RMA, CNSS, CNOPS, Saham, AXA Maroc
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsFeuilleDeSoinsOpen(false)}
            className="w-8 h-8 rounded-full bg-slate-200/60 hover:bg-slate-200 text-slate-600 flex items-center justify-center text-xs font-bold"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {!showPreview ? (
            /* STEP 1: SELECT TREATMENTS & MUTUELLE TYPE (Matching Video 00:10) */
            <div className="space-y-6">
              {/* Mutuelle selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Organisme d'Assurance / Mutuelle
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {[
                    'RMA Watanya',
                    'CNSS (AMO)',
                    'CNOPS',
                    'Saham Assurance (Sanlam)',
                    'AXA Assurance Maroc',
                    'Wafa Assurance'
                  ].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setMutuelleType(m)}
                      className={`p-3 rounded-2xl border text-left transition-all ${
                        mutuelleType === m
                          ? 'border-blue-600 bg-blue-50/80 text-blue-900 ring-2 ring-blue-500/20 shadow-xs'
                          : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span className="block font-bold text-xs">{m}</span>
                      <span className="text-[10px] text-slate-400">Formulaire standardisé</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Treatments to include */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Sélectionner les traitements Terminés à inclure
                  </label>
                  <button
                    onClick={handleSelectAll}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-800"
                  >
                    {selectedTreatmentIds.length === treatments.length
                      ? 'Désélectionner tout'
                      : 'Sélectionner tout'}
                  </button>
                </div>

                <div className="space-y-2 border border-slate-200 rounded-2xl p-2 bg-slate-50/50 max-h-60 overflow-y-auto">
                  {treatments.length === 0 ? (
                    <div className="p-4 text-center text-xs text-slate-400">
                      Aucun acte terminé disponible pour ce patient.
                    </div>
                  ) : (
                    treatments.map((t) => {
                      const isChecked = selectedTreatmentIds.includes(t._id);
                      return (
                        <div
                          key={t._id}
                          onClick={() => toggleSelectTreatment(t._id)}
                          className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
                            isChecked
                              ? 'bg-white border-blue-300 shadow-2xs'
                              : 'bg-white/40 border-slate-200 opacity-60'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            {isChecked ? (
                              <CheckSquare className="w-5 h-5 text-blue-600 shrink-0" />
                            ) : (
                              <Square className="w-5 h-5 text-slate-400 shrink-0" />
                            )}
                            <div>
                              <div className="text-xs font-bold text-slate-800">
                                {t.actName}
                              </div>
                              <div className="text-[11px] text-slate-400 flex items-center gap-2">
                                <span>Date: {new Date(t.date).toLocaleDateString('fr-FR')}</span>
                                {t.teeth?.length > 0 && (
                                  <>
                                    <span>•</span>
                                    <span>Dent(s): {t.teeth.join(', ')}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-black text-slate-800">
                              {t.cost.toFixed(2)} DH
                            </span>
                            <span className="block text-[10px] text-emerald-600 font-bold uppercase">
                              Terminé
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Patient Mutuelle Identifiers Confirmation */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block font-medium">Assuré(e)</span>
                  <strong className="text-slate-800">
                    {currentPatient.firstName} {currentPatient.lastName}
                  </strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-medium">CIN</span>
                  <strong className="text-slate-800">{currentPatient.cin || 'BE890123'}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-medium">
                    N° Immatriculation / Affiliation
                  </span>
                  <strong className="text-slate-800">
                    {currentPatient.mutuelle?.affiliationNumber || 'SH-8899201'}
                  </strong>
                </div>
              </div>
            </div>
          ) : (
            /* STEP 2: OFFICIAL MOROCCAN CARE SHEET VISUAL PREVIEW (Matching Video 00:12-00:15) */
            <div className="border border-slate-300 rounded-2xl p-6 bg-white print-container shadow-xs">
              {/* Document Header */}
              <div className="flex items-start justify-between pb-4 border-b-2 border-slate-800">
                <div>
                  <span className="text-xs font-black text-blue-900 uppercase tracking-widest block">
                    {mutuelleType.toUpperCase()}
                  </span>
                  <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight">
                    Déclaration Dentaire / Feuille de Soins
                  </h2>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Dossier Médical de Remboursement d'Honoraires
                  </p>
                </div>

                <div className="text-right text-[11px]">
                  <strong className="block text-slate-800 font-bold">{settings?.clinicName || 'Cabinet Dentaire Dr. Dentolio'}</strong>
                  <span className="text-slate-500 block">INPE: {settings?.inpe || '109876543'}</span>
                  <span className="text-slate-500 block">ICE: {settings?.ice || '001524389000045'}</span>
                </div>
              </div>

              {/* Identification de l'Assuré */}
              <div className="mt-4 border border-slate-300 rounded-xl overflow-hidden text-xs">
                <div className="bg-slate-100 px-3 py-1 font-bold text-slate-700 uppercase text-[10px] border-b border-slate-300">
                  1. Renseignements concernant l'assuré et le bénéficiaire
                </div>
                <div className="p-3 grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Nom & Prénom</span>
                    <strong className="text-slate-800">
                      {currentPatient.firstName} {currentPatient.lastName}
                    </strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">N° CIN</span>
                    <strong className="text-slate-800">{currentPatient.cin || 'BE890123'}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">N° Immatriculation</span>
                    <strong className="text-slate-800">
                      {currentPatient.mutuelle?.affiliationNumber || 'SH-8899201'}
                    </strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Organisme</span>
                    <strong className="text-blue-700">{mutuelleType}</strong>
                  </div>
                </div>
              </div>

              {/* Table of Acts / Soins */}
              <div className="mt-4 border border-slate-300 rounded-xl overflow-hidden text-xs">
                <div className="bg-slate-100 px-3 py-1 font-bold text-slate-700 uppercase text-[10px] border-b border-slate-300">
                  2. Partie réservée au praticien - Actes & Honoraires
                </div>
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px]">
                    <tr>
                      <th className="p-2.5">Date</th>
                      <th className="p-2.5">N° Dent</th>
                      <th className="p-2.5">Description de l'acte dentaire</th>
                      <th className="p-2.5">Cotation</th>
                      <th className="p-2.5 text-right">Honoraires (DH)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {selectedTreatments.map((t, idx) => (
                      <tr key={idx}>
                        <td className="p-2.5 font-medium">
                          {new Date(t.date).toLocaleDateString('fr-FR')}
                        </td>
                        <td className="p-2.5 font-bold text-teal-800">
                          {t.teeth?.length > 0 ? t.teeth.join(', ') : 'Arcade'}
                        </td>
                        <td className="p-2.5 font-semibold text-slate-800">{t.actName}</td>
                        <td className="p-2.5 text-slate-500 font-mono text-[11px]">D{t.cost / 20}</td>
                        <td className="p-2.5 text-right font-black text-slate-900">
                          {t.cost.toFixed(2)} DH
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-slate-100 font-black text-slate-800 border-t-2 border-slate-300">
                      <td colSpan="4" className="p-2.5 text-right uppercase text-xs">
                        Total des honoraires perçus:
                      </td>
                      <td className="p-2.5 text-right text-sm text-blue-900 font-black">
                        {totalHonoraires.toFixed(2)} DH
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Dental Arch Mini Diagram */}
              <div className="mt-4 p-3 border border-slate-300 rounded-xl text-center">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                  Schéma Dentaire de Contrôle
                </div>
                <div className="flex justify-center items-center gap-1 text-[11px] font-mono text-slate-600 flex-wrap">
                  <span className="font-bold">Maxillaire:</span> 18 17 16 15 14 13 12 11 | 21 22 23 24 25 26 27 28
                </div>
                <div className="flex justify-center items-center gap-1 text-[11px] font-mono text-slate-600 flex-wrap mt-0.5">
                  <span className="font-bold">Mandibule:</span> 48 47 46 45 44 43 42 41 | 31 32 33 34 35 36 37 38
                </div>
              </div>

              {/* Signatures & Stamp */}
              <div className="mt-6 pt-4 grid grid-cols-2 gap-8 text-xs border-t border-slate-200">
                <div className="border border-dashed border-slate-300 p-4 rounded-xl min-h-[90px] flex flex-col justify-between">
                  <span className="font-bold text-slate-600">Signature de l'assuré(e) :</span>
                  <span className="text-[10px] text-slate-400">Certifie l'exactitude des soins</span>
                </div>
                <div className="border border-dashed border-slate-300 p-4 rounded-xl min-h-[90px] flex flex-col justify-between text-right">
                  <span className="font-bold text-slate-800">
                    Cachet et signature du Médecin Dentiste :
                  </span>
                  <div className="text-[11px] text-slate-500 font-medium">
                    Fait à Casablanca, le {new Date().toLocaleDateString('fr-FR')}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setIsFeuilleDeSoinsOpen(false)}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200/60 rounded-xl"
          >
            Fermer
          </button>

          <div className="flex items-center gap-2">
            {!showPreview ? (
              <button
                type="button"
                disabled={selectedTreatmentIds.length === 0}
                onClick={() => setShowPreview(true)}
                className="flex items-center gap-1.5 px-6 py-2.5 text-xs font-extrabold bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl shadow-md shadow-blue-600/20"
              >
                <span>Générer le PDF</span>
                <FileCheck className="w-4 h-4" />
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setShowPreview(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Modifier sélection
                </button>
                <button
                  type="button"
                  onClick={handlePrint}
                  className="flex items-center gap-1.5 px-6 py-2 text-xs font-extrabold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md shadow-emerald-600/20"
                >
                  <Printer className="w-4 h-4" />
                  <span>Imprimer Feuille de Soins</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
