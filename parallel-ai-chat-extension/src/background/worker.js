// src/background/worker.js
import { ChatGPTAdapter } from './adapters/ChatGPTAdapter.js';
import { GeminiAdapter } from './adapters/GeminiAdapter.js';
import { ClaudeAdapter } from './adapters/ClaudeAdapter.js';
import { DeepSeekAdapter } from './adapters/DeepSeekAdapter.js';

/**
 * Background Service Worker handles requests to LLM providers.
 */

const adapters = {
  chatgpt: new ChatGPTAdapter(),
  gemini: new GeminiAdapter(),
  claude: new ClaudeAdapter(),
  deepseek: new DeepSeekAdapter()
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const { type, payload, requestId } = request;

  console.log(`Received message: ${type}`, payload);

  if (type === 'QUERY_LLM') {
    handleQueryLLM(payload, sendResponse);
    return true; // Keep message channel open for async response
  }

  if (type === 'PING') {
    sendResponse({ status: 'PONG' });
  }
});

async function handleQueryLLM(payload, sendResponse) {
  const { provider, prompt } = payload;
  const adapter = adapters[provider.toLowerCase()];

  if (!adapter) {
    sendResponse({ success: false, error: `No adapter found for provider: ${provider}` });
    return;
  }

  try {
    const response = await adapter.query(prompt);
    sendResponse({ success: true, data: response });
  } catch (error) {
    console.error(`Error querying ${provider}:`, error);
    sendResponse({ success: false, error: error.message });
  }
}

/**
 * Tab Management Helpers
 */

export async function findTabByUrl(urlPattern) {
  const tabs = await chrome.tabs.query({ url: urlPattern });
  return tabs[0];
}

export async function ensureTab(url, urlPattern) {
  let tab = await findTabByUrl(urlPattern);
  if (!tab) {
    tab = await chrome.tabs.create({ url, active: false, pinned: true });
    // Wait for tab to load
    return new Promise((resolve) => {
      chrome.tabs.onUpdated.addListener(function listener(tabId, info) {
        if (tabId === tab.id && info.status === 'complete') {
          chrome.tabs.onUpdated.removeListener(listener);
          resolve(tab);
        }
      });
    });
  }
  return tab;
}

// Expose for debugging
self.ensureTab = ensureTab;
self.findTabByUrl = findTabByUrl;
