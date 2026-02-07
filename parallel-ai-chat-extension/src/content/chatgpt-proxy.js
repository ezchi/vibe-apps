// src/content/chatgpt-proxy.js

/**
 * This script is injected into chatgpt.com.
 * It listens for messages from the extension's background worker
 * and executes fetch requests to the internal API from the page context.
 */

console.log('ChatGPT Proxy Content Script Loaded');

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'PING') {
    sendResponse({ status: 'PONG' });
    return;
  }

  if (request.type === 'EXECUTE_PROXY_FETCH') {
    handleProxyFetch(request.payload, sendResponse);
    return true; // Keep channel open for async response
  }
});

async function handleProxyFetch(payload, sendResponse) {
  const { url, options } = payload;
  console.log('Proxying fetch to:', url);

  try {
    const response = await fetch(url, options);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Fetch failed:', response.status, errorText);
      sendResponse({ 
        success: false, 
        error: `Fetch failed with status ${response.status}`,
        status: response.status 
      });
      return;
    }

    if (options.headers['Accept']?.includes('text/event-stream')) {
      handleStreamingResponse(response, sendResponse);
    } else {
      const data = await response.json();
      sendResponse({ success: true, data });
    }
  } catch (error) {
    console.error('Proxy fetch error:', error);
    sendResponse({ success: false, error: error.message });
  }
}

async function handleStreamingResponse(response, sendResponse) {
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  try {
    // Notify background that streaming has started
    sendResponse({ success: true, streaming: true });

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop(); // Keep partial line in buffer

      for (const line of lines) {
        if (line.trim() === '') continue;
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') {
            chrome.runtime.sendMessage({ type: 'STREAM_FINISHED' });
            break;
          }

          try {
            const parsed = JSON.parse(data);
            const text = parsed.message?.content?.parts?.[0];
            if (text) {
              // Send stream chunk to background worker
              chrome.runtime.sendMessage({ 
                type: 'STREAM_CHUNK', 
                payload: { text, provider: 'ChatGPT' } 
              });
            }
          } catch (e) {
            // Ignore parse errors for partial/malformed lines
          }
        }
      }
    }
  } catch (error) {
    console.error('Streaming error:', error);
    chrome.runtime.sendMessage({ type: 'STREAM_ERROR', payload: error.message });
  }
}
