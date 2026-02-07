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
    const textarea = document.querySelector('#prompt-textarea') || 
                     document.querySelector('div[contenteditable="true"]') ||
                     document.querySelector('textarea');
    
    if (!textarea) {
      throw new Error('Could not find prompt textarea');
    }

    if (textarea.tagName === 'TEXTAREA') {
      textarea.value = prompt;
    } else {
      textarea.innerHTML = `<p>${prompt}</p>`;
    }
    
    textarea.dispatchEvent(new Event('input', { bubbles: true }));
    textarea.dispatchEvent(new Event('change', { bubbles: true }));
    
    await new Promise(r => setTimeout(r, 1000));

    const sendButton = document.querySelector('[data-testid="send-button"]') ||
                       document.querySelector('button[aria-label="Send prompt"]') ||
                       document.querySelector('button:has(svg)');
    
    if (!sendButton) throw new Error('Could not find send button');
    
    console.log('Clicking send button...');
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
  console.log('Started observing response...');
  
  const observer = new MutationObserver(() => {
    // Look for assistant message containers
    const messages = document.querySelectorAll('.markdown.prose, [data-message-author-role="assistant"]');
    const lastMessage = messages[messages.length - 1];

    if (lastMessage) {
      const currentText = lastMessage.innerText || "";
      
      if (currentText.length > lastTextLength) {
        const newChunk = currentText.slice(lastTextLength);
        lastTextLength = currentText.length;
        
        console.log('Detected chunk, sending to background:', newChunk.slice(0, 20) + '...');
        chrome.runtime.sendMessage({ 
          type: 'STREAM_CHUNK', 
          payload: { text: newChunk, provider: 'ChatGPT' } 
        });
      }

      const stopButton = document.querySelector('[aria-label="Stop generating"]') || 
                         document.querySelector('[data-testid="stop-button"]');
      const isGenerating = !!stopButton;

      if (!isGenerating && currentText.length > 0) {
        console.log('Stream finished detected via DOM');
        setTimeout(() => {
            chrome.runtime.sendMessage({ type: 'STREAM_FINISHED' });
            observer.disconnect();
        }, 1000);
      }
    }
  });

  observer.observe(document.body, { childList: true, subtree: true, characterData: true });
}