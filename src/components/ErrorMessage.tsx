import React from 'react';
import { AlertCircle, RefreshCw, Search, MapPin } from 'lucide-react';

interface ErrorMessageProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  onSearchFallback?: (cityName: string) => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  title = 'Unable to Load Weather',
  message,
  onRetry,
  onSearchFallback,
}) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl text-center max-w-lg mx-auto my-12 space-y-4">
      <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mx-auto text-rose-400">
        <AlertCircle className="w-8 h-8 animate-bounce" />
      </div>

      <h3 className="text-xl font-extrabold text-slate-100">{title}</h3>
      <p className="text-sm text-slate-400 leading-relaxed">{message}</p>

      <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
        {onRetry && (
          <button
            onClick={onRetry}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-semibold text-sm transition-all shadow-md shadow-sky-500/20"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Try Again</span>
          </button>
        )}

        {onSearchFallback && (
          <button
            onClick={() => onSearchFallback('London')}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-sm transition-all"
          >
            <MapPin className="w-4 h-4 text-sky-400" />
            <span>Switch to London</span>
          </button>
        )}
      </div>
    </div>
  );
};
