import React from 'react';

interface ModelResponseCardProps {
  modelName: string;
  content: string;
  isLoading?: boolean;
  error?: string;
}

export default function ModelResponseCard({ modelName, content, isLoading, error }: ModelResponseCardProps) {
  return (
    <div className={`flex flex-col h-full glass dark:glass-dark rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl border ${error ? 'border-red-500/50' : 'border-white/10'}`}>
      <div className={`p-4 border-b border-white/10 flex items-center justify-between ${error ? 'bg-red-500/10' : 'bg-white/10 dark:bg-black/10'}`}>
        <h3 className="font-semibold text-slate-800 dark:text-slate-100">{modelName}</h3>
        {error && (
          <span className="text-[10px] font-bold uppercase tracking-wider text-red-500 bg-red-500/10 px-2 py-0.5 rounded">
            Error
          </span>
        )}
      </div>
      <div className="p-4 flex-1 overflow-y-auto text-slate-700 dark:text-slate-200 leading-relaxed">
        {isLoading ? (
          <div role="status" className="animate-pulse space-y-3">
             <div className="h-4 bg-slate-400/30 rounded w-3/4"></div>
             <div className="h-4 bg-slate-400/30 rounded w-1/2"></div>
             <div className="h-4 bg-slate-400/30 rounded w-5/6"></div>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-2">
            <div className="p-3 rounded-full bg-red-500/10 text-red-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <p className="text-red-500 font-medium">{error}</p>
            <p className="text-sm text-slate-500">Try logging in at the model's website.</p>
          </div>
        ) : (
          <div className="whitespace-pre-wrap">{content}</div>
        )}
      </div>
    </div>
  );
}