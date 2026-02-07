import { useState, useCallback } from 'react';
import { getMockResponse } from '@/lib/chat/mockChatService';

export interface ChatResponse {
  content: string;
  isLoading: boolean;
}

export interface ChatHistoryItem {
  timestamp: string;
  prompt: string;
  responses: Record<string, string>;
}

export const useChat = () => {
  const [activeModels, setActiveModels] = useState<string[]>(['ChatGPT', 'Gemini', 'DeepSeek']);
  const [history, setHistory] = useState<ChatHistoryItem[]>([]);
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
    const newResponses: Record<string, string> = {};
    await Promise.all(
      activeModels.map(async (model) => {
        const content = await getMockResponse(model, message);
        newResponses[model] = content;
        setResponses(prev => ({
          ...prev,
          [model]: { content, isLoading: false }
        }));
      })
    );

    setHistory(prev => [...prev, {
      timestamp: new Date().toISOString(),
      prompt: message,
      responses: newResponses
    }]);
  }, [activeModels]);

  const exportHistory = useCallback(() => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(history, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `chat_history_${new Date().toISOString()}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }, [history]);

  return {
    activeModels,
    responses,
    history,
    addModel,
    removeModel,
    sendMessage,
    exportHistory
  };
};
