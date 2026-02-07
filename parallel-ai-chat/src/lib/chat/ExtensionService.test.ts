import { describe, it, expect, vi, beforeEach } from 'vitest';
import { extensionService } from './ExtensionService';

describe('ExtensionService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset private state if necessary, or just rely on new requestIds
  });

  it('sends a postMessage to the window when queryModel is called', async () => {
    const postMessageSpy = vi.spyOn(window, 'postMessage');
    
    // We don't await here because it will timeout without a mock response
    extensionService.queryModel('ChatGPT', 'Hello');

    expect(postMessageSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        source: 'parallel-ai-chat-web',
        type: 'QUERY_LLM',
        payload: { provider: 'ChatGPT', prompt: 'Hello' }
      }),
      window.location.origin
    );
  });

  it('resolves the promise when a matching response is received', async () => {
    const mockResponse = {
      success: true,
      data: {
        text: 'Hello from extension',
        provider: 'ChatGPT',
        timestamp: new Date().toISOString()
      }
    };

    // Capture the requestId from the postMessage call
    let capturedRequestId: string = '';
    vi.spyOn(window, 'postMessage').mockImplementation((message: any) => {
      capturedRequestId = message.requestId;
    });

    const queryPromise = extensionService.queryModel('ChatGPT', 'Hello');

    // Simulate response from extension
    window.dispatchEvent(new MessageEvent('message', {
      data: {
        source: 'parallel-ai-chat-extension',
        type: 'QUERY_LLM_RESPONSE',
        requestId: capturedRequestId,
        payload: mockResponse
      }
    }));

    const result = await queryPromise;
    expect(result).toEqual(mockResponse);
  });

  it('times out if no response is received', async () => {
    vi.useFakeTimers();
    
    const queryPromise = extensionService.queryModel('ChatGPT', 'Hello');
    
    vi.advanceTimersByTime(31000);
    
    const result = await queryPromise;
    expect(result.success).toBe(false);
    expect(result.error).toBe('Request timed out');
    
    vi.useRealTimers();
  });
});
