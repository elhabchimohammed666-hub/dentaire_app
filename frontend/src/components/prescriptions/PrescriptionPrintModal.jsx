import React from 'react';
import { useDental } from '../../context/DentalContext';
import { Printer, X } from 'lucide-react';

export const PrescriptionPrintModal = () => {
  const { isPrescriptionPrintOpen, setIsPrescriptionPrintOpen, selectedPrescription, currentPatient, settings } =
    useDental();

  if (!isPrescriptionPrintOpen || !selectedPrescription) return null;

  const patient = selectedPrescription.patient || currentPatient;
  const dateFormatted = selectedPrescription.date
    ? new Date(selectedPrescription.date).toLocaleDateString('fr-FR')
    : new Date().toLocaleDateString('fr-FR');

  const calculateAge = (dob) => {
    if (!dob) return null;
    const diff = Date.now() - new Date(dob).getTime();
    const ageDate = new Date(diff);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };
  const age = calculateAge(patient?.dateOfBirth);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Top Controls */}
        <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between no-print">
          <span className="text-xs font-bold text-slate-700">Aperçu Impression Ordonnance</span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white rounded-xl shadow-xs transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimer</span>
            </button>
            <button
              onClick={() => setIsPrescriptionPrintOpen(false)}
              className="w-7 h-7 rounded-full bg-slate-200/70 hover:bg-slate-200 text-slate-600 flex items-center justify-center text-xs font-bold"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Printable Prescription Body (Matching Video 00:33-00:34) */}
        <div className="p-8 sm:p-10 bg-white print-container min-h-[580px] flex flex-col justify-between">
          <div>
            {/* Doctor Header */}
            <div className="border-b-2 border-slate-800 pb-5 text-center">
              <h1 className="text-xl font-black text-slate-900 tracking-wider uppercase">
                {settings?.doctorName || 'DR. DENTOLIO'}
              </h1>
              <p className="text-xs font-bold text-teal-800 mt-0.5">
                Chirurgien-Dentiste
              </p>
              <p className="text-[11px] text-slate-500 font-medium max-w-md mx-auto mt-1">
                Soins dentaires • Prothèses • Chirurgie • Implantologie • Orthodontie • Esthétique & Blanchiment
              </p>
              <div className="text-[10px] text-slate-400 mt-1">
                {settings?.address || 'Boulevard Zerktouni, Résidence Les Fleurs, Casablanca'} • Tél: {settings?.phone || '+212 5 22 45 67 89'}
              </div>
            </div>

            {/* Patient Bar */}
            <div className="flex items-center justify-between my-6 py-2 px-3 bg-slate-50 rounded-xl text-xs border border-slate-100">
              <div>
                <span className="text-slate-400 font-medium">Patient(e) : </span>
                <strong className="text-slate-900 font-extrabold uppercase">
                  {patient?.firstName} {patient?.lastName}
                </strong>
                {age && <span className="text-slate-500 ml-1">({age} ans)</span>}
              </div>
              <div className="text-slate-600 font-medium">
                Casablanca, le <strong className="text-slate-900">{dateFormatted}</strong>
              </div>
            </div>

            {/* Document Title */}
            <div className="text-center my-6">
              <span className="inline-block px-4 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-extrabold uppercase tracking-widest border border-slate-200">
                Ordonnance Médicale
              </span>
            </div>

            {/* Prescription Items (Medications & Dosages) */}
            <div className="space-y-6 my-6 pl-4">
              {selectedPrescription.items?.map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="text-sm font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-teal-600"></span>
                    <span>{item.medicine}</span>
                  </div>
                  <div className="pl-4 text-xs font-medium text-slate-700 italic">
                    {item.instructions || `${item.frequency} pendant ${item.duration}`}
                  </div>
                </div>
              ))}

              {selectedPrescription.notes && (
                <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-500 italic pl-4">
                  Note : {selectedPrescription.notes}
                </div>
              )}
            </div>
          </div>

          {/* Footer / Cachet et Signature */}
          <div className="pt-6 border-t border-slate-200 flex justify-end">
            <div className="border border-dashed border-slate-300 rounded-2xl p-4 w-56 text-right space-y-8">
              <span className="text-xs font-bold text-slate-700 block">
                Cachet et Signature
              </span>
              <div className="text-[10px] text-slate-400 font-mono">
                Dr. Dentolio • Certifié
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
