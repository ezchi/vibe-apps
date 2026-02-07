// src/content/chatgpt-proxy.js

/**
 * This script is injected into chatgpt.com.
 * It uses DOM automation to input text and click send.
 */

console.log('ChatGPT DOM Automation Script Loaded');

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'PING') {
    sendResponse({ status: 'PONG' });
    return;
  }

  if (request.type === 'EXECUTE_PROXY_FETCH') {
    handleDomAction(request.payload, sendResponse);
    return true; 
  }
});

async function handleDomAction(payload, sendResponse) {
  const { options } = payload;
  const body = JSON.parse(options.body);
  const prompt = body.messages[0].content.parts[0];

  console.log('Automating prompt:', prompt);

  try {
    const textarea = document.querySelector('#prompt-textarea');
    if (!textarea) throw new Error('Could not find prompt textarea');

    textarea.innerHTML = `<p>${prompt}</p>`;
    textarea.dispatchEvent(new Event('input', { bubbles: true }));
    
    await new Promise(r => setTimeout(r, 500));

    const sendButton = document.querySelector('[data-testid="send-button"]');
    if (!sendButton) throw new Error('Could not find send button');
    
    sendButton.click();

    sendResponse({ success: true, streaming: true });
    
    observeResponse();

  } catch (error) {
    console.error('DOM Automation Error:', error);
    sendResponse({ success: false, error: error.message });
  }
}

function observeResponse() {
  let lastTextLength = 0;
  
  const observer = new MutationObserver(() => {
    const messages = document.querySelectorAll('[data-message-author-role="assistant"]');
    const lastMessage = messages[messages.length - 1];

    if (lastMessage) {
      // Get text content (ignoring artifacts if possible, simplified here)
      const currentText = lastMessage.innerText || "";
      
      if (currentText.length > lastTextLength) {
        const newChunk = currentText.slice(lastTextLength);
        lastTextLength = currentText.length;
        
        chrome.runtime.sendMessage({ 
          type: 'STREAM_CHUNK', 
          payload: { text: newChunk, provider: 'ChatGPT' } 
        });
      }

      const stopButton = document.querySelector('[aria-label="Stop generating"]');
      const isGenerating = !!stopButton;

      if (!isGenerating && currentText.length > 0) {
        // Wait a small moment to ensure we got everything
        setTimeout(() => {
            chrome.runtime.sendMessage({ type: 'STREAM_FINISHED' });
            observer.disconnect();
        }, 1000);
      }
    }
  });

  observer.observe(document.body, { childList: true, subtree: true, characterData: true });
}