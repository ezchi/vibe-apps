// src/background/adapters/DeepSeekAdapter.js
import { BaseAdapter } from './BaseAdapter.js';

export class DeepSeekAdapter extends BaseAdapter {
  constructor() {
    super('DeepSeek', 'https://chat.deepseek.com');
  }

  async query(prompt) {
    try {
      // Simulation of DeepSeek internal API call
      const response = await this.fetchWithSession(`${this.baseUrl}/api/chat`, {
        method: 'POST',
        body: JSON.stringify({ message: prompt })
      });

      const data = await response.json();
      return {
        text: data.content || 'DeepSeek response placeholder.',
        provider: this.name
      };
    } catch (error) {
      console.error(`DeepSeek Query Error:`, error);
      throw error;
    }
  }
}
