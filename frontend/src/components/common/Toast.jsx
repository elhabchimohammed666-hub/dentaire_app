import React from 'react';
import { useDental } from '../../context/DentalContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const Toast = () => {
  const { toast } = useDental();

  if (!toast) return null;

  const isError = toast.type === 'error';
  const isInfo = toast.type === 'info';

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-5 duration-200">
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl text-xs font-bold border ${
          isError
            ? 'bg-rose-600 text-white border-rose-700 shadow-rose-600/20'
            : isInfo
            ? 'bg-blue-600 text-white border-blue-700 shadow-blue-600/20'
            : 'bg-emerald-600 text-white border-emerald-700 shadow-emerald-600/20'
        }`}
      >
        {isError ? (
          <AlertCircle className="w-5 h-5 shrink-0" />
        ) : isInfo ? (
          <Info className="w-5 h-5 shrink-0" />
        ) : (
          <CheckCircle2 className="w-5 h-5 shrink-0" />
        )}
        <span>{toast.message}</span>
      </div>
    </div>
  );
};
