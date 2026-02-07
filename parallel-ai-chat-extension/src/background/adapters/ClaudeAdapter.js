// src/background/adapters/ClaudeAdapter.js
import { BaseAdapter } from './BaseAdapter.js';

export class ClaudeAdapter extends BaseAdapter {
  constructor() {
    super('Claude', 'https://claude.ai');
  }

  async query(prompt) {
    try {
      // Simulation of Claude internal API call
      const response = await this.fetchWithSession(`${this.baseUrl}/api/organizations/org_id/chat_conversations/conv_id/completion`, {
        method: 'POST',
        body: JSON.stringify({ prompt })
      });

      const data = await response.json();
      return {
        text: data.completion || 'Claude response placeholder.',
        provider: this.name
      };
    } catch (error) {
      console.error(`Claude Query Error:`, error);
      throw error;
    }
  }
}
