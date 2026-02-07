import React from 'react';

interface ModelResponseCardProps {
  modelName: string;
  content: string;
  isLoading?: boolean;
}

export default function ModelResponseCard({ modelName, content, isLoading }: ModelResponseCardProps) {
  return (
    <div className="flex flex-col h-full bg-white/40 dark:bg-black/40 backdrop-blur-lg rounded-2xl border border-white/20 shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:bg-white/50 dark:hover:bg-black/50">
      <div className="p-4 border-b border-white/10 bg-white/10 dark:bg-black/10 flex items-center justify-between">
        <h3 className="font-semibold text-slate-800 dark:text-slate-100">{modelName}</h3>
      </div>
      <div className="p-4 flex-1 overflow-y-auto text-slate-700 dark:text-slate-200 leading-relaxed">
        {isLoading ? (
          <div role="status" className="animate-pulse space-y-3">
             <div className="h-4 bg-slate-400/30 rounded w-3/4"></div>
             <div className="h-4 bg-slate-400/30 rounded w-1/2"></div>
             <div className="h-4 bg-slate-400/30 rounded w-5/6"></div>
          </div>
        ) : (
          <div className="whitespace-pre-wrap">{content}</div>
        )}
      </div>
    </div>
  );
}
