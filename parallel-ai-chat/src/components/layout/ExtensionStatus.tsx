// src/components/layout/ExtensionStatus.tsx
import React from 'react';

interface ExtensionStatusProps {
  isReady: boolean;
  proxyReady?: Record<string, boolean>;
}

export const ExtensionStatus: React.FC<ExtensionStatusProps> = ({ isReady, proxyReady }) => {
  const chatGPTReady = proxyReady?.['ChatGPT'];

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs">
        <div className={`w-2 h-2 rounded-full ${isReady ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]'}`} />
        <span className="text-white/80 font-medium">
          {isReady ? 'Extension Connected' : 'Mock Mode'}
        </span>
      </div>
      
      {isReady && (
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs">
          <div className={`w-2 h-2 rounded-full ${chatGPTReady ? 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]' : 'bg-white/20'}`} />
          <span className="text-white/80 font-medium">
            {chatGPTReady ? 'ChatGPT Proxy Ready' : 'Finding Proxy...'}
          </span>
        </div>
      )}
    </div>
  );
};