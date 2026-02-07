// src/content/chatgpt-proxy.js

/**
 * This script is injected into chatgpt.com.
 * It listens for messages from the extension's background worker
 * and executes fetch requests to the internal API from the page context.
 */

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'EXECUTE_PROXY_FETCH') {
    handleProxyFetch(request.payload, sendResponse);
    return true; // Keep channel open for async response
  }
});

async function handleProxyFetch(payload, sendResponse) {
  const { url, options } = payload;

  try {
    const response = await fetch(url, options);
    
    if (!response.ok) {
      sendResponse({ 
        success: false, 
        error: `Fetch failed with status ${response.status}`,
        status: response.status 
      });
      return;
    }

    // For now, handling non-streaming response as a fallback or for non-streamed requests
    if (!options.headers['Accept']?.includes('text/event-stream')) {
      const data = await response.json();
      sendResponse({ success: true, data });
    } else {
      // Streaming will be handled in Phase 2
      sendResponse({ success: false, error: "Streaming not yet implemented in proxy" });
    }
  } catch (error) {
    sendResponse({ success: false, error: error.message });
  }
}
