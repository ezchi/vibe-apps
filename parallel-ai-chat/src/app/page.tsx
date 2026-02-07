'use client';

import React, { useState } from 'react';
import ChatLayout from '@/components/layout/ChatLayout';
import ChatInput from '@/components/chat/ChatInput';
import ModelResponseCard from '@/components/chat/ModelResponseCard';
import { ExtensionStatus } from '@/components/layout/ExtensionStatus';
import { useChat } from '@/hooks/chat/useChat';

export default function Home() {
  const { activeModels, responses, sendMessage, addModel, removeModel, exportHistory, history, isExtensionReady } = useChat();
  const [isManagementOpen, setIsManagementOpen] = useState(false);

  const availableModels = ['ChatGPT', 'Gemini', 'DeepSeek', 'Claude', 'Mistral', 'Llama'];

  return (
    <div className="flex flex-col h-screen bg-slate-100 dark:bg-slate-900">
      {/* Header */}
      <header className="p-4 flex justify-between items-center glass dark:glass-dark z-10">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Parallel AI Chat
          </h1>
          <ExtensionStatus isReady={isExtensionReady} />
        </div>
        <div className="flex gap-2">
          {history.length > 0 && (
            <button 
              onClick={exportHistory}
              className="px-4 py-2 rounded-lg bg-green-600/20 hover:bg-green-600/30 transition-colors text-green-700 dark:text-green-400 text-sm font-medium border border-green-600/20"
            >
              Export JSON
            </button>
          )}
          <button 
            onClick={() => setIsManagementOpen(!isManagementOpen)}
            className="px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors text-slate-800 dark:text-slate-100 text-sm font-medium border border-white/20"
          >
            {isManagementOpen ? 'Close Settings' : 'Manage Models'}
          </button>
        </div>
      </header>

      {/* Model Management Overlay */}
      {isManagementOpen && (
        <div className="p-4 glass dark:glass-dark border-b border-white/10 animate-in slide-in-from-top duration-300">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-sm font-semibold mb-3 text-slate-600 dark:text-slate-400 uppercase tracking-wider">Active Models</h2>
            <div className="flex flex-wrap gap-2">
              {availableModels.map(model => {
                const isActive = activeModels.includes(model);
                return (
                  <button
                    key={model}
                    onClick={() => isActive ? removeModel(model) : addModel(model)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                      isActive 
                        ? 'bg-blue-600 text-white shadow-md' 
                        : 'bg-white/10 text-slate-600 dark:text-slate-400 hover:bg-white/20'
                    }`}
                  >
                    {model} {isActive ? '×' : '+'}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-hidden relative">
        <ChatLayout>
          {activeModels.map(model => (
            <ModelResponseCard
              key={model}
              modelName={model}
              content={responses[model]?.content || `${model} is ready. Send a message to get started.`}
              isLoading={responses[model]?.isLoading}
            />
          ))}
          {activeModels.length === 0 && (
            <div className="col-span-full flex items-center justify-center h-full text-slate-500 italic">
              No models selected. Click "Manage Models" to add some.
            </div>
          )}
        </ChatLayout>
      </div>
      
      <div className="z-10">
        <ChatInput onSend={sendMessage} />
      </div>
    </div>
  );
}