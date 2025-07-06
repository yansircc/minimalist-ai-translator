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
- **State Management**: Zustand stores in `src/stores/` for translation state, clipboard, and model selection
- **Components**: Split between `ui/` (reusable UI components) and `translation/` (feature-specific components)
- **Main Interface**: `src/components/translation-widget.tsx` contains the primary translation UI logic

## Key Implementation Details

### Translation Flow
1. Auto-detects language: Chinese ↔ English, other languages → Chinese
2. Uses streaming responses via Vercel AI SDK
3. Automatically copies results to clipboard
4. 30-second timeout for API requests

### AI Model Integration
The app supports multiple AI providers configured in `src/app/api/translate/route.ts`:
- OpenAI: GPT-4o-mini
- Google: Gemini 1.5 Flash  
- Groq: Llama3-8b
- DeepSeek: DeepSeek Coder

### Environment Variables
Required API keys (validated in `src/env.js`):
- `OPENAI_API_KEY`
- `GOOGLE_GENERATIVE_AI_API_KEY`
- `GROQ_API_KEY`
- `DEEPSEEK_API_KEY`

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

1. **Custom Hooks**: Translation logic is centralized in `src/hooks/use-translation.tsx`
2. **Keyboard Handling**: Enter to translate, Shift+Enter for newline (see `translation-widget.tsx`)
3. **Theme Support**: Dark/light mode via next-themes
4. **Error Boundaries**: API errors are handled with user-friendly messages
5. **Type Safety**: Extensive use of TypeScript for all components and utilities