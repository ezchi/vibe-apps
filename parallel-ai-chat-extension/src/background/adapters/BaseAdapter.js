// src/background/adapters/BaseAdapter.js

/**
 * Base class for all LLM adapters.
 */
export class BaseAdapter {
  constructor(name, baseUrl) {
    this.name = name;
    this.baseUrl = baseUrl;
  }

  /**
   * Main entry point to send a query to the LLM.
   * @param {string} prompt 
   * @param {Object} context 
   * @returns {Promise<Object>} 
   */
  async query(prompt, context = {}) {
    throw new Error('Method "query" must be implemented by subclass');
  }

  /**
   * Helper to fetch data from the provider.
   * Can be overridden for more complex fetching logic.
   */
  async fetchWithSession(url, options = {}) {
    // Default fetch will use the browser's active session/cookies
    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        // Common headers for session-based requests might go here
      }
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        throw new Error(`Authentication failed for ${this.name}. Please ensure you are logged in at ${this.baseUrl}`);
      }
      throw new Error(`Request failed for ${this.name} with status ${response.status}`);
    }

    return response;
  }
}
