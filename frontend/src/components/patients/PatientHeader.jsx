import React from 'react';
import { useDental } from '../../context/DentalContext';
import {
  User,
  Calendar,
  Phone,
  Shield,
  Briefcase,
  Heart,
  AlertTriangle,
  PlusCircle,
  FileText,
  DollarSign,
  Tag,
  CreditCard,
  Users2,
  Edit,
  Printer
} from 'lucide-react';

export const PatientHeader = () => {
  const {
    currentPatient,
    setIsPatientModalOpen,
    setEditingPatient,
    setIsNewRdvModalOpen,
    setIsPaymentModalOpen,
    setIsFeuilleDeSoinsOpen,
    openInvoice
  } = useDental();

  if (!currentPatient) {
    return (
      <div className="bg-white rounded-2xl p-8 text-center text-slate-400 border border-slate-200">
        Veuillez sélectionner ou créer un patient pour commencer.
      </div>
    );
  }

  const {
    firstName,
    lastName,
    cin,
    dateOfBirth,
    gender,
    phone,
    profession,
    civilStatus,
    mutuelle,
    medicalHistory,
    tags,
    financials
  } = currentPatient;

  // Format age
  const calculateAge = (dob) => {
    if (!dob) return null;
    const diff = Date.now() - new Date(dob).getTime();
    const ageDate = new Date(diff);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };
  const age = calculateAge(dateOfBirth);

  const formattedDob = dateOfBirth
    ? new Date(dateOfBirth).toLocaleDateString('fr-FR')
    : 'Non renseignée';

  const hasAllergies = medicalHistory?.allergies && medicalHistory.allergies.length > 0;
  const hasDiseases = medicalHistory?.chronicDiseases && medicalHistory.chronicDiseases.length > 0;
  const hasAlerts = hasAllergies || hasDiseases || medicalHistory?.notes;

  const handleEdit = () => {
    setEditingPatient(currentPatient);
    setIsPatientModalOpen(true);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden mb-6">
      {/* Top Main Section */}
      <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Patient Identity & Info Badges */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center text-white text-xl font-black shadow-md shadow-teal-500/15">
                  {firstName[0]}
                  {lastName[0]}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl font-black text-slate-800 tracking-tight">
                      {firstName} {lastName}
                    </h1>
                    <span className="px-2 py-0.5 text-[11px] font-semibold bg-emerald-50 text-emerald-700 rounded-md border border-emerald-200">
                      Actif
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-medium">
                    ID: {currentPatient.customId || 'P-0001'} • Dossier Médical Informatisé
                  </p>
                </div>
              </div>

              <button
                onClick={handleEdit}
                className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-slate-600 hover:text-teal-700 hover:bg-teal-50 rounded-xl border border-slate-200 transition-colors"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>Modifier</span>
              </button>
            </div>

            {/* Badges Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-100">
                <Calendar className="w-4 h-4 text-slate-400" />
                <div>
                  <span className="text-[10px] text-slate-400 block font-medium">Date de naissance</span>
                  <span className="font-semibold text-slate-700">
                    {formattedDob} {age !== null ? `(${age} ans)` : ''}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-100">
                <User className="w-4 h-4 text-slate-400" />
                <div>
                  <span className="text-[10px] text-slate-400 block font-medium">CIN & Sexe</span>
                  <span className="font-semibold text-slate-700">
                    {cin || 'Non spécifié'} • {gender}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-100">
                <Phone className="w-4 h-4 text-teal-600" />
                <div>
                  <span className="text-[10px] text-slate-400 block font-medium">Téléphone</span>
                  <span className="font-semibold text-slate-700">{phone}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2 rounded-xl bg-emerald-50/60 border border-emerald-100">
                <Shield className="w-4 h-4 text-emerald-600" />
                <div>
                  <span className="text-[10px] text-emerald-600 block font-medium">Mutuelle / Assurance</span>
                  <span className="font-bold text-emerald-800">
                    {mutuelle?.provider || 'Saham Assurance'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Center: Medical Alerts (Matching Video Red Alert Box) */}
        <div className="lg:col-span-4 bg-rose-50/70 border border-rose-200/80 rounded-2xl p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-rose-700 font-bold text-xs uppercase tracking-wide">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>Alertes & Antécédents</span>
              </div>
              <span className="px-1.5 py-0.5 text-[10px] font-extrabold bg-rose-600 text-white rounded">
                VIGILANCE
              </span>
            </div>

            <div className="space-y-2 mt-2">
              {hasAllergies ? (
                <div className="flex items-start gap-1.5">
                  <span className="text-[11px] font-bold text-rose-800 shrink-0">Allergies:</span>
                  <div className="flex flex-wrap gap-1">
                    {medicalHistory.allergies.map((a, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 text-xs font-semibold border border-rose-200"
                      >
                        {a}
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-xs text-slate-500 italic">Aucune allergie connue</div>
              )}

              {hasDiseases && (
                <div className="flex items-start gap-1.5">
                  <span className="text-[11px] font-bold text-amber-800 shrink-0">Pathologies:</span>
                  <div className="flex flex-wrap gap-1">
                    {medicalHistory.chronicDiseases.map((d, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-xs font-semibold border border-amber-200"
                      >
                        {d}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {medicalHistory?.notes && (
                <p className="text-[11px] text-slate-600 bg-white/70 p-2 rounded-lg border border-rose-100 line-clamp-2">
                  {medicalHistory.notes}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1.5 mt-3 pt-2 border-t border-rose-100 text-[11px] text-slate-500">
            <Heart className="w-3.5 h-3.5 text-rose-500" />
            <span>Situation: <strong className="text-slate-700">{civilStatus}</strong></span>
            {profession && (
              <>
                <span>•</span>
                <span>Prof: <strong className="text-slate-700">{profession}</strong></span>
              </>
            )}
          </div>
        </div>

        {/* Right: Résumé Financier (Matching Exact Video Layout & Colors) */}
        <div className="lg:col-span-3 flex flex-col justify-between">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>Résumé Financier</span>
            <DollarSign className="w-4 h-4 text-slate-400" />
          </div>

          <div className="space-y-2">
            {/* Total Actes */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-teal-50/60 border border-teal-100">
              <span className="text-xs font-semibold text-teal-800">Total Actes</span>
              <span className="text-base font-extrabold text-teal-700">
                {financials?.totalActs || 0} DH
              </span>
            </div>

            {/* Déjà Payé */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50/60 border border-emerald-100">
              <span className="text-xs font-semibold text-emerald-800">Déjà payé</span>
              <span className="text-base font-extrabold text-emerald-600">
                {financials?.paidAmount || 0} DH
              </span>
            </div>

            {/* Reste à Payer (Red Alert Tag in Video) */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-rose-50 border border-rose-200 shadow-xs">
              <span className="text-xs font-bold text-rose-800">Reste à payer</span>
              <span className="text-lg font-black text-rose-600">
                {financials?.remainingAmount || 0} DH
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Bar (Matching Video Action Bar) */}
      <div className="bg-slate-50/80 px-6 py-3 border-t border-slate-200/70 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* Nouveau RDV Button */}
          <button
            onClick={() => setIsNewRdvModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-xs transition-all"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Nouveau RDV</span>
          </button>

          {/* Nouveau Paiement */}
          <button
            onClick={() => setIsPaymentModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-all"
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Ajouter Paiement</span>
          </button>

          {/* Facture */}
          <button
            onClick={() => openInvoice(null, null, currentPatient)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition-all"
          >
            <FileText className="w-3.5 h-3.5 text-slate-500" />
            <span>Facture</span>
          </button>

          {/* Générer Feuille de Soins (Mutuelle) */}
          <button
            onClick={() => setIsFeuilleDeSoinsOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 transition-all"
          >
            <Shield className="w-3.5 h-3.5 text-blue-600" />
            <span>Feuille de Soins Mutuelle</span>
          </button>

          {/* Fiche Patient Printable */}
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition-all"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Fiche Patient</span>
          </button>
        </div>

        {/* Tags */}
        <div className="flex items-center gap-1.5">
          <Tag className="w-3.5 h-3.5 text-slate-400" />
          {tags && tags.length > 0 ? (
            tags.map((t, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-md bg-white text-slate-600 text-xs font-medium border border-slate-200"
              >
                #{t}
              </span>
            ))
          ) : (
            <span className="text-xs text-slate-400">Aucun tag</span>
          )}
        </div>
      </div>
    </div>
  );
};
