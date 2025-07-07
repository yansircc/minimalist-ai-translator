# CLAUDE.md

**Use 'bun' as default package manager.**

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an AI-powered translation web application built with Next.js 15, React 19, and TypeScript. It provides a minimalist interface for translating text using various AI models (OpenAI, Google Gemini, Groq, DeepSeek).

## Development Commands

```bash
# Start development server with Turbo
bun dev

# Build for production
bun run build

# Run production server
bun run start

# Type checking and linting
bun check

# Run Cypress E2E tests
bun cy:open
```

## Architecture

The application follows Next.js App Router conventions with a clean separation of concerns:

- **API Route**: `/api/translate` - Handles AI translation requests with streaming responses
- **State Management**: Unified Zustand store in `src/stores/app-store.ts` managing all application state
- **Type System**: Centralized type definitions in `src/types/index.ts`
- **Constants**: Configuration and constants in `src/utils/constants.ts`
- **Components**: Split between `ui/` (reusable UI components) and `translation/` (feature-specific components)
- **Error Handling**: Global error boundaries and translation-specific error fallbacks
- **Main Interface**: `src/components/translation-widget.tsx` contains the primary translation UI logic

## Key Implementation Details

### Translation Flow
1. Auto-detects language: Chinese ↔ English, other languages → Chinese
2. Uses streaming responses via Vercel AI SDK
3. Automatically copies results to clipboard
4. 30-second timeout for API requests

### AI Model Integration
The app supports user-provided API configurations:
- Users provide their own API keys (stored in localStorage)
- Supports OpenAI and custom OpenAI-compatible providers
- API configuration managed in `src/stores/app-store.ts`
- No server-side API keys required

### Environment Variables
Optional API key for development (in `src/env.js`):
- `OPENAI_API_KEY` (optional - users provide their own)

## Code Style

This project uses Biome for linting and formatting. Configuration is in `biome.jsonc`. The project enforces:
- Tailwind CSS class sorting
- Strict TypeScript with no unchecked indexed access
- ESM modules (type: "module" in package.json)

## Testing

E2E tests are written in Cypress and located in `cypress/e2e/`. Tests cover:
- UI functionality (theme toggle, basic elements)
- Core translation features
- Model selection
- Responsive design

## Important Patterns

1. **Unified State Management**: All state is managed through a single `useAppStore` with slices for different concerns
2. **API Configuration**: Users configure their own API keys through a settings dialog
   - Settings stored in localStorage
   - Supports OpenAI and custom providers
   - API validation endpoint at `/api/validate`
3. **Custom Hooks**: Translation logic is centralized in `src/hooks/use-translation.ts`
4. **Keyboard Handling**: Enter to translate, Shift+Enter for newline (see `utils/keyboard.ts`)
5. **Error Handling**: 
   - Global `ErrorBoundary` component wraps the entire app
   - `TranslationErrorFallback` for translation-specific errors
   - Toast notifications for user feedback (success/error/info types)
6. **Type Safety**: 
   - Centralized types in `src/types/index.ts`
   - Strict TypeScript configuration
   - No unchecked indexed access
7. **Performance**: 
   - React Compiler enabled (experimental)
   - Streaming responses for real-time translation
   - Optimized scroll handling for long texts