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

  if (type === 'CHECK_PROXY_STATUS') {
    checkAllProxies();
  }

  // Relay stream messages from proxy scripts to web app scripts
  if (type === 'STREAM_CHUNK' || type === 'STREAM_FINISHED' || type === 'STREAM_ERROR') {
    relayToWebApp(type, payload, requestId);
  }
});

// Notify web app if a proxy tab is closed
chrome.tabs.onRemoved.addListener((tabId) => {
  relayToWebApp('STREAM_ERROR', { 
    text: 'Proxy tab was closed. Stream interrupted.', 
    provider: 'ChatGPT' // For now, assuming ChatGPT proxy
  });
});

async function relayToWebApp(type, payload, requestId) {
  const tabs = await chrome.tabs.query({
    url: [
      "https://ezchi.github.io/vibe-apps/*",
      "http://localhost:3000/*",
      "http://127.0.0.1:3000/*"
    ]
  });

  for (const tab of tabs) {
    chrome.tabs.sendMessage(tab.id, { type, payload, requestId });
  }
}

async function checkAllProxies() {
  const chatGPTTab = await findTabByUrl('https://chatgpt.com/*');
  if (chatGPTTab) {
    relayToWebApp('PROXY_STATUS', { provider: 'ChatGPT', ready: true });
  }
}

async function handleQueryLLM(payload, sendResponse) {
  const { provider, prompt } = payload;
  const adapter = adapters[provider.toLowerCase()];

  if (!adapter) {
    sendResponse({ success: false, error: `No adapter found for provider: ${provider}` });
    return;
  }

  try {
    const context = { ensureTab, findTabByUrl };
    const response = await adapter.query(prompt, context);
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
  console.log(`Searching for tab with pattern: ${urlPattern}`);
  const tabs = await chrome.tabs.query({ url: urlPattern });
  console.log(`Found ${tabs.length} matching tabs`);
  return tabs[0];
}

export async function ensureTab(url, urlPattern) {
  console.log(`Ensuring tab exists for: ${url}`);
  let tab = await findTabByUrl(urlPattern);
  if (!tab) {
    console.log(`Tab not found. Creating new pinned tab for ${url}`);
    tab = await chrome.tabs.create({ url, active: false, pinned: true });
    console.log(`Tab created with ID: ${tab.id}. Waiting for 'complete' status...`);
    // Wait for tab to load
    await new Promise((resolve) => {
      chrome.tabs.onUpdated.addListener(function listener(tabId, info) {
        if (tabId === tab.id && info.status === 'complete') {
          console.log(`Tab ${tabId} load complete.`);
          chrome.tabs.onUpdated.removeListener(listener);
          resolve(tab);
        }
      });
    });
  }
  
  console.log(`Reusing existing tab with ID: ${tab.id}`);
  relayToWebApp('PROXY_STATUS', { provider: 'ChatGPT', ready: true });
  return tab;
}

// Expose for debugging
self.ensureTab = ensureTab;
self.findTabByUrl = findTabByUrl;
