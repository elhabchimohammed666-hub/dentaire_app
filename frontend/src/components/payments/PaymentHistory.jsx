import React, { useState, useEffect } from 'react';
import { useDental } from '../../context/DentalContext';
import { api } from '../../services/api';
import {
  CreditCard,
  Plus,
  FileText,
  Calendar,
  DollarSign,
  ArrowDownRight,
  Printer,
  Trash2,
  CheckCircle2
} from 'lucide-react';

export const PaymentHistory = () => {
  const { currentPatient, refreshCurrentPatient, setIsPaymentModalOpen, openInvoice, showToast } =
    useDental();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPayments = async () => {
    if (!currentPatient?._id) return;
    try {
      setLoading(true);
      const data = await api.getPaymentsByPatient(currentPatient._id);
      setPayments(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [currentPatient?._id]);

  const handleDelete = async (id) => {
    if (!window.confirm('Voulez-vous supprimer ce reçu de paiement ?')) return;
    try {
      await api.deletePayment(id);
      showToast('Paiement supprimé');
      await fetchPayments();
      await refreshCurrentPatient();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const totalPaid = payments.reduce((sum, p) => sum + (p.amount || 0), 0);

  return (
    <div className="space-y-6">
      {/* Top Banner & Summary */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-800">
                Historique des Paiements & Règlements
              </h2>
              <p className="text-xs text-slate-400">
                Gestion complète des transactions financières et reçus d'honoraires
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right pr-4 border-r border-slate-100">
              <span className="text-[11px] text-slate-400 block font-medium">Cumul Encaissé</span>
              <span className="text-lg font-black text-emerald-600">{totalPaid.toFixed(2)} DH</span>
            </div>
            <button
              onClick={() => setIsPaymentModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Nouveau Règlement</span>
            </button>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Transactions ({payments.length})
          </span>
          <span className="text-xs text-slate-400">
            Monnaie: {currentPatient?.currency || 'Dirham Marocain (DH)'}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/50 text-slate-500 font-bold uppercase tracking-wider text-[11px] border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-4">Date de règlement</th>
                <th className="py-3.5 px-4">N° Facture / Reçu</th>
                <th className="py-3.5 px-4">Méthode</th>
                <th className="py-3.5 px-4">Acte / Affectation</th>
                <th className="py-3.5 px-4 text-right">Montant Réglé</th>
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {payments.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-slate-400">
                    Aucun paiement enregistré pour l'instant.
                  </td>
                </tr>
              ) : (
                payments.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 text-slate-600 font-medium whitespace-nowrap">
                      {new Date(p.paymentDate).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                        {p.invoiceNumber || 'FA-2026-XXXX'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-teal-50 text-teal-800 border border-teal-200">
                        {p.method}
                      </span>
                      {p.checkNumber && (
                        <div className="text-[10px] text-slate-400 mt-0.5 font-mono">
                          N° {p.checkNumber}
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-700">
                        {p.treatment?.actName || 'Paiement global'}
                      </div>
                      {p.note && <div className="text-[11px] text-slate-400 italic">{p.note}</div>}
                    </td>
                    <td className="py-3.5 px-4 text-right font-black text-emerald-600 text-sm whitespace-nowrap">
                      + {p.amount.toFixed(2)} DH
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => openInvoice(p, p.treatment, currentPatient)}
                          className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-teal-50 text-slate-600 hover:text-teal-700 transition-colors"
                          title="Imprimer Reçu / Facture"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>Reçu</span>
                        </button>
                        <button
                          onClick={() => handleDelete(p._id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                          title="Supprimer"
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
    </div>
  );
};
