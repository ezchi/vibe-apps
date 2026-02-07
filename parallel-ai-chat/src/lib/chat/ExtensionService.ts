// src/lib/chat/ExtensionService.ts

export interface ExtensionResponse {
  success: boolean;
  data?: {
    text: string;
    provider: string;
    timestamp: string;
  };
  streaming?: boolean;
  error?: string;
}

export interface StreamChunk {
  text: string;
  provider: string;
}

type StatusListener = (isReady: boolean, proxyReady?: Record<string, boolean>) => void;
type StreamListener = (chunk: StreamChunk) => void;

class ExtensionService {
  private static instance: ExtensionService;
  private pendingRequests: Map<string, (response: ExtensionResponse) => void> = new Map();
  private isExtensionReady: boolean = false;
  private proxyReady: Record<string, boolean> = {};
  private statusListeners: Set<StatusListener> = new Set();
  private streamListeners: Set<StreamListener> = new Set();

  private constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('message', this.handleMessage.bind(this));
      this.pingExtension();
    }
  }

  public static getInstance(): ExtensionService {
    if (!ExtensionService.instance) {
      ExtensionService.instance = new ExtensionService();
    }
    return ExtensionService.instance;
  }

  public onStatusChange(listener: StatusListener) {
    this.statusListeners.add(listener);
    listener(this.isExtensionReady, this.proxyReady);
    this.pingExtension();
    return () => this.statusListeners.delete(listener);
  }

  public onStreamUpdate(listener: StreamListener) {
    this.streamListeners.add(listener);
    return () => this.streamListeners.delete(listener);
  }

  private handleMessage(event: MessageEvent) {
    if (event.data?.source === 'parallel-ai-chat-extension') {
      const { type, payload, requestId } = event.data;

      if (type === 'EXTENSION_READY') {
        const wasReady = this.isExtensionReady;
        this.isExtensionReady = true;
        if (!wasReady) {
          this.statusListeners.forEach(listener => listener(true, this.proxyReady));
        }
        return;
      }

      if (type === 'PROXY_STATUS') {
        this.proxyReady[payload.provider] = payload.ready;
        this.statusListeners.forEach(listener => listener(this.isExtensionReady, this.proxyReady));
        return;
      }

      if (type === 'STREAM_CHUNK') {
        console.log('ExtensionService received chunk:', payload);
        this.streamListeners.forEach(listener => listener(payload as StreamChunk));
        return;
      }

      if (type === 'STREAM_FINISHED' || type === 'STREAM_ERROR') {
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

  public pingExtension() {
    if (typeof window !== 'undefined') {
      window.postMessage({
        source: 'parallel-ai-chat-web',
        type: 'PING_EXTENSION'
      }, window.location.origin);
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