// src/lib/chat/ExtensionService.ts

export interface ExtensionResponse {
  success: boolean;
  data?: {
    text: string;
    provider: string;
    timestamp: string;
  };
  error?: string;
}

class ExtensionService {
  private static instance: ExtensionService;
  private pendingRequests: Map<string, (response: ExtensionResponse) => void> = new Map();
  private isExtensionReady: boolean = false;

  private constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('message', this.handleMessage.bind(this));
      // Proactively check if extension is already there
      this.pingExtension();
    }
  }

  private pingExtension() {
    window.postMessage({
      source: 'parallel-ai-chat-web',
      type: 'PING_EXTENSION'
    }, window.location.origin);
  }

  public static getInstance(): ExtensionService {
    if (!ExtensionService.instance) {
      ExtensionService.instance = new ExtensionService();
    }
    return ExtensionService.instance;
  }

  private handleMessage(event: MessageEvent) {
    if (event.data?.source === 'parallel-ai-chat-extension') {
      const { type, payload, requestId } = event.data;

      if (type === 'EXTENSION_READY') {
        this.isExtensionReady = true;
        console.log('Browser Extension is ready');
        return;
      }

      if (requestId && this.pendingRequests.has(requestId)) {
        const resolve = this.pendingRequests.get(requestId);
        if (resolve) {
          resolve(payload);
          this.pendingRequests.delete(requestId);
        }
      }
    }
  }

  public async queryModel(provider: string, prompt: string): Promise<ExtensionResponse> {
    const requestId = Math.random().toString(36).substring(7);

    return new Promise((resolve) => {
      this.pendingRequests.set(requestId, resolve);

      window.postMessage({
        source: 'parallel-ai-chat-web',
        type: 'QUERY_LLM',
        requestId,
        payload: { provider, prompt }
      }, window.location.origin);

      // Timeout after 30 seconds
      setTimeout(() => {
        if (this.pendingRequests.has(requestId)) {
          this.pendingRequests.delete(requestId);
          resolve({ success: false, error: 'Request timed out' });
        }
      }, 30000);
    });
  }

  public checkExtensionStatus(): boolean {
    return this.isExtensionReady;
  }
}

export const extensionService = ExtensionService.getInstance();
