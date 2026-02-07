# Specification: Refine ChatGPT Adapter for Successful Streaming Connection

## Overview
This track aims to fix the authentication and communication issues encountered with the initial ChatGPT integration. We will shift from a background-only fetch strategy to a "Content Script Proxying" strategy. The browser extension will leverage an open (or automatically opened) tab on `chatgpt.com` to execute requests, ensuring that the browser's native session, cookies, and headers are perfectly utilized. We will also implement support for real-time response streaming (SSE).

## Functional Requirements
- **Content Script Proxying:**
    - Implement a new `ProxyScript` that is injected into `chatgpt.com`.
    - The background worker will send prompts to this `ProxyScript` instead of fetching directly.
    - The `ProxyScript` will execute the internal API call using `fetch` from the context of the ChatGPT page.
- **Automatic Tab Management:**
    - The extension will check for active `chatgpt.com` tabs.
    - If no tab is found, the extension will automatically open a new, pinned, and potentially hidden/minimized tab to `https://chatgpt.com`.
- **Streaming Support:**
    - The `ProxyScript` will handle the Server-Sent Events (SSE) stream from ChatGPT's internal API.
    - Partial response updates will be streamed back from the `ProxyScript` -> `Background Worker` -> `Web App`.
- **Web App UI Updates:**
    - Update `ExtensionService` to handle `STREAM_UPDATE` message types.
    - Update `useChat` hook to update the UI incrementally as stream chunks arrive.

## Functional Success Criteria
- [ ] Extension successfully detects and/or opens a ChatGPT tab.
- [ ] Prompt is sent via the ChatGPT tab's context.
- [ ] Web App receives and displays the response in real-time (streaming).
- [ ] No "Authentication Failed" error occurs as long as the user is logged into ChatGPT in the proxy tab.

## Non-Functional Requirements
- **Performance:** Ensure the proxying overhead is minimal.
- **Reliability:** Handle cases where the proxy tab is closed or navigated away during a request.

## Out of Scope
- Implementing similar proxying for Gemini, Claude, or DeepSeek (these will follow in subsequent tracks).
- Modifying the styling of the ChatGPT web interface.
