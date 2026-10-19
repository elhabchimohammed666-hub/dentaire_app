import React, { useState } from 'react';
import { useDental } from '../../context/DentalContext';
import {
  Image,
  Sliders,
  ZoomIn,
  Eye,
  Camera,
  Upload,
  Calendar,
  Sparkles,
  Layers
} from 'lucide-react';

export const ImagingTab = () => {
  const { currentPatient } = useDental();
  const [sliderPosition, setSliderPosition] = useState(50);
  const [viewMode, setViewMode] = useState('slider'); // 'slider' or 'side-by-side'

  // Realistic sample dental imaging data matching video demo
  const sampleRadios = [
    {
      id: 1,
      title: 'Panoramique Dentaire Numérique (Orthopantomogramme)',
      date: '2026-09-05',
      type: 'Panoramique',
      beforeImg: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=800',
      afterImg: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=800',
      notes: 'Visualisation canine incluse 38 et contrôle des racines molaires'
    },
    {
      id: 2,
      title: 'Rétro-alvéolaire Dent 38 & 36',
      date: '2026-09-10',
      type: 'Rétro-alvéolaire',
      beforeImg: 'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&q=80&w=800',
      afterImg: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=800',
      notes: 'Contrôle post-extraction et cicatrisation osseuse'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center border border-teal-100">
              <Camera className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-800">
                Imagerie Médicale & Radiographies
              </h2>
              <p className="text-xs text-slate-400">
                Radiographies panoramiques, rétro-alvéolaires et comparatif dynamique Avant / Après
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode(viewMode === 'slider' ? 'side-by-side' : 'slider')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700"
            >
              <Sliders className="w-3.5 h-3.5 text-teal-600" />
              <span>{viewMode === 'slider' ? 'Vue Côte à Côte' : 'Curseur Interactif'}</span>
            </button>
            <button className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-teal-600 hover:bg-teal-700 text-white shadow-xs">
              <Upload className="w-4 h-4" />
              <span>Importer Radio</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Interactive Comparison (Matching Video 00:21-00:23) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-teal-600" />
            <span>Comparaison Avant / Après (Cas Clinique)</span>
          </h3>
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-rose-100 text-rose-700 border border-rose-200">
              AVANT
            </span>
            <span className="text-xs text-slate-400 font-bold">VS</span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-emerald-100 text-emerald-700 border border-emerald-200">
              APRÈS
            </span>
          </div>
        </div>

        {viewMode === 'slider' ? (
          /* Interactive Split Slider */
          <div className="relative w-full h-80 sm:h-96 rounded-2xl overflow-hidden select-none border border-slate-200 bg-slate-900 shadow-inner">
            {/* After Image (Background) */}
            <img
              src={sampleRadios[0].afterImg}
              alt="Après traitement"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute top-4 right-4 z-10 px-3 py-1 rounded-full text-xs font-black bg-emerald-600/90 text-white backdrop-blur-xs shadow-md">
              APRÈS TRAITEMENT
            </div>

            {/* Before Image (Clipped by slider position) */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${sliderPosition}%` }}
            >
              <img
                src={sampleRadios[0].beforeImg}
                alt="Avant traitement"
                className="absolute inset-0 w-full h-full object-cover max-w-none"
                style={{ width: '100%', minWidth: '100%' }}
              />
              <div className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full text-xs font-black bg-rose-600/90 text-white backdrop-blur-xs shadow-md">
                AVANT TRAITEMENT
              </div>
            </div>

            {/* Divider Line & Handle */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize z-20 flex items-center justify-center shadow-lg"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="w-8 h-8 rounded-full bg-white text-slate-800 flex items-center justify-center shadow-xl border-2 border-teal-500 text-xs font-bold">
                ↔
              </div>
            </div>

            {/* Range Input controller */}
            <input
              type="range"
              min="0"
              max="100"
              value={sliderPosition}
              onChange={(e) => setSliderPosition(Number(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30"
            />
          </div>
        ) : (
          /* Side-by-side mode */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 h-80">
              <img
                src={sampleRadios[0].beforeImg}
                alt="Avant"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-black bg-rose-600 text-white shadow-md">
                AVANT TRAITEMENT
              </div>
            </div>
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 h-80">
              <img
                src={sampleRadios[0].afterImg}
                alt="Après"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-black bg-emerald-600 text-white shadow-md">
                APRÈS TRAITEMENT
              </div>
            </div>
          </div>
        )}

        <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-between text-xs text-slate-500">
          <span>Glissez la barre centrale pour comparer l'évolution esthétique et radiologique</span>
          <span className="font-semibold text-slate-700">Canine incluse & Greffe osseuse</span>
        </div>
      </div>
    </div>
  );
};
