import React, { useState, useEffect } from 'react';
import { useDental } from '../../context/DentalContext';
import { api } from '../../services/api';
import {
  CreditCard,
  DollarSign,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  FileCheck,
  Printer,
  X
} from 'lucide-react';

export const PaymentModal = () => {
  const {
    isPaymentModalOpen,
    setIsPaymentModalOpen,
    currentPatient,
    refreshCurrentPatient,
    openInvoice,
    showToast
  } = useDental();

  const [treatments, setTreatments] = useState([]);
  const [selectedTreatmentId, setSelectedTreatmentId] = useState('');
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('Espèce');
  const [note, setNote] = useState('');
  const [checkNumber, setCheckNumber] = useState('');

  // UI state for partial confirmation & success screen
  const [showPartialConfirm, setShowPartialConfirm] = useState(false);
  const [isSuccessScreen, setIsSuccessScreen] = useState(false);
  const [lastPayment, setLastPayment] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isPaymentModalOpen && currentPatient?._id) {
      // Reset state
      setShowPartialConfirm(false);
      setIsSuccessScreen(false);
      setLastPayment(null);
      setAmount('');
      setNote('');
      setCheckNumber('');

      api.getTreatmentsByPatient(currentPatient._id).then((data) => {
        setTreatments(data);
      });
    }
  }, [isPaymentModalOpen, currentPatient?._id]);

  if (!isPaymentModalOpen || !currentPatient) return null;

  const totalActs = currentPatient.financials?.totalActs || 0;
  const paidAmount = currentPatient.financials?.paidAmount || 0;
  const remainingAmount = currentPatient.financials?.remainingAmount || 0;

  const numAmount = parseFloat(amount) || 0;
  const remainingAfter = Math.max(0, remainingAmount - numAmount);
  const isPartial = numAmount > 0 && numAmount < remainingAmount;

  const handlePreSubmit = (e) => {
    e.preventDefault();
    if (!amount || numAmount <= 0) {
      showToast('Veuillez entrer un montant valide', 'error');
      return;
    }

    if (isPartial) {
      setShowPartialConfirm(true);
    } else {
      executePayment();
    }
  };

  const executePayment = async () => {
    try {
      setLoading(true);
      const res = await api.createPayment({
        patient: currentPatient._id,
        treatment: selectedTreatmentId || null,
        amount: numAmount,
        method,
        note,
        checkNumber
      });

      setLastPayment(res.payment);
      setShowPartialConfirm(false);
      setIsSuccessScreen(true);
      await refreshCurrentPatient();
      showToast('Paiement enregistré avec succès !');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setIsPaymentModalOpen(false);
    setShowPartialConfirm(false);
    setIsSuccessScreen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-md shadow-teal-600/20">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-800">Ajouter un Paiement</h3>
              <p className="text-xs text-slate-400">Enregistrer une transaction financière</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-slate-200/60 hover:bg-slate-200 text-slate-600 flex items-center justify-center text-xs font-bold"
          >
            ✕
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {/* 1. SUCCESS SCREEN (Matching Video 00:08) */}
          {isSuccessScreen ? (
            <div className="py-6 text-center space-y-4">
              <div className="w-20 h-20 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center animate-bounce duration-700">
                <CheckCircle className="w-12 h-12 stroke-[2.5]" />
              </div>
              <div>
                <h4 className="text-xl font-black text-slate-800">Paiement Enregistré !</h4>
                <p className="text-xs text-slate-400 mt-1">
                  La transaction a été validée et le solde patient a été actualisé
                </p>
              </div>

              {lastPayment && (
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 max-w-xs mx-auto text-left text-xs space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Facture N°:</span>
                    <strong className="text-slate-800">{lastPayment.invoiceNumber}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Montant payé:</span>
                    <strong className="text-emerald-600 font-extrabold text-sm">
                      {lastPayment.amount?.toFixed(2)} DH
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Méthode:</span>
                    <span className="font-semibold text-slate-700">{lastPayment.method}</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-slate-200">
                    <span className="text-slate-500">Reste à payer:</span>
                    <strong className="text-rose-600 font-bold">
                      {lastPayment.remainingBalanceAfter?.toFixed(2)} DH
                    </strong>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-center gap-3 pt-4">
                <button
                  onClick={() => {
                    handleClose();
                    openInvoice(lastPayment, null, currentPatient);
                  }}
                  className="flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl bg-teal-50 text-teal-700 hover:bg-teal-100 border border-teal-200"
                >
                  <Printer className="w-4 h-4" />
                  <span>Imprimer Reçu</span>
                </button>
                <button
                  onClick={handleClose}
                  className="px-6 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20"
                >
                  Terminer
                </button>
              </div>
            </div>
          ) : showPartialConfirm ? (
            /* 2. PARTIAL PAYMENT CONFIRMATION MODAL (Matching Video 00:07) */
            <div className="space-y-4 py-2">
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900">
                <div className="flex items-center gap-2 font-bold text-sm mb-1 text-amber-800">
                  <AlertCircle className="w-5 h-5 text-amber-600" />
                  <span>Paiement partiel</span>
                </div>
                <p className="text-xs text-amber-700">
                  Le montant saisi est inférieur au solde total dû par le patient.
                </p>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Montant à régler maintenant:</span>
                  <strong className="text-emerald-700 font-bold text-sm">
                    {numAmount.toFixed(2)} DH
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Solde actuel:</span>
                  <span className="text-slate-700 font-semibold">{remainingAmount.toFixed(2)} DH</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-200 text-rose-600 font-bold">
                  <span>Restera après ce paiement:</span>
                  <span className="text-sm">{remainingAfter.toFixed(2)} DH</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowPartialConfirm(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Modifier montant
                </button>
                <button
                  type="button"
                  disabled={loading}
                  onClick={executePayment}
                  className="px-5 py-2.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md shadow-emerald-600/20"
                >
                  {loading ? 'Enregistrement...' : 'Confirmer le paiement partiel'}
                </button>
              </div>
            </div>
          ) : (
            /* 3. MAIN PAYMENT FORM (Matching Video 00:04-00:06) */
            <form onSubmit={handlePreSubmit} className="space-y-4">
              {/* Top 3 Summary Cards */}
              <div className="grid grid-cols-3 gap-2.5">
                <div className="p-3 rounded-2xl bg-teal-50/70 border border-teal-100 text-center">
                  <span className="text-[10px] font-bold text-teal-800 uppercase block">Total Actes</span>
                  <span className="text-sm sm:text-base font-extrabold text-teal-700">
                    {totalActs} DH
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-100 text-center">
                  <span className="text-[10px] font-bold text-emerald-800 uppercase block">Déjà Payé</span>
                  <span className="text-sm sm:text-base font-extrabold text-emerald-600">
                    {paidAmount} DH
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-center shadow-2xs">
                  <span className="text-[10px] font-bold text-rose-800 uppercase block">Reste à Payer</span>
                  <span className="text-sm sm:text-base font-black text-rose-600">
                    {remainingAmount} DH
                  </span>
                </div>
              </div>

              {/* Treatment selector (optional) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Sélectionner un traitement (Optionnel)
                </label>
                <select
                  value={selectedTreatmentId}
                  onChange={(e) => {
                    const id = e.target.value;
                    setSelectedTreatmentId(id);
                    const found = treatments.find((t) => t._id === id);
                    if (found && !amount) {
                      setAmount(found.cost.toString());
                    }
                  }}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:border-teal-500 outline-none bg-white font-medium"
                >
                  <option value="">-- Aucun traitement spécifique (Règlement global) --</option>
                  {treatments.map((t) => (
                    <option key={t._id} value={t._id}>
                      {t.actName} {t.teeth?.length ? `(Dent ${t.teeth.join(', ')})` : ''} - {t.cost} DH [{t.status}]
                    </option>
                  ))}
                </select>
              </div>

              {/* Montant Input (DH) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex justify-between">
                  <span>Montant du paiement (DH) *</span>
                  {remainingAmount > 0 && (
                    <button
                      type="button"
                      onClick={() => setAmount(remainingAmount.toString())}
                      className="text-teal-600 hover:text-teal-800 text-[11px] font-bold lowercase underline"
                    >
                      Payer tout le solde ({remainingAmount} DH)
                    </button>
                  )}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    required
                    min="1"
                    max={remainingAmount > 0 ? remainingAmount * 1.5 : 100000}
                    step="50"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder={remainingAmount.toString()}
                    className="w-full pl-4 pr-12 py-3 text-lg font-black text-slate-800 rounded-2xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-sm">
                    DH
                  </span>
                </div>
              </div>

              {/* Méthode de Paiement */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Méthode de Paiement
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {['Espèce', 'Carte Bancaire', 'Chèque', 'Virement'].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setMethod(m)}
                      className={`py-2 px-2 text-xs font-bold rounded-xl border text-center transition-all ${
                        method === m
                          ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {method === 'Chèque' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Numéro de chèque & Banque
                  </label>
                  <input
                    type="text"
                    value={checkNumber}
                    onChange={(e) => setCheckNumber(e.target.value)}
                    placeholder="Ex: CHQ-998821 (Attijariwafa Bank)"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 outline-none"
                  />
                </div>
              )}

              {/* Note / Observation */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Note / Observation (Optionnel)
                </label>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Ex: Acompte sur traitement d'orthodontie"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 outline-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2.5 text-xs font-semibold text-slate-500 hover:bg-slate-100 rounded-xl"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-6 py-2.5 text-xs font-extrabold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md shadow-emerald-600/20 transition-all"
                >
                  <span>Valider le paiement</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
