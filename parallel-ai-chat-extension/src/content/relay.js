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

    // Relay the message to the background service worker
    chrome.runtime.sendMessage({ type, payload, requestId }, (response) => {
      // Send the response back to the Web Application
      window.postMessage({
        source: 'parallel-ai-chat-extension',
        type: `${type}_RESPONSE`,
        payload: response,
        requestId
      }, window.location.origin);
    });
  }
});

// Notify the web app that the extension is ready
window.postMessage({
  source: 'parallel-ai-chat-extension',
  type: 'EXTENSION_READY'
}, window.location.origin);
