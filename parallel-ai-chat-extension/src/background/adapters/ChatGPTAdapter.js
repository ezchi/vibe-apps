// src/background/adapters/ChatGPTAdapter.js
import { BaseAdapter } from './BaseAdapter.js';

export class ChatGPTAdapter extends BaseAdapter {
  constructor() {
    super('ChatGPT', 'https://chatgpt.com');
  }

  /**
   * @param {string} prompt 
   * @param {Object} context { ensureTab, findTabByUrl }
   */
  async query(prompt, context) {
    try {
      console.log(`${this.name}: Ensuring proxy tab is ready...`);
      const tab = await context.ensureTab(this.baseUrl, `${this.baseUrl}/*`);
      
      console.log(`${this.name}: Sending proxied fetch request to tab ${tab.id}`);
      
      return new Promise((resolve, reject) => {
        const payload = {
          url: `${this.baseUrl}/backend-api/conversation`,
          options: {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'text/event-stream', // We want streaming
            },
            body: JSON.stringify({
              action: 'next',
              messages: [{
                id: crypto.randomUUID(),
                author: { role: 'user' },
                content: { content_type: 'text', parts: [prompt] },
                metadata: {}
              }],
              model: 'text-davinci-002-render-sha',
              parent_message_id: crypto.randomUUID(),
              timezone_offset_min: -480,
              history_and_training_disabled: false,
              arkose_token: null,
            })
          }
        };

        chrome.tabs.sendMessage(tab.id, { type: 'EXECUTE_PROXY_FETCH', payload }, (response) => {
          if (chrome.runtime.lastError) {
            reject(new Error(`Failed to communicate with proxy tab: ${chrome.runtime.lastError.message}`));
            return;
          }

          if (response && response.success) {
            // Non-streaming response handling (fallback)
            resolve(response.data);
          } else {
            reject(new Error(response?.error || 'Unknown error during proxied fetch'));
          }
        });
      });
    } catch (error) {
      console.error(`${this.name} Query Error:`, error);
      throw error;
    }
  }
}