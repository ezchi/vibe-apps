// src/background/adapters/ChatGPTAdapter.js
import { BaseAdapter } from './BaseAdapter.js';

export class ChatGPTAdapter extends BaseAdapter {
  constructor() {
    super('ChatGPT', 'https://chatgpt.com');
  }

  async query(prompt) {
    try {
      // Note: In a real-world scenario, we would piggyback on the active session.
      // This often involves calling an internal API endpoint like /backend-api/conversation.
      // For this implementation, we simulate the request structure.
      
      const response = await this.fetchWithSession(`${this.baseUrl}/backend-api/conversation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Note: Other headers like 'auth-token' might be needed, 
          // but we expect the browser session to handle cookies/tokens automatically.
        },
        body: JSON.stringify({
          action: 'next',
          messages: [{
            id: crypto.randomUUID(),
            author: { role: 'user' },
            content: { content_type: 'text', parts: [prompt] },
            metadata: {}
          }],
          model: 'text-davinci-002-render-sha', // Example model
          parent_message_id: crypto.randomUUID(),
          timezone_offset_min: -480,
          history_and_training_disabled: false,
          arkose_token: null,
        })
      });

      // Parsing the stream/response for ChatGPT is complex. 
      // This is a placeholder for the parsing logic.
      const data = await response.json();
      return {
        text: data.message?.content?.parts?.[0] || 'Response received but format was unexpected.',
        provider: this.name
      };
    } catch (error) {
      console.error(`ChatGPT Query Error:`, error);
      throw error;
    }
  }
}
