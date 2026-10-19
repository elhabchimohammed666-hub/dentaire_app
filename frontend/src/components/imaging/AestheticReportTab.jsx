import React, { useState } from 'react';
import { useDental } from '../../context/DentalContext';
import { Sparkles, Printer, Download, Share2, Heart, Award } from 'lucide-react';

export const AestheticReportTab = () => {
  const { currentPatient, settings } = useDental();

  const [clinicName, setClinicName] = useState('Cabinet Dentaire Dr. Dentolio');
  const [welcomeMsg, setWelcomeMsg] = useState('Votre sourire est notre plus belle réussite !');
  const [reviewLink, setReviewLink] = useState('https://g.page/r/dentolio-maroc');

  const beforePhoto = 'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&q=80&w=600';
  const afterPhoto = 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=600';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-800">
                Rapport Esthétique & Sourire
              </h2>
              <p className="text-xs text-slate-400">
                Génération de dossier de présentation esthétique Avant / Après personnalisable
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-teal-600 hover:bg-teal-700 text-white shadow-xs"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimer Rapport</span>
            </button>
          </div>
        </div>
      </div>

      {/* Aesthetic Card Layout (Matching Video 00:24-00:26) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Customization Settings */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 space-y-4 text-xs h-fit">
          <h3 className="font-bold text-slate-800 uppercase tracking-wider">
            Personnalisation du Rapport
          </h3>

          <div>
            <label className="block text-slate-600 font-semibold mb-1">Nom du Cabinet</label>
            <input
              type="text"
              value={clinicName}
              onChange={(e) => setClinicName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-teal-500"
            />
          </div>

          <div>
            <label className="block text-slate-600 font-semibold mb-1">Message au Patient</label>
            <textarea
              rows="3"
              value={welcomeMsg}
              onChange={(e) => setWelcomeMsg(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-teal-500"
            />
          </div>

          <div>
            <label className="block text-slate-600 font-semibold mb-1">Lien Avis Google</label>
            <input
              type="text"
              value={reviewLink}
              onChange={(e) => setReviewLink(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-teal-500"
            />
          </div>
        </div>

        {/* Right: Beautiful Presentation Sheet (Matching Video Preview) */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 p-8 shadow-md print-container">
          {/* Clinic Branding Header */}
          <div className="text-center pb-6 border-b border-slate-100">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-tr from-amber-400 to-teal-500 flex items-center justify-center text-white text-xl shadow-md mb-2">
              ✨
            </div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">{clinicName}</h2>
            <p className="text-xs text-teal-700 font-bold uppercase tracking-widest mt-0.5">
              Transformation & Esthétique Dentaire
            </p>
          </div>

          {/* Patient Card */}
          <div className="my-6 p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Patient</span>
              <strong className="text-slate-800 text-sm">
                {currentPatient?.firstName} {currentPatient?.lastName}
              </strong>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Date</span>
              <span className="text-xs text-slate-600 font-semibold">
                {new Date().toLocaleDateString('fr-FR')}
              </span>
            </div>
          </div>

          {/* Side by side Photos */}
          <div className="grid grid-cols-2 gap-4 my-6">
            <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-100">
              <div className="relative aspect-4/3">
                <img
                  src={beforePhoto}
                  alt="Avant"
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-rose-600 text-white shadow-sm">
                  AVANT
                </span>
              </div>
              <div className="p-2 text-center text-[11px] font-bold text-slate-600">
                État Initial
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-100">
              <div className="relative aspect-4/3">
                <img
                  src={afterPhoto}
                  alt="Après"
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-2 right-2 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-600 text-white shadow-sm">
                  APRÈS
                </span>
              </div>
              <div className="p-2 text-center text-[11px] font-bold text-emerald-700">
                Résultat Final
              </div>
            </div>
          </div>

          {/* Friendly Doctor Message */}
          <div className="my-6 p-4 rounded-2xl bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-100 text-center">
            <Heart className="w-5 h-5 mx-auto text-teal-600 mb-1" />
            <p className="text-xs font-bold text-teal-900">{welcomeMsg}</p>
            <p className="text-[11px] text-teal-700 mt-1">
              Merci de votre confiance. Pour préserver votre sourire, n'oubliez pas votre contrôle annuel.
            </p>
          </div>

          {/* Footer signature */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
            <span>{settings?.address || 'Casablanca, Maroc'}</span>
            <span className="font-bold text-slate-700">Dr. Dentolio</span>
          </div>
        </div>
      </div>
    </div>
  );
};
