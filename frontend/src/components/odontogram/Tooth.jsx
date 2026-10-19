import React from 'react';

export const Tooth = ({ number, isUpper, isSelected, treatments = [], onClick }) => {
  // Check if this tooth has any active treatments and get the most recent color
  const toothTreatment = treatments.find((t) => t.teeth?.includes(number));
  const hasTreatment = !!toothTreatment;
  const fillColor = toothTreatment?.color || (isSelected ? '#0d9488' : '#ffffff');
  const textColor = isSelected ? 'text-teal-700 font-extrabold' : hasTreatment ? 'text-purple-700 font-bold' : 'text-slate-600';

  return (
    <div
      onClick={() => onClick(number)}
      className="flex flex-col items-center cursor-pointer group transition-all transform hover:-translate-y-1 select-none"
      title={`Dent FDI ${number}${toothTreatment ? ` - ${toothTreatment.actName} (${toothTreatment.status})` : ''}`}
    >
      {/* Top Number for Upper Teeth */}
      {isUpper && (
        <span className={`text-[11px] mb-1.5 transition-colors ${textColor}`}>
          {number}
        </span>
      )}

      {/* SVG Tooth representation */}
      <div
        className={`relative w-8 sm:w-9 md:w-10 h-16 sm:h-20 flex items-center justify-center p-1 rounded-xl transition-all ${
          isSelected
            ? 'ring-2 ring-teal-500 bg-teal-50/70 shadow-sm'
            : hasTreatment
            ? 'ring-1 ring-purple-300 bg-purple-50/40'
            : 'hover:bg-slate-100/70'
        }`}
      >
        <svg viewBox="0 0 40 80" className="w-full h-full drop-shadow-xs">
          {/* If upper tooth: root points UP, crown is DOWN */}
          {isUpper ? (
            <g>
              {/* Root */}
              <path
                d="M14 38 C 12 25, 10 12, 16 4 C 18 2, 22 2, 24 4 C 30 12, 28 25, 26 38 Z"
                fill={hasTreatment ? fillColor : '#f1f5f9'}
                stroke={hasTreatment ? '#7e22ce' : '#cbd5e1'}
                strokeWidth="1.5"
                opacity={hasTreatment ? 0.8 : 0.9}
              />
              {/* Crown */}
              <path
                d="M10 38 C 8 48, 8 68, 14 74 C 18 78, 22 78, 26 74 C 32 68, 32 48, 30 38 Z"
                fill={hasTreatment ? fillColor : isSelected ? '#ccfbf1' : '#ffffff'}
                stroke={hasTreatment ? '#7e22ce' : isSelected ? '#0d9488' : '#94a3b8'}
                strokeWidth="2"
              />
              {/* Center fissure / occlusal detail */}
              <circle
                cx="20"
                cy="56"
                r="3.5"
                fill={hasTreatment ? '#ffffff' : '#f8fafc'}
                stroke={hasTreatment ? '#7e22ce' : '#cbd5e1'}
                strokeWidth="1"
              />
            </g>
          ) : (
            /* If lower tooth: crown is UP, root points DOWN */
            <g>
              {/* Crown */}
              <path
                d="M10 42 C 8 32, 8 12, 14 6 C 18 2, 22 2, 26 6 C 32 12, 32 32, 30 42 Z"
                fill={hasTreatment ? fillColor : isSelected ? '#ccfbf1' : '#ffffff'}
                stroke={hasTreatment ? '#7e22ce' : isSelected ? '#0d9488' : '#94a3b8'}
                strokeWidth="2"
              />
              {/* Center fissure */}
              <circle
                cx="20"
                cy="24"
                r="3.5"
                fill={hasTreatment ? '#ffffff' : '#f8fafc'}
                stroke={hasTreatment ? '#7e22ce' : '#cbd5e1'}
                strokeWidth="1"
              />
              {/* Root */}
              <path
                d="M14 42 C 12 55, 10 68, 16 76 C 18 78, 22 78, 24 76 C 30 68, 28 55, 26 42 Z"
                fill={hasTreatment ? fillColor : '#f1f5f9'}
                stroke={hasTreatment ? '#7e22ce' : '#cbd5e1'}
                strokeWidth="1.5"
                opacity={hasTreatment ? 0.8 : 0.9}
              />
            </g>
          )}
        </svg>

        {/* Small treatment indicator dot if multiple */}
        {hasTreatment && (
          <span className="absolute bottom-1 right-1 w-2 h-2 rounded-full bg-purple-600 ring-1 ring-white" />
        )}
      </div>

      {/* Bottom Number for Lower Teeth */}
      {!isUpper && (
        <span className={`text-[11px] mt-1.5 transition-colors ${textColor}`}>
          {number}
        </span>
      )}
    </div>
  );
};
