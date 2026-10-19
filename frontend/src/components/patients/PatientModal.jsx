import React, { useState, useEffect } from 'react';
import { useDental } from '../../context/DentalContext';
import { api } from '../../services/api';
import { User, Phone, Shield, AlertTriangle, Heart, X } from 'lucide-react';

export const PatientModal = () => {
  const {
    isPatientModalOpen,
    setIsPatientModalOpen,
    editingPatient,
    fetchPatients,
    setCurrentPatient,
    showToast
  } = useDental();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [cin, setCin] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('Femme');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [profession, setProfession] = useState('');
  const [civilStatus, setCivilStatus] = useState('Célibataire');
  const [mutuelleProvider, setMutuelleProvider] = useState('Saham Assurance');
  const [affiliationNumber, setAffiliationNumber] = useState('');
  const [allergies, setAllergies] = useState('');
  const [chronicDiseases, setChronicDiseases] = useState('');
  const [medicalNotes, setMedicalNotes] = useState('');
  const [tags, setTags] = useState('Orthodontie');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingPatient) {
      setFirstName(editingPatient.firstName || '');
      setLastName(editingPatient.lastName || '');
      setCin(editingPatient.cin || '');
      setDateOfBirth(
        editingPatient.dateOfBirth
          ? new Date(editingPatient.dateOfBirth).toISOString().split('T')[0]
          : ''
      );
      setGender(editingPatient.gender || 'Femme');
      setPhone(editingPatient.phone || '');
      setEmail(editingPatient.email || '');
      setProfession(editingPatient.profession || '');
      setCivilStatus(editingPatient.civilStatus || 'Célibataire');
      setMutuelleProvider(editingPatient.mutuelle?.provider || 'Saham Assurance');
      setAffiliationNumber(editingPatient.mutuelle?.affiliationNumber || '');
      setAllergies(editingPatient.medicalHistory?.allergies?.join(', ') || '');
      setChronicDiseases(editingPatient.medicalHistory?.chronicDiseases?.join(', ') || '');
      setMedicalNotes(editingPatient.medicalHistory?.notes || '');
      setTags(editingPatient.tags?.join(', ') || '');
    } else {
      setFirstName('');
      setLastName('');
      setCin('');
      setDateOfBirth('2000-01-01');
      setGender('Femme');
      setPhone('+212 6 ');
      setEmail('');
      setProfession('');
      setCivilStatus('Célibataire');
      setMutuelleProvider('Saham Assurance');
      setAffiliationNumber('');
      setAllergies('');
      setChronicDiseases('');
      setMedicalNotes('');
      setTags('');
    }
  }, [editingPatient, isPatientModalOpen]);

  if (!isPatientModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const payload = {
        firstName,
        lastName,
        cin,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        gender,
        phone,
        email,
        profession,
        civilStatus,
        mutuelle: {
          provider: mutuelleProvider,
          affiliationNumber
        },
        medicalHistory: {
          allergies: allergies
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean),
          chronicDiseases: chronicDiseases
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean),
          notes: medicalNotes
        },
        tags: tags
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
      };

      let result;
      if (editingPatient?._id) {
        result = await api.updatePatient(editingPatient._id, payload);
        showToast('Fiche patient modifiée avec succès');
      } else {
        result = await api.createPatient(payload);
        showToast('Nouveau patient créé avec succès');
      }

      await fetchPatients();
      if (result) {
        setCurrentPatient(result);
      }
      setIsPatientModalOpen(false);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <User className="w-5 h-5 text-teal-600" />
            <div>
              <h3 className="text-base font-extrabold text-slate-800">
                {editingPatient ? 'Modifier la Fiche Patient' : 'Créer un Nouveau Patient'}
              </h3>
              <p className="text-xs text-slate-400">Dossier médical et données d'assurance</p>
            </div>
          </div>
          <button
            onClick={() => setIsPatientModalOpen(false)}
            className="w-8 h-8 rounded-full bg-slate-200/60 hover:bg-slate-200 text-slate-600 flex items-center justify-center text-xs font-bold"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Prénom *</label>
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Najlae"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-teal-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Nom *</label>
              <input
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Amrani"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-teal-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">CIN</label>
              <input
                type="text"
                value={cin}
                onChange={(e) => setCin(e.target.value)}
                placeholder="BE890123"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 outline-none uppercase font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Date de Naissance
              </label>
              <input
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Genre</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 outline-none bg-white"
              >
                <option value="Femme">Femme</option>
                <option value="Homme">Homme</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Téléphone *</label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+212 6 61 23 45 67"
                className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-slate-200 focus:border-teal-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="patient@email.com"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Profession</label>
              <input
                type="text"
                value={profession}
                onChange={(e) => setProfession(e.target.value)}
                placeholder="Ex: Ingénieure"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Situation</label>
              <select
                value={civilStatus}
                onChange={(e) => setCivilStatus(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 outline-none bg-white"
              >
                <option value="Célibataire">Célibataire</option>
                <option value="Marié(e)">Marié(e)</option>
                <option value="Divorcé(e)">Divorcé(e)</option>
                <option value="Veuf(ve)">Veuf(ve)</option>
              </select>
            </div>
          </div>

          {/* Mutuelle */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-teal-600" />
              <span>Assurance / Mutuelle</span>
            </span>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-slate-500 font-medium mb-1">Organisme</label>
                <select
                  value={mutuelleProvider}
                  onChange={(e) => setMutuelleProvider(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 outline-none bg-white font-semibold"
                >
                  <option value="Saham Assurance">Saham Assurance (Sanlam)</option>
                  <option value="RMA Watanya">RMA Watanya</option>
                  <option value="CNSS">CNSS (AMO)</option>
                  <option value="CNOPS">CNOPS</option>
                  <option value="AXA Assurance">AXA Assurance</option>
                  <option value="Wafa Assurance">Wafa Assurance</option>
                  <option value="Aucune">Sans Mutuelle</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] text-slate-500 font-medium mb-1">N° Affiliation</label>
                <input
                  type="text"
                  value={affiliationNumber}
                  onChange={(e) => setAffiliationNumber(e.target.value)}
                  placeholder="Ex: SH-8899201"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Alertes Médicales (Allergies & Pathologies) */}
          <div className="p-3.5 rounded-2xl bg-rose-50/60 border border-rose-200 space-y-2">
            <span className="text-xs font-bold text-rose-800 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span>Alertes Médicales & Antécédents</span>
            </span>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-rose-700 font-medium mb-1">
                  Allergies (séparées par des virgules)
                </label>
                <input
                  type="text"
                  value={allergies}
                  onChange={(e) => setAllergies(e.target.value)}
                  placeholder="Pénicilline, Latex..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-rose-200 bg-white outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] text-rose-700 font-medium mb-1">
                  Pathologies chroniques
                </label>
                <input
                  type="text"
                  value={chronicDiseases}
                  onChange={(e) => setChronicDiseases(e.target.value)}
                  placeholder="Diabète, Hypertension..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-rose-200 bg-white outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] text-rose-700 font-medium mb-1">
                Note de vigilance clinique
              </label>
              <textarea
                rows="2"
                value={medicalNotes}
                onChange={(e) => setMedicalNotes(e.target.value)}
                placeholder="Ex: Patiente allergique aux dérivés de pénicilline..."
                className="w-full px-3 py-2 text-xs rounded-xl border border-rose-200 bg-white outline-none"
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Tags (séparés par virgules)
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="VIP, Orthodontie, Sensible..."
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsPatientModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-100 rounded-xl"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 text-xs font-extrabold bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white rounded-xl shadow-md shadow-teal-600/20"
            >
              {loading ? 'Enregistrement...' : 'Enregistrer le Dossier'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
