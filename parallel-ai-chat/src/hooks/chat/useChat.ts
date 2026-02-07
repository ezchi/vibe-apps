import { useState, useCallback } from 'react';
import { getMockResponse } from '@/lib/chat/mockChatService';

export interface ChatResponse {
  content: string;
  isLoading: boolean;
}

export const useChat = () => {
  const [activeModels, setActiveModels] = useState<string[]>(['ChatGPT', 'Gemini', 'DeepSeek']);
  const [responses, setResponses] = useState<Record<string, ChatResponse>>(
    activeModels.reduce((acc, model) => ({
      ...acc,
      [model]: { content: '', isLoading: false }
    }), {})
  );

  const addModel = useCallback((model: string) => {
    setActiveModels(prev => [...prev, model]);
    setResponses(prev => ({
      ...prev,
      [model]: { content: '', isLoading: false }
    }));
  }, []);

  const removeModel = useCallback((model: string) => {
    setActiveModels(prev => prev.filter(m => m !== model));
    setResponses(prev => {
      const newResponses = { ...prev };
      delete newResponses[model];
      return newResponses;
    });
  }, []);

  const sendMessage = useCallback(async (message: string) => {
    // Set all active models to loading
    setResponses(prev => {
      const next = { ...prev };
      activeModels.forEach(model => {
        next[model] = { ...next[model], isLoading: true };
      });
      return next;
    });

    // Request responses from all models
    await Promise.all(
      activeModels.map(async (model) => {
        const content = await getMockResponse(model, message);
        setResponses(prev => ({
          ...prev,
          [model]: { content, isLoading: false }
        }));
      })
    );
  }, [activeModels]);

  return {
    activeModels,
    responses,
    addModel,
    removeModel,
    sendMessage
  };
};
