import React from 'react';
import { useDental } from '../../context/DentalContext';
import { Printer, X, Download, ShieldCheck } from 'lucide-react';

export const InvoicePrintModal = () => {
  const { isInvoiceModalOpen, setIsInvoiceModalOpen, invoiceData, settings } = useDental();

  if (!isInvoiceModalOpen || !invoiceData) return null;

  const { payment, treatment, patient, invoiceNumber, date } = invoiceData;

  const amount = payment?.amount || treatment?.cost || 600;
  const total = treatment?.cost || amount;
  const paid = payment?.amount || total;
  const remaining = Math.max(0, total - paid);

  // Helper: number to French words for Dirhams
  const numberToWordsFr = (num) => {
    const units = ['', 'Un', 'Deux', 'Trois', 'Quatre', 'Cinq', 'Six', 'Sept', 'Huit', 'Neuf', 'Dix', 'Onze', 'Douze', 'Treize', 'Quatorze', 'Quinze', 'Seize'];
    if (num === 0) return 'Zéro';
    if (num === 200) return 'Deux cents';
    if (num === 400) return 'Quatre cents';
    if (num === 500) return 'Cinq cents';
    if (num === 600) return 'Six cents';
    if (num === 1000) return 'Mille';
    if (num === 1200) return 'Mille deux cents';
    if (num === 1500) return 'Mille cinq cents';
    if (num === 2000) return 'Deux mille';
    if (num === 2200) return 'Deux mille deux cents';
    if (num === 2500) return 'Deux mille cinq cents';
    if (num === 3000) return 'Trois mille';
    if (num === 5000) return 'Cinq mille';
    return `${num}`;
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-2xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Top Controls */}
        <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700">Facture Médicale Officielle</span>
            <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-teal-100 text-teal-800 font-bold">
              {invoiceNumber}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white rounded-xl shadow-xs transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimer</span>
            </button>
            <button
              onClick={() => setIsInvoiceModalOpen(false)}
              className="w-7 h-7 rounded-full bg-slate-200/70 hover:bg-slate-200 text-slate-600 flex items-center justify-center text-xs font-bold"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Printable Invoice Container (Matching Video 00:16) */}
        <div className="p-8 bg-white print-container">
          {/* Header */}
          <div className="flex items-start justify-between border-b-2 border-slate-900 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center font-black text-sm">
                  🦷
                </div>
                <h1 className="text-xl font-black text-slate-900 tracking-tight uppercase">
                  {settings?.doctorName || 'DR. DENTOLIO'}
                </h1>
              </div>
              <p className="text-xs text-slate-500 font-semibold mt-1">
                {settings?.specialty || 'Chirurgien-Dentiste - Soins, Prothèses & Esthétique'}
              </p>
              <p className="text-xs text-slate-400">
                {settings?.address || 'HAY NAJAH, RUE 12, CASABLANCA'}
              </p>
              <p className="text-xs text-slate-400">
                Tél: {settings?.phone || '+212 5 22 45 67 89'} • ICE: {settings?.ice || '001524389000045'}
              </p>
            </div>

            <div className="text-right">
              <h2 className="text-xl font-black text-slate-900 tracking-wider">FACTURE</h2>
              <div className="font-mono text-xs font-bold text-teal-800 mt-1">
                N° {invoiceNumber}
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                Date: {date || new Date().toLocaleDateString('fr-FR')}
              </div>
            </div>
          </div>

          {/* Facturé à */}
          <div className="my-6 p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Facturé à :
              </span>
              <h3 className="text-base font-extrabold text-slate-800 uppercase">
                {patient?.firstName} {patient?.lastName}
              </h3>
              <p className="text-xs text-slate-500">
                CIN: {patient?.cin || 'BE890123'} • Tél: {patient?.phone || '+212 6 61 23 45 67'}
              </p>
              <p className="text-xs text-slate-400">{patient?.address || 'Casablanca, Maroc'}</p>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Mutuelle
              </span>
              <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200 inline-block">
                {patient?.mutuelle?.provider || 'Saham Assurance'}
              </span>
            </div>
          </div>

          {/* Table of Items */}
          <div className="border border-slate-200 rounded-xl overflow-hidden mb-6">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[11px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Dent</th>
                  <th className="py-3 px-4">Désignation de l'acte</th>
                  <th className="py-3 px-4 text-right">Prix Unitaire</th>
                  <th className="py-3 px-4 text-right">Montant (DH)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-3.5 px-4 font-mono font-bold text-teal-700">
                    {treatment?.teeth?.length > 0 ? treatment.teeth.join(', ') : '38'}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-800">
                    {treatment?.actName || payment?.treatment?.actName || "Extraction d'une canine incluse"}
                  </td>
                  <td className="py-3.5 px-4 text-right font-medium text-slate-600">
                    {total.toFixed(2)}
                  </td>
                  <td className="py-3.5 px-4 text-right font-bold text-slate-800">
                    {total.toFixed(2)} DH
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Financial Totals */}
          <div className="flex justify-end mb-6">
            <div className="w-64 space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Total Honoraires :</span>
                <span className="font-bold text-slate-800">{total.toFixed(2)} DH</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 text-emerald-700">
                <span className="font-semibold">Déjà payé :</span>
                <span className="font-black">{paid.toFixed(2)} DH</span>
              </div>
              <div className="flex justify-between py-1 text-slate-900 font-black text-sm">
                <span>Reste à payer :</span>
                <span className={remaining > 0 ? 'text-rose-600' : 'text-slate-800'}>
                  {remaining.toFixed(2)} DH
                </span>
              </div>
            </div>
          </div>

          {/* Legal Formula in Words */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 italic mb-8">
            Arrêté la présente facture à la somme de :{' '}
            <strong className="font-bold text-slate-900 not-italic">
              {numberToWordsFr(paid)} Dirhams.
            </strong>
          </div>

          {/* Signatures */}
          <div className="grid grid-cols-2 gap-8 text-xs pt-4 border-t border-slate-200">
            <div className="border border-dashed border-slate-300 p-4 rounded-xl min-h-[90px] flex flex-col justify-between">
              <span className="font-bold text-slate-600">Signature du patient :</span>
              <span className="text-[10px] text-slate-400">Pour accord et acquit</span>
            </div>
            <div className="border border-dashed border-slate-300 p-4 rounded-xl min-h-[90px] flex flex-col justify-between text-right">
              <span className="font-bold text-slate-800">
                Signature et cachet du médecin :
              </span>
              <div className="text-[10px] text-slate-400">
                Dr. Dentolio • Certifié conforme
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
