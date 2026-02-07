// src/content/relay.js

/**
 * The content script acts as a relay between the Web Application
 * and the Extension's Background Service Worker.
 */

// Listen for messages from the Web Application (window.postMessage)
window.addEventListener('message', (event) => {
  // Security: Only handle messages from our own window
  if (event.source !== window) return;

  // Check if the message is intended for the extension
  if (event.data && event.data.source === 'parallel-ai-chat-web') {
    const { type, payload, requestId } = event.data;

    if (type === 'PING_EXTENSION') {
      window.postMessage({
        source: 'parallel-ai-chat-extension',
        type: 'EXTENSION_READY'
      }, window.location.origin);
      return;
    }

    // Relay the message to the background service worker
    chrome.runtime.sendMessage({ type, payload, requestId }, (response) => {
      // Send the response back to the Web Application (for non-streaming)
      if (response) {
        window.postMessage({
          source: 'parallel-ai-chat-extension',
          type: `${type}_RESPONSE`,
          payload: response,
          requestId
        }, window.location.origin);
      }
    });
  }
});

// Listen for messages from the Background Worker
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const { type, payload, requestId } = request;

  // Relay messages (like stream chunks) to the Web Application
  if (type === 'STREAM_CHUNK' || type === 'STREAM_FINISHED' || type === 'STREAM_ERROR') {
    window.postMessage({
      source: 'parallel-ai-chat-extension',
      type: type,
      payload: payload,
      requestId: requestId // May be undefined for broadcast streams
    }, window.location.origin);
  }
});

// Notify the web app that the extension is ready
window.postMessage({
  source: 'parallel-ai-chat-extension',
  type: 'EXTENSION_READY'
}, window.location.origin);
