# Specification: Real LLM Integration via Browser Extension

## Overview
This track involves connecting the Parallel AI Chat application to real LLM interfaces (ChatGPT, Gemini, Claude, DeepSeek) using a "session-leveraging" strategy. This avoids the need for user API keys by utilizing the user's existing browser sessions. To bypass CORS and security restrictions of a static web application, we will develop a companion browser extension that acts as a sophisticated adapter.

## Functional Requirements
- **Browser Extension Development:**
    - Create a browser extension (Chrome/Edge/Brave compatible).
    - Implement a Background Service Worker to handle model interactions.
    - Implement a Content Script to facilitate communication between the Web App and the Extension.
- **Model-Specific Adapters (Inside Extension):**
    - **ChatGPT Adapter:** Logic to send prompts and receive responses from chatgpt.com.
    - **Gemini Adapter:** Logic for gemini.google.com.
    - **Claude Adapter:** Logic for claude.ai.
    - **DeepSeek Adapter:** Logic for chat.deepseek.com.
    - Standardize all model outputs into a consistent JSON format for the Web App.
- **Web App Integration:**
    - Implement a communication layer in the React app to send/receive messages via `window.postMessage`.
    - Update `useChat` hook (or create a new service) to replace the `mockChatService` with the real extension-based service.
    - Implement "Connection Status" UI to indicate if the extension is installed and active.

## Non-Functional Requirements
- **Security:** Ensure the extension only listens to messages from the trusted Web App domain.
- **Privacy:** No user data or session cookies should be sent to any external server other than the respective LLM providers.
- **Resilience:** Handle scenarios where the user is not logged into a specific LLM service with clear error messaging.

## Acceptance Criteria
- [ ] User can send a prompt from the Web App and receive real responses from ChatGPT, Gemini, Claude, and DeepSeek simultaneously.
- [ ] The Web App correctly detects and displays the status of the Browser Extension.
- [ ] No API keys are required for any of the integrated models.
- [ ] The system handles session timeouts or "not logged in" states gracefully for each model.

## Out of Scope
- Automatic login/credential management (User must be logged in manually in their browser).
- Supporting models beyond the initial four (ChatGPT, Gemini, Claude, DeepSeek).
- Persisting chat history in the extension (History remains in the Web App's IndexedDB).
