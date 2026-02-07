# Technology Stack: Vibe-Apps

## Overview
The first application in the Vibe-Apps collection is a web-based Parallel AI Chat, optimized for deployment on GitHub Pages.

## Core Frameworks
- **Language:** TypeScript / JavaScript
- **Frontend Framework:** React with Next.js (Static Export for GitHub Pages)
- **Deployment:** GitHub Pages (Static Hosting)

## LLM Integration (Parallel Chat)
- **Strategy:** Browser-based session leveraging.
- **Implementation:** Web Application integrates with a **Companion Browser Extension** (Manifest V3) using a `window.postMessage` relay protocol.
- **Extension Architecture:** Background Service Worker with provider-specific adapters for internal API interaction/DOM parsing.

## Styling & UI
- **Styling Engine:** Tailwind CSS
- **Design Pattern:** Glassmorphism (backdrop-blur, transparency, vibrant utility-based gradients).

## Testing
- **Framework:** Vitest
- **Library:** React Testing Library

## Data Persistence
- **Storage:** IndexedDB / LocalStorage (Web-native and persistent within the user's browser).

## Project Structure
- **Independent App Directories:** Each application in the collection resides in its own standalone directory at the root of the repository.
