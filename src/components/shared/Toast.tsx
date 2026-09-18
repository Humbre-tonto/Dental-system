import React from 'react';
import { useDentalStore } from '../../store/useDentalStore';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useDentalStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col space-y-2.5 max-w-sm w-full">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-start justify-between p-4 rounded-xl shadow-lg border text-xs font-semibold backdrop-blur-md transition-all ${
            toast.type === 'success'
              ? 'bg-slate-900/95 text-white border-slate-700'
              : toast.type === 'error'
                ? 'bg-red-900/95 text-white border-red-700'
                : 'bg-blue-900/95 text-white border-blue-700'
          }`}
        >
          <div className="flex items-start space-x-2.5">
            {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />}
            {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />}
            {toast.type === 'info' && <Info className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />}
            <span className="leading-snug">{toast.text}</span>
          </div>

          <button
            onClick={() => removeToast(toast.id)}
            className="text-slate-400 hover:text-white p-0.5 ml-2"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
