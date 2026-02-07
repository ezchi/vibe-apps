# Implementation Plan: Real LLM Integration via Browser Extension

## Phase 1: Browser Extension Foundation
- [x] Task: Create extension directory structure (parallel-ai-chat-extension) b14063b
- [x] Task: Initialize manifest.json (v3) with necessary permissions (host_permissions) 2147a8c
- [ ] Task: Implement Content Script for `window.postMessage` communication relay
- [ ] Task: Implement Background Service Worker to receive messages from Content Script
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Extension Foundation' (Protocol in workflow.md)

## Phase 2: Model Adapters (Extension Side)
- [ ] Task: Create standardized `BaseAdapter` interface for LLM interactions
- [ ] Task: Implement `ChatGPTAdapter` with logic for session-based requests
- [ ] Task: Implement `GeminiAdapter` with logic for session-based requests
- [ ] Task: Implement `ClaudeAdapter` with logic for session-based requests
- [ ] Task: Implement `DeepSeekAdapter` with logic for session-based requests
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Model Adapters' (Protocol in workflow.md)

## Phase 3: Web App Communication Layer
- [ ] Task: Create `ExtensionService` in `src/lib/chat/` to manage `postMessage` lifecycle
- [ ] Task: Write Tests: Verify `ExtensionService` handles outgoing requests and incoming responses correctly
- [ ] Task: Implement `ExtensionService`
- [ ] Task: Write Tests: Verify `useChat` hook integrates with `ExtensionService` correctly
- [ ] Task: Refactor `useChat` to allow switching between `mockChatService` and `ExtensionService`
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Web App Communication' (Protocol in workflow.md)

## Phase 4: UI Updates & Error Handling
- [ ] Task: Implement `ExtensionStatus` component to show if the companion extension is active
- [ ] Task: Update `ModelResponseCard` to display specific error messages (e.g., "Please log in to Claude")
- [ ] Task: Perform end-to-end manual testing with all 4 models
- [ ] Task: Conductor - User Manual Verification 'Phase 4: UI & Final Integration' (Protocol in workflow.md)
