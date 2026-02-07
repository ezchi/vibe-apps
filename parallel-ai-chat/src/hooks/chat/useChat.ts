import { useState, useCallback, useEffect } from 'react';
import { getMockResponse } from '@/lib/chat/mockChatService';
import { extensionService } from '@/lib/chat/ExtensionService';

export interface ChatResponse {
  content: string;
  isLoading: boolean;
  error?: string;
}

export interface ChatHistoryItem {
  timestamp: string;
  prompt: string;
  responses: Record<string, string>;
}

export const useChat = () => {
  const [activeModels, setActiveModels] = useState<string[]>(['ChatGPT', 'Gemini', 'DeepSeek']);
  const [history, setHistory] = useState<ChatHistoryItem[]>([]);
  const [isExtensionReady, setIsExtensionReady] = useState(false);
  const [proxyReady, setProxyReady] = useState<Record<string, boolean>>({});
  const [responses, setResponses] = useState<Record<string, ChatResponse>>(
    activeModels.reduce((acc, model) => ({
      ...acc,
      [model]: { content: '', isLoading: false }
    }), {})
  );

  useEffect(() => {
    const statusUnsubscribe = extensionService.onStatusChange((ready, proxies) => {
      setIsExtensionReady(ready);
      if (proxies) setProxyReady({ ...proxies });
    });

    const streamUnsubscribe = extensionService.onStreamUpdate((chunk) => {
      console.log('useChat hook received chunk for:', chunk.provider);
      setResponses(prev => {
        if (!prev[chunk.provider]) return prev;
        return {
          ...prev,
          [chunk.provider]: {
            ...prev[chunk.provider],
            content: prev[chunk.provider].content + chunk.text,
            isLoading: false
          }
        };
      });
    });

    return () => {
      statusUnsubscribe();
      streamUnsubscribe();
    };
  }, []);

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
    setResponses(prev => {
      const next = { ...prev };
      activeModels.forEach(model => {
        next[model] = { content: '', isLoading: true, error: undefined };
      });
      return next;
    });

    const newResponses: Record<string, string> = {};
    await Promise.all(
      activeModels.map(async (model) => {
        let content: string = '';
        let error: string | undefined;

        if (isExtensionReady) {
          console.log(`Sending query to ${model} via extension...`);
          const result = await extensionService.queryModel(model, message);
          console.log(`Received initial response from ${model} extension:`, result);
          
          if (result.success) {
            // Note: Handle nested data if worker wrapped it
            const data: any = result.data;
            if (result.streaming || data?.streaming) {
              console.log(`${model} confirmed streaming mode.`);
              return;
            } else if (result.data) {
              content = result.data.text;
            }
          } else {
            error = result.error || 'Failed to get response from extension';
          }
        } else {
          content = await getMockResponse(model, message);
        }

        newResponses[model] = content;
        setResponses(prev => ({
          ...prev,
          [model]: { content, isLoading: false, error }
        }));
      })
    );

    setHistory(prev => [...prev, {
      timestamp: new Date().toISOString(),
      prompt: message,
      responses: newResponses
    }]);
  }, [activeModels, isExtensionReady]);

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
    exportHistory,
    isExtensionReady,
    proxyReady
  };
};
