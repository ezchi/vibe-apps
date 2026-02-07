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
  const [responses, setResponses] = useState<Record<string, ChatResponse>>(
    activeModels.reduce((acc, model) => ({
      ...acc,
      [model]: { content: '', isLoading: false }
    }), {})
  );

  useEffect(() => {
    const statusUnsubscribe = extensionService.onStatusChange((ready) => {
      setIsExtensionReady(ready);
    });

    const streamUnsubscribe = extensionService.onStreamUpdate((chunk) => {
      setResponses(prev => {
        if (!prev[chunk.provider]) return prev;
        return {
          ...prev,
          [chunk.provider]: {
            ...prev[chunk.provider],
            content: prev[chunk.provider].content + chunk.text,
            isLoading: false // Stream chunk means it's active and not starting anymore
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
    // Set all active models to loading and CLEAR previous content for new stream
    setResponses(prev => {
      const next = { ...prev };
      activeModels.forEach(model => {
        next[model] = { content: '', isLoading: true, error: undefined };
      });
      return next;
    });

    // Request responses from all models
    const newResponses: Record<string, string> = {};
    await Promise.all(
      activeModels.map(async (model) => {
        let content: string = '';
        let error: string | undefined;

        if (isExtensionReady) {
          const result = await extensionService.queryModel(model, message);
          if (result.success) {
            if (result.streaming) {
              // Content will be updated via onStreamUpdate listener
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

    // Note: History won't perfectly capture the final streamed content here 
    // unless we update it after streaming finishes. For now, we'll keep it simple.
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
    isExtensionReady
  };
};