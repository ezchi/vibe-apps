# Technology Stack: Vibe-Apps

## Overview
The first application in the Vibe-Apps collection is a web-based Parallel AI Chat, optimized for deployment on GitHub Pages.

## Core Frameworks
- **Language:** TypeScript / JavaScript
- **Frontend Framework:** React with Next.js (Static Export for GitHub Pages)
- **Deployment:** GitHub Pages (Static Hosting)

## LLM Integration (Parallel Chat)
- **Strategy:** Browser-based session leveraging.
- **Implementation:** Due to browser security on static sites, this will be designed as a **Web Application that integrates with a companion Browser Extension** (or utilizes CORS-bypass techniques) to interact with LLM web interfaces without API keys.

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
