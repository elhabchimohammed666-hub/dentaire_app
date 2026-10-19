import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useDental } from '../../context/DentalContext';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Plus,
  Trash2,
  Calendar,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Building,
  PieChart
} from 'lucide-react';

export const FinancialDashboard = () => {
  const { showToast } = useDental();
  const [summary, setSummary] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [recentPayments, setRecentPayments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // New expense form
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Fournitures & Consommables');
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Espèce');
  const [supplier, setSupplier] = useState('');
  const [notes, setNotes] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      const [sumData, expData, payData] = await Promise.all([
        api.getFinanceSummary(),
        api.getExpenses(),
        api.getRecentPayments()
      ]);
      setSummary(sumData);
      setExpenses(expData);
      setRecentPayments(payData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateExpense = async (e) => {
    e.preventDefault();
    try {
      await api.createExpense({
        title,
        category,
        amount: Number(amount),
        paymentMethod,
        supplier,
        notes,
        date: new Date()
      });
      showToast('Dépense enregistrée dans le livre comptable');
      setIsModalOpen(false);
      setTitle('');
      setAmount('');
      setSupplier('');
      setNotes('');
      await fetchData();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleDeleteExpense = async (id) => {
    if (!window.confirm('Voulez-vous supprimer cette écriture de dépense ?')) return;
    try {
      await api.deleteExpense(id);
      showToast('Dépense supprimée');
      await fetchData();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const totalRecettes = summary?.totalRecettes || 0;
  const totalDepenses = summary?.totalDepenses || 0;
  const beneficeNet = summary?.beneficeNet || 0;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Top Banner (Matching Video 00:48) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center border border-teal-100">
              <Wallet className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-black text-slate-800">
                Livre de Recettes et Dépenses
              </h1>
              <p className="text-xs text-slate-400">
                Comptabilité analytique du cabinet, suivi de la trésorerie et résultat net
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-teal-600 hover:bg-teal-700 text-white shadow-xs transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Ajouter une Dépense</span>
          </button>
        </div>
      </div>

      {/* 3 Main Financial Summary Cards (Matching Video 00:48 Exactly) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Recettes */}
        <div className="bg-white rounded-2xl border border-emerald-200/80 p-5 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
              Total Recettes Encaissées
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-600">
            {totalRecettes.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} DH
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            {summary?.paymentsCount || 0} règlements enregistrés
          </span>
        </div>

        {/* Total Dépenses */}
        <div className="bg-white rounded-2xl border border-rose-200/80 p-5 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-rose-800 uppercase tracking-wider">
              Total Dépenses & Charges
            </span>
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <TrendingDown className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-rose-600">
            {totalDepenses.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} DH
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            {summary?.expensesCount || 0} dépenses comptabilisées
          </span>
        </div>

        {/* Bénéfice Net */}
        <div className="bg-white rounded-2xl border border-teal-200/80 p-5 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-teal-800 uppercase tracking-wider">
              Bénéfice Net (Solde de Caisse)
            </span>
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div
            className={`text-2xl font-black ${
              beneficeNet >= 0 ? 'text-teal-700' : 'text-rose-600'
            }`}
          >
            {beneficeNet.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} DH
          </div>
          <span className="text-[11px] text-teal-600 font-semibold mt-1 block">
            Rentabilité saine • Trésorerie positive
          </span>
        </div>
      </div>

      {/* Recettes & Dépenses Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recettes récentes */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
          <div className="p-4 bg-emerald-50/50 border-b border-emerald-100 flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
              <ArrowDownRight className="w-4 h-4 text-emerald-600" />
              <span>Derniers Encaissements (Recettes)</span>
            </span>
            <span className="text-xs font-bold text-emerald-700">
              +{totalRecettes.toFixed(2)} DH
            </span>
          </div>

          <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto">
            {recentPayments.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400">Aucun encaissement</div>
            ) : (
              recentPayments.map((p) => (
                <div key={p._id} className="p-3.5 hover:bg-slate-50 flex items-center justify-between text-xs">
                  <div>
                    <strong className="text-slate-800 block">
                      {p.patient?.firstName} {p.patient?.lastName}
                    </strong>
                    <div className="text-[11px] text-slate-400 flex items-center gap-2">
                      <span>{new Date(p.paymentDate).toLocaleDateString('fr-FR')}</span>
                      <span>•</span>
                      <span>{p.method}</span>
                      <span>•</span>
                      <span className="font-mono">{p.invoiceNumber}</span>
                    </div>
                  </div>
                  <span className="font-black text-emerald-600 text-sm">
                    +{p.amount.toFixed(2)} DH
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Dépenses récentes */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
          <div className="p-4 bg-rose-50/50 border-b border-rose-100 flex items-center justify-between">
            <span className="text-xs font-bold text-rose-900 uppercase tracking-wider flex items-center gap-1.5">
              <ArrowUpRight className="w-4 h-4 text-rose-600" />
              <span>Dernières Dépenses (Charges)</span>
            </span>
            <span className="text-xs font-bold text-rose-700">
              -{totalDepenses.toFixed(2)} DH
            </span>
          </div>

          <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto">
            {expenses.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400">Aucune dépense enregistrée</div>
            ) : (
              expenses.map((e) => (
                <div key={e._id} className="p-3.5 hover:bg-slate-50 flex items-center justify-between text-xs">
                  <div>
                    <strong className="text-slate-800 block">{e.title}</strong>
                    <div className="text-[11px] text-slate-400 flex items-center gap-2">
                      <span>{new Date(e.date).toLocaleDateString('fr-FR')}</span>
                      <span>•</span>
                      <span className="font-semibold text-slate-500">{e.category}</span>
                      {e.supplier && <span>• Fournisseur: {e.supplier}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-black text-rose-600 text-sm">
                      -{e.amount.toFixed(2)} DH
                    </span>
                    <button
                      onClick={() => handleDeleteExpense(e._id)}
                      className="p-1 text-slate-300 hover:text-rose-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Modal: Add Expense */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <h3 className="text-base font-extrabold text-slate-800">
                Enregistrer une Dépense
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateExpense} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Libellé *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Achat composites et digues dentaires"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 outline-none focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Catégorie
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 outline-none bg-white"
                  >
                    <option value="Fournitures & Consommables">Fournitures & Consommables</option>
                    <option value="Laboratoire de prothèse">Laboratoire de prothèse</option>
                    <option value="Loyer & Charges">Loyer & Charges</option>
                    <option value="Salaires & Honoraires">Salaires & Honoraires</option>
                    <option value="Maintenance & Équipements">Maintenance & Équipements</option>
                    <option value="Divers">Divers</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Montant (DH) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="1500"
                    className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-slate-200 outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Fournisseur / Bénéficiaire
                </label>
                <input
                  type="text"
                  value={supplier}
                  onChange={(e) => setSupplier(e.target.value)}
                  placeholder="Ex: DentaMed Maroc"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 outline-none"
                />
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
                  className="px-5 py-2 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-xs"
                >
                  Enregistrer Dépense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
