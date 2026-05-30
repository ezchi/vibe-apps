# Project Constitution

## Governing Principles

1. **Client-Side Only.** All functionality runs entirely in the browser. No server-side processing, no API keys, no external data transmission. User data never leaves the machine.
2. **Minimal Setup.** The application must be runnable with `npm install` followed by `npm run dev`. No additional system dependencies beyond Node.js.
3. **Spec-Driven Development.** Features are defined by formal specifications in `specs/`. Implementation must satisfy the acceptance criteria in the spec — no more, no less.
4. **Correctness Over Cleverness.** Simple, readable code that works correctly beats clever abstractions. Avoid premature optimization and speculative generalization.
5. **Accessibility by Default.** All interactive elements must be keyboard-navigable, properly labeled, and meet WCAG AA contrast requirements. Touch targets minimum 44×44px.

## Technology Stack

| Layer            | Technology                          | Version   |
|------------------|-------------------------------------|-----------|
| Framework        | Next.js (App Router)                | 16.x      |
| Language         | TypeScript (strict mode)            | 5.x       |
| UI Library       | React                               | 19.x      |
| Styling          | Tailwind CSS                        | 4.x       |
| Testing          | Vitest + React Testing Library      | 4.x       |
| Linting          | ESLint (eslint-config-next)         | 9.x       |
| PDF Generation   | TBD (client-side, e.g. html2pdf.js or jsPDF) | —   |
| Package Manager  | npm                                 | —         |
| Node Target      | ES2017                              | —         |
| Fonts            | Geist, Geist Mono (via next/font)   | —         |

### Project Structure

```
parallel-ai-chat/          # Next.js web application
  src/
    app/                    # App Router pages and layouts
    components/             # React components (by domain)
    hooks/                  # Custom React hooks (by domain)
    lib/                    # Utility/service modules (by domain)
parallel-ai-chat-extension/ # Chrome extension (Manifest V3)
specs/                      # Feature specifications
.steel/                     # Steel-Kit workflow state
```

## Coding Standards

### TypeScript
- Strict mode enabled (`"strict": true` in tsconfig).
- Use `@/*` path aliases for imports from `src/`.
- Prefer named exports over default exports for components and utilities.
- Use `'use client'` directive only on components that require client-side interactivity.

### React & Components
- Functional components only. No class components.
- Co-locate test files next to their source files (e.g., `ChatInput.tsx` / `ChatInput.test.tsx`).
- Organize components by domain subdirectory (e.g., `components/chat/`, `components/layout/`).
- Keep components focused — one responsibility per component.

### Styling
- Tailwind CSS utility classes as the primary styling approach.
- No inline `style` attributes unless dynamically computed values require them.
- Mobile-first responsive design: base styles target smallest viewport, expand with `md:` and `lg:` breakpoints.

### Testing
- Test runner: Vitest with jsdom environment.
- Use React Testing Library for component tests — test behavior, not implementation.
- Test files use `.test.ts` / `.test.tsx` extension.
- Run tests with `npm run test` from the `parallel-ai-chat/` directory.

## Development Guidelines

### Branching
- `main` is the primary branch.
- Feature branches follow the pattern: `spec/<spec-id>-<short-description>`.

### Commits
- Commit messages use the Steel-Kit convention: `steel(<stage>): <description> [iteration N]`.
- Each Steel-Kit stage produces its own commit.

### Code Review
- Steel-Kit Forge-Gauge loop serves as the review mechanism: Forge (Claude) produces, Gauge (Gemini) reviews.
- All blocking issues from Gauge must be resolved before proceeding to the next stage.

### Data Storage
- All persistent user data uses `localStorage`. No cookies, no IndexedDB unless justified.
- Template/state serialization uses JSON.

## Constraints

### Performance
- PDF export must complete within 3 seconds for invoices with up to 50 line items.
- Totals recalculation must complete within 100ms of any line-item change.

### Compatibility
- Browser support: latest versions of Chrome, Firefox, Safari, and Edge.
- Responsive from 280px (Pixel Fold closed) to 2560px (external monitor).

### Security
- No API keys, credentials, or secrets stored or transmitted.
- All user input rendered in the UI must be escaped to prevent XSS.
- No external network requests from the invoice application.

### Monetary Calculations
- All monetary values displayed with exactly two decimal places.
- Comma thousands separators (English format: `1,234.56`).
- Calculation order: Subtotal → Discount (Subtotal × %) → Tax ((Subtotal − Discount) × %) → Total.
