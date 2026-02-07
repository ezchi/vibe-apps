// src/background/worker.js

/**
 * Background Service Worker handles requests to LLM providers.
 */

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

  try {
    // Placeholder for actual adapter logic (to be implemented in Phase 2)
    const response = {
      text: `Placeholder response for ${provider}. Prompt: ${prompt}`,
      provider: provider,
      timestamp: new Date().toISOString()
    };

    sendResponse({ success: true, data: response });
  } catch (error) {
    sendResponse({ success: false, error: error.message });
  }
}
